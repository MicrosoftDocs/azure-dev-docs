---
title: "Tutorial: Migrate WebSphere Application Server to Azure Virtual Machines with high availability and disaster recovery"
description: Shows how to deploy WebSphere Application Server to Azure Virtual Machines with high availability and disaster recovery.
author: KarlErickson
ms.author: jiangma
ms.topic: tutorial
ms.date: 02/26/2024
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-websphere, devx-track-javaee-was, devx-track-javaee-was-vm, migration-java, devx-track-extended-java
---

# Tutorial: Migrate WebSphere Application Server to Azure Virtual Machines with high availability and disaster recovery

This tutorial shows you a simple and effective way to implement high availability and disaster recovery (HA/DR) for Java using WebSphere Application Server on Azure Virtual Machines (VMs). The solution illustrates how to achieve a low Recovery Time Objective (RTO) and Recovery Point Objective (RPO) using a simple database driven Jakarta EE application running on WebSphere Application Server. HA/DR is a complex topic, with many possible solutions. The best solution depends on your unique requirements. For other ways to implement HA/DR, see the resources at the end of this article.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Use Azure optimized best practices to achieve high availability and disaster recovery.
> * Set up a Microsoft Azure SQL Database failover group in paired regions.
> * Set up the primary WebSphere cluster on Azure VMs.
> * Set up disaster recovery for the cluster using Azure Site Recovery.
> * Set up an Azure Traffic Manager.
> * Test failover from primary to secondary.

The following diagram illustrates the architecture you build:

<!-- Diagram source https://github.com/Azure-Samples/azure-cafe/blob/main/diagrams/websphere-on-vms-ha-dr-solution-architecture.pptx -->
:::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/solution-architecture.png" alt-text="Diagram of the solution architecture of WebSphere on Azure VMs with high availability and disaster recovery." lightbox="media/migrate-websphere-to-vms-with-ha-dr/solution-architecture.png" border="false":::

Azure Traffic Manager checks the health of your regions and routes the traffic accordingly to the application tier. The primary region has a full deployment of the WebSphere cluster. After the primary region is protected, the secondary region is restored during the failover using Azure Site Recovery. As a result, the primary region is actively servicing network requests from the users. The secondary region is passive and activated to receive traffic only when the primary region experiences a service disruption. Azure Traffic Manager detects the health of the app deployed in the IBM HTTP Server to implement the conditional routing. The geo-failover RTO of the application tier depends on the time for shutting down the primary cluster, restoring the secondary cluster, and starting VMs and running the secondary WebSphere cluster. The RPO depends on the replication policy of Azure Site Recovery and Azure SQL Database because the cluster data is stored and replicated in the local storage of the VMs and application data is persisted and replicated in the Azure SQL Database failover group.

The preceding diagram shows **Primary region** and **Secondary region** as the two regions comprising the HA/DR architecture. These regions need to be Azure paired regions. For more information on paired regions, see [/azure/reliability/cross-region-replication-azure](Azure cross-region replication). The article uses **East US** and **West **US** as the two regions, but they can be any paired regions that make sense for your scenario. For the list of region pairings, see [Azure paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions).

The database tier consists of an Azure SQL Database failover group with a primary server and a secondary server. The read/write listener endpoint always points to the primary server and is connected to the WebSphere cluster in each region. A geo-failover switches all secondary databases in the group to the primary role. For geo-failover RPO and RTO of Azure SQL Database, see [Overview of Business Continuity](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview?view=azuresql-db&preserve-view=true).

This tutorial was written with Azure Site Recovery and Azure SQL Database service because the tutorial relies on the HA features of these services. Other database choices are possible, but the HA features of whatever database you chose must be considered.

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* Make sure you have the `Contributor` role in the subscription. You can verify the assignment by following the steps in [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal).
* Prepare a local machine with Windows, Linux, or macOS installed.
* Install and set up [Git](/devops/develop/git/install-and-set-up-git).
* Install a Java SE implementation, version 17 or later (for example, [the Microsoft build of OpenJDK](/java/openjdk)).
* Install [Maven](https://maven.apache.org/download.cgi), version 3.9.3 or later.

## Set up an Azure SQL Database failover group in paired regions

In this section, you create an Azure SQL Database failover group in paired regions for use with your WebSphere clusters and app. In a later section, you configure WebSphere to store its session data to this database. This practice references [Creating a table for session persistence](https://www.ibm.com/docs/en/was-nd/9.0.5?topic=persistence-creating-table-session).

First, create the primary Azure SQL Database by following the Azure portal steps in [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal). Follow the steps up to, but not including **Clean up resources**. Use the following directions as you go through the article, then return to this article after you create and configure the Azure SQL Database:

1. When you reach the section [Create a single database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal#create-a-single-database), use the following steps:
   1. In step 4 for creating new resource group, write down the **Resource group name** value - for example, *myResourceGroup*.
   1. In step 5 for database name, write down the **Database name** value - for example, *mySampleDatabase*.
   1. In step 6 for creating the server, use the following steps:
      1. Fill in a unique server name - for example, *sqlserverprimary-mjg022624*.
      1. For **Location**, select **(US) East US**.
      1. For **Authentication method**, select **Use SQL authentication**.
      1. Write down the **Server admin login** value - for example, *azureuser*.
      1. Write down the **Password** value.
   1. In step 8, for **Workload environment**, select **Development**. Look at the description and consider other options for your workload.
   1. In step 11, for **Backup storage redundancy**, select **Locally-redundant backup storage**. Consider other options for your backups. For more information, see the [Backup storage redundancy](/azure/azure-sql/database/automated-backups-overview?view=azuresql-db&preserve-view=true#backup-storage-redundancy) section of [Automated backups in Azure SQL Database](/azure/azure-sql/database/automated-backups-overview?view=azuresql-db&preserve-view=true).
   1. In step 14, in the **Firewall rules** configuration, for **Allow Azure services and resources to access this server**, select **Yes**.

1. When you reach the section [Query the database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal#query-the-database), use the following steps:
   1. In step 3, enter your **SQL authentication** server admin sign-in information to sign in.

      > [!NOTE]
      > If sign-in fails with an error message similar to **Client with IP address 'xx.xx.xx.xx' is not allowed to access the server**, select **Allowlist IP xx.xx.xx.xx on server \<your-sqlserver-name\>** at the end of the error message. Wait until the server firewall rules complete updating, then select **OK** again.

   1. After you run the sample query in step 5, clear the editor and enter the following query, then select **Run** again.

      ```sql
      CREATE TABLE sessions (
         ID VARCHAR(128) NOT NULL,
         PROPID VARCHAR(128) NOT NULL,
         APPNAME VARCHAR(128) NOT NULL,
         LISTENERCNT SMALLINT,
         LASTACCESS BIGINT,
         CREATIONTIME BIGINT,
         MAXINACTIVETIME INT,
         USERNAME VARCHAR(256),
         SMALL VARBINARY(MAX),
         MEDIUM VARCHAR(MAX),
         LARGE VARBINARY(MAX)
      );
      ```

      After a successful run, you should see the message **Query succeeded: Affected rows: 0**.

      The database table *sessions* is used for storing session data for your WebSphere app. The WebSphere cluster data including transaction logs is persisted to local storage of VMs where the cluster is deployed.

Then, create an Azure SQL Database failover group by following the Azure portal steps in [Configure a failover group for Azure SQL Database](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db). You just need the following sections: [Create failover group](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#create-failover-group) and [Test planned failover](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#test-planned-failover). Use the following steps as you go through the article, then return to this article after you create and configure the Azure SQL Database failover group:

1. When you reach the section [Create failover group](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#create-failover-group), use the following steps:
   1. In step 5 for creating the failover group, enter and write down the unique failover group name - for example, *failovergroup-mjg022624*. 
   1. In step 5 for configuring the server, select the option to create a new secondary server and then use the following steps:
      1. Enter a unique server name - for example, *sqlserversecondary-mjg022624*.
      1. Enter the same server admin and password as your primary server.
      1. For **Location**, select **(US) West US**.
      1. Make sure **Allow Azure services to access server** is selected.
   1. In step 5 for configuring the **Databases within the group**, select the database you created in the primary server - for example, *mySampleDatabase*.

1. After you complete all the steps in the section [Test planned failover](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#test-planned-failover), keep the failover group page open and use it for the failover test of the WebSphere clusters later.

## Set up the primary WebSphere cluster on Azure VMs

In this section, you create the primary WebSphere clusters on Azure VMs using the [IBM WebSphere Application Server Cluster on Azure VMs](https://aka.ms/twas-cluster-portal) offer. The secondary cluster is restored from the primary cluster during the failover using Azure Site Recovery later.

### Deploy the primary WebSphere cluster

First, open the [IBM WebSphere Application Server Cluster on Azure VMs](https://aka.ms/twas-cluster-portal) offer in your browser and select **Create**. You should see the **Basics** pane of the offer.

Use the following steps to fill out the **Basics** pane:

1. Ensure that the value shown for **Subscription** is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a unique value for the resource group - for example, *was-cluster-eastus-mjg022624*.
1. Under **Instance details**, for **Region**, select **East US**.
1. For **Deploy with existing WebSphere entitlement or with evaluation license?**, select **Evaluation** for this tutorial. You can also select **Entitled** and provide your IBMid credential.
1. Check **I have read and accept the IBM License Agreement.**.
1. Leave the defaults for other fields.
1. Select **Next** to go to the **Cluster configuration** pane.

:::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/portal-basics.png" alt-text="Screenshot of the Azure portal that shows the IBM WebSphere Application Server Cluster on Azure VMs Basics pane." lightbox="media/migrate-websphere-to-vms-with-ha-dr/portal-basics.png":::

Use the following steps to fill out the **Cluster configuration** pane:

1. For **Password for VM administrator**, provide a password.
1. For **Password for WebSphere administrator**, provide a password. Write down the username and password for **WebSphere administrator**.
1. Leave the defaults for other fields.
1. Select **Next** to go to the **Load balancer** pane.

:::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/portal-cluster-config.png" alt-text="Screenshot of the Azure portal that shows the IBM WebSphere Application Server Cluster on Azure VMs Cluster configuration pane." lightbox="media/migrate-websphere-to-vms-with-ha-dr/portal-cluster-config.png":::

Use the following steps to fill out the **Load balancer** pane:

1. For **Password for VM administrator**, provide a password.
1. For **Password for Password for IBM HTTP Server administrator**, provide a password.
1. Leave the defaults for other fields.
1. Select **Next** to go to the **Networking** pane.

:::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/portal-load-balancer.png" alt-text="Screenshot of the Azure portal that shows the IBM WebSphere Application Server Cluster on Azure VMs Load balancer pane." lightbox="media/migrate-websphere-to-vms-with-ha-dr/portal-load-balancer.png":::

You should see all fields pre-populated with the defaults in the **Networking** pane. Select **Next** to go to the **Database** pane.

:::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/portal-networking.png" alt-text="Screenshot of the Azure portal that shows the IBM WebSphere Application Server Cluster on Azure VMs Networking pane." lightbox="media/migrate-websphere-to-vms-with-ha-dr/portal-networking.png":::

The following steps show you how to fill out the **Database** pane:

1. For **Connect to database?**, select **Yes**.
1. For **Choose database type**, select **Microsoft SQL Server** .
1. For **JNDI Name**, enter *jdbc/WebSphereCafeDB*.
1. For **Data source connection string (jdbc:sqlserver://\<host\>:\<port\>;database=\<database\>)**, replace the placeholders with the values you wrote down from the preceding section for the failover group for the Azure SQL Database - for example, *jdbc:sqlserver://failovergroup-mjg022624.database.windows.net:1433;database=mySampleDatabase*.
1. For **Database username**, enter the server admin sign-in name and the failover group name you wrote down from the preceding section - for example, *azureuser@failovergroup-mjg022624*.
   > [!NOTE]
   > Be extra careful to use the correct database server hostname and database username for the failover group, instead of the server hostname and username from the primary or backup database. By using the values from the failover group, you are, in effect, telling WebSphere to talk to the failover group, but, as far as WebSphere is concerned, it's just a normal database connection.
1. Enter the server admin sign-in password that you wrote down before for **Database Password**. Enter the same value for **Confirm password**.
1. Leave the defaults for the other fields.
1. Select **Review + create**.
1. Wait until **Running final validation...** successfully completes, then select **Create**.

:::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/portal-database.png" alt-text="Screenshot of the Azure portal that shows the IBM WebSphere Application Server Cluster on Azure VMs Database pane." lightbox="media/migrate-websphere-to-vms-with-ha-dr/portal-database.png":::

After a while, you should see the **Deployment** page where **Deployment is in progress** is displayed.

> [!NOTE]
> If you see any problems during **Running final validation...**, fix them and try again.

Depending on network conditions and other activity in your selected region, the deployment can take up to 25 minutes to complete. After that, you should see the text **Your deployment is complete** displayed on the deployment page.

### Verify the deployment of the cluster

You deployed an IBM HTTP Server (IHS) and a WebSphere Deployment Manager (Dmgr) in the cluster. The IHS acts as load balancer for all application servers in the cluster. The Dmgr provides a web console for cluster configuration.

Use the following steps to verify whether the IHS and Dmgr console work before moving to next step:

1. Return to the **Deployment** page, then select **Outputs**.
1. Copy the value of the property **ihsConsole**. Open that URL in a new browser tab. You should see a welcome page of the IHS without any error message. If you don't, you must troubleshoot and resolve the issue before you continue. Keep the console open and use it for verifying the app deployment of the cluster later.
   :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/ihs-welcome-screen.png" alt-text="IHS welcoms screen." lightbox="media/migrate-websphere-to-vms-with-ha-dr/ihs-welcome-screen.png" border="false":::
1. Copy and write down the value of the property **adminSecuredConsole**. Open it in a new browser tab. Accept the browser warning for the self-signed TLS certificate. Don't go to production using a self-signed TLS certificate.

   You should see the sign-in page of the **WebSphere Integrated Solutions Console**. Sign in to the console with the user name and password for WebSphere administrator you wrote down before. If you aren't able to sign in, you must troubleshoot and resolve the issue before you continue. Keep the console open and use it for further configuration of the WebSphere cluster later.

Use the following steps to write down the name of the public IP address of the IHS. You use it when you set up the Azure Traffic Manager later.

1. Open the resource group where your cluster is deployed - for example, select **Overview** to switch back to the Overview pane of the deployment page. Then, select **Go to resource group**.
1. In the table of resources, find the **Type** column. Select it to sort by type of resource.
1. Find the **Public IP address** resource prefixed with `ihs`, then copy and write down its name.

### Configure the cluster

First, enable the option **Synchronize changes with Nodes** so that any configuration can be automatically synchronized to all application servers.

1. Switch back to the WebSphere Integrated Solutions Console, sign-in again if you're logged out.
1. Under navigation pane at the left side, select **System administration** > **Console Preferences**.
1. In **Console Preferences** pane, check **Synchronize changes with Nodes**. Select **Apply**. You should see message **Your preferences have been changed.**

Then, configure Database **Distributed sessions** for all application servers.

1. Under navigation pane at the left side, select **Servers** > **Server Types** > **WebSphere application servers**.
1. In **Application servers** pane, you should see 3 application servers listed. For each application server, follow these instructions to configure Database **Distributed sessions**:
   1. In the table under the text **You can administer the following resources**, select the hyperlink for the application server. This starts with **MyCluster**.
   1. In the **Container Settings** section, select **Session management** .
   1. In the **Additional Properties** section, select **Distributed environment settings**.
   1. For **Distributed sessions**, select **Database (Supported for Web container only.)**.
   1. Select **Database**.
      1. Fill in *jdbc/WebSphereCafeDB* for **Datasource JNDI name**.
      1. For **User ID**, enter the server admin sign-in name and the failover group name you wrote down from the preceding section - for example, *azureuser@failovergroup-mjg022624*.
      1. Fill in the Azure SQL server admin sign-in password that you wrote down before for **Password**.
      1. Fill in *sessions* for **Table space name**.
      1. Check **Use multi row schema**. 
      1. Select **OK**. You're directed back to the **Distributed environment settings** pane.
   1. Under **Additional Properties** section, select **Custom tuning parameters**.
   1. Select **Low (optimize for failover)** for **Tuning level**. 
   1. Select **OK**.
   1. Under **Messages**, select **Save**. Wait until completion.
   1. Select **Application servers** from the top breadcrumb bar. You're directed back to **Application servers** pane.
1. Under navigation pane at the left side, select **Servers** > **Clusters** > **WebSphere application server clusters**.
1. In **WebSphere application server clusters** pane, you should see cluster *MyCluster* listed. Check the checkbox next to **MyCluster**.
1. Select **Ripplestart**.
1. Wait until the cluster is restarted. You can select the **Status** icon and if the new window doesn't show **Started**, switch back to the console and refresh the web page after a while. Repeat the operation until you see **Started**. You may see **Partial Start** before reaching the state **Started**

Keep the console open and use it for app deployment later.

### Deploy a sample app

Deploy and run a sample CRUD Java/Jakarta EE application on WebSphere cluster for disaster recovery failover test later.

You configured application servers to use the datasource *jdbc/WebSphereCafeDB* to store session data before, which enables failover and load balancing across a cluster of WebSphere application servers. The sample app also configures [persistence schema](https://github.com/Azure-Samples/websphere-cafe/blob/main/websphere-cafe-web/src/main/resources/META-INF/persistence.xml#L7) to persist application data *coffee* in the same datasource *jdbc/WebSphereCafeDB*.

First, use the following commands to download, build and package the sample:

```bash
git clone https://github.com/Azure-Samples/websphere-cafe
cd websphere-cafe
git checkout 20240326
mvn clean package
```

If you see a message about being in `Detached HEAD` state, this message is safe to ignore.

The package should be successfully generated and located at *\<parent-path-to-your-local-clone>/websphere-cafe/websphere-cafe-application/target/websphere-cafe.ear*. If you don't see the package, you must troubleshoot and resolve the issue before you continue.

Then, use the following steps to deploy the sample app to the cluster:

1. Switch back to the WebSphere Integrated Solutions Console, sign-in again if you're logged out.
1. Under navigation pane at the left side, select **Applications** > **Application Types** > **WebSphere enterprise applications**.
1. In **Enterprise Applications** pane, select **Install** > **Choose File** > find the package located at *\<parent-path-to-your-local-clone>/websphere-cafe/websphere-cafe-application/target/websphere-cafe.ear*, select **Open**. Select **Next** > **Next** > **Next**.
1. In **Map modules to servers** pane, press <kbd>Ctrl</kbd> and select all items listed in **Clusters and servers**. Select the checkbox next to **websphere-cafe.war**. Select **Apply**. Select **Next** until you see **Finish** button. 
1. Select **Finish** > **Save**, wait until completion. Select **OK**.
1. Check installed application *websphere-cafe*, select **Start**. Wait until you see messages indicating application successfully started. If you are not able to see the successful message, you must troubleshoot and resolve the reason why before continuing.

Now, use the following steps to verify if the app is running as expected.

1. Switch back to the IHS console. Append the context root */websphere-cafe* of the deployed app to the address bar - for example, `http://ihs70685e.eastus.cloudapp.azure.com/websphere-cafe/`, and press <kbd>Enter</kbd>. You should see the welcome page of sample app.
1. Create a new coffee with name and price (for example, *Coffee 1* with price *$10*), which is persisted into both application data table and session table of the database. The UI that you see should be similar to the following screenshot:

   :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/sample-app-ui.png" alt-text="Screenshot of the sample application UI." lightbox="media/migrate-websphere-to-vms-with-ha-dr/sample-app-ui.png":::

If your UI doesn't look similar, troubleshoot and resolve the problem before you continue.

## Set up disaster recovery for the cluster using Azure Site Recovery

In this section, you set up disaster recovery for Azure VMs in the primary cluster using Azure Site Recovery, by following the steps in [Tutorial: Set up disaster recovery for Azure VMs](/azure/site-recovery/azure-to-azure-tutorial-enable-replication). You just need the following sections: [Create a Recovery Services vault](/azure/site-recovery/azure-to-azure-tutorial-enable-replication#create-a-recovery-services-vault) and [Enable replication](/azure/site-recovery/azure-to-azure-tutorial-enable-replication#enable-replication). Pay attention to the following steps as you go through the article, then return to this article after the primary cluster is protected:

1. When you reach the section [Create a Recovery Services vault](/azure/site-recovery/azure-to-azure-tutorial-enable-replication#create-a-recovery-services-vault):
   1. In step 5 for **Resource group**, creating a new resource group with a unique name in your subscription - for example, *was-cluster-westus-mjg022624*.
   1. In step 6 for **Vault name**, provide a vault name - for example, *recovery-service-vault-westus-mjg022624*.
   1. In step 7 for **Region**, select **West US**.
   1. Before selecting **Review + create** in step 8, select **Next: Redundancy**. In **Redundancy** pane, select **Geo-redundant** for **Backup Storage Redundancy** and **Enable** for **Cross Region Restore**.

      > [!NOTE]
      > Make sure you select **Geo-redundant** for **Backup Storage Redundancy** and **Enable** for **Cross Region Restore** in **Redundancy** pane. Otherwise the storage of the primary cluster can't be replicated to the secondary region.

   1. Enable Site Recovery by following steps in section [Enable Site Recovery](/azure/site-recovery/azure-to-azure-tutorial-enable-replication#enable-site-recovery).

1. When you reach the section [Enable replication](/azure/site-recovery/azure-to-azure-tutorial-enable-replication#enable-replication):
   1. Select source settings:
      1. For **Region**, select **East US**.
      1. For **Resource group**, select the resource where the primary cluster is deployed - for example, *was-cluster-eastus-mjg022624*.
         
         > [!NOTE]
         > If the desired resource group is not listed, you can select **West US** for Region first and then switch back to **East US**.

      1. Leave the defaults for other fields. Select **Next**.
   1. Select the VMs:
      1. In **Virtual machines**, select all VMs listed.
         :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/site-recovery-all-vms.png" alt-text="All five VMs are selected." lightbox="media/migrate-websphere-to-vms-with-ha-dr/site-recovery-all-vms.png":::
         Select all five VMs and select **Next**.
   1. Fill in **Replication settings**:
      1. For **Target location**, select **West US**.
      1. For **Target resource group**, select the resource group where the service recovery vault is deployed - for example, *was-cluster-westus-mjg022624*.
      1. Note down the new failover virtual network and failover subnet, which are mapped from ones in the primary region. 
      1. Leave the defaults for other fields.
      1. Select **Next**.
   1. Fill in **Manage**:
      1. For **Replication policy**, use the default policy *24-hour-retention-policy*. You can also create a new policy for your business.
      1. Leave the defaults for other fields as well.
      1. Select **Next**.
   1. In **Review**:
      1. After selecting **Enable replication**, notice the message **Creating Azure resources. Don't close this blade.** displayed at the bottom of the page. Do nothing and wait until the blade is closed automatically. You're redirected to **Site Recovery** page.
      1. Under **Protected items**, select **Replicated items**. Initially there are no items listed because the replication is still in progress. The replication takes about one hour to complete. Refresh the page periodically until you see all VMs are **Protected**, for example:

         :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/replicated-items-protected.png" alt-text="Screenshot of VMs that are replicated and protected." lightbox="media/migrate-websphere-to-vms-with-ha-dr/replicated-items-protected.png":::

Next, create a recovery plan to include all replicated items so that they can fail over together. Execute instructions in [Create a recovery plan](/azure/site-recovery/site-recovery-create-recovery-plans#create-a-recovery-plan), with the following customization:

1. In step 2, enter a name for the plan - for example, *recovery-plan-mjg022624*.
1. In step 3, select **East US** for **Source** and **West US** for **Target**.
1. In step 4 for **Select items**, select all protected items. Select all five protected VMs for this tutorial.

Now you create a recovery plan. Keep the page open and you use it for failover test later.

### Further network configuration for the secondary region

Additionally, you need further network configuration to enable and protect external access to the secondary region in a failover event.

1. Create a public IP address for Dmgr in the secondary region by following instructions in [Create a Standard SKU public IP address](/azure/virtual-network/ip-services/create-public-ip-portal?tabs=option-1-create-public-ip-standard#create-a-standard-sku-public-ip-address), with the customization for some fields:
   1. For **Resource group**, select the resource group where the service recovery vault is deployed - for example, *was-cluster-westus-mjg022624*.
   1. For **Region**, select **(US) West US**.
   1. For **Name**, enter a value - for example, *dmgr-public-ip-westus-mjg022624*.
   1. For **DNS name label**, enter a unique value - for example, *dmgrmjg022624*.

1. Create another public IP address for IHS in the secondary region by following the same guide, with the customization for some fields:
   1. For **Resource group**, select the resource group where the service recovery vault is deployed - for example, *was-cluster-westus-mjg022624*.
   1. For **Region**, select **(US) West US**.
   1. For **Name**, enter a value - for example, *ihs-public-ip-westus-mjg022624*. Write it down.
   1. For **DNS name label**, enter a unique value - for example, *ihsmjg022624*.

1. Create a network security group in the secondary region by following instructions in [Create a network security group](/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal#create-a-network-security-group), with customization for some fields:
   1. For **Resource group**, select the resource group where the service recovery vault is deployed - for example, *was-cluster-westus-mjg022624*.
   1. For **Name**, enter a value - for example, *nsg-westus-mjg022624*.
   1. For **Region**, select **West US**.

1. Create an inbound security rule for the network security group by following instructions in [Create a security rule](/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal#create-a-security-rule), with the following customization:
   1. In step 2, select the network security group you created - for example, *nsg-westus-mjg022624*.
   1. In step 3, select **Inbound security rules**.
   1. In step 4, customize the following settings:
      1. For **Destination port ranges**, enter *9060,9080,9043,9443,80*.
      1. For **Protocol**, select **TCP**.
      1. For **Name**, enter *ALLOW_HTTP_ACCESS*.

1. Associate the network security group to a subnet by following instructions in [Associate or dissociate a network security group to or from a subnet](/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal#associate-or-dissociate-a-network-security-group-to-or-from-a-subnet), with the following customization:
   1. In step 2, select the network security group you created - for example, *nsg-westus-mjg022624*.
   1. Select **+ Associate** to associate the network security group to the failover subnet you noted down before.

## Set up an Azure Traffic Manager

In this section, you create an Azure Traffic Manager for distributing traffic to your public facing applications across the global Azure regions. The primary endpoint points to the public IP address of the IHS in the primary region, and the secondary endpoint points to the public IP address of the IHS in the secondary region.

Create an Azure Traffic Manager profile by following [Quickstart: Create a Traffic Manager profile using the Azure portal](/azure/traffic-manager/quickstart-create-traffic-manager-profile). You just need the following sections: **Create a Traffic Manager profile** and **Add Traffic Manager endpoints**. You must skip the sections where you are directed to create App Service resources. Use the following steps as you go through these sections, then return to this article after you create and configure the Azure Traffic Manager.

1. When you reach the section [Create a Traffic Manager profile](/azure/traffic-manager/quickstart-create-traffic-manager-profile#create-a-traffic-manager-profile), use the following steps:
   1. In step 2 **Create Traffic Manager profile**, use the following steps:
      1. Write down the unique Traffic Manager profile name for **Name** - for example, *tmprofile-mjg022624*.
      1. Write down the new resource group name for **Resource group** - for example, *myResourceGroupTM1*.

1. When you reach the section [Add Traffic Manager endpoints](/azure/traffic-manager/quickstart-create-traffic-manager-profile#add-traffic-manager-endpoints), use the following steps:
   1. After you open the Traffic Manager profile in step 2, in the **Configuration** page, use the following steps:
      1. For **DNS time to live (TTL)**, enter *10*.
      1. Under **Endpoint monitor settings**, for **Path**, enter */websphere-cafe/*. It's the context root of the deployed sample app.
      1. Under **Fast endpoint failover settings**, use the following values:
         * For **Probing internal**, select *10*.
         * For **Tolerated number of failures**, enter *3*.
         * For **Probe timeout**, *5*.
      1. Select **Save**. Wait until it completes.
   1. In step 4 for adding the primary endpoint *myPrimaryEndpoint*, use the following steps:
      1. For **Target resource type**, select **Public IP address**.
      1. Select the **Choose public IP address** dropdown and enter the name of the public IP address of the IHS in the **East US** region that you wrote down before. You should see one entry matched. Select it for **Public IP address**.
   1. In step 6 for adding a failover/secondary endpoint *myFailoverEndpoint*, use the following steps:
      1. For **Target resource type**, select **Public IP address**.
      1. Select the **Choose public IP address** dropdown and enter the name of the public IP address of the IHS in the **West US** region that you wrote down before. You should see one entry matched. Select it for **Public IP address**.
   1. Wait for a while. Select **Refresh** until the **Monitor status** for endpoint *myPrimaryEndpoint* is *Online* and **Monitor status** for endpoint *myFailoverEndpoint* is *Degraded*.

Next, verify if the sample app deployed to the primary WebSphere cluster can be accessed from the Traffic Manager profile:

1. Select **Overview** of the Traffic Manager profile you created.
1. Check and copy the DNS name of the Traffic Manager profile, append it with */websphere-cafe/*. For example, `http://tmprofile-mjg022624.trafficmanager.net/websphere-cafe/`.
1. Open the URL in a new tab of the browser. You should see the coffee you created before is listed in the page.
1. Create another coffee with a different name and price (for example, *Coffee 2* with price *20*), which is persisted into both application data table and session table of the database. The UI that you see should be similar to the following screenshot:

   :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/sample-app-ui-2nd-coffee.png" alt-text="Screenshot of the sample application UI with the 2nd coffee." lightbox="media/migrate-websphere-to-vms-with-ha-dr/sample-app-ui-2nd-coffee.png":::

If your UI doesn't look similar, troubleshoot and resolve the problem before you continue. Keep the console open and use it for failover test later.

Now you set up the Traffic Manager profile. Keep the page open and you use it for monitoring the endpoint status change in a failover event later.

## Test failover from primary to secondary

To test failover, you manually failover your Azure SQL Database server and cluster, and then fail back using the Azure portal in this section.

### Failover to the secondary site

First, use the following steps to failover the Azure SQL Database from the primary server to the secondary server:

1. Switch to the browser tab of your Azure SQL Database failover group - for example, *failovergroup-mjg022624*.
1. Select **Failover** > **Yes**.
1. Wait until it completes.

Next, use the following steps to failover the WebSphere cluster with the recovery plan:

1. In the search box at the top of the Azure portal, enter **Recovery Services vaults** and select **Recovery Services vaults** in the search results.
1. Select the name of your Recovery Services vault - for example, *recovery-service-vault-westus-mjg022624*.
1. Under **Manage**, select **Recovery Plans (Site Recovery)**. Select the recovery plan you created - for example, *recovery-plan-mjg022624*. 
1. Select **Failover**. Check **I understand the risk. Skip test failover.**. Leave the defaults for others, select **OK**.

   > [!NOTE]
   > Optinally you can execute **Test failover** and **Cleanup test failover** to make sure everything works as expected before **Failover**. Reference [Tutorial: Run a disaster recovery drill for Azure VMs](/azure/site-recovery/azure-to-azure-tutorial-dr-drill) for more information. This tutorial chose **Failover** directly to simplify the exercise.

   :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/failover-settings.png" alt-text="Screenshot of failover settings." lightbox="media/migrate-websphere-to-vms-with-ha-dr/failover-settings.png":::

1. Monitor the failover in notifications until it completes. It takes about 10 minutes for the exercise of this tutorial.

   :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/failover-in-progress.png" alt-text="Screenshot of failover in progress." lightbox="media/migrate-websphere-to-vms-with-ha-dr/failover-in-progress.png":::
   :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/failover-completed.png" alt-text="Screenshot of failover completed." lightbox="media/migrate-websphere-to-vms-with-ha-dr/failover-completed.png":::

1. Optionally, you can view details of failover job by selecting the failover event (for example, *Failover of 'recovery-plan-mjg022624' is in progress...*) from notifications:
   
   :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/failover-job-details.png" alt-text="Screenshot of failover job details." lightbox="media/migrate-websphere-to-vms-with-ha-dr/failover-job-details.png":::

Then, use the following steps to enable the external access to the WebSphere Integrated Solutions Console and sample app in the secondary region, and verify if they work as expected.

1. In the search box at the top of the Azure portal, enter **Resource groups** and select **Resource groups** in the search results.
1. Select the name of resource group for your secondary region - for example, *was-cluster-westus-mjg022624*. Sort items by **Type** in the **Resource Group** page.
1. Select **Network Interface** prefixed with *dmgr*. Select **IP configurations** > **ipconfig1**. Check **Associate public IP address**. For **Public IP address**, select public IP address prefixed with *dmgr*. Select **Save**, wait until it completes.
1. Switch back to the resource group, and select **Network Interface** prefixed with *ihs*. Select **IP configurations** > **ipconfig1**. Check **Associate public IP address**. For **Public IP address**, select public IP address prefixed with *ihs*. Select **Save**, wait until it completes.
1. Find the DNS name label for the public IP address of Dmgr you created before, open the URL of Dmgr WebSphere Integrated Solutions Console in a new browser tab - for example, `https://dmgrmjg022624.westus.cloudapp.azure.com:9043/ibm/console`. Refresh the page until you see the welcome page for sign in.
1. Sign in to the console with the user name and password for WebSphere administrator you wrote down before, and check the followings:
   1. Under navigation pane at the left side, select **Servers** > **All servers**. In **Middleware server** pane, you should see 4 servers listed, including 3 WebSphere application servers consisting of WebSphere cluster *MyCluster* and 1 Web server that is an IHS. Refresh the page until you see all servers are started.

      :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/middleware-servers.png" alt-text="Screenshot of the middleware servers." lightbox="media/migrate-websphere-to-vms-with-ha-dr/middleware-servers.png":::

   1. Under navigation pane at the left side, select **Applications** > **Application Types** > **WebSphere enterprise applications**. In **Enterprise Applications** pane, you should see 1 application *websphere-cafe* listed and started.

      :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/enterprise-applications-deployed.png" alt-text="Screenshot of the Enterprise Applications deployed." lightbox="media/migrate-websphere-to-vms-with-ha-dr/enterprise-applications-deployed.png":::

   1. Reference steps in [Configure the cluster](#configure-the-cluster) to you should see settings for **Synchronize changes with Nodes** and **Distributed sessions** are replicated to the failover cluster. 

1. Find the DNS name label for the public IP address of IHS you created before, open the URL of IHS console appended with the root context */websphere-cafe/* of the deployed app in a new browser tab - for example, `https://ihsmjg022624.westus.cloudapp.azure.com/websphere-cafe/`. You should see 2 coffees you created before listed in the page.
1. Switch to the browser tab of your Traffic Manager profile, then refresh the page until you see that the **Monitor status** value of the endpoint `myFailoverEndpoint` becomes *Online* and the **Monitor status** value of the endpoint `myPrimaryEndpoint` becomes *Degraded*.
1. Switch to the browser tab with the DNS name of the Traffic Manager profile - for example, `http://tmprofile-mjg022624.trafficmanager.net/websphere-cafe/`. Refresh the page and you should see the same data persisted in the application data table and the session table displayed. The UI that you see should be similar to the following screenshot:

   :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/sample-app-ui-after-failover.png" alt-text="Screenshot of the sample application UI after failover." lightbox="media/migrate-websphere-to-vms-with-ha-dr/sample-app-ui-after-failover.png":::

   If you don't observe this behavior, it might be because the Traffic Manager is taking time to update DNS to point to the failover site. The problem could also be that your browser cached the DNS name resolution result that points to the failed site. Wait for a while and refresh the page again.

### Commit the failover

Commit the failover after you're satisfied the failover result.

1. In the search box at the top of the Azure portal, enter **Recovery Services vaults** and select **Recovery Services vaults** in the search results.
1. Select the name of your Recovery Services vault - for example, *recovery-service-vault-westus-mjg022624*.
1. Under **Manage**, select **Recovery Plans (Site Recovery)**. Select the recovery plan you created - for example, *recovery-plan-mjg022624*. 
1. Select **Commit** > **OK**.
1. Monitor the commit in notifications until it completes.

   :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/failover-commit-in-progress.png" alt-text="Screenshot of failover commit in progress." lightbox="media/migrate-websphere-to-vms-with-ha-dr/failover-commit-in-progress.png":::
   :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/failover-commit-completed.png" alt-text="Screenshot of failover commit completed." lightbox="media/migrate-websphere-to-vms-with-ha-dr/failover-commit-completed.png":::

1. Select **Items in recovery plan**, you should see 5 items listed as **Failover committed**.

   :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/replicated-items-failover-committed.png" alt-text="Screenshot of replicated items failover committed." lightbox="media/migrate-websphere-to-vms-with-ha-dr/replicated-items-failover-committed.png":::

### Disable the replication

Disable the replication for items in recovery plan and delete the recovery plan.

1. For each item in **Items in recovery plan**, right-click the item > select **Disable Replication**.
1. If you're prompted to provide reason(s) for disabling protection for this virtual machine, select one you prefer - for example, **I completed migrating my application**. Select **OK**.
1. Repeat step 1 until you disable replication for all items.
1. Monitor the process in notifications until it completes.

   :::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/remove-replicated-items-completed.png" alt-text="Screenshot of removing replicated items completed." lightbox="media/migrate-websphere-to-vms-with-ha-dr/remove-replicated-items-completed.png":::

1. Select **Overview** > **Delete**. Select **Yes** to confirm the **Delete**.

### Re-protect the failover site

Now the secondary region is the failover site and active, you should re-protect it in your primary region.

First, clean up resources that are unused and are going to be replicated by Azure Site Recovery service in your primary region later.

1. In the search box at the top of the Azure portal, enter **Resource groups** and select **Resource groups** in the search results.
1. Select the name of resource group for your primary region - for example, *was-cluster-eastus-mjg022624*. Sort items by **Type** in the **Resource Group** page.
1. Select **Type** filter > select *Virtual machine* from dropdown list of **Value** > **Apply**. Select all virtual machines > **Delete** > Enter **delete** to confirm deletion > Select **Delete**. Monitor the process in notifications until it completes.
1. Select **Type** filter > select *Disks* from dropdown list of **Value** > **Apply**. Select all disks > **Delete** > Enter **delete** to confirm deletion > Select **Delete**. Monitor the process in notifications, wait until it completes.
1. Select **Type** filter > select *Private endpoint* from dropdown list of **Value** > **Apply**. Select all private endpoints > **Delete** > Enter **delete** to confirm deletion > Select **Delete**. Monitor the process in notifications until it completes. Ignore this step if type **Private endpoint** is not listed.
1. Select **Type** filter > select *Network Interface* from dropdown list of **Value** > **Apply**. Select all network interfaces > **Delete** > Enter **delete** to confirm deletion > Select **Delete**. Monitor the process in notifications until it completes.
1. Select **Type** filter > select *Storage account* from dropdown list of **Value** > **Apply**. Select all storage accounts > **Delete** > Enter **delete** to confirm deletion > Select **Delete**. Monitor the process in notifications until it completes.

Next, use the same steps in the [Set up disaster recovery for the cluster using Azure Site Recovery](#set-up-disaster-recovery-for-the-cluster-using-azure-site-recovery) in the primary region, except for the following differences:

1. For **Create a Recovery Services vault**:
   1. Select resource group deployed in the primary region - for example, *was-cluster-eastus-mjg022624*.
   1. Enter a different name for service vault - for example, *recovery-service-vault-eastus-mjg022624*.
   1. Select **East US** for **Region**.
1. For **Enable replication**:
   1. Select **West US** for **Region** in **Source**.
   1. In **Replication settings**,
      1. Select existing resource group deployed in the primary region for **Target resource group** - for example, *was-cluster-eastus-mjg022624*.
      1. Select existing virtual network in the primary region for **Failover virtual network**.
1. For **Create a recovery plan**:
   1. Select **West US** for **Source** and **East US** for **Target**.
1. Skip steps in section [Further network configuration for the secondary region](#further-network-configuration-for-the-secondary-region) as these resources are created and configured before.

> [!NOTE]
> You may notice Azure Site Recovery supports [re-protect VMs](/azure/site-recovery/azure-to-azure-tutorial-failover-failback?reprotect-the-vm) when the target VM exists. However, it doesn't work when only changes between the source disk and the target disk are synchronized for the WebSphere cluster, based on the verification result. This tutorial establishes a new replication from the secondary site to the primary site after failover, in which the entire disks are copied from the failed over region to the primary region. See [What happens during reprotection?](/azure/site-recovery/azure-to-azure-how-to-reprotect#what-happens-during-reprotection) for more information.

### Fail back to the primary site

Use the same steps in the [Failover to the secondary site](#failover-to-the-secondary-site) section to fail back to the primary site including database server and cluster, except for the following differences:

1. Select recovery service vault deployed in the primary region - for example, *recovery-service-vault-eastus-mjg022624*.
1. Select resource group deployed in the primary region - for example, *was-cluster-eastus-mjg022624*.
1. After you enable the external access to the WebSphere Integrated Solutions Console and sample app in the primary region, revisit the browser tabs for WebSphere Integrated Solutions Console and sample app for the primary cluster you opened before, and verify if they work as expected. Depending on how much time it took to failback, you may not see session data displayed in the **New coffee** section of the sample app UI if it's expired over 1 hour.
1. In section [Commit the failover](#commit-the-failover), select your Recovery Services vault deployed in the primary - for example, *recovery-service-vault-eastus-mjg022624*.
1. In the Traffic Manager profile, you should see that endpoint *myPrimaryEndpoint* becomes *Online* and endpoint *myFailoverEndpoint* becomes *Degraded*.
1. In section [Re-protect the failover site](#re-protect-the-failover-site):
   1. The primary region is your failover site and active, you should re-protect it in your secondary region.
   1. Clean up resource deployed in your secondary region - for example, resources deployed in *was-cluster-westus-mjg022624*.
   1. Use the same steps in the [Set up disaster recovery for the cluster using Azure Site Recovery](#set-up-disaster-recovery-for-the-cluster-using-azure-site-recovery) for protecting the primary region in the secondary region, except:
      1. Skipping steps in **Create a Recovery Services vault** as you created one before - for example, *recovery-service-vault-westus-mjg022624*.
      1. For **Enable replication** > **Replication settings**, select existing virtual network in the secondary region for **Failover virtual network**.
      1. Skipping steps in section [Further network configuration for the secondary region](#further-network-configuration-for-the-secondary-region) as these resources are created and configured before.

## Clean up resources

If you're not going to continue to use the WebSphere clusters and other components, use the following steps to delete the resource groups to clean up the resources used in this tutorial:

1. Enter the resource group name of Azure SQL Database servers (for example, `myResourceGroup`) in the search box at the top of the Azure portal, and select the matched resource group from the search results.
1. Select **Delete resource group**.
1. In **Enter resource group name to confirm deletion**, enter the resource group name.
1. Select **Delete**.
1. Repeat steps 1-4 for the resource group of the Traffic Manager - for example, `myResourceGroupTM1`.
1. In the search box at the top of the Azure portal, enter **Recovery Services vaults** and select **Recovery Services vaults** in the search results.
1. Select the name of your Recovery Services vault - for example, *recovery-service-vault-westus-mjg022624*.
1. Under **Manage**, select **Recovery Plans (Site Recovery)**. Select the recovery plan you created - for example, *recovery-plan-mjg022624*.
1. Use the same steps in section [Disable the replication](#disable-the-replication) to remove locks on replicated items.
1. Repeat steps 1-4 for the resource group of the primary WebSphere cluster - for example, `was-cluster-westus-mjg022624`.
1. Repeat steps 1-4 for the resource group of the secondary WebSphere cluster - for example, `was-cluster-eastus-mjg022624`.

## Next steps

In this tutorial, you set up an HA/DR solution consisting of an active-passive application infrastructure tier with an active-passive database tier, and in which both tiers span two geographically different sites. At the first site, both the application infrastructure tier and the database tier are active. At the second site, the secondary domain is restored with Azure Site Recovery service, and the secondary database is on standby.

Continue to explore the following references for more options to build HA/DR solutions and run WebSphere on Azure:

> [!div class="nextstepaction"]
> [Azure reliability documentation](/azure/reliability)
> [!div class="nextstepaction"]
> [Build solutions for high availability](/azure/architecture/high-availability/building-solutions-for-high-availability)
> [!div class="nextstepaction"]
> [Automatic failover using Azure Traffic Manager](/azure/networking/disaster-recovery-dns-traffic-manager#automatic-failover-using-azure-traffic-manager)
> [!div class="nextstepaction"]
> [Learn more about WebSphere on Azure](../ee/websphere-family.md)

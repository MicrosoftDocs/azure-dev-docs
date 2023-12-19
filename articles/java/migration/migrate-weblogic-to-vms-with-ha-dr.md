---
title: "Tutorial: Migrate Oracle WebLogic Server to Azure Virtual Machines with high availability and disaster recovery"
description: Shows how to deploy WebLogic Server to Azure Virtual Machines with high availability and disaster recovery.
author: KarlErickson
ms.author: jiangma
ms.topic: how-to
ms.date: 12/06/2023
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java,, devx-track-azurecli, devx-track-extended-java
---

# Tutorial: Migrate Oracle WebLogic Server to Azure Virtual Machines with high availability and disaster recovery

This tutorial shows you a simple and effective way to implement high availability and disaster recovery (HA/DR) for Java using Oracle WebLogic Server (WLS) on Azure Virtual Machines (VMs). The solution illustrates how to achieve a low Recovery Time Objective (RTO) and Recovery Point Objective (RPO) using a simple database driven Jakarta EE application running on WLS. HA/DR is a complex topic, with many possible solutions. The best solution depends on your unique requirements. For other ways to implement HA/DR, see the resources at the end of this article.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Use Azure optimized best practices to achieve high availability and disaster recovery.
> * Set up a Microsoft Azure SQL Database failover group in paired regions.
> * Set up paired WLS clusters on Azure VMs.
> * Set up an Azure Traffic Manager.
> * Configure WLS clusters for high availability and disaster recovery.
> * Test failover from primary to secondary.

This diagram illustrates the architecture you build.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/solution-architecture.png" alt-text="Solution architecture of WLS on Azure VMs with high availability and disaster recovery." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/solution-architecture.png":::

Azure Traffic Manager checks the health of your regions and routes the traffic accordingly to the application tier. Both the primary region and the secondary region have a full deployment of the WLS cluster. However, only the primary region is actively servicing network requests from the users. The secondary region is passive and activated to receive traffic only when the primary region experiences a service disruption. Azure Traffic Manager uses the health check feature of the Azure Application Gateway to implement this conditional routing. The primary WLS cluster is running and the secondary cluster shutdown. For geo-failover RTO of the application tier, it depends on the time for starting VMs and running the secondary WLS cluster. The RPO depends on the Azure SQL Database since the data is persitsted and replicated in Azure SQL Database failover group.  

The database tier consists of an Azure SQL Database failover group with a primary server and a secondary server. The primary server is in active read-write mode and connected to the primary WLS cluster. The secondary server is in passive ready-only mode and connected to the secondary WLS cluster. A geo-failover switches all secondary databases in the group to the primary role. For geo-failover RPO and RTO of Azure SQL Database, see [Overview of Business Continuity](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview?view=azuresql-db&preserve-view=true).

This tutorial was written with Azure SQL Database service because the tutorial relies on the HA features of that service. Other database choices are possible, but the HA features of whatever database you chose must be considered. For more information, including on how to optimize the configuration of data sources for replication, please see [Configuring Data Sources for Oracle Fusion Middleware Active-Passive Deployment](https://docs.oracle.com/en/middleware/fusion-middleware/12.2.1.4/asdrg/setting-and-managing-disaster-recovery-sites.html#GUID-445693AB-B592-4E11-9B44-A208444B75F2).

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* Make sure have either the `Owner` role or the `Contributor` and `User Access Administrator` roles in the subscription. You can verify the assignment by following the steps in [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal).
* Prepare a local machine with either Windows, Linux or macOS installed.
* Install and set up [Git](/devops/develop/git/install-and-set-up-git).
* Install a Java SE implementation, version 17 or later (for example, [the Microsoft build of OpenJDK](/java/openjdk)).
* Install [Maven](https://maven.apache.org/download.cgi) 3.9.3 or higher.

## Set up an Azure SQL Database failover group in paired regions

In this section, you create an Azure SQL Database failover group in paired regions for use with your WLS clusters and app. In a later section, you configure WLS to store its session data and transaction logs to this database. This practice is consistent with Oracle's Maximum Availability Architecture (MAA).

First, create the primary Azure SQL Database by following the Azure portal steps in [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal). Execute the steps up to, but not including **Clean up resources**. Use the following directions as you go through the article, then return to this document after you create and configure the Azure SQL Database.

1. When you reach the section [Create a single database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal#create-a-single-database):
   1. In step 4 for creating new resource group, write down **Resource group name**. For example, *myResourceGroup*.
   1. In step 5 for database name, write down **Database name**. For example, *mySampleDatabase*.
   1. In step 6 for creating the server:
      * Write down the unique server name. For example, *sqlserverprimary-ejb120623*.
      * Select **(US) West US** for **Location**.
      * Select **Use SQL authentication** for **Authentication method**.
      * Write down **Server admin login**. For example, *azureuser*.
      * Write down **Password**.
   1. In step 8, select **Development** for **Workload environment**. Look at description and consider other options for your workload. 
   1. In step 11, select **Locally-redundant backup storage** for **Backup storage redundancy**. Consider other options for your backups. To learn more, see [backup storage redundancy](/azure/azure-sql/database/automated-backups-overview?view=azuresql-db&preserve-view=true#backup-storage-redundancy).
   1. In step 14 for **Firewall rules** configuration, select **Yes** for **Allow Azure services and resources to access this server**.

1. When you reach the section [Query the database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal#query-the-database):
   1. In step 3, enter your **SQL authentication** server admin login information to login.

   > [!NOTE]
   > If login failed with an error message similar to **Client with IP address 'xx.xx.xx.xx' is not allowed to access the server**, select **Allowlist IP xx.xx.xx.xx on server \<your-sqlserver-name\>** at the end of the error message. Wait until the server firewall rules complete updating and select **OK** again.

   1. After you run the sample query in step 5, clear the editor and enter the following query, and select **Run** again. You should see message **Query succeeded: Affected rows: 0** after successful run.

      ```sql
      create table TLOG_msp1_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
      create table TLOG_msp2_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
      create table TLOG_msp3_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
      create table wl_servlet_sessions (wl_id VARCHAR(100) NOT NULL, wl_context_path VARCHAR(100) NOT NULL, wl_is_new CHAR(1), wl_create_time DECIMAL(20), wl_is_valid CHAR(1), wl_session_values VARBINARY(MAX), wl_access_time DECIMAL(20), wl_max_inactive_interval INTEGER, PRIMARY KEY (wl_id, wl_context_path));
      ```

      These database tables are used for storing transaction log (TLOG) and session data for your WLS clusters and app. See [Using a JDBC TLOG Store](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/store/jdbc.html#GUID-6522B5CF-0775-4EEE-BF23-A5AD2C0F08EF) and [Using a Database for Persistent Storage (JDBC Persistence)](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/wbapp/sessions.html#GUID-32648CF4-5189-43BB-B0FE-4A99B4EF9FDA) for more information.

Then, create an Azure SQL Database failover group by following the Azure portal steps in [Configure a failover group for Azure SQL Database](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db). You just need to execute some of sections: **Create failover group**, and **Test failover**. Use the following directions as you go through the article, then return to this document after you create and configure the Azure SQL Database failover group.

1. When you reach the section [Create failover group](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#create-failover-group):
   1. In step 5 for creating the **Failover group**, select to create a new secondary server:
      1. Enter and write down the unique server name. For example, *sqlserversecondary-ejb120623*.
      1. Enter the same server admin login and password as your primary server.
      1. Select **(US) East US** for **Location**.
      1. Make sure **Allow Azure services to access server** is checked.
   1. In step 5 for configuring the **Databases within the group**, select database you create in the primary server. For example, *mySampleDatabase*.

1. When you reach the section [Test planned failover](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#test-planned-failover):
   1. After you complete all steps, keep the failover group page open and you use it for failover test of the WLS clusters later.

## Set up paired WLS clusters on Azure VMs

In this section, you create two WLS clusters on Azure VMs using [Oracle WebLogic Server Cluster on Azure VMs](https://aka.ms/wls-vm-cluster) offer. The cluster in West US is primary and is configured as active cluster later. The cluster in East US is secondary and is configured as passive cluster later.

### Set up the primary WLS cluster

First, open [Oracle WebLogic Server Cluster on Azure VMs](https://aka.ms/wls-vm-cluster) offer in your browser and select **Create**. You should see **Basics** pane of the offer.

The following steps show you how to fill out the **Basics** pane.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-basics.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on Azure VMs Basics pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-basics.png":::

1. Ensure that the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a unique value for the resource group. For example, *wls-cluster-westus-ejb120623*.
1. Under **Instance details**, select **West US** for **Region**.
1. Under **Credentials for Virtual Machines and WebLogic**, provide a password for **admin account of VM** and **WebLogic Administrator**, respectively. Write down username and password for **WebLogic Administrator**.
1. Leave the defaults for other fields.
1. Select **Next** to go to the **TLS/SSL Configuration** pane.

Leave the defaults in **TLS/SSL Configuration** pane, select **Next** to go to **Azure Application Gateway** pane.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-azure-app-gateway.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on Azure VMs Azure Application Gateway pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-azure-app-gateway.png":::

1. Select **Yes** for **Connect to Azure Application Gateway?**.
1. Select **Generate a self-signed certificate** for **Select desired TLS/SSL certificate option**.
1. Select **Next** to go to the **Networking** pane.

You should see all fields are prepopulated with the defaults in **Networking** pane. Execute the following steps to save the network configuration. 

1. Select **Edit virtual network**. Write down address space of the virtual network. For example, *10.1.4.0/23*.

   :::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-networking-vnet.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on Azure VMs Virtual Network pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-networking-vnet.png":::

1. Select **wls-subnet** to edit subnet. Under **Subnet details**, write down starting address and subnet size. For example, *10.1.5.0* and */28*.

   :::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-networking-vnet-wls-subnet.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on Azure VMs WLS Subnet of Virtual Network pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-networking-vnet-wls-subnet.png":::

1. Save changes if you make any modifications. Return to **Networking** pane.
1. Select **Next** to go to the **Database** pane.

The following steps show you how to fill out the **Database** pane.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-database.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on Azure VMs Database pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-database.png":::

1. Select **Yes** for **Connect to database?**.
1. Select **Microsoft SQL Server (Support passwordless connection)** for **Choose database type**.
1. Enter *jdbc/WebLogicCafeDB* for **JNDI Name**.
1. For **DataSource Connection String**, Replace the placeholders with the values you wrote down from the preceding section for the primary SQL Database. For example, *jdbc:sqlserver://sqlserverprimary-ejb120623.database.windows.net:1433;database=mySampleDatabase*.
1. Select **None** for **Global transaction protocol**.
1. For **Database username**, Replace the placeholders with the values you wrote down from the preceding section for the primary SQL Database, for example, *azureuser@sqlserverprimary-ejb120623*.
1. Enter server admin login password you wrote down before for **Database Password**. Enter the same value for **Confirm password**. 
1. Leave the defaults for other fields.
1. Select **Review + create**. 

Wait until **Running final validation...** successfully completes, then select **Create**. After a while, you should see **Deployment** page where **Deployment is in progress** is displayed.

> [!NOTE]
> If you see any problems during **Running final validation...**, fix them and try again.

Depending on network conditions and other activity in your selected region, the deployment may take up to 50 minutes to complete. After that, you should see the text **Your deployment is complete** displayed on the deployment page.

In the meanwhile, you can set up the secondary WLS cluster in parallel.

### Set up the secondary WLS cluster

Follow the same steps in as in the section [Set up the primary WLS cluster](#set-up-the-primary-wls-cluster) to set up the secondary WLS cluster in East US region, except for the following differences:

1. In the "Basics" pane:
   1. In the **Resource group** field, select **Create new** and fill in a different unique value for the resource group. For example, *wls-cluster-eastus-ejb120623*.
   1. Under **Instance details**, select **East US** for **Region**.

1. In the "Networking" pane:
   1. For **Edit virtual network**, enter same address space of the virtual network as your primary WLS cluster. For example, *10.1.4.0/23*.

      > [!NOTE]
      > You should see a similar warning message *Address space '10.1.4.0/23 (10.1.4.0 - 10.1.5.255)' overlaps with address space '10.1.4.0/23 (10.1.4.0 - 10.1.5.255)' of virtual network 'wls-vnet'. Virtual networks with overlapping address space cannot be peered. If you intend to peer these virtual networks, change address space '10.1.4.0/23 (10.1.4.0 - 10.1.5.255)'*. Ignore it as you need two WLS clusters with the same network configuration.
   
   1. For **wls-subnet**, enter same starting address and subnet size as your primary WLS cluster. For example, *10.1.5.0* and */28*.

1. In the "Database" pane:
   1. For **DataSource Connection String**, Replace the placeholders with the values you wrote down from the preceding section for the secondary SQL Database. For example, *jdbc:sqlserver://sqlserversecondary-ejb120623.database.windows.net:1433;database=mySampleDatabase*.
   1. For **Database username**, Replace the placeholders with the values you wrote down from the preceding section for the secondary SQL Database, for example, *azureuser@sqlserversecondary-ejb120623*.

### Mirror network settings for two clusters

During the phase of resuming pending transactions in secondary WLS cluster after a failover, WLS checks the ownership of TLOG store. To successfully pass the check, all managed servers in the secondary cluster must have same private IP address as the primary cluster.

Follow instructions to mirror network settings from the primary cluster to the secondary cluster. 

First, configure network settings for the primary cluster after its deployment completes.

1. In **Overview** pane of the **Deployment** page, select **Go to resource group**.
1. Select network interface **adminVM_NIC_with_pub_ip**. 
   1. Under **Settings**, select **IP configurations**. 
   1. Select **ipconfig1**. 
   1. Under **Private IP address settings**, select **Static** for **Allocation**. Write down private IP address.
   1. Select **Save**.
1. Return to resource group of the primary WLS cluster, repeat step 3 for network interface **mspVM1_NIC_with_pub_ip**, **mspVM2_NIC_with_pub_ip**, and **mspVM3_NIC_with_pub_ip**.
1. Wait until all updates complete. You can select notifications icon from right-top of the Azure portal to open Notifications pane for status monitoring.

   :::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-notifications-icon.png" alt-text="Screenshot of the Azure portal notifications icon" lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-notifications-icon.png":::
1. Return to resource group of the primary WLS cluster, copy the name for resource with type **Private endpoint**, for example, *7e8c8bsaep*. Use that name to find the remaining network interface, for example, *7e8c8bsaep.nic.c0438c1a-1936-4b62-864c-6792eec3741a*. Select it and follow preceding instructions to write down its private IP address.

Then, configure network settings for the secondary cluster after its deployment completes.

1. In **Overview** pane of the **Deployment** page, select **Go to resource group**.
1. For network interface **adminVM_NIC_with_pub_ip**, **mspVM1_NIC_with_pub_ip**, **mspVM2_NIC_with_pub_ip**, and **mspVM3_NIC_with_pub_ip**, follow preceding instructions to update private IP address allocation to **Static**.
1. Wait until all updates complete.
1. For network interface **mspVM1_NIC_with_pub_ip**, **mspVM2_NIC_with_pub_ip**, and **mspVM3_NIC_with_pub_ip**, follow preceding instructions but update private IP address to the same value as of the primary cluster. Wait until the current update of netwrok interface completes before proceeding to next one. 

   > [!NOTE]
   > You can't change the private IP address of the network interface that is part of a private endpoint. To easily mirror the private IP addresses of network interfaces for managed servers, consider updating the private IP address for **adminVM_NIC_with_pub_ip** to an IP address that is not used. Depending on the allocation of private IP addresses in your two clusters, you may need to update the private IP address in the primary cluster as well.

Here is an example about mirroring network settings for two clusters:

| Cluster   | Network interface                                   | Private IP address (Before) | Private IP address (After) | Update sequence |
| --------- | --------------------------------------------------- | --------------------------- | -------------------------- | --------------- |
| Primary   | 7e8c8bsaep.nic.c0438c1a-1936-4b62-864c-6792eec3741a | 10.1.5.4                    | 10.1.5.4                   |                 |
| Primary   | adminVM_NIC_with_pub_ip                             | 10.1.5.7                    | 10.1.5.7                   |                 |
| Primary   | mspVM1_NIC_with_pub_ip                              | 10.1.5.5                    | 10.1.5.5                   |                 |
| Primary   | mspVM2_NIC_with_pub_ip                              | 10.1.5.8                    | 10.1.5.9                   | 1               |
| Primary   | mspVM3_NIC_with_pub_ip                              | 10.1.5.6                    | 10.1.5.6                   |                 |
| Secondary | 1696b0saep.nic.2e19bf46-9799-4acc-b64b-a2cd2f7a4ee1 | 10.1.5.8                    | 10.1.5.8                   |                 |
| Secondary | adminVM_NIC_with_pub_ip                             | 10.1.5.5                    | 10.1.5.4                   | 4               |
| Secondary | mspVM1_NIC_with_pub_ip                              | 10.1.5.7                    | 10.1.5.5                   | 5               |
| Secondary | mspVM2_NIC_with_pub_ip                              | 10.1.5.6                    | 10.1.5.9                   | 2               |
| Secondary | mspVM3_NIC_with_pub_ip                              | 10.1.5.4                    | 10.1.5.6                   | 3               |

Check the set of private IP addresses for all managed servers, which consists of the backend pool of the Azure Application Gateway you deployed in each cluster. If it's updated, update the Azure Application Gateway backend pool accordingly.

1. Open the resource group of the cluster.
1. Find resource *myAppGateway* with type **Application gateway**. Select to open
1. Under section **Settings**, select **Backend pools**. Select **myGatewayBackendPool**.
1. Change the **Backend targets** with the updated private IP address(es). Select **Save**. Wait until it completes.
1. Under section **Settings**, select **Health probes**. Select **HTTPhealthProbe**.
1. Make sure **I want to test the backend health before adding the health probe** is checked. Select **Test**. You should see **Status** of backend pool *myGatewayBackendPool* is marked as healthy. If not, check if private IP addresses are updated as expected and the VMs are running, then test the health probe again. You must troubleshoot and resolve the issue before continuing.

In this example, the Azure Application Gateway backend pool for each cluster is updated:

| Cluster   | Azure Application Gateway backend pool  | Backend targets (Before)       | Backend targets (After)        |
| --------- | --------------------------------------- | ------------------------------ | ------------------------------ |
| Primary   | myGatewayBackendPool                    | (10.1.5.5, 10.1.5.8, 10.1.5.6) | (10.1.5.5, 10.1.5.9, 10.1.5.6) |
| Secondary | myGatewayBackendPool                    | (10.1.5.7, 10.1.5.6, 10.1.5.4) | (10.1.5.5, 10.1.5.9, 10.1.5.6) |

To automate the network settings mirroring, consider using Azure CLI. See [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli) for more information.

### Verify deployments of clusters

You've deployed an Azure Application Gateway and a WLS admin server in each cluster. The Azure Application Gateway acts as load balancer for all managed servers in the cluster. The WLS admin server provides a web console for cluster configuration. 

Follow instructions to verify if the Azure Application Gateway and WLS admin console in each cluster work before moving to next step.

1. Return to the **Deployment** page, select **Outputs**.
1. Copy the value of property **appGatewayURL**. Append the string *weblogic/ready* and open that URL in a new browser tab. You should see an empty page without any error message. If not, you must troubleshoot and resolve the issue before continuing.
1. Copy and write down the value of property **adminConsole**. Open it in a new browser tab. You should see login page of **WebLogic Server Administration Console**. Sign in to the console with the user name and password for WebLogic administrator you wrote down before. If you aren't able to sign in, you must troubleshoot and resolve the issue before continuing.

Follow these steps to write down the IP address of the Azure Application Gateway for each cluster. You use these values when you set up the Azure Traffic Manager later.

1. Open the resource group where your cluster is deployed. For example, select **Overview** to switch back Overview pane of the deployment page, and select **Go to resource group**.
1. Find resource *gwip* with type **Public IP address**. Select to open. Look for **IP address** and write down its value.

## Set up an Azure Traffic Manager

In this section, you create an Azure Traffic Manager for distributing traffic to your public facing applications across the global Azure regions. The primary endpoint points to the Azure Application Gateway in the primary WLS cluster, and the secondary endpoint points to the Azure Application Gateway in the secondary WLS cluster.

Create an Azure Traffic Manager profile by following [Quickstart: Create a Traffic Manager profile using the Azure portal](/azure/traffic-manager/quickstart-create-traffic-manager-profile). You just need to execute some of sections: **Create a Traffic Manager profile**, **Add Traffic Manager endpoints**, and **Test Traffic Manager profile**. Use the following directions as you go through these sections, then return to this document after you create and configure the Azure Traffic Manager.

1. When you reach the section [Create a Traffic Manager profile](/azure/traffic-manager/quickstart-create-traffic-manager-profile#create-a-traffic-manager-profile):
   1. In step 2 **Create Traffic Manager profile**:
      * Write down the unique Traffic Manager profile name for **Name**. For example, *tmprofile-ejb120623*.
      * Write down the new resource group name for **Resource group**. For example, *myResourceGroupTM1*.

1. When you reach the section [Add Traffic Manager endpoints](/azure/traffic-manager/quickstart-create-traffic-manager-profile#add-traffic-manager-endpoints):
   1. After you open the Traffic Manager profile in step 2, in the **Configuration** page:
      1. Enter *10* for **DNS time to live (TTL)**.
      1. Under **Endpoint monitor settings**, enter */weblogic/ready* for **Path**.
      1. Under **Fast endpoint failover settings**, enter *10* for **Probing internal**, *3* for **Tolerated number of failures**, *5* for **Probe timeout**.
      1. Select **Save**. Wait until it completes.
   1. In step 4 for adding the primary endpoint *myPrimaryEndpoint*:
      * Select **Public IP address** for **Target resource type**.
      * Click the dropdown **Choose public IP address** and enter IP address of resource *gwip* deployed in **West US** WLS cluster you wrote down before, you should see one entry matched. Select it for **Public IP address**.
   1. In step 6 for adding a failover / secondary endpoint *myFailoverEndpoint*:
      * Select **Public IP address** for **Target resource type**.
      * Click dropdown **Choose public IP address** and enter IP address of resource *gwip* deployed in **East US** WLS cluster you wrote down before, you should see one entry matched. Select it for **Public IP address**.
   1. Wait for a while. Select **Refresh** until **Monitor status** of both endpoints is **Online**. 

1. When you reach the section [Test Traffic Manager profile](/azure/traffic-manager/quickstart-create-traffic-manager-profile#test-traffic-manager-profile):
   1. In subsection [Check the DNS name](/azure/traffic-manager/quickstart-create-traffic-manager-profile#check-the-dns-name):
      * In step 3, write down the DNS name of your Traffic Manager profile, for example, `http://tmprofile-ejb120623.trafficmanager.net`.
   1. In subsection [View Traffic Manager in action](/azure/traffic-manager/quickstart-create-traffic-manager-profile#view-traffic-manager-in-action):
      * In step 1 and 3, append */weblogic/ready* to the DNS name of your Traffic Manager profile in your web browser, for example, `http://tmprofile-ejb120623.trafficmanager.net/weblogic/ready`. You should see an empty page without any error message.
      * After completing all steps, make sure to **enable** your primary endpoint by referencing step 2, but replace **Disabled** with **Enabled**. Then return to **Endpoints** page.

Now you have both endpoints **Enabled** and **Online** in the Traffic Manager profile. Keep the page open and you use it for monitoring the endpoint status later.

## Configure WLS clusters for high availability and disaster recovery

In this section, you configure WLS clusters for high availability and disaster recovery.

### Prepare sample app

Build and package a sample CRUD Java/JakartaEE EE application that is deployed and running on WLS clusters for failover test later.

The app uses WebLogic Server [JDBC session persistence](https://github.com/Azure-Samples/azure-cafe/blob/main/weblogic-cafe/src/main/webapp/WEB-INF/weblogic.xml#L8) to store HTTP session data. The datasource *jdbc/WebLogicCafeDB* stores the session data to enable failover and load balancing across a cluster of WebLogic Servers. It configures [persistence schema](https://github.com/Azure-Samples/azure-cafe/blob/main/weblogic-cafe/src/main/resources/META-INF/persistence.xml#L7) to persist application data *coffee* in the same datasource *jdbc/WebLogicCafeDB*.

1. Check out the repository: `git clone https://github.com/Azure-Samples/azure-cafe.git`.
1. Locate the path where the repository was downloaded: `cd azure-cafe`.
1. Check out the tag corresponding to this article: `git checkout 20231206`. If you see a message about `Detached HEAD`, it's safe to ignore.
1. Change to its subdirectory *weblogic-cafe*: `cd weblogic-cafe`
1. Compile and package the sample application: `mvn clean package`.

The package should be successfully generated and located at `<parent-path-to-your-local-clone>/azure-cafe/weblogic-cafe/target/weblogic-cafe.war`. If you don't see the package, you must troubleshoot and resolve the issue before continuing.

### Deploy sample app

Now deploy sample app to clusters, starting from the primary cluster.

1. Open *adminConsole* of the cluster in a new tab of your web browser. Sign in to WebLogic Server Administration Console with the username and password of the WebLogic Administrator you wrote down before.
1. Locate **Domain structure** > **wlsd** > **Deployments** in the left navigation area. Select **Deployments**.
1. Select **Lock & Edit** > **Install** > **Upload your file(s)** > **Choose File**. Select *weblogic-cafe.war* you prepared previously. 
1. Select **Next** > **Next** > **Next**. Select **cluster1** with option **All servers in the cluster** for deployment targets. Select **Next** > **Finish**. Select **Activate Changes**.
1. Switch to **Control** tab and check **weblogic-cafe** from deployments table. Select **Start** with option **Servicing all requests** > **Yes**. Wait for a while and refresh the page, until you see the state of deployment *weblogic-cafe* is **Active**. Switch to **Monitoring** tab and verify that the context root of the deployed application is */weblogic-cafe*. Keep the WLS admin console open, you use it later for further configuration.

Repeat the same steps in WebLogic Server Administration Console, but for the secondary cluster in East US.

### Update Frontend Host

The steps in this section make your WLS clusters aware of the Azure Traffic Manager. Since the Azure Traffic Manager is the entry point for user requests, update the **Front Host** of the WebLogic Server cluster to the DNS name of the Traffic Manager profile, starting from the primary cluster.

1. Make sure you signed in to WebLogic Server Administration Console.
1. Locate to **Domain structure** > **wlsd** > **Environment** > **Clusters** in the left navigation area. Select **Clusters**.
1. Select **cluster1** from clusters table.
1. Select **Lock & Edit** > **HTTP**. Remove the current value for **Frontend Host**, and enter the DNS name of the Traffic Manager profile you wrote down before, without leading `http://`. For example, *tmprofile-ejb120623.trafficmanager.net*. Select **Save** > **Activate Changes**.

Repeat the same steps in WebLogic Server Administration Console, but for the secondary cluster in East US.

### Configure Transaction Log Store

Next, configure the JDBC Transaction Log Store for all managed servers of clusters, starting from the primary cluster. This practice is described in [Using Transaction Log Files to Recover Transactions](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/wljta/trxcon.html#GUID-7EFC9496-CC51-440D-885D-7E8B3C85FA15).

Do the following steps on the primary WLS cluster, in US West.

1. Make sure you signed in to WebLogic Server Administration Console.
1. Locate to **Domain structure** > **wlsd** > **Environment** > **Servers** in the left navigation area. Select **Servers**.
1. You should see server *msp1*, *msp2* and *msp3* listed in the servers table. 
1. Select **msp1** > **Services** > **Lock & Edit**. Under **Transaction Log Store**, select **JDBC**.
1. For **Type**, select **jdbc/WebLogicCafeDB** for **Data Source**.
1. Check the value for **Prefix Name** is *TLOG_msp1_* by default, change if not. 
1. Select **Save**.
1. Select **Servers** > **msp2**, and execute the same steps, except that the default value for **Prefix Name** is *TLOG_msp2_*.
1. Select **Servers** > **msp2**, and execute the same steps, except that the default value for **Prefix Name** is *TLOG_msp3_*.
1. Select **Activate Changes**.

Repeat the same steps in WebLogic Server Administration Console, but for the secondary cluster in East US.

### Restart managed servers of the primary cluster

Then, restart all managed servers of the primary cluster for the changes to take effect.

1. Ensure you are signed in to WebLogic Server Administration Console.
1. Locate to **Domain structure** > **wlsd** > **Environment** > **Servers** in the left navigation area. Select "Servers".
1. Select **Control** tab. Check *msp1*, *msp2* and *msp3*. Select **Shutdown** with option **When work completes** > **Yes**. Select refresh icon. Wait until **Status of Last Action** is *TASK COMPLETED*. You should see **State** for selected servers is *SHUTDOWN*. Select refresh icon again to stop status monitoring.
1. Check *msp1*, *msp2* and *msp3* again. Select **Start** > **Yes**. Select refresh icon. Wait until **Status of Last Action** is *TASK COMPLETED*. You should see **State** for selected servers is *RUNNING*. Select refresh icon again to stop status monitoring.

### Stop VMs in the secondary cluster

Now, stop all VMs in the secondary cluster to make it passive.

1. Open the Azure portal home in a new tab of your browser, select **All resources**. In **Filter for any field...** box, enter resource group name where the secondary cluster is deployed, for example, *wls-cluster-eastus-ejb120623*.
1. Select **Type equals all** to open **Type** filter. Enter *Virtual machine* for **Value**, you should see one entry matched. Select it for **Value**. Select **Apply**. You should see 4 VMs listed, including *adminVM*, *mspVM1*, *mspVM2*, and *mspVM3*.
1. Select to open each of VMs. Select **Stop** and confirm for each VM. 
1. Select notifications icon from right-top of the Azure portal to open **Notifications** pane.
1. Monitor event **Stopping virtual machine** for each VM until it becomes **Successfully stopped virtual machine**. Keep the page open and you use it for failover test later.

Now switch to the browser tab where you monitor endpoints' status of the Traffic Manager, refresh the page until you see endpoint *myFailoverEndpoint* is *Degraded* and endpoint *myPrimaryEndpoint* is *Online*.

### Verify app

Since the primary cluster is up and running, it acts as the active cluster and handles all user requests routed by your Traffic Manager profile.

Open the DNS name of your Azure Traffic Manager profile in a new tab of the browser, appending the context root */weblogic-cafe* of the deployed app, for example, `http://tmprofile-ejb120623.trafficmanager.net/weblogic-cafe`.
Create a new coffee with name and price (for example, *Coffee 1* with price *10*), which is persisted into both application data table and session table of the database. You should see the similar UI of the sample app:

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui.png" alt-text="Screenshot of the sample application UI." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui.png":::

If your UI doesn't look similar, troubleshoot and resolve the problem before continuing.

Keep the page open and you use it for failover test later.

## Test failover from primary to secondary

To test failover, you manually fail your primary database server and cluster over to the secondary database server and cluster, and then fail back using the Azure portal in this section.

### Failover to the secondary site

First, shutdown VMs in the primary cluster.

1. Find the name of your resource group where the primary WLS cluster is deployed, for example, *wls-cluster-westus-ejb120623*. Then follow similar instructions in [Stop VMs in the secondary cluster](#stop-vms-in-the-secondary-cluster), but change the target resource group to your primary WLS cluster, to stop all VMs in that cluster.
1. Switch to the browser tab of your Traffic Manager, refresh the page until you see **Monitor status** of endpoint *myPrimaryEndpoint* becomes *Degraded*.
1. Switch to the browser tab of the sample app, refresh the page, you should see *504 Gateway Time-out* or *502 Bad Gateway* as none of endpoints is accessible.

Next, failover the Azure SQL Database from the primary server to the secondary server.

1. Switch to the browser tab of your Azure SQL Database failover group. 
1. Select **Failover** > **Yes**. 
1. Wait until it completes.

Then, start all servers in the secondary cluster.

1. Switch to the browser tab where you stopped all VMs in the secondary cluster.
1. Select VM **adminVM**. Select **Start**. 
1. Monitor event **Starting virtual machine** for *adminVM* in **Notifications** pane, wait until it becomes **Started virtual machine**.
1. Switch to the browser tab of WebLogic Server AdministrationConsole for the secondary cluster, refresh the page until you see the welcome page for login.
1. Switch back to the browser tab where all VMs in the secondary cluster are listed. For VM *mspVM1*, *mspVM2* and *mspVM3*, select to open and then select **Start**. 
1. Monitor events **Starting virtual machine** for VM *mspVM1*, *mspVM2* and *mspVM3* in **Notifications** pane, wait until they become **Started virtual machine**.

Finally, verify the sample app after endpoint *myFailoverEndpoint* is *Online*.

1. Switch to the browser tab of your Traffic Manager, refresh the page until you see **Monitor status** of endpoint *myFailoverEndpoint* becomes *Online*.
1. Switch to the browser tab of the sample app, refresh the page, you should see the same data persisted in application data table and session table displayed in the UI.

   :::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui.png" alt-text="Screenshot of the sample application UI after failover." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui.png":::

   If you don't observe this behavior, it may be because the Traffic Manager is taking time to update DNS to point to the failover site. The problem could also be your browser has cached the DNS name resolution result that points to the failed site. Wait for a while and refresh the page again.

To automate the failover, consider using alerts on Traffic Manager metrics and Azure Automation. See [Alerts on Traffic Manager metrics](/azure/traffic-manager/traffic-manager-metrics-alerts#alerts-on-traffic-manager-metrics) and [Use an alert to trigger an Azure Automation runbook](/azure/automation/automation-create-alert-triggered-runbook) for more information.

### Fail back to the primary site

Execute the same steps in [Failover to the secondary site](#failover-to-the-secondary-site) to failback to the primary site including database server and cluster, except for the following differences:

1. First, shutdown VMs in the **secondary cluster**. You should see endpoint **myFailoverEndpoint** becomes *Degraded*.
1. Next, failover the Azure SQL Database **from the secondary server to the primary server**.
1. Then, start all servers in the **primary cluster**.
1. Finally, verify the sample app after endpoint **myPrimaryEndpoint** is *Online*.

## Clean up resources

If you're not going to continue to use the WLS clusters and other components, delete the resource groups to clean up the resources used in this tutorial.

1. Enter the resource group name of Azure SQL Database servers (for example, **myResourceGroup**) in the search box at the top of the Azure portal, and select the matched resource group from the search results.
1. Select **Delete resource group**.
1. In **Enter resource group name to confirm deletion**, enter the resource group name.
1. Select **Delete**.
1. Repeat steps 1-4 for the resource group of the Traffic Manager, for example, **myResourceGroupTM1**.
1. Repeat steps 1-4 for the resource group of the primary WLS cluster, for example, **wls-cluster-westus-ejb120623**.
1. Repeat steps 1-4 for the resource group of the secondary WLS cluster, for example, **wls-cluster-eastus-ejb120623**.

## Next steps

In this tutorial, you set up a HA/DR solution consisting of an active-passive application infrastructure tier with an active-passive database tier, and in which both tiers span two geographically different sites. At the first site, both the application infrastructure tier and the database tier are active. At the second site, the secondary domain is shutdown, and the secondary database is on standby.

Continue to explore references for more options to build HA/DR solutions and run WLS on Azure.

> [!div class="nextstepaction"]
> [Disaster Recovery solutions for Oracle Fusion Middleware products](https://docs.oracle.com/en/middleware/fusion-middleware/12.2.1.4/asdrg/index.html#Oracle%C2%AE-Fusion-Middleware)
> [!div class="nextstepaction"]
> [Azure reliability documentation](/azure/reliability)
> [!div class="nextstepaction"]
> [Build solutions for high availability](/azure/architecture/high-availability/building-solutions-for-high-availability)
> [!div class="nextstepaction"]
> [Automatic failover using Azure Traffic Manager](/azure/networking/disaster-recovery-dns-traffic-manager#automatic-failover-using-azure-traffic-manager)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure VMs](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks)

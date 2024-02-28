---
title: "Tutorial: Migrate WebSphere Server to Azure Virtual Machines with high availability and disaster recovery"
description: Shows how to deploy WebSphere Server to Azure Virtual Machines with high availability and disaster recovery.
author: KarlErickson
ms.author: jiangma
ms.topic: tutorial
ms.date: 02/26/2024
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-websphere, devx-track-javaee-was, devx-track-javaee-was-vm, migration-java, devx-track-extended-java
---

# Tutorial: Migrate WebSphere Server to Azure Virtual Machines with high availability and disaster recovery

This tutorial shows you a simple and effective way to implement high availability and disaster recovery (HA/DR) for Java using WebSphere Server on Azure Virtual Machines (VMs). The solution illustrates how to achieve a low Recovery Time Objective (RTO) and Recovery Point Objective (RPO) using a simple database driven Jakarta EE application running on WebSphere. HA/DR is a complex topic, with many possible solutions. The best solution depends on your unique requirements. For other ways to implement HA/DR, see the resources at the end of this article.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Use Azure optimized best practices to achieve high availability and disaster recovery.
> * Set up a Microsoft Azure SQL Database failover group in paired regions.
> * Set up the primary WebSphere clusters on Azure VMs.
> * Configure Azure Site Recovery for high availability and disaster recovery.
> * Set up an Azure Traffic Manager.
> * Test failover from primary to secondary.

The following diagram illustrates the architecture you build:

<!-- TODO: Diagram source https://github.com/Azure-Samples/azure-cafe/blob/main/diagrams/websphere-on-vms-ha-dr-solution-architecture.pptx -->
:::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/solution-architecture.png" alt-text="Diagram of the solution architecture of WebSphere on Azure VMs with high availability and disaster recovery." lightbox="media/migrate-websphere-to-vms-with-ha-dr/solution-architecture.png" border="false":::

Azure Traffic Manager checks the health of your regions and routes the traffic accordingly to the application tier. The primary region has a full deployment of the WebSphere cluster. After the primary region is protected, the secondary region is restored during the failover using the Azure Site Recovery. As a result, the primary region is actively servicing network requests from the users. The secondary region is passive and activated to receive traffic only when the primary region experiences a service disruption. Azure Traffic Manager uses the health check feature of the Azure Application Gateway to implement this conditional routing. The geo-failover RTO of the application tier depends on the time for shutting down the primary cluster, restoring the secondary cluster, and starting VMs and running the secondary WebSphere cluster. The RPO depends on the replication policy of the Azure Site Recovery and Azure SQL Database because the cluster data is stored and replicated in the local storage of the VMs and application data is persisted and replicated in the Azure SQL Database failover group.

The database tier consists of an Azure SQL Database failover group with a primary server and a secondary server. The read/write listener endpoint always points to the primary server and is connected to WebSphere cluster in each region. A geo-failover switches all secondary databases in the group to the primary role. For geo-failover RPO and RTO of Azure SQL Database, see [Overview of Business Continuity](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview?view=azuresql-db&preserve-view=true).

This tutorial was written with the Azure Site Recovery and Azure SQL Database service because the tutorial relies on the HA features of these services. Other database choices are possible, but the HA features of whatever database you chose must be considered.

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* Make sure you have the `Contributor` role in the subscription. You can verify the assignment by following the steps in [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal).
* Prepare a local machine with Windows, Linux, or macOS installed.
* Install and set up [Git](/devops/develop/git/install-and-set-up-git).
* Install a Java SE implementation, version 17 or later (for example, [the Microsoft build of OpenJDK](/java/openjdk)).
* Install [Maven](https://maven.apache.org/download.cgi), version 3.9.3 or later.

## Set up an Azure SQL Database failover group in paired regions

In this section, you create an Azure SQL Database failover group in paired regions for use with your WebSphere clusters and app. In a later section, you configure WebSphere to store its session data to this database. This practice referneces [Creating a table for session persistence](https://www.ibm.com/docs/en/was-nd/9.0.5?topic=persistence-creating-table-session).

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

      The database table *sessions* is used for storing session data for your WebSphere app. The WebSphere cluster data including transaction logs is persisted to local storage of VMs where the cluser is deployed.

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

In this section, you create the primary WebSphere clusters on Azure VMs using the [IBM WebSphere Application Server Cluster on Azure VMs](https://aka.ms/twas-cluster-portal) offer. The secondary cluster is restored from the primary cluster during the failover using the Azure Site Recovery later.

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
1. For **Data source connection string (jdbc:sqlserver://\<host\>:\<port\>;database=\<database\>)**, replace the placeholders with the values you wrote down from the preceding section for the failover group of Azure SQL Database - for example, *jdbc:sqlserver://failovergroup-mjg022624.database.windows.net:1433;database=mySampleDatabase*.
1. For **Database username**, enter the server admin login name and the failover group name you wrote down from the preceding section - for example, *azureuser@failovergroup-mjg022624*.
1. Enter the server admin sign-in password that you wrote down before for **Database Password**. Enter the same value for **Confirm password**.
1. Leave the defaults for the other fields.
1. Select **Review + create**.
1. Wait until **Running final validation...** successfully completes, then select **Create**.

:::image type="content" source="media/migrate-websphere-to-vms-with-ha-dr/portal-database.png" alt-text="Screenshot of the Azure portal that shows the IBM WebSphere Application Server Cluster on Azure VMs Database pane." lightbox="media/migrate-websphere-to-vms-with-ha-dr/portal-database.png":::

After a while, you should see the **Deployment** page where **Deployment is in progress** is displayed.

> [!NOTE]
> If you see any problems during **Running final validation...**, fix them and try again.

Depending on network conditions and other activity in your selected region, the deployment can take up to 25 minutes to complete. After that, you should see the text **Your deployment is complete** displayed on the deployment page.

## Next steps

In this tutorial, you set up an HA/DR solution consisting of an active-passive application infrastructure tier with an active-passive database tier, and in which both tiers span two geographically different sites. At the first site, both the application infrastructure tier and the database tier are active. At the second site, the secondary domain is restored with the Azure Site Recovery service, and the secondary database is on standby.

Continue to explore the following references for more options to build HA/DR solutions and run WebSphere on Azure:

> [!div class="nextstepaction"]
> [Azure reliability documentation](/azure/reliability)
> [!div class="nextstepaction"]
> [Build solutions for high availability](/azure/architecture/high-availability/building-solutions-for-high-availability)
> [!div class="nextstepaction"]
> [Automatic failover using Azure Traffic Manager](/azure/networking/disaster-recovery-dns-traffic-manager#automatic-failover-using-azure-traffic-manager)
> [!div class="nextstepaction"]
> [Learn more about WebSphere on Azure](../ee/websphere-family.md)

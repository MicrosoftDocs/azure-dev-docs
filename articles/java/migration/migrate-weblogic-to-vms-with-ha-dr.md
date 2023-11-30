---
title: "Tutorial: Migrate Oracle WebLogic Server to Azure Virtual Machines with high availability and disaster recovery"
description: Shows how to deploy WebLogic Server to Azure Virtual Machines with high availability and disaster recovery.
author: KarlErickson
ms.author: jiangma
ms.topic: how-to
ms.date: 11/30/2023
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java,, devx-track-azurecli, devx-track-extended-java
---

# Tutorial: Migrate Oracle WebLogic Server to Azure Virtual Machines with high availability and disaster recovery

This tutorial shows you how to deploy the Oracle WebLogic Server (WLS) on Azure Virtual Machines (VMs) that integrates with Azure SQL Database and Azure Traffic Manager for high availability and disaster recovery.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/solution-architecture.png" alt-text="Solution architecture of WLS on Azure VMs with high availability and disaster recovery." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/solution-architecture.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Setup an Azure SQL Database failover group in paired regions, which allows you to manage the replication and failover of databases to another Azure region.
> - Setup active and passive WLS clusters on Azure VMs, where your application workload will be deployed and running.
> - Setup an Azure Traffic Manager, which allows you to distribute traffic to your public facing applications across the global Azure regions.
> - Configure active and passive WLS clusters for high availability and disaster recovery.
> - Validate the solution.

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* Make sure you've been assigned either the `Owner` role or the `Contributor` and `User Access Administrator` roles in the subscription. You can verify the assignment by following the steps in [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal).
* Prepare a local machine with either Windows, Linux or macOS installed.
* Install and set up [Git](/devops/develop/git/install-and-set-up-git).
* Install a Java SE implementation, version 17 or later (for example, [Eclipse Open J9](https://www.eclipse.org/openj9/)).
* Install [Maven](https://maven.apache.org/download.cgi) 3.9.3 or higher.

## Setup an Azure SQL Database failover group in paired regions

In this section, you create an Azure SQL Database failover group in paired regions for use with your WLS clusters and app.

Create a single database in Azure SQL Database and add it to an auto-failover grup by following the Azure portal steps in [Tutorial: Add an Azure SQL Database to an auto-failover group](/azure/azure-sql/database/failover-group-add-single-database-tutorial?view=azuresql-db&preserve-view=true&tabs=azure-portal). Execute the steps up to, but not including **Clean up resources**. Use the following directions as you go through the article, then return to this document after you create and configure the Azure SQL Database failover group.

1. When you reach the section [1 - Create a database](/azure/azure-sql/database/failover-group-add-single-database-tutorial?view=azuresql-db&preserve-view=true&tabs=azure-portal#1---create-a-database):
   * In step 8 for database details, write down **Database name**. For example, *mySampleDatabase*.
   * In step 9 for creating the primary server:
     * Write down **Server admin login**. For example, *azureuser*.
     * Write down **Password**.
     * Select **(US) West US** for **Location**.
   * In step 12 for **Networking** configuration, select **Yes** for **Allow Azure services and resources to access this server**.

1. When you reach the section [2 - Create the failover group](/azure/azure-sql/database/failover-group-add-single-database-tutorial?view=azuresql-db&preserve-view=true&tabs=azure-portal#2---create-the-failover-group):
   * In step 5 for creating the **Failover group**, write down the unique name for **Failover group name**. For example, *failovergroup-ejb113023*.
   * In step 5 for creating the secondary server, select **(US) East US** for **Location**. Make sure **Allow Azure services to access server** is checked.

After you create the Azure SQL Database failover group, open the SQL database of the primary server. 

1. In the **Query editor (preview)** pane, enter **azureuser** for **Login**, server admin login password you wrote down before for **Password**, and select **OK**. You should see **Query editor** window after successful login.

   > [!NOTE]
   > If login failed with the similar error message **Client with IP address 'xx.xx.xx.xx' is not allowed to access the server**, select **Allowlist IP xx.xx.xx.xx on server \<your-sqlserver-name\>** at the end of the error message. Wait until server firewall rules updates complete and select **OK** again.

1. Copy and paste the following SQL query to the editor, and select **Run**. You should see message **Query succeeded: Affected rows: 0** after successful run.

   ```sql
   create table TLOG_msp1_primary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
   create table TLOG_msp2_primary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
   create table TLOG_msp3_primary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
   create table TLOG_msp1_secondary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
   create table TLOG_msp2_secondary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
   create table TLOG_msp3_secondary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
   create table wl_servlet_sessions (wl_id VARCHAR(100) NOT NULL, wl_context_path VARCHAR(100) NOT NULL, wl_is_new CHAR(1), wl_create_time DECIMAL(20), wl_is_valid CHAR(1), wl_session_values VARBINARY(MAX), wl_access_time DECIMAL(20), wl_max_inactive_interval INTEGER, PRIMARY KEY (wl_id, wl_context_path));
   ```

   These database tables are used for storing transaction logs and sessions data for your WLS clusters and app later.

## Setup active and passive WLS clusters on Azure VMs

In this section, you create two WLS clusters on Azure VMs using [Oracle WebLogic Server Cluster on Azure VMs](https://portal.azure.com/#create/oracle.20191007-arm-oraclelinux-wls-cluster20191007-arm-oraclelinux-wls-cluster) offer. The cluster in West US is active and handing the user requests. Oppositely, the cluster in East US is passive and shutdown.

### Setup the active WLS cluster

First, open [Oracle WebLogic Server Cluster on Azure VMs](https://portal.azure.com/#create/oracle.20191007-arm-oraclelinux-wls-cluster20191007-arm-oraclelinux-wls-cluster) offer in your browser and select **Create**. You should see **Basics** pane of the offer.

The following steps show you how to fill out the **Basics** pane shown in the following screenshot.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-basics.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on Azure VMs Basics pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-basics.png":::

1. Ensure that the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a unique value for the resource group. For example, *wls-cluster-westus-ejb113023*.
1. Under **Instance details**, select **West US** for **Region**.
1. Under **Credentials for Virtual Machines and WebLogic**, provide a password for **admin account of VM** and **WebLogic Administrator**, respectively.
1. Leave the defaults for other fields.
1. Select **Next** to **TLS/SSL Configuration** pane.

Leave the defaults in **TLS/SSL Configuration** pane, select **Next** to **Azure Application Gateway** pane.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-azure-app-gateway.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on Azure VMs Azure Application Gateway pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-azure-app-gateway.png":::

1. Select **Yes** for **Connect to Azure Application Gateway?**.
1. Select **Generate a self-signed certificate** for **Select desired TLS/SSL certificate option**.
1. Select **Next** to **Networking** pane.

You should see all fields are prepopulated with the defaults, select **Next** to **Database** pane.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-database.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on Azure VMs Database pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-database.png":::

1. Select **Yes** for **Connect to database?**.
1. Select **Microsoft SQL Server (Support passwordless connection)** for **Choose database type**.
1. Enter *jdbc/WebLogicCafeDB* for **JNDI Name**.
1. Replace the placeholders in datasource connection string (*jdbc:sqlserver://<failover-group-name>.database.windows.net:1433;database=<database-name>*) with valid values you wrote down before, for example, *jdbc:sqlserver://failovergroup-ejb113023.database.windows.net:1433;database=mySampleDatabase*. Enter it for **DataSource Connection String**.
1. Select **None** for **Global transaction protocal**.
1. Replace the placeholders in database username (*<server-admin-login>@<failover-group-name>*) with valid values you wrote down before, for example, *azureuser@failovergroup-ejb113023*. Enter it for **Database username**.
1. Enter server admin login password you wrote down before for **Database Password**. Enter the same value for **Confirm password**. 
1. Leave the defaults for other fields.
1. Select **Review + create**. 

Wait until **Running final validation...** successfully completes, then select **Create**. You should see **Deployment is in progress** page.

> [!NOTE]
> If you see any problems during **Running final validation...**, fix them and try again.

Depending on network conditions and other activity in your selected region, the deployment may take up to 50 minutes to complete. After that, you should see the text **Your deployment is complete** displayed on the deployment page.

In the meanwhile, you can setup the passive WLS cluster in parallel.

### Setup the passive WLS cluster

Follow the same steps in section [Setup the active WLS cluster](#setup-the-active-wls-cluster) to setup the passive WLS cluser in East US region, except the following differences:

1. In the "Basics" pane:
   1. In the **Resource group** field, select **Create new** and fill in a differernt unique value for the resource group. For example, *wls-cluster-eastus-ejb113023*.
   1. Under **Instance details**, select **East US** for **Region**.

## Next steps

Continue to explore options to run WLS on Azure.

> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure VMs](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks)

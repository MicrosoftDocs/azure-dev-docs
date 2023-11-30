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

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/wls-on-vms-solution-architecture.png" alt-text="Solution architecture of WLS on Azure VMs with high availability and disaster recovery." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/wls-on-vms-solution-architecture.png":::

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

Create a single database in Azure SQL Database and add it to an auto-failover grup by following the Azure portal steps in [Tutorial: Add an Azure SQL Database to an auto-failover group](/azure/azure-sql/database/failover-group-add-single-database-tutorial?view=azuresql-db&tabs=azure-portal). Execute the steps up to, but not including **Clean up resources**. Use the following directions as you go through the article, then return to this document after you create and configure the Azure SQL Database failover group.

1. When you reach the section [1 - Create a database](/azure/azure-sql/database/failover-group-add-single-database-tutorial?view=azuresql-db&tabs=azure-portal#1---create-a-database)
   * In step 9 for creating the primary server, select **(US) West US** for **Location** in the **New server** form. Write down the **Password** for **Server admin login** `azureuser`.
   * In step 12 for **Networking** configuration, select **Yes** for **Allow Azure services and resources to access this server**.

1. When you reach the section [2 - Create the failover group](/azure/azure-sql/database/failover-group-add-single-database-tutorial?view=azuresql-db&tabs=azure-portal#2---create-the-failover-group)
   * In step 5 for creating the **Failover group**, write down **Failover group name**. 
   * In step 5 for creating the secondary server, select **(US) East US** for **Location**. Make sure **Allow Azure services to access server** is checked.

After you create the Azure SQL Database failover group, open the SQL database of the primary server. 

1. In the **Query editor (preview)** pane, enter **azureuser** for **Login**, server admin login password you wrote down before for **Password**, and select **OK**. You should see **Query editor** window after successful login.

   > [!NOTE]
   > If login failed with the similar error message **Client with IP address 'xx.xx.xx.xx' is not allowed to access the server**, select **Allowlist IP xx.xx.xx.xx on server <your-sqlserver-name>** at the end of the error message. Wait until server firewall rules updates complete and select **OK** again.

1. Copy and paste the following SQL query to the editor, and select **Run**. You should see message **Query succeeded: Affected rows: 0** after successful run.

   ```
   create table TLOG_msp1_primary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
   create table TLOG_msp2_primary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
   create table TLOG_msp3_primary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
   create table TLOG_msp1_secondary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
   create table TLOG_msp2_secondary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
   create table TLOG_msp3_secondary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
   create table wl_servlet_sessions (wl_id VARCHAR(100) NOT NULL, wl_context_path VARCHAR(100) NOT NULL, wl_is_new CHAR(1), wl_create_time DECIMAL(20), wl_is_valid CHAR(1), wl_session_values VARBINARY(MAX), wl_access_time DECIMAL(20), wl_max_inactive_interval INTEGER, PRIMARY KEY (wl_id, wl_context_path));
   ```

   These database tables are used for storing transaction logs and sessions data for your WLS clusters and app later.

## Next steps

Continue to explore options to run WLS on Azure.

> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure VMs](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks)

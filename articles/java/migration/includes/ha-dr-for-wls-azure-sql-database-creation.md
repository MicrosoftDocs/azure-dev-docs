---
author: KarlErickson
ms.author: haiche
ms.date: 04/29/2024
---

In this section, you create an Azure SQL Database failover group in paired regions for use with your WLS clusters and app. In a later section, you configure WLS to store its session data and transaction log (TLOG) data to this database. This practice is consistent with Oracle's Maximum Availability Architecture (MAA). This guidance provides an Azure adaptation for MAA. For more information on MAA, see [Oracle Maximum Availability Architecture](https://www.oracle.com/database/technologies/maximum-availability-architecture/).

First, create the primary Azure SQL Database by following the Azure portal steps in [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal). Follow the steps up to, but not including, the "Clean up resources" section. Use the following directions as you go through the article, then return to this article after you create and configure the Azure SQL Database:

1. When you reach the section [Create a single database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal#create-a-single-database), use the following steps:
   1. In step 4 for creating new resource group, save aside the **Resource group name** value - for example, *myResourceGroup*.
   1. In step 5 for database name, save aside the **Database name** value - for example, *mySampleDatabase*.
   1. In step 6 for creating the server, use the following steps:
      1. Save aside the unique server name - for example, *sqlserverprimary-ejb120623*.
      1. For **Location**, select **(US) East US**.
      1. For **Authentication method**, select **Use SQL authentication**.
      1. Save aside the **Server admin login** value - for example, *azureuser*.
      1. Save aside the **Password** value.
   1. In step 8, for **Workload environment**, select **Development**. Look at the description and consider other options for your workload.
   1. In step 11, for **Backup storage redundancy**, select **Locally-redundant backup storage**. Consider other options for your backups. For more information, see the [Backup storage redundancy](/azure/azure-sql/database/automated-backups-overview?view=azuresql-db&preserve-view=true#backup-storage-redundancy) section of [Automated backups in Azure SQL Database](/azure/azure-sql/database/automated-backups-overview?view=azuresql-db&preserve-view=true).
   1. In step 14, in the **Firewall rules** configuration, for **Allow Azure services and resources to access this server**, select **Yes**.

1. When you reach the section [Query the database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal#query-the-database), use the following steps:
   1. In step 3, enter your **SQL authentication** server admin sign-in information to sign in.

      > [!NOTE]
      > If sign-in fails with an error message similar to **Client with IP address 'xx.xx.xx.xx' is not allowed to access the server**, select **Allowlist IP xx.xx.xx.xx on server \<your-sqlserver-name\>** at the end of the error message. Wait until the server firewall rules complete updating, then select **OK** again.

   1. After you run the sample query in step 5, clear the editor and create tables.

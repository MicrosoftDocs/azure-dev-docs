---
author: KarlErickson
ms.author: zhihaoguo
ms.date: 11/28/2024
---

First, create the primary Azure SQL Database by following the Azure portal steps in [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal). Follow the steps up to, but not including **Clean up resources**. Use the following directions as you go through the article, then return to this article after you create and configure the Azure SQL Database.

When you reach the section [Create a single database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal#create-a-single-database), use the following steps:
1. In step 4 for creating new resource group, write down the **Resource group name** value - for example, `sqlserver-rg-gzh032124`.
1. In step 5 for database name, write down the **Database name** value - for example, `mySampleDatabase`.
1. In step 6 for creating the server, use the following steps:
    1. Fill in a unique server name - for example, `sqlserverprimary-gzh032124`.
    1. For **Location**, select **(US) East US**.
    1. For **Authentication method**, select **Use SQL authentication**.
    1. Write down the **Server admin login** value - for example, `azureuser`.
    1. Write down the **Password** value.
1. In step 8, for **Workload environment**, select **Development**. Look at the description and consider other options for your workload.
1. In step 10, for **Compute tier**, select **Provisioned**.
1. In step 11, for **Backup storage redundancy**, select **Locally-redundant backup storage**. Consider other options for your backups. For more information, see the [Backup storage redundancy](/azure/azure-sql/database/automated-backups-overview?view=azuresql-db&preserve-view=true#backup-storage-redundancy) section of [Automated backups in Azure SQL Database](/azure/azure-sql/database/automated-backups-overview?view=azuresql-db&preserve-view=true).
1. In step 14, in the **Firewall rules** configuration, for **Allow Azure services and resources to access this server**, select **Yes**.

1. When you reach the section [Query the database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal#query-the-database), use the following steps instead of the steps in the other article:
    1. In step 3, enter your **SQL authentication** server admin sign-in information to sign in.

       > [!NOTE]
       > If sign-in fails with an error message similar to **Client with IP address 'xx.xx.xx.xx' is not allowed to access the server**, select **Allowlist IP xx.xx.xx.xx on server \<your-sqlserver-name\>** at the end of the error message. Wait until the server firewall rules complete updating, then select **OK** again.

    1. After you run the sample query in step 5, clear the editor and enter the following query, then select **Run** again:

       ```sql
         CREATE TABLE ispn_entry_sessions_javaee_cafe_war (
           id VARCHAR(255) PRIMARY KEY,  -- ID Column to hold cache entry ids
           data VARBINARY(MAX),          -- Data Column to hold cache entry data
           timestamp BIGINT,             -- Timestamp Column to hold cache entry timestamps
           segment INT
           );
       ```

       After a successful run, you should see the message **Query succeeded: Affected rows: 0**.

       The database table `ispn_entry_sessions_javaee_cafe_war` is used for storing session data for your JBoss EAP cluster.

Then, create an Azure SQL Database failover group by following the Azure portal steps in [Configure a failover group for Azure SQL Database](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db). You just need the following sections: [Create failover group](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#create-failover-group) and [Test planned failover](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#test-planned-failover). Use the following steps as you go through the article, then return to this article after you create and configure the Azure SQL Database failover group:

1. When you reach the section [Create failover group](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#create-failover-group), use the following steps:
    1. In step 5 for creating the failover group, enter and write down the unique failover group name - for example, `failovergroup-gzh032124`.
    1. In step 5 for configuring the server, select the option to create a new secondary server and then use the following steps:
        1. Enter a unique server name - for example, `sqlserversecondary-gzh032124`.
        1. Enter the same server admin and password as your primary server.
        1. For **Location**, select **(US) West US 2**.
        1. Make sure **Allow Azure services to access server** is selected.
    1. In step 5 for configuring the **Databases within the group**, select the database you created in the primary server - for example, `mySampleDatabase`.
2. After you complete all the steps in the section [Test planned failover](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#test-planned-failover), keep the failover group page open and use it for the failover test of the JBoss EAP clusters later.

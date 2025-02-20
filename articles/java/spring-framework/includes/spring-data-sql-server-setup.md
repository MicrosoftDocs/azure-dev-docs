---
ms.date: 02/22/2023
author: KarlErickson
ms.author: seal
---

## Configure a firewall rule for your Azure SQL Database server

Azure SQL Database instances are secured by default. They have a firewall that doesn't allow any incoming connection.

To be able to use your database, open the server's firewall to allow the local IP address to access the database server. For more information, see [Tutorial: Secure a database in Azure SQL Database](/azure/azure-sql/database/secure-database-tutorial).

If you're connecting to your Azure SQL Database server from Windows Subsystem for Linux (WSL) on a Windows computer, you need to add the WSL host ID to your firewall.

## Create an SQL database non-admin user and grant permission

This step will create a non-admin user and grant all permissions on the `demo` database to it.

### [Passwordless (Recommended)](#tab/passwordless)

To use passwordless connections, see [Tutorial: Secure a database in Azure SQL Database](/azure/azure-sql/database/secure-database-tutorial) or use Service Connector to create a Microsoft Entra admin user for your Azure SQL Database server, as shown in the following steps:

1. First, install the [Service Connector](/azure/service-connector/overview) passwordless extension for the Azure CLI:

   ```azurecli
   az extension add --name serviceconnector-passwordless --upgrade
   ```

1. Then, use the following command to create the Microsoft Entra non-admin user:

   ```azurecli
   az connection create sql \
       --resource-group <your-resource-group-name> \
       --connection sql_conn \
       --target-resource-group <your-resource-group-name> \
       --server sqlservertest \
       --database demo \
       --user-account \
       --query authInfo.userName \
       --output tsv
   ```

The Microsoft Entra admin you created is an SQL database admin user, so you don't need to create a new user.

> [!IMPORTANT]
> Azure SQL database passwordless connections require upgrading the [MS SQL Server Driver](https://mvnrepository.com/artifact/com.microsoft.sqlserver/mssql-jdbc) to version `12.1.0` or higher. The connection option is `authentication=DefaultAzureCredential` in version `12.1.0` and `authentication=ActiveDirectoryDefault` in version `12.2.0`.

### [Password](#tab/password)

1. First, create a SQL script called **create_user.sql** for creating a non-admin user. Add the following contents and save it locally:

   ```bash
   cat << EOF > create_user.sql
   USE demo;
   GO
   CREATE USER <your_sql_server_non_admin_username> WITH PASSWORD='<your_sql_server_non_admin_password>'
   GO
   GRANT CONTROL ON DATABASE::demo TO <your_sql_server_non_admin_username>;
   GO
   EOF
   ```

1. Then, use the following command to run the SQL script to create the non-admin user:

   ```bash
   sqlcmd -S sqlservertest.database.windows.net,1433 -d demo -U <your_sql_server_admin_username> -P <your_sql_server_admin_password> -i create_user.sql
   ```

> [!NOTE]
> For more information about creating SQL database users, see [CREATE USER (Transact-SQL)](/sql/t-sql/statements/create-user-transact-sql).

---

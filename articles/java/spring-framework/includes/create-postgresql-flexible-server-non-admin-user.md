---
author: KarlErickson
ms.date: 04/19/2023
ms.author: seal
---

### [Service Connector (Recommended)](#tab/service-connector)

1. Use the following command to install the [Service Connector](/azure/service-connector/overview) passwordless extension for the Azure CLI:

   ```azurecli
    az extension add --name serviceconnector-passwordless --upgrade
   ```

1. Use the following command to create the Microsoft Entra non-admin user:

   ```azurecli
     az connection create postgres-flexible \
          --resource-group <your_resource_group_name> \
          --connection postgres_conn \
          --target-resource-group <your_resource_group_name> \
          --server postgresqlflexibletest \
          --database demo \
          --user-account \
          --query authInfo.userName \
          --output tsv
    ```

   When the command completes, take note of the username in the console output.

### [Manual configuration](#tab/manual)

> [!IMPORTANT]
> To use passwordless connections, configure the Microsoft Entra admin user for your Azure Database for PostgreSQL Flexible Server instance. For more information, see [Manage Microsoft Entra roles in Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/how-to-manage-azure-ad-users).

Create a SQL script called **create_ad_user.sql** for creating a non-admin user. Add the following contents and save it locally:

```bash
cat << EOF > create_ad_user.sql
select * from pgaadauth_create_principal('<your_postgresql_ad_non_admin_username>', false, false);
EOF
```

Then, use the following command to run the SQL script to create the Microsoft Entra non-admin user:

```bash
psql "host=postgresqlflexibletest.postgres.database.azure.com user=<your_postgresql_ad_admin_username> dbname=postgres port=5432 password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken) sslmode=require" < create_ad_user.sql
```

> [!TIP]
> To use Microsoft Entra authentication to connect to Azure Database for PostgreSQL, you need to sign in with the Microsoft Entra admin user you set up, and then get the access token as the password. For more information, see [Use Microsoft Entra ID for authentication with Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/how-to-configure-sign-in-azure-ad-authentication).

---

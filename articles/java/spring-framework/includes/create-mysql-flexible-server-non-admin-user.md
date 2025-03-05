---
author: KarlErickson
ms.date: 04/19/2023
ms.author: karler
ms.reviewer: seal
---

### [Service Connector (Recommended)](#tab/service-connector)

1. Use the following command to install the [Service Connector](/azure/service-connector/overview) passwordless extension for the Azure CLI:

   ```azurecli
    az extension add --name serviceconnector-passwordless --upgrade
   ```

1. Use the following command to create the Microsoft Entra non-admin user:

   ```azurecli
     az connection create mysql-flexible \
          --resource-group <your_resource_group_name> \
          --connection mysql_conn \
          --target-resource-group <your_resource_group_name> \
          --server mysqlflexibletest \
          --database demo \
          --user-account mysql-identity-id=/subscriptions/<your_subscription_id>/resourcegroups/<your_resource_group_name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<your_user_assigned_managed_identity_name> \
          --query authInfo.userName \
          --output tsv
    ```

   When the command completes, take note of the username in the console output.

### [Manual configuration](#tab/manual)

> [!IMPORTANT]
> To use passwordless connections, create a Microsoft Entra admin user for your Azure Database for MySQL instance. For more information, see the [Configure the Microsoft Entra Admin](/azure/mysql/flexible-server/how-to-azure-ad#configure-the-azure-ad-admin) section of [Set up Microsoft Entra authentication for Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/how-to-azure-ad).

Create a SQL script called **create_ad_user.sql** for creating a non-admin user. Add the following contents and save it locally:

```bash
export AZ_MYSQL_AD_NON_ADMIN_USERID=$(az ad signed-in-user show --query id --output tsv)

cat << EOF > create_ad_user.sql
SET aad_auth_validate_oids_in_tenant = OFF;
CREATE AADUSER '<your_mysql_ad_non_admin_username>' IDENTIFIED BY '$AZ_MYSQL_AD_NON_ADMIN_USERID';
GRANT ALL PRIVILEGES ON demo.* TO '<your_mysql_ad_non_admin_username>'@'%';
FLUSH privileges;
EOF
```

Then, use the following command to run the SQL script to create the Microsoft Entra non-admin user:

```bash
mysql -h mysqlflexibletest.mysql.database.azure.com --user <your_mysql_ad_admin_username> --enable-cleartext-plugin --password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken) < create_ad_user.sql
```

> [!TIP]
> To use Microsoft Entra authentication to connect to Azure Database for MySQL, you need to sign in with the Microsoft Entra admin user you set up, and then get the access token as the password. For more information, see [Set up Microsoft Entra authentication for Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/how-to-azure-ad).

---

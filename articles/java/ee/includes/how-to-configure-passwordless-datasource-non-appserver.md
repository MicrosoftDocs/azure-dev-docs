---
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.date: 05/29/2025
---

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
- Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the Bash environment. Make sure the Azure CLI version is 2.43.0 or higher.

    [![Launch Cloud Shell in a new window](../../../includes/media/hdi-launch-cloud-shell.png)](https://shell.azure.com)

- If you prefer, [install the Azure CLI 2.43.0 or higher](/cli/azure/install-azure-cli) to run Azure CLI commands.
  - If you're using a local install, sign in with Azure CLI by using the [`az login`](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) for other sign-in options.
  - When you're prompted, install Azure CLI extensions on first use. For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [`az version`](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [`az upgrade`](/cli/azure/reference-index?#az-upgrade).
- Ensure the Azure identity you use to sign in and complete this article has either the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription or the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) and [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) roles in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview) For details on the specific roles required by Oracle WebLogic marketplace offer, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## Create a resource group

Create a resource group with [`az group create`](/cli/azure/group#az-group-create). Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier - for example, `abc1228rg`. This example creates a resource group named `abc1228rg` in the `eastus` location. 

> [!NOTE]
> If you see the message `No available SKUs in this location` when executing the steps in this article, select a different region.

```azurecli-interactive
export RESOURCE_GROUP_NAME="abc1228rg"
export REGION=eastus
az group create \
    --name ${RESOURCE_GROUP_NAME} \
    --location ${REGION}
```

## Create a database server and a database

### [MySQL Flexible Server](#tab/mysql-flexible-server)

Create a flexible server with the [`az mysql flexible-server create`](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-create) command. This example creates a flexible server named `mysql20221201` with admin user `azureuser` and admin password `Secret123456`. Replace the password with yours. For more information, see [Create an Azure Database for MySQL Flexible Server using Azure CLI](/azure/mysql/flexible-server/quickstart-create-server-cli).

```azurecli-interactive
export MYSQL_NAME="mysql20221201"
export MYSQL_ADMIN_USER="azureuser"
export MYSQL_ADMIN_PASSWORD="Secret123456"

az mysql flexible-server create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $MYSQL_NAME \
    --location ${REGION} \
    --admin-user $MYSQL_ADMIN_USER \
    --admin-password $MYSQL_ADMIN_PASSWORD \
    --public-access 0.0.0.0 \
    --tier Burstable \
    --sku-name Standard_B1ms
```

Create a database with [`az mysql flexible-server db create`](/cli/azure/mysql/flexible-server/db#az-mysql-flexible-server-db-create).

```azurecli-interactive
export DATABASE_NAME="contoso"

# create mysql database
az mysql flexible-server db create \
    --resource-group $RESOURCE_GROUP_NAME \
    --server-name $MYSQL_NAME \
    --database-name $DATABASE_NAME
```

When the command completes, you should see output similar to the following example:

```output
Creating database with utf8 charset and utf8_general_ci collation
{
  "charset": "utf8",
  "collation": "utf8_general_ci",
  "id": "/subscriptions/contoso-hashcode/resourceGroups/abc1228rg/providers/Microsoft.DBforMySQL/flexibleServers/mysql20221201/databases/contoso",
  "name": "contoso",
  "resourceGroup": "abc1228rg",
  "systemData": null,
  "type": "Microsoft.DBforMySQL/flexibleServers/databases"
}
```

### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

Create a flexible server with the [`az postgres flexible-server create`](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-create) command. This example creates a flexible server named `postgresql20221223` with admin user `azureuser` and admin password `Secret123456`. Replace the password with yours. For more information, see [Create an Azure Database for PostgreSQL Flexible Server using Azure CLI](/azure/postgresql/flexible-server/quickstart-create-server-cli).

```azurecli-interactive
export POSTGRESQL_NAME="postgresql20221223"
export POSTGRESQL_ADMIN_USER="azureuser"
export POSTGRESQL_ADMIN_PASSWORD="Secret123456"

az postgres flexible-server create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $POSTGRESQL_NAME \
    --location ${REGION} \
    --admin-user $POSTGRESQL_ADMIN_USER \
    --admin-password $POSTGRESQL_ADMIN_PASSWORD \
    --public-access 0.0.0.0 \
    --tier Burstable \
    --sku-name Standard_B1ms \
    --active-directory-auth Enabled
```

Create a database with [`az postgres flexible-server db create`](/cli/azure/postgres/flexible-server/db#az-postgres-flexible-server-db-create).

```azurecli-interactive
export DATABASE_NAME="contoso"

# create postgresql database
az postgres flexible-server db create \
    --resource-group $RESOURCE_GROUP_NAME \
    --server-name $POSTGRESQL_NAME \
    --database-name $DATABASE_NAME
```

Allow public access from any Azure service within Azure to this server.

```azurecli-interactive
az postgres flexible-server firewall-rule create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $POSTGRESQL_NAME \
    --rule-name AllowAllAzureServices \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 0.0.0.0
```

### [Azure SQL Database](#tab/azure-sql-database)

<!-- Part of Azure SQL Database content is used in azure-aks-docs-pr/blob/wls-aks-quickstart-pswless/articles/aks/includes/jakartaee/create-azure-sql-database-passwordless.md. Ensure any changes made here are also applied to that file.-->

Create a server with the [`az sql server create`](/cli/azure/sql/server#az-sql-server-create) command. This example creates a server named `myazuresql20130213` with admin user `azureuser` and admin password `Secret123456`. Replace the password with yours. For more information, see [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-cli).

```azurecli-interactive
export AZURESQL_SERVER_NAME="myazuresql20130213"
export AZURESQL_ADMIN_USER="azureuser"
export AZURESQL_ADMIN_PASSWORD="Secret123456"

az sql server create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $AZURESQL_SERVER_NAME \
    --location ${REGION} \
    --admin-user $AZURESQL_ADMIN_USER \
    --admin-password $AZURESQL_ADMIN_PASSWORD
```

Create a database with the [`az sql db create`](/cli/azure/sql/db) command in the [serverless compute tier](/azure/azure-sql/database/serverless-tier-overview).

```azurecli-interactive
export DATABASE_NAME="mysingledatabase20230213"

az sql db create \
    --resource-group $RESOURCE_GROUP_NAME \
    --server $AZURESQL_SERVER_NAME \
    --name $DATABASE_NAME \
    --sample-name AdventureWorksLT \
    --edition GeneralPurpose \
    --compute-model Serverless \
    --family Gen5 \
    --capacity 2
```

---

<a name='configure-an-azure-ad-administrator-to-your-database'></a>

## Configure a Microsoft Entra administrator for your database

Now that you created the database, you need to make it ready to support passwordless connections. A passwordless connection requires a combination of managed identities for Azure resources and Microsoft Entra authentication. For an overview of managed identities for Azure resources, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview)

### [MySQL Flexible Server](#tab/mysql-flexible-server)

For information on how MySQL Flexible Server interacts with managed identities, see the [Azure Database for MySQL documentation](/azure/mysql).

The following example configures the current Azure CLI user as a Microsoft Entra administrator account. To enable Azure authentication, it's necessary to assign an identity to MySQL Flexible Server.

First, create a managed identity with [`az identity create`](/cli/azure/identity#az-identity-create) and assign the identity to MySQL server with [`az mysql flexible-server identity assign`](/cli/azure/mysql/flexible-server/identity#az-mysql-flexible-server-identity-assign).

```azurecli-interactive
export MYSQL_UMI_NAME="id-mysql-aad-20221205"

# create a User Assigned Managed Identity for MySQL to be used for AAD authentication
az identity create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $MYSQL_UMI_NAME

## assign the identity to the MySQL server
az mysql flexible-server identity assign \
    --resource-group $RESOURCE_GROUP_NAME \
    --server-name $MYSQL_NAME \
    --identity $MYSQL_UMI_NAME
```

Then, set the current Azure CLI user as the Microsoft Entra administrator account with [`az mysql flexible-server ad-admin create`](/cli/azure/mysql/flexible-server/ad-admin#az-mysql-flexible-server-ad-admin-create).

```azurecli-interactive
export CURRENT_USER=$(az account show --query user.name --output tsv)
export CURRENT_USER_OBJECTID=$(az ad signed-in-user show --query id --output tsv)

az mysql flexible-server ad-admin create \
    --resource-group $RESOURCE_GROUP_NAME \
    --server-name $MYSQL_NAME \
    --object-id $CURRENT_USER_OBJECTID \
    --display-name $CURRENT_USER \
    --identity $MYSQL_UMI_NAME
```

### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

For information on how PostgreSQL Flexible server interacts with managed identities, see [Use Microsoft Entra ID for authentication with Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/how-to-configure-sign-in-azure-ad-authentication). 

Add the current signed-in user as Microsoft Entra Admin to the Azure Database for PostgreSQL Flexible Server instance by using the following commands:

```azurecli-interactive
export CURRENT_USER=$(az account show --query user.name --output tsv)
az postgres flexible-server ad-admin create \
    --resource-group $RESOURCE_GROUP_NAME \
    --server-name $POSTGRESQL_NAME \
    --display-name $CURRENT_USER \
    --object-id $(az ad signed-in-user show --query id --output tsv)
```

### [Azure SQL Database](#tab/azure-sql-database)

For information on how Azure SQL Server interacts with managed identities, see [Connect using Microsoft Entra authentication](/sql/connect/jdbc/connecting-using-azure-active-directory-authentication).

The following example configures a Microsoft Entra administrator account to Azure SQL server from the portal:

1. In the [Azure portal](https://portal.azure.com/), open the Azure SQL server instance **myazuresql20130213**.
1. Select **Settings**, then select **Microsoft Entra ID**. On the **Microsoft Entra ID** page, select **Set admin**.
1. On the **Add admin** page, search for a user, select the user or group to be an administrator, and then select **Select**.
1. At the top of the **Microsoft Entra ID** page, select **Save**. For Microsoft Entra users and groups, the **Object ID** is displayed next to the admin name.
1. The process of changing the administrator might take several minutes. Then, the new administrator appears in the **Microsoft Entra ID** box.

---

## Create a user-assigned managed identity

Next, in Azure CLI, create an identity in your subscription by using the [`az identity create`](/cli/azure/identity#az-identity-create) command. You use this managed identity to connect to your database.

```azurecli-interactive
az identity create \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name myManagedIdentity
```

To configure the identity in the following steps, use the [`az identity show`](/cli/azure/identity#az-identity-show) command to store the identity's client ID in a shell variable.

```azurecli-interactive
# Get client ID of the user-assigned identity
export CLIENT_ID=$(az identity show \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name myManagedIdentity \
    --query clientId \
    --output tsv)
```

## Create a database user for your managed identity

First, you're required to create a firewall rule to access the database server from your CLI client. Run the following commands to get your current IP address:

```bash
export MY_IP=$(curl http://whatismyip.akamai.com)
```

If you're working on Windows Subsystem for Linux (WSL) with VPN enabled, the following command might return an incorrect IPv4 address. One way to get your IPv4 address is by visiting [whatismyipaddress.com](https://whatismyipaddress.com/). Set the environment variable `MY_IP` as the IPv4 address from which you want to connect to the database. You configure the database firewall with this IP address later.

### [MySQL Flexible Server](#tab/mysql-flexible-server)

Connect as the Microsoft Entra administrator user to your MySQL database, and create a MySQL user for your managed identity.

Create a temporary firewall rule with [`az mysql flexible-server firewall-rule create`](/cli/azure/mysql/flexible-server/firewall-rule#az-mysql-flexible-server-firewall-rule-create).

```azurecli-interactive
az mysql flexible-server firewall-rule create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $MYSQL_NAME \
    --rule-name AllowCurrentMachineToConnect \
    --start-ip-address ${MY_IP} \
    --end-ip-address ${MY_IP}
```

Next, prepare an SQL file to create a database user for the managed identity. The following example adds a user with login name `identity-contoso` and grants the user privileges to access database `contoso`:

```bash
export IDENTITY_LOGIN_NAME="identity-contoso"

cat <<EOF >createuser.sql
SET aad_auth_validate_oids_in_tenant = OFF;
DROP USER IF EXISTS '${IDENTITY_LOGIN_NAME}'@'%';
CREATE AADUSER '${IDENTITY_LOGIN_NAME}' IDENTIFIED BY '${CLIENT_ID}';
GRANT ALL PRIVILEGES ON ${DATABASE_NAME}.* TO '${IDENTITY_LOGIN_NAME}'@'%';
FLUSH privileges;
EOF
```

Execute the SQL file with the command [`az mysql flexible-server execute`](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-execute). You can retrieve your access token with the command [`az account get-access-token`](/cli/azure/account#az-account-get-access-token).

```azurecli-interactive
export RDBMS_ACCESS_TOKEN=$(az account get-access-token \
    --resource-type oss-rdbms \
    --query accessToken \
    --output tsv) 

az mysql flexible-server execute \
    --name ${MYSQL_NAME} \
    --admin-user ${CURRENT_USER} \
    --admin-password ${RDBMS_ACCESS_TOKEN} \
    --file-path "createuser.sql"
```

You might be prompted to install the `rdbms-connect` extension, as shown in the following output. Press <kbd>y</kbd> to continue. If you're not working with the `root` user, you need to input the user password.

```output
The command requires the extension rdbms-connect. Do you want to install it now? The command will continue to run after the extension is installed. (Y/n): y
Run 'az config set extension.use_dynamic_install=yes_without_prompt' to allow installing extensions without prompt.
This extension depends on gcc, libpq-dev, python3-dev and they will be installed first.
[sudo] password for user:
```

If the SQL file executes successfully, your output is similar to the following example:

```output
Running *.sql* file 'createuser.sql'...
Successfully executed the file.
Closed the connection to mysql20221201
```

The managed identity `myManagedIdentity` now has access to the database when authenticating with the username `identity-contoso`.

If you no longer want to access the server from this IP address, you can remove the firewall rule by using the following command:

```azurecli-interactive
az mysql flexible-server firewall-rule delete \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $MYSQL_NAME \
    --rule-name AllowCurrentMachineToConnect \
    --yes
```

Finally, use the following command to get the connection string that you use in the next section:

```azurecli-interactive
export CONNECTION_STRING="jdbc:mysql://${MYSQL_NAME}.mysql.database.azure.com:3306/${DATABASE_NAME}?useSSL=true"
echo ${CONNECTION_STRING}
```

### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

Connect as the Microsoft Entra administrator user to your PostgreSQL database, and create a PostgreSQL user for your managed identity.

Create a temporary firewall rule with [`az postgres flexible-server firewall-rule create`](/cli/azure/postgres/flexible-server/firewall-rule#az-postgres-flexible-server-firewall-rule-create), as shown in the following example:

```azurecli-interactive
az postgres flexible-server firewall-rule create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $POSTGRESQL_NAME \
    --rule-name $POSTGRESQL_NAME-database-allow-local-ip \
    --start-ip-address $MY_IP \
    --end-ip-address $MY_IP
```

In the same Azure CLI shell you've been using, obtain a token for connection by using the following command:

```bash
export RDBMS_ACCESS_TOKEN=$(az account get-access-token --resource-type oss-rdbms --query accessToken --output tsv)
```

Next, prepare an SQL file to create a database user for the managed identity. The following example adds a user with login name `myManagedIdentity` and grants the user privileges to access database `contoso`:

```bash
cat <<EOF >createuser.sql
select * from pgaadauth_create_principal('myManagedIdentity', false, false);
select * from pgaadauth_list_principals(false);
GRANT ALL PRIVILEGES ON DATABASE "contoso" TO "myManagedIdentity";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "myManagedIdentity";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "myManagedIdentity";
EOF
```

Use the following commands to execute the SQL file:
   
```bash
az config set extension.use_dynamic_install=yes_without_prompt

az postgres flexible-server execute --verbose \
    --name ${POSTGRESQL_NAME} \
    --admin-user ${CURRENT_USER} \
    --admin-password ${RDBMS_ACCESS_TOKEN} \
    --file-path createuser.sql
```

The output is similar to the following example:

```output
Connecting to postgres database by default.
Running sql file 'dbuser.sql'...
Successfully executed the file.
Closed the connection to postgresql20221223
Command ran in 2.752 seconds (init: 0.144, invoke: 2.609)
```

Use the following command to get the connection string that you use in the next section:

```azurecli-interactive
export CONNECTION_STRING="jdbc:postgresql://${POSTGRESQL_NAME}.postgres.database.azure.com:5432/${DATABASE_NAME}?sslmode=require"
echo ${CONNECTION_STRING}
```

### [Azure SQL Database](#tab/azure-sql-database)

Connect as the Microsoft Entra administrator user to your Azure SQL database from the Azure portal, and create a user for your managed identity.

First, create a firewall rule to access the Azure SQL server from portal, as shown in the following steps:

1. In the [Azure portal](https://portal.azure.com/), open the Azure SQL server instance **myazuresql20130213**.
1. Select **Security**, and then select **Networking**.
1. Under **Firewall rules** select **Add your client IPV4 IP address**.
1. Under **Exceptions** select **Allow Azure services and resources to access this server**.
1. Select **Save**.

After the firewall rule is created, you can access the Azure SQL server from the Azure portal. Use the following steps to create a database user:

1. Select **Settings** and then select **SQL databases**. Select **mysingledatabase20230213**.

1. Select **Query editor**. On the **Welcome to SQL Database Query Editor** page, under **Active Directory authentication**, find a message similar to "Logged in as user@contoso.com".

1. Select **Continue as user@contoso.com**, where **user** is your AD admin account name.

1. After signing in, in the **Query 1** editor, use the following commands to create a database user for managed identity `myManagedIdentity`:

    ```sql
    CREATE USER "myManagedIdentity" FROM EXTERNAL PROVIDER;
    ALTER ROLE db_datareader ADD MEMBER "myManagedIdentity";
    ALTER ROLE db_datawriter ADD MEMBER "myManagedIdentity";
    ALTER ROLE db_ddladmin ADD MEMBER "myManagedIdentity";
    GO
    ```

1. In the **Query 1** editor, select **Run** to run the SQL commands.

1. If the commands complete successfully, the system responds with a message saying "Query succeeded: Affected rows: 0".

1. Use the following command to get the connection string that you use in the next section:

    ```azurecli-interactive
    export CONNECTION_STRING="jdbc:sqlserver://myazuresql20130213.database.windows.net:1433;database=mysingledatabase20230213;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;"
    echo ${CONNECTION_STRING}
    ```

---

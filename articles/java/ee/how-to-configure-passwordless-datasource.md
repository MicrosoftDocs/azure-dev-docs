---
title: Configure passwordless database connections for Java apps on Oracle WebLogic Servers
description: Configure passwordless datasource connection using marketplace offers.
author: KarlErickson
ms.author: haiche
ms.topic: how-to
ms.date: 01/12/2023
ms.custom: devx-track-azurecli, devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks, devx-track-javaee-wls-vm, has-azure-ad-ps-ref, passwordless-java
---

# Configure passwordless database connections for Java apps on Oracle WebLogic Servers

This article shows you how to configure passwordless database connections for Java apps on Oracle WebLogic Server offers with the Azure portal.

In this guide, you accomplish the following tasks:

> [!div class="checklist"]
> - Provision database resources using Azure CLI.
> - Enable the Microsoft Entra administrator in the database.
> - Provision a user-assigned managed identity and create a database user for it.
> - Configure a passwordless database connection in Oracle WebLogic offers with the Azure portal.
> - Validate the database connection.

The offers support passwordless connections for PostgreSQL, MySQL and Azure SQL databases.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the Bash environment; make sure the Azure CLI version is 2.43.0 or higher.

   [![Launch Cloud Shell in a new window](../../includes/media/hdi-launch-cloud-shell.png)](https://shell.azure.com)

- If you prefer, [install the Azure CLI 2.43.0 or higher](/cli/azure/install-azure-cli) to run Azure CLI commands.
  - If you're using a local install, sign in with Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) for other sign-in options.
  - When you're prompted, install Azure CLI extensions on first use. For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).
- Ensure the Azure identity you use to sign in and complete this article has either the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription or the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) and [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) roles in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview) For details on the specific roles required by Oracle WebLogic marketplace offer, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create). Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier. For example, *abc1228rg*. This example creates a resource group named `abc1228rg` in the `eastus` location:

```azurecli-interactive
export RESOURCE_GROUP_NAME="abc1228rg"
az group create \
    --name ${RESOURCE_GROUP_NAME} \
    --location eastus
```

## Create a database server and a database

### [MySQL Flexible Server](#tab/mysql-flexible-server)

Create a flexible server with the [az mysql flexible-server create](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-create) command. This example creates a flexible server named `mysql20221201` with admin user `azureuser` and admin password `Secret123456`. Replace the password with yours. For more information, see [Create an Azure Database for MySQL Flexible Server using Azure CLI](/azure/mysql/flexible-server/quickstart-create-server-cli).

```azurecli-interactive
export MYSQL_NAME="mysql20221201"
export MYSQL_ADMIN_USER="azureuser"
export MYSQL_ADMIN_PASSWORD="Secret123456"

az mysql flexible-server create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $MYSQL_NAME \
    --location eastus \
    --admin-user $MYSQL_ADMIN_USER \
    --admin-password $MYSQL_ADMIN_PASSWORD \
    --public-access 0.0.0.0 \
    --tier Burstable \
    --sku-name Standard_B1ms
```

Create a database with [az mysql flexible-server db create](/cli/azure/mysql/flexible-server/db#az-mysql-flexible-server-db-create).

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

Create a flexible server with the [az postgres flexible-server create](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-create) command. This example creates a flexible server named `postgresql20221223` with admin user `azureuser` and admin password `Secret123456`. Replace the password with yours. For more information, see [Create an Azure Database for PostgreSQL Flexible Server using Azure CLI](/azure/postgresql/flexible-server/quickstart-create-server-cli).

```azurecli-interactive
export POSTGRESQL_NAME="postgresql20221223"
export POSTGRESQL_ADMIN_USER="azureuser"
export POSTGRESQL_ADMIN_PASSWORD="Secret123456"

az postgres flexible-server create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $POSTGRESQL_NAME \
    --location eastus \
    --admin-user $POSTGRESQL_ADMIN_USER \
    --admin-password $POSTGRESQL_ADMIN_PASSWORD \
    --version 14 \
    --public-access 0.0.0.0 \
    --tier Burstable \
    --sku-name Standard_B1ms
```

Create a database with [az postgres flexible-server db create](/cli/azure/postgres/flexible-server/db#az-postgres-flexible-server-db-create).

```azurecli-interactive
export DATABASE_NAME="contoso"

# create postgresql database
az postgres flexible-server db create \
    --resource-group $RESOURCE_GROUP_NAME \
    --server-name $POSTGRESQL_NAME \
    --database-name $DATABASE_NAME
```

### [Azure SQL Database](#tab/azure-sql-database)

Create a server with the [az sql server create](/cli/azure/sql/server#az-sql-server-create) command. This example creates a server named `myazuresql20130213` with admin user `azureuser` and admin password `Secret123456`. Replace the password with yours. For more information, see [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-cli).

```azurecli-interactive
export AZURESQL_SERVER_NAME="myazuresql20130213"
export AZURESQL_ADMIN_USER="azureuser"
export AZURESQL_ADMIN_PASSWORD="Secret123456"

az sql server create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $AZURESQL_SERVER_NAME \
    --location eastus \
    --admin-user $AZURESQL_ADMIN_USER \
    --admin-password $AZURESQL_ADMIN_PASSWORD
```

Create a database with the [az sql db create](/cli/azure/sql/db) command in the [serverless compute tier](/azure/azure-sql/database/serverless-tier-overview).

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

## Configure a Microsoft Entra administrator to your database

Now that you've created the database, you need to make it ready to support passwordless connections. A passwordless connection requires a combination of managed identities for Azure resources and Microsoft Entra authentication. For an overview of managed identities for Azure resources, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview)

### [MySQL Flexible Server](#tab/mysql-flexible-server)

For information on how MySQL Flexible Server interacts with managed identities, see [Use Microsoft Entra ID for authentication with MySQL](/azure/mysql/single-server/how-to-configure-sign-in-azure-ad-authentication).

The following example configures the current Azure CLI user as a Microsoft Entra administrator account. To enable Azure authentication, it's necessary to assign an identity to MySQL Flexible Server.

First, create a managed identity with [az identity create](/cli/azure/identity#az-identity-create) and assign the identity to MySQL server with [az mysql flexible-server identity assign](/cli/azure/mysql/flexible-server/identity#az-mysql-flexible-server-identity-assign).

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

Then, set the current Azure CLI user as the Microsoft Entra administrator account with [az mysql flexible-server ad-admin create](/cli/azure/mysql/flexible-server/ad-admin#az-mysql-flexible-server-ad-admin-create).

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

For information on how PostgreSQL Flexible server interacts with managed identities, see [Use Microsoft Entra ID for authentication with Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/how-to-configure-sign-in-azure-ad-authentication). The next few commands use PowerShell. If you don't already have the `Az` and `Azure AD` modules installed, install them now.

To install the `Az` module, follow the steps at [Install the Azure Az PowerShell module](/powershell/azure/install-az-ps).

To install the `AzureAD` module, follow the steps at [AzureAD](/powershell/module/azuread).

Sign in to Azure and get your tenant ID with the following command:

```powershell
Connect-AzAccount
```

If you want to sign in to a specific tenant, use this command instead.

```powershell
Connect-AzAccount -Tenant <your-tenant-name>.onmicrosoft.com
```

In either case, you're directed to a browser to complete the sign-in. Your `TenantId` should be output, as shown with redacted data in the following example.

```output
Account                       SubscriptionName       TenantId                             Environment
-------                       ----------------       --------                             -----------
passwordless-user@contoso.com Contoso subscription   XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX Your Cloud
```

Use the following command to grant `Azure Database for PostgreSQL - Flexible Server Service Principal` read access to your tenant, to request Graph API tokens for Microsoft Entra validation tasks. This operation uses PowerShell commands. Input the tenant ID that you obtained from the previous command. For more information, see [Use Microsoft Entra authentication with Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/how-to-configure-sign-in-azure-ad-authentication#install-the-azure-ad-powershell-module).

```powershell
Connect-AzureAD -TenantId <your-tenant-ID>
```

A successful output looks similar to the following example:

```output
Account                       Environment TenantId                             TenantDomain                       AccountType
-------                       ----------- --------                             ------------                       -----------
passwordless-user@contoso.com AzureCloud  XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX <your-tenant-name>.onmicrosoft.com User
```

Ensure that your Azure tenant has the service principal for the Azure Database for PostgreSQL Flexible Server. You only need to do this action once per Azure tenant. First, check for the existence of the service principal in your tenant by using the following command. The specific `ObjectId` value is for the Azure Database for PostgreSQL Flexible Server service principal.

```powershell
Get-AzureADServicePrincipal -ObjectId 0049e2e2-fcea-4bc4-af90-bdb29a9bbe98
```

If the service principal exists, you see the following output.

```output
ObjectId                             AppId                                DisplayName
--------                             -----                                -----------
0049e2e2-fcea-4bc4-af90-bdb29a9bbe98 5657e26c-cc92-45d9-bc47-9da6cfdb4ed9 Azure OSSRDBMS PostgreSQL Flexible Server
```

Otherwise, you need to create the service principal with the following command. The specific `AppId` value is for the Azure Database for PostgreSQL Flexible Server.

```powershell
New-AzureADServicePrincipal -AppId 5657e26c-cc92-45d9-bc47-9da6cfdb4ed9
```

Use the following steps to continue the configuration in the Azure portal.

1. Sign in to the Azure portal from your browser. Search for `postgresql20221223` and then select it.
1. In the **Security** section, select **Authentication**, then select **PostgreSQL and Microsoft Entra authentication**.
1. Select **Save**, then **Continue**. The deployment takes several minutes to finish. Wait for the deployment to complete before continuing.
1. Go back to resource `postgresql20221223`, and then in the **Security** section, select **Authentication** again.
1. You find **Microsoft Entra Administrators (Microsoft Entra Admins)** shown in the page. Select **Add Microsoft Entra Admins**, select the account you're currently using in the Azure portal, then select **Select**.
1. Select **Save**. It takes several seconds to create the Microsoft Entra Admin, as shown in the following screenshot.

:::image type="content" source="media/how-to-configure-passwordless-datasource/azure-portal-postgresql-authentication.png" alt-text="Screenshot of the Azure portal showing the Configure authentication on PostgreSQL Flexible Server page." lightbox="media/how-to-configure-passwordless-datasource/azure-portal-postgresql-authentication.png":::

### [Azure SQL Database](#tab/azure-sql-database)

For information on how Azure SQL Server interacts with managed identities, see [Connect using Microsoft Entra authentication](/sql/connect/jdbc/connecting-using-azure-active-directory-authentication).

The following example configures a Microsoft Entra administrator account to Azure SQL server from the portal.

1. In the [Azure portal](https://portal.azure.com/), open the Azure SQL server instance `myazuresql20130213`.
1. Select **Settings**, then select **Microsoft Entra ID**. On the **Microsoft Entra ID** page, select **Set admin**.

   :::image type="content" source="media/how-to-configure-passwordless-datasource/azure-portal-azure-sql-set-admin.png" alt-text="Screenshot of the Azure portal showing the SQL server page and the Microsoft Entra settings with the Set admin option highlighted." lightbox="media/how-to-configure-passwordless-datasource/azure-portal-azure-sql-set-admin.png":::

1. On the **Add admin** page, search for a user, select the user or group to be an administrator, and then select **Select**.
1. At the top of the **Microsoft Entra ID** page, select **Save**. For Microsoft Entra users and groups, the Object ID is displayed next to the admin name.
1. The process of changing the administrator may take several minutes. Then, the new administrator appears in the **Microsoft Entra ID** box.

---

## Create a user-assigned managed identity

Next, in Azure CLI, create an identity in your subscription by using the [az identity create](/cli/azure/identity#az-identity-create) command. You use this managed identity to connect to your database.

```azurecli-interactive
az identity create \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name myManagedIdentity
```

To configure the identity in the following steps, use the [az identity show](/cli/azure/identity#az-identity-show) command to store the identity's client ID in a shell variable.

```azurecli-interactive
# Get client ID of the user-assigned identity
export CLIENT_ID=$(az identity show \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name myManagedIdentity \
    --query clientId \
    --output tsv)
```

## Create a database user for your managed identity

### [MySQL Flexible Server](#tab/mysql-flexible-server)

Now, connect as the Microsoft Entra administrator user to your MySQL database, and create a MySQL user for your managed identity.

First, you're required to create a firewall rule to access the MySQL server from your CLI client. Run the following commands to get your current IP address.

```bash
export MY_IP=$(curl http://whatismyip.akamai.com)
```

If you're working on Windows Subsystem for Linux (WSL) with VPN enabled, the following command may return an incorrect IPv4 address. One way to get your IPv4 address is by visiting [whatismyipaddress.com](https://whatismyipaddress.com/). In any case, set the environment variable `MY_IP` as the IPv4 address from which you want to connect to the database.

Create a temporary firewall rule with [az mysql flexible-server firewall-rule create](/cli/azure/mysql/flexible-server/firewall-rule#az-mysql-flexible-server-firewall-rule-create).

```azurecli-interactive
az mysql flexible-server firewall-rule create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $MYSQL_NAME \
    --rule-name AllowCurrentMachineToConnect \
    --start-ip-address ${MY_IP} \
    --end-ip-address ${MY_IP}
```

Then, prepare an *.sql* file to create a database user for the managed identity. The following example adds a user with login name `identity-contoso` and grants the user privileges to access database `contoso`.

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

Execute the *.sql* file with the command [az mysql flexible-server execute](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-execute). You can get your access token with the command [az account get-access-token](/cli/azure/account#az-account-get-access-token).

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

You may be prompted to install the `rdbms-connect` extension, as shown in the following output. Press `y` to continue. If you're not working with the `root` user, you need to input the user password.

```output
The command requires the extension rdbms-connect. Do you want to install it now? The command will continue to run after the extension is installed. (Y/n): y
Run 'az config set extension.use_dynamic_install=yes_without_prompt' to allow installing extensions without prompt.
This extension depends on gcc, libpq-dev, python3-dev and they will be installed first.
[sudo] password for user:
```

If the *.sql* file executes successfully, you find output that is similar to the following example:

```output
Running *.sql* file 'createuser.sql'...
Successfully executed the file.
Closed the connection to mysql20221201
```

The managed identity `myManagedIdentity` now has access to the database when authenticating with the username `identity-contoso`.

If you no longer want to access the server from this IP address, you can remove the firewall rule by using the following command.

```azurecli-interactive
az mysql flexible-server firewall-rule delete \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $MYSQL_NAME \
    --rule-name AllowCurrentMachineToConnect \
    --yes
```

Finally, use the following command to get the connection string that you use in the next section.

```azurecli-interactive
export CONNECTION_STRING="jdbc:mysql://${MYSQL_NAME}.mysql.database.azure.com:3306/${DATABASE_NAME}?useSSL=true"
echo ${CONNECTION_STRING}
```

### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

Now, connect as the Microsoft Entra administrator user to your PostgreSQL database, and create a PostgreSQL user for your managed identity.

This example uses Azure Cloud Shell to connect to the database. Use the following steps to create a database user.

1. Sign in to the Azure portal from your browser. Search for `postgresql20221223` and open the database server.
1. Select **Overview**. Locate the **Connect** button. Select **Connect**, and then select the `postgres` database. Make sure you're using the right database.
   When the database is connected, the Azure Cloud Shell appears.
1. Input the following command to create a user for your managed identity `myManagedIdentity`:

   ```bash
   select * from pgaadauth_create_principal('myManagedIdentity', false, false);
   ```

   You find a message saying `Created role for "myManagedIdentity"`, which means the user is created successfully.

1. List all the Microsoft Entra users by using the following command:

   ```bash
   select * from pgaadauth_list_principals(false);
   ```

1. Use the following commands to grant `myManagedIdentity` to access your database `contoso`:

   ```bash
   GRANT ALL PRIVILEGES ON DATABASE "contoso" TO "myManagedIdentity";
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "myManagedIdentity";
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "myManagedIdentity";
   ```

   The output is similar to the following content.

   ```output
   psql 'host=postgresql20221223.postgres.database.azure.com port=5432 dbname=postgres user=test@contoso.com password='$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken)' sslmode=require'
   psql (14.5)
   SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
   Type "help" for help.

   postgres=> select * from pgaadauth_create_principal('myManagedIdentity', false, false);
       pgaadauth_create_principal
   --------------------------------------
   Created role for "myManagedIdentity"
   (1 row)

   postgres=> select * from pgaadauth_list_principals(false);
       rolname       | principaltype |               objectid               |               tenantid               | ismfa | isadmin
   ------------------+---------------+--------------------------------------+--------------------------------------+-------+---------
   test@contoso.com  | user          | XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX | XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |     0 |       1
   myManagedIdentity | service       | XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX | XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |     0 |       0
   (2 rows)
   postgres=> GRANT ALL PRIVILEGES ON DATABASE "contoso" TO "myManagedIdentity";
   WARNING:  no privileges were granted for "contoso"
   GRANT
   postgres=> GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "myManagedIdentity";
   GRANT
   postgres=> GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "myManagedIdentity";
   GRANT
   postgres=>
   ```

1. Close the Azure Cloud Shell window.

1. Finally, back in the Azure CLI shell you've been using, use the following command get the connection string that you use in the next section.

   ```azurecli-interactive
   export CONNECTION_STRING="jdbc:postgresql://${POSTGRESQL_NAME}.postgres.database.azure.com:5432/${DATABASE_NAME}?sslmode=require"
   echo ${CONNECTION_STRING}
   ```

### [Azure SQL Database](#tab/azure-sql-database)

Now, connect as the Microsoft Entra administrator user to your Azure SQL database from the Azure portal, and create a user for your managed identity.

First, create a firewall rule to access the Azure SQL server from portal, as shown in the following steps.

1. In the [Azure portal](https://portal.azure.com/), open the Azure SQL server instance `myazuresql20130213`.
1. Select **Security**, then select **Networking**.
1. Under **Firewall rules**, select **Add your client IPV4 IP address**.
1. Under  **Exceptions**, select **Allow Azure services and resources to access this server**.
1. Select **Save**.

After the firewall rule is created, you can access the Azure SQL server from portal. Use the following steps to create a database user.

1. Select **Settings**, then select **SQL databases**. Select `mysingledatabase20230213`.
1. Select **Query editor**. On the **Welcome to SQL Database Query Editor** page, under **Active Directory authentication**, find a message like "Logged in as user@contoso.com".
1. Select **Continue as user@contoso.com**, where `user` is your AD admin account name.
1. After signing in, in the **Query 1** editor, run the following commands to create a database user for managed identity `myManagedIdentity`.

   ```sql
   CREATE USER "myManagedIdentity" FROM EXTERNAL PROVIDER
   ALTER ROLE db_datareader ADD MEMBER "myManagedIdentity";
   ALTER ROLE db_datawriter ADD MEMBER "myManagedIdentity";
   ALTER ROLE db_ddladmin ADD MEMBER "myManagedIdentity";
   GO
   ```

1. In the **Query 1** editor, select **Run** to run the SQL commands.
1. If the commands complete successfully, you can find a message saying "Query succeeded: Affected rows: 0".

Finally, use the following command to get the connection string that you use in the next section.

```azurecli-interactive
export CONNECTION_STRING="jdbc:sqlserver://myazuresql20130213.database.windows.net:1433;database=mysingledatabase20230213;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;"
echo ${CONNECTION_STRING}
```

---

## Configure a passwordless database connection for Oracle WebLogic Server on Azure VMs

This section shows you how to configure the passwordless data source connection using the Azure Marketplace offers for Oracle WebLogic Server.

First, begin the process of deploying an offer. The following offers support passwordless database connections:

- [Oracle WebLogic Server on Azure Kubernetes Service](https://aka.ms/wls-aks-portal)
  - [Quickstart](/azure/aks/howto-deploy-java-wls-app?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/ee/breadcrumb/toc.json)
- [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster)
  - [Quickstart](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
- [Oracle WebLogic Server with Admin Server on VMs](https://aka.ms/wls-vm-admin)
  - [Quickstart](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
- [Oracle WebLogic Server Dynamic Cluster on VMs](https://aka.ms/wls-vm-dynamic-cluster)
  - [Quickstart](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

Fill in the required information in the **Basics** pane and other panes if you want to enable the features. When you reach the **Database** pane, fill in the passwordless configuration as shown in the following steps.

### [MySQL Flexible Server](#tab/mysql-flexible-server)

1. For **Connect to database?**, select **Yes**.
1. Under **Connection settings**, for **Choose database type**, open the dropdown menu and then select **MySQL (with support for passwordless connection)**.
1. For **JNDI Name**, input *testpasswordless* or your expected value.
1. For **DataSource Connection String**, input the connection string you obtained in the last section.
1. For **Database username**, input the database user name of your managed identity (the value of `${IDENTITY_LOGIN_NAME}`). In this example, the value is `identity-contoso`.
1. Select **Use passwordless datasource connection**.
1. For **User assigned managed identity**, select the managed identity you created previously. In this example, its name is `myManagedIdentity`.

The **Connection settings** section should look like the following screenshot, which uses [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster) as an example.

:::image type="content" source="media/how-to-configure-passwordless-datasource/screenshot-database-portal.png" alt-text="Screenshot of the Azure portal showing the Configure database pane of the Create Oracle WebLogic Server on VMs page." lightbox="media/how-to-configure-passwordless-datasource/screenshot-database-portal.png":::

### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

1. For **Connect to database?**, select **Yes**.
1. Under **Connection settings**, for **Choose database type**, open the dropdown menu and then select **Azure Database for PostgreSQL (with support for passwordless connection)**.
1. For **JNDI Name**, input *testpasswordless* or your expected value.
1. For **DataSource Connection String**, input the connection string you obtained in last section.
1. For **Database username**, input your managed identity name. In this example, the value is `myManagedIdentity`.
1. Select **Use passwordless datasource connection**.
1. For **User assigned managed identity**, select the managed identity you created in previous step. In this example, its name is `myManagedIdentity`.
1. Select **Add**.

The **Connection settings** section should look like the following screenshot, which uses [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster) as an example.

:::image type="content" source="media/how-to-configure-passwordless-datasource/azure-portal-postgresql-configuration.png" alt-text="Screenshot of the Azure portal showing the Configure PostgreSQL database page." lightbox="media/how-to-configure-passwordless-datasource/azure-portal-postgresql-configuration.png":::

### [Azure SQL Database](#tab/azure-sql-database)

1. For **Connect to database?**, select **Yes**.
1. Under **Connection settings**, for **Choose database type**, open the dropdown menu and then select **Azure SQL (with support for passwordless connection)**.
1. For **JNDI Name**, input *testpasswordless* or your expected value.
1. For **DataSource Connection String**, input the connection string you obtained in last section.
1. Select **Use passwordless datasource connection**.
1. For **User assigned managed identity**, select the managed identity you created in previous step. In this example, its name is `myManagedIdentity`.
1. Select **Add**.

The **Connection settings** section should look like the following screenshot, which uses [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster) as an example.

:::image type="content" source="media/how-to-configure-passwordless-datasource/azure-portal-azure-sql-configuration.png" alt-text="Screenshot of the Azure portal showing the Configure Azure SQL database page." lightbox="media/how-to-configure-passwordless-datasource/azure-portal-azure-sql-configuration.png":::

---

You've now finished configuring the passwordless connection. You can continue to fill in the following panes or select **Review + create**, then **Create** to deploy the offer.

## Verify the database connection

The database connection is configured successfully if the offer deployment completes without error.

Continuing to take [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster) as an example, after the deployment completes, follow these steps in the Azure portal to find the Admin console URL.

1. Find the resource group in which you deployed WLS.
1. Under **Settings**, select **Deployments**.
1. Select the deployment with the longest **Duration**. This deployment should be at the bottom of the list.
1. Select **Outputs**.
1. The URL of the WebLogic Administration Console is the value of the **adminConsoleUrl** output.
1. Copy the value of the output variable `adminConsoleUrl`.
1. Paste the value into your browser address bar and press <kbd>Enter</kbd> to open the sign-in page of the WebLogic Administration Console.

Use the following steps to verify the database connection.

1. Sign in to the WebLogic Administration Console with the username and password you provided on the **Basics** pane.
1. Under the **Domain Structure**, select **Services**, **Data Sources**, then **testpasswordless**.
1. Select the **Monitoring** tab, where the state of the data source is *Running*, as shown in the following screenshot.

   ### [MySQL Flexible Server](#tab/mysql-flexible-server)

   :::image type="content" source="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-datasource-state.png" alt-text="Screenshot of the WebLogic Console portal showing the MySQL datasource state." lightbox="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-datasource-state.png":::

   ### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

   :::image type="content" source="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-postgresql-state.png" alt-text="Screenshot of the WebLogic Console portal showing the PostgreSQL datasource state." lightbox="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-postgresql-state.png":::

   ### [Azure SQL Database](#tab/azure-sql-database)

   :::image type="content" source="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-sql-server-state.png" alt-text="Screenshot of the WebLogic Console portal showing the SQL Server datasource state." lightbox="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-sql-server-state.png":::

1. Select the **Testing** tab, then select the radio button next to the desired server.
1. Select **Test Data Source**. You should see a message indicating a successful test, as shown in the following screenshot.

   :::image type="content" source="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-successful-database.png" alt-text="Screenshot of the WebLogic Console portal showing a successful test of the datasource." lightbox="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-successful-database.png":::

## Clean up resources

If you don't need these resources, you can delete them by doing the following commands:

```azurecli-interactive
az group delete --name ${RESOURCE_GROUP_NAME}
az group delete --name <resource-group-name-that-deploys-the-offer>
```

## Next steps

Learn more about running WLS on AKS or virtual machines by following these links:

> [!div class="nextstepaction"]
> [WLS on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks)

> [!div class="nextstepaction"]
> [WLS on virtual machines](/azure/virtual-machines/workloads/oracle/oracle-weblogic)

> [!div class="nextstepaction"]
> [Passwordless Connections Samples for Java Apps](https://github.com/Azure-Samples/Passwordless-Connections-for-Java-Apps)

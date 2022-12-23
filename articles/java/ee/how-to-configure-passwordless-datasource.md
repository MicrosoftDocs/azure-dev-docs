---
title: Configure passwordless datasource connection using marketplace offers
description: Configure passwordless datasource connection using marketplace offers.
author: KarlErickson
ms.author: haiche
ms.topic: how-to
ms.date: 11/30/2022
keywords: java, jakartaee, javaee, database, passwordless, weblogic, vm, aks, kubernetes
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls
---

# Configure passwordless database connection using Azure Oracle WebLogic marketplace offers

[!INCLUDE [applies-to-weblogic-offers.md](includes/applies-to-weblogic-offers.md)]

This article shows you how to configure passwordless database connection in Azure Oracle WebLogic Server offers with the Azure portal.

In this guide, you'll:

> [!div class="checklist"]
> - Provision database resources using Azure CLI.
> - Enable Azure AD administrator in database.
> - Provision a user assigned managed identity and create a database user for it.
> - Configure passwordless database connection in Oracle WebLogic offers with the Azure portal.
> - Validate the database connection.

The offers support passwordless connections for the following database:

> [!div class="checklist"]
> - PostgreSQL
> - MySQL

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the Bash environment; make sure the Azure CLI version is 2.43.0, or above.

   [![Launch Cloud Shell in a new window](../../includes/media/hdi-launch-cloud-shell.png)](https://shell.azure.com)

- If you prefer, [install the Azure CLI 2.43.0, or above](/cli/azure/install-azure-cli) to run Azure CLI commands.
  - If you're using a local install, sign in with Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) for other sign-in options.
  - When you're prompted, install Azure CLI extensions on first use. For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).
- Ensure the Azure identity you use to sign in and complete this article has either the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription or the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) and [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) roles in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview) For details on the specific roles required by Oracle WebLogic marketplace offer, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create). This example creates a resource group named `mydbrg20221201` in the `eastus` location:

```azurecli-interactive
RESOURCE_GROUP_NAME="mydbrg20221201"
az group create \
    --name ${RESOURCE_GROUP_NAME} \
    --location eastus
```
## Create a database

### [MySQL Flexible Server](#tab/mysql-flexible-server)

Create a flexible server with the az [mysql flexible-server create](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-create) command. This example creates a flexible server named `mysql20221201` with admin user `azureuser`, and admin password `Secret123456`. Replace the password with yours. For more information, see [Create an Azure Database for MySQL Flexible Server using Azure CLI](/azure/mysql/flexible-server/quickstart-create-server-cli).

```azurecli-interactive
MYSQL_NAME="mysql20221201"
MYSQL_ADMIN_USER="azureuser"
MYSQL_ADMIN_PASSWORD="Secret123456"

az mysql flexible-server create \
    --name $MYSQL_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --location eastus \
    --admin-user $MYSQL_ADMIN_USER \
    --admin-password $MYSQL_ADMIN_PASSWORD \
    --public-access 0.0.0.0 \
    --tier Burstable \
    --sku-name Standard_B1ms
```

Create a database with [az mysql flexible-server db create](/cli/azure/mysql/flexible-server/db#az-mysql-flexible-server-db-create).

```azurecli-interactive
DATABASE_NAME="contoso"

# create mysql database
az mysql flexible-server db create \
    -g $RESOURCE_GROUP_NAME \
    -s $MYSQL_NAME \
    -d $DATABASE_NAME
```

### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

Create a flexible server with the [az postgres flexible-server create](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-create) command. This example creates a flexible server named `postgresql20221223` with admin user `azureuser`, and admin password `Secret123456`. Replace the password with yours. For more information, see [Create an Azure Database for PostgreSQL Flexible Server using Azure CLI](/azure/postgresql/flexible-server/quickstart-create-server-cli).

```azurecli-interactive
POSTGRESQL_NAME="postgresql20221223"
POSTGRESQL_ADMIN_USER="azureuser"
POSTGRESQL_ADMIN_PASSWORD="Secret123456"

az postgres flexible-server create \
    --name $POSTGRESQL_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
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
DATABASE_NAME="contoso"

# create mysql database
az postgres flexible-server db create \
    -g $RESOURCE_GROUP_NAME \
    -s $POSTGRESQL_NAME \
    -d $DATABASE_NAME
```

---

## Configure an Azure AD administrator to your database

Now that you've created the database, let's make it ready to support passwordless connection. Passwordless connection requires a combination of managed identities for Azure resources and Azure AD authentication. For an overview of managed identities for Azure resources, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview).

### [MySQL Flexible Server](#tab/mysql-flexible-server)

For details on how MySQL Flexible server interacts with managed identities, see [Use Azure Active Directory for authentication with MySQL](/azure/mysql/single-server/how-to-configure-sign-in-azure-ad-authentication).

This example configures the current Azure CLI user as an Azure AD administrator account. To enable Azure Authentication, it's necessary to assign an identity to MySQL Flexible server.

First, create a managed identity with [az identity create](/cli/azure/identity#az-identity-create) and assign to MySQL server with [az mysql flexible-server identity assign](/cli/azure/mysql/flexible-server/identity#az-mysql-flexible-server-identity-assign).

```azurecli-interactive
MYSQL_UMI_NAME="id-mysql-aad-20221205"

# create User Managed Identity for MySQL to be used for AAD authentication
az identity create -g $RESOURCE_GROUP_NAME -n $MYSQL_UMI_NAME

## assign the identity to the MySQL server
az mysql flexible-server identity assign \
    --server-name $MYSQL_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --identity $MYSQL_UMI_NAME
```

Then, create current Azure CLI user as the Azure AD administrator account with [az mysql flexible-server ad-admin create](/cli/azure/mysql/flexible-server/ad-admin#az-mysql-flexible-server-ad-admin-create). 

```azurecli-interactive
CURRENT_USER=$(az account show --query user.name -o tsv)
CURRENT_USER_OBJECTID=$(az ad signed-in-user show --query id -o tsv)

az mysql flexible-server ad-admin create \
    --server-name $MYSQL_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --object-id $CURRENT_USER_OBJECTID \
    --display-name $CURRENT_USER \
    --identity $MYSQL_UMI_NAME
```

### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

For details on how PostgreSQL Flexible server interacts with managed identities, see [Use Azure AD for authentication with Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/how-to-configure-sign-in-azure-ad-authentication).

First, get your tenant ID with the following command:

```azurecli-interactive
az account show --query tenantId
```

Grant Azure Database for PostgreSQL - Flexible Server Service Principal read access to your tenant, to request Graph API tokens for Azure AD validation tasks. The operation is completed with PowerShell commands. Input your tenant ID that was obtained from last command. For details, see [Use Azure AD authentication with Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/how-to-configure-sign-in-azure-ad-authentication#install-the-azure-ad-powershell-module).

```powershell
Connect-AzureAD -TenantId <your tenant id>

New-AzureADServicePrincipal -AppId 5657e26c-cc92-45d9-bc47-9da6cfdb4ed9
```

In the preceding command, `5657e26c-cc92-45d9-bc47-9da6cfdb4ed9` is the app ID for Azure Database for PostgreSQL - Flexible Server.

This example configures the Azure AD administrator account from Azure portal.

- Open and login Azure portal from your browser, search 'postgresql20221223' and open the database server.
- Select **Authentication**, select **PostgreSQL and Azure Active Directory authentication**.
- Select **Save**, it will take several minutes to finish the deployment. Wait for the deployment completes before you continue.
- Go back to resource 'postgresql20221223' and select **Authentication**.
- You'll find **Azure Active Directory Administrators (Azure AD Admins)** shown in the page. Select **Add Azure AD Admins**, search current account that has logged in Azure portal, select the account.
- Select **Save**, it will take several seconds to create the Azure AD Admin, as the following screenshot shows.

:::image type="content" source="media/how-to-configure-passwordless-datasource/azure-portal-postgresql-authentication.png" alt-text="Screenshot of Azure portal showing the Configure authentication on PostgreSQL Flexible Server." lightbox="media/how-to-configure-passwordless-datasource/azure-portal-postgresql-authentication.png":::

---

## Create a user-assigned managed identity

Create an identity in your subscription using the [az identity create](/cli/azure/identity#az-identity-create) command. You'll use this managed identity to connect to your database.

```azurecli-interactive
az identity create --resource-group ${RESOURCE_GROUP_NAME} --name myManagedIdentity
```

To configure the identity in the following steps, use the [az identity show](/cli/azure/identity#az-identity-show) command to store the identity's client ID in variables.

```azurecli-interactive
# Get client ID of the user-assigned identity
CLIENT_ID=$(az identity show --resource-group ${RESOURCE_GROUP_NAME} --name myManagedIdentity --query clientId --output tsv)
```

## Create a database user for your managed identity

### [MySQL Flexible Server](#tab/mysql-flexible-server)

Now, connect as the Azure AD administrator user to your MySQL database, and create a MySQL user for your managed identity.

First, you're required to create a firewall rule to access the MySQL server from your CLI client. Run the following commands to get your current IP address.

```bash
MY_IP=$(curl http://whatismyip.akamai.com)
```

If you're working on WSL with VPN enabled, the following command may return an incorrect IPv4 address. One way to get your IPv4 address is by visiting `https://whatismyipaddress.com/`. In any case, set the environment variable `MY_IP` as the IPv4 address from which you want to connect to the database.

Create a temporary firewall rule with [az mysql flexible-server firewall-rule create](/cli/azure/mysql/flexible-server/firewall-rule#az-mysql-flexible-server-firewall-rule-create).

```azurecli-interactive
az mysql flexible-server firewall-rule create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $MYSQL_NAME \
    --rule-name AllowCurrentMachineToConnect \
    --start-ip-address ${MY_IP} \
    --end-ip-address ${MY_IP}
```

Then, prepare an sql file to create a database user for the managed identity. This example adds a user with login name `identity-contoso` and grants the user privileges to access database `contoso`.

```bash
IDENTITY_LOGIN_NAME="identity-contoso"

cat <<EOF >createuser.sql
SET aad_auth_validate_oids_in_tenant = OFF;
DROP USER IF EXISTS '${IDENTITY_LOGIN_NAME}'@'%';
CREATE AADUSER '${IDENTITY_LOGIN_NAME}' IDENTIFIED BY '${CLIENT_ID}';
GRANT ALL PRIVILEGES ON ${DATABASE_NAME}.* TO '${IDENTITY_LOGIN_NAME}'@'%';
FLUSH privileges;
EOF
```

Execute the sql file with the command [az mysql flexible-server execute](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-execute). You can get your access token with the command [az account get-access-token](/cli/azure/account#az-account-get-access-token).

```azurecli-interactive
RDBMS_ACCESS_TOKEN=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken)

az mysql flexible-server execute \
    --name ${MYSQL_NAME} \
    --admin-user ${CURRENT_USER} \
    --admin-password ${RDBMS_ACCESS_TOKEN} \
    --file-path "createuser.sql"
```

You may get a prompt message for installing the extension rdbms-connect, press `y` to continue. If you're not working with `root` user, you need to input the user password.

```shell
The command requires the extension rdbms-connect. Do you want to install it now? The command will continue to run after the extension is installed. (Y/n): y
Run 'az config set extension.use_dynamic_install=yes_without_prompt' to allow installing extensions without prompt.
This extension depends on gcc, libpq-dev, python3-dev and they will be installed first.
[sudo] password for user:
```

If the sql file is completed successfully, you'll find output that is similar to the following content:

```text
Running sql file 'createuser.sql'...
Successfully executed the file.
Closed the connection to mysql20221201
```

The managed identity `myManagedIdentity` now has access to the database when authenticating with the username `identity-contoso`.

If you don't want to access the server anymore, you can remove firewall rule with the following command.

```azurecli-interactive
az mysql flexible-server firewall-rule delete \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $MYSQL_NAME \
        --rule-name AllowCurrentMachineToConnect \
        --yes
```

Finally, get connection string that you'll use in the next section.

```azurecli-interactive
CONNECTION_STRING="jdbc:mysql://${MYSQL_NAME}.mysql.database.azure.com:3306/${DATABASE_NAME}?useSSL=true"
echo ${CONNECTION_STRING}
```

### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

Now, connect as the Azure AD administrator user to your PostgreSQL database, and create a PostgreSQL user for your managed identity.

This example uses Azure Cloud Shell to connect to the database. Follow the steps to create a database user. 

- Open and login Azure portal from your browser, search `postgresql20221223` and open the database server.
- Select **Overview**, you'll find a **Connect** button. Hit **Connect**, and select database `postgres` (make sure you're using the right database) to connect to.
- You'll find the Azure Cloud Shell shows, it has connected to the database.
- Input the following command to create a user for your managed identity `myManagedIdentity`.
    ```bash
    select * from pgaadauth_create_principal('myManagedIdentity', false, false);
    ```
- You'll find a message saying **Created role for "myManagedIdentity"** which means the user is created successfully.
- List all the Azure AD user with the following command.
    ```bash
    select * from pgaadauth_list_principals(false);
    ```
- Grant `myManagedIdentity` to access your database `contoso`.

    ```bash
    GRANT ALL PRIVILEGES ON DATABASE "contoso" TO "myManagedIdentity";
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "myManagedIdentity";
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "myManagedIdentity";
    ```

- The output is similar to the following content.

    ```text
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

Finally, get connection string that you'll use in the next section.

```azurecli-interactive
CONNECTION_STRING="jdbc:postgresql://${POSTGRESQL_NAME}.postgres.database.azure.com:5432/${DATABASE_NAME}?sslmode=require"
echo ${CONNECTION_STRING}
```

---

## Configure passwordless database connection in the marketplace offer

This section shows you how to configure the passwordless data source connection in the Azure Marketplace offer. 

First, begin the process of deploying an offer. The following offers support passwordless database connection:

- [Oracle WebLogic Server on Azure Kubernetes Service](https://aka.ms/wls-aks-portal)
  - [Quickstart](/azure/developer/java/ee/weblogic-server-azure-kubernetes-service)
- [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster)
  - [Quickstart](/azure/developer/java/ee/weblogic-server-azure-virtual-machine)
- [Oracle WebLogic Server with Admin Server on VMs](https://aka.ms/wls-vm-admin)
  - [Quickstart](/azure/developer/java/ee/weblogic-server-azure-virtual-machine)
- [Oracle WebLogic Server Dynamic Cluster on VMs](https://aka.ms/wls-vm-dynamic-cluster)
  - [Quickstart](/azure/developer/java/ee/weblogic-server-azure-virtual-machine)

Fill in required information in **Basics** blade and other blades if you want to enable the features. When you reach the **Database** blade, fill in the passwordless configuration as shown in the following screenshot, take [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster) as an example.

### [MySQL Flexible Server](#tab/mysql-flexible-server)

:::image type="content" source="media/how-to-configure-passwordless-datasource/screenshot-database-portal.png" alt-text="Screenshot of Azure portal showing the Configure database pane of the Create Oracle WebLogic Server on VMs page." lightbox="media/how-to-configure-passwordless-datasource/screenshot-database-portal.png":::

1. For **Connect to database?**, select **Yes**.
1. Under **Connection settings**, for **Choose database type**, open the dropdown menu, then select **MySQL (with support for passwordless connection)**.
1. Check **Use passwordless datasource connection**.
1. For **JNDI Name**, input `testpasswordless` or your expected value.
1. For **DataSource Connection String**, input the connection string you obtained in last section.
1. For **Database username**, input database user name of your managed identity (value of `${IDENTITY_LOGIN_NAME}`), in this example, the value is `identity-contoso`.
1. For **User assigned managed identity**, select the managed identity you created in previous step, in this example, its name is `myManagedIdentity`.

### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

:::image type="content" source="media/how-to-configure-passwordless-datasource/azure-portal-postgresql-configuration.png" alt-text="Screenshot of Azure portal showing the Configure PostgreSQL database." lightbox="media/how-to-configure-passwordless-datasource/azure-portal-postgresql-configuration.png":::

1. For **Connect to database?**, select **Yes**.
1. Under **Connection settings**, for **Choose database type**, open the dropdown menu, then select **Azure Database for PostgreSQL (with support for passwordless connection)**.
1. Check **Use passwordless datasource connection**.
1. For **JNDI Name**, input `testpasswordless` or your expected value.
1. For **DataSource Connection String**, input the connection string you obtained in last section.
1. For **Database username**, input your managed identity name, in this example, the value is `myManagedIdentity`.
1. For **User assigned managed identity**, select the managed identity you created in previous step, in this example, its name is `myManagedIdentity`.

---

You've now finished configuring the passwordless connection, you can continue to fill in the following blades or click **Review + create** to deploy the offer.

## Verify database connection

The database connection is configured successfully if the offer deployment is completed without error.

Take [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster) as an example, after the deployment completes, select **Outputs**. You'll find the URL of the WebLogic Administration Console.

- To view the WebLogic Administration Console, first copy the value of the output variable `adminConsole`. Next, paste the value into your browser address bar and press **Enter** to open the sign-in page of the WebLogic Administration Console.
- Log in the WebLogic Administration Console with your username and password. 
- Under the **Domain Structure**, select **Services**, **Data Sources**, **testpasswordless**, **Monitoring**, you'll find the state of data source is **Running**, as shown in the following screenshot.

### [MySQL Flexible Server](#tab/mysql-flexible-server)

:::image type="content" source="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-datasource-state.png" alt-text="Screenshot of WebLogic Console portal showing the datasource state." lightbox="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-datasource-state.png":::

### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

:::image type="content" source="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-postgresql-state.png" alt-text="Screenshot of WebLogic Console portal showing the PostgreSQL state." lightbox="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-postgresql-state.png":::

---

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

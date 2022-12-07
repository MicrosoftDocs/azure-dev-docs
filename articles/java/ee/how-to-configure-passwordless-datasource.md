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

# Configure passwordless datasource connection using marketplace offers

[!INCLUDE [applies-to-weblogic-offers.md](includes/applies-to-weblogic-offers.md)]

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the Bash environment; make sure the Azure CLI version is 2.37.0 or above.

   [![Launch Cloud Shell in a new window](../../includes/media/hdi-launch-cloud-shell.png)](https://shell.azure.com)

- If you prefer, [install the Azure CLI 2.37.0 or above](/cli/azure/install-azure-cli) to run Azure CLI commands.
  - If you're using a local install, sign in with Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) for other sign-in options.
  - When you're prompted, install Azure CLI extensions on first use. For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).
- Ensure the Azure identity you use to sign in and complete this article has either the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription or the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) and [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) roles in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview) For details on the specific roles required by Oracle WebLogic marketplace offers, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create). This example creates a resource group named `mydbrg20221201` in the `eastus` location:

```azurecli-interactive
RESOURCE_GROUP_NAME="mydbrg20221201"
az group create \
    --name ${RESOURCE_GROUP_NAME} \
    --location eastus
```
## Create a MySQL Flexible Server

Create a flexible server with the az [mysql flexible-server create](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-create) command. This example creates a flexible server named `mysql20221201` with admin user `azureuser`, and admin password `Secret123456`, replace the password with yours. For more information, see [Create an Azure Database for MySQL Flexible Server using Azure CLI](/azure/mysql/flexible-server/quickstart-create-server-cli).

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

## Configure an Azure AD administrator to your database

To create a database user for a managed identity, you need an Azure Database for MySQL database server that has [Azure AD authentication](/azure/mysql/single-server/how-to-configure-sign-in-azure-ad-authentication) configured.

This example configures the current Azure CLI user as Azure AD administrator account. To enable Azure Authentication, it's necessary assign an identity to MySQL Flexible server.

First, create the managed identity with [az identity create](/cli/azure/identity#az-identity-create) and assign to MySQL server with [az mysql flexible-server identity assign](/cli/azure/mysql/flexible-server/identity#az-mysql-flexible-server-identity-assign).

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

Then, create the Azure AD administrator account with [az mysql flexible-server ad-admin create](/cli/azure/mysql/flexible-server/ad-admin#az-mysql-flexible-server-ad-admin-create). 

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

Create a database for the offer to connect with [az mysql flexible-server db create](/cli/azure/mysql/flexible-server/db#az-mysql-flexible-server-db-create).

```azurecli-interactive
DATABASE_NAME="contoso"

# create mysql database
az mysql flexible-server db create \
    -g $RESOURCE_GROUP_NAME \
    -s $MYSQL_NAME \
    -d $DATABASE_NAME
```

## Create a user-assigned managed identity

Create an identity in your subscription using the [az identity create](/cli/azure/identity#az-identity-create) command. You'll use this managed identity to connect to your database.

```azurecli-interactive
az identity create --resource-group ${RESOURCE_GROUP_NAME} --name myManagedIdentity
```

To configure the identity in the following steps, use the [az identity show](/cli/azure/identity#az-identity-show) command to store the identity's resource ID and client ID in variables.

```azurecli-interactive
# Get resource ID of the user-assigned identity
RESOURCE_ID=$(az identity show --resource-group ${RESOURCE_GROUP_NAME} --name myManagedIdentity --query id --output tsv)

# Get client ID of the user-assigned identity
CLIENT_ID=$(az identity show --resource-group ${RESOURCE_GROUP_NAME} --name myManagedIdentity --query clientId --output tsv)
```

## Create a MySQL user for your managed identity

Now, connect as the Azure AD administrator user to your MySQL database, and create a MySQL user for your managed identity.

First, you're required to create a firewall rule to access the MySQL server from your CLI client. Run the following commands to get your current IP address and create a temporary firewall rule.

```azurecli-interactive
MY_IP=$(curl http://whatismyip.akamai.com)
az mysql flexible-server firewall-rule create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $MYSQL_NAME \
    --rule-name AllowCurrentMachineToConnect \
    --start-ip-address ${MY_IP} \
    --end-ip-address ${MY_IP}
```

Then, prepare an sql file to create a database user for the managed identity. This example adds a user named `contoso` and grants the use to access database `contoso`.

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

Execute the sql file with the command [az mysql flexible-server execute](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-execute). You can get your access token with [az account get-access-token](/cli/azure/account#az-account-get-access-token).

```azurecli-interactive
RDBMS_ACCESS_TOKEN=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken)

az mysql flexible-server execute \
    --name ${MYSQL_NAME} \
    --admin-user ${CURRENT_USER} \
    --admin-password ${RDBMS_ACCESS_TOKEN} \
    --file-path "createuser.sql"
```

If the sql file is completed successfully, you'll find output similar to the following:

```text
Running sql file 'createuser.sql'...
Successfully executed the file.
Closed the connection to mysql20221201
```

The managed identity `myManagedIdentity` now has access when authenticating with the username `identity-contoso` (replace with a name of your choice).

If you don't want to access the database anymore, you can remove firewall rule with the following command.

```azurecli-interactive
az mysql server firewall-rule delete \
        --resource-group $RESOURCE_GROUP_NAME \
        --server $MYSQL_NAME \
        --name AllowCurrentMachineToConnect
```

Get connection string that you'll use in the next section.

```azurecli-interactive
CONNECTION_STRING="jdbc:mysql://${MYSQL_NAME}.mysql.database.azure.com:3306/${DATABASE_NAME}?useSSL=true"
echo ${CONNECTION_STRING}
```
## Configure passwordless database connection in marketplace offers

This section shows you how to configure the passwordless data source connection in Marketplace offer. 

First, begin the process of deploying an offer, you can run one of them:

- [Oracle WebLogic Server on Azure Kubernetes Service](https://aka.ms/wls-aks-portal)
- [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster)

Fill in required information in **Basics** blade and other blades if you want to enable the features. When you reach **Database**, fill in the passwordless configuration as shown in the following screenshot, take Oracle WebLogic Server Cluster on VMs offer as an example.

:::image type="content" source="media/how-to-configure-passwordless-datasource/screenshot-database-portal.png" alt-text="Screenshot of Azure portal showing the Configure database pane of the Create Oracle WebLogic Server on VMs page." lightbox="media/how-to-configure-passwordless-datasource/screenshot-database-portal.png":::

1. For **Connect to database?**, select **Yes**.
1. Under **Connection settings**, for **Choose database type**, open the dropdown menu, then select **MySQL (With support for passwordless connection)**.
1. Check **Use passwordless datasource connection**.
1. For **JNDI Name**, input `testpasswordless` or your expected value.
1. For **DataSource Connection String**, input the connection string you obtained in last section.
1. For **Database username**, input database user name of your managed identity (value of `${IDENTITY_LOGIN_NAME}`), in this example, the value is `identity-contoso`.
1. For **User assigned managed identity**, select the managed identity you created in previous step, in this example, its name is `myManagedIdentity`.

You've now finished configuring the passwordless MySQL connection, you can continue to fill in the following blades or click **Review + create** to deploy the offer.

## Verify database connection

The database connection is configured successfully if the offer deployment is completed without error.

Take Oracle WebLogic Server Cluster on VMs offer as an example, after the deployment completes, select **Outputs**. You'll find the URL of the WebLogic Administration Console.

- To view the WebLogic Administration Console, first copy the value of the output variable `adminConsole`. Next, paste the value into your browser address bar and press **Enter** to open the sign-in page of the WebLogic Administration Console.
- Log in the WebLogic Administration Console with your username and password. 
- Under the **Domain Structure**, select **Services**, **Data Sources**, **testpasswordless**, **Monitoring**, you'll find the state of data source is **Running**, as shown in the following screenshot.

:::image type="content" source="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-datasource-state.png" alt-text="Screenshot of WebLogic Console portal showing the datasource state." lightbox="media/how-to-configure-passwordless-datasource/screenshot-weblogic-console-datasource-state.png":::

## Clean up resources

If you don't need these resources, you can delete them by doing the following command:

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

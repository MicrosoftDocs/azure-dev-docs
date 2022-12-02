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
- Ensure the Azure identity you use to sign in and complete this article has either the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription or the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) and [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) roles in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview) For details on the specific roles required by Java EE marketplace offers, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create). This example creates a resource group named `mydbrg20221201` in the `eastus` location:

```azurecli-interactive
RESOURCE_GROUP_NAME="mydbrg20221201"
az group create \
    --name ${RESOURCE_GROUP_NAME} \
    --location eastus
```
## Create a MySQL Flexible Server and a database

Create a flexible server with the az [mysql flexible-server create](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-create) command. This example creates a flexible server named `mysql20221201` with admin user `azureuser`, and admin password `Secret123456`, replace the password with yours. For more information, see [Create an Azure Database for MySQL Flexible Server using Azure CLI](/azure/mysql/flexible-server/quickstart-create-server-cli).

```azurecli-interactive
MYSQL_NAME="mysql20221201"
MYSQL_ADMIN_USER="azureuser"
MYSQL_ADMIN_PASSWORD="Secret123456"

az mysql flexible-server create \
    --name $MYSQL_NAME \
    --resource-group $RESOURCE_GROUP \
    --location eastus \
    --admin-user $MYSQL_ADMIN_USER \
    --admin-password $MYSQL_ADMIN_PASSWORD \
    --public-access 0.0.0.0 \
    --tier Burstable \
    --sku-name Standard_B1ms
```


## Create a user-assigned managed identity and a MySQL user for it

Create an identity in your subscription using the [az identity create](/cli/azure/identity#az-identity-create) command.

```azurecli-interactive
az identity create --resource-group ${RESOURCE_GROUP_NAME} --name myManagedIdentity
```

## Configure passwordless database connection in marketplace offers 

## Verify database connection

## Clean up resources

## Next steps

Learn more about running WLS on AKS or virtual machines by following these links:

> [!div class="nextstepaction"]
> [WLS on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks)

> [!div class="nextstepaction"]
> [WLS on virtual machines](/azure/virtual-machines/workloads/oracle/oracle-weblogic)

---
title: Create and deploy a Django Python web app to Azure with managed identity
description: Use the Azure CLI to create and deploy a Django Python web app to Azure App Service using a user-assigned managed identity.
ms.devlang: python
ms.topic: tutorial
author: bobtabor-msft
ms.author: rotabor
ms.date: 05/30/2023
ms.custom: devx-track-python
---

# Create and deploy a Django Python web app to Azure with a user-assigned managed identity

In this tutorial, you deploy Python **[Django](https://www.djangoproject.com/)** code to create and deploy a web app running in Azure App Service. The web app uses **[managed identity](/azure/active-directory/managed-identities-azure-resources/overview)** (passwordless connections) with Azure role-based access control to access [Azure Storage](/azure/storage/common/storage-introduction) and [Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server) resources. The code uses the [DefaultAzureCredential](/azure/developer/intro/passwordless-overview#introducing-defaultazurecredential) class of the [Azure Identity client library](/python/api/overview/azure/identity-readme) for Python. The `DefaultAzureCredential` class automatically detects that a managed identity exists for the App Service and uses it to access other Azure resources.

In this tutorial, you create a user-assigned managed identity and assign it to the App Service so that it can access 
the database and storage account resources. For an example of using a system managed identity, see [Create and deploy a Flask Python web app to Azure with managed identity](./tutorial-python-managed-identity-cli.md). User-assigned identities are recommended because they can be used by multiple resources, and their life cycles are decoupled from the resources’ life cycles with which they’re associated. For more information about best practices of using managed identities, see [Managed identity best practice recommendations](/azure/active-directory/managed-identities-azure-resources/managed-identity-best-practice-recommendations).

This tutorial shows you how to create and deploy a Python web app using the Azure CLI. You can run the tutorial commands in any environment with the CLI installed, such as your local environment, the [Azure Cloud Shell](https://shell.azure.com), or [GitHub Codespaces](https://github.com/features/codespaces). For examples of using the Azure portal or Visual Studio Code to create and deploy, see [Deploy a Python web app to Azure with managed identity](./tutorial-python-managed-identity-01.md).

## Get the sample app

A sample Python application using the Django framework are available to help you follow along with this tutorial. Download or clone one of the sample applications to your local workstation.

1. Clone the sample in an Azure Cloud Shell session.

    ```azurecli
    git clone https://github.com/Azure-Samples/msdocs-django-user-assigned-managed-identity.git
    ```

2. Navigate to the application folder.

    ```azurecli
    cd msdocs-django-user-assigned-managed-identity
    ```

## Create an Azure PostgreSQL server

1. Set up the environment variables needed for the tutorial and create a resource group with the [az group create](/cli/azure/group#az-group-create) command.

      ```azurecli
      LOCATION="eastus"
      RAND_ID=$RANDOM
      RESOURCE_GROUP_NAME="msdocs-mi-web-app"
      APP_SERVICE_NAME="msdocs-mi-web-$RAND_ID"
      DB_SERVER_NAME="msdocs-mi-postgres-$RAND_ID"
      ADMIN_USER="demoadmin"
      ADMIN_PW="ChAnG33#ThsPssWD$RAND_ID"
      
      az group create --location $LOCATION --name $RESOURCE_GROUP_NAME
      ```

    > [!IMPORTANT]
    >The `ADMIN_PW` must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and nonalphanumeric characters. When creating usernames or passwords **do not** use the `$` character. Later you create environment variables with these values where the `$` character has special meaning within the Linux container used to run Python apps.

1. Create a PostgreSQL server with the [az postgres flexible-server create](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-create) command. (This and subsequent commands use the line continuation character for Bash Shell ('\\'). Change the line continuation character for your shell if needed.)

    ```azurecli
    az postgres flexible-server create \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $DB_SERVER_NAME \
      --location $LOCATION \
      --admin-user $ADMIN_USER \
      --admin-password $ADMIN_PW \
      --sku-name Standard_D2ds_v4 \
      --active-directory-auth Enabled \
      --public-access 0.0.0.0
    ```

    The *sku-name* is the name of the pricing tier and compute configuration. For more information, see [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/). To list available SKUs, use `az postgres flexible-server list-skus --location $LOCATION`.

*TBD: Confirm the command above allows access from other services. Still need to allow admin in Auth blade.*

1. Add your Azure account as an Azure AD admin for the server with the [az postgres flexible-server ad-admin create]() command.

    ```azurecli
    ACCOUNT_EMAIL=$(az ad signed-in-user show --query userPrincipalName --output tsv)
    ACCOUNT_ID=$(az ad signed-in-user show --query id --output tsv)
    echo $ACCOUNT_EMAIL, $ACCOUNT_ID
    az postgres flexible-server ad-admin create \
      --resource-group $RESOURCE_GROUP_NAME \
      --server-name $DB_SERVER_NAME \
      --display-name $ACCOUNT_EMAIL \
      --object-id $ACCOUNT_ID \
      --type User
    ```

1. Create a database named `restaurant` using the [az postgres flexible-server execute](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-execute) command.

    ```azurecli
    az postgres flexible-server execute \
      --name $DB_SERVER_NAME \
      --admin-user $ADMIN_USER \
      --admin-password $ADMIN_PW \
      --database-name postgres \
      --querytext 'create database restaurant;'
    ```

## Create an Azure App Service and deploy the code

Run these commands in the root folder of the sample app.

1. Create an app service using the [az webapp up](/cli/azure/webapp#az-webapp-up) command.

    ```azurecli
    az webapp up \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --runtime PYTHON:3.9 \
      --sku B1
    ```

    The *sku* defines the size (CPU, memory) and cost of the app service plan.  The B1 (Basic) service plan incurs a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) page.

1. Configure App Service to use the *start.sh* in the repo with the [az webapp config set](/cli/azure/webapp/config#az-webapp-config-set) command.

    ```azurecli
    az webapp config set \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --startup-file "start.sh"
    ```

## Create a storage account and container

The sample app uses a storage account and blob container to store photos. The storage account is configured to allow public access to the container. The app uses the managed identity and the `DefaultAzureCredential` to access the storage account.

1. Use the [az storage create](/cli/azure/storage#az-storage-create) command to create a storage account.

    ```azurecli
    STORAGE_ACCOUNT_NAME="msdocsstorage$RANDOM"
    az storage account create \
      --name $STORAGE_ACCOUNT_NAME \
      --resource-group $RESOURCE_GROUP_NAME \
      --location $LOCATION \
      --sku Standard_LRS \
      --allow-blob-public-access true
    ```

1. Create a container called *photos* in the storage account with the [az storage container create](/cli/azure/storage/container#az-storage-container-create) command.

    ```azurecli
    az storage container create \
      --account-name $STORAGE_ACCOUNT_NAME \
      --name photos \
      --public-access blob 
    ```

## Create a user-assigned managed identity

Create a user-assigned managed identity and assign it to the App Service. The managed identity is used to access the database and storage account.

1. Use the [az identity create](/cli/azure/identity#az-identity-create) command to create a user-assigned managed identity and output the client ID to a variable for later use.

    ```azurecli
    UAClientID=$(az identity create --name UAManagedIdentityPythonTest --resource-group $RESOURCE_GROUP_NAME --query clientId --output tsv)
    echo $UAClientID
    ```

1. Use the [az account show](/cli/azure/account#az-account-show) command to get your subscription ID and output it to a variable that can be used to construct the resource ID of the managed identity.

    ```azurecli
    SUBSCRIPTION_ID=$(az account show --query id --output tsv)
    RESOURCE_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.ManagedIdentity/userAssignedIdentities/UAManagedIdentityPythonTest"
    echo $RESOURCE_ID
    ```

1. Assign the managed identity to the App Service with the [az webapp identity assign](/cli/azure/webapp/identity#az-webapp-identity-assign) command.

    ```azurecli
    az webapp identity assign \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $APP_SERVICE_NAME \
        --identities $RESOURCE_ID
    ```

1. Create an App Service app setting that contains the client ID of the managed identity with the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command.

    ```azurecli
    az webapp config appsettings set \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $APP_SERVICE_NAME \
        --settings AZURE_CLIENT_ID=$UAClientID
    ```
    
## Create roles for the managed identity

In this section, you create role assignments for the managed identity to enable access to the storage account and database.

1. Create a role assignment for the managed identity to enable access to the storage account with the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command.

    ```azurecli
    export MSYS_NO_PATHCONV=1
    az role assignment create \
    --assignee $UAClientID \
    --resource-group $RESOURCE_GROUP_NAME \
    --role "Storage Blob Data Contributor" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/resourcegroups/$RESOURCE_GROUP_NAME"
    ```

    The command specifies the scope of the role assignment to the resource group. For more information, see [Understand role assignments](/azure/role-based-access-control/role-assignments-portal#understand-role-assignments).

1. Use the [az postgres flexible-server execute](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-execute) command to connect to the Postgres database and run the same commands to assign roles to the managed identity.

    ```azurecli
    ACCOUNT_EMAIL_TOKEN=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken)
    az postgres flexible-server execute \
      --name $DB_SERVER_NAME \
      --admin-user $ACCOUNT_EMAIL \
      --admin-password $ACCOUNT_EMAIL_TOKEN \
      --database-name postgres \
      --querytext "select * from pgaadauth_create_principal('UAManagedIdentityPythonTest', false, false);select * from pgaadauth_list_principals(false);"
    ```

## Test the Python web app in Azure

The sample Python app uses the [azure.identity](https://pypi.org/project/azure-identity/) package and its `DefaultAzureCredential` class. `DefaultAzureCredential` automatically detects that a managed identity exists for the App Service and uses it to access other Azure resources (storage and PostgreSQL in this case). There's no need to provide storage keys, certificates, or credentials to the App Service to access these resources.

1. Browse to the deployed application at the URL `http://$APP_SERVICE_NAME.azurewebsites.net`.

    It can take a minute or two for the app to start. If you see a default app page that isn't the default sample app page, wait a minute and refresh the browser.

2. Test the functionality of the sample app by adding a restaurant and some reviews with photos for the restaurant.

    The restaurant and review information is stored in Azure Database for PostgreSQL and the photos are stored in Azure Storage. Here's an example screenshot:

    :::image type="content" source="./media/python-web-app-managed-identity/example-of-review-sample-app-production-deployed-small.png" lightbox="./media/python-web-app-managed-identity/example-of-review-sample-app-production-deployed.png" alt-text="Screenshot of the sample app showing restaurant review functionality using Azure App Service, Azure PostgreSQL Database, and Azure Storage." :::

## Clean up

In this tutorial, all the Azure resources were created in the same resource group. Removing the resource group removes with the [az group delete](/cli/azure/group#az_group_delete) command removes all resources in the resource group and is the fastest way to remove all Azure resources used for your app.

```azurecli
az group delete  --name $RESOURCE_GROUP_NAME 
```

You can optionally add the `--no-wait` argument to allow the command to return before the operation is complete.

## Next steps

* [Deploy a Python web app to Azure with PostgreSQL and managed identity](./tutorial-python-managed-identity-01.md)

* [Deploy a Python (Django or Flask) web app with PostgreSQL in Azure App Service](/azure/app-service/tutorial-python-postgresql-app)
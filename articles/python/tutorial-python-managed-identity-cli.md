---
title: Create and deploy a Flask Python web app to Azure with system-assigned managed identity
description: Use the Azure CLI to create and deploy a Flask Python web app to Azure App Service using a system-assigned managed identity.
ms.devlang: python
ms.topic: tutorial
ms.date: 04/16/2024
ms.custom: devx-track-python, devx-track-azurecli
---

# Create and deploy a Flask Python web app to Azure with system-assigned managed identity

In this tutorial, you deploy Python **[Flask](https://flask.palletsprojects.com/)** code to create and deploy a web app running in Azure App Service. The web app uses its system-assigned **[managed identity](/azure/active-directory/managed-identities-azure-resources/overview)** (passwordless connections) with Azure role-based access control to access [Azure Storage](/azure/storage/common/storage-introduction) and [Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server) resources. The code uses the [DefaultAzureCredential](/azure/developer/intro/passwordless-overview#introducing-defaultazurecredential) class of the [Azure Identity client library](/python/api/overview/azure/identity-readme) for Python. The `DefaultAzureCredential` class automatically detects that a managed identity exists for the App Service and uses it to access other Azure resources.

You can configure passwordless connections to Azure services using Service Connector or you can configure them manually. This tutorial shows how to use Service Connector. For more information about passwordless connections, see [Passwordless connections for Azure services](/azure/developer/intro/passwordless-overview). For information about Service Connector, see the [Service Connector documentation](/azure/service-connector/overview).

This tutorial shows you how to create and deploy a Python web app using the Azure CLI. The commands in this tutorial are written to be run in a Bash shell. You can run the tutorial commands in any Bash environment with the CLI installed, such as your local environment or the [Azure Cloud Shell](https://shell.azure.com). With some modification -- for example, setting and using environment variables -- you can run these commands in other environments like Windows command shell. For examples of using a user-assigned managed identity, see [Create and deploy a Django web app to Azure with a user-assigned managed identity](./tutorial-python-managed-identity-user-assigned-cli.md).

## Get the sample app

A sample Python application using the Flask framework are available to help you follow along with this tutorial. Download or clone one of the sample applications to your local workstation.

1. Clone the sample in an Azure Cloud Shell session.

    ```console
    git clone https://github.com/Azure-Samples/msdocs-flask-web-app-managed-identity.git
    ```

2. Navigate to the application folder.

    ```console
    cd msdocs-flask-web-app-managed-identity
    ```

## Examine authentication code

The sample web app needs to authenticate to two different data stores:

- Azure blob storage server where it stores and retrieves photos submitted by reviewers.
- An Azure Database for PostgreSQL - Flexible Server database where it stores restaurants and reviews.

It uses [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) to authenticate to both data stores. With `DefaultAzureCredential`, the app can be configured to run under the identity of different service principals, depending on the environment it's running in, without making changes to code. For example, in a local development environment, the app can run under the identity of the developer signed in to the Azure CLI, while in Azure, as in this tutorial, it can run under its system-assigned managed identity.

In either case, the security principal that the app runs under must have a role on each Azure resource the app uses that permits it to perform the actions on the resource that the app requires. In this tutorial, you use service connectors to automatically enable the system-assigned managed identity on your app in Azure and to assign that identity appropriate roles on your Azure storage account and Azure Database for PostgreSQL server.

After the system-assigned managed identity is enabled and is assigned appropriate roles on the data stores, you can use `DefaultAzureCredential` to authenticate with the required Azure resources.

The following code is used to create a blob storage client to upload photos in `app.py`. An instance of `DefaultAzureCredential` is supplied to the client, which it uses to acquire access tokens to perform operations against Azure storage.

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

azure_credential = DefaultAzureCredential()
blob_service_client = BlobServiceClient(
    account_url=account_url,
    credential=azure_credential)
```

An instance of `DefaultAzureCredential` is also used to get an access token for Azure Database for PostgreSQL in `./azureproject/get_conn.py`. In this case, the token is acquired directly by calling [get_token](/python/api/azure-identity/azure.identity.defaultazurecredential#azure-identity-defaultazurecredential-get-token) on the credential instance and passing it the appropriate `scope` value. The token is then used in the place of the password in the PostgreSQL connection URI returned to the caller.

```python
azure_credential = DefaultAzureCredential()
token = azure_credential.get_token("https://ossrdbms-aad.database.windows.net")
conn = str(current_app.config.get('DATABASE_URI')).replace('PASSWORDORTOKEN', token.token)
```

To learn more about authenticating your apps with Azure services, see [Authenticate Python apps to Azure services by using the Azure SDK for Python](./sdk/authentication/overview.md). To learn more about `DefaultAzureCredential`, including how to customize the credential chain it evaluates for your environment, see [DefaultAzureCredential overview](./sdk/authentication/credential-chains.md#defaultazurecredential-overview).

## Create an Azure PostgreSQL server

1. Set up the environment variables needed for the tutorial.

      ```bash
      LOCATION="eastus"
      RAND_ID=$RANDOM
      RESOURCE_GROUP_NAME="msdocs-mi-web-app"
      APP_SERVICE_NAME="msdocs-mi-web-$RAND_ID"
      DB_SERVER_NAME="msdocs-mi-postgres-$RAND_ID"
      ADMIN_USER="demoadmin"
      ADMIN_PW="ChAnG33#ThsPssWD$RAND_ID"
      ```

    > [!IMPORTANT]
    >The `ADMIN_PW` must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and nonalphanumeric characters. When creating usernames or passwords **do not** use the `$` character. Later you create environment variables with these values where the `$` character has special meaning within the Linux container used to run Python apps.

1. Create a resource group with the [az group create](/cli/azure/group#az-group-create) command.

      ```azurecli
      az group create --location $LOCATION --name $RESOURCE_GROUP_NAME
      ```

1. Create a PostgreSQL server with the [az postgres flexible-server create](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-create) command. (This and subsequent commands use the line continuation character for Bash Shell ('\\'). Change the line continuation character for your shell if needed.)

    ```azurecli
    az postgres flexible-server create \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $DB_SERVER_NAME \
      --location $LOCATION \
      --admin-user $ADMIN_USER \
      --admin-password $ADMIN_PW \
      --sku-name Standard_D2ds_v4
    ```

    The *sku-name* is the name of the pricing tier and compute configuration. For more information, see [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/). To list available SKUs, use `az postgres flexible-server list-skus --location $LOCATION`.

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

1. Create an app service using the [az webapp up](/cli/azure/webapp#az-webapp-up) command.

    ```azurecli
    az webapp up \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --runtime PYTHON:3.9 \
      --sku B1
    ```

    The *sku* defines the size (CPU, memory) and cost of the app service plan. The B1 (Basic) service plan incurs a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) page.

1. Configure App Service to use the *start.sh* in the repo with the [az webapp config set](/cli/azure/webapp/config#az-webapp-config-set) command.

    ```azurecli
    az webapp config set \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --startup-file "start.sh"
    ```

## Create passwordless connectors to Azure resources

The Service Connector commands configure Azure Storage and Azure Database for PostgreSQL resources to use managed identity and Azure role-based access control. The commands create app settings in the App Service that connect your web app to these resources. The output from the commands lists the service connector actions taken to enable passwordless capability.

1. Add a PostgreSQL service connector with the [az webapp connection create postgres-flexible](/cli/azure/webapp/connection/create#az-webapp-connection-create-postgres-flexible) command. The system-assigned managed identity is used to authenticate the web app to the target resource, PostgreSQL in this case.

    ```azurecli
    az webapp connection create postgres-flexible \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --target-resource-group $RESOURCE_GROUP_NAME \
      --server $DB_SERVER_NAME \
      --database restaurant \
      --client-type python \
      --system-identity
    ```

1. Add a storage service connector with the [az webapp connection create storage-blob](/cli/azure/webapp/connection/create#az-webapp-connection-create-storage-blob) command.

    This command also adds a storage account and adds the web app with role *Storage Blob Data Contributor* to the storage account.

    ```azurecli
    STORAGE_ACCOUNT_URL=$(az webapp connection create storage-blob \
      --new true \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --target-resource-group $RESOURCE_GROUP_NAME \
      --client-type python \
      --system-identity \
      --query configurations[].value \
      --output tsv)
    STORAGE_ACCOUNT_NAME=$(cut -d . -f1 <<< $(cut -d / -f3 <<< $STORAGE_ACCOUNT_URL))
    ```

## Create a container in the storage account

The sample Python app stores photos submitted by reviewers as blobs in a container in your storage account.

* When a user submits a photo with their review, the sample app writes the image to the container using its system-assigned managed identity for authentication and authorization. You configured this functionality in the last section.

* When a user views the reviews for a restaurant, the app returns a link to the photo in blob storage for each review that has one associated with it. For the browser to display the photo, it must be able to access it in your storage account. The blob data must be available for read publicly through anonymous (unauthenticated) access.

To enhance security, storage accounts are created with anonymous access to blob data disabled by default. In this section, you enable anonymous read access on your storage account and then create a container named *photos* that provides public (anonymous) access to its blobs.

1. Update the storage account to allow anonymous read access to blobs with the [az storage account update](/cli/azure/storage/container#az-storage-account-update) command.

    ```azurecli
    az storage account update \
      --name $STORAGE_ACCOUNT_NAME \
      --resource-group $RESOURCE_GROUP_NAME \
      --allow-blob-public-access true
    ```

    Enabling anonymous access on the storage account doesn't affect access for individual blobs. You must explicitly enable public access to blobs at the container-level.

1. Create a container called *photos* in the storage account with the [az storage container create](/cli/azure/storage/container#az-storage-container-create) command. Allow anonymous read (public) access to blobs in the newly created container.

    ```azurecli
    az storage container create \
      --account-name $STORAGE_ACCOUNT_NAME \
      --name photos \
      --public-access blob \
      --account-key $(az storage account keys list --account-name $STORAGE_ACCOUNT_NAME \
          --query [0].value --output tsv) 
    ```

    > [!NOTE]
    > For brevity, this command uses the storage account key to authorize with the storage account. For most scenarios, Microsoft's recommended approach is to use Microsoft Entra ID and Azure (RBAC) roles. For a quick set of instructions, see [Quickstart: Create, download, and list blobs with Azure CLI](/azure/storage/blobs/storage-quickstart-blobs-cli#create-a-container). Note that several Azure roles permit you to create containers in a storage account, including "Owner", "Contributor", "Storage Blob Data Owner", and "Storage Blob Data Contributor".

To learn more about anonymous read access to blob data, see [Configure anonymous read access for containers and blobs](/azure/storage/blobs/anonymous-read-access-configure).

## Test the Python web app in Azure

The sample Python app uses the [azure.identity](https://pypi.org/project/azure-identity/) package and its `DefaultAzureCredential` class. When the app is running in Azure, `DefaultAzureCredential` automatically detects if a managed identity exists for the App Service and, if so, uses it to access other Azure resources (storage and PostgreSQL in this case). There's no need to provide storage keys, certificates, or credentials to the App Service to access these resources.

1. Browse to the deployed application at the URL `http://$APP_SERVICE_NAME.azurewebsites.net`.

    It can take a minute or two for the app to start. If you see a default app page that isn't the default sample app page, wait a minute and refresh the browser.

2. Test the functionality of the sample app by adding a restaurant and some reviews with photos for the restaurant.

    The restaurant and review information is stored in Azure Database for PostgreSQL and the photos are stored in Azure Storage. Here's an example screenshot:

    :::image type="content" source="./media/python-managed-identity/example-of-review-sample-app-production-deployed-small.png" lightbox="./media/python-managed-identity/example-of-review-sample-app-production-deployed.png" alt-text="Screenshot of the sample app showing restaurant review functionality using Azure App Service, Azure PostgreSQL Database, and Azure Storage." :::

## Clean up

In this tutorial, all the Azure resources were created in the same resource group. Removing the resource group removes with the [az group delete](/cli/azure/group#az_group_delete) command removes all resources in the resource group and is the fastest way to remove all Azure resources used for your app.

```azurecli
az group delete  --name $RESOURCE_GROUP_NAME 
```

You can optionally add the `--no-wait` argument to allow the command to return before the operation is complete.

## Next steps

* [Create and deploy a Django web app to Azure with a user-assigned managed identity](./tutorial-python-managed-identity-user-assigned-cli.md)

* [Deploy a Python (Django or Flask) web app with PostgreSQL in Azure App Service](/azure/app-service/tutorial-python-postgresql-app)

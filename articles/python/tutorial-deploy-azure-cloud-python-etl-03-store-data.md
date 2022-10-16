---
title: "Tutorial: Store news search results data with Python on Azure"
description: In this tutorial, you'll modify a Python Azure Function to store Bing News Search API results in Azure Blob Storage.
services: python, azure-functions, azure-storage-accounts, bing-search-services
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.date: 10/15/2022
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Tutorial: Store Bing News Search API results in Azure Blob Storage using a Python Azure Function

In this tutorial, you'll use a local Azure Function to store the news articles for a specified search-term as a JSON file in [Azure Blob Storage](/products/storage/blobs/).

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/deploy-azure-cloud-python-etl-architecture.svg" alt-text="Deploy Serverless, Azure Cloud Python ETL Solution Architecture Diagram" lightbox="./media/tutorial-deploy-azure-cloud-python-etl/deploy-azure-cloud-python-etl-architecture.svg" border="false":::

## 1. Create an Azure Blob Storage datastore

Azure Blob Storage is a general-purpose, object storage solution. In this series, blob storage acts as a landing zone for  '*source*' data and is a common data engineering scenario. Follow these steps to create the Azure Blob Storage resource and configure a Blob Container.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step 1.** Navigate to create an Azure Storage Account resource in the Azure portal.
        1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
        1. Enter **storage** in the search box.
        1. Navigate to **Storage accounts** under **Services** in the search results.
        1. Select the **+ Create** button in the **Storage accounts** dialogue.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage.png" alt-text="Screenshot showing how to search in the Azure portal and find Azure Storage Account service." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** On the **Basics tab**, provide the following information for your storage account.
        1. **Subscription**: Select <**YOUR-SUBSCRIPTION**>.
        1. **Resource group**: Select **msdocs-python-cloud-etl-rg**.
        1. **Name**: Enter **msdocspythoncloudetlabs**.
        1. **Location**: Select **East US**.
        1. **Performance**: Select **Standard**.
        1. **Replication**: Select **Locally-redundant storage (LRS)**.
        1. Select **Review** to proceed to validate the configuration values before creating the resource.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-configure.png" alt-text="A screenshot of configuring the new Azure Storage Account using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-configure.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Select **Create** to accept the default options, then proceed to validate and create the account.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-review.png" alt-text="A screenshot of reviewing the configuration of the new Azure Storage Account using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-review.png":::
    :::column-end:::
:::row-end:::

### [Visual Studio Code](#tab/vscode)

:::row:::
    :::column:::
        **Step 1.** Create a new Azure Storage Account.
        1. Open Azure Tools Extension by selecting the **Azure icon** in the **Activity bar**.
        1. Right-click (Windows) or Ctrl + Select (macOS) the **Storage accounts** item.
        1. Select **Create Storage Account...(Advanced)**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-create-blob-storage.png" alt-text="A screenshot showing how to use the Visual Studio Code Azure Tools extension to create a new Azure Storage Account." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-create-blob-storage.png" :::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Enter following information in the prompts:
        1. **Name**: Enter `msdocspythoncloudetlabs`.
        1. **Select a resource group for new resources**: Enter `msdocs-python-cloud-etl-rg`.
        1. **Would you like to enable static website hosting?**: Select `No`.
        1. **Select a location for new resources**: Select `East US`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-configure-blob-storage.gif" alt-text="An animated screenshot showing how to configure a new Azure Storage Account using the Visual Studio Code Azure Tools extension." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-configure-blob-storage.gif" :::
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

Run the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command to create an Azure Storage Accounts.

```azurecli
# Use the same resource group you create the web app in.
az storage account create \
    --name 'msdocspythoncloudetlabs' \
    --resource-group 'msdocs-python-cloud-etl-rg' \
    --location 'eastus' \ 
    --sku Standard_LRS \
    --assign-identity
```

---

>[!IMPORTANT]
>Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. Storage account names must also be unique across Azure.

## 2. Assign access role to user account

In development, the account used to log into Azure requires the *Storage Blob Data Contributor* role assignment to grant read/write/delete permissions to Blob storage resources. In production, you'll use the service principal created by the managed identity for the hosting service.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step 1.** In the Azure Storage Account and, add role assignment.
        1. Select **Access Control (IAM)** in the left panel in the **Storage Account** resource dialogue window.
        1. Select **Add role assignment** button in the **Grant access to this resource** section.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-IAM.png" alt-text="A screenshot showing how to navigate to Access Control (IAM) role assignment. " lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-IAM.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** In the **Add role assignment** dialogue, search for and select **Storage Blob Data Contributor**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-IAM-role.png" alt-text="A screenshot showing finding the Storage Blob Data Contributor in Access Control (IAM) role dialogue." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-IAM-role.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Choose the members to grant Storage Blob Data Contributor role.
        1. **Select role**: Select **User, group, or service principal**.
        1. **Members**: Select **+ Select members**.
        1. Search for your user account name in the dialogue.
        1. Select the **Select** button to add your user account as a member of this role.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-IAM-member.png" alt-text="A screenshot showing how your user account name to assign the role to." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-IAM-member.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 4.** Review the selected values and select **Review + Assign**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-IAM-assign.png" alt-text="A screenshot of reviewing and creating the Access Control (IAM) role assignment. " lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-IAM-assign.png":::
    :::column-end:::
:::row-end:::

### [Visual Studio Code](#tab/vscode)

To assign access control roles for an Azure resource, you **must** use the Azure portal or the Azure CLI.

### [Azure CLI](#tab/azure-cli)

```bash
# Assign the 'Storage Blob Data Contributor' role to your user
az role assignment create \
    --role "Storage Blob Data Contributor" \
    --assignee <YOUR USER PRINCIPAL NAME> \
    --scope "/subscriptions/<YOUR-SUBSCRIPTION-ID>/resourceGroups/msdocs-python-cloud-etl-rg/providers/Microsoft.Storage/storageAccounts/msdocspythoncloudetlabs"
```

>[!NOTE]
>Role assignment creation could take a minute to apply in Azure. It is recommended to wait a moment before running the next command in this article.

---

## 3. Create Blob Storage Container

A container organizes a set of blobs, similar to a directory in a file system. A storage account can include an unlimited number of containers, and a container can store an unlimited number of blobs.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step 1.** In the navigation pane for the storage account, scroll to the Data storage section and select **Containers**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-container.png" alt-text="Screenshot navigating to the Container pane for an Azure Blob Storage Account." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-container.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Within the **Containers** pane, select the **+ Container** button to open the New container pane.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-container-create.png" alt-text="Screenshot navigating to create a new Container." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-container-create.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Within the **New Container** pane, provide the following information:
        1. **Name**: Enter `msdocs-python-cloud-etl-news-source`.
        1. **Public access level**: Select **Private (no anonymous access)**. (*The Default Value*)
        1. Select **Create** to create the container.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-container-configure-new.png" alt-text="Screenshot configuring the New Container pane for an Azure Blob Storage Account." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-container-configure-new.png":::
    :::column-end:::
:::row-end:::

### [Visual Studio Code](#tab/vscode)

:::row:::
    :::column:::
        Create a container for news search results data.
        1. Expand **Storage accounts** under the **Resources** section of the Azure Tools extension.
        1. Right-Click on **Blob Containers**.
        1. Select **Create Blob Container...**.
        1. **Name**: Enter `msdocs-python-cloud-etl-news-source` in the prompt.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-create-blob-container.gif" alt-text="An animated screenshot showing how to create a new Blob Container in Azure Storage using the Visual Studio Code Azure Tools extension." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-create-blob-container.gif" :::
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

Create a container for *news-source* data in the storage account with the [az storage container create](/cli/azure/storage/container#az-storage-container-create) command.

```azurecli
az storage container create \
    --name 'msdocs-python-cloud-etl-news-source' \
    --public-access blob \
    --account-name 'msdocspythoncloudetlabs' \
    --auth-mode login
```

---

## 4. Load search results into Azure Storage

**Step 1.** Create App Settings for the Azure resources.

1. Navigate to the **Explorer** icon in the **Activity bar**.
1. Open the **local.settings.json** in the **editor** pane.
1. Add a key-value pair to store the **Azure Storage Account** name by entering `, "ABS_ACCOUNT_NAME": "msdocspythoncloudetlabs"`.
1. Add another key-value pair to store the container name by entering `, "ABS_SRC_CONTAINER": "msdocs-python-cloud-etl-news-source"`.

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-function-app-settings.png" alt-text="A screenshot showing how to add App Settings for Azure Storage information to the local.settings.json file in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-function-app-settings.png":::

<br/>

**Step 2.** In the same local Azure Function, create a new function definition to upload the Bing News Search results as a JSON file to the Azure Blob Storage Container.

```python
import random
import string

from azure.storage.blob import BlobClient

def upload_search_results_to_blob(search_results_data_str, blob_url, azure_credential, search_term):
    try:     
        logging.info(f"Connecting to Azure Blob Storage.") 
        
        # Create the BlobClient from the blob URL passed to the function.
        blob_client = BlobClient.from_blob_url(blob_url=blob_url,credential=azure_credential)
        blob_client.upload_blob(data=search_results_data_str)

        logging.info(f"Successfully uploaded JSON file of the Bing News Search results for {search_term} to {blob_url}.")
    except Exception as e:
        logging.critical(e)
```

<br/>

**Step 3.** Modify **main** function definition in the same local Azure Function to call each new function.

```python
## Receives a func.request object and returns a value of type func.HttpRequest.
def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # Looks for 'search_term' parameter in the URL. 
    search_term = req.params.get('search_term')

    # If 'search_term' parameter doest not exit in the URL.
    if not search_term:
        try:
            # Check if the request body contains JSON.
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            # Checks if the JSON contains the 'search_term' value.
            search_term = req_body.get('search_term')

    # If 'search_term' is found, then move forward with getting Bing News Search results.
    if search_term:
        # Bing News Search Endpoint URL
        bing_news_search_URL = 'https://api.bing.microsoft.com/v7.0/news/search'

        #The DefaultAzureCredential gets the authentication token based on the environment the application is running
        credential = DefaultAzureCredential(additionally_allowed_tenants=['*'])

        # Get App Settings
        akv_name = os.environ["KEY_VAULT_NAME"]
        akv_secret_name = os.environ["BING_SEARCH_SUB_KEY_SECRET"]
        abs_account_name = os.environ["ABS_ACCOUNT_NAME"]
        abs_source_container = os.environ["ABS_SRC_CONTAINER"]

        # Create a hash value to append to output file for uniqueness.
        hash1 = ''.join(random.sample(string.ascii_letters + string.digits, 15))

        # Generate storage blob url for output blob(JSON file).
        base_abs_blob_url = f"https://{abs_account_name}.blob.core.windows.net/{abs_source_container}/search_results-{search_term}-{hash1}.json"

        # Retrieve Bing Search API subscription key that was stored as
        # a secret in the Azure Key Vault.
        bing_api_subscription_key = get_key_vault_secret(key_vault_name=akv_name, secret_name=akv_secret_name, azure_credential=credential)

        # Call Bing News Search api with specified values and 
        # return JSON results.
        news_search_results = call_bing_search_api(   
                                search_url=bing_news_search_URL,
                                search_term=search_term,
                                api_subscription_key=bing_api_subscription_key
        )

        # Encodes the JSON results to a serialized string.
        results_json_str = json.dumps(news_search_results)

        # Write and upload JSON string Azure Storage Blob.
        upload_search_results_to_blob(search_results_data_str=results_json_str,
                                        blob_url=base_abs_blob_url,
                                        azure_credential=credential,
                                        search_term=search_term
        )

        return func.HttpResponse(
            f'Successfully executed Azure Function and retrieved the Bing News search results for {search_term}.',
            status_code=200
        )
    else:
        return func.HttpResponse(
            "!!! HTTP triggered ERROR: you must pass a 'search_term' in the query string or in the request body for successful function execution.",
            status_code=500
        )
```

## 5. Test the HTTPTrigger Azure Function

**Step 1.**  Run the function locally by pressing `F5` or the play icon.

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-run-function.png" alt-text="A screenshot showing how to build and run the new local function in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-run-function.png":::

**Step 2.** Execute the function locally.

1. Choose the **Azure icon** in the **Activity bar**. 
1. In the **Workspace area**, expand **Local Project > Functions**. 
1. Right-click (Windows) or Ctrl + Select (macOS) the **msdocs-cloud-python-etl-HttpTrigger** function.
1. Choose **Execute Function Now**.

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-execute-function.png" alt-text="A screenshot showing executing the new local function in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-execute-function.png":::

**Step 3.** Test the new functionality by entering the request message body value `{ "search_term": "Azure"}` and press Enter.

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-execute-http-function.gif" alt-text="Animated screenshot of testing the HTTPTrigger Azure Function in Visual Studio." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-execute-http-function.gif":::

## Next step

> [!div class="nextstepaction"]
> [Process/Prep the Data >>](tutorial-deploy-azure-cloud-python-etl-04-process-data.md)

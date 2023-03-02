---
title: "Tutorial: Get Bing News with Python"
description: In this tutorial, you'll create a local Python Azure Functions project to call the Bing News Search SDK and store the search results in Azure Blob Storage.
services: python, azure-functions, azure-storage-accounts, bing-search-services
ms.custom: devx-track-python, engagement-fy23
ms.devlang: python
ms.topic: tutorial
ms.date: 01/03/2023
---

# Tutorial: Get Bing News using a Python Azure Function

In this tutorial, you'll create a local [Azure Function](https://azure.microsoft.com/products/functions/) in Python that responds to HTTP requests. The Azure Function:

* Gets the Bing Search key from Key Vault
* **Ingest**: Calls the [Bing News Search API service](/bing/search-apis/bing-news-search) with your search term
* **Store**: Stores the search results as a JSON file in [Azure Blob Storage](https://azure.microsoft.com/products/storage/blobs/).

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/data-load-bing-search.png" alt-text="Deploy Serverless, Azure Cloud Python ETL Solution Architecture Diagram" lightbox="./media/tutorial-deploy-azure-cloud-python-etl/data-load-bing-search.png" border="false":::

## Prerequisites

You must have completed all steps from the [Overview](tutorial-deploy-azure-cloud-python-etl-01-overview.md) for this series.

## 1. Create a local Azure Function and an HTTPTrigger endpoint

:::row:::
    :::column:::
        **Step 1.** Create new local Azure Functions project in the Visual Studio Code workspace.
        1. Choose the **Azure icon** in the **Activity bar**.
        1. In the **Workspace (local) area**, select the **Create function** button.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-create-new-function.png" alt-text="A screenshot showing how to create a new local function project in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-create-new-function.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Enter the following information at the prompts:
        1. **Select a language**: Choose **Python**.
        1. **Select a Python interpreter to create a virtual environment**: Choose your **preferred Python interpreter**. (*If an option isn't shown, type in the full path to your Python binary.*)
        1. **Select a template for your project's first function**: Choose **HTTP trigger**.
        1. **Provide a function name**: Enter `api_search`.
        1. **Authorization level**: Choose **Function**.  (*For more information about the authorization level, see [Authorization keys](/azure/azure-functions/functions-bindings-http-webhook-trigger#authorization-keys).*)
        1. View the `api_search` trigger.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-initial-http-trigger.png" alt-text="A screenshot of Visual Studio Code showing the new local function HTTP trigger code in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-initial-http-trigger.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Start the function app locally in Visual Studio Code by pressing `F5` or the play icon.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-run-function.png" alt-text="A screenshot showing how to build and run the new local function in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-run-function.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 4.** Call the API from Visual Studio Code.
        1. Choose the **Azure icon** in the **Activity bar**.
        1. In the **Workspace area**, expand **Local Project** and then **Functions**.
        1. Right-click (Windows) or Ctrl + Select (macOS) the **api_search** function.
        1. Choose **Execute Function Now**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-execute-function.png" alt-text="A screenshot showing executing the new local function in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-execute-function.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 5.** Add the API body by entering the request message body value `{ "name": "<YOUR_NAME>"}` and press Enter. Stop the function, <kbd>Shift</kbd> + <kbd>F5</kbd>.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-test-new-function.png" alt-text="A screenshot showing the edit box for the API body function in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-test-new-function.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 6.** View the API response.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-initial-http-trigger-result.png" alt-text="A screenshot of the new local function's result in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-initial-http-trigger-result.png":::
    :::column-end:::
:::row-end:::

## 2. Change Azure Function API route in function.json

The route is determined from the folder name, in the format of `/api/FOLDER-NAME`. Using the folder name provided, your route is currently set to `/api/api_search`. Change this to be more RESTful. Change this value in the **function.json** file.

1. Open the **function.json** file in the `api_search` folder. 
1. Add the `route` property as shown in the following json so your API route is `/api/search`.

    :::code language="json" source="~/../msdocs-python-etl-serverless/api_search/function.json" highlight="13":::

## 3. Set application settings in local.settings.json for Python Functions App

1. Open the **./local.settings.json** file.
1. Replace the file contents with the following JSON. As you progress through the tutorial series, you're instructed to add values to this file. This file allows you to connect to Azure while you develop your python app locally. 

    :::code language="json" source="~/../msdocs-python-etl-serverless/local.settings.json.rename" :::

    The highlighted lines indicate settings made in this article. 

## 4. Get Azure credential with Python

The code in this tutorial relies on the secure authentication to Azure with the [Azure Identity](https://pypi.org/project/azure-identity/) package, using:
* Passwordless authentication - the most secure connection to Azure
    * SDK object: [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential)
    * Python implementation: **get_azure_default_credential**: Using the credential provided by the runtime environment such as needed by Azure Storage
* Password authentication - such as keys and connection strings
    * SDK object: [AzureKeyCredential](/python/api/azure-core/azure.core.credentials.azurekeycredential)
    * Python implementation: **get_azure_key_credential**: Using a key such as needed by Bing Search key

1. Create a folder named `shared`, which will contain all the integration code files.

2. Create a file named `azure_credential.py` in the **shared** folder.

3. Copy the following python code into it. 

    :::code language="python" source="~/../msdocs-python-etl-serverless/shared/azure_credential.py"  :::
    
## 5. Create resource for Bing Search

:::row:::
    :::column:::
        **Step 1.** Create a Bing Search API resource in the Azure portal.
        1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
        1. Enter `Bing Search v7` in the search box.
        1. Select **Bing Search v7** under **Marketplace** in the search results.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-bing-search.png" alt-text="Screenshot showing how to search in the Azure portal and find Bing Search in the Marketplace." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-bing-search.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Enter the following information in the portal dialogue:
        1. **Subscription**: Select **your active subscription**.
        1. **Resource group**: Select the resource you created in the previous page of this article services, such as **msdocs-python-cloud-etl-rg**.
        1. **Name**: Enter `msdocs-bing-search` (*Names may contain alphanumeric characters and dashes (-) only*).
        1. **Pricing tier**: Select **Free F1** package, the free-tier for the purposes of this tutorial. The other packages are for the pay model. To view package options and pricing for the pay model, select **View full pricing details**.
        1. Select the **check the box** to indicate that you have read and understood the notice.
        1. Select **Review and create** then select **Create** to start the deployment process.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-bing-search-config.png" alt-text="Screenshot showing successful Bing Search in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-bing-search-config.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** When the deployment process completes, select **Go to resource**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-bing-search-deploy.png" alt-text="Screenshot showing how to configure Bing Search in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-bing-search-deploy.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 4.** Take note of the resource key to use in API calls from the Azure Function.
        1. Select **Keys and Endpoint** in the left pane
        1. Select the **Show Keys** button.
        1. Select the **Copy icon** to the *right* of **Key 1** to copy the resource key to your clipboard. This key will be stored in Azure Key Vault as a secret in a later step.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-bing-search-keys.png" alt-text="Screenshot showing how to get your Bing Search resource key and endpoint in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-bing-search-keys.png":::
    :::column-end:::
:::row-end:::

## 6. Verify your Bing Search key works

1. Use the following cURL command in a bash terminal or other prompt enabled with cURL to verify your Bing Search v7 key is correctly created in the _global_ region. 

    ```bash
    curl -H "Ocp-Apim-Subscription-Key: YOUR-SEARCH-KEY" https://api.bing.microsoft.com/v7.0/news/search?q=Microsoft&count=1 
    ```

2. Verify the response includes data in the shape of the following:

    ```json
    {
    "_type": "News",
    "readLink": "https://api.bing.microsoft.com/api/v7/news/search?q=Microsoft",
    "queryContext": { "originalQuery": "Microsoft", "adultIntent": false },
    "totalEstimatedMatches": 49,
    "sort": [{
            "name": "Best match",
            "id": "relevance",
            "isSelected": true,
            "url": "https://api.bing.microsoft.com/api/v7/news/search?q=Microsoft"
        },
        {
            "name": "Most recent",
            "id": "date",
            "isSelected": false,
            "url": "https://api.bing.microsoft.com/api/v7/news/search?q=Microsoft&sortby=date"
        }],
    "value": [{
        "name": "Microsoft reportedly to add ...",
        "url": "https://",
        "image": {},
        "description":"",
        "about":"",
        "provider":"",
        "dataPublished":"",
        "category":""
        }]
    }
    ```

## 7. Create code to get search results from Bing Search News with Python SDK

1. Create a file named `bing_search.py` in the **shared** folder.

2. Copy the following Python code into it.

    :::code language="python" source="~/../msdocs-python-etl-serverless/shared/bing_search.py"  :::

## 8. Create resource for Azure Key Vault

When you need to store secrets, a _best practice_ is to store the secret in a secure location such as Azure Key Vault. Azure Key Vault is a centralized cloud solution for storing and managing secrets and certificates. The service also provides access monitoring and logs to see who accesses secrets, when, and how.

:::row:::
    :::column:::
        **Step 1.** Create an Azure Key Vault resource in the Azure portal.
        1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
        1. Enter `Key Vault` in the search box.
        1. Navigate to **Key Vault** under **Services** in the search results.
        1. Select the **+ Create** button in the **Key Vault** dialogue.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-key-vault-create.png" alt-text="Screenshot showing how to search in the Azure portal to find and create an Azure Key Vault service." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-key-vault-create.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** On the Create key vault dialogue provide the following information:
        1. **Subscription**: Select your active subscription.
        1. **Resource group**: Select **msdocs-python-cloud-etl-rg**.
        1. **Name**: Enter `msdocs-python-etl-kv`.
        1. **Location**: Select **East US**.
        1. Leave the other options to their defaults.
        1. Select **Next**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-key-vault-configure.png" alt-text="Screenshot showing how to configure Azure Key Vault in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-key-vault-configure.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Configure RBAC access for passwordless authentication.
        1. Select **Access configuration** for **Azure role-based access control**.
        1. Select **Review + create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-key-vault-create-configure-rbac.png" alt-text="Screenshot to configure RBAC for Azure Key Vault in the Azure portal before creating the resource." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-key-vault-create-configure-rbac.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 4.** Select **Create** to accept the selected options and start the deployment process. When the deployment process completes, select Go to resource.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-key-vault-review.png" alt-text="Screenshot to review Azure Key Vault configuration in the Azure portal before creating the resource." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-key-vault-review.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 6.** Assign your user account as a **Key Vault Secrets Officer** so you can add, update, and delete secrets.

        1. Select **Access Control (IAM)** in the left panel in the **Key Vault** resource dialogue window.
        1. Select **Add role assignment** button in the **Grant access to this resource** section.
        1. In the **Add role assignment** dialogue, search for and select **Key Vault Secrets Officer** then select **Next**.
        1. **Assigned access to**: Select **User, group or service principal**.
        1. **Members**: Select **+ Select members**.
        1. From **Selected members**, search for and find your Azure account.
        1. Select the identity to add it as a selected member.
        1. Use the **Select** button to add the identity.
        1. Review the selected values and select **Review + Assign**.
    :::column-end:::
:::row-end:::

>[!IMPORTANT]
>If your secret value contains special characters, you will need to 'escape' the special character by wrapping it with double quotes and the entire string in single quotes. Otherwise, the secret value is not set correctly.
>
>* Will **not** work: "This is my secret value & it has a special character."
>* Will **not** work: "This is my secret value '&' it has a special character."
>* **Will work: 'this is my secret value "&" it has a special character'**

## 9. Create Key Vault secret

:::row:::
    :::column:::
        **Step 1.** Create a new secret in Azure Key Vault.
        1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
        1. Find your key vault resource and select it.
        1. Under the **Objects** section in the left panel, select **Secrets**.
        1. Select the **+ Generate/Import** button in the main panel.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-key-vault-create-secret.png" alt-text="Screenshot to show how to create a secret in the new Azure Key Vault in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-key-vault-create-secret.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** In the **Create a secret** dialogue, enter the following information:
        1. **Name**: Enter `bing-search-resource-key1`.
        1. **Secret value**: Enter the Bing Search API resource key that you noted/copied to your clipboard previously in this article.
        1. Select **Create** to add this new secret to the **Azure Key Vault**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-key-vault-configure-secret.png" alt-text="Screenshot to show how to configure a secret in the Azure Key Vault using the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-key-vault-configure-secret.png":::
    :::column-end:::
:::row-end:::


## 10. Create code to read Key Vault secret with Python SDK

1. Open the **local.settings.json** file, which holds the local environment settings.

2. Edit the file to update the following:

    |Property|Setting|
    |--|--|
    |KEY_VAULT_RESOURCE_NAME|Enter the Key vault name in double quotes, for example "msdocs-python-etl-kv".|
    
3. Create a file named `key_vault_secret.py` in the **shared** folder and copy the following python code into it.

    :::code language="python" source="~/../msdocs-python-etl-serverless/shared/key_vault_secret.py"  :::
    
## 11. Create resource for Azure Blob Storage

Azure Blob Storage is a general-purpose, object storage solution. In this series, blob storage acts as a landing zone for '*source*' data and is a common data engineering scenario. Follow these steps to create the Azure Blob Storage resource and configure a Blob Container.


:::row:::
    :::column:::
        **Step 1.** Create an Azure Storage Account resource in the Azure portal.
        1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
        1. Enter **storage** in the search box.
        1. Navigate to **Storage accounts** under **Services** in the search results.
        1. Select the **+ Create** button in the **Storage accounts** dialogue.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-blob-storage.png" alt-text="Screenshot showing how to search in the Azure portal and find Azure Storage Account service." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-blob-storage.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** On the **Basics** tab, provide the following information for your storage account.
        1. **Subscription**: Select <**YOUR-SUBSCRIPTION**>.
        1. **Resource group**: Select **msdocs-python-cloud-etl-rg**.
        1. **Name**: Enter **msdocspythoncloudetlabs**.
        1. **Location**: Select **East US**.
        1. **Performance**: Select **Standard**.
        1. **Replication**: Select **Locally-redundant storage (LRS)**.
        1. Select **Next: Advanced** to go to the **Advanced** tab.
        1. Deselect **Allow enabling public access on containers** if it is checked.
        1. Select **Review** to proceed to validate the configuration values before creating the resource.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-blob-storage-configure.png" alt-text="A screenshot of configuring the new Azure Storage Account using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-blob-storage-configure.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** 
        1. Select **Create** to accept the default options, then proceed to validate and create the account.
        1. When the deployment process completes, select **Go to resource**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-blob-storage-review.png" alt-text="A screenshot of reviewing the configuration of the new Azure Storage Account using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-blob-storage-review.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 4.** Assign your user account as a **Storage Blob Data Contributor** so you can add, update, and delete blobs.

        1. Select **Access Control (IAM)** in the left panel in the **Storage account** resource dialogue window.
        1. Select **Add role assignment** button in the **Grant access to this resource** section.
        1. In the **Add role assignment** dialogue, search for and select **Storage Blob Data Contributor** then select **Next**.
        1. **Assigned access to**: Select **User, group or service principal**.
        1. **Members**: Select **+ Select members**.
        1. From **Selected members**, search for and find your Azure account.
        1. Select the identity to add it as a selected member.
        1. Use the **Select** button to add the identity.
        1. Review the selected values and select **Review + Assign**.
    :::column-end:::
:::row-end:::


>[!IMPORTANT]
>Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. Storage account names must also be unique across Azure.


## 12. Get Blob Storage connection string

The Blob Trigger connects to Blob Storage with a connection string stored in the **AzureWebJobsStorage** environment variable. Get and copy the connection string. It will be set in the `local.settings.json` file.

1. In the navigation pane for the storage account, scroll to the **Security and networking** section and select **Access keys**.
1. Select the **Show** button for **key1**.

    :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-storage-connection-string-show.png" alt-text="A screenshot showing the connection string of the new Azure Storage Account using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-storage-connection-string-show.png":::

1. Select the **Copy** icon to the right of the **Connection string** to copy the value to your clipboard. You'll set this value in your `local.settings.json` file in a following step.



## 13. Create container for Azure Blob Storage

A container organizes a set of blobs, similar to a directory in a file system. A storage account can include an unlimited number of containers, and a container can store an unlimited number of blobs.

:::row:::
    :::column:::
        **Step 1.** In the navigation pane for the storage account, scroll to the Data storage section and select **Containers**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-blob-storage-container.png" alt-text="Screenshot navigating to the Container pane for an Azure Blob Storage Account." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-blob-storage-container.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Within the **Containers** pane, select the **+ Container** button to open the New container pane.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-blob-storage-container-create.png" alt-text="Screenshot navigating to create a new Container." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-blob-storage-container-create.png":::
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
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-blob-storage-container-configure-new.png" alt-text="Screenshot configuring the New Container pane for an Azure Blob Storage Account." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-blob-storage-container-configure-new.png":::
    :::column-end:::
:::row-end:::


## 14. Create code to upload file with Python

1. Open the **local.settings.json** file, which holds the local environment settings.

2. Edit the file to update the following:

    |Property|Setting|
    |--|--|
    |BLOB_STORAGE_CONNECTION_STRING|Enter the Blob Storage **connection string** in double quotes. This connection string will be used to trigger the Blob Storage trigger (in the next page) when a new file lands in blob storage.|
    |BLOB_STORAGE_RESOURCE_NAME|Enter the Blob Storage **resource name** in double quotes, for example "msdocspythoncloudetlabs".|
    |BLOB_STORAGE_CONTAINER_NAME|Enter the Blob Storage **container name** in double quotes, for example "msdocs-python-cloud-etl-news-source".|
    |AzureWebJobsStorage|Enter the Blob Storage **connection string** in double quotes. This connection string is used to manage storage used by the function app to manage triggers, queues, and other meta needs.|

3. Create a file named `blob_storage.py` in the **shared** folder.

4. Copy the following Python code into it.

    :::code language="python" source="~/../msdocs-python-etl-serverless/shared/blob_storage.py"  :::

## 15. Create code for random string generation with Python

Create a random string to add to the end of each file created in blob storage. This random string is used in both the original file and the processed file.

1. Create a **hash.py** file in the **shared** folder.
 
2. Copy the following Python code. 

    :::code language="python" source="~/../msdocs-python-etl-serverless/shared/hash.py"  :::


## 16. Create code for HTTPTrigger function with Python

1. Open the **__init__.py** file in the **api_search** folder.
 
2. Replace the file's contents with the following Python code.

    :::code language="python" source="~/../msdocs-python-etl-serverless/api_search/__init__.py" highlight="28-32,43,52,60-66"  :::

    The highlighted sections are the significant secret and SDK integration steps. 

## 17. Test the API endpoint for your python function

1. Run the function locally.

    ```bash
    func start
    ```    
    
2. Test the function locally. Use a web browser to test your **search** api:

    ```
    http://localhost:7071/api/search?search_term=azure&count=5
    ```
    
3. Verify the result is a URL such as `search_results_azure_yar6q2P80Lm4FG7.json`.

## Troubleshooting the function

For local development and debugging with these Azure resources, make sure you've the following complete:
* **Turn local logging on**:
    1. Stop the application.
    1. Open the `./host.json` file. 
    1. Set the **logging.logLevel.default** property to `"Information"`.
    1. If you have any files in the Blob Storage, download the file and examine the contents. If it's a JSON array of news information, you know the HTTP trigger, `api_search`, worked successfully. 
    1. Delete the files in blob storage. 
    1. Start the application again, and search for news with the HTTP API endpoint. 
    1. Review the debug log. It includes any errors that occurred. 
* Key Vault with secret.
    * The secret name in Key Vault such as `bing-search-resource-key1` must match the `KEY_VAULT_SECRET_NAME` property in **local.settings.json**.
    * Your user account for Key Vault needs the **Key Vault Secrets Officer** role to add and read the key. 
* Bing Search
    * The Bing Search key is stored in Key Vault.
* Blob Storage
    * Resource name must be set in the `BLOB_STORAGE_RESOURCE_NAME` property in **local.settings.json**.
    * Container name such as `msdocs-python-cloud-etl-news-source` must match the `BLOB_STORAGE_CONTAINER_NAME` property in **local.settings.json**.
    * Your user account for Blob Storage needs the **Storage Blob Data Contributor** role to add and read the blob. 

## Additional information

* Azure Functions `function.json` [schema](/azure/azure-functions/functions-reference?tabs=blob).


## Next step

> [!div class="nextstepaction"]
> [Process/Prep the Data >>](tutorial-deploy-azure-cloud-python-etl-03-process-data.md)

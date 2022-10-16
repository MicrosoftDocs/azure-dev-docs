---
title: "Tutorial: Get Bing News Search API results data with Python on Azure"
description: In this tutorial, you'll create a local Python Azure Functions project to call the Bing News Search REST API and store the search results in Azure Blob Storage.
services: python, azure-functions, azure-storage-accounts, bing-search-services
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.date: 10/15/2022
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Tutorial: Get data with Bing News Search API using a Python Azure Function

In this tutorial, you'll create a local [Azure Function](/products/functions/) in Python that responds to HTTP requests. The Azure Function uses the [Bing News Search REST API](/bing/apis/bing-news-search-api) to get news articles for a specified search-term and stores the data as a JSON file in [Azure Blob Storage](/products/storage/blobs/).

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/deploy-azure-cloud-python-etl-architecture.svg" alt-text="Deploy Serverless, Azure Cloud Python ETL Solution Architecture Diagram" lightbox="./media/tutorial-deploy-azure-cloud-python-etl/deploy-azure-cloud-python-etl-architecture.svg" border="false":::

## Prerequisites

### [Azure portal](#tab/azure-portal)

1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
1. When prompted, enter your login credentials.

### [Visual Studio Code](#tab/vscode)

1. [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms) is installed
1. Install the following extensions:
    * [Azure Tools for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack).
    * [Visual Studio Code Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python).
    * [Visual Studio Code Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).
1. To sign in to your Azure Account, **press F1** and type in **Azure: Sign in** (or select on the Sign-in to Azure... node in the Explorer).

### [Azure CLI](#tab/azure-cli)

1. Azure CLI; the CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or you can install [Azure CLI](/cli/azure/install-azure-cli) locally
1. To sign in to your Azure Account, run the [`az login`](/cli/azure/authenticate-azure-cli) command.

---

## 1. Create a local HTTPTrigger Azure Function

### [Azure portal](#tab/azure-portal)

For Python functions, you can create an Azure Function App in the Azure portal or locally and then deploy to Azure. For this tutorial series, we'll start with creating local functions then deploy the functions to Azure.

### [Visual Studio Code](#tab/vscode)

:::row:::
    :::column:::
        **Step 1.** Create new local Azure Functions project in the Visual Studio Code workspace.
        1. Choose the **Azure icon** in the **Activity bar**.
        1. In the **Workspace (local) area**, select the **+ button**.
        1. Choose **Create Function** in the dropdown.
        1. When prompted, choose **Create new project**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-create-new-function.png" alt-text="A screenshot showing how to create a new local function project in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-create-new-function.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Enter the following information at the prompts:
        1. **Select a language**: Choose **Python**.
        1. **Select a Python interpreter to create a virtual environment**: Choose your **preferred Python interpreter**. (*If an option isn't shown, type in the full path to your Python binary.*)
        1. **Select a template for your project's first function**: Choose **HTTP trigger**.
        1. **Provide a function name**: Enter `msdocs-cloud-python-etl-httptrigger`.
        1. **Authorization level**: Choose **Function**.  (*For more information about the authorization level, see [Authorization keys](/azure/azure-functions/functions-bindings-http-webhook-trigger#authorization-keys).*)
        1. **Select how you would like to open your project**: Choose **Add to workspace**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-configure-function.gif" alt-text="Animated screenshot showing how to configure the new local function in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-configure-function.gif":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Run the function locally by pressing `F5` or the play icon.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-run-function.png" alt-text="A screenshot showing how to build and run the new local function in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-run-function.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 4.** Execute the function locally.
        1. Choose the **Azure icon** in the **Activity bar**.
        1. In the **Workspace area**, expand **Local Project** and then **Functions**.
        1. Right-click (Windows) or Ctrl + Select (macOS) the **msdocs-cloud-python-etl-HttpTrigger** function.
        1. Choose **Execute Function Now**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-execute-function.png" alt-text="A screenshot showing executing the new local function in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-execute-function.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 5.** Test the sample functionality by entering the request message body value `{ "name": "<YOUR_NAME>"}` and press Enter.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-test-new-function.gif" alt-text="A screenshot of testing the new local function in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-test-new-function.gif":::
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

**Step 1.** Run the `func init` command to create a functions project in a folder named **MSDocsCloudPythonETLProj** with the specified runtime and navigate to the directory.

```bash
func init MSDocsCloudPythonETLProj --python

cd MSDocsCloudPythonETLProj
```

**Step 2.** Add a function to your project by running the `func new`. Enter a unique value for the `--name` parameter and set how the function will be triggered with the `--template` parameter.

```bash
func new --name msdocs-python-etl-httptrigger --template "HTTP trigger" --authlevel "function"
```

**Step 3.** Run the function locally by running the `func start` command.

```bash
func start
```

**Step 4.** Test the local function by copying the URL from the `func start` output and paste it into your browser, appending `?name=<YOUR_NAME>` to the URL. The browser should display a response message that echoes back your query string value (YOUR_NAME).

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-cli-test-local-function.png" alt-text="Test that the Local Function runs successfully and displays properly in your browser." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-cli-test-local-function.png" :::

---

## 2. Create a Bing Search Azure resource

:::row:::
    :::column:::
        **Step 1.** Navigate to create a Bing Search API resource in the Azure portal.
        1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
        1. Enter `Bing` in the search box.
        1. Select **Bing Search** under **Marketplace** in the search results.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-bing-search.png" alt-text="Screenshot showing how to search in the Azure portal and find Bing Search in the Marketplace." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-bing-search.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Enter the following information in the portal dialogue:
        1. **Subscription**: Select **your active subscription**.
        1. **Resource group**: Select **msdocs-python-cloud-etl-rg**, if this resource group doesn't exist, select **Create new**.
        1. **Name**: Enter `msdocs-bing-search` (*Names may contain alphanumeric characters and dashes (-) only*).
        1. **Pricing tier**: Select **Free F1** package, the free-tier for the purposes of this tutorial. The other packages are for the pay model. To view package options and pricing for the pay model, select **View full pricing details**.
        1. Select the **check the box** to indicate that you have read and understood the notice.
        1. Select **Create** to start the deployment process.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-bing-search-config.png" alt-text="Screenshot showing successful Bing Search in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-bing-search-config.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** When the deployment process completes, select **Go to resource**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-bing-search-deploy.png" alt-text="Screenshot showing how to configure Bing Search in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-bing-search-deploy.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 4.** Take note of the subscription key to use in API calls from the Azure Function.
        1. Select **Keys and Endpoint** in the left pane
        1. Select the **Show Keys** button.
        1. Select the **Copy icon** to the *right* of **Key 1** to copy the subscription key to your clipboard.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-bing-search-keys.png" alt-text="Screenshot showing how to get your Bing Search subscription key and endpoint in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-bing-search-keys.png":::
    :::column-end:::
:::row-end:::

## 3. Create and set up an Azure Key Vault

In Azure, developers can choose to manually store information needed to run the app in the app configuration settings. However, for sensitive information, a better approach is to use an Azure Key Vault.

Azure Key Vault is a centralized cloud solution for storing and managing sensitive information, such as passwords, certificates, and keys. Using Azure Key Vault also provides better access monitoring and logs to see who accesses secret, when, and how.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step 1.** Navigate to create an Azure Key Vault resource in the Azure portal.
        1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
        1. Enter `Key Vault` in the search box.
        1. Navigate to **Key Vault** under **Services** in the search results.
        1. Select the **+ Create** button in the **Key Vault** dialogue.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-create.png" alt-text="Screenshot showing how to search in the Azure portal to find and create an Azure Key Vault service." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-create.png":::
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
        1. Select **Review + Create** to review  and validate the selected Azure Key Vault configuration.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-configure.png" alt-text="Screenshot showing how to configure Azure Key Vault in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-configure.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Select **Create** to accept the selected options and start the deployment process.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-review.png" alt-text="Screenshot to review Azure Key Vault configuration in the Azure portal before creating the resource." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-review.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 4.** Create a new secret in Azure Key Vault.
        1. Navigate to the Azure Key Vault resource by selecting **Go to resource** after the deployment is complete.
        1. Under the **Objects** section in the left panel, select **Secrets**.
        1. Select the **+ Generate/Import** button in the main panel.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-create-secret.png" alt-text="Screenshot to show how to create a secret in the new Azure Key Vault in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-create-secret.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 5.** In the **Create a secret** dialogue, enter the following information:
        1. **Name**: Enter **bing-search-sub-key1**.
        1. **Secret value**: Enter the Bing Search API subscription key that you noted/copied to your clipboard previously in this article.
        1. Select **Create** to add this new secret to the **Azure Key Vault**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-configure-secret.png" alt-text="Screenshot to show how to configure a secret in the Azure Key Vault using the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-configure-secret.png":::
    :::column-end:::
:::row-end:::

### [Visual Studio Code](#tab/vscode)

To create an Azure Key Vault, you **must** use the Azure portal or the Azure CLI.

### [Azure CLI](#tab/azure-cli)
Create a new Azure Key Vault within your resource group.

**Step 1:** Run [`az keyvault create`](/cli/azure/keyvault#az-keyvault-create) to create an Azure Key Vault.

```azurecli
# Provision new Azure Key Vault in our resource group
az keyvault create  \
    --location 'eastus' \
    --name 'msdocs-python-etl-kv' \
    --resource-group 'msdocs-python-cloud-etl-rg'
```

<br/>

**Step 2:** Set a 'secret' in Azure Key Vault to store the Bing Search resource subscription key. Run [`az keyvault secret set`](/cli/azure/keyvault/secret) to create and set a secret in Azure Key Vault.

```azurecli
# Create Secret for Bing Search subscription key
az keyvault secret set \
    --vault-name 'msdocs-python-etl-kv' \
    --name 'bing-search-sub-key1' \
    --value '<YOUR BING SEARCH SUBSCRIPTION KEY>'
```

---

>[!IMPORTANT]
>If your secret value contains special characters, you will need to 'escape' the special character by wrapping it with double quotes and the entire string in single quotes. Otherwise, the secret value is not set correctly.
>
>* Will **not** work: "This is my secret value & it has a special character."
>* Will **not** work: "This is my secret value '&' it has a special character."
>* **Will work: 'this is my secret value "&" it has a special character'**

## 4. Call the Bing News Search REST API

**Step 1.** Open the folder **msdocs-cloud-python-etl-proj** created by the Azure Function Core Tools in **Visual Studio Code**.

**Step 2.** Open the `__init__.py` file under the function folder **msdocs-python-etl-httptrigger**.

**Step 3.** In the local Azure Function, create a new function definition to retrieve an Azure Key Vault secret value for the Bing Search subscription key.

```python
import logging
import os

import azure.functions as func

from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from azure.core.exceptions import ClientAuthenticationError, AzureError

def get_key_vault_secret(key_vault_name, secret_name, azure_credential):

    retrieved_akv_secret = None

    try:
        logging.info(f'Connecting to Azure Key Vault ( {key_vault_name}. )')

        # Create an Azure Key Vault secret client and retrieve secret by name.
        KVUri = f"https://{key_vault_name}.vault.azure.net"
        client = SecretClient(vault_url=KVUri, credential=azure_credential)
        retrieved_akv_secret = client.get_secret(secret_name)
        
        logging.info(f'Successfully retrieved the Bing Search API subscription key secret from {key_vault_name}.')
        
        return retrieved_akv_secret

    except ClientAuthenticationError:
        # Can occur if either tenant_id, client_id or client_secret is incorrect
        logging.critical('Azure SDK was not able to connect to Key Vault.', e.exc_msg)
        raise
    except AzureError as e:
        # Catch every error that is from the Azure SDK
        logging.critical('Azure SDK was not able to complete Key Vault request.', e.exc_msg)
        raise
    except Exception as e:
        logging.critical(e.exc_msg)
        raise
```

<br/>

**Step 4.** In the same local Azure Function, create a new function definition to call the Bing News Search API for specified search term with specified search results limit count.

```python
import requests
import json

def call_bing_search_api(search_url, search_term, api_subscription_key):
    logging.info(f"Retrieving Bing News Search results for '{search_term}'.")
 
    try:
        # Submit GET request to Bing News Search endpoint with defined parameters and header with parameters.
        headers = {"Ocp-Apim-Subscription-Key" : api_subscription_key.value}
        params  = {"q": search_term, "count": 10, "textDecorations": True, "textFormat": "HTML"}
        response = requests.get(search_url, headers=headers, params=params)
        response.raise_for_status()
        
        logging.info(f"Successfully retrieved the Bing News Search results for '{search_term}'.")

        # Returns response JSON for GET request.
        return response.json()

    except Exception as e:
        logging.critical(e.exc_msg)
        raise
```

<br/>

**Step 5.** Modify **main** function definition of the local HTTPTrigger Azure Function to call each new function defined in this tutorial.

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
        # Bing News Search endpoint URL
        bing_news_search_URL = 'https://api.bing.microsoft.com/v7.0/news/search'

        #The DefaultAzureCredential gets the authentication token based on the environment the application is running
        credential = DefaultAzureCredential(additionally_allowed_tenants=['*'])

        # Get App Settings
        akv_name = os.environ["KEY_VAULT_NAME"]
        akv_secret_name = os.environ["BING_SEARCH_SUB_KEY_SECRET"]

        # Get Bing API Subscription Key stored in an Azure Key Vault secret.
        bing_api_subscription_key = get_key_vault_secret(key_vault_name=akv_name, secret_name=akv_secret_name, azure_credential=credential)

        # Call Bing Search API to retrieve results for specified search_term
        news_search_results = call_bing_search_api(   
                                search_url=bing_news_search_URL,
                                search_term=search_term,
                                api_subscription_key=bing_api_subscription_key
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

**Step 6.** Create App Settings for the Azure resources.

1. Navigate to the **Explorer** icon in the **Activity bar**.
1. Open the **local.settings.json** in the **editor** pane.
1. Add a key-value pair to store the Bing Search subscription key secret name by entering `, "BING_SEARCH_SUB_KEY_SECRET": "bing-search-sub-key1"`.
1. Add another key-value pair to store the key vault name by entering `, "KEY_VAULT_NAME": "msdocs-python-etl-kv"`.

## Next step

> [!div class="nextstepaction"]
> [Store the Data >>](tutorial-deploy-azure-cloud-python-etl-03-store-data.md)

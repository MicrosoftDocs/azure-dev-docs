---
title: "Tutorial: Get Bing News with Python"
description: In this tutorial, you'll create a local Python Azure Functions project to call the Bing News Search SDK and store the search results in Azure Blob Storage.
services: python, azure-functions, azure-storage-accounts, bing-search-services
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.date: 10/15/2022
ms.prod: azure-python
---

# Tutorial: Get Bing News using a Python Azure Function

In this tutorial, you'll create a local [Azure Function](/products/functions/) in Python that responds to HTTP requests. The Azure Function:

* Gets the Bing Search key from Key Vault
* **Ingest**: Calls the [Bing News Search API service](/bing/apis/bing-news-search-api) with your search term
* **Store**: Stores the search results as a JSON file in [Azure Blob Storage](/products/storage/blobs/).

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-function-etl-data-load-bing-search.png" alt-text="Deploy Serverless, Azure Cloud Python ETL Solution Architecture Diagram" lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-function-etl-data-load-bing-search.png" border="false":::

## Prerequisites

You must have completed all steps from the [Overview](tutorial-deploy-azure-cloud-python-etl-01-overview.md) for this series.

### [Azure portal](#tab/azure-portal)

1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
1. When prompted, enter your sign-in credentials.

### [Visual Studio Code](#tab/vscode)

1. [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms) is installed
1. Install the following extensions:
    * [Azure Tools for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack).
    * [Visual Studio Code Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python).
    * [Visual Studio Code Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).
1. You must have [signed in with Azure CLI](tutorial-deploy-azure-cloud-python-etl-01-overview.md#sign-in-to-azure-for-local-developer-authentication)

### [Azure CLI](#tab/azure-cli)

You must have [signed in with Azure CLI](tutorial-deploy-azure-cloud-python-etl-01-overview.md#sign-in-to-azure-for-local-developer-authentication)


---

## 1. Create a local Azure Function and an HTTPTrigger endpoint

### [Azure portal](#tab/azure-portal)

Complete the steps using either the Visual Studio Code or the Azure CLI.

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
        1. **Provide a function name**: Enter `api_search`.
        1. **Authorization level**: Choose **Function**.  (*For more information about the authorization level, see [Authorization keys](/azure/azure-functions/functions-bindings-http-webhook-trigger#authorization-keys).*)
        1. **Select how you would like to open your project**: Choose **Add to workspace**.
    :::column-end:::
    :::column:::
        
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

**Step 1.** Run the `func init` command to create a functions project in a folder named **msdocs-python-etl-serverless** with the specified runtime and navigate to the directory.

```bash
func init msdocs-python-etl-serverless --python

cd msdocs-python-etl-serverless
```

**Step 2.** Add a function to your project by running the `func new`. Enter a unique value for the `--name` parameter and set how the function will be triggered with the `--template` parameter.

```bash
func new --name api_search --template "HTTP trigger" --authlevel "function"
```

**Step 3.** Run the function locally by running the `func start` command.

```bash
func start
```

**Step 4.** Test the local function by copying the URL from the `func start` output and paste it into your browser, appending `?name=<YOUR_NAME>` to the URL. The browser should display a response message that echoes back your query string value (YOUR_NAME).

---

## 2. Change Azure Function API route in function.json

The route is determined from the folder name, in the format of `/api/FOLDER-NAME`. Using the folder name provided, your route is currently set to `/api/api_search`. Change this to be more RESTful. Change this value in the **function.json** file.

1. Open the **function.json** file in the `api_search` folder. 
1. Add the `route` property as shown in the following json so your API route is `/api/search`.

    :::code language="json" source="~/../msdocs-python-etl-serverless/api_search/function.json" highlight="13" :::

## 3. Set application settings in local.settings.json for Python Functions App

1. Open the **./local.settings.json** file.
1. Replace the file contents with the following JSON. As you progress through the tutorial series, you're instructed to add values to this file. This file allows you to connect to Azure while you develop your python app locally. 

    :::code language="json" source="~/../msdocs-python-etl-serverless/local.settings.json.rename" highlight="7,11" :::

    The highlighted lines indicate settings made in this article. 

## 4. Get Azure credential with Python

The code in this tutorial relies on the secure authentication to Azure with the [Azure Identity](https://pypi.org/project/azure-identity/) package, using:
* Passwordless authentication - the most secure connection to Azure
    * SDK object: [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential)
    * Python implementation: **get_azure_default_credential**: Using the credential provided by the runtime environment such as needed by Azure Storage
* Password authentication - such as keys and connection strings
    * SDK object: [AzureKeyCredential](/python/api/azure-core/azure.core.credentials.azurekeycredential)
    * Python implementation: **get_azure_key_credential**: Using a key such as needed by Bing Search key

**Step 2.** Create a folder named `shared`, which will contain all the integration code files.

**Step 1.** Create a file named `azure_credential.py` in the **shared** folder.

**Step 2.** Copy the following python code into it. 

:::code language="python" source="~/../msdocs-python-etl-serverless/shared/azure_credential.py"  :::

## 5. Create resource for Bing Search

:::row:::
    :::column:::
        **Step 1.** Navigate to create a Bing Search API resource in the Azure portal.
        1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
        1. Enter `Bing` in the search box.
        1. Select **Bing Search v7** under **Marketplace** in the search results.
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
        **Step 4.** Take note of the resource key to use in API calls from the Azure Function.
        1. Select **Keys and Endpoint** in the left pane
        1. Select the **Show Keys** button.
        1. Select the **Copy icon** to the *right* of **Key 1** to copy the resource key to your clipboard. This key will be stored in Azure Key Vault as a secret in a later step.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-bing-search-keys.png" alt-text="Screenshot showing how to get your Bing Search resource key and endpoint in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-bing-search-keys.png":::
    :::column-end:::
:::row-end:::

## 6. Create code for Bing Search News with Python SDK

**Step 1.** Create a file named `bing_search.py` in the **shared** folder.

**Step 2.** Copy the following Python code into it.

:::code language="python" source="~/../msdocs-python-etl-serverless/shared/bing_search.py"  :::

## 7. Create resource for Azure Key Vault

When you need to store secrets, a _best practice_ is to store the secret in a secure location such as Azure Key Vault. Azure Key Vault is a centralized cloud solution for storing and managing secrets and certificates. The service also provides access monitoring and logs to see who accesses secrets, when, and how.

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
        1. Select **Next**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-configure.png" alt-text="Screenshot showing how to configure Azure Key Vault in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-configure.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Configure RBAC access for passwordless authentication.
        1. Select **Access configuration** for **Azure role-based access control**.
        1. Select **Review + create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-create-configure-rbac.png" alt-text="Screenshot to configure RBAC for Azure Key Vault in the Azure portal before creating the resource." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-create-configure-rbac.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 4.** Select **Create** to accept the selected options and start the deployment process.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-review.png" alt-text="Screenshot to review Azure Key Vault configuration in the Azure portal before creating the resource." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-review.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 5.** When the deployment process completes, select Go to resource.
    :::column-end:::
    :::column:::
:::row-end:::


### [Visual Studio Code](#tab/vscode)

To create an Azure Key Vault, you **must** use the Azure portal or the Azure CLI.

### [Azure CLI](#tab/azure-cli)
Create a new Azure Key Vault within your resource group.

Run [`az keyvault create`](/cli/azure/keyvault#az-keyvault-create) to create an Azure Key Vault.

```azurecli
# Provision new Azure Key Vault in our resource group
az keyvault create  \
    --location 'eastus' \
    --name 'msdocs-python-etl-kv' \
    --resource-group 'msdocs-python-cloud-etl-rg'
```

<br/>


---

>[!IMPORTANT]
>If your secret value contains special characters, you will need to 'escape' the special character by wrapping it with double quotes and the entire string in single quotes. Otherwise, the secret value is not set correctly.
>
>* Will **not** work: "This is my secret value & it has a special character."
>* Will **not** work: "This is my secret value '&' it has a special character."
>* **Will work: 'this is my secret value "&" it has a special character'**

## 8. Configure role-based access to Key Vault for your identity

Configure your own account to have access to Key Vault Secrets. Do this immediately after creating the Key Vault. In order to use role-based access to Key Vault, it must have been created with RBAC enabled. This step is shown in the preceding section. 

### [Azure portal](#tab/azure-portal)

You enabled role-based access control for your key vault resource in a preceding step. Add your identity to your key vault resource to access secrets while locally developing the application.

:::row:::
    :::column:::
        **Step 1.** Navigate to create an Azure Key Vault resource in the Azure portal.
        1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
        1. Find your key vault resource and select it.
        1. Select **Access Control (IAM)** in the left panel in the **Key Vault** resource dialogue window.
        1. Select **Add role assignment** button in the **Grant access to this resource** section.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-add-role-assignment.png" alt-text="Screenshot showing how to select Add role assignment in IAM in Key Vault in Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-add-role-assignment.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Navigate to create an Azure Key Vault resource in the Azure portal.
        1. Search for **Key Vaults Secrets User** and select it.
        1. Select **Next**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-add-rbac-role-key-vault-secrets-user.png" alt-text="Screenshot showing how to select Key Vaults Secrets User role in Key Vault in Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-add-rbac-role-key-vault-secrets-user.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Add your user account.
        1. Select **User, group, or service principal**.
        1. Select **+ Select members**.
        1. In the panel, search for and select your own user account with your email address, such as `jsmith@contoso.com`.
        1. Select the **Select** button to close the side panel. 
        1. Select **Next**.
        1. Select **Review + assign**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-add-role-assignment-select-members.png" alt-text="Screenshot showing how to select Key Vaults Secrets User role in Key Vault in Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-add-role-assignment-select-members.png":::
    :::column-end:::
:::row-end:::


### [Azure CLI](#tab/azure-cli)

Assign the role to your user account, such as `johns@contoso.com`.

```azurecli
# Assign the 'Key Vault Secrets User' role to your user
az role assignment create \
    --role "Key Vault Secrets User" \
    --assignee <YOUR-USER-ACCOUNT> \
    --scope "/subscriptions/<YOUR-SUBSCRIPTION-ID>/resourceGroups/msdocs-python-cloud-etl-rg/providers/Microsoft.KeyVault/vaults/msdocs-python-etl-kv"
```

>[!NOTE]
>Role assignment creation could take a minute to apply in Azure. It is recommended to wait a moment before running the next command in this article.


### [Visual Studio Code](#tab/vscode)

To create an Azure Key Vault, you **must** use the Azure portal or the Azure CLI.

## 9. Create Key Vault secret

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step 1.** Create a new secret in Azure Key Vault.
        1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
        1. Find your key vault resource and select it.
        1. Under the **Objects** section in the left panel, select **Secrets**.
        1. Select the **+ Generate/Import** button in the main panel.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-create-secret.png" alt-text="Screenshot to show how to create a secret in the new Azure Key Vault in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-create-secret.png":::
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
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-configure-secret.png" alt-text="Screenshot to show how to configure a secret in the Azure Key Vault using the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-configure-secret.png":::
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

Create a secret in Azure Key Vault to store the Bing Search resource key. Run [`az keyvault secret set`](/cli/azure/keyvault/secret) to create and set a secret in Azure Key Vault.

```azurecli
# Create Secret for Bing Search resource key
az keyvault secret set \
    --vault-name 'msdocs-python-etl-kv' \
    --name 'bing-search-resource-key1' \
    --value '<YOUR BING SEARCH RESOURCE KEY>'
```

### [Visual Studio Code](#tab/vscode)

To create an Azure Key Vault, you **must** use the Azure portal or the Azure CLI.

## 10. Configure resource's access role to Key Vault secret

Enable Key Vault to be used with passwordless credentials.

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
        **Step 4.** When the deployment process completes, select Go to resource.
    :::column-end:::
    :::column:::
:::row-end:::
:::row:::
    :::column:::
        **Step 5.** Create a new secret in Azure Key Vault.
        1. Under the **Objects** section in the left panel, select **Secrets**.
        1. Select the **+ Generate/Import** button in the main panel.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-create-secret.png" alt-text="Screenshot to show how to create a secret in the new Azure Key Vault in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-key-vault-create-secret.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 6.** In the **Create a secret** dialogue, enter the following information:
        1. **Name**: Enter `bing-search-resource-key1`.
        1. **Secret value**: Enter the Bing Search API resource key that you noted/copied to your clipboard previously in this article.
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

**Step 2:** Set a 'secret' in Azure Key Vault to store the Bing Search resource key. Run [`az keyvault secret set`](/cli/azure/keyvault/secret) to create and set a secret in Azure Key Vault.

```azurecli
# Create Secret for Bing Search resource key
az keyvault secret set \
    --vault-name 'msdocs-python-etl-kv' \
    --name 'bing-search-resource-key1' \
    --value '<YOUR BING SEARCH RESOURCE KEY>'
```

---

## 11. Create code for Key Vault with Python SDK

**Step 1.** Open the **local.settings.json** file, which holds the local environment settings.

**Step 2.** Edit the file to update the following:

|Property|Setting|
|--|--|
|KEY_VAULT_RESOURCE_NAME|Enter the Key vault name in double quotes, for example "msdocs-python-etl-kv".|

**Step 3.** Open the folder **msdocs-cloud-python-etl-proj** created by the Azure Function Core Tools in **Visual Studio Code**.

**Step 4.** Create a file named `key_vault_secret.py` and copy the following python code into it.

:::code language="python" source="~/../msdocs-python-etl-serverless/shared/key_vault_secret.py"  :::

## 12. Create resource for Azure Blob Storage

Azure Blob Storage is a general-purpose, object storage solution. In this series, blob storage acts as a landing zone for '*source*' data and is a common data engineering scenario. Follow these steps to create the Azure Blob Storage resource and configure a Blob Container.

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
        **Step 3.** 
        1. Select **Create** to accept the default options, then proceed to validate and create the account.
        1. When the deployment process completes, select **Go to resource**.
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

## 13. Configure resource's access role to Azure Blob Storage

In development, the account used to log into Azure requires the *Storage Blob Data Contributor* role assignment to grant read/write/delete permissions to Blob storage resources. In production, you'll use the managed identity for the hosting service.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step 1.** In the Azure Storage Account, add role assignment.
        1. Select **Access Control (IAM)** in the left panel in the **Storage Account** resource dialogue window.
        1. Select **Add role assignment** button in the **Grant access to this resource** section.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-IAM.png" alt-text="A screenshot showing how to navigate to Access Control (IAM) role assignment. " lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-blob-storage-IAM.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** In the **Add role assignment** dialogue, search for and select **Storage Blob Data Contributor** then select **Next**.
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

Enable your user account, such as `jsmith@contoso.com`, to have role-based access.

```azurecli
# Assign the 'Storage Blob Data Contributor' role to your user
az role assignment create \
    --role "Storage Blob Data Contributor" \
    --assignee <YOUR-USER-ACCOUNT> \
    --scope "/subscriptions/<YOUR-SUBSCRIPTION-ID>/resourceGroups/msdocs-python-cloud-etl-rg/providers/Microsoft.Storage/storageAccounts/msdocspythoncloudetlabs"
```

>[!NOTE]
>Role assignment creation could take a minute to apply in Azure. It is recommended to wait a moment before running the next command in this article.

---

## 14. Get Blob Storage connection string

The Blob Trigger connects to Blob Storage with a connection string stored in the **AzureWebJobsStorage** environment variable. Get and copy the connection string. It will be set in the `local.settings.json` file.

### [Azure portal](#tab/azure-portal)

1. In the navigation pane for the storage account, scroll to the **Security and networking** section and select **Access keys**.
2. Select the **Show** button for **key1**.
3. Select the **Copy** icon to the right of the **Connection string** to copy the value to your clipboard. 
4. Open the `local.settings.json` file and paste the value for the **Values.AzureWebJobsStorage** property. 

### [Visual Studio Code](#tab/vscode)

1. Choose the **Azure icon** in the **Activity bar**. 
2. In the **Resources** area, expand your subscription and **Storage accounts**.
3. Right-click the storage account resource name.
4. Choose **Copy Connection String**.
5. Open the `local.settings.json` file and paste the value for the **Values.AzureWebJobsStorage** property. 

### [Azure CLI](#tab/azure-cli)

1. In the following [**az storage account show-connection-string**]() command, edit the command to use your own resource group name and storage resource name. 

    ```bash
    az storage account show-connection-string --resource-group <resource-group> --name <storage-account> --output table
    ```

2. Copy the connection string.
3. Open the `local.settings.json` file and paste the value for the **Values.AzureWebJobsStorage** property. 
---

## 15. Create container for Azure Blob Storage

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

## 16. Create code for Azure Blob Storage SDK

**Step 1.** Open the **local.settings.json** file, which holds the local environment settings.

**Step 2.** Edit the file to update the following:

|Property|Setting|
|--|--|
|BLOB_STORAGE_RESOURCE_NAME|Enter the Blob Storage **resource name** in double quotes, for example "msdocspythoncloudetlabs".|
|BLOB_STORAGE_CONTAINER_NAME|Enter the Blob Storage **container name** in double quotes, for example "msdocs-python-cloud-etl-news-source".|
|AzureWebJobsStorage|Enter the Blob Storage **connection string** in double quotes.|

**Step 3.** Create a file named `blob_storage.py` in the **shared** folder.

**Step 4.** Copy the following Python code into it.

:::code language="python" source="~/../msdocs-python-etl-serverless/shared/blob_storage.py"  :::

## 17. Create code for random string generation with Python

Create a random string to add to the end of each file created in blob storage. This random string is used in both the original file and the processed file.

**Step 1.** Create a **hash.py** file in the **shared** folder.
 
**Step 2.** Copy the following Python code into it.

:::code language="python" source="~/../msdocs-python-etl-serverless/shared/hash.py"  :::


## 18. Create code for HTTPTrigger function with Python

**Step 1.** Open the **__init__.py** file in the **api_search** folder.
 
**Step 2.** Copy the following Python code into it.

:::code language="python" source="~/../msdocs-python-etl-serverless/api_search/__init__.py" highlight="28-32,43,52,60-66"  :::

## 19. Test the API endpoint for your python function

**Step 1.**  Run the function locally.

### [Azure portal](#tab/azure-portal)

Complete the steps using either the Visual Studio Code or the Azure CLI.

### [Visual Studio Code](#tab/vscode)

In Visual Studio Code, begin the Azure Function app locally with <kbd>F5</kbd>.

### [Azure CLI](#tab/azure-cli)

```bash
func start
```    

---

**Step 2.** Test the function locally.

### [Azure portal](#tab/azure-portal)

Complete the steps using either the Visual Studio Code or the Azure CLI.

### [Visual Studio Code](#tab/vscode)

1. Choose the **Azure icon** in the **Activity bar**. 
1. In the **Workspace area**, expand **Local Project > Functions**. 
1. Right-click (Windows) or Ctrl + Select (macOS) the **msdocs-cloud-python-etl-HttpTrigger** function.
1. Choose **Execute Function Now**.
1. Enter the request message body value `{ "search_term": "Azure"}` and press Enter.

### [Azure CLI](#tab/azure-cli)

```bash
curl --location --request GET 'http://localhost:7071/api/search?search_term=azure&count=5'
```

---

**Step 3.** 

Verify the result is a URL such as `search_results_azure_yar6q2P80Lm4FG7.json`.

## Additional information

* Azure Functions `function.json` [schema](/azure/azure-functions/functions-reference?tabs=blob).


## Next step

> [!div class="nextstepaction"]
> [Process/Prep the Data >>](tutorial-deploy-azure-cloud-python-etl-03-process-data.md)

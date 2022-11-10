---
title: "Tutorial: Get Bing News with Python"
description: In this tutorial, you'll create a local Python Azure Functions project to call the Bing News Search SDK and store the search results in Azure Blob Storage.
services: python, azure-functions, azure-storage-accounts, bing-search-services
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.date: 10/15/2022
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Tutorial: Get Bing News using a Python Azure Function

In this tutorial, you'll create a local [Azure Function](/products/functions/) in Python that responds to HTTP requests. The Azure Function:

* Gets the Bing Search key from Key Vault
* Calls the [Bing News Search service](/bing/apis/bing-news-search-api) with your search term
* Stores the data as a JSON file in [Azure Blob Storage](/products/storage/blobs/).

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

## 1. Create a local Azure Function and an HTTPTrigger endpoint

### [Azure portal](#tab/azure-portal)

For this tutorial series, create a local Functions app then deploy the app to Azure.

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

## 2. Set application settings in local.settings.json for Python Functions App

1. Open the **./local.settings.json** file.
1. Replace the file contents with the following JSON. As you progress through the tutorial series, you are instructed to add values to this file. This file allows you to connect to Azure while you develop your python app locally.

:::code language="json" source="~/../msdocs-python-etl-serverless/local.settings.json.rename"  :::

## 3. Get Azure credential with Python

The code in this tutorial relies on the secure authentication to Azure with the [Azure Identity](https://pypi.org/project/azure-identity/) package, using:
* Passwordless authentication - the most secure connection to Azure
    * SDK object: [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python), provided in the . Setting up that local and Azure credential is explained later in this tutorial series.
    * Python implementation: **get_azure_default_credential**: Using the credential provided by the runtime environment such as needed by Azure Storage
* Password authentication - such as keys and connection strings
    * SDK object: [AzureKeyCredential](/python/api/azure-core/azure.core.credentials.azurekeycredential?view=azure-python)
    * Python implementation: **get_azure_key_credential**: Using a key such as needed by Bing Search key

**Step 1.** Create a file named `azure_credential.py` in the **shared** folder.
**Step 2.** Copy the following Python code into it. 

:::code language="python" source="~/../msdocs-python-etl-serverless/shared/azure_credential.py"  :::

## 3. Create resource for Bing Search

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

## 4. Create code for Bing Search News with Python SDK

**Step 1.** Create a file named `bing_search.py` in the **shared** folder.
**Step 2.** Copy the following Python code into it.
:::code language="python" source="~/../msdocs-python-etl-serverless/shared/bing_search.py"  :::

## 5. Create resource for Azure Key Vault

In Azure, developers can choose to manually store information needed to run the app in the app configuration settings. However, for sensitive information, the more secure approach is to use an Azure Key Vault.

Azure Key Vault is a centralized cloud solution for storing and managing sensitive information, such as passwords, certificates, and keys. Using Azure Key Vault also provides access monitoring and logs to see who accesses secret, when, and how.

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
        1. **Name**: Enter `bing-search-resource-key1`.
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
    --name 'bing-search-resource-key1' \
    --value '<YOUR BING SEARCH SUBSCRIPTION KEY>'
```

---

>[!IMPORTANT]
>If your secret value contains special characters, you will need to 'escape' the special character by wrapping it with double quotes and the entire string in single quotes. Otherwise, the secret value is not set correctly.
>
>* Will **not** work: "This is my secret value & it has a special character."
>* Will **not** work: "This is my secret value '&' it has a special character."
>* **Will work: 'this is my secret value "&" it has a special character'**

## 6. Create code for Key vault with Python SDK

**Step 1.** Open the **local.settings.json** file which holds the local environment settings.
***Step 2.** Edit the file to update the following:

    |Property|Setting|
    |--|--|
    |KEY_VAULT_RESOURCE_NAME|Enter the Key vault name in double quotes, for example "YOUR-RESOURCE_NAME".|

**Step 3.** Open the folder **msdocs-cloud-python-etl-proj** created by the Azure Function Core Tools in **Visual Studio Code**.
***Step 4.** Create a folder named `shared` which will contain all the integration code files.
***Step 5.** Create a file named `key_vault_secret.py` and copy the following Python code into it.
:::code language="python" source="~/../msdocs-python-etl-serverless/shared/key_vault_secret.py"  :::

## 7. Create resource for Azure Blob Storage

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

## 8. Configure resource's access role to Azure Blob Storage

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

## 9. Create container for Azure Blob Storage

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

## 10. Create code for Azure Blob Storage SDK

**Step 1.** Open the **local.settings.json** file which holds the local environment settings.
***Step 2.** Edit the file to update the following:

    |Property|Setting|
    |--|--|
    |BLOB_STORAGE_RESOURCE_NAME|Enter the Blob Storage **resource name** in double quotes, for example "YOUR-RESOURCE_NAME".|
    |BLOB_STORAGE_CONTAINER_NAME|Enter the Blob Storage **container name** in double quotes, for example "msdocs-python-cloud-etl-news-source".|

**Step 3.** Create a file named `blob_storage.py` in the **shared** folder.
**Step 2.** Copy the following Python code into it.
:::code language="python" source="~/../msdocs-python-etl-serverless/shared/blob_storage.py"  :::

## 11. Create code for API endpoint with Python

**Step 1.** Open the **__init__.py** file in the **api_search** folder. 
**Step 2.** Copy the following Python code into it.
:::code language="python" source="~/../msdocs-python-etl-serverless/api_search/__init__.py"  :::

## 12. Test the API endpoint for your python function

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

---
title: "Tutorial: Process JSON Data for a Python ETL Solution on Azure"
description: In this article, you'll process JSON data for a Python ETL Solution on Azure
services: python, azure-functions, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.date: 10/15/2022
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Tutorial: Use an Azure Function to process data with Python on Azure

In this tutorial, you'll create a local [Azure Function](/products/functions/) in Python that responds to an Azure Blob Storage Trigger. The Azure Function uses the various Python libraries to clean and normalize the news articles results data stored as a JSON file in [Azure Blob Storage](/products/storage/blobs/).

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-function-etl-data-transform-data-lake.png" alt-text="Deploy Serverless, Azure Cloud Python ETL Solution Architecture Diagram" lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-function-etl-data-transform-data-lake.png" border="false":::

* [GitHub: Sample application](https://github.com/Azure-Samples/msdocs-python-etl-serverless)

> [!CAUTION]
> If you download this complete sample, you don't need to copy any code, but you need to edit the settings for Azure resources in the local.settings.json for local development and the Azure portal for the deployed application.

## 1. Create a local BlobTrigger for Python Functions App

### [Azure portal](#tab/azure-portal)

Complete the steps using either the Visual Studio Code or the Azure CLI.

### [Visual Studio Code](#tab/vscode)

To sign in to your Azure Account, **press F1** and type in **Azure: Sign in** (or select on the Sign-in to Azure... node in the Explorer).

:::row:::
    :::column:::
        **Step 1.** Create new local Azure Function in the Visual Studio Code workspace.
        1. Choose the **Azure icon** in the **Activity bar**.
        1. In the **Workspace (local) area**, select the **+ button**.
        1. Choose **Create Function** in the dropdown.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-create-new-function.png" alt-text="A screenshot showing how to create a new local function project in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-create-new-function.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.**  Enter the following information at the prompts:
        1. **Select a language**: Choose `Python`.
        1. **Select a Python interpreter to create a virtual environment**: Choose your *preferred Python interpreter*. If an option isn't shown, type in the full path to your Python binary.
        1. **Select a template for your project's first function**: Choose `Azure blob storage trigger`.
        1. **Provide a function name**: Enter `api_blob_trigger`.
        1. **Authorization level**: Choose `Function`.  For more information about the authorization level, see [Authorization keys](/azure/azure-functions/functions-bindings-http-webhook-trigger#authorization-keys).
        1. **Select how you would like to open your project**: Choose `Add to workspace`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-create-blobtrigger-function.gif" alt-text="Animated screenshot showing how to configure the new local function in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-create-blobtrigger-function.gif":::
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

**Step 1.** Run the `func init` command to create a functions project in a folder named **msdocs-python-etl-serverless** with the specified runtime and navigate to the directory.

**Step 2.** Navigate to the local Azure Function project and add a function to your project by running the `func new`. Enter a unique value for the `--name` parameter and set how the function will be triggered with the `--template` parameter.

```bash
cd msdocs-python-etl-serverless

func new --name api_blob_trigger --template "azure blob storage trigger"
```

---



## 2. Create a resource for Azure Data Lake Gen 2

Azure Data Lake Storage (ADLS) is built upon the Azure Blob File System (ABFS) over TLS/SSL for encryption and uses an optimized driver for big data workloads. Other features such as storage tier options and high-availability & disaster recovery options of blob storage, make ADLS the ideal storage solution for big data analytics.

A storage account is created the same for Azure Data Lake Gen as for Azure Blob Storage. The only difference is that the hierarchical namespace (HNS) property **must** be enabled. The hierarchical namespace is a fundamental part of Azure Data Lake Storage. This functionality enables the organization of objects/files into a hierarchy of directories for efficient data access.

### [Azure portal](#tab/azure-portal)

Follow these steps to create and configure the Azure Data Lake Storage resource.

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
        1. **Name**: Enter **msdocspythoncloudetladls**.
        1. **Location**: Select **East US**.
        1. **Performance**: Select **Standard**.
        1. **Replication**: Select **Locally-redundant storage (LRS)**.
        1. Select **Advanced** to proceed to continue configuring values for the resource.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-configure.png" alt-text="A screenshot of configuring the new Azure Storage Account using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-configure.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Configure the Azure Storage Account for enable Data Lake functionality.
         1. Select **Enable hierarchical namespace**.
         1. For this tutorial, leave the rest of settings in the **Advanced** pane the default values.
         1. Select **Review** to proceed to validate the configuration values before creating the resource.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-configure2.png" alt-text="A screenshot of configuring the Azure Storage Account to enable Data Lake Storage Gen2 using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-configure2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 4.** Select **Create** to accept the configured values, then proceed to validate and create the account.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-review.png" alt-text="A screenshot of reviewing the configuration of the new Azure Storage Account using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-review.png":::
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

Run [az storage account create](/cli/azure/storage/account) to create an Azure Data Lake Gen 2 Storage Account with Kind StorageV2, HNS enabled, and assign an Azure Identity.

```azurecli
# Use 'az account list-locations --output table' to list locations.
# Use the same resource group you create previously.
# Create a ADLS Gen2 account
az storage account create \
    --name msdocspythonetladls \
    --resource-group msdocs-cloud-python-etl-rg \
    --kind StorageV2 \
    --hns \
    --location eastus \
    --assign-identity
```

### [Visual Studio Code](#tab/vscode)

Complete the steps using either the Azure portal or the Azure CLI.

---

## 3. Configure resource's access role to Azure Data Lake 

In development, the account used to log into Azure requires the *Storage Blob Data Contributor* role assignment to grant read/write/delete permissions to Blob storage resources. In production, we'll use the service principal created by the managed identity for the hosting service.

For information on assigning permissions at the resource or subscription level using the Azure CLI, see the article [Assign Azure roles using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

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

### [Azure CLI](#tab/azure-cli)

A managed identity is assigned a role in Azure with the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. The general form of the command is:

```azurecli
# Assign the 'Storage Blob Data Contributor' role to your user
az role assignment create \
    --role "Storage Blob Data Contributor" \
    --assignee <YOUR USER PRINCIPAL NAME> \
    --scope "/subscriptions/<YOUR-SUBSCRIPTION-ID>/resourceGroups/msdocs-python-cloud-etl-rg/providers/Microsoft.Storage/storageAccounts/msdocspythoncloudetladls"
```

>[!NOTE]
>*managed-identity-id* is the managed identity ID of the Azure Function App. If needed, return to the Function App **Identity** page to get this ID.


### [Visual Studio Code](#tab/vscode)

Complete the steps using either the Azure portal or the Azure CLI.


---

>[!IMPORTANT]
>Role assignment creation could take a minute to apply in Azure. It is recommended to wait a moment before running the next command in this article.

## 4. Create container and directory for Azure Data Lake

A container act as a file system directory to organize data files in an Azure Data Lake Store. Containers can store an unlimited amount of blobs, and a storage account can have an unlimited number of containers.

Considerations must be made to ease security, efficient processing, and partitioning efforts when loading data into a data lake. Azure Data Lake Storage Gen 2 uses directories instead of the virtual folders in blob storage. Directories  allow for more precise security, control access, and directory level filesystem operations.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step 1.** Once your deployment is complete, navigate to the new Data Lake resource by selecting the **Go to resource**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-goto.png" alt-text="A screenshot showing how to go to the new Azure Storage Account using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-goto.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** In the **Data storage** section in the *left* panel, select **Containers** and select **+ Container** in the **Containers** pane.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-container.png" alt-text="A screenshot showing how to navigate to create a new Container using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-container.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Configure the new container.
        1. **Name**: Enter **msdocs-python-cloud-etl-processed**.
        1. **Public access level**: Select **Private (no anonymous access)**.
        1. Select the **Create** button.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-container-create.png" alt-text="A screenshot showing how to configure and create the Container using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-container-create.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 4.** Create new directory.
        1. Select **+ Add Directory**.
        1. Enter **news-data**.
        1. Select **Save**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-directory.gif" alt-text="Animated screenshot showing how to create a directory in the Container using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-directory.gif":::
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

**Step 1:** Run *[az storage fs create](/cli/azure/storage/fs#az-storage-fs-create)* to create a file system in ADLS Gen 2. A file system contains files and folders, similarly to how a container in Azure Blob Storage contains blobs.

```azurecli
# Create a file system in ADLS Gen2
az storage fs create \
    --name msdocs-python-cloud-etl-processed \
    --account-name msdocspythonetladls
```

 **Step 2.** Run *[az storage fs directory create](/cli/azure/storage/fs/directory)* to create the directory (folder) in the newly created file system to land our processed data.

```azurecli
# Create a directory in ADLS Gen2 file system
az storage fs directory create \
    --name news-data \
    --file-system msdocs-python-cloud-etl-processed \
    --account-name msdocspythonetladls 
```

### [Visual Studio Code](#tab/vscode)

Complete the steps using either the Azure portal or the Azure CLI.


---

>[!NOTE]
> It is very easy to turn a data lake into a data swamp. So, it is important to govern the data that resides in your data lake.
>
> [Azure Purview](/azure/purview/) is a unified data governance service that helps you manage and govern your on-premises, multi-cloud, and software-as-a-service (SaaS) data. Easily create a holistic, up-to-date map of your data landscape with automated data discovery, sensitive data classification, and end-to-end data lineage.

## 5. Create code for Data Lake with Python SDK

Once the data is transformed into a format ideal for analysis, load the data into an analytical data store. The data store can be a database system, data warehouse, data lake, or Hadoop. Each destination has different approaches for loading data reliability and optimized performance. The data can now be used for analysis and business intelligence. This article loads the transformed data into Azure Data Lake Storage (ADLS) as various compute and analytic Azure services can easily connect to Azure Data Lake Storage.

**Step 1.** Open the **local.settings.json** file, which holds the local environment settings.

***Step 2.** Edit the file to update the following:

|Property|Setting|
|--|--|
|DATALAKE_GEN_2_RESOURCE_NAME|Enter the Data Lake resource name in double quotes, for example "YOUR-RESOURCE_NAME".|
|DATALAKE_GEN_2_CONTAINER_NAME|Enter the container name in double quotes, for example "processed-news".|
|DATALAKE_GEN_2_DIRECTORY_NAME|Enter the directory name in double quotes, for example "news-data".|

**Step 1.** Create App Settings for the Azure resources.

1. Navigate to the **Explorer** icon in the **Activity bar**.
1. Open the **local.settings.json** in the **editor** pane.
1. Add a key-value pair to store the **Azure Storage Account** name by entering `, "ADLS_ACCOUNT_NAME": "msdocspythoncloudetladls"`.
1. Add another key-value pair to store the container name by entering `, "AdLS_CONTAINER": "msdocs-python-cloud-etl-processed"`.
1. Add another key-value pair to store the key vault name by entering `, "ADLS_DIR": "news-data"`.

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-blobtrigger-function-app-settings.png" alt-text="A screenshot showing how to add App Settings for Azure Storage information to the local.settings.json file in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-blobtrigger-function-app-settings.png":::

## 6. Create code for data transformation with Python

**Step 1.** Create a file named `transform.py` in the **shared** folder.

**Step 2.** Copy the following Python code into it.

:::code language="python" source="~/../msdocs-python-etl-serverless/shared/transform.py"  :::

## 7. Create code for BlobTrigger function with Python

**Step 1.** Create a file named `transform.py` in the **shared** folder.

**Step 2.** Copy the following Python code into it.

:::code language="python" source="~/../msdocs-python-etl-serverless/shared/transform.py"  :::

## 8. Test the Azure blob storage trigger Function

To properly test the local Azure Storage Blob Trigger function, the Azure HTTP Trigger function must be executed first. Since the Azure HTTP Trigger function creates and uploads the results file to Azure Blob Storage, the Blob Trigger function executes automatically.

**Step 1.**  Start the function locally by pressing `F5` or the play icon.

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-test-blobtrigger-function.png" alt-text="A screenshot showing how to build and run the functions in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-test-blobtrigger-function.png":::

**Step 2.** Execute the function locally.

1. Choose the **Azure icon** in the **Activity bar**.
1. In the **Workspace area**, expand **Local Project** then **Functions**.
1. Right-click (Windows) or Ctrl + Select (macOS) the **api_search** function.
1. Choose **Execute Function Now**.
1. At the prompt, enter the request message body value `{ "search_term": "Azure" }` and press Enter.

**Step 3.** Verify the functions ran successfully.

1. Verify the Blob Storage **** container has a file named _like_ ``.
1. Verify the Data Lake **** container and **** directory has a file named _like_ ``.

## 9. Troubleshooting the Azure functions

If you've reached this point and your processed file isn't in the Data Lake container and directory, use the following information to debug the application. 

1. **Turn logging on**:
    1. Stop the application.
    1. Open the `./host.json` file. 
    1. Set the **logging.logLevel.default** property to `"Information"`.
    1. If you have any files in the Blob Storage, download the file and examine the contents. If it's a JSON array of news information, you know the HTTP trigger, `api_search` worked successfully. 
    1. Delete the files in blob storage. 
    1. Start the application again, and search for news with the HTTP API endpoint. 
    1. Review the debug log. It includes any errors that occurred. 
1. **Authentication or authorization errors indicates**:
    1. One of the Azure resources doesn't have the correct IAM role assignment or access policy.
    1. The local Azure function run time isn't using the correct identity. Make sure you sign in to Azure with the Azure CLI and verify your identity with `az account show`.
1. Any errors that result from **environment variable usage** indicates the value is either missing or incorrect in the `local.settings.json` file. You may have also used one directory, container, or secret name when configuring a resource but added a slightly different name to the `local.settings.json` file. 

## Next step

> [!div class="nextstepaction"]
> [Deploy the Solution >>](tutorial-deploy-azure-cloud-python-etl-04-deploy-solution.md)


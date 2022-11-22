---
title: "Tutorial: Process JSON Data for a Python ETL Solution on Azure"
description: In this article, you'll process JSON data for a Python ETL Solution on Azure
services: python, azure-functions, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.date: 10/15/2022
ms.prod: azure-python
---

# Tutorial: Use an Azure Function to process data with Python on Azure

In this tutorial, you'll continue developing a local Azure Function in Python by adding a BlobTrigger function that triggers when files are uploaded to your Blob Storage container. The Azure Function uses the various Python libraries to clean and normalize the news articles results data stored as a JSON file in [Azure Blob Storage](/products/storage/blobs/).

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-function-etl-data-transform-data-lake.png" alt-text="Deploy Serverless, Azure Cloud Python ETL Solution Architecture Diagram" lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-function-etl-data-transform-data-lake.png" border="false":::

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
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

**Step 1.** Navigate to the local Azure Function project root.

**Step 2.** Add a function to your project by running the `func new`. Enter a unique value for the `--name` parameter and set how the function will be triggered with the `--template` parameter.

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
:::row:::
    :::column:::
        **Step 5.** Once your deployment is complete, navigate to the new Data Lake resource by selecting the **Go to resource**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-goto.png" alt-text="A screenshot showing how to go to the new Azure Storage Account using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-goto.png":::
    :::column-end:::
:::row-end:::

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

## 3. Create container and directory for Azure Data Lake

A container act as a file system directory to organize data files in an Azure Data Lake Store. Containers can store an unlimited amount of blobs, and a storage account can have an unlimited number of containers.

Considerations must be made to ease security, efficient processing, and partitioning efforts when loading data into a data lake. Azure Data Lake Storage Gen 2 uses directories instead of the virtual folders in blob storage. Directories  allow for more precise security, control access, and directory level filesystem operations.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step 1.** In the **Data storage** section in the *left* panel, select **Containers** and select **+ Container** in the **Containers** pane.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-container.png" alt-text="A screenshot showing how to navigate to create a new Container using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-adls-container.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Configure the new container.
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
        **Step 3.** Create new directory.
        1. Select the **msdocs-python-cloud-etl-processed** container.
        1. Select **+ Add Directory**.
        1. Enter **news-data**.
        1. Select **Save**.
    :::column-end:::
    :::column:::
        
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

## 4. Create code for Data Lake with Python SDK

Once the data is transformed into a format ideal for analysis, load the data into an analytical data store. The data store can be a database system, data warehouse, data lake, or Hadoop. Each destination has different approaches for loading data reliability and optimized performance. The data can now be used for analysis and business intelligence. This article loads the transformed data into Azure Data Lake Storage (ADLS) as various compute and analytic Azure services can easily connect to Azure Data Lake Storage.

**Step 1.** Open the **local.settings.json** file, which holds the local environment settings.

**Step 2.** Edit the file to update the following:

|Property|Setting|
|--|--|
|DATALAKE_GEN_2_RESOURCE_NAME|Enter the Data Lake resource name in double quotes, for example "YOUR-RESOURCE_NAME".|
|DATALAKE_GEN_2_CONTAINER_NAME|Enter the container name in double quotes, for example **msdocs-python-cloud-etl-processed**.|
|DATALAKE_GEN_2_DIRECTORY_NAME|Enter the directory name in double quotes, for example **news-data**.|

## 5. Create code for data transformation with Python

**Step 1.** Create a file named `transform.py` in the **shared** folder.

**Step 2.** Copy the following Python code into it.

:::code language="python" source="~/../msdocs-python-etl-serverless/shared/transform.py"  :::

## 6. Create code for BlobTrigger function with Python

**Step 1.** Open the **__init__.py** file in the **api_blob_trigger** folder.

**Step 2.** Copy the following Python code into it.

:::code language="python" source="~/../msdocs-python-etl-serverless/api_blob_trigger/__init__.py" highlight="18,35,46-49"  :::

## 7. Test the Azure blob storage trigger Function

To properly test the local Azure Storage Blob Trigger function, the Azure HTTP Trigger function must be executed first. Since the Azure HTTP Trigger function creates and uploads the results file to Azure Blob Storage, the Blob Trigger function executes automatically.

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

1. Verify the Blob Storage **** container has a file named _like_ `search_results_azure_yar6q2P80Lm4FG7.json`.
1. Verify the Data Lake **msdocs-python-cloud-etl-processed** container and **news-data** directory has a file named _like_ `processed_search_results_azure_yar6q2P80Lm4FG7.json`.

## 8. Troubleshooting the Azure functions

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


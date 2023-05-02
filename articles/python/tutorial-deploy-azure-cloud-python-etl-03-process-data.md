---
title: "Tutorial: Process JSON Data for a Python ETL Solution on Azure"
description: In this article, you'll process JSON data for a Python ETL Solution on Azure
services: python, azure-functions, azure-storage-accounts
ms.custom: devx-track-python, engagement-fy23, py-fresh-zinc
ms.devlang: python
ms.topic: tutorial
ms.date: 01/03/2023
---

# Tutorial: Process data using Python Azure Function

In this tutorial, you'll continue developing a local Azure Function in Python by adding a BlobTrigger function that triggers when files are uploaded to your Blob Storage container. The Azure Function uses the various Python libraries to clean and normalize the news articles results data stored as a JSON file in [Azure Blob Storage](https://azure.microsoft.com/products/storage/blobs/
).

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/data-transform-data-lake.png" alt-text="Deploy Serverless, Azure Cloud Python ETL Solution Architecture Diagram" lightbox="./media/tutorial-deploy-azure-cloud-python-etl/data-transform-data-lake.png" border="false":::

## Prerequisites

You must have completed all steps from:
* [Overview](tutorial-deploy-azure-cloud-python-etl-01-overview.md)
* [Get Bing News using a Python Azure Function](tutorial-deploy-azure-cloud-python-etl-02-get-data.md)

## 1. Create a local BlobTrigger for Python Functions App

:::row:::
    :::column:::
        **Step 1.** Create new local Azure Function in the Visual Studio Code workspace.
        1. Choose the **Azure icon** in the **Activity bar**.
        1. In the **Workspace (local) area**, select the Azure Function icon (`+` + lightening) to add another API function.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-create-new-function.png" alt-text="A screenshot showing how to create a new local function project in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/visual-studio-code-create-new-function.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.**  Enter the following information at the prompts:
        1. **Select a template for your function**: Choose `Azure blob storage trigger`.
        1. **Provide a function name**: Enter `api_blob_trigger`.
        1. **Select setting from "local.settings.json"**: Select `BLOB_STORAGE_CONNECTION_STRING`. While this value is the same as `AzureWebJobsStorage` when running locally, the two connection strings will point to different storage accounts when the function app is deployed.
        1. **Path within your storage account the trigger will monitor**: Enter `msdocs-python-cloud-etl-news-source/{name}`. This represents the `msdocs-python-cloud-etl-news-source` container, and any file that lands there.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.**  Test the trigger by executing the `api_search` API again. Refer to the [instructions](tutorial-deploy-azure-cloud-python-etl-02-get-data.md#17-test-the-api-endpoint-for-your-python-function) on the previous page. 
    :::column-end:::
:::row-end:::

## 2. Create a resource for Azure Data Lake Gen 2

Azure Data Lake Storage (ADLS) is built upon the Azure Blob File System (ABFS) over TLS/SSL for encryption and uses an optimized driver for big data workloads. Other features such as storage tier options and high-availability & disaster recovery options of blob storage, make ADLS the ideal storage solution for big data analytics.

A storage account is created the same for Azure Data Lake Gen as for Azure Blob Storage. The only difference is that the hierarchical namespace (HNS) property **must** be enabled. The hierarchical namespace is a fundamental part of Azure Data Lake Storage. This functionality enables the organization of objects/files into a hierarchy of directories for efficient data access.

Follow these steps to create and configure the Azure Data Lake Storage resource.

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
        **Step 2.** On the **Basics tab**, provide the following information for your storage account.
        1. **Subscription**: Select <**YOUR-SUBSCRIPTION**>.
        1. **Resource group**: Select **msdocs-python-cloud-etl-rg**.
        1. **Name**: Enter **msdocspythoncloudetladls**.
        1. **Location**: Select **East US**.
        1. **Performance**: Select **Standard**.
        1. **Replication**: Select **Locally-redundant storage (LRS)**.
        1. Select **Next: Advanced** to proceed to continue configuring values for the resource.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-adls-configure.png" alt-text="A screenshot of configuring the new Azure Storage Account using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-adls-configure.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Configure the Azure Storage Account for enable Data Lake functionality.

         1. Deselect **Allow enabling public access on containers** if it is checked.  
         1. Select **Enable hierarchical namespace**.
         1. For this tutorial, leave the rest of settings in the **Advanced** pane the default values.
         1. Select **Review** to proceed to validate the configuration values before creating the resource.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-adls-configure-2.png" alt-text="A screenshot of configuring the Azure Storage Account to enable Data Lake Storage Gen2 using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-adls-configure-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 4.** Select **Create** to accept the configured values, then proceed to validate and create the account.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-adls-review.png" alt-text="A screenshot of reviewing the configuration of the new Azure Storage Account using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-adls-review.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 5.** Once your deployment is complete, navigate to the new Data Lake resource by selecting the **Go to resource**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-adls-goto.png" alt-text="A screenshot showing how to go to the new Azure Storage Account using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-adls-goto.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 6.** Assign your user account as a **Storage Blob Data Contributor** so you can add, update, and delete blobs.

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


## 3. Create container and directory for Azure Data Lake

A container act as a file system directory to organize data files in an Azure Data Lake Store. Containers can store an unlimited amount of blobs, and a storage account can have an unlimited number of containers.

Considerations must be made to ease security, efficient processing, and partitioning efforts when loading data into a data lake. Azure Data Lake Storage Gen 2 uses directories instead of the virtual folders in blob storage. Directories  allow for more precise security, control access, and directory level filesystem operations.

:::row:::
    :::column:::
        **Step 1.** In the **Data storage** section in the *left* panel, select **Containers** and select **+ Container** in the **Containers** pane.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-adls-container.png" alt-text="A screenshot showing how to navigate to create a new Container using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-adls-container.png":::
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
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/portal-adls-container-create.png" alt-text="A screenshot showing how to configure and create the Container using Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/portal-adls-container-create.png":::
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
:::row-end:::

>[!NOTE]
> It is very easy to turn a data lake into a data swamp. So, it is important to govern the data that resides in your data lake.
>
> [Azure Purview](/azure/purview/) is a unified data governance service that helps you manage and govern your on-premises, multi-cloud, and software-as-a-service (SaaS) data. Easily create a holistic, up-to-date map of your data landscape with automated data discovery, sensitive data classification, and end-to-end data lineage.

## 4. Create code for Data Lake with Python SDK

Once the data is transformed into a format ideal for analysis, load the data into an analytical data store. The data store can be a database system, data warehouse, data lake, or Hadoop. Each destination has different approaches for loading data reliability and optimized performance. The data can now be used for analysis and business intelligence. This article loads the transformed data into Azure Data Lake Storage (ADLS) as various compute and analytic Azure services can easily connect to Azure Data Lake Storage.

1. Open the **local.settings.json** file, which holds the local environment settings.

2. Edit the file to update the following:

    |Property|Setting|
    |--|--|
    |DATALAKE_GEN_2_RESOURCE_NAME|Enter the Data Lake resource name in double quotes, for example **msdocspythoncloudetladls**.|
    |DATALAKE_GEN_2_CONTAINER_NAME|Enter the container name in double quotes, for example **msdocs-python-cloud-etl-processed**.|
    |DATALAKE_GEN_2_DIRECTORY_NAME|Enter the directory name in double quotes, for example **news-data**.|

## 5. Create code for data transformation with Python

1. Create a file named `transform.py` in the **shared** folder.

2. Copy the following Python code into it.

    :::code language="python" source="~/../msdocs-python-etl-serverless/shared/transform.py"  :::

## 5. Create code for data lake with Python

1. Create a file named `data_lake.py` in the **shared** folder.

2. Copy the following Python code into it.

    :::code language="python" source="~/../msdocs-python-etl-serverless/shared/data_lake.py"  :::

## 7. Create code for BlobTrigger function with Python

1. Open the **__init__.py** file in the **api_blob_trigger** folder.

2. Replace the file's contents with the following Python code.

    :::code language="python" source="~/../msdocs-python-etl-serverless/api_blob_trigger/__init__.py" highlight="18,35,46-49"  :::

## 8. Test the Azure blob storage trigger Function

To properly test the local Azure Storage Blob Trigger function, the Azure HTTP Trigger function must be executed first. Since the Azure HTTP Trigger function creates and uploads the results file to Azure Blob Storage, the Blob Trigger function executes automatically.

1.  Run the function locally.

    ```bash
    func start
    ```    

2. Test the function locally. Use a web browser to test your **search** api:

    ```
    http://localhost:7071/api/search?search_term=azure&count=5
    ```
    
3. Verify the Blob Storage **msdocs-python-cloud-etl-news-source** container has a file named _like_ `search_results_azure_yar6q2P80Lm4FG7.json`.
4. Verify the Data Lake **msdocs-python-cloud-etl-processed** container and **news-data** directory has a file named _like_ `processed_search_results_azure_yar6q2P80Lm4FG7.json`.

## What have you accomplished

If your Azure function was successful, you know that the following are correctly configured and running:

* Local APIs
* Azure resources: Bing Search, Key Vault, Blob Storage
* Authentication: your user credentials can access the resources

The next step is to deploy your code to an Azure Function resource and correctly configure that resource.

## Troubleshooting the Azure functions

If you've reached this point and your processed file isn't in the Data Lake container and directory, use the following information to debug the application. 

* **Turn local logging on**:
    1. Stop the application.
    1. Open the `./host.json` file. 
    1. Set the **logging.logLevel.default** property to `"Information"`.
    1. If you have any files in the Blob Storage, download the file and examine the contents. If it's a JSON array of news information, you know the HTTP trigger, `api_search`, worked successfully. 
    1. Delete the files in blob storage. 
    1. Start the application again, and search for news with the HTTP API endpoint. 
    1. Review the debug log. It includes any errors that occurred. 
* Data Lake Storage
    * Resource name must be set in the `DATALAKE_GEN_2_RESOURCE_NAME` property in **local.settings.json**.
    * Container name such as `msdocs-python-cloud-etl-news-source` must match the `BLOB_STORAGE_CONTAINER_NAME` property in **local.settings.json**.
    * Your user account for Blob Storage needs the **Storage Blob Data Contributor** role to add and read the blob. 

## Next step

> [!div class="nextstepaction"]
> [Deploy the Solution >>](tutorial-deploy-azure-cloud-python-etl-04-deploy-solution.md)

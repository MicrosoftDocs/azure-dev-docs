---
title: "Tutorial: Load Processed Data to Azure Data Lake Store for a Python ETL Solution on Azure"
description: In this article, Load Processed Data to Azure Data Lake Store for a Python ETL Solution on Azure
services: python, azure-functions, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.date: 10/15/2022
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Tutorial: Use an Azure Function to load an Azure Data Lake Store using Python on Azure

This tutorial, loads the processed data into Azure Data Lake Storage (ADLS) Gen 2 using an Azure Blob Trigger Function with Python.

The data is then archived into an Azure Blob Storage Container using Azure Storage lifecycle management policies.

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/deploy-azure-cloud-python-etl-architecture.svg" alt-text="Deploy Serverless, Azure Cloud Python ETL Solution Architecture Diagram" lightbox="./media/tutorial-deploy-azure-cloud-python-etl/deploy-azure-cloud-python-etl-architecture.svg" border="false":::

## 1. Create Azure Data Lake Storage

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

---

## 2. Create processed data storage structure

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
    --account-name msdocspythonetladls \
    --auth-mode login
```

 **Step 2.** Run *[az storage fs directory create](/cli/azure/storage/fs/directory)* to create the directory (folder) in the newly created file system to land our processed data.

```azurecli
# Create a directory in ADLS Gen2 file system
az storage fs directory create \
    --name news-data \
    --file-system msdocs-python-cloud-etl-processed \
    --account-name msdocspythonetladls \
    --auth-mode login
```

---

>[!NOTE]
> It is very easy to turn a data lake into a data swamp. So, it is important to govern the data that resides in your data lake.
>
> [Azure Purview](/azure/purview/) is a unified data governance service that helps you manage and govern your on-premises, multi-cloud, and software-as-a-service (SaaS) data. Easily create a holistic, up-to-date map of your data landscape with automated data discovery, sensitive data classification, and end-to-end data lineage.

## 3. Assign data lake Access Controls

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
    --assignee <YOUR USER SIGN-IN NAME> \
    --scope "/subscriptions/<YOUR-SUBSCRIPTION-ID>/resourceGroups/msdocs-python-cloud-etl-rg/providers/Microsoft.Storage/storageAccounts/msdocspythoncloudetladls"
```

>[!NOTE]
>*account-email* is your user account email for running the local function.
>*managed-identity-id* is the managed identity ID of the Azure Function App. If needed, return to the Function App **Identity** page to get this ID.

---

>[!IMPORTANT]
>Role assignment creation could take a minute to apply in Azure. It is recommended to wait a moment before running the next command in this article.

## 4. Load processed data into Azure Data Lake Store

Once the data is transformed into a format ideal for analysis, load the data into an analytical data store. The data store can be a database system, data warehouse, data lake, or Hadoop. Each destination has different approaches for loading data reliability and optimized performance. The data can now be used for analysis and business intelligence. This article loads the transformed data into Azure Data Lake Storage (ADLS) as various compute and analytic Azure services can easily connect to Azure Data Lake Storage.

**Step 1.** Create App Settings for the Azure resources.

1. Navigate to the **Explorer** icon in the **Activity bar**.
1. Open the **local.settings.json** in the **editor** pane.
1. Add a key-value pair to store the **Azure Storage Account** name by entering `, "ADLS_ACCOUNT_NAME": "msdocspythoncloudetladls"`.
1. Add another key-value pair to store the container name by entering `, "AdLS_CONTAINER": "msdocs-python-cloud-etl-processed"`.
1. Add another key-value pair to store the key vault name by entering `, "ADLS_DIR": "news-data"`.

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-blobtrigger-function-app-settings.png" alt-text="A screenshot showing how to add App Settings for Azure Storage information to the local.settings.json file in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-blobtrigger-function-app-settings.png":::

<br/>

**Step 2:** Open the '_init_.py' class file of the *msdocs-cloud-python-etl-BlobTrigger* function and add the below function definition to load the processed data into the Azure Data Lake Storage.

```python
def write_to_datalake(azure_credential, data_str, adls_account, adls_container, target_adls_file_path):

    try:
        adls_account_url = "{}://{}.dfs.core.windows.net".format("https",adls_account)
        
        # set up the service client with the credentials from the parameters passed in.
        service_client = DataLakeServiceClient(
            account_url=adls_account_url, 
            credential=azure_credential
        )

        # a client to interact with the DataLake file, even if the file doesn't exist.
        json_file = DataLakeFileClient( 
            account_url=adls_account_url, 
            file_system_name=adls_container, 
            file_path=target_adls_file_path, 
            credential=azure_credential
        )

        # get string byte size
        str_byte_size = len(data_str.encode('utf-8'))

        # create a file before writing content to it
        json_file.create_file()

        # upload data string to the newly created file.
        json_file.upload_data(
               data=data_str, 
               overwrite=True, 
               length=str_byte_size
        )

        # data is only committed when flush is called
        json_file.flush_data(str_byte_size)

        logging.info(f"Successfully uploaded process JSON file of the Bing News Search results to {target_adls_file_path}.")
    
        return True

    except Exception as e:
        logging.critical(e)
        return False
```

<br/>

**Step 3.** Modify the **main** function definition of the local BlobTrigger Azure Function to call each new function defined in this tutorial.

```python
def main(myblob: func.InputStream):

    logging.info(f"Python blob trigger function processed blob \n"
                 f"Name: {myblob.name}\n"
                 f"Blob Size: {myblob.length} bytes")

    # create a default credential capable of handling most Azure SDK authentication scenarios.
    default_credential = DefaultAzureCredential(additionally_allowed_tenants=['*'])

    logging.info(f"Start processing Bing News Search results for '{myblob.name}'.")

    # read the blob content as a string.
    search_results_blob_str = myblob.read()

    # decode the string to Unicode, then replace single quotes with double quotes.
    blob_json = search_results_blob_str.decode("utf-8").replace("'", '"')
    
    # parse a valid JSON string and convert it into a Python Dictionary
    data = json.loads(blob_json)

    # initialize processed data json string
    json_str = ''

    # loop through and process each search result.
    for item in data['value']:

        # get news article URL.
        article_url = item['url']

        # get and remove any html tags in the name of the news article.
        article_title = remove_html_tags(item['name'])

        # get and remove any html tags in the short description of the news article.
        article_descr = remove_html_tags(item['description'])

        # get the new article contents and store text.
        article_text = get_html_text(requests.get(article_url).content)

        # remove any html tags in the news article's text.
        article_text = remove_html_tags(article_text)

        # preprocess/normalize new article's text to make it easier to 
        # consume by analytic applications.
        article_text_norm = normalize_text(article_text)

        # build final result JSON.
        json_str = json_str + '{"url": "' + article_url + '","title":"' + article_title + '","description":"' + article_descr + '","normalized_text":' + article_text_norm + '},'

    # remove last char, a comma, to ensure valid json format.
    json_str = json_str[:-1]

    # create json root node.
    json_str_final = '{"values":[' + json_str + ']}'

    logging.info(f"Successfully processed Bing News Search results for '{myblob.name}'.")

    # get App Settings.
    adls_account_name = os.environ['ADLS_ACCOUNT']
    adls_container_name = os.environ['ADLS_CONTAINER']
    adls_directory_name = os.environ['ADLS_DIR']
    
    # build processed file name.
    file_name = myblob.name.split('/')[1]
    processed_file_name = f'processed-{file_name}'

    # build processed file path.
    adls_file_path = f'{adls_directory_name}/{processed_file_name}'

    # write processed json to processed file path in the data lake.
    is_success = write_to_datalake(
                        azure_credential=default_credential,
                        data_str=json_str_final, 
                        adls_account=adls_account_name, 
                        adls_container=adls_container_name, 
                        target_adls_file_path=adls_file_path
    )

    # check write_to_datalake completion status
    if is_success:
        logging.critical(f'Write to Data Lake was successful.')
    else:
        logging.critical(f'Error: Write to Data Lake failed.')
```

## 4. Run ETL solution locally

**Step 1.**  Test running the Azure Storage Blob Trigger function locally by pressing `F5` or the play icon while in the editor window of the **__init__.py** file.

<br/>

**Step 2.** Execute the HTTP Trigger function locally.

1. Choose the **Azure icon** in the **Activity bar**. 
1. In the **Workspace area**, expand **Local Project > Functions**. 
1. Right-click (Windows) or Ctrl + Select (macOS) the **msdocs-cloud-python-etl-HttpTrigger** function.
1. Choose **Execute Function Now**.

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-execute-function.png" alt-text="A screenshot showing executing the new local function in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-execute-function.png":::

<br/>

**Step 4.** Test the new functionality by entering the request message body value `{ "search_term": "Azure"}` and press **Enter**.

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-execute-http-function.gif" alt-text="Animated screenshot of testing the HTTPTrigger Azure Function in Visual Studio." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-execute-http-function.gif":::

<br/>

**Step 5.** Navigate to storage explorer in Visual Studio Code or the portal to see processed file.

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-blobtrigger-function-output.gif" alt-text="Animated screenshot navigating to check the Azure Blob Trigger Function output in Visual Studio." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-blobtrigger-function-output.gif":::

## Next step

> [!div class="nextstepaction"]
> [Deploy the Solution >>](tutorial-deploy-azure-cloud-python-etl-06-deploy-solution.md)

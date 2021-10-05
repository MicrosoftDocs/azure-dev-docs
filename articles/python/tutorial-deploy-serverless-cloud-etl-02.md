---
title: Create resources for a cloud-based, serverless ETL solution using Python on Azure
description: In this article, you'll use Azure CLI to create and configure common Azure resources used for a cloud-based, serverless ETL.
services: python, azure-functions, azure-key-vault, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.prod: azure-python
author: jess-johnson-msft
ms.author: jejohn
ms.date: 10/04/2021
---

# Create resources for a cloud-based, serverless ETL solution using Python on Azure

This article shows you how to use Azure CLI to deploy and configure the Azure resources used for our cloud-based, serverless ETL.

 ![Resources diagram](media\serverless-cloudetl\serverless_cloudetl_arch_02.svg)

>[!IMPORTANT]
> To complete each part of this series, you must create all of these resources in advance.  Create each of the resources in a single resource group for organization and ease of resource clean-up.

## Prerequisites

Before you can begin the steps in this article, complete the tasks below:

* Azure subscription, if you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/)
* [Python 3.7 or later](https://www.python.org/downloads/) is installed

    ```Terminal
    python --version
    ```

* Azure CLI; the CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or you can [install Azure CLI](/cli/azure/install-azure-cli) locally

    ```Terminal
    az --version
    ```

* [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms) is installed

    ```Terminal
    code --version
    ```

* Install the latest version of [Azure Functions Core Tools](/azure/azure-functions/functions-run-local)

    ```Terminal
    func --version
    ```

* Install Visual Studio Code extensions:
  * [Visual Studio Code Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
  * [Visual Studio Code Azure CLI Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli)
  * [Visual Studio Code Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)

## 1. Set up your dev environment

If you haven't already, **follow all the instructions** on [Configure your local Python dev environment for Azure](/azure/developer/python/configure-local-development-environment).

* **Step 1:** Run [az login](/cli/azure/authenticate-azure-cli) to sign into Azure.

    ```azurecli
    az login
    ```

* **Step 2:** When using the Azure CLI, you can turn on the param-persist option that automatically stores parameters for continued use. To learn more, see [Azure CLI persisted parameter](/cli/azure/param-persist-howto). [optional]

    ```azurecli
    az config param-persist on
    ```

>[!IMPORTANT]
>Be sure to create and activate a local virtual environment for this project.

## 2. Create an Azure Resource Group

Create an Azure Resource Group to organize the Azure services used in this series logically.

Azure Resource Groups can also provide more insights through resource monitoring and cost management.

* **Step 1:** Run [az group create](/cli/azure/group) to create a resource group for this series.

    ```azurecli
    service_location='eastus'
    resource_group_name='rg-cloudetl-demo'

    # Create an Azure Resource Group to organize the Azure services used in this series logically
    az group create \
        --location $service_location \
        --name $resource_group_name
    ```

>[!NOTE]
>You can not host Linux and Windows apps in the same resource group. Suppose you have an existing resource group named rg-cloudetl-demo with a Windows function app or web app. In that case, you must use a different resource group.

## 3. Configure Azure Blob Storage

Azure Blob Storage is a general-purpose, object storage solution. In this series, blob storage acts as a landing zone for  '*source*' system data and is a common data engineering scenario.

### Create an Azure Storage Account

An Azure Storage Account is a namespace in Azure to store data. The blob storage URL combines the storage account name and the base Azure Storage Blob endpoint address, so the storage account name **must be unique**.

The below instructions create the Azure Storage Account programmatically. However, you can also [create a storage account](/azure/storage/common/storage-account-create?tabs=azure-portal) using the Azure portal.

* **Step 1:** Run [az storage account create](/cli/azure/storage/account) to create a Storage Account with Kind StorageV2, and assign an Azure Identity.

    ```azurecli
    storage_acct_name='stcloudetldemodata'

    # Create a general-purpose storage account in your resource group and assign it an identity
    az storage account create \
        --name $storage_acct_name \
        --resource-group $resource_group_name \
        --location $service_location \
        --sku Standard_LRS \
        --assign-identity
    ```

* **Step 2:** Run the [az role assignment create](/azure/role-based-access-control/role-assignments-cli) to add the 'Storage Blob Data Contributor' role to your user email.

    ```azurecli
    user_email='jejohn@microsoft.com'

    # Assign the 'Storage Blob Data Contributor' role to your user
    az role assignment create \
        --assignee $user_email \
        --role 'Storage Blob Data Contributor' \
        --resource-group  $resource_group_name
    ```

>[!IMPORTANT]
>Role assignment creation could take a minute to apply in Azure. It is recommended to wait a moment before running the next command in this article.

### Create a Container in the Storage Account

Containers to organize blob data, similar to a file system directory. A container can store an unlimited amount of blobs, and a storage account can have multiple containers.

The below instructions create the Azure Storage Account programmatically. However, you can also [create a container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container) using the Azure portal.

* **Step 1:** Run [az storage container create](/cli/azure/storage/container) to create two new containers in your Storage Account, one for the source dat and the other for archiving processed files.

    ```azurecli
    abs_container_name='demo-cloudetl-data'
    abs_archive_container_name='demo-cloudetl-archive'

    # Create a storage container in a storage account.
    az storage container create \
        --name $abs_container_name \
        --account-name $storage_acct_name \
        --auth-mode login

    az storage container create \
        --name $abs_archive_container_name \
        --account-name $storage_acct_name \
        --auth-mode login
    ```

* **Step 2:** Run [az storage account show](/cli/azure/storage/account#az_storage_account_show) to capture the storage account ID.

    ```azurecli
    storage_acct_id=$(az storage account show \
                        --name $storage_acct_name  \
                        --resource-group $resource_group_name \
                        --query 'id' \
                        --output tsv)
    ```

* **Step 3:** Run [az storage account keys list](/cli/azure/storage/account/keys#az_storage_account_keys_list) to capture one of the storage account access keys for the next section.

    ```azurecli
    # Capture storage account access key1
    storage_acct_key1=$(az storage account keys list \
                            --resource-group $resource_group_name \
                            --account-name $storage_acct_name \
                            --query [0].value \
                            --output tsv)
    ```

## 4. Configure Azure Data Lake Gen2

Azure Data Lake Storage Gen 2 (ADLS) is built upon the Azure Blob File System (ABFS) over TLS/SSL for encryption. An optimized driver for big data workloads was also added to ADLS Gen 2. This feature, along with the cost savings, available storage tiers, and high-availability & disaster recovery options of blob storage, make ADLS Gen 2 the ideal storage solution for big data analytics.

### Create Azure Data Lake Storage Account

A storage account is created the same for ADLS Gen 2 as for Azure Blob Storage. The only difference is that the hierarchical namespace (HNS) property **must** be enabled. The hierarchical namespace is a fundamental part of Data Lake Storage Gen2. This functionality enables the organization of objects/files into a hierarchy of directories for efficient data access.

* **Step 1:** Run [az storage account create](/cli/azure/storage/account) to create an Azure Data Lake Gen 2 Storage Account with Kind StorageV2, HNS enabled, and assign an Azure Identity.

    ```azurecli
    adls_acct_name='dlscloudetldemo'
    fsys_name='processed-data-demo'
    dir_name='finance_data'

    # Create a ADLS Gen2 account
    az storage account create \
        --name $adls_acct_name \
        --resource-group $resource_group_name \
        --kind StorageV2 \
        --hns \
        --location $service_location \
        --assign-identity
    ```

* **Step 2:** Run [az storage account keys list](/cli/azure/storage/account/keys#az_storage_account_keys_list) to capture one of the ADLS storage account access keys for the next section.

    ```azurecli
    adls_acct_key1=$(az storage account keys list \
                        --resource-group $resource_group_name \
                        --account-name $adls_acct_name \
                        --query [0].value
                        --output tsv)
    ```

>[!NOTE]
> It is very easy to turn a data lake into a data swamp. So, it is important to govern the data that resides in your data lake.
>
> [Azure Purview](/services/purview/#overview) is a unified data governance service that helps you manage and govern your on-premises, multi-cloud, and software-as-a-service (SaaS) data. Easily create a holistic, up-to-date map of your data landscape with automated data discovery, sensitive data classification, and end-to-end data lineage.

### Configure Data Lake Storage structure

When loading data into a data lake, considerations must be made to ease security, efficient processing, and partitioning efforts. Azure Data Lake Storage Gen 2 uses directories instead of the virtual folders in blob storage. Directories  allow for more precise security, control access, and directory level filesystem operations.

* **Step 1:** Run *[az storage fs create](/cli/azure/storage/fs#az_storage_fs_create)* to create a file system in ADLS Gen 2. A file system contains files and folders, similarly to how a container in Azure Blob Storage contains blobs.

    ```azurecli
    # Create a file system in ADLS Gen2
    az storage fs create \
        --name $fsys_name \
        --account-name $adls_acct_name \
        --auth-mode login
    ```

* **Step 2:** Run *[az storage fs directory create](/cli/azure/storage/fs/directory)* to create the directory (folder) in the newly created file system to land our processed data.

    ```azurecli
    # Create a directory in ADLS Gen2 file system
    az storage fs directory create \
        --name $dir_name \
        --file-system $fsys_name \
        --account-name $adls_acct_name \
        --auth-mode login
    ```

## 5. Set up Azure Key Vault

It was common practice to store sensitive information from the application code into a 'config.json' file in the past. However, the sensitive information would still be stored in plain text. Additionally, in Azure, the developer also manually copies the values in the local app settings file to the Azure app configuration settings.

A better approach is to use an Azure Key Vault. Azure Key Vault is a centralized cloud solution for storing and managing sensitive information, such as passwords, certificates, and keys. Using Azure Key Vault also provides better access monitoring and logs to see who accesses secret, when, and how.

### Configure Azure Key Vault and secrets

Create a new Azure Key Vault within your resource group.

* **Step 1:** Run [az keyvault create](/cli/azure/keyvault/create) to create an Azure Key Vault.

    ```azurecli
    key_vault_name='kv-cloudetl-demo'

    # Provision new Azure Key Vault in our resource group
    az keyvault create  \
        --location $service_location \
        --name $key_vault_name \
        --resource-group $resource_group_name
    ```

* **Step 2:** Set a 'secret' in Azure Key Vault to store the Blob Storage Account access key. Run [az keyvault secret set](/cli/azure/keyvault/secret) to create and set a secret in Azure Key Vault.

    ```azurecli
    abs_secret_name='abs-access-key1'
    adls_secret_name='adls-access-key1'

    # Create Secret for Azure Blob Storage Account
    az keyvault secret set \
        --vault-name $key_vault_name \
        --name $abs_secret_name \
        --value $storage_acct_key1

    # Create Secret for Azure Data Lake Storage Account
    az keyvault secret set \
        --vault-name $key_vault_name \
        --name $adls_secret_name \
        --value $adls_acct_key1
    ```

>[!IMPORTANT]
>If your secret value contains special characters, you will need to 'escape' the special character by wrapping it with double quotes and the entire string in single quotes. Otherwise, the secret value is not set correctly.
>
>* Will **not** work: "This is my secret value & it has a special character."
>* Will **not** work: "This is my secret value '&' it has a special character."
>* **Will work: 'this is my secret value "&" it has a special character'**

### Set environment variables

This application uses the key vault name as an environment variable called `KEY_VAULT_NAME.`

```bash
export KEY_VAULT_NAME=$key_vault_name
export ABS_SECRET_NAME=$abs_secret_name
export ADLS_SECRET_NAME=$adls_secret_name
```

## 6. Create a serverless function

A **serverless** architecture builds and runs services without infrastructure management, such as provisioning, scaling, and maintaining the resources required to run the Function App. Azure takes care of these management tasks in the backend, allowing developers to focus on building the app.

### Create a local Python Function project

A local Python Function project is needed to build and execute our function during development. Create a function project using the [Azure Functions Core Tools](/azure/azure-functions/functions-run-local) and following the steps below.

* **Step 1:** Run the `func init` command to create a functions project in a folder named _CloudETLDemo_Local_:

    ```console
    func init CloudETLDemo_Local --python
    ```

* **Step 2:** Navigate into the project folder:

    ```console
    cd CloudETLDemo_Local
    ```

* **Step 3:** Add functions to your project by using the following command, where the `--name` argument is the unique name of your function and the `--template` argument specifies the function's trigger (HTTP).

    ```console
    func new --name demo_relational_data_cloudetl --template "HTTP trigger" --authlevel "anonymous"
    ```

* **Step 4:** Check that the function was correctly created by running the function locally. Start the local Azure Functions runtime host from the _CloudETLDemo_Local_ folder:

    ```console
    func start
    ```

* **Step 5:** Grab the _localhost_ URL at the bottom and append '?name=Functions' to the query string.

    ```Browser
    http://localhost:7071/api/demo_relational_data_cloudetl?name=Functions
    ```

* **Step 6:** When finished, use  '**Ctrl**+**C**' and choose `y` to stop the functions host.

### Initialize a Python Function App in Azure

An Azure Function App must be created to host our data ingestion function. This Function App is what we deploy our local dev function to once complete.

* **Step 1:** Run [az functionapp create](/cli/azure/functionapp#az_functionapp_create) to create the function app in Azure.

    ```azurecli
    funcapp_name='CloudETLFunc'

    # Create a serverless function app in the resource group.
    az functionapp create \
        --name $funcapp_name \
        --storage-account $storage_acct_name \
        --consumption-plan-location $service_location \
        --resource-group $resource_group_name \
        --os-type Linux \
        --runtime python \
        --runtime-version 3.7 \
        --functions-version 2
    ```

    >[!NOTE]
    > App Name is also the default DNS domain for the function app.

* **Step 2:** Run *az functionapp config appsettings set* to store Azure Key Vault name and Azure Blob Storage access key application configurations.

    ```console
    # Update function app's settings to include Azure Key Vault environment variable.
    az functionapp config appsettings set --name CloudETLDemo --resource-group rg-cloudetl-demo --settings "KEY_VAULT_NAME=kv-cloudetl-demo"

    # Update function app's settings to include Azure Blob Storage Access Key in Azure Key Vault secret environment variable.
    az functionapp config appsettings set --name CloudETLDemo --resource-group rg-cloudetl-demo --settings  "ABS_SECRET_NAME=abs-access-key1"

    # Update function app's settings to include Azure Data Lake Storage Gen 2 Access Key in Azure Key Vault secret environment variable.
    az functionapp config appsettings set --name CloudETLDemo --resource-group rg-cloudetl-demo --settings  "ADLS_SECRET_NAME=adls-access-key1"
    ```

## 7. Assign access policies and roles

  A Key Vault access policy determines whether a security principal, user, application, or user group, can do different operations on secrets, keys, and certificates.

* **Step 1:** Create an access policy in Azure Key Vault for the Azure Function App.

  The below instructions assign access policies programmatically. However, you can also [assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy-portal) using the Azure portal.

    ```azurecli
    # Generate managed service identity for function app
    az functionapp identity assign \
        --resource-group $resource_group_name \
        --name $funcapp_name

    # Capture function app managed identity id
    func_principal_id=$(az resource list \
                --name $funcapp_name \
                --query [*].identity.principalId \
                --output tsv)

    # Capture key vault object/resource id
    kv_scope=$(az resource list \
                    --name $key_vault_name \
                    --query [*].id \
                    --output tsv)

    # set permissions policy for function app to key vault - get list and set
    az keyvault set-policy \
        --name $key_vault_name \
        --resource-group $resource_group_name \
        --object-id $func_principal_id \
        --secret-permission get list set
    ```

* **Step 2:** Run [az role assignment create](/cli/azure/role/assignment) to assign ['Key Vault Secrets User' built-in role](/azure/role-based-access-control/built-in-roles#key-vault-secrets-user) to Azure Function App.

    ```azurecli
    # Create a 'Key Vault Contributor' role assignment for function app managed identity
    az role assignment create \
        --assignee $func_principal_id \
        --role 'Key Vault Contributor' \
        --scope $kv_scope

    # Assign the 'Storage Blob Data Contributor' role to the function app managed identity
    az role assignment create \
        --assignee $func_principal_id \
        --role 'Storage Blob Data Contributor' \
        --resource-group  $resource_group_name

    # Assign the 'Storage Queue Data Contributor' role to the function app managed identity
    az role assignment create \
        --assignee $func_principal_id \
        --role 'Storage Queue Data Contributor' \
        --resource-group  $resource_group_name
    ```

## 8. Upload a CSV Blob to the Container

To ingest relational data later in this series, upload a data file (blob) to an Azure Storage container.

>[!NOTE]
>If you already have your data (blob) uploaded, **you can skip to the next article in this series**.

### Sample Data

|Segment|Country|Product|Units Sold|Manufacturing Price|Sale Price|Gross Sales|Date|
|----|----|----|----|----|----|----|----|
|Government|Canada|Carretera|1618.5|$3.00|$20.00|$32,370.00|1/1/2014|
|Government|Germany|Carretera|1321|$3.00|$20.00|$26,420.00|1/1/2014|
|Midmarket|France|Carretera|2178|$3.00|$15.00|$32,670.00|6/1/2014|
|Midmarket|Germany|Carretera|888|$3.00|$15.00|$13,320.00|6/1/2014|
|Midmarket|Mexico|Carretera|2470|$3.00|$15.00|$37,050.00|6/1/2014|

* **Step 1:** Create a file named '*financial_sample.csv*' locally that contains this data by copying the below data into the file:

    ```CSV
    Segment,Country,Product,Units Sold,Manufacturing Price,Sale Price,Gross Sales,Date
    Government,Canada,Carretera,1618.5,$3.00,$20.00,"$32,370.00",1/1/2014
    Government,Germany,Carretera,1321,$3.00,$20.00,"$26,420.00",1/1/2014
    Midmarket,France,Carretera,2178,$3.00,$15.00,"$32,670.00",6/1/2014
    Midmarket,Germany,Carretera,888,$3.00,$15.00,"$13,320.00",6/1/2014
    Midmarket,Mexico,Carretera,2470,$3.00,$15.00,"$37,050.00",6/1/2014
    ```

* **Step 2:** Upload your data (blob) to your storage container by running [az storage blob upload](/cli/azure/storage/blob#az_storage_blob_upload).

    ```azurecli
    az storage blob upload \
        --account-name $storage_acct_name \
        --container-name $abs_container_name \
        --name 'financial_sample.csv' \
        --file 'financial_sample.csv' \
        --auth-mode login
    ```

## Next Step

> [!div class="nextstepaction"]
> [Next: Securely ingest relational data >>>](tutorial-deploy-serverless-cloud-etl-03.md)

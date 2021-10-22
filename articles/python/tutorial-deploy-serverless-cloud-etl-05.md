---
title: Load relational data into Azure Data Lake Storage and archive the source file with Azure Functions
description: This article, demonstrates how to load processed data and archive the source file using a serverless Python Function.
services: python, azure-functions, azure-key-vault, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.prod: azure-python
author: jess-johnson-msft
ms.author: jejohn
ms.date: 10/04/2021
---

# Load relational data into Azure Data Lake Storage with Azure Functions

 This article, loads processed data into Azure Data Lake Storage Gen 2 using a serverless Python Function. The data is then archived using Azure Blob Storage Access Tiers.

![Archive and Clean-up diagram](media\serverless-cloudetl\serverless_cloudetl_architecture_05.svg)

The final step of our solution **loads** the now processed data into the target data store. The data can be loaded using a row by row approach, or ideally a bulk insert/load process.

>[!TIP]
>Use bulk loading/bulk insert functions to load the **well transformed** data
>
>User manual/individual inserts for questionable datasets.

## Prerequisites

* Azure subscription, if you not, [create one for free](https://azure.microsoft.com/free/) before you begin.
* The [Azure Functions Core Tools](/azure/azure-functions/functions-run-local) version 3.x
* [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
* The [PowerShell extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell)
* The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code
* [Python 3.7 or later](./configure-local-development-environment.md) installed

## 1. Configure your dev environment

If you haven't already, **follow all the instructions** and complete the following articles to set up your local and Azure dev environment:

* [Configure your local Python dev environment for Azure](./configure-local-development-environment.md)
* [Create resources](tutorial-deploy-serverless-cloud-etl-02.md)
* [Ingest relational data](tutorial-deploy-serverless-cloud-etl-03.md)
* [Transform relational data](tutorial-deploy-serverless-cloud-etl-04.md)

## 2. Install required Python Azure SDK libraries

* Open and review the *requirements.txt* file contents and make sure the following Python Azure SDK libraries are included:

    ```txt
    azure-storage-file-datalake
    azure-identity
    azure-storage-blob
    azure-keyvault-secrets
    azure-functions
    azure-mgmt-storage
    pandas
    pyarrow
    fastparquet
    ```

* In a terminal or command prompt with a virtual environment activated, run the '*pip install*' command to install the required libraries.

    ```cmd
    pip install -r requirements.txt
    ```

## 3. Load processed relational data into Azure Data Lake Storage Gen 2

Once the data is transformed into a format ideal for analysis, load the data into an analytical data store. The data store can be a database system, data warehouse, data lake, or Hadoop. Each destination has different approaches for loading data reliability and optimized performance. The data can now be used for analysis and business intelligence.

This article loads the transformed data into Azure Data Lake Storage (ADLS) Gen 2. As [previously discussed](tutorial-deploy-serverless-cloud-etl-02.md), ADLS is the recommended data storage solution for analytic workloads. Various compute and analytic Azure services can easily connect to Azure Data Lake Storage Gen 2.

* **Step 1:** Open the '_init_.py' class file of the *demo_relational_data_cloudetl* function and add the below helper function to load a DataFrame to ADLS Gen 2.

    ```python
    def write_dataframe_to_datalake(df, datalake_service_client, filesystem_name, dir_name, filename):
        file_path = f'{dir_name}/{filename}'

        file_client = datalake_service_client.get_file_client(filesystem_name, file_path)

        processed_df = df.to_parquet(index=False)

        file_client.upload_data(data=processed_df,overwrite=True, length=len(processed_df))

        file_client.flush_data(len(processed_df))

        return True
    ```

* **Step 2:** Add the below code to create a function to hold any code relevant to loading relational data in our solution.

    ```python
    def load_relational_data(processed_df, datalake_service_client, filesystem_name, dir_name, file_format, file_prefix):
        now = datetime.today().strftime("%Y%m%d_%H%M%S")
        processed_filename = f'{file_prefix}_{now}.{file_format}'
        write_dataframe_to_datalake(processed_df, datalake_service_client, filesystem_name, dir_name, processed_filename)
        return True
    ```

## 4. Move processed source data file to Cool Tier Blob Storage

After loading data into the data lake, the source file is achieved to Azure Blob Storage. Data archiving is when data is identified no longer active, but requires retention.

Azure Blob Storage has a feature, Access Tiers, is the go-to solution for data archiving, because of ease of use and cost savings. There are three tiers: Hot, Cool, and Archive. The option used in this solution is 'Cool Tier', however based on your organization's needs, a better fit could be 'Archive Tier'.

Data moved to a cooler tier can be restored and accessed at any time. However, depending on the access tier chosen, the data rehydration time can vary.

For more information about Access Tiers to help with your decision, see the [Hot, cool, archive access tiers for blob data](/azure/storage/blobs/access-tiers-overview) article.

* **Step 1:** Add the below helper function to the *demo_relational_data_cloudetl* function to archive the processed source file.

    ```python
    def archive_cooltier_blob_file(blob_service_client, storage_account_url, source_container, archive_container, blob_list):

        for blob in blob_list:
            blob_name = blob.name
            source_blob_url = f'{storage_account_url}{source_container}/{blob_name}'

            # Copy source blob file to archive container and change blob access tier to 'Cool'
            archive_blob_client = blob_service_client.get_blob_client(archive_container, blob_name)
            archive_blob_client.start_copy_from_url(source_url=source_blob_url, standard_blob_tier=StandardBlobTier.Cool)
            (blob_service_client.get_blob_client(source_container, blob_name)).delete_blob(delete_snapshots='include')

        return True
    ```

* **Step 2:** Add the below code to the *demo_relational_data_cloudetl* function to integrate data archiving to the overall Cloud ETL run.

    ```python
    def run_cloud_etl(service_client, storage_account_url, source_container, archive_container, source_container_client, blob_file_list, columns, groupby_columns, datalake_service_client, filesystem_name, dir_name, file_format, file_prefix):
        df = ingest_relational_data(source_container_client, blob_file_list)
        df = process_relational_data(df, columns, groupby_columns)
        result = load_relational_data(df, datalake_service_client, filesystem_name, dir_name, file_format, file_prefix)
        result = archive_cooltier_blob_file(service_client, storage_account_url, source_container, archive_container, blob_file_list)

        return result
    ```

## 5. Final Serverless, Cloud ETL Solution

Congratulations, you've reached the end of this series! Below is the complete Azure Function App python code for your reference.

```python
import logging
import os
import pandas as pd
import pyarrow
import fastparquet
from io import StringIO
from datetime import datetime, timedelta

import azure.functions as func
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, StandardBlobTier
from azure.storage.filedatalake import DataLakeServiceClient

def return_blob_files(container_client, arg_date, std_date_format):
    start_date = datetime.strptime(arg_date, std_date_format).date() - timedelta(days=1)

    blob_files = [blob for blob in container_client.list_blobs() if blob.creation_time.date() >= start_date]

    return blob_files

def read_csv_to_dataframe(container_client, filename, file_delimiter= ','):
    blob_client = container_client.get_blob_client(blob=filename)

    # Retrieve extract blob file
    blob_download = blob_client.download_blob()

    # Read blob file into DataFrame
    blob_data = StringIO(blob_download.content_as_text())
    df = pd.read_csv(blob_data,delimiter=file_delimiter)
    return df

def write_dataframe_to_datalake(df, datalake_service_client, filesystem_name, dir_name, filename):

    file_path = f'{dir_name}/{filename}'

    file_client = datalake_service_client.get_file_client(filesystem_name, file_path)

    processed_df = df.to_parquet(index=False)

    file_client.upload_data(data=processed_df,overwrite=True, length=len(processed_df))

    file_client.flush_data(len(processed_df))

    return True

def archive_cooltier_blob_file(blob_service_client, storage_account_url, source_container, archive_container, blob_list):

    for blob in blob_list:
        blob_name = blob.name
        source_blob_url = f'{storage_account_url}{source_container}/{blob_name}'

        # Copy source blob file to archive container and change blob access tier to 'Cool'
        archive_blob_client = blob_service_client.get_blob_client(archive_container, blob_name)

        archive_blob_client.start_copy_from_url(source_url=source_blob_url, standard_blob_tier=StandardBlobTier.Cool)

        (blob_service_client.get_blob_client(source_container, blob_name)).delete_blob(delete_snapshots='include')

    return True

def ingest_relational_data(container_client, blob_file_list):
    df = pd.concat([read_csv_to_dataframe(container_client=container_client, filename=blob_name.name) for blob_name in blob_file_list], ignore_index=True)

    return df

def process_relational_data(df, columns, groupby_columns):
    # Remove leading and trailing whitespace in df column names
    processed_df = df.rename(columns=lambda x: x.strip())

    # Filter DataFrame (df) columns
    processed_df = processed_df.loc[:, columns]

    # Clean column names for easy consumption
    processed_df.columns = processed_df.columns.str.strip()
    processed_df.columns = processed_df.columns.str.lower()
    processed_df.columns = processed_df.columns.str.replace(' ', '_')
    processed_df.columns = processed_df.columns.str.replace('(', '')
    processed_df.columns = processed_df.columns.str.replace(')', '')

    # Filter out all empty rows, if they exist.
    processed_df.dropna(inplace=True)

    # Remove leading and trailing whitespace for all string values in df
    df_obj_cols = processed_df.select_dtypes(['object'])
    processed_df[df_obj_cols.columns] = df_obj_cols.apply(lambda x: x.str.strip())

    # Convert column to datetime: attempt to infer date format, return NA where conversion fails.
    processed_df['date'] = pd.to_datetime( processed_df['date'], infer_datetime_format=True, errors='coerce')

    # Convert object/string to numeric and handle special characters for each currency column
    processed_df['gross_sales'] = processed_df['gross_sales'].replace({'\$': '', ',': ''}, regex=True).astype(float)

    # Capture dateparts (year and month) in new DataFrame columns
    processed_df['sale_year'] = pd.DatetimeIndex(processed_df['date']).year
    processed_df['sale_month'] = pd.DatetimeIndex(processed_df['date']).month

    # Get Gross Sales per Segment, Country, Sale Year, and Sale Month
    processed_df = processed_df.sort_values(by=['sale_year', 'sale_month']).groupby(groupby_columns, as_index=False).agg(total_units_sold=('units_sold', sum), total_gross_sales=('gross_sales', sum))

    return processed_df

def load_relational_data(processed_df, datalake_service_client, filesystem_name, dir_name, file_format, file_prefix):
    now = datetime.today().strftime("%Y%m%d_%H%M%S")
    processed_filename = f'{file_prefix}_{now}.{file_format}'
    write_dataframe_to_datalake(processed_df, datalake_service_client, filesystem_name, dir_name, processed_filename)
    return True

def run_cloud_etl(service_client, storage_account_url, source_container, archive_container, source_container_client, blob_file_list, columns, groupby_columns, datalake_service_client, filesystem_name, dir_name, file_format, file_prefix):
    df = ingest_relational_data(source_container_client, blob_file_list)
    df = process_relational_data(df, columns, groupby_columns)
    result = load_relational_data(df, datalake_service_client, filesystem_name, dir_name, file_format, file_prefix)
    result = archive_cooltier_blob_file(service_client, storage_account_url, source_container, archive_container, blob_file_list)

    return result

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # Parameters/Configurations
    arg_date = '2014-07-01'
    std_date_format = '%Y-%m-%d'
    processed_file_format = 'parquet'
    processed_file_prefix = 'financial_demo'

    # List of columns relevant for analysis
    cols = ['Segment', 'Country', 'Units Sold', 'Gross Sales', 'Date']

    # List of columns to aggregate
    groupby_cols = ['segment', 'country', 'sale_year', 'sale_month']

    try:
        # Set variables from appsettings configurations/Environment Variables.
        key_vault_name = os.environ["KEY_VAULT_NAME"]
        key_vault_Uri = f"https://{key_vault_name}.vault.azure.net"
        blob_secret_name = os.environ["ABS_SECRET_NAME"]

        abs_acct_name='stcloudetldemodata'
        abs_acct_url=f'https://{abs_acct_name}.blob.core.windows.net/'
        abs_container_name='demo-cloudetl-data'
        archive_container_name = 'demo-cloudetl-archive'

        adls_acct_name='dlscloudetldemo'
        adls_acct_url = f'https://{adls_acct_name}.dfs.core.windows.net/'
        adls_fsys_name='processed-data-demo'
        adls_dir_name='finance_data'
        adls_secret_name='adls-access-key1'

        # Authenticate and securely retrieve Key Vault secret for access key value.
        az_credential = DefaultAzureCredential()
        secret_client = SecretClient(vault_url=key_vault_Uri, credential= az_credential)
        access_key_secret = secret_client.get_secret(blob_secret_name)

        # Initialize Azure Service SDK Clients
        abs_service_client = BlobServiceClient(
            account_url = abs_acct_url,
            credential = az_credential
        )

        abs_container_client = abs_service_client.get_container_client(container=abs_container_name)

        adls_service_client = DataLakeServiceClient(
            account_url = adls_acct_url,
            credential = az_credential
        )

        # Run ETL Application
        process_file_list = return_blob_files(
            container_client = abs_container_client,
            arg_date = arg_date,
            std_date_format = std_date_format
        )

        run_cloud_etl(
            source_container_client = abs_container_client,
            blob_file_list = process_file_list,
            columns = cols,
            groupby_columns = groupby_cols,
            datalake_service_client = adls_service_client,
            filesystem_name = adls_fsys_name,
            dir_name = adls_dir_name,
            file_format = processed_file_format,
            file_prefix = processed_file_prefix,
            service_client = abs_service_client,
            storage_account_url = abs_acct_url,
            source_container = abs_container_name,
            archive_container = archive_container_name
        )

    except Exception as e:
        logging.info(e)

        return func.HttpResponse(
                f"!! This HTTP triggered function executed unsuccessfully. \n\t {e} ",
                status_code=200
        )

    return func.HttpResponse("This HTTP triggered function executed successfully.")
```

## 6. Deploy solution to Azure

Now that the code is complete for this series deploy the local function project to the Azure Function App created earlier in this article.

* **Step 1:** Use the [Azure Functions Core Tools](/azure/azure-functions/functions-run-local) again to deploy your local functions project to Azure by running [func Azure functionapp publish](/azure/azure-functions/functions-run-local#project-file-deployment).

    ```console
    func azure functionapp publish CloudETLDemo
    ```

* **Step 2:** To invoke the HTTP Trigger function in Azure, make an HTTP request using the function URL in a browser or with a tool like 'curl'.

    Copy the complete **Invoke URL** shown in the output of the publish command into a browser address bar, appending the query parameter `&name=Functions`. The browser should display similar output as when you ran the function locally.

    ```browser
        https://msdocs-azurefunctions.azurewebsites.net/api/demo_relational_data_cloudetl?name=Functions
    ```

    or

    Run ['curl'](https://curl.haxx.se/) with the **Invoke URL**, appending the parameter `&name=Functions`. The output of the command should be the text, "Hello Functions."

    ```console
    curl -s "https://msdocs-azurefunctions.azurewebsites.net/api/demo_relational_data_cloudetl?name=Functions"
    ```

## 7. Clean up resources

When no longer needed, remove the resource group, and all related resources:

Run *[az group delete](/cli/azure/group)* to delete the Azure Resource Group.

```azurecli
az group delete --name 'rg-cloudetl-demo'
```
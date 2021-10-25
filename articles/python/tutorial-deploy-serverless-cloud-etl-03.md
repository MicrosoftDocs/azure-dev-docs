---
title: Securely ingest Azure Blob Storage data using Azure Key Vault with a Python Azure Function
description: Learn how to retrieve a secret from Azure Key Vault to access Azure Storage Blob, using a serverless Python Azure Function.
services: python, azure-functions, azure-key-vault, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.prod: azure-python
author: jess-johnson-msft
ms.author: jejohn
ms.date: 10/02/2021
---
# Ingest data from Azure Blob Storage using a Python Azure Function and Azure Key Vault

 In this article, you'll learn how to retrieve a secret from a Key Vault to securely access Azure Storage Blob data using a serverless Python Function.

![Ingest Relational Data diagram](media\serverless-cloudetl\serverless_cloudetl_architecture_03.svg)

 The data needed for analytics is typically gathered from various disparate data sources. **Data ingestion** is the process of *extracting* data from these data sources into a data store and is the first step of an Extract, Transform, and Load (ETL) solution. There are two types of data ingestion: *Batch Processing* and *Streaming*. Batch processing is when a large amount of data is processed simultaneously, with subprocesses executing simultaneously in sequential order. This article focuses on *batch processing* using a serverless Python Function to retrieve data securely from Azure Blob Storage using Azure Key Vault.

## Prerequisites

This article assumes you have set up your environment as described in the previous articles:

* [Configure your local Python dev environment for Azure](./configure-local-development-environment.md)
* [Create resources](tutorial-deploy-serverless-cloud-etl-02.md)

>[!TIP]
>Capture the below information from the previous article to use later in this article:
>
>* Azure Blob Storage Account name
>* Azure Blob Container name
>* Azure Key Vault name
>* Sample Data Filename

## 1. Install required Python Azure SDK libraries

Open the *requirements.txt* file created in the [previous article](tutorial-deploy-serverless-cloud-etl-02.md) and complete the following steps.

* **Step 1:** Create and activate Python virtual environment.

    ```bash
    # Create Python virtual environment
    # [NOTE] On Windows, use py -3 -m venv .venv
    python3 -m venv .venv

    # Activate Python virtual environment
    source .venv/bin/activate
    ```

* **Step 2:** Review the file contents and ensure the following Python Azure SDK libraries are listed:

    ```txt
    azure-identity
    azure-storage-blob
    azure-keyvault-secrets
    azure-functions
    pandas
    ```

* **Step 3:** In a terminal, with a virtual environment activated, run the '*pip install*' command to install the required libraries.

    ```terminal
    pip install -r requirements.txt
    ```

## 2. Retrieve Key Vault secret in the Function

Storing secrets in an Azure Key Vault, rather than storing sensitive data in plain text, improves the security of your sensitive information.

The Python Azure SDK key vault secret client library provides secret management. This code creates the client object and retrieves the secret value for the Azure Blob Storage Account.

* **Step 1:** Open the 'local.setting.json' file and add Environment Variable values for local development.

    Run the ```printenv``` command if you need to retrieve the Environment Variable values.

    ```bash
    printenv ABS_SECRET_NAME
    printenv ADLS_SECRET_NAME
    printenv KEY_VAULT_NAME
    ```

* **Step 2:** Open the '_init_.py' class file of the *demo_relational_data_cloudetl* function and add the below code.

    ```python
    import logging
    import os
    import azure.functions as func
    from azure.keyvault.secrets import SecretClient
    from azure.identity import DefaultAzureCredential

    def main(req: func.HttpRequest) -> func.HttpResponse:
        logging.info('Python HTTP trigger function processed a request.')

        # Parameters/Configurations
        abs_acct_name='stcloudetldemodata'
        abs_acct_url=f'https://{abs_acct_name}.blob.core.windows.net/'
        abs_container_name='demo-cloudetl-data'

        try:
            # Set variables from appsettings configurations/Environment Variables.
            key_vault_name = os.environ["KEY_VAULT_NAME"]
            key_vault_Uri = f"https://{key_vault_name}.vault.azure.net"
            blob_secret_name = os.environ["ABS_SECRET_NAME"]

            # Authenticate and securely retrieve Key Vault secret for access key value.
            az_credential = DefaultAzureCredential()
            secret_client = SecretClient(vault_url=key_vault_Uri, credential= az_credential)
            access_key_secret = secret_client.get_secret(blob_secret_name)

        except Exception as e:
            logging.info(e)
            return func.HttpResponse(
                    f"!! This HTTP triggered function executed unsuccessfully. \n\t {e} ",
                    status_code=200
                )

        return func.HttpResponse("This HTTP triggered function executed successfully.")
    ```

>[!NOTE]
>In this example, the logged-in user is used to authenticate to Key Vault, which is the preferred method for local development. A managed identity must be assigned to an App Service or Virtual Machine for applications deployed to Azure. For more information, see [Managed Identity Overview](/azure/active-directory/managed-identities-azure-resources/overview).

## 3. Ingest data from Azure Blob Storage with a serverless Function

Extract, Transform, and Load (ETL) is a popular approach used in data processing solutions. In ETL solutions, extracted data from one or more source systems. Then data is transformed into a 'staging' area, and loaded into a data store. The polished data can then be consumed by analytic tools, such as a data warehouse or data lake.

* **Step 1:** Modify the code of your existing '_init_.py' class file to begin the ETL process. This function will securely *extract* raw data from blob storage into your serverless Azure Function.

    ```python
    import logging
    import os
    import azure.functions as func
    from azure.keyvault.secrets import SecretClient
    from azure.identity import DefaultAzureCredential

    def main(req: func.HttpRequest) -> func.HttpResponse:
        logging.info('Python HTTP trigger function processed a request.')

        # Parameters/Configurations
        abs_acct_name='stcloudetldemodata'
        abs_acct_url=f'https://{abs_acct_name}.blob.core.windows.net/'
        abs_container_name='demo-cloudetl-data'

        try:
            # Set variables from appsettings configurations/Environment Variables.
            key_vault_name = os.environ["KEY_VAULT_NAME"]
            key_vault_Uri = f"https://{key_vault_name}.vault.azure.net"
            blob_secret_name = os.environ["ABS_SECRET_NAME"]

            # Authenticate and securely retrieve Key Vault secret for access key value.
            az_credential = DefaultAzureCredential()
            secret_client = SecretClient(vault_url=key_vault_Uri, credential= az_credential)
            access_key_secret = secret_client.get_secret(blob_secret_name)

        except Exception as e:
            logging.info(e)
            return func.HttpResponse(
                    f"!! This HTTP triggered function executed unsuccessfully. \n\t {e} ",
                    status_code=200
                )

        return func.HttpResponse("This HTTP triggered function executed successfully.")
    ```

* **Step 2:** Open the '_init_.py' class file of the *demo_relational_data_cloudetl* function. Then add the below code to gather a list of blobs.

    ```python
    import logging
    import os
    from io import StringIO
    import pandas as pd
    from datetime import datetime, timedelta

    import azure.functions as func
    from azure.keyvault.secrets import SecretClient
    from azure.identity import DefaultAzureCredential
    from azure.storage.blob import BlobServiceClient

    def return_blob_files(container_client, arg_date, std_date_format):
        start_date = datetime.strptime(arg_date, std_date_format).date() - timedelta(days=1)

        blob_files = [blob for blob in container_client.list_blobs() if blob.creation_time.date() >= start_date]

        return blob_files

    def main(req: func.HttpRequest) -> func.HttpResponse:
        logging.info('Python HTTP trigger function processed a request.')

        # Parameters/Configurations
        arg_date = '2014-07-01'
        std_date_format = '%Y-%m-%d'

        abs_acct_name='stcloudetldemodata'
        abs_acct_url=f'https://{abs_acct_name}.blob.core.windows.net/'
        abs_container_name='demo-cloudetl-data'

        try:
            # Set variables from appsettings configurations/Environment Variables.
            key_vault_name = os.environ["KEY_VAULT_NAME"]
            key_vault_Uri = f"https://{key_vault_name}.vault.azure.net"
            blob_secret_name = os.environ["ABS_SECRET_NAME"]

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

            # Run ETL Application
            process_file_list = return_blob_files(
                container_client = abs_container_client,
                arg_date = arg_date,
                std_date_format = std_date_format
            )

        except Exception as e:
            logging.info(e)

            return func.HttpResponse(
                    f"!! This HTTP triggered function executed unsuccessfully. \n\t {e} ",
                    status_code=200
            )

        return func.HttpResponse("This HTTP triggered function executed successfully.")
    ```

* **Step 3:** Open the '_init_.py' class file of the *demo_relational_data_cloudetl* function and add the below code to ingest data into a Pandas DataFrame.

    ```python
    import logging
    import os
    from io import StringIO
    import pandas as pd
    from datetime import datetime, timedelta

    import azure.functions as func
    from azure.keyvault.secrets import SecretClient
    from azure.identity import DefaultAzureCredential
    from azure.storage.blob import BlobServiceClient

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

    def ingest_relational_data(container_client, blob_file_list):
        df = pd.concat([read_csv_to_dataframe(container_client=container_client, filename=blob_name.name) for blob_name in blob_file_list], ignore_index=True)

        return df

    def run_cloud_etl(source_container_client, blob_file_list):
        df = ingest_relational_data(source_container_client, blob_file_list)

        # Check the blob file data
        logging.info(df.head(5))

        return True

    def main(req: func.HttpRequest) -> func.HttpResponse:
        logging.info('Python HTTP trigger function processed a request.')

        # Parameters/Configurations
        arg_date = '2014-07-01'
        std_date_format = '%Y-%m-%d'

        abs_acct_name='stcloudetldemodata'
        abs_acct_url=f'https://{abs_acct_name}.blob.core.windows.net/'
        abs_container_name='demo-cloudetl-data'

        try:
            # Set variables from appsettings configurations/Environment Variables.
            key_vault_name = os.environ["KEY_VAULT_NAME"]
            key_vault_Uri = f"https://{key_vault_name}.vault.azure.net"
            blob_secret_name = os.environ["ABS_SECRET_NAME"]

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

            # Run ETL Application
            process_file_list = return_blob_files(
                container_client = abs_container_client,
                arg_date = arg_date,
                std_date_format = std_date_format
            )

            run_cloud_etl(
                source_container_client = abs_container_client,
                blob_file_list= process_file_list
            )

        except Exception as e:
            logging.info(e)

            return func.HttpResponse(
                    f"!! This HTTP triggered function executed unsuccessfully. \n\t {e} ",
                    status_code=200
            )

        return func.HttpResponse("This HTTP triggered function executed successfully.")
    ```

* **Step 4:** Execute the function locally and review the execution log to ensure the output is correct.

    ```console
        Segment     Country  Product    Units Sold  Manufacturing Price  Sale Price   Gross Sales   Date
    0   Government  Canada   Carretera  1618.5      $3.00                $20.00       "$32,370.00"  1/1/2014
    1   Government  Germany  Carretera  1321        $3.00                $20.00       "$26,420.00"  1/1/2014
    2   Midmarket   France   Carretera  2178        $3.00                $15.00       "$32,670.00"  6/1/2014
    3   Midmarket   Germany  Carretera  888         $3.00                $15.00       "$13,320.00"  6/1/2014
    4   Midmarket   Mexico   Carretera  2470        $3.00                $15.00       "$37,050.00"  6/1/2014
    ```

## 4. Deploy ingest Function to Azure

Now that the code is complete for this article deploy the local function project to the Azure Function App created earlier in this article.

* **Step 1:** Use the [Azure Functions Core Tools](/azure/azure-functions/functions-run-local) again to deploy your local functions project to Azure by running [func Azure functionapp publish](/azure/azure-functions/functions-run-local#project-file-deployment).

    ```console
    func azure functionapp publish CloudETLDemo
    ```

* **Step 2:** Add environment variables to the Azure App Config Setting within the Azure portal.

    ```azurecli
    # Update function app's settings to include Azure Key Vault environment variable.
    az functionapp config appsettings set --name CloudETLDemo --resource-group rg-cloudetl-demo --settings "KEY_VAULT_NAME=kv-cloudetl-demo"

    # Update function app's settings to include Azure Blob Storage Access Key in Azure Key Vault secret environment variable.
    az functionapp config appsettings set --name CloudETLDemo --resource-group rg-cloudetl-demo --settings  "ABS_SECRET_NAME=abs-access-key1"
    ```

* **Step 3:** To invoke the HTTP Trigger function in Azure, make an HTTP request using the function URL in a browser or with a tool like 'curl'.

    Copy the complete **Invoke URL** shown in the output of the publish command into a browser address bar, appending the query parameter `&name=Functions`. The browser should display similar output as when you ran the function locally.

    ```browser
        https://msdocs-azurefunctions.azurewebsites.net/api/demo_relational_data_cloudetl?name=Functions
    ```

    or

    Run ['curl'](https://curl.haxx.se/) with the **Invoke URL**, appending the parameter `&name=Functions`. The output of the command should be the text, "Hello Functions."

    ```console
    curl -s "https://msdocs-azurefunctions.azurewebsites.net/api/demo_relational_data_cloudetl?name=Functions"
    ```

## Next Step

> [!div class="nextstepaction"]
> [Next: Process relational data for analytics >>>](tutorial-deploy-serverless-cloud-etl-04.md)
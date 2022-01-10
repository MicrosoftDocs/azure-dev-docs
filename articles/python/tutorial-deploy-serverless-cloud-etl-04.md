---
title: Transform relational data with Pandas and Azure Function Apps
description: Learn to use the Pandas library in a serverless Python Azure Function for data processing and building an Azure Data Lake.
services: python, azure-functions, azure-key-vault, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.prod: azure-python
author: jess-johnson-msft
ms.author: jejohn
ms.date: 10/04/2021
---
# Transform relational data with Pandas and Azure Function Apps

In this article, you'll use the [Pandas Python library](https://pandas.pydata.org/) in a serverless function to prepare relational data and start to build out a data lake.

![Relational Data Processing diagram](media\serverless-cloudetl\serverless_cloudetl_architecture_04.svg)

The 'Transform' stage handles data cleansing, validation, and business logic implementation required for later analysis.

Some essential tasks are to compile, convert, reformat, validate, and cleanse the data in a 'staging' or 'data landing zone' before loading it into the targeted analytic data store.

Source data is often captured in a format not ideal for data analytics. That's why, the data must be cleansed and manipulated to address any data issues. By taking this step, you increase the integrity of your data, leading to insights of higher quality.

There are different kinds of data problems that can occur in any data processing pipeline. This article addresses a few common problems and provides solutions using the Python [Pandas](https://pandas.pydata.org/) library.

## Prerequisites

If you haven't already, **follow all the instructions** and complete the following articles to set up your local and Azure dev environment:

* [Configure your local Python dev environment for Azure](./configure-local-development-environment.md)
* [Create resources](tutorial-deploy-serverless-cloud-etl-02.md)
* [Ingest relational data](tutorial-deploy-serverless-cloud-etl-03.md)

## 1. Install required Python Azure SDK libraries

Open and review the *requirements.txt* file contents and make sure the following Python Azure SDK libraries exist:

```txt
azure-identity
azure-storage-blob
azure-keyvault-secrets
azure-functions
pandas
```

In a terminal or command prompt with a virtual environment activated, run the '*pip install*' command to install the required libraries.

```cmd
pip install -r requirements.txt
```

>[!IMPORTANT]
> Be sure to capture the following information for this article:
>
> * Azure Resource Group Name
> * Azure Blob Storage Account Name
> * Azure Key Vault URL
>
> Also, activate the local virtual environment created in previous articles for this project.

## 2. Cleaning relational data with Python

 Cleansing a dataset can include jobs to sort, filter, deduplicate, rename, and map data. Using [Pandas library](https://pandas.pydata.org/) helps simplify any repetitive, time-consuming tasks associated with working with the data.

* **Step 1:** Open the '_init_.py' class file of the *demo_relational_data_cloudetl* function and add the below code to reformat the column names.

    ```python
    def process_relational_data(df):
        # Remove leading and trailing whitespace in df column names
        processed_df = df.rename(columns=lambda x: x.strip())

        # Clean column names for easy consumption
        processed_df.columns = processed_df.columns.str.strip()
        processed_df.columns = processed_df.columns.str.lower()
        processed_df.columns = processed_df.columns.str.replace(' ', '_')
        processed_df.columns = processed_df.columns.str.replace('(', '')
        processed_df.columns = processed_df.columns.str.replace(')', '')

        return processed_df
    ```

* **Step 2:** Add the below code to filter out the unneeded columns from the DataFrame.

    ```python
    def process_relational_data(df, columns):
        # Remove leading and trailing whitespace in df column names
        processed_df = df.rename(columns=lambda x: x.strip())

        # Filter DataFrame (df) columns
        processed_df = processed_df.loc[:, columns]

        # Filter out all empty rows, if they exist.
        processed_df.dropna(inplace=True)

        # Clean column names for easy consumption
        processed_df.columns = processed_df.columns.str.strip()
        processed_df.columns = processed_df.columns.str.lower()
        processed_df.columns = processed_df.columns.str.replace(' ', '_')
        processed_df.columns = processed_df.columns.str.replace('(', '')
        processed_df.columns = processed_df.columns.str.replace(')', '')

        return processed_df
    ```

* **Step 3:** Add the below code to clean the column values in the DataFrame.

    ```python
    def process_relational_data(df, columns):
        # Remove leading and trailing whitespace in df column names
        processed_df = df.rename(columns=lambda x: x.strip())

        # Clean column names for easy consumption
        processed_df.columns = processed_df.columns.str.strip()
        processed_df.columns = processed_df.columns.str.lower()
        processed_df.columns = processed_df.columns.str.replace(' ', '_')
        processed_df.columns = processed_df.columns.str.replace('(', '')
        processed_df.columns = processed_df.columns.str.replace(')', '')

        # Filter DataFrame (df) columns
        processed_df = processed_df.loc[:, columns]

        # Filter out all empty rows, if they exist.
        processed_df.dropna(inplace=True)

        # Remove leading and trailing whitespace for all string values in df
        df_obj_cols = processed_df.select_dtypes(['object'])
        processed_df[df_obj_cols.columns] = df_obj_cols.apply(lambda x: x.str.strip())

        return processed_df
    ```

## 3. Standardize the data structure

The DataFrame schema must align with the schema of the target data store. Standardization or reformatting of the data is required if misalignment exists. For instance, currency and dates are two common fields in datasets that don't align with the target schema.

* **Step 1:** Add the below code to handle inconsistent date formatting.

    ```python
    def process_relational_data(df, columns):
        # Remove leading and trailing whitespace in df column names
        processed_df = df.rename(columns=lambda x: x.strip())

        # Clean column names for easy consumption
        processed_df.columns = processed_df.columns.str.strip()
        processed_df.columns = processed_df.columns.str.lower()
        processed_df.columns = processed_df.columns.str.replace(' ', '_')
        processed_df.columns = processed_df.columns.str.replace('(', '')
        processed_df.columns = processed_df.columns.str.replace(')', '')

        # Filter DataFrame (df) columns
        processed_df = processed_df.loc[:, columns]

        # Filter out all empty rows, if they exist.
        processed_df.dropna(inplace=True)

        # Remove leading and trailing whitespace for all string values in df
        df_obj_cols = processed_df.select_dtypes(['object'])
        processed_df[df_obj_cols.columns] = df_obj_cols.apply(lambda x: x.str.strip())

        # Convert column to datetime: attempt to infer date format, return NA where conversion fails.
        processed_df['date'] = pd.to_datetime( processed_df['date'], infer_datetime_format=True, errors='coerce')

        return processed_df
    ```

* **Step 2:** Add the below code to standardize the currency columns with special characters in the DataFrame.

    ```python
    def process_relational_data(df, columns):
        # Remove leading and trailing whitespace in df column names
        processed_df = df.rename(columns=lambda x: x.strip())

        # Clean column names for easy consumption
        processed_df.columns = processed_df.columns.str.strip()
        processed_df.columns = processed_df.columns.str.lower()
        processed_df.columns = processed_df.columns.str.replace(' ', '_')
        processed_df.columns = processed_df.columns.str.replace('(', '')
        processed_df.columns = processed_df.columns.str.replace(')', '')

        # Filter DataFrame (df) columns
        processed_df = processed_df.loc[:, columns]

        # Filter out all empty rows, if they exist.
        processed_df.dropna(inplace=True)

        # Remove leading and trailing whitespace for all string values in df
        df_obj_cols = processed_df.select_dtypes(['object'])
        processed_df[df_obj_cols.columns] = df_obj_cols.apply(lambda x: x.str.strip())

        # Convert column to datetime: attempt to infer date format, return NA where conversion fails.
        processed_df['date'] = pd.to_datetime( processed_df['date'], infer_datetime_format=True, errors='coerce')

        # Convert object/string to numeric and handle special characters for each currency column
        processed_df['gross_sales'] = processed_df['gross_sales'].replace({'\$': '', ',': ''}, regex=True).astype(float)

        return processed_df
    ```

## 4. Convert data to meet business requirements and logic

The data and DataFrame are now standardized and cleansed. Now, Convert data according to business requirements and logic.

* **Step 1:** Add year and month columns to the DataFrame for later analytic use.

    ```python
    def process_relational_data(df, columns):
        # Remove leading and trailing whitespace in df column names
        processed_df = df.rename(columns=lambda x: x.strip())

        # Clean column names for easy consumption
        processed_df.columns = processed_df.columns.str.strip()
        processed_df.columns = processed_df.columns.str.lower()
        processed_df.columns = processed_df.columns.str.replace(' ', '_')
        processed_df.columns = processed_df.columns.str.replace('(', '')
        processed_df.columns = processed_df.columns.str.replace(')', '')

        # Filter DataFrame (df) columns
        processed_df = processed_df.loc[:, columns]

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

        return processed_df
    ```

* **Step 2:** Add the below code to the *demo_relational_data_cloudetl* function to aggregate the DataFrame based on the business requirements.

    ```python
    def process_relational_data(df, columns, groupby_columns):
        # Remove leading and trailing whitespace in df column names
        processed_df = df.rename(columns=lambda x: x.strip())

        # Clean column names for easy consumption
        processed_df.columns = processed_df.columns.str.strip()
        processed_df.columns = processed_df.columns.str.lower()
        processed_df.columns = processed_df.columns.str.replace(' ', '_')
        processed_df.columns = processed_df.columns.str.replace('(', '')
        processed_df.columns = processed_df.columns.str.replace(')', '')

        # Filter DataFrame (df) columns
        processed_df = processed_df.loc[:, columns]

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
    ```

## 5. Add data processing to the solution

Now add this new functionality to the overall solution by modifying the '*main*' and '*run_cloud_etl*' functions.

* **Step 1:** Add the below code to integrate the data processing functionality into the overall Cloud ETL solution.

    ```python
    def run_cloud_etl(service_client, storage_account_url, source_container, archive_container, source_container_client, blob_file_list, columns, groupby_columns):
        df = ingest_relational_data(source_container_client, blob_file_list)
        df = process_relational_data(df, columns, groupby_columns)

        return True
    ```

* **Step 2:** Add the below code to the *demo_relational_data_cloudetl* function to integrate data processing to the overall Cloud ETL solution.

    ```python
    def main(req: func.HttpRequest) -> func.HttpResponse:
        logging.info('Python HTTP trigger function processed a request.')

        # Parameters/Configurations
        arg_date = '2014-07-01'
        std_date_format = '%Y-%m-%d'

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
                blob_file_list = process_file_list,
                columns = cols,
                groupby_columns = groupby_cols,
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

## 6. Deploy Azure Function App

Now that the code is complete for this article, deploy the local function project to the Azure Function App created earlier.

* **Step 1:** Use the [Azure Functions Core Tools](/azure/azure-functions/functions-run-local) again to deploy your local functions project to Azure by running [func Azure functionapp publish](/azure/azure-functions/functions-run-local#project-file-deployment).

    ```console
    func azure functionapp publish <APP_NAME>
    ```

* **Step 2:** To invoke the HTTP Trigger function in Azure, make an HTTP request using the function URL in a browser or with a tool like 'curl'.

    Copy the complete **Invoke URL** shown in the output of the publish command into a browser address bar, appending the query parameter `&name=Functions`. The browser should display a similar outcome as when you ran the function locally.

    ```browser
        https://msdocs-azurefunctions.azurewebsites.net/api/ingest_relational_data?name=Functions
    ```

    or

    Run ['curl'](https://curl.haxx.se/) with the **Invoke URL**, appending the parameter `&name=Functions`. The output of the command should be the text, "Hello Functions."

    ```console
    curl -s "https://msdocs-azurefunctions.azurewebsites.net/api/ingest_relational_data?name=Functions"
    ```

## Next Step

> [!div class="nextstepaction"]
> [Next: Load and archive processed relational data >>>](tutorial-deploy-serverless-cloud-etl-05.md)
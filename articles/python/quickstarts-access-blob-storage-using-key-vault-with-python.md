---
title: Access Azure Blob Storage using Azure Key Vault with a Python function
description: Learn how to retrieve a secret from Azure Key Vault to access Azure Storage Blob, using a serverless Python function.
services: python, azure-functions, azure-key-vault, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurepowershell, devx-track-azurecli
ms.devlang: python
ms.topic: quickstart
ms.prod: azure-python
author: jess-johnson-msft
ms.author: jejohn
ms.date: 07/29/2021
---
# Quickstart: Access Azure Blob Storage using Azure Key Vault with a Python function

In this quickstart, you'll learn how to retrieve a secret from Azure Key Vault to access Azure Storage Blob, using a serverless Python function.

![Relational Data Ingestion - Securely Extract Data diagram.](./media/quickstart-securely-retrieve-blob-data/qs_akv_asb_fun-INGESTION-Simplified.svg)

## Prerequisites

* An active Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* [Azure CLI](/cli/azure/install-azure-cli) or [PowerShell 7](/powershell/scripting/install/installing-powershell-core-on-windows)
* The [Azure Functions Core Tools](/azure/azure-functions/functions-run-local) version 3.x.
* [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
* The [PowerShell extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell).
* The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.
* [Python 2.7+ or 3.6+](/azure/developer/python/configure-local-development-environment) is required and the following packages:
  * azure-storage-blob `pip install azure-storage-blob`
  * azure-identity `pip install azure-identity`
  * azure-keyvault-keys `pip install azure-keyvault-secrets`

This quickstart assumes the following Azure Resources have **already been provisioned**:

* Azure Active Directory (Azure AD)
* Azure Storage Account, to create a new storage account you can use the [Azure portal](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal), [Azure PowerShell](/azure/storage/common/storage-quickstart-create-account?tabs=azure-powershell), or [Azure CLI](/azure/storage/common/storage-quickstart-create-account?tabs=azure-cli)
* Azure KeyVault, to create a new key vault you can use the [Azure portal](/azure/key-vault/keys/quick-create-portal), [PowerShell](/azure/key-vault/keys/quick-create-powershell), or [Azure CLI](/azure/key-vault/keys/quick-create-cli)
* HTTP Trigger or Blob Trigger Azure Function App, to create a new function you can use the [Visual Studio Code](/azure/azure-functions/create-first-function-vs-code-python), [Azure PowerShell](/azure/azure-functions/create-first-function-vs-code-powershell), or [Azure CLI](/azure/azure-functions/create-first-function-cli-python)

## 1. Upload a CSV to a blob container

To ingest relational data using a serverless Python Azure Function downstream, a data (blob) needs to be uploaded to an Azure Storage container. If you already have you data (blob) uploaded to an Azure Storage container, you can skip to the next section.

Create a file named '*financial_sample.csv*' locally that contains this data.

|Segment|Country|Product|Units Sold|Manufacturing Price|Sale Price|Gross Sales|Date|
|----|----|----|----|----|----|----|----|
|Government|Canada|Carretera|1618.5|$3.00|$20.00|$32,370.00|1/1/2014|
|Government|Germany|Carretera|1321|$3.00|$20.00|$26,420.00|1/1/2014|
|Midmarket|France|Carretera|2178|$3.00|$15.00|$32,670.00|6/1/2014|
|Midmarket|Germany|Carretera|888|$3.00|$15.00|$13,320.00|6/1/2014|
|Midmarket|Mexico|Carretera|2470|$3.00|$15.00|$37,050.00|6/1/2014|

Copy the below data into the file:

```csv
Segment,Country,Product,Units Sold,Manufacturing Price,Sale Price,Gross Sales,Date
Government,Canada,Carretera,1618.5,$3.00,$20.00,"$32,370.00",1/1/2014
Government,Germany,Carretera,1321,$3.00,$20.00,"$26,420.00",1/1/2014
Midmarket,France,Carretera,2178,$3.00,$15.00,"$32,670.00",6/1/2014
Midmarket,Germany,Carretera,888,$3.00,$15.00,"$13,320.00",6/1/2014
Midmarket,Mexico,Carretera,2470,$3.00,$15.00,"$37,050.00",6/1/2014
```

Run the following code from your favorite IDE to upload your data (blob) to the storage container (We recommend [VSCode](https://code.visualstudio.com/)).

### [PowerShell](#tab/azure-powershell)

```powershell
Set-AzStorageBlobContent -File "<file-path>" -Container "<container-name>" -Blob "financial_sample.csv" -Context "<storage-account-context>" 
```

### [Azure CLI](#tab/azure-cli)

```azurecli
az storage blob upload --account-name "<storage-account>" --container-name "<container>" --name "financial_sample" --file "financial_sample.csv" --auth-mode login
```

* * *

## 2. Set a secret to the blob access key

Create a 'secret' in Azure Key Vault to store the storage account access key.

Run the following code from your favorite IDE to create a secret to store the access key.

### [PowerShell](#tab/azure-powershell)

``` powershell
Set-AzKeyVaultSecret -VaultName "<keyvault-name>" -Name "BlobAccessKey" -SecretValue "<secret-value>"
```

### [Azure CLI](#tab/azure-cli)

``` azurecli
az keyvault secret set --vault-name "<keyvault-name>" --name "BlobAccessKey" --value "<secret-value>"
```

* * *

>[!IMPORTANT]
>A common approach for storing sensitive information is to remove the data from the application code, and into a 'config.json' file. However, this practice still stores the sensitive information in plain text. We recommend instead using [Azure Key Vault](https://azure.microsoft.com/services/key-vault/). Azure Key Vault is a secure centralized cloud solution for storing and managing sensitive information, such as passwords, certificates, and keys.

## 3. Configure access between Azure Storage Account and Azure Key Vault

Now, you need to authorize access for Azure Key Vault to your Azure Storage Account to manage your storage account access key.

Run the following code from your favorite IDE to configure access between the storage account and keyvault.

### [PowerShell](#tab/azure-powershell)

```powershell
$regenPeriod = [System.Timespan]::FromDays(30)

# Assign Azure role "Storage Account Key Operator Service Role" to Key Vault, limiting the access scope to your storage account
New-AzRoleAssignment -ApplicationId "<your-function-app-id>" -RoleDefinitionName "Storage Account Key Operator Service Role" -Scope "<storage-account-id>"

# Give your user account permission to managed storage accounts
Set-AzKeyVaultAccessPolicy -VaultName "<keyvault-name>" -UserPrincipalName "<user@domain.com>" -PermissionsToSecrets get,set,delete

# Add your storage account to your Key Vault's managed storage accounts
Add-AzKeyVaultManagedStorageAccount -VaultName "<keyvault-name>" -AccountName "<storage-account-name>" -AccountResourceId "<storage-account-id>" -ActiveKeyName "<key1>" -RegenerationPeriod $regenPeriod
```

### [Azure CLI](#tab/azure-cli)

```azurecli
# Assign Azure role "Storage Account Key Operator Service Role" to Key Vault, limiting the access scope to your storage account
az role assignment create --role "Storage Account Key Operator Service Role" --assignee 'https://vault.azure.net' --scope "/subscriptions/<subscription-id>/resourceGroups/<storage-account-resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"

# Give your user account permission to managed storage accounts
az keyvault set-policy --name "<keyvault-name>" --upn user@domain.com --storage-permissions get,set,delete

# Add your storage account to your Key Vault's managed storage accounts
az keyvault storage add --vault-name "<keyvault-name>" -n "<storage-account-name>" --active-key-name key1 --auto-regenerate-key --regeneration-period P90D --resource-id "/subscriptions/<subscription-id>/resourceGroups/<storage-account-resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"
```

* * *

## 4. Retrieve key vault secret in function

The storage access key is now securely stored in a centralized key vault. Now the secret value (blob access key) can be retrieved within the Azure Function.

Storing secrets in Azure Key Vault, rather than storing the sensitive data in plain text, improves the security of your sensitive information.

``` Python
import logging
import os
import azure.functions as func
from azure.storage.blob import BlobClient
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    storage_account_name = "<YOUR-STORAGE-ACCOUNT-NAME>"
    blob_container_name = "<YOUR-BLOB-CONTAINER-NAME>"
    storage_account_url = F"https://{storage_account_name}.blob.core.windows.net/"
    blob_csv_filename = "financial_sample.csv"

    try:
        key_vault_name = os.environ["AKV_NAME"]
        blob_secret_name = os.environ["AKVS_BLOB_ACCESS_KEY"]

         if key_vault_name:
            key_vault_Uri = f"https://{key_vault_name}.vault.azure.net"

            az_credential = DefaultAzureCredential()
            client = SecretClient(vault_url=key_vault_Uri, credential= az_credential)
            access_key_secret = client.get_secret(blob_secret_name)
```

>[!NOTE]
>In this quickstart, logged in user is used to authenticate to key vault, which is preferred method for local development. For applications deployed to Azure, managed identity should be assigned to App Service or Virtual Machine, for more information, see [Managed Identity Overview](/azure/active-directory/managed-identities-azure-resources/overview).

## 5. Get data from Azure Storage with serverless function

Extract, Transform, and Load (ETL) is a common approach used in data processes solutions. In this approach, data is extracted from one or more source systems, then transformed in a 'staging' area. Finally, the processed data is loaded into a data store to be consumed by analytic tools.

The below code begins the ETL process by *extracting* raw data from blob storage into a serverless function.

>[!IMPORTANT]
>Be sure to add the Environment Variable values to both the 'local.setting.json' file for local development, and the [Azure Function appsettings configuration](/azure/azure-functions/functions-how-to-use-azure-function-app-settings).

``` Python
    blob_client = BlobClient( account_url=storage_account_url, 
                              container_name=blob_container_name, 
                              blob_name=blob_csv_filename, 
                              credential=access_key_secret.value )

    download_stream = blob_client.download_blob()

    # split the financial_data_blob string with newline.
    data_stream_arr = download_stream.readall().splitlines()

    # Check the stored blob data by printing one line at a time.
    for line in data_stream_arr:
        print(line)

    return func.HttpResponse("This HTTP triggered function executed successfully", mimetype="application/json")

  else:
    return func.HttpResponse(
        "This HTTP triggered function executed unsuccessfully. Check environment variable configurations.",
        status_code=200
    )

except Exception as e:
  logging.info(e)

  return func.HttpResponse(
          "This HTTP triggered function executed unsuccessfully. Please check log for more information.",
          status_code=200
      )
```

```console
Segment,Country,Product,Units Sold,Manufacturing Price,Sale Price,Gross Sales,Date
Government,Canada,Carretera,1618.5,$3.00,$20.00,"$32,370.00",1/1/2014
Government,Germany,Carretera,1321,$3.00,$20.00,"$26,420.00",1/1/2014
Midmarket,France,Carretera,2178,$3.00,$15.00,"$32,670.00",6/1/2014
Midmarket,Germany,Carretera,888,$3.00,$15.00,"$13,320.00",6/1/2014
Midmarket,Mexico,Carretera,2470,$3.00,$15.00,"$37,050.00",6/1/2014
```

## Next steps

This quickstart showed you how to use Azure CLI/Powershell to create secure access between a serverless function, key vault, and storage blob. You also learned how to use the Python Azure SDK to retrieve the secret from the key vault to securely extract the raw file data from Azure Storage. In the following article, we can expand this function to include transforming and loading the extracted data into an Azure relational database.

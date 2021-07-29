---
title: Access Azure Blob Storage using Azure Key Vault with a Python function
description: Learn how to retrieve a secret from Azure Key Vault to access Azure Storage Blob, using a serverless Python function.
ms.topic: quickstart
ms.date: 07/29/2021
ms.custom: devx-track-python
---

# Quickstart: Access Azure Blob Storage using Azure Key Vault with a Python function

In this quickstart, you'll learn how to retrieve a secret from Azure Key Vault to access Azure Storage Blob, using a serverless Python function.

  
## Prerequisites
For this quickstart you will need:
* An active Azure subscription - [create one for free](https://azure.microsoft.com/free/) 
* [Azure CLI](/cli/azure/install-azure-cli) or [PowerShell 7](/powershell/scripting/install/installing-powershell-core-on-windows)
* The [Azure Functions Core Tools](/azure/azure-functions/functions-run-local#install-the-azure-functions-core-tools) version 3.x.
* [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
* The [PowerShell extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell).
* The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.
* [Python 2.7+ or 3.6+](/azure/developer/python/configure-local-development-environment) is required as well as the following packages:
  * azure-storage-blob `pip install azure-storage-blob`
  * azure-identity `pip install azure-identity`
  * azure-keyvault-keys `pip install azure-keyvault-secrets`


* This quickstart assumes you have **already created** the following Azure Resources:
  * Azure Active Directory (Azure AD)
  * Azure Storage Account, if you would like to create a new storage account you can use the [Azure Portal](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal), [Azure PowerShell](/azure/storage/common/storage-quickstart-create-account?tabs=azure-powershell), or [Azure CLI](/azure/storage/common/storage-quickstart-create-account?tabs=azure-cli)
  * Azure KeyVault,  if you would like to create a new function you can use the [Azure Portal](/azure/key-vault/keys/quick-create-portal), [PowerShell](/azure/key-vault/keys/quick-create-powershell) or [Azure CLI](/azure/key-vault/keys/quick-create-cli)
  * HTTP Trigger or Blob Trigger Azure Function App, if you would like to create a new function you can use the [Visual Studio Code](/azure/azure-functions/create-first-function-vs-code-python) , [Azure PowerShell](/azure/azure-functions/create-first-function-vs-code-powershell), or [Azure CLI](/azure/azure-functions/create-first-function-cli-python)

  
 ## 1. Upload a CSV to a blob container
In order to ingest relational data with a Python Azure Function downstream, we need to upload data (blob) to an Azure Storage Container.

Create a file called 'financial_sample.csv' locally.


|Segment|Country|Product|Units Sold|Manufacturing Price|Sale Price|Gross Sales|Date|
|----|----|----|----|----|----|----|----:|
|Government|Canada|Carretera|1618.5|$3.00|$20.00|$32,370.00|1/1/2014|
|Government|Germany|Carretera|1321|$3.00|$20.00|$26,420.00|1/1/2014|
|Midmarket|France|Carretera|2178|$3.00|$15.00|$32,670.00|6/1/2014|
|Midmarket|Germany|Carretera|888|$3.00|$15.00|$13,320.00|6/1/2014|
|Midmarket|Mexico|Carretera|2470|$3.00|$15.00|$37,050.00|6/1/2014|


Copy the below data into the file:

``` CSV
Segment,Country,Product,Units Sold,Manufacturing Price,Sale Price,Gross Sales,Date
Government,Canada,Carretera,1618.5,$3.00,$20.00,"$32,370.00",1/1/2014
Government,Germany,Carretera,1321,$3.00,$20.00,"$26,420.00",1/1/2014
Midmarket,France,Carretera,2178,$3.00,$15.00,"$32,670.00",6/1/2014
Midmarket,Germany,Carretera,888,$3.00,$15.00,"$13,320.00",6/1/2014
Midmarket,Mexico,Carretera,2470,$3.00,$15.00,"$37,050.00",6/1/2014

```

Run the following code from your favorite IDE to upload your data (blob) to the storage container. (We recommend [VSCode](https://code.visualstudio.com/)).

## [PowerShell](#tab/azure-powershell)
``` PowerShell
Set-AzStorageBlobContent -File "<file-path>" -Container "<container-name>" -Blob "financial_sample.csv" -Context "<storage-account-context>" 
```
## [CLI](#tab/cli)
``` CLI
az storage blob upload --account-name "<storage-account>" --container-name "<container>" --name "financial_sample" --file "financial_sample.csv" --auth-mode login
```

## 2. Set a secret to the blob access key
Create a 'secret' in Azure Key Vault to store the storage account access key.

Run the following code from your favorite IDE to setup a secret to store the access key.

## [PowerShell](#tab/azure-powershell)
``` PowerShell
Set-AzKeyVaultSecret -VaultName "<keyvault-name>" -Name "BlobAccessKey" -SecretValue "<secret-value>"
```
## [CLI](#tab/cli)
``` Azure CLI
az keyvault secret set --vault-name "<keyvault-name>" --name "BlobAccessKey" --value "<secret-value>"
```

## 3. Configure access between Azure Storage Account and Azure Key Vault
Before Azure Key Vault can access and manage your storage account keys, you must authorize access to your storage account.

Run the following code from your favorite IDE to configure access between the storage account and keyvault.

## [PowerShell](#tab/azure-powershell)
``` PowerShell
$regenPeriod = [System.Timespan]::FromDays(30)

# Assign Azure role "Storage Account Key Operator Service Role" to Key Vault, limiting the access scope to your storage account
New-AzRoleAssignment -ApplicationId "cfa8b339-82a2-471a-a3c9-0fc0be7a4093" -RoleDefinitionName "Storage Account Key Operator Service Role" -Scope "<storage-account-id>"

# Give your user account permission to managed storage accounts
Set-AzKeyVaultAccessPolicy -VaultName "<keyvault-name>" -UserPrincipalName "user@domain.com" -PermissionsToSecrets get,set,delete

# Add your storage account to your Key Vault's managed storage accounts
Add-AzKeyVaultManagedStorageAccount -VaultName "<keyvault-name>" -AccountName "<storage-account-name>" -AccountResourceId "<storage-account-id" -ActiveKeyName "<key1>" -RegenerationPeriod $regenPeriod
```
## [CLI](#tab/cli)
``` CLI
# Assign Azure role "Storage Account Key Operator Service Role" to Key Vault, limiting the access scope to your storage account
az role assignment create --role "Storage Account Key Operator Service Role" --assignee 'https://vault.azure.net' --scope "/subscriptions/<subscription-id>/resourceGroups/<storage-account-resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"

# Give your user account permission to managed storage accounts
az keyvault set-policy --name "<keyvault-name>" --upn user@domain.com --storage-permissions get,set,delete

# Add your storage account to your Key Vault's managed storage accounts
az keyvault storage add --vault-name "<keyvault-name>" -n "<storage-account-name>" --active-key-name key1 --auto-regenerate-key --regeneration-period P90D --resource-id "/subscriptions/<subscription-id>/resourceGroups/<storage-account-resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"
```

[!IMPORTANT]
A common approach for storing sensitive information is to remove the data from the application code, and into a 'config.json' file. However, this practice still stores the sensitive information in plain text. We recommend instead using [Azure Key Vault](https://azure.microsoft.com/services/key-vault/), a secure centeralized cloud solution for storing and managing sensitive information, such as passwords, certificates, keys, etc. 


## 4. Retrieve key vault secret in function

Now that the storage access key is securely stored in a centralized key vault, you can now retrieve the secret value within the Azure Function. Storing secrets in Azure Key Vault, rather than storing the sensitive data in plain text, improves the security of your sensitive information. 

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

[!NOTE]
In this quickstart, logged in user is used to authenticate to key vault, which is preferred method for local development. For applications deployed to Azure, managed identity should be assigned to App Service or Virtual Machine, for more information, see [Managed Identity Overview](/azure/active-directory/managed-identities-azure-resources/overview).


## 5. Get data from Azure Storage with serverless function
Extract, Transform, and Load (ETL) is a common approach used for data movement processes. With this approach, data is typically extracted from a source system(s), then transformed in a 'staging' area, and finally loaded into a data store to be consumed by analytic tools.
  
In the below example, we begin the ETL process by *extracting* data from our blob storage into our function to be transformed.

[!IMPORTANT]
Be sure to add the Environment Variable values to both the 'local.setting.json' file for local development, as well as the [Azure Function appsettings configuration](/azure/azure-functions/functions-how-to-use-azure-function-app-settings).

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
``` Output
Segment,Country,Product,Units Sold,Manufacturing Price,Sale Price,Gross Sales,Date
Government,Canada,Carretera,1618.5,$3.00,$20.00,"$32,370.00",1/1/2014
Government,Germany,Carretera,1321,$3.00,$20.00,"$26,420.00",1/1/2014
Midmarket,France,Carretera,2178,$3.00,$15.00,"$32,670.00",6/1/2014
Midmarket,Germany,Carretera,888,$3.00,$15.00,"$13,320.00",6/1/2014
Midmarket,Mexico,Carretera,2470,$3.00,$15.00,"$37,050.00",6/1/2014
```

## Next steps
You have used the Azure SDK to setup secure communication between your function app, key vault, and storage blob.

You have used the Azure Python SDK to then retrieve secrets from your key vault and extract data from a file stored in Azure Storage into a Python variable. In the next article you expand that function by transforming and loading the extracted data into a relational daatabase within Azure.
{"mode":"full","isActive":false}



###
Internal Change Log:
    7/29/2021: Initial PR push
    7/29/2021: Docs Build Fixes:
                1. [Warning-hard-coded-locale] Link contains locale code 'en-us'. For localizability, remove 'en-us' from links to most Microsoft sites. {Lines: 29, 31, 39, 48, 49, 50, 150, 186}
                2. [Warning-table-syntax-invalid] Table syntax is invalid. Ensure your table includes a header and is surrounded by empty lines. {Line: 60}
                3. [Warning-file-not-found] Invalid file link: '(https://code.visualstudio.com/)'.{Line: 82}
                4. [Suggestion-docs-link-absolute] Absolute link will be broken in isolated environments. Replace with a relative link. {Lines: 29, 31, 39, 48, 49, 50, 150, 186}
                5. [Warning-invalid-tab-group] Duplicate tab id: (powershell, 3),(cli, 3) {Line: 84}
                6. General aesthetics clean up
                7. Added content - Function appsettings environment variable note.
                8. 
###
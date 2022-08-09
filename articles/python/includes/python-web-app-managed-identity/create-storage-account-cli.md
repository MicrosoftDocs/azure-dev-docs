---
author: jessmjohnson
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

#### [bash](#tab/terminal-bash)

```azurecli
# Use 'az account list-locations --output table' to list locations.
LOCATION='eastus'

# Use the same resource group you create the web app in.
RESOURCE_GROUP_NAME='msdocs-web-app-rg'

# Replace <unique-id> with three random numbers to get unique name.
STORAGE_ACCOUNT_NAME='msdocswebapp<unique-id>' 

az storage account create \
    --name $STORAGE_ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --location $LOCATION
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
# Use 'az account list-locations --output table' to list locations.
$LOCATION='eastus'                             

# Use the same resource group you create the web app in.
$RESOURCE_GROUP_NAME='msdocs-web-app-rg'

# Replace <unique-id> with three random numbers to get unique name.
$STORAGE_ACCOUNT_NAME='msdocswebapp<unique-id>' 

az storage account create `
    --name $STORAGE_ACCOUNT_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --location $LOCATION
```

---


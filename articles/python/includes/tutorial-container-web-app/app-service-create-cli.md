---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/27/2022
---

**Step 1.** Get the resource ID of the Azure Container Registry.

#### [bash](#tab/terminal-bash)

```azurecli
RESOURCE_GROUP_NAME='msdocs-web-app'
REGISTRY_NAME='msdocsregistry'

RESOURCE_ID=$(az acr show \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $REGISTRY_NAME \
  --query id \
  --output tsv)
echo $RESOURCE_ID
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$RESOURCE_GROUP_NAME='msdocs-web-app'
$REGISTRY_NAME='msdocsregistry'

RESOURCE_ID=$(az acr show `
  --resource-group $RESOURCE_GROUP_NAME ` 
  --name $REGISTRY_NAME `
  --query id `
  --output tsv)
Get-Variable RESOURCE_ID
```

---

**Step 2.** Create an App Service plan.

#### [bash](#tab/terminal-bash)

```azurecli
APP_SERVICE_PLAN_NAME='msdocs-web-app'

az appservice plan create \
    --name $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --sku B1 \
    --is-linux
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$APP_SERVICE_PLAN_NAME='msdocs-web-app'

az appservice plan create `
    --name $APP_SERVICE_PLAN_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --sku B1 `
    --is-linux
```

---

**Step 3.** Create a web app with the resource ID scope and role.

#### [bash](#tab/terminal-bash)

```azurecli
APP_SERVICE_NAME='<website-name>'
CONTAINER_NAME='msdocspythoncontainerwebapp'

az webapp create \
  --resource-group $RESOURCE_GROUP_NAME \
  --plan $APP_SERVICE_PLAN_NAME \
  --name $APP_SERVICE_NAME \
  --assign-identity '[system]' \
  --scope $RESOURCE_ID \
  --role acrpull \
  --deployment-container-image-name $CONTAINER_NAME 
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$SITE_NAME=<website-name>
$CONTAINER_NAME='msdocspythoncontainerwebapp'

az webapp create `
  --resource-group $RESOURCE_GROUP_NAME `
  --plan $APP_SERVICE_PLAN_NAME `
  --name $APP_SERVICE_NAME `
  --assign-identity '[system]' `
  --scope $RESOURCE_ID `
  --role acrpull `
  --deployment-container-image-name $CONTAINER_NAME 
```

---

Note:

* *\<website-name>* must be unique as it becomes the URL `https://<website-name>.azurewebsites.net`.
* *\<container-name>* is of the form "myregistryname.azurecr.io/repo_name:tag".

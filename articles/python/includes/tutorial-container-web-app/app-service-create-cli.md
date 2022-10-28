---
ms.topic: include
ms.date: 07/27/2022
---

**Step 1.** Get the resource ID of the group containing Azure Container Registry with the [az group show](/cli/azure/group#az-group-show) command.

#### [bash](#tab/terminal-bash)

```azurecli
RESOURCE_GROUP_NAME='msdocs-web-app'

RESOURCE_ID=$(az group show \
  --resource-group $RESOURCE_GROUP_NAME \
  --query id \
  --output tsv)
echo $RESOURCE_ID
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$RESOURCE_GROUP_NAME='msdocs-web-app'

$RESOURCE_ID=$((az group show `
  --resource-group $RESOURCE_GROUP_NAME ` 
  --query id `
  --output tsv))
$RESOURCE_ID
```

---

**Step 2.** Create an App Service plan with the [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create) command.

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

**Step 3.** Create a web app with the [az webapp create](/cli/azure/webapp#az-webapp-create) command specify the resource ID as the scope and role as "AcrPull".

#### [bash](#tab/terminal-bash)

```azurecli
APP_SERVICE_NAME='<website-name>'
$REGISTRY_NAME='msdocstutorialregistry'
$CONTAINER_NAME=$REGISTRY_NAME+'.azurecr.io/msdocspythoncontainerwebapp:latest'

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
$APP_SERVICE_NAME='<website-name>'
$REGISTRY_NAME='<registry-name>'
$CONTAINER_NAME=$REGISTRY_NAME+'.azurecr.io/msdocspythoncontainerwebapp:latest'

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

* $APP_SERVICE_NAME must be unique as it becomes the URL `https://<website-name>.azurewebsites.net`.
* $CONTAINER_NAME is of the form "myregistryname.azurecr.io/repo_name:tag".

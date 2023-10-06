---
ms.topic: include
ms.custom: devx-track-azurecli
ms.date: 07/27/2022
---

**Step 1.** Configure the web app to use managed identity with the [az webapp config set](/cli/azure/webapp/config#az-webapp-config-set) command.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp config set \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $APP_SERVICE_NAME \
  --generic-configurations '{"acrUseManagedIdentityCreds": true}'
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp config set `
  --resource-group $RESOURCE_GROUP_NAME `
  --name $APP_SERVICE_NAME `
  --generic-configurations '{\"acrUseManagedIdentityCreds\": true}'
```

---

**Step 2.** Get the application scope credential with the [az webapp deployment list-publishing-credentials](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-credentials) command.

#### [bash](#tab/terminal-bash)

```azurecli
CREDENTIAL=$(az webapp deployment list-publishing-credentials \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $APP_SERVICE_NAME \
  --query publishingPassword \
  --output tsv)
echo $CREDENTIAL 
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$CREDENTIAL = $((az webapp deployment list-publishing-credentials `
  --resource-group $RESOURCE_GROUP_NAME `
  --name $APP_SERVICE_NAME `
  --query publishingPassword `
  --output tsv))
$CREDENTIAL 
```

---

**Step 3.** Use the application scope credential to create a webhook with the [az acr webhook create](/cli/azure/acr/webhook#az-acr-webhook-create) command.

#### [bash](#tab/terminal-bash)

```azurecli
SERVICE_URI='https://$'$APP_SERVICE_NAME':'$CREDENTIAL'@'$APP_SERVICE_NAME'.scm.azurewebsites.net/api/registry/webhook'
$LOCATION='<location-of-registry>'

az acr webhook create \
  --name webhookforwebapp \
  --location $LOCATION \
  --resource-group $RESOURCE_GROUP_NAME \
  --registry $REGISTRY_NAME \
  --scope msdocspythoncontainerwebapp:* \
  --uri $SERVICE_URI \
  --actions push 
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$SERVICE_URI='https://$'+$APP_SERVICE_NAME+':'+$CREDENTIAL+'@'+$APP_SERVICE_NAME+'.scm.azurewebsites.net/api/registry/webhook'
$LOCATION='<location-of-registry>'

az acr webhook create `
  --name webhookforwebapp `
  --location $LOCATION `
  --resource-group $RESOURCE_GROUP_NAME `
  --registry $REGISTRY_NAME `
  --scope msdocspythoncontainerwebapp:* `
  --uri $SERVICE_URI `
  --actions push 
```

---

---
ms.topic: include
ms.custom: devx-track-azurecli
ms.date: 10/09/2023
---

**Step 1.** Configure the web app to use managed identities to pull from the Azure Container Registry with the [az webapp config set](/cli/azure/webapp/config#az-webapp-config-set) command. 

```azurecli
az webapp config set \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $APP_SERVICE_NAME \
  --generic-configurations '{"acrUseManagedIdentityCreds": true}'
```

Because you enabled the system-assigned managed identity when you created the web app, it will be the managed identity used to pull from the Azure Container Registry.

**Step 2.** Get the application scope credential with the [az webapp deployment list-publishing-credentials](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-credentials) command.

```azurecli
CREDENTIAL=$(az webapp deployment list-publishing-credentials \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $APP_SERVICE_NAME \
  --query publishingPassword \
  --output tsv)
echo $CREDENTIAL 
```

**Step 3.** Use the application scope credential to create a webhook with the [az acr webhook create](/cli/azure/acr/webhook#az-acr-webhook-create) command.

```azurecli
SERVICE_URI='https://$'$APP_SERVICE_NAME':'$CREDENTIAL'@'$APP_SERVICE_NAME'.scm.azurewebsites.net/api/registry/webhook'

az acr webhook create \
  --name webhookforwebapp \
  --registry $REGISTRY_NAME \
  --scope msdocspythoncontainerwebapp:* \
  --uri $SERVICE_URI \
  --actions push 
```

By default, this command creates the webhook in the same resource group and location as the specified Azure Container registry. If desired, you can use the `--resource-group` and `--location` parameters to override this behavior.

---
ms.topic: include
ms.date: 10/09/2023
---

**Step 1.** Get the resource ID of the group containing Azure Container Registry with the [az group show](/cli/azure/group#az-group-show) command.

```azurecli
# RESOURCE_GROUP_NAME='msdocs-web-app-rg'

RESOURCE_ID=$(az group show \
  --resource-group $RESOURCE_GROUP_NAME \
  --query id \
  --output tsv)
echo $RESOURCE_ID
```

In the command above, RESOURCE_GROUP_NAME should still be set in your environment to the resource group name you used in part **3. Build container in Azure** of this tutorial. If it isn't, uncomment the first line and make sure it's set to the name you used.

**Step 2.** Create an App Service plan with the [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create) command.

```azurecli
APP_SERVICE_PLAN_NAME='msdocs-web-app-plan'

az appservice plan create \
    --name $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --sku B1 \
    --is-linux
```

**Step 3.** Create a web app with the [az webapp create](/cli/azure/webapp#az-webapp-create) command. 

The following command also enables the [system-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types) for the web app and assigns it the [`AcrPull` role](/azure/container-registry/container-registry-roles?tabs=azure-cli) on the specified resource--in this case, the resource group that contains the Azure Container Registry. This grants the system-assigned managed identity pull privileges on any Azure Container Registry in the resource group.

```azurecli
APP_SERVICE_NAME='<website-name>'
# REGISTRY_NAME='<your Azure Container Registry name>'
CONTAINER_NAME=$REGISTRY_NAME'.azurecr.io/msdocspythoncontainerwebapp:latest'

az webapp create \
  --resource-group $RESOURCE_GROUP_NAME \
  --plan $APP_SERVICE_PLAN_NAME \
  --name $APP_SERVICE_NAME \
  --assign-identity '[system]' \
  --scope $RESOURCE_ID \
  --role acrpull \
  --deployment-container-image-name $CONTAINER_NAME 
```

In the command above:

* APP_SERVICE_NAME must be globally unique as it becomes the website name in the URL `https://<website-name>.azurewebsites.net`.
* CONTAINER_NAME is of the form "yourregistryname.azurecr.io/repo_name:tag".
* REGISTRY_NAME should still be set in your environment to the registry name you used in part **3. Build container in Azure** of this tutorial. If it isn't, uncomment the line where it's set above and make sure it's set to the name you used.

> [!NOTE]
> You may see an error similar to the following when running the command:
>
>    ```output
>    No credential was provided to access Azure Container Registry. Trying to look up...
>    Retrieving credentials failed with an exception:'No resource or more than one were found with name ...'
>    ```
>
> This error occurs because the web app defaults to using the Azure Container Registry's admin credentials to authenticate with the registry and admin credentials haven't been enabled on the registry. You can safely ignore this error because you will set the web app to use the system-assigned managed identity for authentication in the next command.

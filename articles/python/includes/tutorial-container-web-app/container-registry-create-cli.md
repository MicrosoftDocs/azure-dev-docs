---
ms.topic: include
ms.date: 10/09/2023
---

**Step 1.** Create a resource group if needed with the [az group create](/cli/azure/group#az-group-create) command. If you've already set up an Azure Cosmos DB for Mongo DB account in part **2. Build and test container locally** of this tutorial, set RESOURCE_GROUP_NAME to the name of the resource group you used for that account and move on to Step 2.

```azurecli
RESOURCE_GROUP_NAME='msdocs-web-app-rg'
LOCATION='eastus'

az group create -n $RESOURCE_GROUP_NAME -l $LOCATION
```

LOCATION should be an Azure location value. Choose a location near you. You can list Azure location values with the following command: `az account list-locations -o table`.

**Step 2.** Create a container registry with the [az acr create](/cli/azure/acr#az-acr-create) command.

```azurecli
REGISTRY_NAME='<your Azure Container Registry name>'

az acr create -g $RESOURCE_GROUP_NAME -n $REGISTRY_NAME --sku Basic
```

REGISTRY_NAME must be unique within Azure and contain 5-50 alphanumeric characters.

In the JSON output of the command look for the `loginServer` value, which is the fully qualified registry name (all lowercase) and which should include the registry name you specified.

**Step 3.** If you're running the Azure CLI locally, log in to the registry using the [az acr login](/cli/azure/acr#az-acr-login) command.

```azurecli
az acr login -n $REGISTRY_NAME
```

The command adds "azurecr.io" to the name to create the fully qualified registry name. If successful, you'll see the message "Login Succeeded".

> [!NOTE]
> The `az acr login` command isn't needed or supported in Cloud Shell.

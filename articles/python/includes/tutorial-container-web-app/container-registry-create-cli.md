---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/07/2022
---

**Step 1.** Create a resource group if needed with the [az group create](/cli/azure/group?view=azure-cli-latest#az-group-create) command.

```azurecli
az group create -n <resource-group> -l <location>
```
*\<resource-group>* is the resource group name. *\<location>* is one of the Azure location values from the command `az account list-locations -o table`.

**Step 2.** Create a container registry with the [az acr create](/cli/azure/acr?view=azure-cli-latest#az-acr-create) command.

```azurecli
az acr create -g <resource-group> -n <registry-name> --sku Basic
```
*\<registry-name>* must be unique within Azure, and contain 5-50 alphanumeric characters.

In the JSON output of the command look for the `loginServer` value, which is the fully qualified registry name (all lowercase), which should include the registry name specified.

**Step 3.** Log in to the registry using the [az acr login](/cli/azure/acr?view=azure-cli-latest#az-acr-login) command.

```azurecli
az acr login -n <registry-name>
```

The above command adds "azurecr.io" to the name to create the fully qualified registry name. If successful, you'll see the message "Login Succeeded".

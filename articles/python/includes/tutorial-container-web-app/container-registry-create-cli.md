---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/07/2022
---

**Step 1.** Create a resource group.

```azurecli
az group create --name <resource-group> --location <location>
```

The location can be one of the Azure location values from `az account list-locations -o table`.

**Step 2.** Create a container registry.

```azurecli
az acr create --resource-group <resource-group> --name <registry-name> --sku Basic
```

In the JSON output of the command look for the `loginServer` value, which is the fully qualified registry name (all lowercase), which should include the registry name specified.

**Step 3.** Log in to the registry

```azurecli
az acr login --name <registry-name>
```
---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/12/2022
---

**Step 1.** Get the resource ID of the Azure Container Registry.

```bash
RESOURCE_GROUP=<resource-group>
REGISTRY_NAME=<registry-name>

RESOURCE_ID=$(az acr show -g $RESOURCE_GROUP -n $REGISTRY_NAME --query id --output tsv)
echo $RESOURCE_ID
```

**Step 2.** Create an App Service plan.

```bash
PLAN_NAME=<name-of-plan>

az appservice plan create -g $RESOURCE_GROUP -n $PLAN_NAME --is-linux --sku F1 --number-of-workers 1
```

**Step 3.** Create a web app with the resource ID scope and role.

```bash
SITE_NAME=<website-name>
CONTAINER_NAME=<container-name>

az webapp create -g $RESOURCE_GROUP -p $PLAN -n $SITE_NAME \
  --assign-identity '[system]' \
  --scope $RESOURCE_ID \
  --role acrpull \
  --deployment-container-image-name $CONTAINER_NAME 
```

*\<container-name>* is of the form "myregistryname.azurecr.io/repo_name:tag".

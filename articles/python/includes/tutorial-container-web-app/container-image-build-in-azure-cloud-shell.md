---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 08/03/2022
---

Open [Azure Cloud Shell](/azure/cloud-shell/overview) and use the following [az acr build](/cli/azure/acr?branch#az-acr-build) command to build.

#### [bash](#tab/terminal-bash)

```azurecli
az acr build \
  -r <registry-name> \ 
  -g <resource-group> \
  -t msdocspythoncontainerwebapp:latest \
   https://github.com/Azure-Samples/msdocs-python-django-container-web-app.git
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az acr build `
  -r <registry-name> `
  -g <resource-group> `
  -t msdocspythoncontainerwebapp:latest `
   https://github.com/Azure-Samples/msdocs-python-django-container-web-app.git
```

---

The last argument in the command is the fully qualified path to the repo.
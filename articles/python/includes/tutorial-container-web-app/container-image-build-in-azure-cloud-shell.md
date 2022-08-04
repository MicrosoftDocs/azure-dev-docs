---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 08/03/2022
---

**Step 1.** Open [Azure Cloud Shell](/azure/cloud-shell/overview) and use the following [az acr build](/cli/azure/acr?branch#az-acr-build) command to build.

```azurecli
az acr build \
  -r <registry-name> \ 
  -g <resource-group> \
  -t msdocspythoncontainerwebapp:latest \
   https://github.com/Azure-Samples/msdocs-python-django-container-web-app.git
```

The command above is for Bash shell. If you use the PowerShell as you shell, change the line continuation character from backslash ("\") to backtick ("`"). The last argument in the command is the fully qualified path to the repo.

**Step 2.** Confirm the container image was created with the [az acr repository list](/cli/azure/acr/repository#az-acr-repository-list) command.

```azurecli
az acr repository list -n <registry-name>
```

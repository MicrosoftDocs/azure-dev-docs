---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 08/03/2022
---

Open [Azure Cloud Shell](/azure/cloud-shell/overview) and use the following [az acr build](/cli/azure/acr?branch#az-acr-build) command to build.

    `az acr build -r <registry-name> -g <resource-group> -t msdocspythoncontainerwebapp:latest https://github.com/vmagelo/msdocs-python-django-container-web-app-dev.git`

#### [bash](#tab/terminal-bash)

```Docker
az acr build \
  -r <registry-name> \ 
  -g <resource-group> \
  -t msdocspythoncontainerwebapp:latest \
   https://github.com/vmagelo/msdocs-python-django-container-web-app-dev.git`
```

#### [PowerShell terminal](#tab/terminal-powershell)

```Docker
az acr build `
  -r <registry-name> `
  -g <resource-group> `
  -t msdocspythoncontainerwebapp:latest `
   https://github.com/vmagelo/msdocs-python-django-container-web-app-dev.git`
```

---

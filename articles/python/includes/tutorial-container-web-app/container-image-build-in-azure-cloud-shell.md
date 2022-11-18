---
ms.topic: include
ms.date: 08/07/2022
---

**Step 1.** Open [Azure Cloud Shell](/azure/cloud-shell/overview).

:::image type="content" source="../../media/tutorial-container-web-app/portal-cloud-shell-icon.png" alt-text="A screenshot of the Azure portal showing the Cloud Shell icon." :::

**Step 2.** Use the following [az acr build](/cli/azure/acr#az-acr-build) command to build.

```azurecli
az acr build \
  -r <registry-name> \
  -g <resource-group> \
  -t msdocspythoncontainerwebapp:latest \
  <repo-path>
```

The last argument in the command is the fully qualified path to the repo. Use https://github.com/Azure-Samples/msdocs-python-django-container-web-app.git for the Django sample app and https://github.com/Azure-Samples/msdocs-python-flask-container-web-app.git for the Flask sample app.

The command above is for Bash shell. If you use PowerShell as your shell, change the line continuation character from backslash ("\\") to backtick ("`"). 

**Step 3.** Confirm the container image was created with the [az acr repository list](/cli/azure/acr/repository#az-acr-repository-list) command.

```azurecli
az acr repository list -n <registry-name>
```

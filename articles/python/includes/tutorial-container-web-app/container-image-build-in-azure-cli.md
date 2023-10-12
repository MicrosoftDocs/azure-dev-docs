---
ms.topic: include
ms.custom: devx-track-azurecli
ms.date: 10/09/2023
---


**Step 1.** If your running the Azure CLI locally, log into registry if you haven't done so already with the [az acr login](/cli/azure/acr#az-acr-login) command.

```azurecli
az acr login -n $REGISTRY_NAME
```

If you're accessing the registry from a subscription different from the one in which the registry was created, use the `--suffix` switch.

> [!NOTE]
> The `az acr login` command isn't needed or supported in Cloud Shell.

**Step 2.** Build the image with the [az acr build](/cli/azure/acr#az-acr-build) command.

```azurecli
az acr build -r $REGISTRY_NAME -g $RESOURCE_GROUP_NAME -t msdocspythoncontainerwebapp:latest .
```

Note:

* The dot (".") at the end of the command indicates the location of the source code to build. If you aren't running this command in the sample app root directory, specify the path to the code.

   Rather than a path to the code in your environment, you can, optionally, specify a path to the sample GitHub repo: https://github.com/Azure-Samples/msdocs-python-django-container-web-app or https://github.com/Azure-Samples/msdocs-python-flask-container-web-app.

* If you leave out the `-t` (same as `--image`) option, the command queues a local context build without pushing it to the registry. Building without pushing can be useful to check that the image builds.

**Step 3.** Confirm the container image was created with the [az acr repository list](/cli/azure/acr/repository#az-acr-repository-list) command.

```azurecli
az acr repository list -n $REGISTRY_NAME
```

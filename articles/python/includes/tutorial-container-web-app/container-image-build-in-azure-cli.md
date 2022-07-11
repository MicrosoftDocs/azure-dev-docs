---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/07/2022
---


**Step 1.** Log into registry if you haven't done so already with the [az acr login](/cli/azure/acr#az-acr-login) command.

```azurecli
az acr login -n <registry-name>
```

If you are accessing the registry from a subscription different from where the registry was created, use the `--suffix` switch.

**Step 2.** Build the image with the [az acr build](/cli/azure/acr#az-acr-build) command.

```azurecli
az acr build -r <registry-name> -g <resource-group> -t msdocspythoncontainerapp:latest .
```

Note:

* The dot (".") at the end of the command indicates the location of the source code to build. If you aren't running this command in the sample app root directory, use a different location.

* If you leave out the `-t` (same as `--image`) option, the command queues a local context build without pushing it to the registry. This can be useful for checking that the image build.

**Step 3.** Confirm the container image was created with the [az acr list](/cli/azure/acr#az-acr-list) command.

```azurecli
az acr list -g <resource-group -o table
```



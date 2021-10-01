---
title: Clean up resources after deploying a Node.js app to Azure using the Azure CLI
description: Tutorial part 7, Azure CLI clean up resources
ms.topic: tutorial
ms.date: 08/16/2021
ms.custom: devx-track-js, devx-track-azurecli
# Verified full run: diberry 08/16/2021
---

# Part 6: Clean up resources

Remove Azure resources from your subscription. 

## Remove resource group with Azure CLI

The App Service you created includes a backing App Service Plan that can incur costs. To clean up the resources, run the following command at a terminal or command prompt:

```azurecli
az group delete --name myResourceGroup
```

## Next steps

* [Deploy container to Azure App Service](../tutorial-vscode-docker-node/tutorial-vscode-docker-node-01.md)
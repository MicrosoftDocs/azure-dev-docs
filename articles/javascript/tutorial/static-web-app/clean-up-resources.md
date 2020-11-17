---
title: Remove Azure resource
description: Clean up Azure resources by removing the resource group with an Azure CLI command. 
ms.topic: tutorial
ms.date: 11/13/2020
ms.custom: devx-track-js
---

# 6. Clean up resources

Once you have completed this tutorial, you need to remove the resource group, which includes the Computer Vision resource and Static web app, to make sure you are not billed for any more usage. 

## Remove all the resources by removing resource group

In the same terminal, use the [Azure CLI command](/cli/azure/group?view=azure-cli-latest#az_group_delete) to delete the resource group:

```azurecli
az group delete --name rg-demo  -y
```

This command may take a few minutes. 

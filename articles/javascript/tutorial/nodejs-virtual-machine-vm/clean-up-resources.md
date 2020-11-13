---
title: Remove Linux virtual machine resource
description: Clean up Azure resources by removing the resource group with an Azure CLI command. 
ms.topic: tutorial
ms.date: 11/13/2020
ms.custom: devx-track-js
---

# 5. Clean up resources

Once you have completed this tutorial, you need to remove the resource group, which includes all its resources to make sure you are not billed for any more usage. 

## Remove all the resources by removing resource group

In the same terminal, use the Azure CLI command to delete the resource group:

```azurecli
az group delete --name rg-demo-vm-eastus -y
```

This command takes a few minutes. 

## Next step

* Learn more about [Azure Linux VMs](/virtual-machines)

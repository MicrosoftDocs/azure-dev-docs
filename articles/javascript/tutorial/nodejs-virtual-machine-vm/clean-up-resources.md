---
title: Remove Linux virtual machine resource
description: Create an Azure Linux virtual machine with Azure CLI 
ms.topic: tutorial
ms.date: 11/09/2020
ms.custom: devx-track-js
---

# 5. Clean up resources

Once you have completed this tutorial, you need to remove the resource group, which includes all its resources to make sure you are not billed for any more usage. 

In the same terminal, use the Azure CLI command to delete the resource group:

```azurecli
az group delete --name rg-demo-vm-eastus -y
```

This command takes a few minutes. 

## Next step

* Learn more about [Azure Linux VMs](/virtual-machines)

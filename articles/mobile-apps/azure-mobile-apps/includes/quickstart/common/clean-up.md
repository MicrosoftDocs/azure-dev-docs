---
ms.topic: include
ms.date: 09/07/2023
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

## Clean up resources

Unless you're doing another quick start tutorial, you can delete the resources associated with the backend service now.

1. Open the [Azure portal](https://portal.azure.com).
1. Select the resource group holding the quick start resources.
1. Select **Delete resource group**.
1. Follow the instructions to confirm the deletion.

You can also use the Azure CLI:

``` azurecli
az group delete -g quickstart
```

If you used the Azure Developer CLI to deploy resources, you can use the `azd down` command instead.

The deletion will take a few minutes to complete.

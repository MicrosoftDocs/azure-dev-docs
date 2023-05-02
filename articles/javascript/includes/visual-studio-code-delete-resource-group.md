---
ms.custom: devx-track-js
ms.topic: include
ms.date: 09/02/2022
---

## Clean up resources

Remove the resources created in this procedure when you're done using them.  In the following procedure, replace `YOUR-RESOURCE-GROUP-NAME` with your own resource group name.

# [Visual Studio Code](#tab/visualstudiocode)

1. In Visual Studio Code, still in the Azure explorer (<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd>). 
1. In the **Resources** contextual toolbar, select **Group by**.
1. In the list of group-by choices, select **Group by Resource Group**.
1. Right-click on your resource group and select **Delete Resource Group**.

# [Azure CLI](#tab/azure-cli)

Delete the resource group with the following Azure CLI command, [az group delete](/cli/azure/group#az-group-delete):

```bash
az group delete --name YOUR-RESOURCE-GROUP-NAME --yes
```

# [Portal](#tab/portal)

1. Open a browser and go to your list of resource groups with the following portal location:

    ```http
    https://ms.portal.azure.com/#view/HubsExtension/BrowseResourceGroups
    ```

1. Filter the list to find your resource group.
1. Select the resource group to go to the resource group page.
1. Select **Delete resource group**. 
1. Type the resource group name in the confirmation box and select **Delete**.
---

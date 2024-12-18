---
ms.custom:
ms.topic: include
ms.date: 08/09/2022
---

# [VS Code extension](#tab/vscode)

In VS Code, select the Azure explorer, then right-click on your resource group which is listed under the subscription, and select **Delete**.

:::image type="content" source="../media/visual-studio-code-azure-resources-extension-remove-resource-group.png" alt-text="Partial screen shot of VS Code, selecting resource group from list of resource groups, then right-clicking to select `Delete`.":::

# [Azure CLI](#tab/azure-cli)

Use the [Azure CLI command](/cli/azure/group#az-group-delete) in a terminal to delete the resource group:

```azurecli
az group delete --name rg-demo  -y
```

This command may take a few minutes. 

# [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com/#blade/HubsExtension/BrowseResourceGroups), filter by your resource group name.
2. Select your resource group name.

    :::image type="content" source="../media/portal/azure-portal-resource-group-selected.png" alt-text="Partial screen shot of Azure portal, selecting resource group from list of resource groups.":::

3. On the Resource group page, select **Delete resource group**.

    :::image type="content" source="../media/portal/azure-portal-resource-group-select-delete-button.png" alt-text="Partial screen shot of Azure portal, selecting `Delete resource group` from Resource group page.":::

---

---
title: Delete resource group
description: Learn how to clean up after using an Azure Function app.
ms.topic: how-to
ms.date: 09/13/2021
ms.custom: devx-track-js
---

# 6. View and query your Function app logs

In this article of the series, you remove all Azure resources.

## Delete the resource group

The quickest and most complete way to clean up your Azure resources is to delete the resource group containing the resources. 
# [Visual Studio Code](#tab/vscode-remove-resource-group)

In VS Code, find the Azure Explorer's Functions section, right-click on the Function app and select **Delete Function App**. In the pop-up window, **Are you sure...**, select **Delete** again. 

# [Azure CLI](#tab/azcli-remove-resource-group)

In the VS Code integrated terminal, where you logged into the Azure CLI in a previous section of this article series, use the following Azure CLI command, [az group delete](/cli/azure/group#az_group_delete), to delete your resource group:

```azurecli
az group delete --name YOUR-RESOURCE-GROUP-NAME --no-wait --yes
```

---

## Next steps

* [Deploy a GraphQL API as an Azure Function](../graphql/azure-function-hello-world.md)
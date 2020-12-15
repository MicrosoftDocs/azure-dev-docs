---
title: Clean up resources after deploying a Node.js app to Azure using the Azure CLI
description: Tutorial part 7, Azure CLI clean up resources
ms.topic: tutorial
ms.date: 09/24/2019
ms.custom: devx-track-js, devx-track-azurecli
---

# Part 7: Clean up resources

[Previous step: Make changes and redeploy](tutorial-vscode-azure-cli-node-05.md)

The App Service you created includes a backing App Service Plan that can incur costs. To clean up the resources, run the following command at a terminal or command prompt:

```azurecli
az group delete --name myResourceGroup
```

You can also visit the [Azure portal](https://portal.azure.com), select **Resource groups** from the left-side navigation pane, select the resource group that was created in the process of this tutorial, and then use the **Delete resource group** command.

> [!div class="nextstepaction"]
> [I'm done](./how-to/deploy-web-app.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment&step=clean-up-resources)
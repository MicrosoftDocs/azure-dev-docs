---
title: "Tutorial: Clean up resources after deploying to Azure App Service on Linux from Visual Studio Code"
description: Tutorial step 7, cleaning up Azure resources
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/12/2019
ms.author: kraigb
ms.custom: seo-python-october2019
---

# Tutorial: Clean up resources after deploying to Azure App Service on Linux from Visual Studio Code

[Previous step: stream logs](tutorial-deploy-app-service-on-linux-06.md)

The App Service you created includes a backing App Service Plan that can incur costs. To clean up the resources, right-click the App Service in the **Azure: App Service** explorer and select **Delete**.

You can also visit the [Azure portal](https://portal.azure.com), select **Resource groups** from the left-side navigation pane, select the resource group that was created in the process of this tutorial, and then use the **Delete resource group** command.

## Next steps

Congratulations on completing this walkthrough of deploying Python code to App Service on Linux!

As noted earlier, you can learn more about the App Service extension by visiting its GitHub repository, [vscode-azureappservice](https://github.com/Microsoft/vscode-azureappservice). Issues and contributions are also welcome.

To learn more about Azure services that you can use from Python, including data storage along with AI and Machine Learning services, visit [Azure Python Developer Center](https://docs.microsoft.com/python/azure/?view=azure-python).

There are also other Azure extensions for VS Code that you may find helpful. Just search on "Azure" in the Extensions explorer:

![Azure extensions for VS Code](media/deploy-containers/azure-extensions.png)

Some popular extensions are:

- [Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
- [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
- [Azure CLI Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli)
- [Azure Resource Manager (ARM) Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)

> [!div class="nextstepaction"]
> [I'm done](https://docs.microsoft.com/python/azure/?view=azure-python) 

[I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-appservice-python&step=07-clean-up-resources)

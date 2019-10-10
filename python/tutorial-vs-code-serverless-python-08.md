---
title: "Tutorial: Clean up Azure resources - Azure Functions in Python"
description: Tutorial step 8, cleaning up Azure resources to avoid incurring ongoing changes.
services: functions
author: kraigb
manager: barbkess
ms.service: azure-functions
ms.topic: conceptual
ms.date: 09/12/2019
ms.author: kraigb
ms.custom: seo-python-october2019
---

# Tutorial: Clean up Azure resources for Azure Functions

[Previous step: add a storage binding](tutorial-vs-code-serverless-python-07.md)

This article shows you how to remove Azure resources created in this tutorial. The Azure Function App you created with Visual Studio Code includes resources that can incur minimal costs.

To clean up the resources, right-click the Function App in the **Azure: Functions** explorer and select **Delete Function App**. For more information, see [Functions Pricing](https://azure.microsoft.com/pricing/details/functions/).

You can also visit the [Azure portal](https://portal.azure.com), select **Resource groups** from the left-side navigation pane, select the resource group that was created in the process of this tutorial, and then use the **Delete resource group** command.

## Next steps

Congratulations on completing this walkthrough of deploying Python code to Azure Functions! You're now ready to create many more serverless functions.

As noted earlier, you can learn more about the Functions extension by visiting its GitHub repository, [vscode-azurefunctions](https://github.com/Microsoft/vscode-azurefunctions). Issues and contributions are also welcome.

Read the [Azure Functions Overview](/azure/azure-functions/functions-overview) to explore the different triggers you can use.

To learn more about Azure services that you can use from Python, including data storage along with AI and Machine Learning services, visit [Azure Python Developer Center](/azure/python/?view=azure-python).

There are also other Azure extensions for Visual Studio Code that you may find helpful. Just search on "Azure" in the Extensions explorer:

![Azure extensions for Visual Studio Code](media/tutorial-vs-code-serverless-python/azure-extensions.png)

Some popular extensions are:

- [Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
- [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice). See the [Deploy to App Service tutorial](tutorial-deploy-app-service-on-linux-01.md)
- [Azure CLI Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli)
- [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)

> [!div class="nextstepaction"]
> [I'm done](https://docs.microsoft.com/python/azure/?view=azure-python)

[I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-functions-python&step=08-clean-up-resources)

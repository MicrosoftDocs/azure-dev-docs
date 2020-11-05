---
title: Remove costly remote Azure resources after deploying the Azure Functions application
description: Remove (clean up) remote Azure resources so they don't cost money. To clean up the resources, right-click the Function App in the Azure Functions explorer and select **Delete Function App**.
ms.topic: tutorial
ms.date: 08/31/2020
ms.custom: devx-track-js, contperfq2
---

# Clean up Azure resources for Azure Functions tutorial

[Previous step: Deploy the Functions app](tutorial-vscode-serverless-node-04.md)

## Remove remote Azure resources

The Functions App you created includes resources that can incur minimal costs (refer to [Functions Pricing](https://azure.microsoft.com/pricing/details/functions/)). To clean up the resources, right-click the Function App in the **Azure: Functions** explorer and select **Delete Function App**.

You can also visit the [Azure portal](https://portal.azure.com), select **Resource groups** from the left-side navigation pane, select the resource group that was created in the process of this tutorial, and then use the **Delete resource group** command.

[!INCLUDE [Next steps for using VSCode extensions](includes/tutorial-next-steps-vscode-extensions.md)]

[!INCLUDE [Next steps for using JavaScript on Azure](includes/tutorial-next-steps-js-azure.md)]

## Learn more about Azure Functions

* [Azure Functions developer guide](/azure/azure-functions/functions-reference)
* [Azure Functions JavaScript developer guide](/azure/azure-functions/functions-reference-node)
* [Securing Azure Functions](/azure/azure-functions/security-concepts)
* [Storage](/azure/azure-functions/storage-considerations) and [Performance](/azure/azure-functions/functions-best-practices) considerations

## Next steps

> [!div class="nextstepaction"]
> [I'm done](./how-to/develop-serverless-apps.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azurefunctions&step=clean-up-resources)
---
title: Remove costly remote Azure resources after deploying the Azure Functions 3.x application
description: Remove (clean up) remote Azure resources so they don't cost money. To clean up the resources, right-click the Function App in the Azure Functions explorer and select **Delete Function App**.
ms.topic: tutorial
ms.date: 10/04/2021
ms.custom: devx-track-js, contperf-fy21q2

---

# 6. Clean up Azure resources for Azure Functions tutorial

Use the Visual Studio Code extension, Azure Resource Groups, to delete the resource group and all resources within the group.

## Remove remote Azure resources

The Functions App you created includes resources that can incur minimal costs (refer to [Functions Pricing](https://azure.microsoft.com/pricing/details/functions/)).  

1. Find the resource group name, `cosmosdb-mongodb-function-resource-group`, in the list.
1. Right-click the resource group name and select **Delete**.

    :::image type="content" source="../../media/visual-studio-code-azure-resources-extension-remove-resource-group.png" alt-text="Use the Visual Studio Code extension, Azure Resource Groups, to delete the resource group and all resources within the group.":::

## Learn more about Azure Functions

* [Official YouTube Channel – Azure Functions](https://www.youtube.com/channel/UCtUYj6As_XFkOooUFnsJbYg)
* [Video: Migrating Your API to Serverless using Azure Functions - YouTube](https://youtu.be/89WXgaY-NqY)
* [Azure Functions JavaScript developer guide](/azure/azure-functions/functions-reference-node)
* [Securing Azure Functions](/azure/azure-functions/security-concepts)

[!INCLUDE [Next steps for using VSCode extensions](../../includes/tutorial-next-steps-vscode-extensions.md)]

[!INCLUDE [Next steps for using JavaScript on Azure](../../includes/tutorial-next-steps-js-azure.md)]

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure Function to manage Azure resources](../../how-to/with-web-app/azure-function-resource-group-management/introduction.md)

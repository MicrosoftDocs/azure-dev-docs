---
title: Get started using Azure Developer CLI (azd)
description: Learn how to get started with Azure Developer CLI
keywords: azure developer cli
author: puicchan
ms.author: puichan
ms.date: 6/1/2022
ms.topic: article
ms.custom: devx-track-azdevcli
ms.prod: azure
zone_pivot_group_filename: developer/azure-dev-cli/azd-zone-pivot-groups.json
zone_pivot_groups: azd-languages-set
---

# Get started using Azure Developer CLI (azd)

::: zone pivot="programming-language-nodejs"

We'll use the [ToDo Application with a Node.js API and Azure Cosmos DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) for this tutorial. Upon completion, you will get the code in your development environment and will be able to run commands to build, deploy, and monitor the application in Azure.

For more information including architecture diagram and the Azure resources you'll deploy, see the [README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-python"

We'll use the [ToDo Application with a Python API and Azure Cosmos DB API for MongoDB](https://github.com/azure-samples/todo-python-mongo) for this tutorial. Upon completion, you will get the code in your development environment and will be able to run commands to build, deploy, and monitor the application in Azure.

For more information including architecture diagram and the Azure resources you'll deploy, see the [README](https://github.com/Azure-Samples/todo-python-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-csharp"

We'll use the [ToDo Application with a C# API and Azure Cosmos DB SQL API](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) for this tutorial. Upon completion, you will get the code in your development environment and will be able to run commands to build, deploy, and monitor the application in Azure.

For more information including architecture diagram and the Azure resources you'll deploy, see the [README](https://github.com/Azure-Samples/todo-csharp-cosmos-sql/blob/main/README.md).

::: zone-end

## Configure your development environment

To run any sample template, pick a development environment. For more information about the pros and cons of the different development environment choices, see [Azure Developer CLI (azd) supported environments](azure-dev-cli-overview.md#supported-development-environments).    

Once you've selected a development environment, select one of the following tabs:

### [Bare metal](#tab/bare-metal)

[!INCLUDE [azd-baremetal](includes/azd-baremetal.md)]

### [DevContainer](#tab/devcontainer)

[!INCLUDE [azd-devcontainer](includes/azd-devcontainer.md)]

---

Once the `azd up` command completes, it displays several URLs:

- Azure portal link to view resources created
- ToDo web application frontend
- ToDo API application 

!["azd up output"](media/get-started/urls.png)

### What happened?

Upon successful completion of the `azd up` command, you'll note several changes to your environment:

- A local clone of the repo referenced by the azd template has been created in the directory where you ran `azd up`.
- The Azure resources referenced in the templates `README.md` file have been provisioned to the Azure subscription you specified when you ran `azd up`. You can view those Azure resources using the [Azure portal](https://portal.azure.com).
- The application has been built and deployed to Azure. Using the web application URL output from the `azd up` command, you can browse to the fully functional app.

### Clean up resources

When you no longer need the resources created in this article, do the following steps:

``` bash
azd down
```

## Troubleshooting/Known issues

[Troubleshoot common problems when using Azure Developer CLI (azd)](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Debug Azure apps using the Azure Developer CLI Visual Studio Code extension](how-to-use-vscode-extension-to-debug-locally.md)

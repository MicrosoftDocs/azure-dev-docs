---
title: Choose an Azure Developer CLI templates (preview)
description: Learn more about the role of templates with the Azure Developer CLI (azd).
author: hhunter-ms
ms.author: hannahhunter
ms.date: 08/05/2022
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Azure Developer CLI templates

Azure Developer CLI templates are sample repositories created using the Azure Developer CLI conventions so that you can use `azd`. The `azd` templates extend beyond “Hello World!” to configure continuous integration and delivery (CI/CD) pipelines. These pipelines serve as the foundation from which you can build and customize for your own solutions. Each template includes:

- Application code
- Infra-as-code files (written in Bicep) needed to provision the Azure resources
- An `azure.yaml` file that describes your application

These templates are extensible and customizable to your specific use case.

## Templates in preview

As part of Azure Developer CLI preview, we’ve authored an initial set of template applications written in:

- Python
- JavaScript/TypeScript
- C#

Each template were written for hosts such as:

- Azure App Service
- Azure Container Apps
- Azure Static Web Apps + Function Apps

Check back for our growing list of templates.

For information on authoring your own template or “templatizing” an existing application, [see our Developer Hub](https://aka.ms/azure-dev/devhub).

### Choose a template

The quickest way to get started with Azure Developer CLI is to refer to the README in any of the following Azure Developer CLI enabled templates. 

Select your preferred programming language to choose a template.

### [Node.js](#tab/nodejs)

| Template | App host | Database |
| -------- | -------- | -------- |
| [ToDo NodeJs Mongo](https://github.com/azure-samples/todo-nodejs-mongo) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB API for Mongo](/azure/cosmos-db/mongodb/mongodb-introduction) |  
| [ToDo NodeJs Mongo ACA](https://github.com/azure-samples/todo-nodejs-mongo-aca) | [Azure Container Apps](/azure/container-apps/overview) | [Azure Cosmos DB API for Mongo](/azure/cosmos-db/mongodb/mongodb-introduction) |
| [ToDo NodeJs Mongo SWA + Functions](https://github.com/azure-samples/todo-nodejs-mongo-swa-func) | [Azure Static Web Apps](/azure/static-web-apps/), [Azure Functions](/azure/azure-functions/) | [Azure Cosmos DB API for Mongo](/azure/cosmos-db/mongodb/mongodb-introduction) |

### [Python](#tab/python)

| Template | App host  | Database |
| -------- | --------- | -------- |
| [ToDo Python Mongo](https://github.com/azure-samples/todo-python-mongo) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB API for Mongo](/azure/cosmos-db/mongodb/mongodb-introduction)  |  
| [ToDo Python Mongo ACA](https://github.com/azure-samples/todo-python-mongo-aca) | [Azure Container Apps](/azure/container-apps/overview) |  [Azure Cosmos DB API for Mongo](/azure/cosmos-db/mongodb/mongodb-introduction) |  
| [ToDo Python Mongo SWA + Functions](https://github.com/azure-samples/todo-python-mongo-swa-func) | [Azure Static Web Apps](/azure/static-web-apps/), [Azure Functions](/azure/azure-functions/) |  [Azure Cosmos DB API for Mongo](/azure/cosmos-db/mongodb/mongodb-introduction)|

### [C#](#tab/csharp)

| Template | App host  | Database |
| -------- | --------- | -------- |
| [Todo C# Cosmos DB (SQL)](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB SQL API](/learn/modules/intro-to-azure-cosmos-db-core-api/) |

## Authoring templates

The Azure Developer CLI team plans to author more templates in the future to cover even more developer scenarios. If you author your own templates, you can add the `azd-templates` tag to your repository on GitHub. That way, other developers can find, fork, and build upon your template for their own use case. 

You can also open an issue on [our GitHub repository](https://github.com/Azure/azure-dev) if there’s a use case and template that you would like to see created.

## Next steps

> [!div class="nextstepaction"]
> [Run azd](./run-azd.md)

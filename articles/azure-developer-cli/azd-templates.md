---
title: Azure Developer CLI templates (preview)
description: Learn more about the role of templates with the Azure Developer CLI (azd).
author: alexwolfmsft
ms.author: alexwolf
ms.date: 12/09/2022
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Azure Developer CLI templates (preview)

Azure Developer CLI templates are sample repositories created using the Azure Developer CLI conventions so that you can use `azd`. The `azd` templates extend beyond “Hello World!” to provision Azure resources, configure continuous integration and delivery (CI/CD) pipelines, and more. These templates serve as the foundation from which you can build and customize for your own solutions. Each template includes:

- Application code
- Infra-as-code files (Bicep or Terraform) needed to provision the Azure resources
- An `azure.yaml` file that describes your application

These templates are extensible and customizable to your specific use case.

## Templates in preview

As part of Azure Developer CLI preview, we’ve authored an initial set of template applications written in:

- Python
- JavaScript/TypeScript
- C#
- Java

Each template was written for hosts such as:

- Azure App Service
- Azure Container Apps
- Azure Static Web Apps
- Azure Function Apps
- Azure Kubernetes Service

Check back for our growing list of templates.

For information on authoring your own template or “templatizing” an existing application, [read our guide on making your template `azd`-compatible](./make-azd-compatible.md).

## Choose a template

[Install the Azure Developer CLI](./install-azd.md) and then select your preferred programming language to choose a template.

You can also run the following command to list all supported, azd-compatible templates.

```azdeveloper
azd template list
```

Refer to the README in any of the following Azure Developer CLI enabled templates for more instructions and information.

### [C#](#tab/csharp)

| Template      | App host | Tech stack |
| ----------- | ----------| ----------- |
| [ToDo application with C# API and Azure Cosmos DB](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB for NoSQL](/learn/modules/intro-to-azure-cosmos-db-core-api/), Bicep |
| [ToDo application with C# API and Azure SQL Database](https://github.com/azure-samples/todo-csharp-sql) | [Azure App Service](/azure/app-service/) | [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview), Bicep |
| [ToDo C# Azure SQL + SWA + Functions](https://github.com/Azure-Samples/todo-csharp-sql-swa-func) | [Azure Static Web Apps](/azure/static-web-apps/), [Azure Functions](/azure/azure-functions/) | [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview), Bicep |


### [Java](#tab/java)

| Template      | App host | Tech stack	 | 
| ----------- | ----------| ----------- | 
| [ToDo Java Mongo](https://github.com/Azure-Samples/todo-java-mongo) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB API for Mongo](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep | 
| [ToDo Java Mongo ACA](https://github.com/Azure-Samples/todo-java-mongo-aca) | [Azure Container Apps](/azure/container-apps/overview) | [Azure Cosmos DB API for Mongo](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep | 


### [Node.js](#tab/nodejs)

| Template      | App host | Tech stack |
| ----------- | ----------| ----------- |
| [ToDo NodeJs MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep |  
| [ToDo NodeJs MongoDB (Terraform)](https://github.com/azure-samples/todo-nodejs-mongo-terraform) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Terraform |  
| [ToDo NodeJs MongoDB ACA](https://github.com/azure-samples/todo-nodejs-mongo-aca) | [Azure Container Apps](/azure/container-apps/overview) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep |
| [ToDo NodeJs MongoDB SWA + Functions](https://github.com/azure-samples/todo-nodejs-mongo-swa-func) | [Azure Static Web Apps](/azure/static-web-apps/), [Azure Functions](/azure/azure-functions/) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep |
| [ToDo NodeJs MongoDB AKS](https://github.com/Azure-Samples/todo-nodejs-mongo-aks) |  [Azure Kubernetes Service](/azure/aks/) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep

### [Python](#tab/python)

| Template      | App host | Tech stack |
| ----------- | ----------| ----------- |
| [ToDo Python MongoDB](https://github.com/azure-samples/todo-python-mongo) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep  |  
| [ToDo Python MongoDB (Terraform)](https://github.com/Azure-Samples/todo-python-mongo-terraform) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Terraform  |  
| [ToDo Python MongoDB ACA](https://github.com/azure-samples/todo-python-mongo-aca) | [Azure Container Apps](/azure/container-apps/overview) |  [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep |  
| [ToDo Python MongoDB SWA + Functions](https://github.com/azure-samples/todo-python-mongo-swa-func) | [Azure Static Web Apps](/azure/static-web-apps/), [Azure Functions](/azure/azure-functions/) |  [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep|

---

For more community contributed templates, check out our template gallery: [Awesome AZD](https://aka.ms/awesome-azd).

### Guidelines for using `azd` templates

Please note that each template that you use with Azure Developer CLI is licensed by its respective owner (which may or may not be Microsoft) under the agreement which accompanies the template. It is your responsibility to determine what license applies to any template you choose to use. 

Microsoft is not responsible for any non-Microsoft templates and does not screen these templates for security, privacy, compatibility, or performance issues. The templates you use with Azure Developer CLI, including those provided from Microsoft, are not supported by any Microsoft support program or service. Any Microsoft-provided templates are provided AS IS without warranty of any kind.

## Authoring templates

The Azure Developer CLI team plans to author more templates in the future to cover even more developer scenarios. If you author your own templates, you can add the `azd-templates` topic to your repository on GitHub. That way, other developers can find, fork, and build upon your template for their own use case.

You can also open an issue on [our GitHub repository](https://github.com/Azure/azure-dev) if there’s a use case and template that you would like to see created.

## Next steps

> [!div class="nextstepaction"]
> [Run azd init with an azd template](./get-started.md)

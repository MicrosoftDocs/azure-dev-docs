---
title: Azure Developer CLI templates
description: Browse dev-ified templates to try out Azure Developer CLI using an Application template
author: puicchan
ms.author: puichan
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---
# Azure Developer CLI Templates

A template can deploy to two or more supported hosts. Today, each Azure Developer CLI template is built for specific host (Azure compute service.) If you haven't finalized the Azure compute service for hosting your application, the following flowchart can help to choose the right sample to use as a base for your project:
!["Host Decision Tree"](media/azure-dev-cli-templates/host-decision-tree.png)

> [!NOTE]
> The perfect solution is dependent on your use case and team. You can refer to these additinoal recommended resources for guidance: [Choose an Azure compute service](/azure/architecture/guide/technology-choices/compute-decision-tree) and [Comparing Container Apps with other Azure container options](https://docs.microsoft.com/en-us/azure/container-apps/compare-options).

### ToDo Application

Each repo contains a complete sample ToDo application with a web frontend built in React.js and the backend API built using a specific `azd` supported language. 

| Template      | Compute Service | Language (API layer) | Tech Stack	 | 
| ----------- | ----------| ----------- | --- | 
| [ToDo NodeJs Mongo](https://github.com/azure-samples/todo-nodejs-mongo) | Azure App Service | Node.js | Azure Cosmos DB API for Mongo, Azure Monitor |  
| [ToDo Python Mongo](https://github.com/azure-samples/todo-python-mongo) | Azure App Service | Python (FastAPI) | Azure Cosmos DB API for Mongo, Azure Monitor  |  
| [ToDo C# Mongo](https://github.com/Azure-Samples/todo-csharp-mongo) | Azure App Service | C# | Azure Cosmos DB API for Mongo, Azure Monitor | 
| [ToDo C# Azure SQL](https://github.com/Azure-Samples/todo-csharp-sql) | Azure App Service | C# | Azure SQL, Azure Monitor | 
| [ToDo C# Cosmos DB (SQL)](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) | Azure App Service |  C# | Azure Cosmos DB SQL API, Azure Monitor | 
| [ToDo NodeJs Mongo ACA](https://github.com/azure-samples/todo-nodejs-mongo-aca) | Azure Container Apps | Node.js | Azure Cosmos DB API for Mongo, Azure Monitor |
| [ToDo Python Mongo ACA](https://github.com/azure-samples/todo-python-mongo-aca) | Azure Container Apps | Python (FastAPI)|  Azure Cosmos DB API for Mongo, Azure Monitor |  


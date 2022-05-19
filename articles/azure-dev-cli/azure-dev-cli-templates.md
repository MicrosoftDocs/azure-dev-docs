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

The quickest way to get started with `azd` is to refer to the README in an Azure Developer enabled template. Pick a template in below tables grouped by hosts.

## Host: Azure App Service

Each repository contains a complete sample ToDo application with a web frontend built in React.js and the backend API built using a specific `azd` supported language. Both frontend and backend applications are deployed to [Azure App Service](/azure/app-service/).

| Template      | Language (API layer) | Tech Stack	 | 
| ----------- | ----------| ----------- | 
| [ToDo NodeJs Mongo](https://github.com/azure-samples/todo-nodejs-mongo) | Node.js | Azure Cosmos DB API for Mongo, Azure Monitor |  
| [ToDo Python Mongo](https://github.com/azure-samples/todo-python-mongo) | Python (FastAPI) | Azure Cosmos DB API for Mongo, Azure Monitor  |  
| [ToDo C# Cosmo DB (SQL)](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) | C# | Azure Cosmos DB SQL API, Azure Monitor | 

## Host: Azure Container Apps

Each repository contains a complete sample ToDo application with a web frontend built in React.js and the backend API built using a specific `azd` supported language. Both frontend and backend applications are deployed to [Azure Container Apps](/azure/container-apps/overview).

| Template      | Language (API layer) | Tech Stack	 | 
| ----------- | ----------| ----------- | 
| [ToDo NodeJs Mongo ACA](https://github.com/azure-samples/todo-nodejs-mongo-aca) | Node.js | Azure Cosmos DB API for Mongo, Azure Monitor |
| [ToDo Python Mongo ACA](https://github.com/azure-samples/todo-python-mongo-aca) | Python (FastAPI)|  Azure Cosmos DB API for Mongo, Azure Monitor |  


## Picking the right host

A template can deploy to two or more supported hosts. Today, each Azure Developer CLI template is built for specific host (Azure compute service.) If you haven't finalized the Azure compute service for hosting your application, the following flowchart can help to choose the right sample to use as a base for your project:

!["Host Decision Tree"](media/azure-dev-cli-templates/host-decision-tree.png)

> [!NOTE]
> The perfect solution is dependent on your use case and team. You can refer to these additinoal recommended resources for guidance: [Choose an Azure compute service](/azure/architecture/guide/technology-choices/compute-decision-tree) and [Comparing Container Apps with other Azure container options](https://docs.microsoft.com/en-us/azure/container-apps/compare-options).

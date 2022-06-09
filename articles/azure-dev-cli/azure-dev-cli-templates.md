---
title: Azure Developer CLI (azd) templates
description: Browse dev-ified templates to try out Azure Developer CLI using an Application template
author: puicchan
ms.author: puichan
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---

# Azure Developer CLI (azd) templates

The quickest way to get started with Azure Developer CLI (azd) is to refer to the README in an Azure Developer CLI enabled template. This article lists all the templates grouped by Azure service. If you're using azd, select the template you want to use and reference it in the [Clone your first app](get-started.md) article.

## Host: Azure App Service

Each repository contains a complete sample ToDo application with a web frontend built in React.js and the backend API built using a specific azd supported language. Both frontend and backend applications are deployed to [Azure App Service](https://docs.microsoft.com/azure/app-service/).

| Template      | Language (API layer) | Tech Stack	 | 
| ----------- | ----------| ----------- | 
| [ToDo NodeJs Mongo](https://github.com/azure-samples/todo-nodejs-mongo) | Node.js | Azure Cosmos DB API for Mongo, Azure Monitor |  
| [ToDo Python Mongo](https://github.com/azure-samples/todo-python-mongo) | Python (FastAPI) | Azure Cosmos DB API for Mongo, Azure Monitor  |  
| [ToDo C# Cosmo DB (SQL)](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) | C# | Azure Cosmos DB SQL API, Azure Monitor | 

## Host: Azure Container Apps

Each repository contains a complete sample ToDo application with a web frontend built in React.js and the backend API built using a specific azd supported language. Both frontend and backend applications are deployed to [Azure Container Apps](https://docs.microsoft.com/azure/container-apps/overview).

| Template      | Language (API layer) | Tech Stack	 | 
| ----------- | ----------| ----------- | 
| [ToDo NodeJs Mongo ACA](https://github.com/azure-samples/todo-nodejs-mongo-aca) | Node.js | Azure Cosmos DB API for Mongo, Azure Monitor |
| [ToDo Python Mongo ACA](https://github.com/azure-samples/todo-python-mongo-aca) | Python (FastAPI)|  Azure Cosmos DB API for Mongo, Azure Monitor |  

## Picking the right host

A template can deploy to two or more supported hosts. Today, each azd template is built for specific host (Azure compute service.) If you haven't finalized the Azure compute service for hosting your application, the following flowchart can help to choose the right sample to use as a base for your project:

!["Host Decision Tree"](media/azure-dev-cli-templates/host-decision-tree.png)

> [!NOTE]
> The perfect solution is dependent on your use case and team. You can refer to these additional recommended resources for guidance: [Choose an Azure compute service](/azure/architecture/guide/technology-choices/compute-decision-tree) and [Comparing Container Apps with other Azure container options](/azure/container-apps/compare-options).

## Next steps

> [!div class="nextstepaction"] 
> [Clone your first app using Azure Developer CLI (azd)](get-started.md)

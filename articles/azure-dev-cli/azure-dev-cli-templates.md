---
title: Azure Developer CLI templates
description: Browse dev-ified templates to try out Azure Developer CLI using an Application template
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---
# Azure Developer CLI Templates

Each Azure Developer CLI template is built to support specific host (Azure service) and programming language. 

If you're building a new application, use the following flowchart to choose a template (host) to use as a base for your project:
!["Host Decision Tree"](media/azure-dev-cli-templates/host-decision-tree.png)

> [!NOTE]
> There's no perfect solution for every use case and every team. Additional recommended resources: [Choose an Azure compute service](/azure/architecture/guide/technology-choices/compute-decision-tree) and [Comparing Container Apps with other Azure container options](https://docs.microsoft.com/en-us/azure/container-apps/compare-options).

| Template      | Description	 | Host	| Language | Status |
| ----------- | ----------- | --- | --- | --- |
| [To Do NodeJs Mongo](https://github.com/azure-samples/todo-nodejs-mongo) | Complete sample To Do application that demonstrates how to build an Azure solution using Node.js, Cosmos DB (Mongo) for storage, and Azure Monitor for monitoring and logging. | Azure App Service | Node.js | Private Preview |
| [To Do Python Mongo](https://github.com/azure-samples/todo-python-mongo) | Complete sample To Do application that demonstrates how to build an Azure solution using Python (FastAPI), Cosmos DB (Mongo) for storage, and Azure Monitor for monitoring and logging.  | Azure App Service | Python | Private Preview |
| To Do C# Mongo | Complete sample To Do application that demonstrates how to build an Azure solution using C#, Cosmos DB (Mongo) for storage, and Azure Monitor for monitoring and logging. | Azure App Service | .NET | Coming soon |
| To Do C# Azure SQL | This repo contains a complete sample To Do application that demonstrates how to build an Azure solution using C#, Azure SQL for storage, and Azure Monitor for monitoring and logging. | Azure App Service | .NET | Coming soon |
| To Do C# Cosmos DB (SQL) | Complete sample To Do application that demonstrates how to build an Azure solution using C#, Cosmos DB (SQL) for storage, and Azure Monitor for monitoring and logging | Azure App Service | .NET | Coming soon |
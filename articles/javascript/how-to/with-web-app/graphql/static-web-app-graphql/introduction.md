---
title: GraphQL Azure Function Introduction and prerequisites 
description: Learn how to build a static web app and API that uses the Apollo GraphQL client and server libraries to build and run a trivia game app.
ms.topic: how-to
ms.date: 07/26/2021
ms.custom: devx-track-js
---

# 1. Build and deploy a GraphQL static Web app to Azure

In this article series, locally build then deploy a Trivia game, which uses GraphQL to manage data between the client and serverless API. 

* [**Sample code**](https://github.com/Azure-Samples/js-e2e-graphql-cosmosdb-static-web-app)

[!INCLUDE [Create or use existing Azure Subscription ](../../../../includes/environment-subscription-h2.md)]

## Prerequisites

- [Node.js and npm](https://nodejs.org/en/download) - installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
    - [Azure Static Web Apps](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) - used to deploy React app to Azure Static Web app.
    - [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) - used to create the Cosmos DB.
- [Azure Cosmos DB local emulator](/azure/cosmos-db/local-emulator) - allows you to use a local Cosmos DB. 
- [Git](https://git-scm.com/downloads) - used to push to GitHub - which activates the GitHub action.
- [GitHub account](https://github.com/join) - to fork and push to a repo

## Application architecture

The application architecture is shown in the following diagram:

:::image type="content" source="../../../../media/how-to-database-graphql/architectural-overview.png" alt-text="Architectural image of graphQL client and server in Azure.":::

The React client constructs a graphQL query using the Apollo client package and calls the API to retrieve the data. The API uses the Apollo server to resolve the graphQL query and pass the information to a SQL query. The SQL query is sent to the Cosmos DB and returns the SQL results. The graphQL resolver returns the results in a well-formatted graphQL data object. 

The React client and API are hosted in an Azure Static web app. The data is stored in a Cosmos DB SQL database.

## Next steps

* Learn the basic concepts of [GraphQL](graphql-basics.md) for this article series.
* Use the sample application in your [local development environment](local-development.md)


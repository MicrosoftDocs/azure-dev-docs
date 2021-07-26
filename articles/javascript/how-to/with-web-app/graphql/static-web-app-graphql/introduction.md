---
title: GraphQL Azure Functions introduction and prerequisites 
description: Learn how to build a static web app and API that uses the Apollo GraphQL client and server libraries to build and run a trivia game app.
ms.topic: how-to
ms.date: 07/26/2021
ms.custom: devx-track-js
---

# 1. Build and deploy a GraphQL static Web app to Azure

In this article series, we're going to create GraphQL server and web application to communicate with it. Our GraphQL server will use Cosmos DB to store data and Azure Static Web Apps to host the application.

* [**Sample code**](https://github.com/Azure-Samples/js-e2e-graphql-cosmosdb-static-web-app)

[!INCLUDE [Create or use existing Azure Subscription ](../../../../includes/environment-subscription-h2.md)]

## Prerequisites

- [Node.js and npm](https://nodejs.org/en/download) - installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
    - [Azure Static Web Apps](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) - used to deploy React app to Azure Static Web Apps.
    - [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) - used to create the Cosmos DB.
- [Azure Cosmos DB local emulator](/azure/cosmos-db/local-emulator) - allows you to use a local Cosmos DB. 
- [Git](https://git-scm.com/downloads) - used to push to GitHub - which activates the GitHub action.
- [GitHub account](https://github.com/join) - to fork and push to a repo

## Application architecture

The application architecture is shown in the following diagram:

:::image type="content" source="../../../../media/how-to-database-graphql/architectural-overview.png" alt-text="Architectural image of graphQL client and server in Azure.":::

The React client constructs a GraphQL query using a GraphQL client package (we'll be using Apollo) and calls the API to retrieve the data. Using a GraphQL server (we'll be using the Apollo server implementation) the GraphQL query is converted into resolver calls which we can use to pass the information to a Cosmos DB SQL query. The SQL query is sent to Cosmos DB and returns the data requested. The GraphQL resolver returns the results in a well-formatted GraphQL data object. 

The React client and API are hosted in an Azure Static Web Apps. The data is stored in a Cosmos DB SQL database.

## Next steps

* Learn the basic concepts of [GraphQL](graphql-basics.md) for this article series.
* Use the sample application in your [local development environment](local-development.md)

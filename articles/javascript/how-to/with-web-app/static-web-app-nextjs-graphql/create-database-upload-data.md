---
title: "Trivia game: Upload data to Cosmos DB"
description: Create a Next.js GraphQL app with server-side rendering to generate a trivia game.
ms.topic: how-to
ms.date: 01/10/2023
ms.custom: devx-track-js
#intent: Create Next.js GraphQL app with SSR to deploy as SWA hybrid. 
---

# Trivia game: Create and populate a Cosmos DB database

The trivia game stores the questions and answers in a Cosmos DB database. The Next.js app requests the data through a GraphQL layer. 

## Create a Cosmos DB resource for NoSQL API

Hopefully reusing Sidney's includes here

## Add Cosmos DB secrets to .env.local

1. Open the `.env.local` file at the root of the sample project.
1. Copy the key and resource name from the previous section into the appropriate variables:

    ```text
    AZURE_COSMOSDB_ENDPOINT=https://REPLACE-WITH-YOUR-COSMOS-DB-RESOURCE-NAME.documents.azure.com:443/
    AZURE_COSMOSDB_KEY=REPLACE-WITH-YOUR-COSMOS-DB-KEY
    ``` 

## Upload trivia data to database

Upload the catalog of trivia questions from the `./trivia.json` to your new Cosmos DB resource.

1. Build the project, including the upload script.

    ```bash
    npm run upload:build
    ```

1. Upload the data.

    ```bash
    npm run upload:start
    ```

1. Use the Visual Studio extension for Cosmos DB to view the database, collection, and individual documents.

    :::image type="content" source="../../../media/static-web-app-nextjs-graphql/visual-studio-code-cosmos-db-nosql-trivia-data-upload.png" alt-text="Screenshot of Visual Studio Code using the Azure Databases extension to show the database, collection, and uploaded doc for the trivia game.":::

## Create Translator resource

## Add Cosmos DB to .env.local
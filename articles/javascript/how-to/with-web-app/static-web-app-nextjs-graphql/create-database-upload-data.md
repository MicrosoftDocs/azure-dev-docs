---
title: "Trivia game: Upload data to Cosmos DB"
description: Create a Cosmos DB NoSQL database and upload data for the trivia game.
ms.topic: how-to
ms.date: 01/10/2023
ms.custom: devx-track-js
#intent: Create Next.js GraphQL app with SSR to deploy as SWA hybrid. 
---

# Trivia game: Create and populate a Cosmos DB database

The trivia game stores the questions and answers in a Cosmos DB database. The Next.js app requests the data through a GraphQL layer. 

## Create a Cosmos DB resource for NoSQL API

[!INCLUDE [Create resource tabbed conceptual - ARM, Azure CLI, PowerShell, Portal](~/../azure-docs-pr/articles/cosmos-db/nosql/includes/create-resources.md)]

## Add Cosmos DB secrets to .env.local

Add the Cosmos DB secrets to a local secrets file.

1. Copy the `.env.sample` file to a new file named `.env.local`
1. Open the [.env.local](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/.env.sample) file at the root of the sample project.
1. Copy the key and resource name from the previous section into the appropriate variables:

    ```text
    AZURE_COSMOSDB_ENDPOINT=https://REPLACE-WITH-YOUR-COSMOS-DB-RESOURCE-NAME.documents.azure.com:443/
    AZURE_COSMOSDB_KEY=REPLACE-WITH-YOUR-COSMOS-DB-KEY
    ``` 

## Upload trivia data to database

Upload the catalog of trivia questions from the [`./trivia.json`](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/trivia.json) to your new Cosmos DB resource.

This section's build and start scripts are specific to uploading the data and won't be needed after this initial upload.

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

### Review code to upload data

Upload the [./trivia.json](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/trivia.json) file's data with the following code in the sample application:

* [./azure/uploadData.tx](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/azure/uploadData.ts)
* [./azure/azureCosmosdb.ts](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/azure/azureCosmosdb.ts)

This code provides the following functionality:

* Create new database and container
* Read `./trivia.json` into JSON object
* Upload data in batches of 10 trivia questions at a time

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/azure/uploadData.ts" ::: 

## Play the trivia game

Start and play the game in the default language, **English**. 

1. Start the game. 

    ```bash
    npm run dev
    ```

1. Open a browser to play the game.

    ```bash
    http://localhost:3000
    ```

1. Play through the game.

    :::image type="content" source="../../../media/static-web-app-nextjs-graphql/web-browser-trivia-game-english.png" alt-text="Screenshot of web browser showing first question of trivia game.":::

## Next.js integration with Cosmos DB

The complete source code is provided in the sample. Learn how Next.js integrates GraphQL on the client and server to use the Cosmos DB database. 

### Client: review code to get question and answers

The client asks for a trivia question, and the answers. To ensure the new question is different from the last question, the last question ID is provided, along with the maximum number of items in the database and the cultural language of the response. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="12-28" highlight="1":::

That query is wrapped in a **useQuery** hook to pass the request to the Next.js API layer.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="65-74" highlight="3":::


When the data flows back to the client component, the **useEffect** hook sets the state for the question.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="85-89":::

Then the question is displayed.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="109-116":::

Some of items for display, such as `wasCorrect` and `totalQuestions` will be fetched and discussed in later sections of this article. 

### Server: review code to get question and answers

The client request passes through the Apollo server's [`/graphql`](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/pages/api/graphql.ts) API to the **Query** resolver, shown below, to get a question for the game from the database. The resolver calls the data source.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/resolvers/resolvers.ts" range="8-33":::

The data source uses a SQL Query to fetch the data from Cosmos DB. The query ensures the question is different from the last question. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/datasources/QuestionDataSource.ts" ::: 

A field resolver takes the answers and randomized them before returning the question.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/resolvers/resolvers.ts" range="34-41":::

### Client: review code to validate answer

The user's answer is a mutation, which includes the question ID, selected answer. The returned response includes whether the answer was correct, and then separately the correct answer text.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="30-45" highlight="1":::  

That mutation is wrapped in a **useMutation** hook to pass the request to the Next.js API layer.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="60-63" highlight="4":::  

When the data flows back to the client component, a **useEffect** hook set the component's state for the answer. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="76-83" highlight="4":::  

Then the results are displayed.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="118-155" highlight="4":::  

### Server: review code to validate answer

The client request passes through the Apollo server's [`/graphql`](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/pages/api/graphql.ts) API to the **Mutation** resolver, shown below. Because the data is already known, the resolver doesn't need to call the database but instead just compare the selected answer with the correct answer.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/resolvers/resolvers.ts" range="43-74":::

The Cosmos DB data source provides convenience methods, including **findOneById**, so you don't need to write these SQL queries. The data source provides caching to make sure you only go to the cloud database when necessary.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/datasources/QuestionDataSource.ts" ::: 

## Next step

> [!div class="nextstepaction"]
> [Set up translation >>](create-translator-resource.md)

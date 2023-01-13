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

## Code to upload data

Upload the `./trivia.json` file's data with the following code in the sample found at `./azure/azureCosmosdb.ts`.

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

## Next.js API layer for GraphQL

The GraphQL API layer provides a database datasource and database resolvers.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame//pages/api/graphql.ts" highlight="23, 29,30"::: 

### Database resolvers

The trivia questions, the correct answers, and the wrong answers are returned from the database in the Query:question. To understand this better, database the schema for a question is:

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/models/QuestionDbModel.ts" ::: 

The code flow from the API layer to the database includes the following:

* API Layer: `/graphql` - [`./pages/api/graphql.ts`](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/pages/api/graphql.ts)
* GraphQL resolvers to work with the data

    |Resolver|method|Purpose|
    |--|--|--|
    |Query|question|From the database, gets all the data for the game including questions, the correct answer, and the wrong answers.|
    |Question|answers|From data in memory, returns the correct answer and the 3 incorrect answers in a randomized order.|
    |Mutation|validateAnswer|From data in memory, checks the selected answer against the correct answer.|

### Query:question gets data from database

The question is requested from the client-side **Question** component with the following GraphQL query. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="12-28":::

That query is wrapped in a **useQuery** hook to pass the request to the Next.js API layer.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="65-74":::

The client request passes through the `/graphql` API to the **Query** resolver to get a question for the game from the database. The resolver calls the data source.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/resolvers/resolvers.ts" range="8-33":::

The data source uses a SQL Query to fetch the data from Cosmos DB. The query ensures the question is different from the last question.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/datasources/QuestionDataSource.ts" ::: 

When the data flows back to the client component, the **useEffect** hook sets the question.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="85-89":::

Then the question is displayed.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="109-116":::


### Question:answers gets the answers to the question

The following code gets the answers (correct and incorrect) in a randomized order from the question data in memory. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/resolvers/resolvers.ts" range="8-33":::

### Mutation:validateAnswer gets the answers to the question

The following code validates the selected answer with the correct answer from the question data in memory. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/resolvers/resolvers.ts" range="43-74":::

## Next.js client code to request and display the trivia game question

## Next step

> [!div class="nextstepaction"]
> [Set up translation >>](create-translator-resource.md)

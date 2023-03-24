---
title: "Trivia game: upload data to Cosmos DB"
description: Create a Cosmos DB NoSQL database and upload data for the trivia game.
ms.topic: how-to
ms.date: 01/19/2023
ms.custom: devx-track-js, devx-graphql
#intent: Create Next.js GraphQL app with SSR to deploy as SWA hybrid. 
---

# Trivia game: Create and populate a Cosmos DB database

The trivia game stores the questions and answers in a Cosmos DB database. The Next.js app requests the data through a GraphQL layer. 

## Create a Cosmos DB resource for NoSQL API

Complete the **Create an Azure Cosmos DB account** step in this [Cosmos DB quickstart](/azure/cosmos-db/nosql/quickstart-nodejs?tabs=azure-portal%2Cwindows#create-an-azure-cosmos-db-account) with the following caveats:

* Use the resource group you created for this tutorial series.
* Copy the **resource name** and **key** for Cosmos DB to use in the next step.

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

1. Upload the data.

    ```bash
    npm run upload
    ```

1. Use the Azure portal for your Cosmos DB NoSQL resource to view the database, collection, and individual documents.

    :::image type="content" source="../../../media/static-web-app-nextjs-graphql/azure-portal-cosmos-db-nosql-data-explorer-trivia-question.png" alt-text="Screenshot of Azure portal for your Cosmos DB NoSQL resource to show the database, collection, and uploaded doc for the trivia game.":::

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

1. Stop the game at the terminal.

    #### [Windows](#tab/win) 

    <kbd>Ctrl</kbd> + <kbd>c</kbd> 

    #### [Mac](#tab/mac) 

    <kbd>Command</kbd> + <kbd>.</kbd> 


## Next.js integration with Cosmos DB

Learn how the sample Next.js application integrates GraphQL on the client and server to use the Cosmos DB database. 

### Client: get question and answers

The client asks for a trivia question, and the answers. To ensure the new question is different from the last question, the last question ID is provided, along with the maximum number of items in the database and the cultural language of the response. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" id="GetQuestionGraphQL" :::

That query is wrapped in a **useQuery** hook to pass the request to the Next.js API layer.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" id="GetQuestionUseQuery" :::


When the data flows back to the client component, the **useEffect** hook sets the state for the question.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" id="GetQuestionUseEffect" :::

Then the question is displayed.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="125-133" ::: 

### Server: get question and answers

The client request passes through the Apollo server's [`/graphql`](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/pages/api/graphql.ts) API to the **Query** resolver in `./pages/api/resolvers/resolvers.ts`, shown below, to get a question for the game from the database. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/resolvers/resolvers.ts" id="GetQuestionGraphQLResolverQuery" highlight="11":::

The resolver calls the Cosmos DB data source. The data source uses a SQL Query to fetch the data from Cosmos DB in `/pages/api/datasources/QuestionDataSource.ts`. The query ensures the question is different from the last question. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/datasources/QuestionDataSource.ts" highlight="15" ::: 

A field resolver randomizes all the answers (correct and incorrect) before returning the question.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/resolvers/resolvers.ts" id="GetQuestionGraphQLResolverFieldQuestion":::

### Client: validate answer

The user's answer is a mutation, which includes the question ID, selected answer in `/components/Question.tsx`. The returned response includes whether the answer was correct, and then separately the correct answer text.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" id="ValidateAnswerGraphQL" :::  

The mutation is wrapped in a **useMutation** hook to pass the request to the Next.js API layer.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" id="ValidateAnswerUseMutation" :::  

When the data flows back to the client component, a **useEffect** hook set the component's state for the answer. This allows the UI to display based on correctness of the user's answer.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" id="ValidateAnswerUseEffect" :::  

Then the results are displayed. The first block of code displays if the answer is _not_ correct. The second block of code displays if the answer is correct.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="134-171" highlight="2,19":::  

### Server: validate answer

The client request passes through the Apollo server's [`/graphql`](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/pages/api/graphql.ts) API to the **Mutation** resolver in `/pages/api/resolvers/resolvers.ts`, shown below. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/resolvers/resolvers.ts" id="ValidateAnswerGraphQLResolverMutation" highlight="11":::

The Cosmos DB data source provides convenience methods, including **findOneById**, so you don't need to write these SQL queries. 

## Next step

> [!div class="nextstepaction"]
> [Set up translation >>](create-translator-resource.md)

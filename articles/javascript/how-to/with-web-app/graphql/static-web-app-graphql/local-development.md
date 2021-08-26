---
title: Build a static web app with GraphQL
description: Learn how to locally build a static web app and API that uses the Apollo GraphQL client and server libraries.
ms.topic: how-to
ms.date: 07/26/2021
ms.custom: devx-track-js
---

# 3. Local development of a GraphQL static web app

In this article, learn how to locally build a static web app and API that uses the Apollo GraphQL client and server libraries.

## Fork the sample GitHub repo

Because static web apps deploy from a GitHub repo and you need to be able to push your changes to that repo, this section helps you create your own repo.

1. Open the sample repo in a browser: [https://github.com/azure-samples/js-e2e-graphql-cosmosdb-static-web-app](https://github.com/azure-samples/js-e2e-graphql-cosmosdb-static-web-app).

1. Fork the repository into your own account by selecting **Fork**.

    :::image type="content" source="../../../../media/how-to-database-graphql/fork-github-sample-repo.png" alt-text="Partial screenshot of browser showing the sample GitHub repository, with the Fork button highlighted." lightbox="../../../../media/how-to-database-graphql/fork-github-sample-repo.png":::

1. In a bash terminal on your local machine, clone your fork. Replace `YOUR-ACCOUNT` with your own account name. 

    ```bash
    git clone https://github.com/YOUR-ACCOUNT/js-e2e-graphql-cosmosdb-static-web-app
    ```

1. In a bash terminal, install the dependencies. 

    ```bash
    cd "js-e2e-graphql-cosmosdb-static-web-app" && \
    npm install && \
    cd api && \
    npm install && \
    cd .. 
    ```

1. Open the project in VS Code. 

    ```bash
    code .
    ```

## Create a container in the emulator 

In a local instance of Azure Cosmos DB, you can use the [Azure Cosmos DB emulator](/azure/cosmos-db/local-emulator), which allows you to develop your application without creating or using a cloud-based resource. 

1. Start your local Azure Cosmos DB emulator, if it isn't already running. 
1. Select **New Container**.
1. In the side panel, enter the following settings:

    |Setting|Value|
    |--|--|
    |Database ID|`trivia`|
    |Container ID|`game`|
    |Partition key|`modelType`|

    Accept the defaults for all other values.

    :::image type="content" source="../../../../media/how-to-database-graphql/azure-cosmos-db-emulator-new-container-trivia-game.png" alt-text="Screenshot of Azure Cosmos DB emulator, showing how to create a new container." lightbox="../../../../media/how-to-database-graphql/azure-cosmos-db-emulator-new-container-trivia-game.png":::

1. Select **OK** to finish the local database creation process. 

## Load the JSON file into a local emulator container

Load the 100 trivia questions into the container. 

1. In the local Azure Cosmos DB emulator, select the `trivia` database, then the `game`container, and then **Items**. 
1. Select **Upload item**, select the folder icon in the side panel, and then select the location for the `./api/trivia.json` file. Then select **Upload**. 

    :::image type="content" source="../../../../media/how-to-database-graphql/upload-trivia-json-file-to-game-container.png" alt-text="Partial screenshot of browser showing the UI elements to select to upload the JSON file." lightbox="../../../../media/how-to-database-graphql/upload-trivia-json-file-to-game-container.png":::

1. Refresh the container to see the 100 items with the `modelType` of `Question`.

    An example of one of the questions in the container is:

    ```json
    {
        "id": "0",
        "category": "Science: Computers",
        "type": "multiple",
        "difficulty": "easy",
        "question": "What does CPU stand for?",
        "correct_answer": "Central Processing Unit",
        "incorrect_answers": [
            "Central Process Unit",
            "Computer Personal Unit",
            "Central Processor Unit"
        ],
        "modelType": "Question",
        "_rid": "t1EcAJE92MQBAAAAAAAAAA==",
        "_self": "dbs/t1EcAA==/colls/t1EcAJE92MQ=/docs/t1EcAJE92MQBAAAAAAAAAA==/",
        "_etag": "\"00000000-0000-0000-7e5b-22dca8c401d7\"",
        "_attachments": "attachments/",
        "_ts": 1626890792
    }
    ```

## Configure the local API to connect to the local instance of Azure Cosmos DB

1. In the browser window for the emulator, `https://localhost:8081/_explorer/index.html`, copy the **Primary Connection String**.

    :::image type="content" source="../../../../media/how-to-database-graphql/get-connection-string-from-local-cosmos-db-emulator.png" alt-text="Partial screenshot of browser showing the local Azure Cosmos DB emulator, with the Primary Connection String highlighted." lightbox="../../../../media/how-to-database-graphql/get-connection-string-from-local-cosmos-db-emulator.png":::

1. Paste the value into the `./api/local.settings.json` file, for the `CosmosDB` property. 
    
    ```json
    {
      "IsEncrypted": false,
      "Values": {
        "FUNCTIONS_WORKER_RUNTIME": "node",
        "AzureWebJobsStorage": "",
        "CosmosDB": "PASTE-CONNECTION-STRING-HERE"
      }
    }
    ```

## Build and run the local static web app

Both the client app and the Azure Functions API need to be started. The client runs on port 3000, the Functions API runs on port 7071, and the emulator runs on port 8081. 

1. In a VS Code integrated terminal, build and run the Functions API:

    ```bash
    cd api && npm start
    ```

    The API has to generate the TypeScript types and the GraphQL schema files, and then start the HTTP endpoint.

1. In a separate VS Code integrated terminal, build and run the client React app:

    ```bash
    npm start
    ```

1. When your local browser opens to the client, `http://localhost:3000/`, open the browser's developer tools (press **F12**) so you can see the HTTP request and response from the Functions API. 

    Both the client and the API use [Apollo GraphQL](https://www.apollographql.com/docs/) libraries to help construct and process GraphQL queries.

## Start a new trivia game in a web browser

The game selects ten random questions for you to answer. Each question is timed. Try to answer as quickly as possible. All trivia games you complete in a browser session are tied to your user name.

1. In the browser, select **Start a new game**.

    :::image type="content" source="../../../../media/how-to-database-graphql/web-browser-start-new-game.png" alt-text="Partial screenshot of browser showing the Start a new game button.":::

1. Enter your name, and select **Join the game**.

    :::image type="content" source="../../../../media/how-to-database-graphql/web-browser-trivia-game-enter-your-name.png" alt-text="Partial screenshot of browser showing the textbox where you enter your name, and the Join a game button.":::

1. In the browser developer tools, view the request payload to `http://localhost:3000/api/graphql` to see the GraphQL query:

    ```json
    {
        "operationName":"CreateGame",
        "variables":{},
        "query":"mutation CreateGame {
            createGame {
                id
                __typename
            }
        }"
    }
    ```

    The preceding JSON has been cleaned up for readability. The `CreateGame` in the query maps directly to the [`createGame`](https://github.com/Azure-Samples/js-e2e-graphql-cosmosdb-static-web-app/blob/main/api/graphql/resolvers.ts#L68) mutation in `./api/resolvers.ts`.

    :::code language="JavaScript" source="~/../js-e2e-graphql-cosmosdb-static-web-app/api/graphql/resolvers.ts" range="68-73" highlight="68":::

1. The GraphQL API responds with the following JSON:

    ```json
    {
        "data": {
            "createGame":{
                "id":"nuug",
                "__typename":"Game"
            }
        }
    }
    ```

1. Immediately after that, without further input from the user, the React client makes another call to the API to add the user. The client uses a GraphQL query, seen in the browser's developer tools:

    ```json
    {
        "operationName":"addPlayerScreen",
        "variables":{
            "id":"nuug",
            "name":"Dina"
        },
        "query":"mutation addPlayerScreen($id: ID!, $name: String!) {
            addPlayerToGame(id: $id, name: $name) {
                id
                __typename
            }
            startGame(id: $id) {
                id
                players {
                    id
                    name
                    __typename
                }
                __typename
            }
        }"
    }
    ```

    The preceding JSON has been cleaned up for readability. This GraphQL query has two requests: [`addPlayerToGame`](https://github.com/Azure-Samples/js-e2e-graphql-cosmosdb-static-web-app/blob/main/api/graphql/resolvers.ts#L74), and [`startGame`](https://github.com/Azure-Samples/js-e2e-graphql-cosmosdb-static-web-app/blob/main/api/graphql/resolvers.ts#L82), which maps directly to mutations in `./api/resolvers.ts`.

    :::code language="JavaScript" source="~/../js-e2e-graphql-cosmosdb-static-web-app/api/graphql/resolvers.ts" range="74-81" highlight="74":::

    :::code language="JavaScript" source="~/../js-e2e-graphql-cosmosdb-static-web-app/api/graphql/resolvers.ts" range="82-86" highlight="82":::

1. The GraphQL API responds with the following JSON:

    ```json
    {
        "data": {
            "addPlayerToGame":{
                "id":"rfxb",
                "__typename":"Player"
            },
            "startGame":{
                "id":"nuug",
                "players":
                [
                    {
                        "id":"rfxb",
                        "name":"Dina",
                        "__typename":"Player"
                    }
                ],
                "__typename":"Game"
            }
        }
    }
    ```

## React client fetches game trivia from the GraphQL API

1. After you create the user and game, you use this browser request to get the game trivia:

    ```json
    {
        "operationName":"getGame",
        "variables":{
            "id":"nuug"
        },
        "query":"query getGame($id: ID!) {
            game(id: $id) {
                questions {
                    id
                    question
                    answers
                    __typename
                }
                __typename
            }
        }"
    }
    ```

    The preceding JSON has been cleaned up for readability. This GraphQL query, `getGame`, maps to the [`game`](https://github.com/Azure-Samples/js-e2e-graphql-cosmosdb-static-web-app/blob/main/api/graphql/resolvers.ts#L7) query in `./api/resolvers.ts`.

    :::code language="JavaScript" source="~/../js-e2e-graphql-cosmosdb-static-web-app/api/graphql/resolvers.ts" range="7-9" highlight="7":::


1. The GraphQL API responds with the following JSON:

    ```json
    {
        "data": {
            "game":{
                "questions":[
                    {
                        "id":"34",
                        "question":"How many values can a single byte represent?",
                        "answers":["1024","256","1","8"],
                        "__typename":"Question"
                    },
                    ...remaining array elements removed for brevity...
                ],
                "__typename":"Game"
            }
        }
    }
    ```

    Notice that the correct answer isn't returned in the dataset.

1. When you select an answer for a question, the request returns that to the Functions API:

    ```json
    {
        "operationName":"submitAnswer",
        "variables":{
            "gameId":"nuug",
            "playerId":"rfxb",
            "questionId":"64",
            "answer":""
        },
        "query":"mutation submitAnswer(
                $gameId: ID!, 
                $playerId: ID!, 
                $questionId: ID!, 
                $answer: String!
            ) {
            submitAnswer(
                gameId: $gameId 
                playerId: $playerId
                questionId: $questionId
                answer: $answer
            ) {
                id
                __typename
            }
        }"
    }
    ```

    The preceding JSON has been cleaned up for readability. This GraphQL mutation, `submitAnswer`, maps to the [`submitAnswer`](https://github.com/Azure-Samples/js-e2e-graphql-cosmosdb-static-web-app/blob/main/api/graphql/resolvers.ts#L87) mutation in `./api/resolvers.ts`.

    :::code language="JavaScript" source="~/../js-e2e-graphql-cosmosdb-static-web-app/api/graphql/resolvers.ts" range="87-110" highlight="7":::

1. The GraphQL API responds with the following JSON:

    ```json
    {
        "data":{
            "submitAnswer":{
                "id":"rfxb",
                "__typename":"Player"
            }
        }
    }
    ```

## React client fetches game results from GraphQL API

1. When the game is complete, the client requests the results of the game:

    ```json
    {
        "operationName":"playerResults",
        "variables":{
            "gameId":"nuug",
            "playerId":"rfxb"
        },
        "query":"query playerResults(
            $gameId: ID!, 
            $playerId: ID!
        ) {
            playerResults(
                gameId: $gameId, 
                playerId: $playerId
            ) {
                correct
                question
                answers
                correctAnswer
                submittedAnswer
                __typename
            }
        }"
    }
    ```

    The preceding JSON has been cleaned up for readability. This GraphQL mutation, `playerResults` maps to the [`playerResults`](https://github.com/Azure-Samples/js-e2e-graphql-cosmosdb-static-web-app/blob/main/api/graphql/resolvers.ts#L13) query in `./api/resolvers.ts`.

    :::code language="JavaScript" source="~/../js-e2e-graphql-cosmosdb-static-web-app/api/graphql/resolvers.ts" range="13-31":::


1. The GraphQL API responds with the following JSON:

    ```json
    {
        "data":{
            "playerResults":[
                {
                    "correct":false,
                    "question":"What was Frank West&#039;s job in &quot;Dead Rising&quot;?",
                    "answers":["Photojournalist","Chef","Taxi Driver","Janitor"],
                    "correctAnswer":"Photojournalist",
                    "submittedAnswer":"",
                    "__typename":"PlayerResult"
                },
                ...remaining array elements removed for brevity...
            ]
        }
    }
    ```

1. This allows the React client to display the game results.

    :::image type="content" source="../../../../media/how-to-database-graphql/web-browser-trivia-game-results.png" alt-text="Partial screenshot of browser showing the game results in the React client app." lightbox="../../../../media/how-to-database-graphql/web-browser-trivia-game-results.png":::

## View the data in the emulator

1. Return to the local Azure Cosmos DB emulator, `http://localhost:8081/`, and edit the container filter to query for the game results by using the game ID. 

    ```sql
    SELECT * FROM c WHERE c.id = "REPLACE-WITH-YOUR-GAME-ID"
    ```

1. Apply the filter to see the results.

    :::image type="content" source="../../../../media/how-to-database-graphql/web-browser-cosmos-db-emulator-trivia-game-results.png" alt-text="Partial screenshot of browser showing the game results in the emulator." lightbox="../../../../media/how-to-database-graphql/web-browser-cosmos-db-emulator-trivia-game-results.png":::

## Translate GraphQL queries to Azure Cosmos DB queries

This implementation of GraphQL doesn't automatically map the GraphQL queries to the game container. You as the application developer have to provide those database queries.

The Functions API in the sample project provides the Azure Cosmos DB table queries in the *./api/graphql/data/cosmos* files. The functionality aligns to the file names:

* [*GameDataSource.ts*](https://github.com/Azure-Samples/js-e2e-graphql-cosmosdb-static-web-app/blob/main/api/graphql/data/cosmos/GameDataSource.ts)
* [*QuestionDataSource.ts*](https://github.com/Azure-Samples/js-e2e-graphql-cosmosdb-static-web-app/blob/main/api/graphql/data/cosmos/QuestionDataSource.ts)
* [*UserDataSource.ts*](https://github.com/Azure-Samples/js-e2e-graphql-cosmosdb-static-web-app/blob/main/api/graphql/data/cosmos/UserDataSource.ts)

Each file provides the Azure Cosmos DB query functions that are called by the GraphQL resolvers. For example, to get the game results for a player, the `playerResults` GraphQL query is called. This query: 

1. Gets the game details from Azure Cosmos DB (`const game = await dataSources.game.getGame(gameId);`).
1. Gets the player answers from the database response (`const playerAnswers = game.answers.filter((a) => a.user.id === playerId);`).
1. Determines if the answers were correct.

The [`getGame`](https://github.com/Azure-Samples/js-e2e-graphql-cosmosdb-static-web-app/blob/main/api/graphql/data/cosmos/GameDataSource.ts#L37) functionality requires a call to the Azure Cosmos DB data source with the corresponding query:

:::code language="JavaScript" source="~/../js-e2e-graphql-cosmosdb-static-web-app/api/graphql/data/cosmos/GameDataSource.ts" range="35-45" highlight="37":::

## Troubleshooting

The most common reasons this doesn't work locally are:

* Both the client and API aren't running. Make sure that both endpoints are available from a browser:

    * `http://localhost:3000` - React client
    * `http://locahost:7071/api/graphql` - GraphQL Function API

* The database and container aren't created or named, `trivia` and `game`.
* The container doesn't have the *./api/trivia.json* data loaded.

If you run into an error that isn't listed above, open an issue on this article with your error, and include the steps leading up to the problem. 

## Next steps

* [Deploy your app (client and API) to a static web app](remote-deployment.md)
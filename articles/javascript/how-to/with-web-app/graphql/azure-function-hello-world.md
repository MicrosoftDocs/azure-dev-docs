---
title: Deploy GraphQL API as Azure Function on Azure
description: Learn how to deploy a GraphQL API to Azure in an Azure Function.  
ms.topic: how-to
ms.date: 07/19/2021
ms.custom: devx-track-js
---

# Deploy a GraphQL API as an Azure Function 

In this article, learn how to deploy a GraphQL API to Azure in an Azure Function. 

* [Sample code](https://github.com/Azure-Samples/js-e2e-azure-function-graphql-hello.git)

This sample demonstrates using the Apollo server in an Azure function to receive a GraphQL query and return the result. 

```graphql
{
    hello
}
```

The server responds with JSON:

```json
{
    "hello": "Hello from GraphQL backend"
}
```

## Prepare your development environment

Make sure the following are installed on your local developer workstation:

- An Azure account with **an active subscription which you own**. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- [Node.js 14 and npm](https://nodejs.org/en/download) - installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
- Visual Studio Code extensions:
    - [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.

## Clone and run the Azure Function GraphQL sample code

1. Open a terminal window and `cd` to the directory where you want to clone the sample code.
1. Clone the sample code repository:    

    ```bash
    git clone https://github.com/Azure-Samples/js-e2e-azure-function-graphql-hello.git
    ```

1. Open that directory in Visual Studio Code:

    ```bash
    cd js-e2e-azure-function-graphql-hello && code .
    ```

1. Install the project dependencies:

    ```bash
    npm install
    ```

1. Run the sample:

    ```bash
    npm start
    ```

## Query local Azure Function with GraphQL using GraphQL playground

The npm package `apollo-server-azure-functions` includes a GraphQL playground that you can use to test your GraphQL API. Use this playground to test the GraphQL API locally.

1. Open browser to `http://localhost:7071/api/graphql`
1. Enter query `{hello}`
1. View response `{"data":{"hello":"Hello from GraphQL backend"}}`

    :::image type="content" source="../../../media/azure-function-graphql-hello/graphql_playground.png" alt-text="A browser screenshot showing the GraphQL playground hosted from an Azure Function API" lightbox="../../../media/azure-function-graphql-hello/graphql_playground.png":::
    
## Query Azure Function with GraphQL using cURL

1. In VS Code, open an integrated terminal.
1. Enter the cURL command:

    ```bash
    curl 'http://localhost:7071/api/graphql' \
        -H 'content-type: application/json' \
        --data-raw '{"query":"{hello}"}' 
    ```
1. View the response `{"data":{"hello":"Hello from GraphQL backend"}}`

## Create your Azure Function resource from VS Code

1. In VS Code, select the Azure explorer. 
1. In the Azure Functions section, select the Azure subscription to create the Azure Function resource in, then right-click to select **Create Function App in Azure**.
1. Complete the prompts:

    |Prompt|Enter|
    |--|--|
    |Enter a globally unique name for the new function app.|Enter a unique name, which is used as the subdomain of the URL, such as `YOURALIAS-azure-function-graphql-hello`.|
    |Select a runtime stack.|Node.js 14 LTS|
    |Select a location for new resources.|Select a geographic location close to you.|
    
    VS Code notifies you when the deployment completes.


## Deploy your GraphQL API from VS Code

1. In VS Code, still in the Azure explorer, find your new Azure Function resource under your subscription.
1. Right-click the resource and select **Deploy to Function App**.
1. Select **output window** from the notification to watch the deployment. 

    When the deployment completes, continue to the next section. 

## Query your GraphQL API with cURL

1. In VS Code, open an integrated terminal. 
1. Change the cURL command from using your local function to your remove function. Change the URL in the following command to use your Azure Function URL:

    ```bash
    curl 'https://diberry-azure-function-graphql-hello.azurewebsites.net/api/graphql' \
        -H 'content-type: application/json' \
        --data-raw '{"query":"{hello}"}' |
    ```

    The API responds with:

    ```json
    {"data":{"hello":"Hello from our GraphQL backend!"}}
    ```

## Review the code

The code used in this article requires the npm package [apollo-server-azure-functions](https://www.npmjs.com/package/apollo-server-azure-functions) to resolve your GraphQL query. 

The code for this query is in the `./graphql/index.ts` file.

:::code language="JavaScript" source="~/../js-e2e-azure-function-graphql-hello/graphql/index.ts" highlight="4,11,17":::

The highlighted lines are described in the following table:

|Line|Description|
|--|--|
|`const typeDefs = gql`|Define the GraphQL schema the API supports.|
|`const resolvers`|Define the resolver and API, `hello`, and the function that the API calls, `() => "Hello from our GraphQL backend!"`.|
|`const server = new ApolloServer({ typeDefs, resolvers, debug: true,playground: true});`|Create an Azure Function version of the Apollo server with the typeDefs, resolvers, and the playground.|

## Troubleshooting graphql API

Use the following troubleshooting guide to resolve any issues.

|Issue|Possible fix|
|--|--|
|cURL command doesn't return anything|In VS Code, expand the Azure Function resource in the Azure explorer. Under the Files node, make sure all your local files have been moved to the remote location and the `/dist` folder has been generated. If the files are not present, redeploy the app and watch the deployment output for any errors. If the files do exist, run the cURL command again, adding `--verbose` to the end of the command to see what status code is returned.|
|API doesn't return anything - but the code is correct.|The Azure Function returns the Apollo server's results if the `./graphql/function.json` correctly states the name of the return binding as `$return`. If you played with the function.json file, make sure the http binding name is reset to the value of `$return`. Another possible issue is if you changed `authLevel`, also found in the `function.json` file from `anonymous` to another value, you need to either change the value back to `anonymous` or correctly pass in the authentication when you use the API.|

Did you run into an issue not described in the preceding table? Open an issue to let us know. 

## Add second GraphQL API to Azure Function

Add a second API with create, update, and read API endpoints:

* `/api/mymessages/getMessage`
* `/api/mymessages/getMessages`
* `/api/mymessages/createMessage`
* `/api/mymessages/updateMessage`

A single data element has a unique identifer, content, and author data. Internal to the Azure Function, that looks like 

```json
{"79e4c338-162d-4c1e-a6f0-320bd78a7817": {
        "author": "dina",
        "content": "good morning"
    }
}
```

The resolver can reshape the data returned from the API to look like:
```json
[
    {
        "id":"79e4c338-162d-4c1e-a6f0-320bd78a7817",
        "author": "dina",
        "content": "good morning"
    }
]
```

If the query only requests _certain fields_ such as `id` and `content`, the Apollo server prunes the data instead of the resolver:
```json
[
    {
        "id":"79e4c338-162d-4c1e-a6f0-320bd78a7817",
        "content": "good morning"
    }
]
```

The key is that the resolver can reshape the data and the Apollo server can prune the data to match the query. 

1. In VS Code, select **View**, then select the **Command Palette**.
1. Search for and select **Azure Functions: Create Function**. 
1. Complete the prompts:

    |Prompt|Enter|
    |--|--|
    |Select a template for your function|HTTP trigger|
    |Provide a function name|mymessages|
    |Authorization|Anonymous|
    
1. In the `./mymessages/index.ts`, replace the entire file with the following code:

    :::code language="JavaScript" source="~/../js-e2e-azure-function-graphql-hello/message/index.ts" highlight="4,6,29,42":::

1. In the `./mymessages/function.json` file, change the second name object to use `$return` so that the Apollo server can return functionality correctly through the Azure Function:

    :::code language="JavaScript" source="~/../js-e2e-azure-function-graphql-hello/message/function.json" highlight="16":::

1. In the VS Code integrated terminal, build and start the function:

    ```bash
    npm run build && npm start
    ```

1. Open the playground in a browser `http://localhost:7071/api/mymessages`. 
1. Enter and run each of the following GraphQL queries in the playground. The `id` value you see will be different from the `id` values listed below because these values are randomly generated.

    |Purpose|Query|Result|
    |--|--|--|
    |Get all messages|`{getMessages{id, author, content}}`|`{"data": {"getMessages": [{"id": "d8732ed5-26d8-4975-98a5-8923e320a77f","author": "dina", "content": "good morning"}]}}`|
    |Add one messages|`mutation{createMessage(input:{author: "John Doe",content: "Oh happy day"}){id}}` | `{"data": {"createMessage": {"id": "33febdf6-e618-4884-ae4d-90827280d2b2"}}}`|
    |Get one message|`{getMessage(id: "33febdf6-e618-4884-ae4d-90827280d2b2"){id, content, author}}`|`{"data": {"getMessage": {"id": "33febdf6-e618-4884-ae4d-90827280d2b2","content": "Oh happy day",  "author": "John Doe"}}}`|
    |Update one message|`mutation{ updateMessage (id: "33febdf6-e618-4884-ae4d-90827280d2b2",input:{author: "John Doe", content: "another great day..." }){id, content, author}}`|`{"data": {"updateMessage": {"id": "33febdf6-e618-4884-ae4d-90827280d2b2","content": "another great day...","author": "John Doe"}}}`|
    
1. To deploy to your cloud-based Azure Function, repeat the [deployment steps](#deploy-your-graphql-api-from-vs-code).

## Next steps

* [Get started with databases in JavaScript](../../with-database/getting-started.md)
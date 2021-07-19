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

    :::image type="content" source="../../../media/azure-function-graphql-hello/graphql_playground.png" alt-text="A browser screenshot showing the GraphQL playground hosted from an Azure Function API":::
    
## Query Azure Function with GraphQL using cURL

1. In VS Code, open an integrated terminal.
1. Enter the cURL command:

    ```bash
    curl 'http://localhost:7071/api/graphql' \
        -H 'content-type: application/json' \
        --data-raw '{"query":"{hello}"}' 
    ```
1. View the response `{"data":{"hello":"Hello from GraphQL backend"}}`


## Next steps


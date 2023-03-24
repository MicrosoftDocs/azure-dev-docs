---
title: Deploy GraphQL API as Azure Function on Azure
description: Learn how to deploy a `Hello World` GraphQL API to Azure in an Azure Function.  
ms.topic: how-to
ms.date: 08/16/2022
ms.custom: devx-track-js, devx-graphql
---

# Deploy a GraphQL API as an Azure Function 

In this article, learn how to deploy an Apollo GraphQL API to Azure in an Azure Function. 

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
- [Node.js LTS supported by Azure Functions runtime](https://nodejs.org/en/download) - use the same Node.js version on your local workstation and the deployed Azure Function.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
- Visual Studio Code extensions:
    - [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.
- Optional
    - Docker: the sample repo includes files to run this sample is a Visual Studio Code dev container ready for local development
    - Azurite: local Function app development can use [Azurite](https://www.npmjs.com/package/azurite) to satisfy the local.settings.json's requirement for `"AzureWebJobsStorage": "UseDevelopmentStorage=true"`.
    - [Azure CLI](/cli/azure/install-azure-cli): to remove resources after you completed the following procedure. You can also remove resources with Visual Studio Code. 
    
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

1. Build the TypeScript project: 

    ```bash
    npm run build
    ```

1. Run the sample:

    ```bash
    npm run start:local
    ```

    If your computer pops up a window from a security app asking for permission to run, allow the app. 

## Query local Azure Function with GraphQL using GraphQL playground

Access the GraphQL playground from the locally running Function app.

1. Open browser to `http://localhost:7071/api/graphql`.
1. On the Apollo Studio page, select **Query your server**.

    :::image type="content" source="../../../media/azure-function-graphql-hello/apollo-studio-query-your-server.png" alt-text="Browser screenshot displays information about Apollo Studio, including the button named Query your server.":::

1. Replace example query with the following query: 

    ```graphql
    {
        hello
    }
    ```

1. View response:

    ```json
    {
      "data": {
        "hello": "Hello from our GraphQL backend!"
      }
    }
    ```

    :::image type="content" source="../../../media/azure-function-graphql-hello/graphql-playground.png" alt-text="A browser screenshot showing the GraphQL playground hosted from an Azure Function API" lightbox="../../../media/azure-function-graphql-hello/graphql-playground.png":::
    
## Query Azure Function with GraphQL using cURL

1. In Visual Studio Code, open an integrated terminal.
1. Enter the cURL command:

    ```bash
    curl 'http://localhost:7071/api/graphql' \
         -H 'content-type: application/json' \
         --data-raw '{"query":"{hello}"}' --verbose
    ```
1. At the bottom of the verbose response, view the same GraphQL response.

    ```json
    {
      "data": {
        "hello": "Hello from our GraphQL backend!"
      }
    }
    ```

## Create your Azure Function resource from Visual Studio Code

1. In Visual Studio Code, select the Azure explorer (<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd>). 
1. In the **Resources** section, select the Azure subscription. 
1. Right-click **Function App** then select **Create Function App in Azure (Advanced)**.
1. Complete the prompts:

    |Prompt|Enter|
    |--|--|
    |Enter a globally unique name for the new function app.|Enter a unique name, which is used as the subdomain of the URL, such as `YOUR-ALIAS-azure-function-graphql-hello`.|
    |Select a runtime stack.|Select a Node LTS runtime stack that matches your local development Node.js version.|
    |Select an OS.|Select **Linux**.|
    |Select a resource group for new resources.|Create a new resource group, such as `YOUR-ALIAS-azure-function-graphql`.|
    |Select a location for new resources.|Select a geographic location close to you.|
    |Select a hosting plan.|Select **Consumption**.|
    |Select a storage account.|Create a new storage account.|
    |Enter the name of the new storage account.|Accept the default value.|
    |Select an Application Insights resource for your app.|Create new Application Insights resource. Accept the default value.|

    
1. Visual Studio Code's **Azure:Activity Log** reports when the Function App is created successfully and the workspace shows the **Attached Storage Accounts**. To use local storage, you need to install [**Azurite**](https://www.npmjs.com/package/azurite).


## Deploy your GraphQL API from Visual Studio Code

1. In Visual Studio Code, still in the Azure explorer (<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd>), find your new Azure Function resource under your subscription.
1. Right-click the resource and select **Deploy to Function App**.
1. When asked if you're sure you want to deploy, select **Deploy**.
1. Select **output window** from the notification to watch the deployment. 

    When the deployment completes, continue to the next section. 

## Query your GraphQL API with cURL

1. In Visual Studio Code, open an integrated terminal. 
1. Change the cURL command from using your local function to your remove function. Change the URL in the following command to use your Azure Function URL:

    ```bash
    curl 'https://YOUR-ALIAS-azure-function-graphql-hello.azurewebsites.net/api/graphql' \
         -H 'content-type: application/json' \
         --data-raw '{"query":"{hello}"}' 
    ```

    The API responds with:

    ```json
    {
      "data": {
        "hello": "Hello from our GraphQL backend!"
      }
    }
    ```

## Review the code

The code used in this article requires the npm package [apollo-server-azure-functions](https://www.npmjs.com/package/apollo-server-azure-functions) to resolve your GraphQL query. 

The code for this query is in the `./graphql/index.ts` file.

:::code language="JavaScript" source="~/../js-e2e-azure-function-graphql-hello/graphql/index.ts" highlight="4,11,17":::

The highlighted lines are described in the following table:

|Line|Description|
|--|--|
|`const typeDefs = gql`|Define the **GraphQL schema** the API supports.|
|`const resolvers`|Define the **GraphQL resolver**. `hello`, from our schema, is given a resolver function to return data from the API: `() => "Hello from our GraphQL backend!"`.|
|`const server = new ApolloServer({ typeDefs, resolvers });`|Create an Azure Function version of the Apollo server.|

## Troubleshooting graphql API

Use the following troubleshooting guide to resolve any issues.

|Issue|Possible fix|
|--|--|
|cURL command doesn't return anything|In Visual Studio Code, expand the Azure Function resource in the Azure explorer. Under the Files node, make sure all your local files have been moved to the remote location and the `/dist` folder has been generated. If the files aren't present, redeploy the app and watch the deployment output for any errors. If the files do exist, run the cURL command again, adding `--verbose` to the end of the command to see what status code is returned.|
|API doesn't return anything - but the code is correct.|The Azure Function returns the Apollo server's results if the `./graphql/function.json` correctly states the name of the return binding as `$return`. If you played with the function.json file, make sure the http binding name is reset to the value of `$return`. Another possible issue is if you changed `authLevel`, also found in the `function.json` file from `anonymous` to another value, you need to either change the value back to `anonymous` or correctly pass in the authentication when you use the API.|
|Can't connect to Apollo playground from deployed Azure Function|Use the following npm command with your own function name to debug the connection: `npx diagnose-endpoint@1.1.0 --endpoint=https://YOUR-FUNCTION-NAME.azurewebsites.net/api/graphql/`. |

Did you run into an issue not described in the preceding table? Open an issue to let us know. 

## Clean up resources

Remove the resources created in this procedure when you're done using them. Because all the resources were created in the same resource group, delete that resource group. In the following procedure, replace `YOUR-RESOURCE-GROUP-NAME` with your own resource group name.

# [Visual Studio Code](#tab/visualstudiocode)

1. In Visual Studio Code, still in the Azure explorer (<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd>). 
1. In the **Resources** contextual toolbar, select **Group by**.
1. In the list of group-by choices, select **Group by Resource Group**.
1. Right-click on your resource group and select *Delete Resource Group**.

# [Azure CLI](#tab/azure-cli)

Delete the resource group with the following Azure CLI command, [az group delete](/cli/azure/group#az-group-delete):

```bash
az group delete --name YOUR-RESOURCE-GROUP-NAME --yes
```

# [Portal](#tab/portal)

1. Open a browser and go to your list of resource groups with the following portal location:

    ```http
    https://ms.portal.azure.com/#view/HubsExtension/BrowseResourceGroups
    ```

1. Filter the list to find your resource group.
1. Select the resource group to go to the resource group page.
1. Select **Delete resource group**. 
1. Type the resource group name in the confirmation box and select **Delete**.
---


## Next steps

* [Get started with databases in JavaScript](../../../database-developer-guide.md)

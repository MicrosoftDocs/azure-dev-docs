---
title: Add Cosmos DB integration to Azure Function
description: Create Cosmos DB resource and use mongoose npm package to add TypeScript code to integrate a database with the Azure function.
ms.topic: how-to
ms.date: 01/03/2022
ms.custom: devx-track-js, contperf-fy21q2
---

# 5. Add Cosmos DB for MongoDB API integration 

[Previous step: Deploy the function](tutorial-vscode-serverless-node-test-local.md)

In this step, create a [Cosmos DB](/azure/cosmos-db/mongodb/mongodb-introduction) for MongoDB API resource and the use [mongoose](https://www.npmjs.com/package/mongoose) npm package to add, delete, and list items in the database. 

## Create an Azure Cosmos DB for MongoDB API resource

Cosmos DB provides a MongoDB API to provide a familiar integration point. 

1. In Visual Studio Code, select the Azure logo to open the **Azure Explorer**, then under **Databases**, select **+** to begin the creation process.

1. Use the following table to complete the prompts to create a new Azure Cosmos DB resource. 

    |Prompt|Value|Notes|
    |--|--|--|
    |Select an Azure Database Server|Azure Cosmos DB for MongoDB API||
    |Provide a Cosmos DB account name.|`cosmosdb-mongodb-database`|The name becomes part of the API's URL.|
    |Select a capacity model.|Provisioned Throughput||
    |Select a resource group for new resources.|`cosmosdb-mongodb-function-resource-group`|Select the [resource group](tutorial-vscode-serverless-node-install.md#create-a-resource-group) you created in the first article of this series.|
    |Select a location for new resources.|Select the recommended region.||

## Install the mongoose npm package

In a Visual Studio Code integrated bash terminal, install the npm package:

```bash
npm install mongoose
```

## Create database code file 

1. In Visual Studio Code, create a subdirectory of the project named `lib`.
1. Create a file in the directory named `./lib/azure-cosmosdb-mongodb.ts` and copy the following code into it.

    :::code language="typescript" source="~/../js-e2e-azure-function-mongodb/lib/azure-cosmosdb-mongodb.ts" :::

    This file contains a simple mongoose schema for a **Category** container. 

## Integrate mongoose code into Azure function API

In Visual Studio Code, open the `./category/index.ts` file and replace the entire file's code with the following:

:::code language="typescript" source="~/../js-e2e-azure-function-mongodb/category/index.ts" highlight="2,12,18,25,31,43":::

## Change function.json to include delete method

In Visual Studio Code, open the `./category/function.json` file and change the methods property to include **delete**.

:::code language="typescript" source="~/../js-e2e-azure-function-mongodb/category/function.json" highlight="11":::
  
## Add Cosmos DB connection string to local project

1. In Visual Studio Code, select the Azure logo to open the **Azure Explorer**, then under **Databases**, right-click your database and select **Copy Connection String**.

    :::image type="content" source="../../media/functions-extension/visual-studio-code-cosmos-db-copy-connection-string.png" alt-text="Partial screenshot of Visual Studio Code, showing the Azure explorer with a database selected and the right-click menu highlighting Copy Connection String.":::

1. Open the `./local.settings.json` file and add a new property `CosmosDbConnectionString` and paste in the database connection string in as the value.

    :::code language="json" source="~/../js-e2e-azure-function-mongodb/local.settings.json" highlight="6":::

## Add items to database by calling Azure Function API

1. In Visual Studio Code, press <kbd>F5</kbd>  to launch the debugger and attach to the Azure Functions host. 

    You could also use the **Debug** > **Start Debugging** menu command.

1. Use the following curl command in the integrated bash terminal to add **John** to your database:

    :::code language="bash" source="~/../js-e2e-azure-function-mongodb/curl.sh" range="3-5" :::
 
1. The response includes the new item's ID:

    ```console
    {
      "documentResponse": {
        "_id": "614a45d97ccca62acd742550",
        "categoryName": "John",
        "createdAt": "2021-09-21T20:51:37.669Z",
        "updatedAt": "2021-09-21T20:51:37.669Z",
        "__v": 0
      }
    }
    ```

1. Use the following curl command in the integrated bash terminal to add **Sally** to your database:

    :::code language="bash" source="~/../js-e2e-azure-function-mongodb/curl.sh" range="7-9" :::

1. The response includes the new item's ID:

    ```console
    {
      "documentResponse": {
        "_id": "614a45d97bbba62acd742550",
        "categoryName": "Sally",
        "createdAt": "2021-09-21T20:51:37.669Z",
        "updatedAt": "2021-09-21T20:51:37.669Z",
        "__v": 0
      }
    }
    ```

## Get all items from database by calling Azure Function API

1. Use the following curl command to get all items from the database:

    :::code language="bash" source="~/../js-e2e-azure-function-mongodb/curl.sh" range="11-12" :::
 
1. The response includes the new item's ID:

    ```console
    {
      "documentResponse": [
        {
          "_id": "614a45d97ccca62acd742550",
          "categoryName": "John",
          "createdAt": "2021-09-21T20:51:25.288Z",
          "updatedAt": "2021-09-21T20:51:25.288Z",
          "__v": 0
        },
        {
          "_id": "614a45d97bbba62acd742550",
          "categoryName": "Sally",
          "createdAt": "2021-09-21T20:51:37.669Z",
          "updatedAt": "2021-09-21T20:51:37.669Z",
          "__v": 0
        }
      ]
    }
    ```

## View all data with Database extension

1. In Visual Studio Code, select the Azure logo to open the **Azure Explorer**, then under **Databases**, right-click your Cosmos DB resource, then the **Test** database, then the **Bookstore** collection.
1. Select one of the items listed. 

    :::image type="content" source="../../media/functions-extension/visual-studio-code-databases-extension-showing-mongodb-doc.png" alt-text="Partial screenshot of Visual Studio Code, showing the Azure explorer with the Databases with a selected item displayed in the reading pane.":::

## Get one item from the database by calling Azure Function API

1. Use the following curl command to get all items from the database. Replace `DOCUMENT_ID` with one of the IDs from a previous step's response:

    :::code language="bash" source="~/../js-e2e-azure-function-mongodb/curl.sh" range="14-16" :::
 
1. The response includes the new item's ID:

    ```console
    {
      "documentResponse": {
        "_id": "614a45cd7ccca62acd74254e",
        "categoryName": "John",
        "createdAt": "2021-09-21T20:51:25.288Z",
        "updatedAt": "2021-09-21T20:51:25.288Z",
        "__v": 0
      }
    }
    ```

## Delete one item from the database by calling Azure Function API

1. Use the following curl command to get all items from the database. Replace `DOCUMENT_ID` with one of the IDs from a previous step's response:

    :::code language="bash" source="~/../js-e2e-azure-function-mongodb/curl.sh" range="18-20" :::
 
1. The response includes the new item's ID:

    ```console
    {
      "documentResponse": {
        "_id": "614a45cd7ccca62acd74254e",
        "categoryName": "John",
        "createdAt": "2021-09-21T20:51:25.288Z",
        "updatedAt": "2021-09-21T20:51:25.288Z",
        "__v": 0
      }
    }
    ```

## Redeploy the function app to include mongoose code

1. In Visual Studio Code, select the Azure logo to open the **Azure Explorer**, then under **Functions**, select the deploy icon to begin the deployment process.

    :::image type="content" source="../../media/functions-extension/visual-studio-code-function-redeploy-to-azure.png" alt-text="Partial screenshot of Visual Studio Code, showing the Azure explorer with the Functions deploy icon highlighted.":::

1. In the pop-up window, select the same function app, `cosmosdb-mongodb-function-app`. 
1. In the next pop-up window, select **Deploy**.
1. Wait until deployment completes before continuing.

## Add Cosmos DB connection string to remote function 

1. In Visual Studio Code, select the Azure logo to open the **Azure Explorer**, then under **Databases**, right-click your database and select **Copy Connection String**.
1. Still in the Azure Explorer, under **Functions**, select and expand your function.
1. Right-click on **Application Settings** and select **Add New Setting**.

    :::image type="content" source="../../media/functions-extension/visual-studio-code-function-application-setting-add-new.png" alt-text="Partial screenshot of Visual Studio Code, showing the Azure explorer with the Functions Application Settings, with the Add new setting menu item highlighted.":::

1. Enter the app setting name, `CosmosDbConnectionString` and press enter. 
1. Paste the value.

## Copy the secure function's URL

1. Still in the Azure Explorer, in the **Functions** area, select and expand your function then the **Functions** node, which lists the API, **category**.
1. Right-click on the **category** item and select **Copy Function Url**.
1. Use the URL and Code querystring name/value pair to replace `YOUR-FUNCTION-RESOURCE-NAME` and `YOUR-FUNCTION-KEY` in the following cURL commands. Run each command in a bash terminal in order.

    :::code language="bash" source="~/../js-e2e-azure-function-mongodb/curl.sh" range="24-41" :::

## Next steps

> [!div class="nextstepaction"]
> [Clean up resources](tutorial-vscode-serverless-node-remove-resource.md) 
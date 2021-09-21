---
title: Add Cosmos DB integration to Azure Function
description: Use the Visual Studio Code extension for Azure Functions to deploy the Functions app to the Azure cloud. Verify the Functions app is publicly available with a browser. 
ms.topic: tutorial
ms.date: 09/21/2021
ms.custom: devx-track-js, contperf-fy21q2
---

# 5. Add integration Cosmos DB for MongoDB API

[Previous step: Deploy the function](tutorial-vscode-serverless-node-test-local.md)

In this step, create a Cosmos DB resource and code to integrate a database with the Azure function. Use the mongoose npm package to connect to the Azure Cosmos DB for MongoDB API. 

## Create an Azure Cosmos DB for MongoDB API resource

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
1. Create a file in the directory named `./lib/azure-cosmosdb-mongodb.ts`.
1. Copy the following code into the `./lib/azure-cosmosdb-mongodb.ts` file.

    :::code language="typescript" source="~/../js-e2e-azure-function-mongodb/lib/azure-cosmosdb-mongodb.ts" :::

    This file contains a simple mongoose schema for a **Category** container. 

## Integrate mongoose code into Azure function API

In Visual Studio Code, open the `./category/index.ts` file and copy the following code into the file.

:::code language="typescript" source="~/../js-e2e-azure-function-mongodb/category/index.ts" highlight="2,4-10,23,30,36,48":::

## Change function methods to include delete

In Visual Studio Code, open the `./category/function.json` file and change the methods property to include **delete**.

:::code language="typescript" source="~/../js-e2e-azure-function-mongodb/category/function.json" highlight="11":::
  
## Run the project locally

In Visual Studio Code, press <kbd>F5</kbd>  to launch the debugger and attach to the Azure Functions host. 

You could also use the **Debug** > **Start Debugging** menu command.

## Deploy the new mongoose code to Azure

## Verify remote function API with cURL commands

1. Select **Run**.

## Next steps

> [!div class="nextstepaction"]
> [Add database integration](tutorial-vscode-serverless-node-database-integration.md) 
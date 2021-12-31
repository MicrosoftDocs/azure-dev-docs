---
title: Create and deploy JavaScript Functions 3.x
description: In this tutorial, create a new serverless app in Visual Studio Code with extensions and JavaScript, then deploy the application to the Azure cloud for hosting with a public HTTP endpoint.
ms.topic: how-to
ms.date: 09/21/2021
ms.custom: devx-track-js, contperf-fy21q2
adobe-target: true
---

# 1. Create and deploy Azure Functions from Visual Studio Code with MongoDB integration

In this tutorial, create a secure API in Visual Studio Code with VS Code extensions and JavaScript, then deploy the application to the Azure cloud for hosting with a public HTTP endpoint. The API integrates with a Cosmos DB database using the MongoDB API. The MongoDB API is accessed from the [mongoose](https://www.npmjs.com/package/mongoose) npm package.

The MongoDB database functionality includes:

* Add item
* Delete item by ID
* Get item by ID
* Get all items

Full source code for this function app:

* [Sample code](https://github.com/Azure-Samples/js-e2e-azure-function-mongodb)

## Prepare you development environment 

Install the following software: 

* Create a free [Azure subscription](https://azure.microsoft.com/free/)
* Install [Node.js LTS](https://nodejs.org/en/download)
* Install [Visual Studio Code](https://code.visualstudio.com/) and use the following extensions:
    * [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)
    * [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
    * [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

The following software is installed as part of the tutorial later:

* [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools) - to use Azure Functions 3.x

## Sign in to Azure in Visual Studio Code

[!INCLUDE [azure-sign-in](../../includes/azure-sign-in-vscode.md)]

## Install the Azure Functions Core Tools V3

1. In Visual Studio Code, open the integrated terminal at a location you want to create and run the local project.

1. Install Azure Functions Core Tools locally:

    ```bash
    npm install --global azure-functions-core-tools@3 --unsafe-perm true --save-dev
    ```

## Create a resource group

A resource group is a region-based collection of resources. By creating a resource group, then creating resources in that group, at the end of the tutorial, you can delete the resource group without having to delete each resource individually. 

1. In Visual Studio Code, select Azure explorer, then your subscription under **Resource Groups**.
1. Select **+** to create a new resource group.
1. Use the following table to complete the prompts:

    |Prompt|Value|
    |--|--|
    |Enter the name of the new resource group.|`cosmosdb-mongodb-function-resource-group`|
    |Select a location for your new resources.|Select a geographical region close to you.|


## Next steps

> [!div class="nextstepaction"]
> [Create the local function app](tutorial-vscode-serverless-node-create-local.md)

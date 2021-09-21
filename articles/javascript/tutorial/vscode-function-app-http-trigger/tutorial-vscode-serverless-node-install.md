---
title: Create and deploy JavaScript Functions 3.x
description: In this tutorial, create a new serverless app in Visual Studio Code with extensions and JavaScript, then deploy the application to the Azure cloud for hosting with a public HTTP endpoint.
ms.topic: tutorial
ms.date: 09/21/2021
ms.custom: devx-track-js, contperf-fy21q2
adobe-target: true
---

# 1. Create and deploy Azure Functions from Visual Studio Code

In this tutorial, create a secure API in Visual Studio Code with VS Code extensions and JavaScript, then deploy the application to the Azure cloud for hosting with a public HTTP endpoint. The API integrates with a Cosmos DB database using the MongoDB API. The MongoDB API is accessed from the [mongoose](https://www.npmjs.com/package/mongoose) npm package.

The MongoDB database functionality includes:

* Add item
* Delete item by ID
* Get item by ID
* Get all items

## Prepare you development environment 

Install the following software: 

* Create a free [Azure subscription](https://azure.microsoft.com/free/)
* Install [Node.js LTS](https://nodejs.org/en/download)
* Install [Visual Studio Code](https://code.visualstudio.com/) and use the following extensions:
    * [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
    * [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

The following software is installed as part of the tutorial later:

* [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools) - to use Azure Functions 3.x

## Sign in to Azure in Visual Studio Code

[!INCLUDE [azure-sign-in](../../includes/azure-sign-in-vscode.md)]

## Install the Azure Functions Core Tools V3

1. In VS Code, open the integrated terminal at a location you want to create and run the local project.

1. Install Azure Functions Core Tools locally:

    ```bash
    npm install --global azure-functions-core-tools@3 --unsafe-perm true --save-dev
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create the local function app](tutorial-vscode-serverless-node-create-local.md)

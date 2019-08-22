---
title: Write serverless Node.js code with Azure Functions
description: Guidance on how to use Azure Functions to create and deploy serverless code using Azure Functions.
author: kraigb
manager: barbkess
ms.devlang: nodejs
ms.topic: article
ms.service: azure-nodejs
ms.date: 08/19/2019
ms.author: kraigb
---

# How to write serverless Node.js code on Azure

Serverless code allows you to create responsive, on-demand endpoints on the Internet without having to concern yourself with provisioning or managing infrastructure. Serverless code is composed to scripts or other bits of code that are run in response to various events. On Azure, the serverless offering is called Azure Functions.

First, jump right in:

- [Create your first function using Visual Studio Code](/azure/azure-functions/functions-create-first-function-vs-code). This article introduces you to Azure Functions in the context of Visual Studio Code, which which simplifies many of the details.

Next, expand your understanding of what Azure Functions can do by reviewing the following articles:

- [An Introduction to Azure Functions](/azure/azure-functions/functions-overview), which describes the benefits of serverless development, costs, and the different triggers you can use to run serverless code.

- [Azure Functions triggers and bindings concepts](/azure/azure-functions/functions-triggers-bindings)

- [Azure Functions developer guide](/azure/azure-functions/functions-reference) followed by the [Azure Functions JavaScript developer guide](/azure/azure-functions/functions-reference-node)

- If you're interested in writing *stateful* functions in a serverless environment, review [What are Durable Functions?](/azure/azure-functions/durable/durable-functions-overview) as well as [Create your first durable function in JavaScript](/azure/azure-functions/durable/quickstart-js-vscode).

From here, you can enjoy a number other resources that help you explore serverless code further:

- Microsoft Learn Module: [Enable automatic updates in a web app using Azure functions and SignalR Service](https://docs.microsoft.com/learn/modules/automatic-update-of-a-webapp-using-azure-functions-and-signalr/)

- Learn about using various triggers to run serverless code:

  - [Run code on a timer](/azure/azure-functions/functions-create-scheduled-function)
  - [Run code when files are uploaded or updated in Azure Blob storage](/azure/storage/blobs/storage-upload-process-images?tabs=nodejsv10)
  - [Run code when a message is written into Azure Queue Storage](/azure/azure-functions/functions-create-storage-queue-triggered-function)

- [Store unstructured data using Azure Functions and Azure Cosmos DB](/azure/azure-functions/functions-integrate-store-unstructured-data-cosmosdb.md?tabs=javascript). For information on other databases, see [How to integrate Azure databases in Node.js code](node-howto-integrate-databases.md)

- [Code and test Azure Functions locally](/azure/azure-functions/functions-develop-local)

- [Strategies for testing your code in Azure Functions](/azure/azure-functions/functions-test-a-function) and [Error handling](/azure/azure-functions/functions-bindings-error-pages)

- [Configure authentication with Azure Active Directory](/azure/app-service/configure-authentication-provider-aad.md?toc=%2fazure%2fazure-functions%2ftoc.json)

- [Set up continuous deployment with Azure Pipelines](/azure/azure-functions/functions-how-to-azure-devops)

- [Node.js + Azure Functions samples](/samples/browse/?languages=javascript%2Cnodejs&products=azure-functions)

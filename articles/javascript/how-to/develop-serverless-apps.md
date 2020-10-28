---
title: Serverless Node.js code with Azure Functions
description: Azure Functions provides serverless code infrastructure, allowing you to create responsive, on-demand HTTP endpoints.
ms.topic: how-to
ms.date: 10/27/2020
ms.custom: seo-javascript-september2019, seo-javascript-october2019, devx-track-js
---

# Use Azure Functions to develop Node.js serverless code

Azure Functions provides serverless code infrastructure, allowing you to create responsive, on-demand HTTP endpoints. Serverless code is composed of JavaScript or TypeScript ode that  runs in response to various events. 

Functions run on top of a web service, as code or a Docker container, which is abstracted away so you can focus on the code for your endpoint. Functions also allow you to trigger another function so that a function work stream can replace existing hosted backend server functionality and remove the need to manage that server. 

## What is a Function resource?

An Azure Function resource is a logical unit for all related functions in a single Azure geographic location. The resource can contain a single function or many functions, which can be independent of each other or related with input or output triggers. You can select from many common functions or create your own.

:::image type="content" source="../media/howto-serverless/portal-screenshot-new-azure-function-type.png" alt-text="You can select from many common functions or create your own..":::

The function resource settings include typical serverless configurations including configuration, authentication, logging, CORS.  

When developing functions, advanced scenarios involved [triggers and bindings]((/azure/azure-functions/functions-triggers-bindings)). Triggers allow you to initiate one function from another. Bindings allow you to control meta data flow with the function

The [Azure Functions developer guide for JavaScript](/azure/azure-functions/functions-reference-node)) in a good starting point. 

## Durable, stateful functions 

[Durable Functions](/azure/azure-functions/durable/durable-functions-overview) retain *state*, or manage long-running functions in Azure. [Create your first durable function in JavaScript](/azure/azure-functions/durable/quickstart-js-vscode).

## Static web apps include functions 

When developing a static front-end client application (such as Angular, React, or Vue), which also need serverless APIs, use [Static Web apps](/azure/static-web-apps/getting-started?tabs=react) with [an API](/azure/static-web-apps/add-api) to bundle both together. 

## A simple JavaScript function for HTTP requests

A function is an exported asynchronous function with request and context information. The following partial screenshot from the Azure portal shows the function code. 

:::image type="content" source="../media/howto-serverless/portal-screenshot-azure-function-http.png" alt-text="Partial screenshot of Azure Function in Azure portal.":::

## Develop functions locally with Visual Studio Code and extensions

Create your [first function](/azure/azure-functions/functions-create-first-function-vs-code) using Visual Studio Code. Visual Studio Code, simplifies many of the details with the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

This extension helps you create JavaScript and TypeScript functions with common templates. 

A JavaScript example of an HTTP function for Azure is: 

```nodejs
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}
```

A TypeScript example of an HTTP function for Azure is: 

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

export default httpTrigger;
```

## Configuring the function

The function is configured with the **function.json**. This configuration allows you to configure how the function is triggered ("direction": in) and what the function returns ("direction": out). It also allows you to set environment variables, and other necessary information for the function to work. Learn more about the [trigger and binding](/azure/azure-functions/functions-triggers-bindings?tabs=javascript.md). 

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## Develop functions remotely using the Azure portal

When you [create an Azure function using the Azure portal](https://ms.portal.azure.com/#create/Microsoft.FunctionApp), you can configure the function, write the code inside a pre-populated template, and test the function. 

The portal creates JavaScript functions only, not TypeScript. If you want to develop with TypeScript, either download the function or create the function locally in Visual Studio Code with the Function extension. 

## Next steps

Use the Microsoft Learn Module to learn how to [enable automatic updates in a web app using Azure functions and SignalR Service](/learn/modules/automatic-update-of-a-webapp-using-azure-functions-and-signalr/).

* [Run code on a timer](/azure/azure-functions/functions-create-scheduled-function)
* [Run code when files are uploaded or updated in Azure Blob storage](/azure/storage/blobs/storage-upload-process-images?tabs=nodejsv10)
* [Run code when a message is written into Azure Queue Storage](/azure/azure-functions/functions-create-storage-queue-triggered-function)
* [Store unstructured data using Azure Functions and Azure Cosmos DB](/azure/azure-functions/functions-integrate-store-unstructured-data-cosmosdb?tabs=javascript)
* [Node.js + Azure Functions samples](/samples/browse/?languages=javascript%2Cnodejs&products=azure-functions)
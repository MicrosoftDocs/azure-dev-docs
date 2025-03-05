---
title: Introduction to Developing Serverless Node.js Apps with Azure Functions
description: Learn how to develop serverless Node.js applications using Azure Functions. This guide introduces Azure's serverless technologies, enabling you to create scalable, on-demand HTTP endpoints with JavaScript and TypeScript.
ms.topic: concept-article
ms.date: 01/22/2025
ms.custom: devx-track-js, engagement-fy23, devx-track-ts
---

# Developing Serverless Node.js Apps with Azure Functions

Azure Functions provides a powerful serverless infrastructure, enabling you to develop scalable, on-demand HTTP endpoints with ease. By using JavaScript or TypeScript, you can create serverless applications that respond to various events, allowing you to focus on writing code without worrying about managing servers. This guide helps you get started with developing serverless Node.js apps using Azure Functions, integrating seamlessly with other Azure services.

* [Azure serverless community library of samples](https://serverlesslibrary.net/)

## What is a Function resource?

An Azure Function resource is a logical unit for all related functions in a single Azure geographic location. The resource can contain a single function or many functions, which can be independent of each other or related with input or output bindings. You can select from many common functions or create your own.

The function resource settings include typical serverless configurations including environment variables, authentication, logging, and CORS.  

## Durable, stateful functions 

[Durable Functions](/azure/azure-functions/durable/durable-functions-overview) retain *state*, or manage long-running functions in Azure. [Create your first durable function in JavaScript](/azure/azure-functions/durable/quickstart-js-vscode).

## Static web apps include functions 

When you develop a static front-end client application (such as Angular, React, or Vue), which also need serverless APIs, use [Static Web apps](/azure/static-web-apps/getting-started?tabs=react) with functions to bundle both together. 

### Proxy from client app to the API
If you intend to deploy your API with your Static web app, you don't need to proxy your client application's API calls. The proxy is established for you when you deploy the Azure Functions app as a managed app.

When you develop locally with a Static Web App and Azure Functions, the [Azure Static Web App CLI](https://github.com/Azure/static-web-apps-cli) provides the local proxy. 

## Common security settings you need to configure for your Azure Function

The following common settings should be configured to keep your Azure Function secure:

* Configuration settings
  * Configuration settings - create Application settings for settings that don't impact security. 
  * Secrets and keys - for any settings that impact security, create an [Azure Key Vault](/azure/key-vault/) and [pull in those settings from your Key Vault](/azure/app-service/app-service-key-vault-references?toc=%2Fazure%2Fazure-functions%2Ftoc.json&tabs=azure-cli).
  * FTP state on Platform settings - by default, all are allowed. You need to select **FTPS only** or disable FTP entirely to improve security. 
* CORS - configure your client domains. Don't use `*`, indicating all domains. 
* TLS/SSL setting for HTTPS - by default, your API accepts HTTP and HTTPS requests. Enable **HTTPS only** in the **TLS/SSL settings**. Because your Function app is hosted on a secure subdomain, you can use it immediately (with `https`) and delay purchasing a domain name, and using a certificate for the domain until you're ready. 
* Deployment Slots - create a deployment slot, such as `stage` or `preflight` and push to that slot. Swap this stage slot to production when you're ready. Don't get in the habit of manually pushing to production. Your code base should be able to indicate the version or commit that is on a slot. 

## Prerequisites for developing Azure Functions

* [Node.js LTS](https://nodejs.org/)
* [Azure Functions Core Tools](/azure/azure-functions/functions-run-local)

## A simple JavaScript function for HTTP requests

A function is an exported asynchronous function with request and context information. The following partial screenshot from the Azure portal shows the function code. 

#### [v4 TypeScript](#tab/v4-ts)

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function status(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return {
        status: 200,
        jsonBody: {
            env: process.env
        }
    };
};

app.http('status', {
    route: "status",
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: status
});
```

#### [v4 JavaScript](#tab/v4-js)

```javascript
import { app } from "@azure/functions";

async function status(request, context) {
    context.log(`Http function processed request for url "${request.url}"`);

    return {
        status: 200,
        jsonBody: {
            env: process.env
        }
    };
};

app.http('status', {
    route: "status",
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: status
});

module.exports = status
```


---

## Develop functions locally with Visual Studio Code and extensions

Create your [first function](/azure/azure-functions/functions-create-first-function-vs-code) using Visual Studio Code. Visual Studio Code, simplifies many of the details with the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

This extension helps you create JavaScript and TypeScript functions with common templates. 

## Integrate with other Azure services

Serverless functions remove much of the server configuration and management so you can focus on just the code you need. 

* Low-code functions: With Azure Functions, you create functions triggered by other Azure services or that output to other Azure service using [trigger bindings](/azure/azure-functions/functions-triggers-bindings). 
* High-code functions: For more control, use the Azure SDKs to coordinate and control other Azure services.

## Related content

* [Store unstructured data using Azure Functions and Azure Cosmos DB](/azure/azure-functions/functions-integrate-store-unstructured-data-cosmosdb?tabs=javascript)
* [Node.js + Azure Functions samples](/samples/browse/?languages=javascript%2Cnodejs&products=azure-functions)

---
title: Serverless Node.js code with Azure Functions
description: Azure Functions provides Node.js serverless code infrastructure with JavaScript and TypeScript, allowing you to create responsive, on-demand HTTP endpoints.
ms.topic: how-to
ms.date: 04/11/2023
ms.custom: seo-javascript-september2019, seo-javascript-october2019, devx-track-js, contperf-fy21q2,engagement-fy23
---

# Use Azure Functions to develop Node.js serverless solutions

Azure Functions provides serverless code infrastructure, allowing you to create responsive, on-demand HTTP endpoints. Serverless apps are composed of JavaScript or TypeScript code that runs in response to various events. 

Functions provide you with:

* Abstraction of web service - you focus on code, not infrastructure.
* Integration with Azure services - trigger work into or out of an Azure service with events
* Integrate with JavaScript packages - use your favorite npm packages with your serverless code

* [Azure serverless community library of samples](https://serverlesslibrary.net/)

## What is a Function resource?

An Azure Function resource is a logical unit for all related functions in a single Azure geographic location. The resource can contain a single function or many functions, which can be independent of each other or related with input or output bindings. You can select from many common functions or create your own.

The function resource settings include typical serverless configurations including environment variables, authentication, logging, and CORS.  

## Durable, stateful functions 

[Durable Functions](/azure/azure-functions/durable/durable-functions-overview) retain *state*, or manage long-running functions in Azure. [Create your first durable function in JavaScript](/azure/azure-functions/durable/quickstart-js-vscode).

## Static web apps include functions 

When developing a static front-end client application (such as Angular, React, or Vue), which also need serverless APIs, use [Static Web apps](/azure/static-web-apps/getting-started?tabs=react) with functions to bundle both together. 

### Proxy from client app to the API
If you intend to deploy your API with your Static web app, you don't need to proxy your client application's API calls. The proxy is established for you, including local and remote development.

When developing locally with a Static Web App and Azure Functions, the [Azure Static Web App CLI](https://github.com/Azure/static-web-apps-cli) provides the local proxy. 

## Common security settings you need to configure for your Azure Function

The following common settings should be configured to keep your Azure Function secure:

* Configuration settings
  * Configuration settings - create Application settings for settings that don't impact security. 
  * Secrets and keys - for any settings that impact security, create an [Azure Key Vault](/azure/key-vault/) and [pull in those settings from your Key Vault](/azure/app-service/app-service-key-vault-references?toc=%2Fazure%2Fazure-functions%2Ftoc.json&tabs=azure-cli).
  * FTP state on Platform settings - by default, all are allowed. You need to select **FTPS only** or disable FTP entirely to improve security. 
* API CORS - configure your client domains. Don't use `*`, indicating all domains. 
* TLS/SSL setting for HTTPS - by default, your API accepts HTTP and HTTPS requests. Enable **HTTPS only** in the **TLS/SSL settings**. Because your Function app is hosted on a secure subdomain, you can use it immediately (with `https`) and delay purchasing a domain name, and using a certificate for the domain until you're ready. 
* Deployment Slots - create a deployment slot, such as `stage` or `preflight` and push to that slot. Swap this stage slot to production when you're ready. Don't get in the habit of manually pushing to production. Your code base should be able to indicate the version or commit that is on a slot. 

## A simple JavaScript function for HTTP requests

A function is an exported asynchronous function with request and context information. The following partial screenshot from the Azure portal shows the function code. image.png

#### [v4 (preview)](#tab/v4)

:::image type="content" source="../media/howto-serverless/portal-screenshot-azure-function-http-v4.png" alt-text="Screenshot of Azure Function in Azure portal showing v4 programming model.":::

#### [v3](#tab/v3)

:::image type="content" source="../media/howto-serverless/portal-screenshot-azure-function-http.png" alt-text="Screenshot of Azure Function in Azure portal.":::

---

## Develop functions locally with Visual Studio Code and extensions

Create your [first function](/azure/azure-functions/functions-create-first-function-vs-code) using Visual Studio Code. Visual Studio Code, simplifies many of the details with the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

This extension helps you create JavaScript and TypeScript functions with common templates. 

A JavaScript example of an HTTP function for Azure is: 

#### [v4 (preview)](#tab/v4)

```javascript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// curl --location 'http://localhost:7071/api/world' --data '{"id": "123"}' 'Content-Type: application/json' --verbose
app.get("getWorldById", {
    route: "world/{id}",
    handler: (req, context) => {
        try {
            const id = req.params.id;

            // do something with id
            // then return id

            return {
                jsonBody: { id }
            }
        } catch (err) {
            return { status: 500, body: err.message}
        }

    }
})
```


#### [v3](#tab/v3)

```javascript
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

---

A TypeScript example of an HTTP function for Azure is: 

#### [v4 (preview)](#tab/v4)

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// curl --location 'http://localhost:7071/api/world' --data '{"id": "123"}' 'Content-Type: application/json' --verbose
app.get("getWorldById", {
    route: "world/{id}",
    handler: (req: HttpRequest, context:InvocationContext ):HttpResponseInit => {
        try {
            const id = req.params.id;
            return {
                status: 200,
                /**
                 * If jsonBody is set, the `HttpResponseInit.body` property
                 * will be ignored in favor of this property
                 */
                jsonBody: { id }, 
                headers: null,
                cookies: null,
                /**
                 * Enable content negotiation of response body if true
                 * If false, treat response body as raw
                 * @default false
                 */
                enableContentNegotiation: false
            }
        } catch (err: unknown) {
            return { 
                status: 500, 
                jsonBody: err
            }
        }

    }
})
```

#### [v3](#tab/v3)

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

---

## Configuring the function

#### [v4 (preview)](#tab/v4)

Functions are configured from the `app` object with a name and options. The name is used to identify the function in the Azure portal. The options are used to configure the function.  

```javascript
const appOptions = {
    // required
    methods: ["HEAD"],
    handler: () => {
        try {
            return 
        } catch (err) {
            return { 
                status: 500, 
                jsonBody: err
            }
        }

    },

    // optional
    authLevel: "function",
    route: "status",
}

// curl --head --location 'http://localhost:7071/api/status' --verbose
app.http('status', appOptions)

```


There are convenience methods for the common verbs such as `get`, and `post`. 

```javascript
// curl --location 'http://localhost:7071/api/worlds' 
app.get("getWorlds", {
    route: "worlds",
    handler: (req, context) => {
        try {
            return {
                jsonBody: {
                    worlds
                }
            }
        } catch (err) {
            return { 
                status: 500, 
                jsonBody: err
            }
        }

    }
})
// curl --location 'http://localhost:7071/api/world' --data '{"id":"abc"}' --header 'Content-Type: application/json' --verbose
// if no body sent, returns 404
app.post("addWorld", {
    route: "world",
    handler: async (req, context) => {
        try {

            const { id }:any = await req.json();

            worlds.push(id);
            return {
                jsonBody: { id }
            }
        } catch (err) {
            return { 
                status: 500, 
                jsonBody: err
            }
        }

    }
})
```
 

#### [v3](#tab/v3)

Functions are configured with the **function.json** file. This configuration allows you to configure how the function is triggered ("direction": in) and what the function returns ("direction": out). It also allows you to set environment variables, and other necessary information for the function to work. Learn more about the [trigger and binding](/azure/azure-functions/functions-triggers-bindings?tabs=javascript.md). 

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

---

## Integrate with other Azure services

Serverless functions remove much of the server configuration and management so you can focus on just the code you need. 

* Low-code functions: With Azure Functions, you can create functions that are triggered by other Azure services or that output to other Azure service using [trigger bindings](/azure/azure-functions/functions-triggers-bindings). 
* High-code functions: For more control, use the Azure SDKs to coordinate and control other Azure services.

## Next steps

The [Azure Functions developer guide for JavaScript](/azure/azure-functions/functions-reference-node) is a good starting point. 

Use the Learn module to learn how to [enable automatic updates in a web app using Azure functions and SignalR Service](/training/modules/automatic-update-of-a-webapp-using-azure-functions-and-signalr/).

* [Run code on a timer](/azure/azure-functions/functions-create-scheduled-function)
* [Run code when files are uploaded or updated in Azure Blob storage](/azure/storage/blobs/storage-upload-process-images?tabs=nodejsv10)
* [Run code when a message is written into Azure Queue Storage](/azure/azure-functions/functions-create-storage-queue-triggered-function)
* [Store unstructured data using Azure Functions and Azure Cosmos DB](/azure/azure-functions/functions-integrate-store-unstructured-data-cosmosdb?tabs=javascript)
* [Node.js + Azure Functions samples](/samples/browse/?languages=javascript%2Cnodejs&products=azure-functions)

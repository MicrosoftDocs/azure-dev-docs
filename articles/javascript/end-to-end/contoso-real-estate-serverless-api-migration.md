---
title: "Migrate Contoso Real Estate Serverless APIs to v4 programming model for Node.js"
description: Understand the Contoso Real Estate serverless API migration with Azure Functions to the v4 programming model.
ms.topic: tutorial
ms.date: 10/23/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
# CustomerIntent: As a senior developer new to Azure, I want to migrate my v4 programming model API to v4 so that my serverless code is more idiomatic of Node.js development.
---

# Migrate Contoso Real Estate Serverless APIs from v3 to v4 programming model for Node.js

Use this migration guide to understand the Contoso Real Estate serverless API migration with Azure Functions to the v4 programming model.

## Considerations for design, development, deployment, and devops

While a migration appears at first glance to move from one programming model to another, there are many considerations to take into account. The following sections provide guidance on how to approach the migration.

Considerations: 

* **Design**: The v4 programming model for Azure Functions is tightly coupled to a file and folder structure which works for smaller projects, but can be difficult to manage for larger projects. The v4 programming model allows for more flexibility in the design of your functions, but it is important to understand the tradeoffs of the design decisions you make.
* **Development**: This new file/folder flexibility allows you to organize your routes in files separate from the handlers. 
* **Deployment**: If you are deploying both the v3 and v4 programming model applications within your infrastructure, be careful to isolate the two applications from each other. The v3 and v4 programming models use different versions of the Azure Functions runtime, and you should not deploy them to the same function app. If you are deploying from a monorepo, consider keeping the two programming model versions separated by branches until you are ready to merge the v4 programming model into your main deployment branch. 
* **DeOps**: While both versions are available, make sure any tests for the v3 version work against the v4 version. Make sure any observability tools you use are able to monitor both versions.

## Separate the v3 and v4 programming models

For the Contoso Real Estate project, the v3 and v4 programming models are separated into two different folders. The v3 programming model is in the `api` folder, and the v4 programming model is in the `api-v4` folder. This separation allows you to deploy the two versions separately.

For the Contoso Real Estate monorepo, the root level `node_modules` controls all dependencies. During development in a separate branch, install dependencies into the `api-v4` directory instead of using the workspace. This ensures that the v3 and v4 programming models don't collide.

When you are ready to merge the v4 programming model into the main branch, you can install the dependencies into the workspace and continue from there. You will need to validate the workspace builds, deploys, and tests correctly with the v4 programming model.

## Migrate from the v3 programming model to the v4 programming model

Because the v4 Node.js programming model has more flexibility, you should take the time in the beginning of the migration to understand how you and your team want to organize routes, handlers, and the integration code the handlers use. To understand this, let's look at the v3 programming model and v4 programming model for a single HTTP route.

**v3 programming model**

The function definition is contained in a separate file, `function.json`, from the code.

**v3 Function definition**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ],
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ],
  "scriptFile": "../dist/HttpTrigger1/index.js"
}
```

**v3 Function code**

```typescript
// v3 programming model
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

**v4 Function code**

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `Hello, ${name}!` };
};

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTrigger1
});
```

There are a few things about the v4 programming model, when compared to v3, that make it more flexible:

* The function definition and handler as code makes it easier to organize and refactor
* Types, such as `InvocationContext`, make it easier to mock and test

## Organize routes

The v4 programming model allows you to organize routes in separate files from the handlers. This allows you to organize your routes in a way that makes sense for your application. For example, you can organize routes in a serverless app `index.ts`:

```typescript
import { app } from "@azure/functions";
import { getListingById, getListings } from "./functions/listings";

app.get("get-listing-by-id", {
  route: "listings/{id}",
  authLevel: "anonymous",
  handler: getListingById,
});

app.get("get-listings", {
  route: "listings",
  authLevel: "anonymous",
  handler: getListings,
});
```

## Settings route parameters

**v3 programming model**: `functions.json` bindings.route: 

```json
{
  "bindings": [
    {
      "route": "listings/{id}"
    }
}
```

**v4 programming model**: `index.ts` main route file:

```typescript
app.get("get-listing-by-id", {
  route: "listings/{id}",
  authLevel: "anonymous",
  handler: getListingById,
});
``````

## Separate handlers for integration code

The handlers are organized in the `./functions` directory by feature. This allows you to separate the integration code from the handler code. For example, the handler associated with favorites in the `./functions/favorites.ts` looks like

```typescript
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { pgQuery } from "../config/pgclient";

// GET Listings By ID
export async function getListingById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    ...removed for brevity...
}
// GET Listings
export async function getListings(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    ...removed for brevity...
}
```


## Getting request information 

Getting request information includes the:

* Query string
    * v3: `req.query.name`
    * v4: `req.query.get("name")`
* Body
    * v3: use one of the following methods:
        * `req.body`
        * `req.rawBody`
        * `req.bufferBody`
        * `await req.parseFormBody();`
    * v4: use one of the following methods:
        * `await req.text();`
        * `await req.json();`
        * `await req.formData()`
        * `await req.arrayBuffer();`
        * `await req.blob();`
* Headers
    * v3: use one of the following: 
        * `req.get('content-type')`
        * `req.headers.get('content-type')`
        * `context.bindingData.headers['content-type']`
    * v4: `req.headers.get('content-type')`

## Get listings API changes

The significant changes for the **listings** API between v3 programming model and v4 programming model include: 

* Getting information from request
* Returning information from the handler




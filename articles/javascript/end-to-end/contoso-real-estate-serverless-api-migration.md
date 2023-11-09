---
title: "Migrate Contoso Real Estate Serverless APIs to v4 programming model for Node.js"
description: Understand the Contoso Real Estate serverless API migration with Azure Functions to the v4 programming model.
ms.topic: tutorial
ms.date: 10/23/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
# CustomerIntent: As a senior developer new to Azure, I want to migrate my v4 programming model API to v4 so that my serverless code is more idiomatic of Node.js development.
---

# Migrate Azure Function APIs from v3 to v4 programming model for Node.js

Use this migration guide to understand the Contoso Real Estate serverless API migration with Azure Functions to the v4 programming model.

## Considerations for 4Dx when migrating to v4 programming model

While a migration appears at first glance to move from one programming model to another, there are many considerations to take into account. The following sections provide guidance on how to plan and complete the migration.

Considerations: 

* Design: V3 is tied to a specific file structure, good for small projects but hard for large ones. V4 offers more design flexibility, but requires careful decision-making.
* Development: V4 allows you to separate routes and handlers into different files.
* Deployment: Keep v3 and v4 apps separate, as they use different Azure Functions runtimes. If using a monorepo, keep versions on separate branches until ready to merge.
* DevOps: Ensure tests for v3 also work for v4, and that your monitoring tools can handle both versions.

## Manage development between programming models

For the Contoso Real Estate project, the v3 and v4 programming models are separated into two different folders. The v3 programming model is in the `api-legacy` folder, and the v4 programming model is in the `api` folder. 

For the Contoso Real Estate monorepo managed with [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces), the root level `node_modules` controls all dependencies across the packages. Both the v3 and v4 use **@azure/functions** but use different versions. Only one package of the API should be included in the **package.json** _packages_ property at any time. When the migration is complete, make sure the packages list in the package.json file at the root of the project does not refer to the `api-legacy` folder. 

> [!NOTE]
> **Workspaces** is a generic term that refers to the set of features in the npm cli that provides support to managing multiple packages from your local file system from within a singular top-level, root package.

## Migrate code for v4 programming model

Because the v4 Node.js programming model has more flexibility, you should take the time in the beginning of the migration to understand how your team want to organize routes, handlers, and the integration code the handlers use. To understand this, let's look at the v3 programming model and v4 programming model for a single HTTP route.

**v3 programming model**

The function definition is contained in a separate file, `function.json`, from the code.

:::row:::
    :::column:::
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
    :::column-end:::
    :::column:::
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
    :::column-end:::
:::row-end:::

There are a few things about the v4 programming model, when compared to v3, that make it more flexible:

* The function definition and handler as code makes it easier to organize and refactor
* Types, such as `InvocationContext`, make it easier to mock and test

## Organize routes for v4 programming model

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


// remaining routes removed for brevity


```

## Settings route parameters for v4 programming model

The definition of a route that uses a parameter has changed between the v3 programming model and the v4 programming model. However the way you access the route parameter in the handler is the same.

**v3 programming model**: `functions.json` bindings.route: 

```json
{
  "bindings": [
    {
      "route": "listings/{id}"
    }
  ]
}
```

**v3 programming model**: access route parameters in the handler:

```typescript
// same for v3 and v4 programming models
const id = req.params.id;
``` 

**v4 programming model**: `index.ts` main route file:

```typescript
app.get("get-listing-by-id", {
  route: "listings/{id}",
  authLevel: "anonymous",
  handler: getListingById,
});
```

**v4 programming model**: access route parameters in the handler:

```typescript
// same for v3 and v4 programming models
 const id = req.params.id;
``` 

## Separate handlers for integration code in v4 programming model

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
## Getting request information in v4 programming model

Getting request information includes the following information:

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

## Setting response information in v4 programming model

The response information has changed from the v3 programming model to the v4 programming model. The following table shows the changes:

**v3 programming model**: 

```typescript
context.res = {
      status: 200,
      body: listing,
      headers: {
        "content-type": "application/json",
      },
};
```

The response in v3 programming model is loosely typed as key/value pairs. 

**v4 programming model**: 

```typescript
return {
  status: 200,
  jsonBody: listing,
  headers: {
      "content-type": "application/json",
  },
 cookies: undefined
};
```

The response in v4 programming model is strongly typed. 
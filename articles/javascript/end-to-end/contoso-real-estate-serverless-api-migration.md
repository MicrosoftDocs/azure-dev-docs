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

The migration covers the move from the v3 programming model to the v4 programming model. The new model allows complete flexibility in folder and file organization. This flexibility allows you to rethink and refactor as part of the migration. Minimize your refactoring so your existing tests works on both versions. Once this code migration and testing are complete, then you can continue to refactor and improve the code.

## Manage monorepo workspace dependencies for v4 programming model

The Azure Functions app in the Contoso Real Estate project is part of a monorepo controlled with npm workspaces. Its important to understand the environment and tooling before migrating to the v4 programming model in this environment.

> [!NOTE]
> **Workspaces** is a generic term that refers to the set of features in the npm cli that provides support to managing multiple packages from your local file system from within a singular top-level, root package.


For the Contoso Real Estate project, the source code projects are managed by npm workspaces from a single `/packages` subfolder. The original v3 sat in the `api` folder and all the provisioning and deployment provided by the [Azure Developer CLI](/azure/developer/azure-developer-cli) and [Bicep](/azure/azure-resource-manager/bicep/) uses that folder name. The `api` package is just one of several applications within the monorepo's workspaces. The use of an npm workspace means there is a single `node_modules` folder. In order to use this single `node_modules` folder correctly, meaning only one version of Azure Functions app dependencies are installed, you have to separate the v3 and v4 programming models into separate branches during migration. Keep v3 in the main branch, start v4 in a new branch, and then merge the v4 branch into the main branch when the migration is complete.

## Archive the Azure Functions Node.js v3 programming model**

To archive the v3 programming model, you need to do the following:

1. Run the following command to move the v3 api code into `./packages/api-legacy` folder. This allows you to keep the code around until the migration is completed deployed to all required regions and thouroughly tested.

    ```bash
    git mv ./packages/api ./packages/api-legacy
    ```

    This command keeps the file history and updates the git index. When you look at the PR, you don't see deletes and adds with brand new files but instead just file moves. This makes it easier to review the PR and understand the changes.

2. Update the packages list in the `package.json` file at the root of the project so it does not refer to the `api-legacy` folder. 

    ```json
    "workspaces": [
        "packages/*",
        "!packages/api-legacy"
    ],
    ```

    If you don't update the workspaces, the dependencies will contain different versions of the **@azure/functions** package for both v3 and v4. This may cause the deployment to fail to build or deploy, or it may cause the Azure Functions runtime to fail to start correctly.

3. Run the following command to remove the existing `./node_modules` folder with the following 

    ```bash
    rm -rf ./node_modules
    ```

## Create the Azure Functions Node.js v4 programming model

To **create the v4 programming model**, you need to do the following:

1. Create your new Azure Functions v4 programming model in a new `api` folder under the **packages** folder. Create the app with either the [Azure Functions Core Tools](/azure/azure-functions/functions-run-local?tabs=linux,node-v4,http-trigger,container-apps&pivots=programming-language-javascript) or the [Azure Functions extension for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions). This creates all the correct and updated dependencies including the new `@azure/functions` v4 version.

2. Run the following command to remove the `./packages/api/package-lock.json` file. This file is not needed because the `./packages/api/package-lock.json` file is not used to deploy the app.

    ```bash
    rm ./packages/api/package-lock.json
    ```

3. Run the following command to install all the packages again.

    ```bash
    npm install
    ```

    This also creates the correct `./node_modules` folder with the correct dependencies for the v4 programming model.


At this point, your monorepo development environment is ready to start the migration of the code.

## Migrate code for v4 programming model

Because the v4 Node.js programming model has more flexibility, you should take the time in the beginning of the migration to understand how your team wants to organize routes, handlers, and the integration code the handlers use. To understand this, let's look at the two programming model for a single HTTP route. The following example has been minimized to the key elements to understand the differences between the two programming models.

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

* The v4 function definition and handler can be contained within the same file which makes it easier to understand
* The v4 handler is exported which the app is extended. This is an important distinction because it allows you to:
    * Separate the handler from the app. 
    * Test the handler without the app.
* TypeScript types, such as [`InvocationContext`](/azure/azure-functions/functions-reference-node?tabs=typescript%2Clinux%2Cazure-cli&pivots=nodejs-model-v4#invocation-context), make it easier to mock and test.

## Organize routes for v4 programming model

Organize the routes so you can easily scan them for completeness.

```typescript
import { app } from "@azure/functions";
import { getListingById, getListings } from "./functions/listings";

app.get("listing-get-by-id", {
  route: "listings/{id}",
  authLevel: "anonymous",
  handler: getListingById,
});

app.get("listings-get", {
  route: "listings",
  authLevel: "anonymous",
  handler: getListings,
});
// remaining routes removed for brevity
```

The first parameter, such as `listing-get-by-id`, must be unique and is the name of the API as it is shown in the Azure Portal. Use a naming convention that allows you to quickly find the API you need in the Azure portal. Because the portal shows you API level testing and monitoring, the naming convention becomes part of your end-to-end developer experience. 

:::image type="content" source="./media/contoso-real-estate-serverless-api-migration/azure-portal-function-list-apis.png" alt-text="Screenshot of Azure portal for Azure Function app showing list of APIs.":::

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

For the Contoso Real Estate project, the handlers are organized in the `./functions` directory by feature. This allows you to separate the integration code from the handler code. For example, the handler associated with favorites in the `./functions/favorites.ts` looks like

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

## Testing with mock context in v4 programming model

This separation you to test the handlers separately from the integration code. For example, the following test uses the [Jest](https://jestjs.io/) testing framework to test the `getListings` handler.

The context is mocked using the following code:

```typescript
// test-utils.ts
import { Context } from "@azure/functions";

export const mockContext: Context = {
  invocationId: "mockInvocationId",
  executionContext: {
    invocationId: "mockInvocationId",
    functionName: "mockFunctionName",
    functionDirectory: "mockFunctionDirectory",
  },
  bindings: {},
  bindingData: {},
  traceContext: {
    traceparent: "",
    tracestate: "",
    attributes: {},
  },
  log: jest.fn(),
  done: jest.fn(),
  traceContextSource: "mockTraceContextSource",
};
```

Then the handler is tested using the following code:

```typescript
import { getListings } from "./listings";
import { mockContext } from "../test-utils";

describe("getListings", () => {
  it("should return listings", async () => {
    const response = await getListings({}, mockContext);
    expect(response.status).toEqual(200);
    expect(response.headers).toEqual({
      "content-type": "application/json",
    });
    expect(response.body).toBeDefined();
  });
});
```

## Testing with request information in v4 programming model

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

When testing the handler, you can use the following code to create a mock request:

```typescript
import { HttpRequest } from "@azure/functions";

export const mockRequest = (method: string, url: string, body?: string): HttpRequest => {
  const request = new HttpRequest(method, url);
  if (body) {
    request.headers.set("content-type", "application/json");
    request.body = body;
  }
  return request;
};
```

Then to use the request in your test, you can use the following code:

```typescript
import { getListings } from "./listings";
import { mockContext } from "../test-utils";
import { mockRequest } from "../test-utils";

describe("getListings", () => {
  it("should return listings", async () => {
    const request = mockRequest("GET", "http://localhost:7071/api/listings");
    const response = await getListings(request, mockContext);
    expect(response.status).toEqual(200);
    expect(response.headers).toEqual({
      "content-type": "application/json",
    });
    expect(response.body).toBeDefined();
  });
});
```    


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

The response in v4 programming model is strongly typed with the [HttpResponseInit](/azure/azure-functions/functions-reference-node?tabs=typescript%2Clinux%2Cazure-cli&pivots=nodejs-model-v4#http-response).
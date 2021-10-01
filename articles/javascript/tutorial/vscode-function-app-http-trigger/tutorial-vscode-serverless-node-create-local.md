---
title: Create the Azure Functions 3.x application from Visual Studio Code
description: Create a local Azure Functions (serverless) application that contains a function that uses an HTTP trigger. An Azure Functions app can contain many Functions with different triggers. The HTTP trigger specifically handles incoming HTTP traffic.
ms.topic: tutorial
ms.date: 9/29/2021
ms.custom: devx-track-js, contperf-fy21q2
---

# 2. Create the local Functions app with the Visual Studio Code _Functions_ extension

Create a local Azure Functions (serverless) application that contains an [HTTP trigger](/azure/azure-functions/functions-reference-node#http-triggers-and-bindings) function. 

1. Create a new directory on your local workstation, then open Visual Studio Code in this directory. 

1. In Visual Studio Code, select the Azure logo to open the **Azure Functions** explorer, then select the **Create New Project** command:

    ![Create a local Function app in VS Code](../../media/functions-extension/create-function-app-project.png)

1. Use the following table to finish creating the local Azure Function project:

    |Prompt|Value|Notes|
    |--|--|--|
    |Select the folder that will contain your function project.|Select the current folder, which is the default value.||
    |Select a language|TypeScript||
    |Select a template for your project's first function|HTTP Trigger|API is invoked with an HTTP request.|
    |Provide a function name|`category`|API route is `/api/category`|
    |Authorization Level|Function|This locks the remote API to requests that pass the function key with the request. While developing locally, you won't need the function key.|
    |Select how you would like to open your project|Open in current window.||

    This process doesn't create cloud-based Azure Function resource. That [step](tutorial-vscode-serverless-node-deploy-hosting.md) will come later.

1. After a few moments, VS Code completes creation of the project. You have a folder named for the function, *category*, within which are three files:

    | Filename | Description |
    | --- | --- |
    | *index.js* |  The source code that responds to the HTTP request. |
    | *function.json* | The [binding configuration](/azure/azure-functions/functions-triggers-bindings) for the HTTP trigger. |
    | *sample.dat* | A placeholder data file to demonstrate that you can have other files in the folder. You can delete this file, if desired, as it's not used in this tutorial. |

## Install npm package dependencies from bash terminal

1. In Visual Studio Code, open an integrated bash terminal, <kbd>Ctrl</kbd> + <kbd>`</kbd>.
1. Install npm dependencies:

    ```bash
    npm install
    ```

## Change the function's code

The basic code to respond to the HTTP request is provided for you. If you are familiar with the HTTP request (the _req_ parameter) and response objects, the function should seem familiar. You return response information with the **context** object on the `res` property.  

<a name="http-function-javascript-template-code"></a>

Create a new context.log message after the name variable and change it to appear more obvious when scanning the logs.

```typescript
context.log(`*** HTTPExample name: ${name}`);
```

The new function code is:

:::code language="typescript" source="~/../js-e2e-azure-function-mongodb/edited-function-code.ts" highlight="6":::

## Next steps

> [!div class="nextstepaction"]
> [Run the local function app](tutorial-vscode-serverless-node-test-local.md)

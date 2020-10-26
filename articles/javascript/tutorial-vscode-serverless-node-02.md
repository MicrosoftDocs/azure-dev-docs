---
title: Create the Azure Functions application from Visual Studio Code
description: Serverless Tutorial part 2, create the Azure Functions app
ms.topic: tutorial
ms.date: 09/23/2019
ms.custom: devx-track-js
---

# Create the local Functions app

[Previous step: Introduction and prerequisites](tutorial-vscode-serverless-node-01.md)

In this step, you create a local Azure Functions application that contains a function that uses an [HTTP trigger](/azure/azure-functions/functions-reference-node#http-triggers-and-bindings). An Azure Functions app can contain many Functions with [different triggers](/azure/azure-functions/functions-triggers-bindings). The HTTP trigger specifically handles incoming HTTP traffic.

1. From a terminal or command prompt, run Visual Studio Code from within a suitable folder for the project:

    ```bash
    # Create and navigate to a project folder

    # Run VS Code in that folder
    code .
    ```

1. In VS Code, select the Azure logo to open the **Azure Functions** explorer, then select the **Create Project** command:

    ![Create a local Function app in VS Code](media/functions-extension/create-function-app-project.png)

1. At the first two prompts, select the current folder, then select **JavaScript** for the language.

1. At the prompt, **Select a template for your project's first function**, select **HTTP Trigger**:

    ![Select the trigger for the Function](media/functions-extension/create-function-choose-template.png)

1. At the prompt, **Provide a function name**, enter **HttpExample**. (Avoid using the default "HttpTrigger" name because it's the same as the trigger, which can be confusing.)

    ![Entering a function name](media/functions-extension/create-function-name.png)

1. At the prompt, **Authorization Level**, select **Anonymous**:

    ![ At the prompt, `Authorization Level`, select `Anonymous`](media/functions-extension/create-function-anonymous-auth.png)

1. After a few moments, VS Code completes creation of the project. You have a folder named for the function, *HttpExample*, within which are three files:

    | Filename | Description |
    | --- | --- |
    | *index.js* |  The source code that responds to the HTTP request. |
    | *function.json* | The [binding configuration](/azure/azure-functions/functions-triggers-bindings) for the HTTP trigger. |
    | *sample.dat* | A placeholder data file to demonstrate that you can have other files in the folder. You can delete this file, if desired, as it's not used in this tutorial. |

    ![Result of creating a function app](media/functions-extension/create-function-app-results.png)

> [!div class="nextstepaction"]
> [I created the Functions app](tutorial-vscode-serverless-node-03.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azurefunctions&step=create-app)
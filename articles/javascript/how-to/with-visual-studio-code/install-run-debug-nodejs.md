---
title: Develop Node.js with Visual Studio Code
description: Learn the steps to developer and debug your JavaScript Node.js project with Visual Studio.
ms.topic: how-to
ms.date: 01/10/2022
ms.custom: devx-track-js
---

# How to develop and debug Node.js with Visual Studio Code

Learn the steps to developer and debug your JavaScript Node.js project with Visual Studio. 

## Prepare your environment

1. Install [Visual Studio Code](https://code.visualstudio.com/). 
1. Install [git](https://git-scm.com/). Visual Studio Code integrates with git to provide *Source Control* management in the [Side Bar](https://code.visualstudio.com/docs/getstarted/userinterface).

1. Add environment variables needed. This article uses assumes a mongoDB database connection string.

    If you don't have a mongoDB database available, you can:
    * Choose to run this local project in a multi-container configuration where one of the containers is a mongoDB database. Install the [Docker](https://www.docker.com/) and [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension to get a multi-container configure with one of the containers running a local mongoDB database. 
    * Choose to create an [Azure Cosmos DB](/azure/cosmos-db/) resource for a mongoDB database. Learn more with this [tutorial](../../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md#create-a-cosmos-db-database-resource-for-mongodb).

## Clone project

To get started, clone the sample project using the following steps:

1. Open Visual Studio Code.

1. Press **F1** to display the command palette.

1. At the command palette prompt, enter `gitcl`, select the **Git: Clone** command, and press **Enter**.

    ![gitcl command in the Visual Studio Code command palette prompt](../../media/node-howto-e2e/visual-studio-code-git-clone.png)

1. When prompted for the **Repository URL**, enter `https://github.com/Azure-Samples/js-e2e-express-mongodb`, then press **Enter**.

1. Select (or create) the local directory into which you want to clone the project.

    :::image type="content" source="../../media/node-howto-e2e/visual-studio-code-mongodb-explorer.png" alt-text="Partial screenshot of Visual Studio Code showing the file explorer for a Node.js and MongoDB project.":::

## Install dependencies

With this Node.js project, you must first ensure that all of the project's dependencies are installed from npm.  

1. Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>`</kbd> to display the Visual Studio Code integrated terminal. 

1. Use the following command to install dependencies:

    ```bash
    npm install
    ```

## Navigate the project files and code

In order to orient ourselves within the codebase, let's play around with some examples of some of the navigation capabilities that Visual Studio Code provides.

1. Press <kbd>Ctrl</kbd> + <kbd>p</kbd>.

1. Enter `.js` to display all the JavaScript/JSON files in the project along with each file's parent directory 

1. Select *server.js*, which is the startup script for the app.

1. Hover your mouse over the **timestamp** on line 11. This ability to quickly inspect variables, modules, and types within a file is useful during the development of your projects. 

    ![Discover type in Visual Studio Code with hover help](../../media/node-howto-e2e/visual-studio-code-hover-help.png)

1. Clicking your mouse on a variable - such as **timestamp** - allows you to see all references to that variable within the same file. To view all references to a variable within the project, right-click the variable, and from the context menu, and select **Find All References**.

    :::image type="content" source="../../media/node-howto-e2e/visual-studio-code-find-all-references.png" alt-text="Screenshot of Visual Studio Code with the `timestamp` variable highlighted." lightbox="../../media/node-howto-e2e/visual-studio-code-find-all-references.png":::

## Use Visual Studio Code autocompletion with mongoDB

1. Open the *data.js* file

1. On line 84, enter a new use of the **db** variable by entering `db.`. Visual Studio Code displays the available members of the API available on `db`.

:::image type="content" source="../../media/node-howto-e2e/visual-studio-code-mongodb-code-completion.png" alt-text="Full screenshot of Visual Studio Code showing the code completion pop-up window highlighted with a red box.":::

Autocompletion works because Visual Studio Code uses TypeScript behind the scenes - even for JavaScript - to provide type information that can then be used to inform the completion list as you type. This auto-acquisition of typings works for over 2,000 third-party modules, such as React, Underscore, and Express. 

You can see which modules support this autocomplete capability by browsing the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) project, which is the community-driven source of all TypeScript type definitions.

## Running the local Node.js app

Once you've explored the code, it's time to run the app. To run the app from Visual Studio Code, press <kbd>F5</kbd>. When running the code via **F5** (debug mode), Visual Studio Code launches the app and displays the **Debug Console** window that displays stdout for the app.

![Monitoring an app's stdout via the Debug console](../../media/node-howto-e2e/visual-studio-code-debug-console.png)

Additionally, the **Debug Console** is attached to the newly running app so you can type JavaScript expressions, which will be evaluated in the app, and also includes autocompletion. To see this behavior, type `process.env` in the console:

![Typing code into the Debug console](../../media/node-howto-e2e/visual-studio-code-debug-console-autocomplete.png)

Open a browser, and navigate to `http://localhost:8080` to see the running app. Enter text in the textbox to add an item to get a feel for how the app works.

## Debugging the local Node.js app

In addition to being able to run the app and interact with it via the integrated console, you can set breakpoints directly within your code. For example, enter <kbd>Ctrl</kbd> + <kbd>P</kbd> to display the file picker. Once the file picker displays, and select the *server.js* file.

Set a breakpoint on line 53, which is the if statement in the route for adding a new item. To set a breakpoint, simply click the area to the left of the line number within the editor as shown in the following figure.

![Setting a breakpoint within Visual Studio Code](../../media/node-howto-e2e/visual-studio-code-set-breakpoint.png)

> [!NOTE]
> In addition to standard breakpoints, Visual Studio Code supports conditional breakpoints that allow you to customize when the app should suspend execution. To set a conditional breakpoint, right-click the area to the left of the line on which you wish to pause execution, select **Add Conditional Breakpoint**, and specify either a JavaScript expression (for example, `foo = "bar"`) or execution count that defines the condition under which you want to pause execution.

Once the breakpoint has been set, return to the running app in a browser and add an entry. This action immediately causes the app to suspend execution on line 28 where you set the breakpoint:

![Visual Studio Code pausing execution on a breakpoint](../../media/node-howto-e2e/visual-studio-code-pause-breakpoint-execution.png)

Once the application has been paused, you can hover your mouse over the code's expressions to view their current value, inspect the locals/watches and call stack, and use the debug toolbar to step through the code execution. Press **F5** to resume execution of the app.

## Local full-stack debugging in Visual Studio Code

The front-end and back-end are both written using JavaScript. So, while you're currently debugging the back-end (Node/Express) code, at some point, you may need to debug the front-end (Angular) code. 

While you were able to run and debug the Node.js code without any Visual Studio Code-specific configuration, in order to debug a front-end web app, you need to use a *launch.json* file that instructs Visual Studio Code how to run the app.

This sample app includes a `launch.json` that includes these debug settings:

:::code language="JavaScript" source="~/../js-e2e-express-mongodb-main/blob/main/.vscode/launch.json":::

Visual Studio Code was able to detect that the app's startup script is *server.js*.

With the *launch.json* file open, select **Add Configuration** (bottom right), and select **Chrome: Launch with userDataDir**.

![Adding a Chrome configuration to Visual Studio Code](../../media/node-howto-e2e/visual-studio-code-add-chrome-config.png)

Adding a new run configuration for Chrome allows you to debug the front-end JavaScript code. 

You can hover your mouse over any of the settings that are specified to view documentation about what the setting does. Additionally, notice that Visual Studio Code automatically detects the URL of the app. Update the **webRoot** property to `${workspaceRoot}/public` so that the Chrome debugger will know where to find the app's front-end assets:

```json
{
   "type": "chrome",
   "request": "launch",
   "name": "Launch Chrome",
   "url": "http://localhost:8080",
   "webRoot": "${workspaceRoot}/public",
   "userDataDir": "${workspaceRoot}/.vscode/chrome"
}
```

In order to launch and debug both the front and back-end at the same time, you need to create a *compound* run configuration, which tells Visual Studio Code which set of configurations to run in parallel.

Add the following snippet as a top-level property within the *launch.json* file (as a sibling of the existing **configurations** property).

```json
"compounds": [
   {
      "name": "Full-Stack",
      "configurations": ["Launch Program", "Launch Chrome"]
   }
]
```

The string values specified in the **compounds.configurations** array refer to the **name** of individual entries in the list of **configurations**. If you've modified those names, you'll need to make the appropriate changes in the array. For example, switch to the debug tab, and change the selected configuration to **Full-Stack** (the name of the compound configuration), and press **F5** to run it.

![Running a configuration in Visual Studio Code](../../media/node-howto-e2e/visual-studio-code-full-stack-configuration.png)

Running the configuration launches the Node.js app (as can be seen in the debug console output) and Chrome (configured to navigate to the Node.js app at `http://localhost:8080`).

Press **Ctrl**+**P**, and enter (or select) *todos.js*, which is the main Angular controller for the app's front end.

Set a breakpoint on line 11, which is the entry-point for a new to-do entry being created.

Return to the running app, add a new to-do entry, and notice that Visual Studio Code has now suspended execution within the Angular code.

![Debugging front-end code in Visual Studio Code](../../media/node-howto-e2e/visual-studio-code-chrome-pause.png)

Like Node.js debugging, you can hover your mouse over expressions, view locals/watches, evaluate expressions in the console, and so on. 

There are two cools things to note:

1. The **Call Stack** pane displays two different stacks: **Node** and **Chrome**, and indicates which one is currently paused.

1. You can step between front and back-end code: press **F5**, which will run and hit the breakpoint previously set in the Express route.

With this setup, you can now efficiently debug front, back, or full-stack JavaScript code directly within Visual Studio Code.

In addition, the compound debugger concept is not limited to just two target processes, and also isn't just limited to JavaScript. Therefore, if work on a microservice app (that is potentially polyglot), you can use the exact same workflow (once you've installed the appropriate extensions for the language/framework).

## Next steps

* [Deploy containers](../deploy-web-app.md)
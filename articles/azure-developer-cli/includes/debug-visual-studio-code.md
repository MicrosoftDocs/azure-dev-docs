---
author: alexwolfmsft
ms.service: azure-dev-cli
ms.topic: include
ms.date: 10/31/2022
ms.author: alexwolf
---

Run and debug apps on your local machine using the [Visual Studio Code](https://code.visualstudio.com/docs) extension for Azure Developer CLI (`azd`). In this guide, you'll use the [React Web App with Node.js API and MongoDB on Azure](https://github.com/azure-samples/todo-nodejs-mongo) template. You can apply the principles you learn in this article to any of the [Azure Developer CLI templates](../azd-templates.md).

## Prerequisites

- [Install azd](../install-azd.md)
- [Run `azd` with the Node.js template](../get-started.md)
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)

## Install the Visual Studio Code extension for Azure Developer CLI

### Via Visual Studio Code

1. Open Visual Studio Code.

1. From the **View** menu, select **Extensions**.

1. In the search field, enter `Azure Developer CLI`.

1. Select **Install**.

### Via Marketplace

1. Using your browser, go to the [Azure Developer CLI - VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev) page.

1. Select **Install**.

## Initialize a new app

1. Create and open a new directory in Visual Studio Code.

1. From the **View** menu, select **Command Palette...**.

1. Type and pick `Azure Developer: init`.

   :::image type="content" source="../media/debug/cmd-init.png" alt-text="Screenshot of the option to initialize a new app.":::

1. Select the template `Azure-Samples/todo-nodejs-mongo`.

   :::image type="content" source="../media/debug/sample-template.png" alt-text="Screenshot of selecting the todo-nodejs-mongo sample template.":::

Explore the following files included in the `.vscode` directory:

| File | Description |
| ---- | ----------- |
| `launch.json` | Defines the debug configurations such as **Debug Web** and **Debug API**. to see the debug configuration options, select **Run** from the **View** menu. The available debug configurations are listed at the top of the pane. To learn more about debugging in Visual Studio Code, see [Debugging](https://code.visualstudio.com/docs/editor/debugging). |
| `tasks.json` | Defines the configurations to start the web or API server. To see these configuration options, open the Command Palette and run **Task: run task**. To learn more about Visual Studio Code Tasks, see [Integrate with External Tools via Tasks](https://code.visualstudio.com/docs/editor/tasks). |

> [!NOTE]
> If you're using the [C# SWA-func MS SQL template]( https://github.com/Azure-Samples/todo-csharp-sql-swa-func), you'll need to manually start the **Start API** task and then **Debug API (F5)**. When asked to pick from a list of running .NET processes, search for the name of your application and select it.

## Provision the Azure resources

Before you start debugging, provision the necessary Azure resources.

1. Open Command Palette.

1. Enter **Azure Developer: provision Azure resources**.

   :::image type="content" source="../media/debug/cmd-provision.png" alt-text="Screenshot of option to provision the Azure resources for a new app.":::

## Debug an API

The debug configuration **Debug API** automatically runs the API server and attaches the debugger. To test this pattern, do the following steps:

1. From your project's `src/api/src/routes` directory, open `lists.ts`.

1. Set a breakpoint at line 16.

1. In the Activity Bar, select **Run and Debug** > **Debug API** debug configuration > **Start Debugging** arrow.

   :::image type="content" source="../media/debug/debug-api.png" alt-text="Screenshot of setting the debug configuration to Debug API.":::

1. From the **View** menu, select **Debug Console**.

1. Wait for the message indicating the debugger is listening on port 3100.

   :::image type="content" source="../media/debug/started-listening-on-port.png" alt-text="Screenshot of the message in the Debug Console indicating the debugger is listening on port 3100.":::

1. In your preferred terminal shell, enter the following command: `curl http://localhost:3100/lists`

   :::image type="content" source="../media/debug/run-curl-command.png" alt-text="Screenshot of using cURL to connect to the API server.":::

1. When the breakpoint you set earlier is hit, app execution will pause. At this point, you can perform standard debugging tasks, such as:
   - Inspect variables
   - Look at the call stack
   - Set other breakpoints.

1. Press `<F5>` to continue running the app. The sample app returns an empty list.

## Debug a React Frontend app

To use the **Debug Web** configuration, you must start both:

- The API server 
- The development web server

To test this pattern, do the following steps:

1. Open the Command Palette and run **Task: Run task**.

   :::image type="content" source="../media/debug/run-task.png" alt-text="Screenshot of running a Visual Studio Code Task.":::

1. Enter and select **Start API and Web**

   :::image type="content" source="../media/debug/run-task-api.png" alt-text="Screenshot of selecting the option to Start API and Web.":::

   You can check if the local web server is running by navigating to the following URL in a web browser: `http://localhost:3000`.

1. In your project's `src/web/src/components` directory, open `todoItemListPane.tsx`.

1. Set a breakpoint on line 150 (the first line of the `deleteItems` function).

1. In the Activity Bar, select **Run and Debug** > **Debug Web** debug configuration > the **Start Debugging** arrow.

   :::image type="content" source="../media/debug/debug-web.png" alt-text="Screenshot of setting the debug configuration to Debug Web.":::

1. Running the web app will cause your default browser to open the following URL: `http://localhost:3000`. You can now debug the app by adding an item, selecting it from the list, and selecting **Delete**.

   :::image type="content" source="../media/debug/sample-app.png" alt-text="Screenshot of the sample Node JS Mongo DB app.":::

1. When the breakpoint you set earlier is hit, app execution will pause. At this point, you can do standard debugging tasks, such as:

   - Inspect variables
   - Look at the call stack
   - Set other breakpoints

1. Press `<F5>` to continue running the app and the selected item will be deleted.

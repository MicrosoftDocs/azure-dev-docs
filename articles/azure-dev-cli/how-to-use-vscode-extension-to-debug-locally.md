---
title: Debug Azure apps using the Azure Developer CLI Visual Studio Code extension
description: How to use the VS Code extension for Azure Developer CLI to run and debug locally.
author: puicchan
ms.author: puichan
ms.date: 06/13/2021
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---
# Debug Azure apps using the Azure Developer CLI Visual Studio Code extension

In this article, you learn how to use the [Visual Studio Code](https://code.visualstudio.com/docs) extension for Azure Developer CLI (azd) to run and debug applications on your local machine.

## Prerequisites

This article assumes you've installed the azd  and created an app from an azd template. If you are new to azd, begin with [Get started](get-started.md) and then return to this article.

## Install the Visual Studio Code extension for Azure Developer CLI

1. Download [Visual Studio Code extension for Azure Developer CLI](https://azuresdkreleasepreview.blob.core.windows.net/azd/vscode/latest/azure-dev-latest.vsix).

1. Open Visual Studio Code

1. From the **View** menu, select **Extensions**.

1. At the top right of the **EXTENSIONS** pane, select **...**.

1. Select **Install from VSIX**.

1. Select the location of the downloaded extension file. After completion of the installation, Visual Studio displays a message indicating the extension has been installed.

## Initialize a new application

1. Create and open a new folder in Visual Studio Code.

1. From the **View** menu, select **Command Palette...**.

1. Type and pick `Azure Developer: init`.

    !["Visual Studio Code azd extension option to initialize a new app"](media/how-to-use-vscode-extension-to-debug-locally/cmd-init.png)

1. Select one of templates and enter the requested values.

The following files are included in the .vscode folder:

- `launch.json`: Defines the debug configurations such as **Debug Web** and **Debug API**. to see the debug configuration options, select **Run** from the **View** menu. The available debug configurations are listed at the top of the pane. To learn more about debugging in Visual Studio Code, see [Debugging](https://code.visualstudio.com/docs/editor/debugging).
- `tasks.json`: Defines the configurations to start the web or API server. To see these configuration options, open the Command Palette and run **Task: run task**. To learn more about Visual Studio Code Tasks, see [Integrate with External Tools via Tasks](https://code.visualstudio.com/docs/editor/tasks).

## Provision the Azure resources

Before you start debugging, provision the necessary Azure resources.

1. Open Command Palette.

1. Enter **Azure Developer: provision Azure resources**.

    !["Visual Studio Code azd extension option to provision the Azure resources for a new application"](media/how-to-use-vscode-extension-to-debug-locally/cmd-provision.png)

## Debug an API

The debug configuration **Debug API** automatically runs the API server and attaches the debugger. To test this pattern, do the following steps:

1. From your project's `src/api/src/routes` directory, open `lists.ts`.

1. Set a breakpoint at line 16.

1. From the Activity Bar, select **Run and Debug** and the **Debug API** debug configuration.
    !["Setting the debug configuration to Debug API"](media/how-to-use-vscode-extension-to-debug-locally/debug-api.png)

1. In your preferred terminal shell, enter the following command: `curl http://localhost:3100/lists`

1. The breakpoint is hit, hit F5, an empty list is returned.

### Scenario 2 - Debug React Frontend Application

To debug web, you need to start both the API server and the development web server so make sure you run the task to start both API and web.

1. In Command Palette, run "Task: run task", select Start API and Web
!["Run Task"](media/how-to-use-vscode-extension-to-debug-locally/run-task.png)
!["Start API and Web"](media/how-to-use-vscode-extension-to-debug-locally/run-task-api.png)
1. (Optional) You can check if the local web server is running by navigating to: http://localhost:3000 in a web browser.
1. Open `todoItemListPane.tsx` in `src > web > src > components`, set a breakpoint on deleteItems (line 150).
1. In the activity bar, select "Run and Debug" (Ctrl-Shift-D) and then "Debug Web". 
1. A web browser (http://localhost:3000) is launched automatically. 
1. You can now debug with the breakpoint, call stacks, and an interactive console.
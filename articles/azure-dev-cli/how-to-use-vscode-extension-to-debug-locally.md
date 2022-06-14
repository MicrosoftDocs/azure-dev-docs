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

1. From the Visual Studio Code **View** menu, select **Extensions**.

1. At the top right of the **EXTENSIONS** pane, select **...**.

1. Select **Install from VSIX**.

1. Select the location of the downloaded extension file. After completion of the installation, Visual Studio displays a message indicating the extension has been installed.

## Initialize a new application

1. Create and open a new folder in Visual Studio Code.

1. From the Visual Studio Code menu, select **Command Palette...**.

1. Type and pick `Azure Developer: init`.

    !["Visual Studio Code extension option to initialize a new application"](media/how-to-use-vscode-extension-to-debug-locally/cmd-init.png)

1. Select one of templates.
    - Provide environment name, location and select the Azure subscription when prompted

The following files are included in the .vscode folder:

- `launch.json` includes debug configurations so you can **Debug Web** or **Debug API**. You see the same options in **Run and Debug** (Ctrl-Shift-D).
- `tasks.json` includes configurations so you can start the web and/or the API servers. You see the same options if you go to the Command Palette and run **Task: run task**.

> [!NOTE]
> Learn more about [Debugging](https://code.visualstudio.com/docs/editor/debugging) and [Tasks](https://code.visualstudio.com/docs/editor/tasks) in VS Code.

## Provision the Azure resources

Before you start debugging, make sure you provision the necessary Azure resources. All infrastructure is running in the cloud and must be provisioned for the application run to succeed. 

1. Open Command Palette (Ctrl+Shift+P)
2. Type or pick **Azure Developer: Provision Azure resources**. (You can also right-click `azure.yaml` to kick **Provision Azure Resources** off.)

    !["Provision"](media/how-to-use-vscode-extension-to-debug-locally/cmd-provision.png)

## Debug the application

Once provision is complete, you can run and debug the application. Let's walk through two scenarios.

### Scenario 1 - Debug API

**Debug API** is configured to run the API server and attach the debugger. So you don't need to run the task to start the API server.

1. Set a breakpoint. Open `lists.ts` in `src > api > src > routes`. Set a breakpoint at say line 16. 
1. In the activity bar, select Run and Debug (Ctrl-Shift-D) and then "Debug API"
!["Debug API"](media/how-to-use-vscode-extension-to-debug-locally/debug-api.png)
1. In your preferred terminal shell, type: >curl http://localhost:3100/lists
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
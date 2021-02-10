---
title: include file completed.md
description: include file completed.md
ms.topic: include
ms.date: 10/13/2020
ms.custom: devx-track-javascript
---

## Install the Azure Functions Core Tools

To enable local debugging, you need to install the [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools), which can be done directly in Visual Studio Code.

1. Start Visual Studio Code.

1. Open the **Command Palette** (**F1**), enter **Azure Functions: Install or Update Azure Functions Core Tools**, and press **Enter** to run the command.

1. To verify installation, select the menu command **Terminal** > **New Terminal** in VS Code, then run the command, `func`. The command should show output like that below (along with usage information).

    <pre>
                      %%%%%%
                     %%%%%%
                @   %%%%%%    @
              @@   %%%%%%      @@
           @@@    %%%%%%%%%%%    @@@
         @@      %%%%%%%%%%        @@
           @@         %%%%       @@
             @@      %%%       @@
               @@    %%      @@
                    %%
                    %

    Azure Functions Core Tools (2.4.419 Commit hash: c9c1724d002bd90b2e6b41393915ea3a26bcf0ce)
    Function Runtime Version: 2.0.12332.0
    </pre>
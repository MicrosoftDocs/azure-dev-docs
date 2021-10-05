---
title: include file completed.md
description: include file completed.md
ms.topic: include
ms.date: 10/05/2021
ms.custom: devx-track-javascript
---

## Install the Azure Functions Core Tools V3

To enable local debugging, you need to install the [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools), which can be done directly in Visual Studio Code.

1. With a bash terminal on your local computer. The location will be the root for your serverless project. Start Visual Studio Code:

    ```bash
    code .
    ```

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
    
    
    Azure Functions Core Tools
    Core Tools Version:       3.0.3284 Commit hash: 98bc25e668274edd175a1647fe5a9bc4ffb6887d 
    Function Runtime Version: 3.0.15371.0
    </pre>
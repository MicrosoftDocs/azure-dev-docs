---
title: Get started using the Azure MCP Server with Visual Studio Code
description: Learn how to connect to and consume Azure MCP Server operations with Visual Studio Code
keywords: azure developer cli, azd
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/11/2025
ms.topic: get-started
ms.custom: build-2025
---

# Get started with the Azure MCP Server using Visual Studio Code

[!INCLUDE [get-started-intro](../../includes/get-started-intro.md)]

In this article, you learn how to complete the following tasks:

- Install and authenticate to the Azure MCP Server
- Connect to Azure MCP Server using GitHub Copilot agent mode in Visual Studio Code
- Run prompts to test Azure MCP Server operations and interact with Azure resources

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) with an active subscription
- [Visual Studio Code](https://code.visualstudio.com/download)
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) Visual Studio Code extension

[!INCLUDE [permissions-note](../../includes/permissions-note.md)]

## Install the Azure MCP Server

Select one of the following options to install the Azure MCP Server in Visual Studio Code:

## [Extension install](#tab/one-click)

1. To install the [Azure MCP Server Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), select the following link:

    [![Install with NPX in Visual Studio Code](https://img.shields.io/badge/VS_Code-Install_Azure_MCP_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:extension/ms-azuretools.vscode-azure-mcp-server)

    > [!TIP]
    > For an optimal Azure MCP Server experience, [install GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), which includes and uses the Azure MCP Server extension. GitHub Copilot for Azure streamlines your development workflow and enhances your productivity on the Azure platform.

1. After you install the extension, open GitHub Copilot and select Agent Mode. To learn more about Agent Mode, visit the [Visual Studio Code Documentation](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode).
1. Refresh the tools list to see Azure MCP Server as an available option:

    :::image type="content" source="../../media/github-copilot-integration.png" alt-text="A screenshot showing Azure MCP Server as GitHub Copilot tool.":::

## [Directory install](#tab/manual)

You can also manually install Azure MCP Server for a specific directory:

1. Open an empty directory or an existing project directory in Visual Studio Code.
1. At the root of the folder, create a `.vscode` folder if there isn't one already.
1. Inside the `.vscode` folder, create a new file named `mcp.json` add the following JSON:

    ```json
    {
      "servers": {
        "Azure MCP Server": {
          "command": "npx",
          "args": [
            "-y",
            "@azure/mcp@latest",
            "server",
            "start"
          ]
        }
      }
    }
    ```

1. Save your changes to `mcp.json`.
1. Open GitHub Copilot and select Agent Mode.
1. Select the tools icon to view the available tools. Search for *Azure MCP Server* to filter the results.

    :::image type="content" source="../../media/github-copilot-integration.png" alt-text="A screenshot showing Azure MCP Server as GitHub Copilot tool.":::

    To learn more about Agent Mode, visit the [Visual Studio Code Documentation](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode).

---

## Use prompts to test the Azure MCP Server

1. Open GitHub Copilot and select Agent Mode.
1. Enter a prompt that causes the agent to use Azure MCP Server tools, such as *List my Azure resource groups*.
1. In order to authenticate Azure MCP Server, Copilot prompts you to sign-in to Azure using the browser.

    > [!NOTE]
    > Copilot won't prompt you to sign-in to Azure if you're already authenticated via other local tooling such as the Azure CLI.

1. Copilot requests permission to run the necessary Azure MCP Server operation for your prompt. Select **Continue** or use the arrow to select a more specific behavior:
    - **Current session** always runs the operation in the current GitHub Copilot Agent Mode session.
    - **Current workspace** always runs the command for current Visual Studio Code workspace.
    - **Always allow** sets the operation to always run for any GitHub Copilot Agent Mode session or any Visual Studio Code workspace.

    :::image type="content" source="../../media/run-command-prompt.png" alt-text="A screenshot showing the options available to run Azure MCP Server operations.":::

    The output for the previous prompt should resemble the following text:

    ```output
    The following resource groups are available for your subscription:

    1. **DefaultResourceGroup-EUS** (Location: `eastus`)
    2. **rg-testing** (Location: `centralus`)
    3. **rg-azd** (Location: `eastus2`)
    4. **msdocs-sample** (Location: `southcentralus`)
    14. **ai-testing** (Location: `eastus2`)
    
    Let me know if you need further details or actions related to any of these resource groups!
    ```

1. Explore and test the Azure MCP operations using other relevant prompts, such as:

    ```
    List all of the storage accounts in my subscription
    Get the available tables in my storage accounts
    ```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure MCP Server tools](../../tools/index.md)

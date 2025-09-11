---
title: Get started using the Azure MCP Server with Visual Studio
description: Learn how to connect to and consume Azure MCP Server operations with Visual Studio
keywords: azure developer cli, azd
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/11/2025
ms.topic: get-started
ms.custom: build-2025
---

# Get started with the Azure MCP Server using Visual Studio

[!INCLUDE [get-started-intro](../../includes/get-started-intro.md)]

In this article, you learn how to complete the following tasks:

- Install and authenticate to the Azure MCP Server.
- Connect to Azure MCP Server using GitHub Copilot agent mode in Visual Studio.
- Run prompts to test Azure MCP Server operations and interact with Azure resources.

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) with an active subscription
- [Visual Studio](https://visualstudio.microsoft.com)

## Install the Azure MCP Server

Visual Studio uses a file named `mcp.json` to check for MCP Server configurations, including configurations set up by other development environments. MCP server configurations are read from the following directories, in the following order:

1. `%USERPROFILE%\.mcp.json`: Serves as a global MCP server configuration for a specific user. Add an MCP server here to make it load for all Visual Studio solutions.
1. `<SOLUTIONDIR>\.vs\mcp.json`: Specific to Visual Studio and only loads the specified MCP servers for a specific user, for the specified solution.
1. `<SOLUTIONDIR>\.mcp.json`: A solution-level MCP configuration that you can track in source control for a repo.
1. `<SOLUTIONDIR>\.vscode\mcp.json`: Scoped to the repository/solution and typically not included in source control.
1. `<SOLUTIONDIR>\.cursor\mcp.json`: Scoped to the repository/solution and typically not included in source control.

> [!NOTE]
> Some of these locations require .mcp.json while others require mcp.json.

The following options demonstrate two of the most common approaches to connect to Azure MCP Server from Visual Studio. 

## [Solution install](#tab/manual)

Complete the following steps to install Azure MCP Server for a specific directory:

1. Create a new file at the root of your solution named `.mcp.json`. Use Visual Studio to edit this file so that its JSON schema is automatically applied.
1. Inside the `.mcp.json` file, add the following JSON:

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

1. Save your changes.
1. Open GitHub Copilot and select Agent Mode.
1. Select the tools icon to view the available tools. Search for *Azure MCP Server* to filter the results.

## [Global install](#tab/one-click)

Complete the following steps to globally add Azure MCP Server for all Visual Studio solutions for a specific user:

1. Create a new file at `%USERPROFILE%\.mcp.json`. Use Visual Studio to edit this file so that its JSON schema is automatically applied.
1. Inside the `.mcp.json` file, add the following JSON:

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

1. Save your changes.
1. Inside Visual Studio, Open GitHub Copilot and select Agent Mode.
1. Select the tools icon to view the available tools. Search for *Azure MCP Server* to filter the results.

---

:::image type="content" source="../../media/github-copilot-mcp-tools-visual-studio.png" alt-text="A screenshot showing how to configure Azure MCP Server in Visual Studio.":::

[!INCLUDE [authentication-guidance](../../includes/authentication-guidance.md)]

## Use prompts to test the Azure MCP Server

1. Open GitHub Copilot and select Agent Mode.
1. Enter a prompt that causes the agent to use Azure MCP Server tools, such as *List my Azure resource groups*.
1. In order to authenticate Azure MCP Server, Copilot prompts you to sign-in to Azure using the browser.

    > [!NOTE]
    > Copilot doesn't prompt you to sign-in to Azure if you're already authenticated via other local tooling such as the Azure CLI.

1. Copilot requests permission to run the necessary Azure MCP Server operation for your prompt. Select **Allow this time** or use the arrow to select a more specific behavior:
    - **Always allow** sets the operation to always run for any GitHub Copilot Agent Mode session or any Visual Studio Code workspace.
    - **Allow in this session** always runs the operation in the current GitHub Copilot Agent Mode session.

    :::image type="content" source="../../media/github-copilot-run-command.png" alt-text="A screenshot showing how to run Azure MCP Server tools in Visual Studio.":::

    The output for the previous prompt should resemble the following text:

    ```output
    The following resource groups are available for your subscription:
    
    1. **DefaultResourceGroup-EUS** (Location: `eastus`)
    2. **rg-testing** (Location: `centralus`)
    3. **rg-azd** (Location: `eastus2`)
    4. **msdocs-sample** (Location: `southcentralus`)
    5. **ai-testing** (Location: `eastus2`)
    
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

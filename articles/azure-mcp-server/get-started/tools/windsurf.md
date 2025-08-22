---
title: Get started using the Azure MCP Server with Windsurf
description: Learn how to connect to and consume Azure MCP Server operations with Windsurf
keywords: azure developer cli, azd, windsurf, mcp
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/14/2025
ms.topic: get-started
ms.custom: build-2025
---

# Get started with the Azure MCP Server in Windsurf

[!INCLUDE [get-started-intro](../../includes/get-started-intro.md)]

In this article, you learn how to complete the following tasks:

- Install and authenticate to the Azure MCP Server
- Connect to Azure MCP Server using Windsurf's AI-powered development environment
- Run prompts to test Azure MCP Server operations and interact with Azure resources

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) with an active subscription
- [Cursor](https://cursor.sh/) installed
- [Node.js](https://node.org) installed (v20.19.4+)

[!INCLUDE [permissions-note](../../includes/permissions-note.md)]

## Install the Azure MCP Server

To install and configure Azure MCP Server in Windsurf:

1. Navigate to **File > Preferences > Windsurf Settings**.
1. On the **Windsurf Settings** page, select **Manage MCP Servers**.

    :::image type="content" source="../../media/windsurf-configure-mcp-server.png" alt-text="A screenshot showing how to configure an MCP Server in Windsurf.":::

1. On the **Manage MCP Servers** settings page, select **View raw config** at the top to open the `mcp_config.json` file for editing. This approach enables you to manually install MCP Servers by adding a JSON configuration object.
1. Update the `mcp_config.json` file to match the following:

    ```json
    {
    "mcpServers": {
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

## Use prompts to test the Azure MCP Server

1. Open Windsurf's AI chat interface by pressing `Ctrl+L` or clicking the chat icon in the sidebar.
2. Enter a prompt that utilizes Azure MCP Server capabilities, such as:

    ```text
    List my Azure storage accounts
    ```

3. If you're prompted to authenticate to Azure, run the suggested auth tool to sign-in through the browser.

    > [!NOTE]
    > Windsurf doesn't prompt you to sign in to Azure if you're already authenticated via other local tooling such as the Azure CLI.

4. Windsurf prompts you to run a tool to retrieve the storage accounts, such as `storage account list`. Select **Run tool** to continue.

    The output should resemble the following text:

    ```output
    The following resource groups are available for your subscription:

    1. **DefaultResourceGroup-EUS** (Location: `eastus`)
    2. **rg-testing** (Location: `centralus`)
    3. **rg-azd** (Location: `eastus2`)
    4. **msdocs-sample** (Location: `southcentralus`)
    5. **ai-testing** (Location: `eastus2`)
    
    Let me know if you need further details or actions related to any of these resource groups!
    ```

5. Explore more Azure MCP operations using other relevant prompts, such as:

    ```text
    List all of the storage accounts in my subscription
    Get the available tables in my storage accounts
    Show me the configuration of my App Service instances
    ```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure MCP Server tools](../../tools/index.md)

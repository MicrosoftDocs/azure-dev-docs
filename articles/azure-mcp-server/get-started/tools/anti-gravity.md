---
title: Get Started with Google Antigravity
description: Learn how to connect Google Antigravity to the Azure MCP Server, authenticate, and run prompts that manage your Azure resources with natural language.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/25/2026
ms.topic: get-started
ms.custom:
  - build-2025
ai-usage: ai-generated
---

# Get started with the Azure MCP Server in Google Antigravity

[!INCLUDE [get-started-intro](../../includes/get-started-intro.md)]

In this article, you learn how to complete the following tasks:

- Install and authenticate to the Azure MCP Server
- Connect to Azure MCP Server by using Google Antigravity's agent-first development environment
- Run prompts to test Azure MCP Server operations and interact with Azure resources

## Prerequisites

- An [Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) with an active subscription
- [Google Antigravity](https://antigravity.google/) installed
- [Node.js](https://nodejs.org/) LTS installed

## Install the Azure MCP Server

To install and configure the Azure MCP Server in Google Antigravity:

1. In the editor's agent side panel, select **...** > **MCP Servers** > **Manage MCP Servers**.

    :::image type="content" source="../../media/anti-gravity-mcp-server.png" alt-text="A screenshot showing how to add an MCP Server in the Antigravity agent panel.":::

1. On **Manage MCPs**, select **View raw config** to open the `mcp_config.json` file for editing.

    Antigravity reads MCP server configuration from one of the following locations:

    - `~/.gemini/config/mcp_config.json` to configure the server globally for all workspaces.
    - `.agents/mcp_config.json` to configure the server for the current workspace only.

1. Add the following configuration to the `mcpServers` object in the `mcp_config.json` file:

    ```json
    {
        "mcpServers": {
            "azure-mcp": {
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

    For more information, see the [Google Antigravity MCP documentation](https://antigravity.google/docs/mcp).

[!INCLUDE [authentication-guidance](../../includes/authentication-guidance.md)]

## Use prompts to test the Azure MCP Server

1. Open the agent side panel in Google Antigravity.
1. Enter a prompt that uses Azure MCP Server capabilities, such as:

    ```text
    List my Azure storage accounts
    ```

1. If you're prompted to authenticate to Azure, run the suggested auth tool to sign in through the browser.

    > [!NOTE]
    > Antigravity doesn't prompt you to sign in to Azure if you're already authenticated through other local tooling such as the Azure CLI.

1. Antigravity prompts you for permission to run one or more Azure MCP Server tools to retrieve the storage accounts, such as `storage account list`. Select your desired allow action to continue.

    The output resembles the following text:

    ```output
    The following storage accounts are available in your subscription:

    1. **sttesting001** (Resource group: `rg-testing`, Location: `centralus`)
    2. **stazddeploy** (Resource group: `rg-azd`, Location: `eastus2`)
    3. **stmsdocssample** (Resource group: `msdocs-sample`, Location: `southcentralus`)
    4. **staitesting** (Resource group: `ai-testing`, Location: `eastus2`)

    Let me know if you need further details or actions related to any of these storage accounts!
    ```

1. Explore more Azure MCP operations by using other relevant prompts, such as:

    ```text
    List all of the storage accounts in my subscription
    Get the available tables in my storage accounts
    Show me the configuration of my App Service instances
    ```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure MCP Server tools](../../tools/index.md)

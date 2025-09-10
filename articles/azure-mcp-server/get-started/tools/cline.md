---
title: Get started using the Azure MCP Server with Cline
description: Learn how to connect to and consume Azure MCP Server operations with Cline
keywords: azure developer cli, azd, cursor, mcp
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/11/2025
ms.topic: get-started
ms.custom: build-2025
---

# Get started with the Azure MCP Server in Cline

[!INCLUDE [get-started-intro](../../includes/get-started-intro.md)]

In this article, you learn how to complete the following tasks:

- Install and authenticate to the Azure MCP Server
- Connect to Azure MCP Server using Cline's AI-powered assistant
- Run prompts to test Azure MCP Server operations and interact with Azure resources

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) with an active subscription
- [Cline](https://cline.bot/) installed
- [Node.js](https://nodejs.org/) LTS installed

[!INCLUDE [authentication-guidance](../../includes/authentication-guidance.md)]

## Install the Azure MCP Server

To install and configure the Azure MCP Server in Cline:

1. Open the **Cline** panel in your editor.
1. Select **Manage MCP Servers** to open the **MCP Servers** flyout, and then select the **Settings** icon.

    :::image type="content" source="../../media/cline-add-server.png" alt-text="A screenshot showing how to add an MCP Server in Cline.":::

1. On the **MCP Servers** section of the panel, select **Configure MCP Servers** to open the `cline_mcp_settings.json` file for editing.
1. Add the following configuration to the `mcpServers` JSON object:

    ```json
    "Azure MCP Server": {
      "command": "npx",
      "args": [
        "-y",
        "@azure/mcp@latest",
        "server",
        "start"
      ]
    }
    ```

    :::image type="content" source="../../media/cline-configure-server.png" alt-text="A screenshot showing how to configure an MCP Server in Cline.":::

1. Select **Done** to close the configuration panel and return to the chat interface.

## Use prompts to test the Azure MCP Server

1. On the Cline chat panel, enter a prompt that utilizes Azure MCP Server capabilities, such as:

    ```text
    List my Azure storage accounts
    ```

1. If you're prompted to authenticate to Azure, run the suggested auth tool to sign-in through the browser.

    > [!NOTE]
    > Cline doesn't prompt you to sign in to Azure if you're already authenticated via other local tooling such as the Azure CLI.

1. Cline prompts you to run a tool to retrieve the storage accounts, such as `storage account list`. Select **Run tool** to continue.

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

1. Explore more Azure MCP operations using other relevant prompts, such as:

    ```text
    List all of the storage accounts in my subscription
    Get the available tables in my storage accounts
    Show me the configuration of my App Service instances
    ```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure MCP Server tools](../../tools/index.md)

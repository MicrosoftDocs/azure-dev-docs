---
title: Get started using the Azure MCP Server with IntelliJ
description: Learn how to connect to and consume Azure MCP Server operations with IntelliJ
keywords: azure developer cli, azd, IntelliJ, mcp
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/19/2025
ms.topic: get-started
---

# Get started with the Azure MCP Server in IntelliJ

[!INCLUDE [get-started-intro](../../includes/get-started-intro.md)]

In this article, you learn how to complete the following tasks:

- Install and authenticate to the Azure MCP Server
- Connect to Azure MCP Server using IntelliJ's AI-powered tools
- Run prompts to test Azure MCP Server operations and interact with Azure resources

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) with an active subscription
- [IntelliJ](https://cursor.sh/) installed
- [Node.js](https://nodejs.org/) installed (v20.19.4+)

[!INCLUDE [permissions-note](../../includes/permissions-note.md)]

## Install the Azure MCP Server

To install and configure Azure MCP Server in IntelliJ:

1. Navigate to **File > Settings**.
1. On the **Settings** dialog, select **Tools > AI Assistant > Model Context Protocol (MPC)**.
1. Select the **+** icon to open the **New MCP Server** dialog.

    :::image type="content" source="../../media/IntelliJ-configure-mcp-server.png" alt-text="A screenshot showing how to configure an MCP Server in IntelliJ.":::

1. Enter the following values:
    - **Name**: *Azure MCP Server*
    - **Command**: *npx*
    - **Arguments**: *-y @azure/mcp@latest server start*

1. Leave the rest of the form fields blank, and select **OK** to close the dialog.

## Authenticate to Azure

1. Make sure you're signed-in to Azure using one of the supported local tooling options, such as:

    - [Azure CLI](/cli/azure/install-azure-cli-windows)
    - [Azure Toolkit for IntelliJ](/azure/developer/java/sdk/authentication/dev-env#intellij-credential)
    - [Azure Developer CLI](/azure/developer/azure-developer-cli/reference#azd-auth)

    For example, run the following command in a terminal window to sign-in using the Azure CLI:

    ```azurecli
    az login
    ```

## Use prompts to test the Azure MCP Server

1. Select the **AI Chat** button on the right toolbar to open IntelliJ's AI assistant interface.
1. Enter a prompt that utilizes Azure MCP Server capabilities, such as:

    ```text
    List my Azure storage accounts
    ```

1. IntelliJ prompts you to run a tool to retrieve the storage accounts, such as `storage account list`. Select **Run tool** to continue.

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

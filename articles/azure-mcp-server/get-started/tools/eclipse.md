---
title: Get started using the Azure MCP Server with Eclipse
description: Learn how to connect to and consume Azure MCP Server operations with Eclipse
keywords: azure developer cli, azd, Eclipse, mcp
author: alexwolfmsft
ms.author: alexwolf
ms.date: 11/03/2025
ms.topic: get-started
ms.custom: build-2025
---

# Get started with the Azure MCP Server in Eclipse

[!INCLUDE [get-started-intro](../../includes/get-started-intro.md)]

This article covers:

- Install and authenticate with Azure MCP Server
- Connect to Azure MCP Server in Eclipse's AI development environment
- Run prompts to test operations and interact with Azure resources

## Prerequisites

- [Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) with an active subscription
- [Eclipse](https://www.eclipse.org/downloads/) - the AI-powered code editor
- GitHub Copilot plugin

[!INCLUDE [authentication-guidance](../../includes/authentication-guidance.md)]

## Install Azure MCP Server

Install and configure Azure MCP Server in Eclipse:

1. Go to **Help > Install New Software...**.
1. Search for **Azure Toolkit** in the **Eclipse Marketplace** window.
1. In the search results, select **Install** for Azure Toolkit.

    :::image type="content" source="../../media/eclipse-marketplace.png" alt-text="Screenshot of the Eclipse Marketplace showing Azure Toolkit installation options.":::

    > [!NOTE]
    > As part of the installation process, make sure both the **GitHub Copilot** and **GitHub Copilot – Nightly** plugins are updated to their latest versions.

1. On the **Confirm Selected Features** window, check that **Azure MCP Server for Eclipse** is selected.
1. Select **Confirm**, and wait for the plugin to install. Eclipse restarts when installation finishes.

    :::image type="content" source="../../media/eclipse-confirm-features.png" alt-text="Screenshot of the Confirm Selected Features window with Azure MCP Server for Eclipse selected.":::

## Verify and test the Azure MCP Server

After you install Azure Toolkit, approve Azure MCP Server registration in Copilot.

1. In the Copilot chat pane, select the **Tools** icon and select **New MCP server found - approval needed**.

    :::image type="content" source="../../media/eclipse-tools-icon.png" alt-text="Screenshot of Copilot chat pane Tools icon in Eclipse.":::

1. In the **Confirm MCP Server Registration** window, select the Azure MCP Server row and select **Approve**.

    :::image type="content" source="../../media/eclipse-confirm-registration.png" alt-text="Screenshot of Confirm MCP Server Registration window with Azure MCP Server selected and Approve option.":::

1. In the Copilot chat pane, select the **Tools** icon again to open the preferences window.
1. Check that Azure MCP Server for Eclipse shows in the **MCP Tools** section.

    :::image type="content" source="../../media/eclipse-mcp-tools.png" alt-text="Screenshot of MCP Tools section showing Azure MCP Server for Eclipse listed.":::


## Use prompts to test the Azure MCP Server

1. In the Copilot chat panel, enter a prompt that uses Azure MCP Server capabilities, such as the following.

    ```text
    List my Azure resource groups
    ```

    > [!NOTE]
    > You can also ask Copilot to use Azure MCP Server tools directly with language like:
    > *Use the Azure MCP Server to list my Azure resource groups.*

1. When Eclipse prompts you to run the tool `azuremcp/group_list` to retrieve the resource groups, select **Continue**.

    The output resembles the following text.

    ```text
    The following resource groups are available for your subscription:

    1. **DefaultResourceGroup-EUS** (Location: `eastus`)
    2. **rg-testing** (Location: `centralus`)
    3. **rg-azd** (Location: `eastus2`)
    4. **msdocs-sample** (Location: `southcentralus`)
    5. **ai-testing** (Location: `eastus2`)
    
    Let me know if you need further details or actions related to any of these resource groups!
    ```

1. Explore more Azure MCP operations with prompts like the following.

    ```text
    List all storage accounts in my subscription
    List available tables in my storage accounts
    Show the configuration of my App Service instances
    ```

## Next steps

> [!div class="nextstepaction"]
> [Azure MCP Server tools](../../tools/index.md)

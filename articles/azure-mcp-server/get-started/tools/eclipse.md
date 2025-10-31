---
title: Get started using the Azure MCP Server with Eclipse
description: Learn how to connect to and consume Azure MCP Server operations with Eclipse
keywords: azure developer cli, azd, Eclipse, mcp
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/11/2025
ms.topic: get-started
ms.custom: build-2025
---

# Get started with the Azure MCP Server in Eclipse

[!INCLUDE [get-started-intro](../../includes/get-started-intro.md)]

In this article, you learn how to complete the following tasks:

- Install and authenticate to the Azure MCP Server
- Connect to Azure MCP Server using Eclipse's AI-powered development environment
- Run prompts to test Azure MCP Server operations and interact with Azure resources

## Prerequisites

- An [Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) with an active subscription
- [Eclipse](https://www.eclipse.org/downloads/) - The AI-powered code editor
- GitHub Copilot plugin installed

## Install the Azure MCP Server

To install and configure Azure MCP Server in Eclipse:

1. Navigate to **Help > Install New Software...**.
1. In the **Eclipse Marketplace** window, search for **Azure Toolkit**.
1. Locate the Azure Toolkit in the search results and select **Install**.

    :::image type="content" source="../../media/eclipse-marketplace.png" alt-text="A screenshot showing how to install the Azure Toolkit.":::

    > [!NOTE]
    > As part of the installation process, make sure both the **GitHub Copilot** and **GitHub Copilot – Nightly** plugins are updated to their latest versions.

1. On the **Confirm Selected Features** window, verify that **Azure MCP Server for Eclipse** is checked.
1. Select **Confirm** and wait for the plugin to install. The Eclipse IDE restarts after the installation finishes.

## Verify and test the Azure MCP Server

After you install Azure Toolkit, you can use Azure MCP Server from the Copilot chat window.

1. Open the Copilot chat window.
1. Select the **Tools** icon and then choose **New MCP server found - approval needed**.

    :::image type="content" source="../../media/eclipse-tools-icon.png" alt-text="A screenshot showing the Eclipse tools icon.":::

1. In the **Confirm MCP Server Registration** window, select the Azure MCP Server row and choose **Approve**.

    :::image type="content" source="../../media/eclipse-confirm-registration.png" alt-text="A screenshot showing how to register the Azure MCP Server.":::

1. In the Copilot chat pane, select the **Tools** icon again to open the preferences window.
1. Verify the Azure MCP Server for Eclipse displays in the **MCP Tools** section.

[!INCLUDE [authentication-guidance](../../includes/authentication-guidance.md)]

## Use prompts to test the Azure MCP Server

1. In the Copilot chat panel, enter a prompt that utilizes Azure MCP Server capabilities, such as:

    ```text
    List my Azure resource groups
    ```

    > [!NOTE]
    > You can also prompt Copilot more directly to use the Azure MCP Server tools if necessary, using verbiage such as:
    > *Use the Azure MCP Server to list my Azure resource groups.*

1. Eclipse prompts you to run a tool to retrieve the resource groups, such as `azuremcp/group_list`. Select **Continue**.

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

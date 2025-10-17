---
author: rotabor
ms.service: github-copilot-for-azure
ms.topic: include
ms.date: 10/16/2025
---

## Prerequisites

- An Azure account and access to an Azure subscription. For details on how to set them up, see the [pricing page for Azure accounts](https://azure.microsoft.com/pricing/purchase-options/azure-account).

- A GitHub account and a GitHub Copilot subscription. For details on how to set them up, see [Creating an account on GitHub](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) and [Quickstart for GitHub Copilot](https://docs.github.com/en/copilot/quickstart), respectively.

- Visual Studio 2026 (Any edition). For details on how to download and install it, see [Install Visual Studio](https://visualstudio.microsoft.com/insiders/).

>[!IMPORTANT]
>GitHub Copilot is a separate subscription managed by GitHub. For questions regarding GitHub Copilot subscriptions and Support, see [Getting started with a GitHub Copilot plan](https://docs.github.com/en/copilot/how-tos/manage-your-account/get-started-with-a-copilot-plan).


## Install GitHub Copilot for Azure

1. If you've already installed Visual Studio 2026 and want to add GitHub Copilot for Azure after initial install, open Visual Studio Installer and select the **Modify** button, which displays the available workloads.

   :::image type="content" source="../media/get-started/visual-studio-2026-installer-modify.png" alt-text="Screenshot that shows the Visual Studio Installer with the Modify button highlighted.":::

   If you're installing Visual Studio 2026 for the first time, the Visual Studio Installer will automatically display the available workloads.

1.  On the Workloads tab, make sure "Azure AI development" is selected.

   :::image type="content" source="../media/get-started/visual-studio-2026-installer-workloads.png" alt-text="Screenshot that shows the Visual Studio Installer's available workloads with the Azure AI development option selected and highlighted.":::

1. Select the **Install** button to complete the installation.

1. Launch Visual Studio 2026 and create or load a project.

1. Open GitHub Copilot Chat. 

1. If prompted, sign in to your GitHub account. 

1. If prompted, sign in to your Azure account. 

1. In the chat area, select the **Select tools** button (two wrenches icon) to display a list of available tools. Enable all Azure tools by checking the top nodes for **Azure**.

   :::image type="content" source="../media/get-started/visual-studio-2026-select-tools.png" alt-text="Screenshot that shows the select tools dialog with the Azure node checked.":::

   Also select the top node for **Azure MCP Server**.

   :::image type="content" source="../media/get-started/visual-studio-2026-select-tools-mcp-server.png" alt-text="Screenshot that shows the select tools dialog with the Azure MCP Server node checked.":::


## Write your first prompt

1. If the Chat window isn't already open, make sure it's open by selecting the **View** > **GitHub Copilot Chat** menu option. You should see chat window docked to the right side by default.

   :::image type="content" source="../media/get-started/visual-studio-2026-chat-window.png" alt-text="Screenshot that shows the GitHub Copilot Chat window in Visual Studio 2026.":::

1. In the chat text area at the bottom of the chat pane, enter the following prompt:

   ```prompt
   Do I have any resources currently running?
   ```

   :::image type="content" source="../media/get-started/visual-studio-2026-first-prompt.png" alt-text="Screenshot that shows an example prompt typed into the chat area in Visual Studio 2026.":::

By default, GitHub Copilot uses **ask** mode. Ask mode provides answers to your prompts in the chat pane. **Agent** mode enables GitHub Copilot to take action in your workspace.

The answer to your question depends on what's currently running in Azure in your subscription.

## Agent mode

In Agent mode, GitHub Copilot can perform tasks across your entire Visual Studio workspace, making edits, executing terminal commands, and so on.

GitHub Copilot for Azure provides "tools" to GitHub Copilot to enhance the agentic experience through deep integration with Azure.

To switch, between ask and agent mode, select the down chevron next to the Ask option in the chat area and select the desired mode.

   :::image type="content" source="../media/get-started/visual-studio-2026-switch-agent-mode.png" alt-text="Screenshot that shows the mode menu in the chat area in Visual Studio 2026.":::

### Enable and disable tools in agent mode

You might want to disable or re-enable certain tools available by GitHub Copilot for Azure.

1. Select the "Select tools" icon in the chat pane.

   :::image type="content" source="../media/get-started/visual-studio-2026-select-tools-icon.png" alt-text="Screenshot of chat pane with the select tools button clicked in Visual Studio 2026.":::

1. Use the checkbox next to the list of tools to enable / disable tools (or groups of tools).

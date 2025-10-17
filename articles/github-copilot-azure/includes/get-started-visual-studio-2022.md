---
author: rotabor
ms.service: github-copilot-for-azure
ms.topic: include
ms.date: 10/17/2025
---

## Prerequisites

- An Azure account and access to an Azure subscription. For details on how to set them up, see the [pricing page for Azure accounts](https://azure.microsoft.com/pricing/purchase-options/azure-account).

- A GitHub account and a GitHub Copilot subscription. For details on how to set them up, see [Creating an account on GitHub](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) and [Quickstart for GitHub Copilot](https://docs.github.com/en/copilot/quickstart), respectively.

- Visual Studio 2022 (Any edition). For details on how to download and install it, see [Install Visual Studio](/visualstudio/install/install-visual-studio).

>[!IMPORTANT]
>GitHub Copilot is a separate subscription managed by GitHub. For questions regarding GitHub Copilot subscriptions and Support, see [Getting started with a GitHub Copilot plan](https://docs.github.com/en/copilot/how-tos/manage-your-account/get-started-with-a-copilot-plan).


## Install GitHub Copilot for Azure

1. In Visual Studio 2022, in the Extensions menu, select Manage Extensions. 
1. In the Extension Manager search for and select "GitHub Copiolot for Azure (VS 2022)". Select the "Install" button.
1. After a moment, you will see a banner: "Your changes are scheduled. The modifications will begin when Microsoft Visual Studio is closed." Shut down Visual Studio.
1. The VSIX Installer dialog opens confirming the installation. Select the "Modify" button.
1. After a few moments, you should see "Modifications Complete". Select the "Close" button.
1. Re-open Visual Studio 2022.
1. Select the "GitHub Copilot" button in upper-right of window on the toolbar. Select "Open Chat Window".
1. When the "GitHub Copilot Chat" window appears, in the chat area at the bottom, select "Agent" mode, then click the "Select tools" button (two wrenches).
1. In the "Select tools" dialog, you should see "Azure MCP Server v0.8.4" (or whatever version is displayed). To the right of that, you'll see "0/153" if not tools are selected (which is currently the default). Select the parent node to choose all of the tools.

> [!Important]
> If you do not see "Azure MCP Server" in the list of tools, you may need to uninstall and re-install the extension.

## Write your first prompt

1. If the Chat window isn't already open, make sure it's open by selecting the **View** > **GitHub Copilot Chat** menu option. You should see chat window docked to the right side by default.

   :::image type="content" source="../media/get-started/visual-studio-2022-chat-window.png" alt-text="Screenshot that shows the GitHub Copilot Chat window in Visual Studio 2022.":::

1. In the chat text area at the bottom of the chat pane, enter the following prompt:

   ```prompt
   Do I have any resources currently running?
   ```

   :::image type="content" source="../media/get-started/visual-studio-2022-first-prompt.png" alt-text="Screenshot that shows an example prompt typed into the chat area in Visual Studio 2022.":::

By default, GitHub Copilot uses **ask** mode. Ask mode provides answers to your prompts in the chat pane. **Agent** mode enables GitHub Copilot to take action in your workspace.

The answer to your question depends on what's currently running in Azure in your subscription.

## Agent mode

In Agent mode, GitHub Copilot can perform tasks across your entire Visual Studio workspace, making edits, executing terminal commands, and so on.

GitHub Copilot for Azure provides "tools" to GitHub Copilot to enhance the agentic experience through deep integration with Azure.

To switch, between ask and agent mode, select the down chevron next to the Ask option in the chat area and select the desired mode.

   :::image type="content" source="../media/get-started/visual-studio-2022-switch-agent-mode.png" alt-text="Screenshot that shows the mode menu in the chat area in Visual Studio 2022.":::

### Enable and disable tools in agent mode

You might want to disable or re-enable certain tools available by GitHub Copilot for Azure.

1. Select the "Select tools" icon in the chat pane.

   :::image type="content" source="../media/get-started/visual-studio-2022-select-tools-icon.png" alt-text="Screenshot of chat pane with the select tools button clicked in Visual Studio 2022.":::

1. Use the checkbox next to the list of tools to enable / disable tools (or groups of tools).

---
author: rotabor
ms.service: github-copilot-for-azure
ms.topic: include
ms.date: 10/09/2025
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

> [!Note]
> If you do not see "Azure MCP Server" in the list of tools, you may need to uninstall and re-install the extension.

## Write your first prompt

1. Ensure that the extension is installed, that you're properly authenticated, and that the extension is working correctly.

1. If the Chat window isn't already open, make sure it's open by either selecting the **Toggle Chat** button in the menu bar, or select the dropdown next to the **Toggle Chat** button and select **Open Chat (Ctrl+Alt+I)**.

   :::image type="content" source="../media/get-started/open-chat.png" alt-text="Screenshot that shows the Toggle Chat menu open and selecting the Open Chat menu option.":::

1. In the chat text area at the bottom of the chat pane, enter the following prompt:

   ```prompt
   @azure Do I have any resources currently running?
   ```

   :::image type="content" source="../media/get-started/ask-mode.png" alt-text="Screenshot that shows the default ask mode state of the chat pane with an example prompt.":::

In Visual Studio 2022, GitHub Copilot for Azure only works in **Agent** mode.  Agent mode enables GitHub Copilot to take action in your workspace, but it can also answer queries and provide information about your Azure account.

The answer to your question depends on what's currently running in Azure in your subscription.



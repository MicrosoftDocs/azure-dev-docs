---
author: rotabor
ms.service: github-copilot-for-azure
ms.topic: include
ms.date: 10/09/2025
---

## Prerequisites

- An Azure account and access to an Azure subscription. For details on how to set them up, see the [pricing page for Azure accounts](https://azure.microsoft.com/pricing/purchase-options/azure-account).

- A GitHub account and a GitHub Copilot subscription. For details on how to set them up, see [Creating an account on GitHub](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) and [Quickstart for GitHub Copilot](https://docs.github.com/en/copilot/quickstart), respectively.

- Visual Studio 2022 (Any edition). For details on how to download and install it, see [Install Visual Studio](/visualstudio/install/install-visual-studio?view=vs-2022).

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
> If you do not see "Azure MCP Server" in the list of tools, you may > need to uninstall and re-install the extension.

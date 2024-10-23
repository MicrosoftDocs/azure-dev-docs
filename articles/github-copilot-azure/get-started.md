---
title: Get started with GitHub Copilot for Azure Preview
description: This article describes the requirements and installation procedure for the GitHub Copilot for Azure Preview Visual Studio Code extension.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: get-started
ms.date: 09/03/2024
ms.collection: ce-skilling-ai-copilot
---

# Get started with GitHub Copilot for Azure Preview

Get started with GitHub Copilot for Azure Preview to streamline your development workflow and enhance your productivity on the Azure platform. This guide walks you through the prerequisites and installation of the GitHub Copilot for Azure extension in Visual Studio Code, so you can write your first prompt.

## Prerequisites

To complete the steps in this article, make sure that you have:

- An Azure account and access to an Azure subscription. For details on how to set them up, see the [pricing page for Azure accounts](https://azure.microsoft.com/pricing/purchase-options/azure-account).

- A GitHub account and a GitHub Copilot subscription. For details on how to set them up, see [Creating an account on GitHub](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) and [Quickstart for GitHub Copilot](https://docs.github.com/en/copilot/quickstart), respectively.

- Visual Studio Code. For details on how to download and install it, see [Setting up Visual Studio Code](https://code.visualstudio.com/docs/setup/setup-overview).

- The GitHub Copilot extension and the GitHub Copilot Chat extension. For instructions on how to install these extensions, see [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup) and [Getting started with GitHub Copilot Chat in VS Code](https://code.visualstudio.com/docs/copilot/getting-started-chat), respectively.

## Install GitHub Copilot for Azure Preview

1. In Visual Studio Code, select the **Extensions** icon.
1. In the Extensions Marketplace, search for **GitHub Copilot for Azure**. When the GitHub Copilot for Azure extension appears, select **Install**.
1. If you're prompted, sign in to your Azure account.

## Write your first prompt

1. Ensure that the extension is installed, that you're properly authenticated, and that the extension is working correctly.
1. On the Activity Bar, select the **Chat** icon.
1. In the chat text area at the bottom of the chat pane, enter the following prompt:

   ```prompt
   @azure Do I have any resources currently running?
   ```

The `@azure` part indicates that you want to include the Azure chat participant in the conversation. It scopes your prompt to a specific domain, namely, your Azure account.

The answer to your question depends on what's currently running in Azure in your subscription.

## Optional: Set your default tenant

If you have multiple [Microsoft Entra ID](/entra/fundamentals/whatis#terminology) tenants, You can set a default tenant using the following prompt:

   ```prompt
   @azure /changeTenant
   ```

Select from a list of your available tenants in the top center drop-down.

You can also set the default tenant in the extension settings:

1. In Visual Studio Code, on the Activity Bar, select **Extensions**. Then scroll down to **GitHub Copilot for Azure**.

   :::image type="content" source="media/get-started/getstarted-extensions.png" alt-text="Screenshot that shows GitHub Copilot for Azure in the list of extensions in Visual Studio Code.":::

2. Select the gear icon in the corner of the extension's entry, and then select **Settings** from the pop-up menu.

   :::image type="content" source="media/get-started/getstarted-settings.png" alt-text="Screenshot that shows the pop-up menu for GitHub Copilot for Azure.":::

3. On the **Settings** tab, set the Azure Resource Graph tenant to your Microsoft Entra tenant ID. You can find your Microsoft Entra tenant ID in the Azure portal.

   :::image type="content" source="media/get-started/getstarted-arg-tenant.png" alt-text="Screenshot that shows the Settings tab with an option to set the Azure Resource Graph tenant.":::

## Related content

- [Understand what GitHub Copilot for Azure Preview is and how it works](introduction.md).
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).

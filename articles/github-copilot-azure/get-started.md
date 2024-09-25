---
title: Get started with GitHub Copilot for Azure
description: This article describes the GitHub Copilot for Azure Visual Studio Code extension, the requirements, and installation procedure.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: overview
ms.date: 09/03/2024
ms.custom: overview
---

# Get started with GitHub Copilot for Azure

Get started with GitHub Copilot for Azure to streamline your development workflow and enhance your productivity on the Azure platform. This guide will walk you through the prerequisites and installation of GitHub Copilot for Azure in Visual Studio Code and writing your first prompt.

## Satisfy pre-requisites 

1. Ensure you have an Azure account and access to an Azure Subscription. For details on how to set up an Azure account and subscription, [start here](https://azure.microsoft.com/pricing/purchase-options/azure-account).

2. Ensure you have a GitHub account and a GitHub Copilot subscription. For details on how to set up a GitHub account and a GitHub Copilot subscription, see [Creating an account on GitHub](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) and [Quickstart for GitHub Copilot](https://docs.github.com/en/copilot/quickstart), respectively.

3. Make sure you have Visual Studio Code installed. For details on how to download and install Visual Studio Code, see [Setting up Visual Studio Code](https://code.visualstudio.com/docs/setup/setup-overview).

4. Make sure you have the the GitHub Copilot extension and the GitHub Copilot Chat extension installed. For instructions on how to install these extensions, see [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup) and [Getting started with GitHub Copilot Chat in VS Code](https://code.visualstudio.com/docs/copilot/getting-started-chat), respectively.

## Install GitHub Copilot for Azure

Once the pre-requisites are satisfied, you can now install the GitHub Copilot for Azure extension in Visual Studio Code.

5. Use the Extensions tab of Visual Studio Code to search for and install "GitHub Copilot for Azure" from the Extensions Marketplace.

You may be asked to log into your Azure account.

## Write your first prompt

6. To ensure the extension is installed, that you're properly authenticated and it is working correctly, choose the GitHub Copilot Chat icon on the primary side bar (usually docked on the left-most side of Visual Studio Code). In the chat text area at the bottom of the Chat window, type the following:

```
@azure Do I have any resources currently running?
```

`@azure` indicates that you want to want to include the Azure chat participant in the conversation which scopes your prompt to a specific domain, namely, your Azure account.

The answer to your question will depend on what is currently running in Azure in your subscription. 

## Setting you default subscription



## Next steps

- [Understand what is GitHub Copilot for Azure and how it works](introduction.md).
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart will instruct you to deploy services to Azure, monitor their status, and troubleshoot issues.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription and resources](learn-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).
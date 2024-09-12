---
title: What is GitHub Copilot for Azure?
description: This conceptual article describes GitHub Copilot for Azure Visual Studio Code extension, its purpose, what it's capable of, and how it fits into a developer's workflow.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: overview
ms.date: 09/03/2024
ms.custom: overview
---

# What is GitHub Copilot for Azure?

GitHub Copilot for Azure is a GitHub Copilot extension allowing developers to use natural language to:

- learn about Azure features
- deploy Azure resources
- obtain information about Azure resources
- perform actions on Azure resources
- optimize code that utilizes Azure resources
- diagnose and troubleshoot issues with Azure resources

GitHub Copilot for Azure is currently available for Visual Studio Code. Also, you must have access to an Azure subscription and be subscribed to GitHub Copilot.

GitHub Copilot is designed to help those new to Azure to be more productive as quickly as possible. For experienced Azure users, GitHub Copilot for Azure saves time by allowing developers to access Azure functionality without needing to look up commands and arguments, and without the need to log in and navigate through the Azure portal.

There are four primary scenarios that are enabled with more planned:

|Category|Explanation|Examples|
|---|---|---|
|Learn|Learn about Azure services and tools from latest Microsoft Learn documentation|[!INCLUDE [learn-examples](./includes/learn-examples.md)]|
|Deploy|Provision resources and deploy apps|[!INCLUDE [deploy-examples](./includes/deploy-examples.md)]|
|Troubleshoot|Diagnose and troubleshoot application and resource issues|[!INCLUDE [troubleshoot-examples](./includes/troubleshoot-examples.md)]|
|Optimize|Answer questions about resources including locations, settings, and resource health|[!INCLUDE [optimize-examples](./includes/optimize-examples.md)]|

The documentation provides a quickstart tutorial and example prompts to help you harness the power of GitHub Copilot for Azure as quickly as possible.

## How it works

GitHub Copilot for Azure is built on a foundational Large Language Model like GPT 4o, supplementing its general knowledge with continuously updated knowledge from Microsoft Learn. Furthermore, it is enhanced by intelligent agents that interact with Azure services, systems, and the Azure Resource Graph to carry out specific tasks.

The chat experience is delivered through the GitHub Copilot Chat extenion. The chat extension can be accessed as a separate window pane in Visual Studio Code via "Chat" icon the primary side bar, usually docked to the left-hand side of Visual Studio Code. The chat window allows you to create a new chat, provides access to a history of previous chat sessions, the ability to open the chat session in a full editor window, and more.

## Install GitHub Copilot for Azure

1. Ensure you have an Azure account and access to an Azure Subscription. For details on how to set up an Azure account and subscription, [start here](https://azure.microsoft.com/pricing/purchase-options/azure-account).

2. Ensure you have a GitHub account and a GitHub Copilot subscription. For details on how to set up a GitHub account and a GitHub Copilot subscription, see [Creating an account on GitHub](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) and [Quickstart for GitHub Copilot](https://docs.github.com/en/copilot/quickstart), respectively.

3. Make sure you have Visual Studio Code installed. For details on how to download and install Visual Studio Code, see [Setting up Visual Studio Code](https://code.visualstudio.com/docs/setup/setup-overview).

4. Make sure you have the the GitHub Copilot extension and the GitHub Copilot Chat extension installed. For instructions on how to install these extensions, see [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup) and [Getting started with GitHub Copilot Chat in VS Code](https://code.visualstudio.com/docs/copilot/getting-started-chat), respectively.

Once these pre-requisites are satisfied, you can now install the GitHub Copilot for Azure extension in Visual Studio Code.

5. Use the Extensions tab of Visual Studio Code to search for and install "GitHub Copilot for Azure" from the Extensions Marketplace.

You may be asked to log into your Azure account.

6. To ensure the extension is installed, that you're properly authenticated and it is working correctly, choose the GitHub Copilot Chat icon on the primary side bar (usually docked on the left-most side of Visual Studio Code). In the chat text area at the bottom of the Chat window, type the following:

```
@azure Do I have any resources currently running?
```

`@azure` indicates that you want to want to include the Azure chat participant in the conversation which scopes your prompt to a specific domain, namely, your Azure account.

The answer to your question will depend on what is currently running in Azure in your subscription. 

## Next steps

- Follow the quickstart to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart will instruct you to deploy services to Azure, monitor their status, and troubleshoot issues.
- See example prompts for learning more about Azure.
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for understanding your Azure account, subscription and resources.
- See example prompts for monitoring your Azure resources.
- See example prompts for troubleshooting your Azure resources.
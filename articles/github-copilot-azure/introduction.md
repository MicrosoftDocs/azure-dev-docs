---
title: What is GitHub Copilot for Azure Preview?
description: This conceptual article describes GitHub Copilot for Azure Preview Visual Studio Code extension, its purpose, what it's capable of, and how it fits into a developer's workflow.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: overview
ms.date: 09/03/2024
ms.custom: overview
ms.collection: ce-skilling-ai-copilot
---

# What is GitHub Copilot for Azure Preview?

GitHub Copilot for Azure Preview is a GitHub Copilot extension allowing developers to use natural language to:

- learn about Azure features
- deploy Azure resources
- obtain information about Azure resources
- diagnose and troubleshoot issues with Azure resources

GitHub Copilot for Azure is currently available for Visual Studio Code. You must have access to an Azure subscription and be subscribed to GitHub Copilot.

GitHub Copilot is designed to help developers, including those who are new to Azure to be more productive as quickly as possible. For experienced Azure users, GitHub Copilot for Azure saves time by allowing them to access Azure functionality without needing to look up commands and arguments or sign in and navigate through the Azure portal.

There are four primary scenarios that are enabled with more planned:

|Category|Explanation|Examples|
|---|---|---|
|Learn|Learn about Azure services and tools from latest Microsoft Learn documentation.|[!INCLUDE [learn-examples](./includes/learn-examples.md)]|
|Deploy|Create Azure resources and deploy apps.|[!INCLUDE [deploy-examples](./includes/deploy-examples.md)]|
|Troubleshoot|Diagnose and troubleshoot application and resource issues.|[!INCLUDE [troubleshoot-examples](./includes/troubleshoot-examples.md)]|
|Optimize|Answer questions about resources including locations, settings, and resource health.|[!INCLUDE [optimize-examples](./includes/optimize-examples.md)]|

The documentation provides a quickstart and example prompts to help you harness the power of GitHub Copilot for Azure as quickly as possible.

## How it works

GitHub Copilot for Azure Preview is built on a foundational Large Language Model (LLM) like GPT 4o, supplementing the LLM's general knowledge with continuously updated knowledge from Microsoft Learn. Furthermore, it's intelligent agents interact with Azure services, systems, and the Azure Resource Graph to carry out specific tasks on your behalf.

The chat experience is delivered through the GitHub Copilot Chat extenion. The chat extension can be accessed as a separate window pane in Visual Studio Code via "Chat" icon the primary side bar on the left-hand side. The chat window allows you to create a new chat, provides access to a history of previous chat sessions, the ability to open the chat session in a full editor window, and more.


## Next steps

- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure Preview in your software development workflow. The quickstart instructs you to deploy services to Azure, monitor their status, and troubleshoot issues.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).
---
title: What is GitHub Copilot for Azure Preview?
description: This article describes the purpose and capabilities of the GitHub Copilot for Azure Preview Visual Studio Code extension, and how it fits into a developer's workflow.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: overview
ms.date: 11/18/2024
ms.collection: ce-skilling-ai-copilot
---

# What is GitHub Copilot for Azure Preview?

GitHub Copilot for Azure Preview is a GitHub Copilot extension that enables developers to use natural language to:

- Learn about Azure features.
- Deploy Azure resources.
- Get information about Azure resources.
- Diagnose and troubleshoot problems with Azure resources.

GitHub Copilot for Azure is currently available for Visual Studio Code. You must have access to an Azure subscription and be subscribed to GitHub Copilot.

GitHub Copilot is designed to help developers, including those who are new to Azure, to be more productive as quickly as possible. For experienced Azure users, GitHub Copilot for Azure saves time because they can access Azure functionality without needing to look up commands and arguments, and without needing to sign in and browse through the Azure portal.

## Primary scenarios

GitHub Copilot for Azure Preview currently enables four primary scenarios:

|Category|Explanation|Examples|
|---|---|---|
|Learn|Learn about Azure services and tools from the latest Microsoft Learn documentation.|<ul><li>"@azure What Azure services should I use with my app?"</li><li>"@azure What are the available types of Azure OpenAI models?"</li><li>"@azure What is Azure AI Search and why should I use it?"</li><li>"@azure How does pricing work for Azure SQL?"</li></ul>|
|Design and develop|Ask for guidance and help when building apps for the cloud.|<ul><li>"@azure Can you help me build a RAG application with Python?"</li><li>"@azure Use azd to undeploy my project."</li><li>"@azure We are a pizza company and want to create an online customized pizza delivery solution. Create an API to accept pizza orders."</li></ul>|
|Deploy|Create Azure resources and deploy apps.|<ul><li>"@azure Can you help me deploy my application?"</li><li>"@azure I need a CI/CD pipeline so I can get my app deployed."</li><li>"@azure Use azd to undeploy my project."</li></ul>|
|Troubleshoot|Diagnose and troubleshoot application and resource problems.|<ul><li>"@azure What is using up my GPT-4o model quota?"</li><li>"@azure Find out why my store-service-prod Kubernetes cluster is running slow."</li><li>"@azure Why am I seeing 500 errors when opening my website?"</li></ul>|
|Optimize|Answer questions about resources, including locations, settings, and resource health.|<ul><li>"@azure How many Azure OpenAI deployments do I have?"</li><li>"@azure Give me a count of storage accounts in eastus by subscription, sorted from largest to smallest."</li></ul>|

The documentation provides a quickstart and example prompts to help you start using GitHub Copilot for Azure as quickly as possible.

## How it works

GitHub Copilot for Azure Preview is built on a foundational large language model (LLM) like GPT-4o. It supplements the LLM's general knowledge with continuously updated knowledge from Microsoft Learn. Its intelligent agents interact with Azure services, systems, and Azure Resource Graph to carry out specific tasks on your behalf.

The GitHub Copilot Chat extension delivers the chat experience. You can open the chat extension as a pane in Visual Studio Code by selecting the **Chat** icon on the Activity Bar. In the chat pane, you can create a new chat, access a history of chat sessions, open a chat session in a full editor window, and more.

## Best practices

Using copilots can increase developer productivity by answering questions, executing tasks, and generating code. However, remember these vital rules:

- Review all AI-generated responses. Validate their correctness, applicability, potential outcomes (such as costs and security) before taking action based on those responses.
- Never save application secrets or credentials in source code.
- Never submit application secrets or credentials in questions or in code when you ask questions.

When you're working with any tool that's based on large language models, use good prompt engineering techniques for the best results. The following tips come from the article [Write effective prompts for Microsoft Copilot in Azure](/azure/copilot/write-effective-prompts), which provides advice for prompt engineering in the context of Azure.

- [Be clear and specific](/azure/copilot/write-effective-prompts#be-clear-and-specific)
- [Set expectations](/azure/copilot/write-effective-prompts#set-expectations)
- [Add context about your scenario](/azure/copilot/write-effective-prompts#add-context-about-your-scenario)
- [Break down your requests](/azure/copilot/write-effective-prompts#break-down-your-requests)
- [Customize your code](/azure/copilot/write-effective-prompts#customize-your-code)
- [Use Azure terminology](/azure/copilot/write-effective-prompts#use-azure-terminology)
- [Use the feedback loop](/azure/copilot/write-effective-prompts#use-the-feedback-loop)


## Related content

- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure Preview in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [designing and developing applications for Azure](design-develop-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).

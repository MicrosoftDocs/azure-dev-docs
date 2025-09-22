---
title: What is GitHub Copilot for Azure?
description: This article describes the purpose and capabilities of the GitHub Copilot for Azure Visual Studio Code extension, and how it fits into a developer's workflow.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: overview
ms.date: 9/22/2025
ms.collection: ce-skilling-ai-copilot
---

# What is GitHub Copilot for Azure?

GitHub Copilot for Azure is a GitHub Copilot extension that enables developers to use natural language to:

- Learn about Azure features.
- Deploy Azure resources.
- Get information about Azure resources.
- Diagnose and troubleshoot problems with Azure resources.

GitHub Copilot for Azure is currently available for Visual Studio Code and Visual Studio 2022. You must have access to an Azure subscription and be subscribed to GitHub Copilot. [Get started](get-started.md) using the extension.

GitHub Copilot is designed to help developers, including those who are new to Azure, to be more productive as quickly as possible. For experienced Azure users, GitHub Copilot for Azure saves time because they can access Azure functionality without needing to look up commands and arguments, and without needing to sign in and browse through the Azure portal.

## Supported development environments

You can use GitHub Copilot for Azure in the following supported development environments:

|Supported Client|Description|Feature Stage|Download Link|
|---|---|---|---|
|Visual Studio Code|Surfaces the Azure MCP Server tools via the GitHub Copilot user interface for both Ask and Agent modes.|General availability|[Link](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot)|
|Visual Studio 2022|Same, but only provides access to Agent mode.|Public preview|[Link](https://marketplace.visualstudio.com/items?itemName=github-copilot-azure.GitHubCopilotForAzure2022)|


## Primary scenarios

GitHub Copilot for Azure currently enables four primary scenarios:

|Category|Explanation|Examples|
|---|---|---|
|Learn|Learn about Azure services and tools from the latest Microsoft Learn documentation.|<ul><li>"@azure What Azure services should I use with my app?"</li><li>"@azure What are the available types of Azure OpenAI models?"</li><li>"@azure What is Azure AI Search and why should I use it?"</li><li>"@azure How does pricing work for Azure SQL?"</li></ul>|
|Design and develop|Ask for guidance and help when building apps for the cloud.|<ul><li>"@azure Can you help me build a RAG application with Python?"</li><li>"@azure Use azd to undeploy my project."</li><li>"@azure We are a pizza company and want to create an online customized pizza delivery solution. Create an API to accept pizza orders."</li></ul>|
|Deploy|Create Azure resources and deploy apps.|<ul><li>"@azure Can you help me deploy my application?"</li><li>"@azure I need a CI/CD pipeline so I can get my app deployed."</li><li>"@azure Use azd to undeploy my project."</li></ul>|
|Troubleshoot|Diagnose and troubleshoot application and resource problems.|<ul><li>"@azure What is using up my GPT-4o model quota?"</li><li>"@azure Find out why my store-service-prod Kubernetes cluster is running slow."</li><li>"@azure Why am I seeing 500 errors when opening my website?"</li></ul>|
|Optimize|Answer questions about resources, including locations, settings, and resource health.|<ul><li>"@azure How many Azure OpenAI deployments do I have?"</li><li>"@azure Give me a count of storage accounts in eastus by subscription, sorted from largest to smallest."</li></ul>|

The documentation provides a quickstart and example prompts to help you start using GitHub Copilot for Azure as quickly as possible.

## How it works

GitHub Copilot for Azure is built on a foundational large language model (LLM) like GPT-4o. It supplements the LLM's general knowledge with tool calling using the [Azure MCP Server](../azure-mcp-server/overview) that enables interaction with Azure services, systems, and Azure Resource Graph to carry out specific tasks on your behalf.

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

When working in agent mode, you can create longer prompts, however it is important to constrain the copilot before allowing it to act on your behalf especially when working with your Azure account. Here's an approach to building a longer prompt that might help get the results you desire.

- **Command** - "Do not take any action until I authorize it." This prevents the copilot from taking action before you are confident it will do what you want it to.
- **Describe** - Express what you want to happen. Here, you describe the work like you would to a co-worker in sufficient detail for your co-worker to be successful.
- **Ask** - "Do you have any clarifying questions to ask me before you begin?" - Give the copilot an opportunity to identify unclear instructions.
- **Iterate** - You may need to iterate with the copilot until it understands what you are asking it to do. This may require a round or two before it has everything it needs to be successful.
- **Request** - "Create a step-by-step checklist plan that I can review before I authorize you to execute the plan." This not only forces the copilot to think ahead of its actions and explain its approach to you, it also will follow these steps and provide a status.
- **Review** - At some point, you may come to trust the copilot and not closely review its work. However, it's always best to make sure you review the plan and clarify what you want.
- **Authorize** - "I've reviewed the plan and I am authorizing you to begin."
- **Validate** - Spend time checking the work to ensure that it accomplishes what you intended. This is a critical step.

## Related content

- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [designing and developing applications for Azure](design-develop-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).

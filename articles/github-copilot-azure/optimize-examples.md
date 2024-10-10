---
title: GitHub Copilot for Azure Preview prompt engineering examples for optimizing your application
description: This article provides example prompts that can help you optimize your application in the cloud.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: best-practice
ms.date: 09/03/2024
ms.collection: ce-skilling-ai-copilot
---

# Example prompts for optimizing your application with GitHub Copilot for Azure Preview

If you're unfamiliar with Azure or you just want the tooling and AI to do most of the work, you can ask GitHub Copilot for Azure Preview to help you optimize the performance of your Azure resources.

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

## Example prompts to optimize your app

If you want to use GitHub Copilot for Azure Preview for help with optimizing your application, you can start with an open-ended question or request. Then, add details like specific services and technologies for better results. Try the following example prompts.

|Service|Optimize prompt examples|
|---|---|
|Azure App Service|<ul><li>"@azure Are any app code optimizations available?"</li><li>"@azure Show me how to optimize CPU usage for Azure App Service."</li><li>"@azure How do I optimize code for Azure App Service?"</li><li>"@azure What are the best practices for security in Azure?"</li></ul>|
|Azure SQL|<ul><li>"@azure How can I optimize my Azure SQL database for better performance?"</li></ul>|

## Related content

- [Understand what GitHub Copilot for Azure Preview is and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure Preview in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).

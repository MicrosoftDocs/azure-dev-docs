---
title: GitHub Copilot for Azure Preview prompt engineering examples for optimizing your application
description: This article provides example prompts that can be used to help optimize your application in the cloud.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: overview
ms.date: 09/03/2024
ms.custom: overview
ms.collection: ce-skilling-ai-copilot
---

# Use GitHub Copilot for Azure Preview to optimize your application

If you're unfamiliar with Azure or just want the tooling and AI to do most of the work, asking GitHub Copilot for Azure Preview to help you optimize the performance of your Azure resources is a great option.

When working with any tool based on Large Language Models (LLMs), use good prompt engineering techniques for the best results.

The following tips for better prompts come from the article [Write effective prompts for Microsoft Copilot in Azure](/azure/copilot/write-effective-prompts), which provides great advice for prompt engineering in the context of Azure.

- [Be clear and specific](/azure/copilot/write-effective-prompts#be-clear-and-specific)
- [Set expectations](/azure/copilot/write-effective-prompts#set-expectations)
- [Add context about your scenario](/azure/copilot/write-effective-prompts#add-context-about-your-scenario)
- [Break down your requests](/azure/copilot/write-effective-prompts#break-down-your-requests)
- [Customize your code](/azure/copilot/write-effective-prompts#customize-your-code)
- [Use Azure terminology](/azure/copilot/write-effective-prompts#use-azure-terminology)
- [Use the feedback loop](/azure/copilot/write-effective-prompts#use-the-feedback-loop)


## Using Copilots responsibly

Using Copilots can dramatically increase developer productivity by answering questions, executing tasks, and generating code. However remember two vital rules:

- Review all AI generated responses and validate their correctness, applicability, potential outcomes (such as costs, security, etc.) before taking action based on those responses.
- Never save application secrets and credentials in source code.
- Never submit application secrets and/or credentials in questions or code when you ask Copilot questions.


## Example prompts to optimize your apps

Suppose you want to optimize your application running on Azure services and decide to use GitHub Copilot for Azure Preview to help. To begin, you can start with an open ended question and then add details like specific services and technologies. The following example prompts help you optimize the use of Azure in your apps.

|Service|Optimize prompt examples|
|---|---|
|App Service|[!INCLUDE [optimize-app-service](./includes/optimize-app-service.md)]|
|Azure SQL|[!INCLUDE [optimize-azure-sql](./includes/optimize-azure-sql.md)]|


## Next steps

- [Understand what is GitHub Copilot for Azure Preview and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure Preview in your software development workflow. The quickstart instructs you to deploy services to Azure, monitor their status, and troubleshoot issues.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).
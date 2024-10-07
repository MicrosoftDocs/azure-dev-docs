---
title: GitHub Copilot for Azure Preview prompt engineering examples for deploying your application
description: This article provides example prompts that can be used to help deploy your application to the cloud.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: overview
ms.date: 09/03/2024
ms.custom: overview
ms.collection: ce-skilling-ai-copilot
---

# Use GitHub Copilot for Azure Preview to deploy your application

If you're unfamiliar with Azure or just want the tooling and AI to do most of the work, asking GitHub Copilot for Azure Preview to help you deploy your application is a great option.

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

## Example prompts for deploying your apps

Suppose you want to deploy your application and decide to use GitHub Copilot for Azure Preview to help. To begin, you can start with an open ended question. 

- "@azure Help me deploy my application to Azure."
- "@azure How can I deploy this app?"
- "@azure Can you deploy my code to Azure please."
- "@azure Can you help me deploy my project to Azure."
- "@azure Deploy this project to Azure."
- "@azure Go deploy this project."
- "@azure I'd like to deploy my app."
- "@azure Take this project and make it deployable to Azure."
- "@azure Get this code running on Azure."
- "@azure Run this app on Azure."

However, add more detail to get better results. Here are some example prompts that produce better results:

|Service, technology, or technique|Deploy prompt examples|
|---|---|
|Azure Kubernetes Service (AKS)|[!INCLUDE [deploy-aks](./includes/deploy-aks.md)]|
|Azure App Service|[!INCLUDE [deploy-app-service](./includes/deploy-app-service.md)]|
|Azure Container Apps (ACA)|[!INCLUDE [deploy-aca](./includes/deploy-aca.md)]|
|Azure Developer CLI (AZD)|[!INCLUDE [deploy-azd](./includes/deploy-azd.md)]|
|Azure DevOps|[!INCLUDE [deploy-devops](./includes/deploy-devops.md)]|
|Azure OpenAI|[!INCLUDE [deploy-openai](./includes/deploy-openai.md)]|
|GitHub Actions|[!INCLUDE [deploy-github](./includes/deploy-github.md)]|

## Example prompts for undeploying your apps

Similarly, you can ask GitHub Copilot for Azure Preview with assistance in undeploying since it works in Visual Studio Code and has context about where and how you deployed your application to Azure.

Example prompts:

- "@azure Undeploy this project from Azure."
- "@azure I'd like to undeploy my app."
- "@azure Stop this app on Azure."
- "@azure Take this project down from Azure."
- "@azure Take down my application."
- "@azure Remove this code from running on Azure."


If you used azd to deploy your application, you can ask it to use azd to undeploy your application as well.

- "@azure Undeploy my project with the Azure Developer CLI."
- "@azure Use azd to undeploy my project."


## Next steps

- [Understand what is GitHub Copilot for Azure Preview and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure Preview by satisfying the prerequisites, which include installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure Preview in your software development workflow. The quickstart instructs you to deploy services to Azure, monitor their status, and troubleshoot issues.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).
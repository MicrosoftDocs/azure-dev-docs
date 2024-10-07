---
title: GitHub Copilot for Azure Preview prompt engineering examples for troubleshooting your application
description: This article provides example prompts that can be used to help troubleshoot your application in the cloud.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: overview
ms.date: 09/03/2024
ms.custom: overview
ms.collection: ce-skilling-ai-copilot
---

# Use GitHub Copilot for Azure Preview to troubleshoot your application

If you're unfamiliar with Azure or just want the tooling and AI to do most of the work, asking GitHub Copilot for Azure Preview to help you troubleshoot issues with your application is a great option.

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


## Example prompts for troubleshooting your apps

Suppose you want to troubleshoot your application and decide to use GitHub Copilot for Azure Preview to help. To begin, you can start with an open ended question and then add details like specific timeframes, specific errors, or specific services and technologies. 

### Asking open-ended questions

- "@azure Where can I find metrics and logs?"
- "@azure I want to see all the error messages in the logs."
- "@azure I'm seeing errors with my app, look at the logs to find out why."
- "@azure Why are my clients being disconnected so often?"
- "@azure Why did my last deployment fail?"
- "@azure Help me analyze my app for high CPU usage."
- "@azure Why is my application slow?"
- "@azure Take a memory dump of my app."


### Asking questions about specific timeframes

- "@azure Grab all the errors in the logs between yesterday and today."
- "@azure Diagnose my app to show me what problems it encountered."
- "@azure Tell me what goes wrong with my app 'myAppName'."
- "@azure Troubleshoot my app for any possible issues in the last 3 hours."
- "@azure What errors did my app 'myAppName' have in the last 24 hours?"


### Asking questions about specific errors

- "@azure Is there any 501 error in my app logs?"
- "@azure Why am I seeing 500 error when opening my website?"
- "@azure I'm getting xxx error code, what could be the reasons?"
- "@azure Show me all the 4xx errors in the logs in the last 6 hours."
- "@azure Find error messages in the logs that might correlate to 500 errors."


### Asking questions about specific services and technologies

|Service, technology, or technique|Troubleshoot prompt examples|
|---|---|
|Azure Container Service (ACA)|[!INCLUDE [troubleshoot-aca](./includes/troubleshoot-aca.md)]|
|Azure Kubernetes Service (AKS)|[!INCLUDE [troubleshoot-aks](./includes/troubleshoot-aks.md)]|
|Azure App Service|[!INCLUDE [troubleshoot-app-service](./includes/troubleshoot-app-service.md)]|
|Azure Developer CLI (AZD)|[!INCLUDE [troubleshoot-azd](./includes/troubleshoot-azd.md)]|
|Azure SDK|[!INCLUDE [troubleshoot-azure-sdk](./includes/troubleshoot-azure-sdk.md)]|
|Azure Event Hubs|[!INCLUDE [troubleshoot-event-hubs](./includes/troubleshoot-event-hubs.md)]|
|Azure OpenAI|[!INCLUDE [troubleshoot-openai](./includes/troubleshoot-openai.md)]|
|SignalR|[!INCLUDE [troubleshoot-signalr](./includes/troubleshoot-signalr.md)]|
|Azure Storage|[!INCLUDE [troubleshoot-storage](./includes/troubleshoot-storage.md)]|
|Azure Web PubSub|[!INCLUDE [troubleshoot-webpubsub](./includes/troubleshoot-webpubsub.md)]|


## Next steps

- [Understand what is GitHub Copilot for Azure Preview and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure Preview in your software development workflow. The quickstart instructs you to deploy services to Azure, monitor their status, and troubleshoot issues.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
---
title: GitHub Copilot for Azure prompt engineering examples to learn about using Azure for your application
description: This article provides example prompts that can be used to help learn how to utilize Azure and deploy your application to the cloud.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: overview
ms.date: 09/03/2024
ms.custom: overview
---

# Use GitHub Copilot for Azure to learn about Azure and your application

If you're unfamiliar with Azure and how it can be used for your application, asking GitHub Copilot for Azure to help you is a great option.

As is the case with all tools based on Large Language Models (LLMs), using good prompt engineering techniques will get you the results you want.

The following tips for better prompts comes from the article [Write effectve prompts for Microsoft Copilot in Azure](/azure/copilot/write-effective-prompts), which provides great advice for prompt engineering in the context of Azure.

- [Be clear and specific](/azure/copilot/write-effective-prompts#be-clear-and-specific)
- [Set expectations](/azure/copilot/write-effective-prompts#set-expectations)
- [Add context about your scenario](/azure/copilot/write-effective-prompts#add-context-about-your-scenario)
- [Break down your requests](/azure/copilot/write-effective-prompts#break-down-your-requests)
- [Customize your code](/azure/copilot/write-effective-prompts#customize-your-code)
- [Use Azure terminology](/azure/copilot/write-effective-prompts#use-azure-terminology)
- [Use the feedback loop](/azure/copilot/write-effective-prompts#use-the-feedback-loop)


## Using Copilots responsibly

Using Copilots can dramatically increase developer productivity by answering questions, executing tasks and generating code. However, please remember two vital rules:

- Review all AI generated responses and validate their correctness, applicability and potential impact and outcomes (such as costs, security, etc.) prior to taking action based on those responses.
- Never save application secrets and credentials in source code.

## Example prompts to learn about Azure

Suppose you want to learn about your options or how to utilize Azure for your application and have decided to use GitHub Copilot for Azure to help. To begin, you can start with an open ended question and then adding details like specific services and technologies. Here are some sample prompts you can try to help you learn how to use Azure in your apps.

### Learn about system architecture on Azure

- "@azure How can I create a highly available architecture in Azure?"
- "@azure Explain the Azure Well-Architected Framework."
- "@azure what types of app hosting solutions does Azure have?"
- "@azure Help me orchestrate and automate my data processing workflows."
- "@azure How to integrate SignalR with App Gateway/APIM/etc.?"
- "@azure How many units do you recommend?"
- "@azure What are the benefits and applications of using Terraform?"

### Learn about AI on Azure

- "@azure I want to build an AI application. What services can I use?"


### Learn about web and application hosting on Azure

- "@azure Which Azure service is best for hosting a scalable web application?"
- "@azure Which service should I use to create a web site."
- "@azure How can I use Azure to build a scalable web application?"
- "@azure For what scenarios is Azure Functions better than Web Apps?"


### Learn about containers on Azure

- "@azure What types of containerized applications are suported in Azure?"
- "@azure What are the options for managing containers in Azure?"
- "@azure When should I use AKS instead of ACA?"
- "@azure what's the difference between aca and aks?"
- "@azure Why would I choose Azure ACA over Azure AKS"


### Learn how to utilize Azure services for your app


|Service or technology|Learn prompt examples|
|---|---|
|Azure AI Search|[!INCLUDE [learn-ai-search](./includes/learn-ai-search.md)]|
|Azure API Manager|[!INCLUDE [learn-api-manager](./includes/learn-api-manager.md)]|
|Azure App Service|[!INCLUDE [learn-app-service](./includes/learn-app-service.md)]|
|Azure Cache for Redis|[!INCLUDE [learn-redis](./includes/learn-redis.md)]|
|Azure Container Apps (ACA)|[!INCLUDE [learn-container-apps](./includes/learn-container-apps.md)]|
|Azure Cosmos DB|[!INCLUDE [learn-cosmos-db](./includes/learn-cosmos-db.md)]|
|Azure Data Factory|[!INCLUDE [learn-data-factory](./includes/learn-data-factory.md)]|
|Azure Developer CLI (azd)|[!INCLUDE [learn-azd](./includes/learn-azd.md)]|
|Azure Functions|[!INCLUDE [learn-functions](./includes/learn-functions.md)]|
|Azure KeyVault|[!INCLUDE [learn-keyvault](./includes/learn-keyvault.md)]|
|Azure Kubernetes Service (AKS)|[!INCLUDE [learn-aks](./includes/learn-aks.md)]|
|Azure Machine Learning|[!INCLUDE [learn-machine-learning](./includes/learn-machine-learning.md)]|
|Azure Monitor|[!INCLUDE [learn-monitor](./includes/learn-monitor.md)]|
|Azure Network|[!INCLUDE [learn-network](./includes/learn-network.md)]|
|Azure OpenAI|[!INCLUDE [learn-openai](./includes/learn-openai.md)]|
|Azure SDK|[!INCLUDE [learn-azure-sdk](./includes/learn-azure-sdk.md)]|
|Azure SignalR|[!INCLUDE [learn-signalr](./includes/learn-signalr.md)]|
|Azure SQL|[!INCLUDE [learn-azure-sql](./includes/learn-azure-sql.md)]|
|Azure Static Web Apps|[!INCLUDE [learn-static-web-apps](./includes/learn-static-web-apps.md)]|
|Azure Storage|[!INCLUDE [learn-storage](./includes/learn-storage.md)]|
|Azure Web PubSub|[!INCLUDE [learn-webpubsub](./includes/learn-webpubsub.md)]|

## Next steps

- [Understand what is GitHub Copilot for Azure and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by ensuring you have satisfied the pre-requisites, installed the software and write your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart will instruct you to deploy services to Azure, monitor their status, and troubleshoot issues.
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).
---
title: GitHub Copilot for Azure Preview prompt engineering examples to learn about using Azure for your application
description: This article provides example prompts that can be used to help learn how to utilize Azure and deploy your application to the cloud.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: overview
ms.date: 09/03/2024
ms.custom: overview
ms.collection: ce-skilling-ai-copilot
---

# Use GitHub Copilot for Azure Preview to learn about Azure and your application

If you're unfamiliar with Azure and how it can be used for your application, asking GitHub Copilot for Azure Preview to help you is a great option.

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

## Example prompts to learn about Azure

Suppose you want to learn about your options or how to utilize Azure for your application and decide to use GitHub Copilot for Azure Preview to help. To begin, you can start with an open ended question and then add details like specific services and technologies. The following example prompts you can try to help you learn how to use Azure in your apps.

### Learn about system architecture on Azure

- "@azure How can I create a highly available architecture in Azure?"
- "@azure Explain the Azure Well-Architected Framework."
- "@azure What types of app hosting solutions does Azure have?"
- "@azure Help me orchestrate and automate my data processing workflows."
- "@azure How to integrate SignalR with App Gateway/APIM/etc?"
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

- "@azure What types of containerized applications are supported in Azure?"
- "@azure What are the options for managing containers in Azure?"
- "@azure When should I use AKS instead of ACA?"
- "@azure What's the difference between ACA and AKS?"
- "@azure Why would I choose Azure ACA over Azure AKS"


### Learn how to utilize Azure services for your app


|Service or technology|Learn prompt examples|
|---|---|
|Azure AI Search|<ul><li>"@azure What is Azure AI Search and why use Azure AI Search?"</li><li>"@azure How does pricing work for Azure AI Search?"</li><li>"@azure How is Azure AI Search integrated with Azure OpenAI?"</li><li>"@azure How is Azure AI Search integrated with Azure ML?"</li><li>"@azure When should I use hybrid search, vector search, vs. semantic ranker in Azure AI Search?"</li><li>"@azure Is Azure AI Search a vector database? How does Azure AI Search ensure the accuracy and relevance of vector search results?"</li><li>"@azure What support do you have for high scale multi-tenant applications in Azure AI Search?"</li><li>"@azure What is integrated vectorization feature in Azure AI Search? From which data sources can I extract data and utilize integrated vectorization?"</li><li>"@azure What is Azure AI Search AI enrichment? How does AI enrichment work? What are the benefits of using AI enrichment?"</li><li>"@azure What is semantic ranker in Azure AI Search? How is it different from vector search?"</li><li>"@azure What are top recommended code samples or solution accelerator for Azure AI Search?"</li><li>"@azure What are some real world examples of businesses leveraging Azure AI Search?"</li></ul>|
|Azure API Manager|<ul><li>"@azure What are the benefits and applications of Azure API Management?"</li></ul>|
|Azure App Service|<ul><li>"@azure How do I deploy a web app in Azure?"</li><li>"@azure How to create an App Service app and deploy code to a staging environment using CLI?"</li><li>"@azure Create a script to deploy a webapp that will run in python."</li><li>"@azure What database options does Azure have for web apps?"</li><li>"@azure What serverless options does Azure have for web apps?"</li><li>"@azure Create a guide for maximizing Azure App Services."</li></ul>|
|Azure Cache for Redis|<ul><li>"@azure Demonstrate how to configure Azure Redis Cache for high availability and disaster recovery."</li></ul>|
|Azure Container Apps (ACA)|<ul><li>"@azure What is Azure's aca service?"</li><li>"@azure Tell me the difference between a container app and a container app environment?"</li></ul>|
|Azure Cosmos DB|<ul><li>"@azure Why use Azure Cosmos DB instead of Azure SQL?"</li><li>"@azure I want to use CosmosDB to store my data."</li><li>"@azure Why would I use a Cosmos DB account over a SQL database?"</li></ul>|
|Azure Data Factory|<ul><li>"@azure How do I create data pipelines with Azure Data Factory?"</li></ul>|
|Azure Developer CLI (azd)|<ul><li>"@azure Do you have example deployment models for Azure? SaaS, PaaS, etc."</li><li>"@azure What is the best infrastructure for my application?"</li><li>"@azure How do I set up my Azure environment?"</li><li>"@azure What are ARM Templates and how do I use them?"</li><li>"@azure How do I manage environments with the Azure Developer CLI?"</li><li>"@azure What is the Azure Developer CLI?"</li><li>"@azure What is the difference between Bicep and ARM?"</li><li>"@azure How do I make sure my environments have the best security patterns?"</li><li>"@azure How do I deploy using my CI/CD pipeline?"</li></ul>|
|Azure Functions|<ul><li>"@azure How do I create a new Azure Function?"</li><li>"@azure What is the difference between Azure Functions and Azure Logic apps?"</li><li>"@azure Create a guide for integrating Azure Logic Apps with Azure Functions."</li><li>"@azure I want to create an Azure function in NodeJS."</li></ul>|
|Azure KeyVault|<ul></li>"@azure Explain how and why I should use Azure Key Vaults."</li></ul>|
|Azure Kubernetes Service (AKS)|<ul><li>"@azure How do I get the status of all nodes in my AKS cluster?"</li><li>"@azure What’s the command to set a context for my AKS cluster?"</li></ul>|
|Azure Machine Learning|<ul><li>"@azure Generate a PowerShell script to create a new Azure Machine Learning workspace."</li><li>"@azure What is the difference between Azure AI services and Azure Machine Learning?"</li></ul>|
|Azure Monitor|<ul><li>"@azure Guide for using Azure Logic Apps to automate responses to Azure Monitor alerts."</li></ul>|
|Azure Network|<ul><li>"@azure How do I balance inbound network traffic to my application?"</li></ul>|
|Azure OpenAI|<ul><li>"@azure What services does Azure OpenAI provide?"</li><li>"@azure Where is GPT-4o mini available?"</li><li>"@azure What are the prerequisites for integrating Azure OpenAI?"</li><li>"@azure Create a guide for creating and using AzureOpenAI resources."</li><li>"@azure What are the different types of Azure OpenAI models available?"</li></ul>|
|Azure SDK|<ul><li>"@azure Can I use Azure SDKs in the browser?"</li><li>"@azure Does the C# storage SDK support chunked blob uploads and downloads?"</li></ul>|
|Azure SignalR|<ul><li>"@azure How to host and scale SignalR on multiple servers?"</li><li>"@azure How to do real-time communication in .NET?"</li><li>"@azure How to push real-time updates to clients?"</li><li>"@azure How to synchronize data across clients?"</li><li>"@azure How to stream data to clients?"</li><li>"@azure How to manage and scale WebSocket connections?"</li><li>"@azure How to host and scale Socket.IO?"</li><li>"@azure What do I need to do to configure my SignalR code to work with Azure SignalR service?"</li><li>"@azure Evaluate my use of SignalR, is it following the best security practices?"</li><li>"@azure How to stress test SignalR?"</li><li>"@azure How to configure networking in Azure SignalR?"</li><li>"@azure How to configure web pubsub event handler?"</li><li>"@azure Evaluate my use of SignalR, is it following the best security practices?"</li></ul>|
|Azure SQL|<ul><li>"@azure Create a Terraform configuration to deploy an Azure SQL database."</li><li>"@azure Design a strategy for migrating on-premises SQL Server databases to Azure SQL Managed Instance."</li></ul>|
|Azure Static Web Apps|<ul><li>"@azure Do static web apps support static ip addresses?"</li></ul>|
|Azure Storage|<ul><li>"@azure why would I use a blob storage?"</li><li>"@azure How to pull data from storage blob in React?"</li><li>"@azure Outline steps to secure Azure Blob Storage with private endpoints and Azure Private Link."</li><li>"@azure Generate Azure CLI script to create a new storage account."</li><li>"@azure Give me the code to create a new storage account with CLI."</li><li>"@azure Can you help me choose the right Azure storage solution?"</li></ul>|
|Azure Web PubSub|<ul><li>"@azure How to authenticate with Web PubSub?"</li><li>"@azure What do I need to do to host my Socket.IO app on Azure?"</li><li>"@azure How to stress test the Web PubSub?"</li></ul>|

## Next steps

- [Understand what is GitHub Copilot for Azure Preview and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure Preview in your software development workflow. The quickstart instructs you to deploy services to Azure, monitor their status, and troubleshoot issues.
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).
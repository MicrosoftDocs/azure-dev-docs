---
title: GitHub Copilot for Azure prompt engineering examples to learn about using Azure for your application
description: This article provides example prompts that can help you learn how to use Azure and deploy your application to the cloud.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: best-practice
ms.date: 5/30/2025
ms.collection: ce-skilling-ai-copilot
---

# Example prompts for learning about Azure and your application with GitHub Copilot for Azure

If you're unfamiliar with Azure and how you can use it for your application, you can ask GitHub Copilot for Azure to help you. Use [best practices](introduction.md#best-practices) to achieve the best results.

## Example prompts to learn about Azure

If you want to use GitHub Copilot for Azure to learn about how to use Azure for your application, you can start with an open-ended question or request. Then, add details like specific services and technologies for better results. Try the following example prompts.

### Learn about system architecture on Azure

Use GitHub Copilot to recommend Azure services to use for your project.

- "@azure What Azure services should I use with my app?"
- "@azure Please recommend Azure services for my project"

When asked to recommend an Azure service, GitHub Copilot for Azure scans the current application in the workspace and provides recommendations for Azure services and service bindings. 

You can work in an iterative manner asking GitHub Copilot for Azure to update the recommendations to use a different Azure service or change the bindings information. Example prompts: 

- "@azure I'd like to use App Service instead of Azure Container App for my api project" 
- "@azure Add a Cosmos DB to my project"
- "@azure The SERVICE_URL value should be bing.com"
- "@azure Add an environment variable STAGE=dev to my project"

You can follow-up by asking more detailed questions based on GitHub Copilot for Azure's recommendations. Here are some example detailed questions to help you understand the types of prompts you can use.

- "@azure How can I create a highly available architecture in Azure?"
- "@azure Explain the Azure Well-Architected Framework."
- "@azure What types of app hosting solutions does Azure have?"
- "@azure Help me orchestrate and automate my data processing workflows."
- "@azure How can I integrate SignalR with Azure Application Gateway and Azure API Management?"
- "@azure How many units do you recommend?"
- "@azure What are the benefits and applications of using Terraform?"

### Learn about AI on Azure

- "@azure I want to build an AI application. What services can I use?"

### Learn about web and application hosting on Azure

- "@azure Which Azure service is best for hosting a scalable web application?"
- "@azure Which service should I use to create a website?"
- "@azure How can I use Azure to build a scalable web application?"
- "@azure For what scenarios is Azure Functions better than Web Apps?"

### Learn about containers on Azure

- "@azure What types of containerized applications does Azure support?"
- "@azure What are the options for managing containers in Azure?"
- "@azure When should I use Azure Kubernetes Service instead of Azure Container Apps?"
- "@azure What's the difference between Azure Container Apps and AKS?"
- "@azure Why would I choose Azure Container Apps over AKS?"

### Learn how to use Azure services for your app

|Service or technology|Learn prompt examples|
|---|---|
|Azure AI Search|<ul><li>"@azure What is Azure AI Search and why should I use it?"</li><li>"@azure How does pricing work for Azure AI Search?"</li><li>"@azure How is Azure AI Search integrated with Azure OpenAI?"</li><li>"@azure How is Azure AI Search integrated with Azure Machine Learning?"</li><li>"@azure When should I use hybrid search or vector search versus semantic ranker in Azure AI Search?"</li><li>"@azure Is Azure AI Search a vector database? How does Azure AI Search ensure the accuracy and relevance of vector search results?"</li><li>"@azure What support do you have for high-scale multitenant applications in Azure AI Search?"</li><li>"@azure What is the integrated vectorization feature in Azure AI Search? From which data sources can I extract data and use integrated vectorization?"</li><li>"@azure What is AI enrichment in Azure AI Search? How does AI enrichment work? What are the benefits of using AI enrichment?"</li><li>"@azure What is the semantic ranker in Azure AI Search? How is it different from vector search?"</li><li>"@azure What are top recommended code samples or solution accelerators for Azure AI Search?"</li><li>"@azure What are some real-world examples of businesses using Azure AI Search?"</li></ul>|
|Azure API Management|<ul><li>"@azure What are the benefits and applications of Azure API Management?"</li></ul>|
|Azure App Service|<ul><li>"@azure How do I deploy a web app in Azure?"</li><li>"@azure How do I create an App Service app and deploy code to a staging environment by using the CLI?"</li><li>"@azure Create a script to deploy a web app that will run in Python."</li><li>"@azure What database options does Azure have for web apps?"</li><li>"@azure What serverless options does Azure have for web apps?"</li><li>"@azure Create a guide for maximizing Azure App Service."</li></ul>|
|Azure Cache for Redis|<ul><li>"@azure Demonstrate how to configure a Redis cache in Azure for high availability and disaster recovery."</li></ul>|
|Azure Container Apps|<ul><li>"@azure What is the Azure Container Apps service?"</li><li>"@azure Tell me the difference between a container app and a container app environment."</li></ul>|
|Azure Cosmos DB|<ul><li>"@azure Why would I use Azure Cosmos DB instead of Azure SQL?"</li><li>"@azure I want to use Azure Cosmos DB to store my data."</li><li>"@azure Why would I use an Azure Cosmos DB account over a SQL database?"</li></ul>|
|Azure Data Factory|<ul><li>"@azure How do I create data pipelines with Azure Data Factory?"</li></ul>|
|Azure Developer CLI (`azd`)|<ul><li>"@azure Do you have example deployment models for Azure? SaaS, PaaS, etc."</li><li>"@azure What is the best infrastructure for my application?"</li><li>"@azure How do I set up my Azure environment?"</li><li>"@azure What are Azure Resource Manager templates and how do I use them?"</li><li>"@azure How do I manage environments with the Azure Developer CLI?"</li><li>"@azure What is the Azure Developer CLI?"</li><li>"@azure What is the difference between Bicep and ARM templates?"</li><li>"@azure How do I make sure my environments have the best security patterns?"</li><li>"@azure How do I deploy by using my CI/CD pipeline?"</li></ul>|
|Azure Functions|<ul><li>"@azure How do I create a new Azure function?"</li><li>"@azure What is the difference between Azure Functions and Azure Logic Apps?"</li><li>"@azure Create a guide for integrating Azure Logic Apps with Azure Functions."</li><li>"@azure I want to create an Azure function in Node.js."</li></ul>|
|Azure Key Vault|<ul><li>"@azure Explain how and why I should use Azure key vaults."</li></ul>|
|Azure Kubernetes Service (AKS)|<ul><li>"@azure How do I get the status of all nodes in my AKS cluster?"</li><li>"@azure What's the command to set a context for my AKS cluster?"</li></ul>|
|Azure Machine Learning|<ul><li>"@azure Generate a PowerShell script to create a new Azure Machine Learning workspace."</li><li>"@azure What is the difference between Azure AI services and Azure Machine Learning?"</li></ul>|
|Azure Monitor|<ul><li>"@azure Create a guide for using Azure Logic Apps to automate responses to Azure Monitor alerts."</li></ul>|
|Azure Virtual Network|<ul><li>"@azure How do I balance inbound network traffic to my application?"</li></ul>|
|Azure OpenAI Service|<ul><li>"@azure What services does Azure OpenAI provide?"</li><li>"@azure Where is GPT-4o mini available?"</li><li>"@azure What are the prerequisites for integrating Azure OpenAI?"</li><li>"@azure Create a guide for creating and using Azure OpenAI resources."</li><li>"@azure What are the available types of Azure OpenAI models?"</li></ul>|
|Azure SDK|<ul><li>"@azure Can I use Azure SDKs in the browser?"</li><li>"@azure Does the C# storage SDK support chunked blob uploads and downloads?"</li></ul>|
|Azure SignalR Service|<ul><li>"@azure How do I host and scale SignalR on multiple servers?"</li><li>"@azure How do I do real-time communication in .NET?"</li><li>"@azure How do I push real-time updates to clients?"</li><li>"@azure How do I synchronize data across clients?"</li><li>"@azure How do I stream data to clients?"</li><li>"@azure How do I manage and scale WebSocket connections?"</li><li>"@azure How do I host and scale Socket.IO?"</li><li>"@azure What do I need to do to configure my SignalR code to work with Azure SignalR Service?"</li><li>"@azure Evaluate my use of SignalR. Is it following the best security practices?"</li><li>"@azure How do I stress test SignalR?"</li><li>"@azure How do I configure networking in Azure SignalR Service?"</li><li>"@azure How do I configure an Azure Web PubSub event handler?"</li>|
|Azure SQL|<ul><li>"@azure Create a Terraform configuration to deploy an Azure SQL database."</li><li>"@azure Design a strategy for migrating on-premises SQL Server databases to Azure SQL Managed Instance."</li></ul>|
|Azure Static Web Apps|<ul><li>"@azure Do static web apps support static IP addresses?"</li></ul>|
|Azure Storage|<ul><li>"@azure Why would I use a blob storage?"</li><li>"@azure How do I pull data from a storage blob in React?"</li><li>"@azure Outline steps to secure Azure Blob Storage with private endpoints and Azure Private Link."</li><li>"@azure Generate an Azure CLI script to create a new storage account."</li><li>"@azure Give me the code to create a new storage account with a CLI."</li><li>"@azure Can you help me choose the right Azure storage solution?"</li></ul>|
|Azure Web PubSub|<ul><li>"@azure How do I authenticate with Web PubSub?"</li><li>"@azure What do I need to do to host my Socket.IO app on Azure?"</li><li>"@azure How do I stress test Web PubSub?"</li></ul>|

## Related content

- [Understand what GitHub Copilot for Azure is and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [designing and developing applications for Azure](design-develop-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).

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

If you're unfamiliar with Azure and how you can use it for your application, you can ask GitHub Copilot for Azure to help you. Use [best practices](introduction.md#best-practices) to achieve the best results. Most importantly:

- Use "Agent" mode for the best experience. Avoid "ask" mode.
- Include the word "Azure" in the prompt to help Copilot understand that it needs to call tools from the Azure MCP Server.

## Example prompts to learn about Azure

If you want to use GitHub Copilot for Azure to learn about how to use Azure for your application, you can start with an open-ended question or request. Then, add details like specific services and technologies for better results. Try the following example prompts.

### Learn about system architecture on Azure

Use GitHub Copilot to recommend Azure services to use for your project.

- "What services should I use with my Azure app?"
- "Please recommend Azure services for my project."

When asked to recommend an Azure service, GitHub Copilot for Azure scans the current application in the workspace and provides recommendations for Azure services and service bindings. 

You can work in an iterative manner asking GitHub Copilot for Azure to update the recommendations to use a different Azure service or change the bindings information. Example prompts: 

- "I'd like to use Azure App Service instead of Container Apps for my API project."
- "Add an Azure Cosmos DB to my project."
- "The Azure SERVICE_URL value should be bing.com."
- "Add an environment variable STAGE=dev to my Azure project."

You can follow up by asking more detailed questions based on GitHub Copilot for Azure's recommendations. Here are some example detailed questions to help you understand the types of prompts you can use.

- "How can I create a highly available architecture using Azure?"
- "Explain the Azure Well-Architected Framework."
- "What types of app hosting solutions are available in Azure?"
- "Help me orchestrate and automate my Azure data processing workflows."
- "How can I integrate Azure SignalR with Application Gateway and API Management?"
- "How many Azure units do you recommend?"
- "What are the benefits and applications of using Azure with Terraform?"

### Learn about AI on Azure

- "I want to build an AI application. What Azure services can I use?"

### Learn about web and application hosting on Azure

- "Which Azure service is best for hosting a scalable web application?"
- "Which Azure service should I use to create a website?"
- "How can I use Azure to build a scalable web application?"
- "For what scenarios is Azure Functions better than Web Apps?"

### Learn about containers on Azure

- "What types of containerized applications does Azure support?"
- "What are the options for managing containers in Azure?"
- "When should I use Azure Kubernetes Service instead of Azure Container Apps?"
- "What's the difference between Azure Container Apps and AKS?"
- "Why would I choose Azure Container Apps over AKS?"

### Learn how to use Azure services for your app

|Service or technology|Learn prompt examples|
|---|---|
|Azure AI Search|<ul><li>"What is Azure AI Search and why should I use it?"</li><li>"How does pricing work for Azure AI Search?"</li><li>"How is Azure AI Search integrated with Azure OpenAI?"</li><li>"How is Azure AI Search integrated with Azure Machine Learning?"</li><li>"When should I use hybrid search or vector search versus the semantic ranker in Azure AI Search?"</li><li>"Is Azure AI Search a vector database? How does it ensure the accuracy and relevance of vector search results?"</li><li>"What support does Azure AI Search have for high-scale multitenant applications?"</li><li>"What is the integrated vectorization feature in Azure AI Search, and from which data sources can I extract data for it?"</li><li>"What is AI enrichment in Azure AI Search, how does it work, and what are its benefits?"</li><li>"What is the semantic ranker in Azure AI Search, and how is it different from vector search?"</li><li>"What are the top recommended code samples or solution accelerators for Azure AI Search?"</li><li>"What are some real-world examples of businesses using Azure AI Search?"</li></ul>|
|Azure API Management|<ul><li>"What are the benefits and applications of Azure API Management?"</li></ul>|
|Azure App Service|<ul><li>"How do I deploy a web app in Azure?"</li><li>"How do I create an Azure App Service app and deploy code to a staging environment using the CLI?"</li><li>"Create a script to deploy a Python web app in Azure."</li><li>"What database options does Azure offer for web apps?"</li><li>"What serverless options does Azure provide for web apps?"</li><li>"Create a guide for maximizing Azure App Service."</li></ul>|
|Azure Cache for Redis|<ul><li>"Demonstrate how to configure an Azure Redis cache for high availability and disaster recovery."</li></ul>|
|Azure Container Apps|<ul><li>"What is the Azure Container Apps service?"</li><li>"Tell me the difference between an Azure container app and a container app environment."</li></ul>|
|Azure Cosmos DB|<ul><li>"Why would I use Azure Cosmos DB instead of Azure SQL?"</li><li>"I want to use Azure Cosmos DB to store my data."</li><li>"Why would I use an Azure Cosmos DB account instead of a SQL database?"</li></ul>|
|Azure Data Factory|<ul><li>"How do I create data pipelines using Azure Data Factory?"</li></ul>|
|Azure Developer CLI (`azd`)|<ul><li>"Do you have example deployment models for Azure, such as SaaS or PaaS?"</li><li>"What is the best Azure infrastructure for my application?"</li><li>"How do I set up my Azure environment?"</li><li>"What are Azure Resource Manager templates and how do I use them?"</li><li>"How do I manage environments with the Azure Developer CLI?"</li><li>"What is the Azure Developer CLI?"</li><li>"What is the difference between Azure Bicep and ARM templates?"</li><li>"How do I ensure my Azure environments follow best security patterns?"</li><li>"How do I deploy using my CI/CD pipeline in Azure?"</li></ul>|
|Azure Functions|<ul><li>"How do I create a new Azure Function?"</li><li>"What is the difference between Azure Functions and Azure Logic Apps?"</li><li>"Create a guide for integrating Azure Logic Apps with Azure Functions."</li><li>"I want to create an Azure Function in Node.js."</li></ul>|
|Azure Key Vault|<ul><li>"Explain how and why I should use Azure Key Vault."</li></ul>|
|Azure Kubernetes Service (AKS)|<ul><li>"How do I get the status of all nodes in my Azure AKS cluster?"</li><li>"What's the command to set a context for my Azure AKS cluster?"</li></ul>|
|Azure Machine Learning|<ul><li>"Generate a PowerShell script to create a new Azure Machine Learning workspace."</li><li>"What is the difference between Azure AI services and Azure Machine Learning?"</li></ul>|
|Azure Monitor|<ul><li>"Create a guide for using Azure Logic Apps to automate responses to Azure Monitor alerts."</li></ul>|
|Azure Virtual Network|<ul><li>"How do I balance inbound network traffic to my Azure application?"</li></ul>|
|Azure OpenAI Service|<ul><li>"What services does Azure OpenAI provide?"</li><li>"Where is GPT-4o mini available in Azure?"</li><li>"What are the prerequisites for integrating Azure OpenAI?"</li><li>"Create a guide for creating and using Azure OpenAI resources."</li><li>"What are the available Azure OpenAI model types?"</li></ul>|
|Azure SDK|<ul><li>"Can I use Azure SDKs in the browser?"</li><li>"Does the Azure C# Storage SDK support chunked blob uploads and downloads?"</li></ul>|
|Azure SignalR Service|<ul><li>"How do I host and scale SignalR on multiple servers in Azure?"</li><li>"How do I do real-time communication in .NET with Azure?"</li><li>"How do I push real-time updates to clients using Azure?"</li><li>"How do I synchronize data across clients in Azure SignalR Service?"</li><li>"How do I stream data to clients in Azure?"</li><li>"How do I manage and scale WebSocket connections in Azure?"</li><li>"How do I host and scale Socket.IO in Azure?"</li><li>"What do I need to configure my SignalR code to work with Azure SignalR Service?"</li><li>"Evaluate my SignalR setup — is it following Azure’s best security practices?"</li><li>"How do I stress test Azure SignalR?"</li><li>"How do I configure networking in Azure SignalR Service?"</li><li>"How do I configure an Azure Web PubSub event handler?"</li></ul>|
|Azure SQL|<ul><li>"Create a Terraform configuration to deploy an Azure SQL database."</li><li>"Design a strategy for migrating on-premises SQL Server databases to Azure SQL Managed Instance."</li></ul>|
|Azure Static Web Apps|<ul><li>"Do Azure Static Web Apps support static IP addresses?"</li></ul>|
|Azure Storage|<ul><li>"Why would I use Azure Blob Storage?"</li><li>"How do I pull data from an Azure Storage blob in React?"</li><li>"Outline steps to secure Azure Blob Storage with private endpoints and Azure Private Link."</li><li>"Generate an Azure CLI script to create a new storage account."</li><li>"Give me the CLI code to create a new Azure Storage account."</li><li>"Can you help me choose the right Azure Storage solution?"</li></ul>|
|Azure Web PubSub|<ul><li>"How do I authenticate with Azure Web PubSub?"</li><li>"What do I need to do to host my Socket.IO app on Azure?"</li><li>"How do I stress test Azure Web PubSub?"</li></ul>|

## Related content

- [Understand what GitHub Copilot for Azure is and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-deploy-app-agent-mode.md) to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [designing and developing applications for Azure](design-develop-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).

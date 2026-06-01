---
title: Troubleshoot Azure applications with GitHub Copilot for Azure
description: Use GitHub Copilot for Azure prompt examples to diagnose errors, analyze logs, and resolve performance issues across Azure services.
keywords: github, copilot, ai, azure, troubleshooting, logs, diagnostics
author: diberry
ms.author: diberry
ms.service: github-copilot-for-azure
ms.topic: best-practice
ms.date: 05/20/2026
ms.collection: ce-skilling-ai-copilot
ai-usage: ai-assisted
---

# Troubleshoot Azure applications with GitHub Copilot for Azure

Use GitHub Copilot for Azure to diagnose errors, analyze logs, and resolve performance issues in your Azure applications. Whether you need to find the root cause of a deployment failure or investigate slow response times, Copilot can help you troubleshoot faster by querying your Azure resources directly.

## Before you start troubleshooting

For the best troubleshooting experience, use [best practices](introduction.md#best-practices):

- Use **Agent** mode for interactive troubleshooting. Avoid **Ask** mode.
- Include the word "Azure" in your prompt so Copilot calls the right tools from the Azure MCP Server.
- If using Visual Studio Code, select **Configure Tools** and enable both **Azure MCP** and **GitHub Copilot for Azure**. For details, see [the Tool calling section's Visual Studio Code tab](introduction.md#tool-calling).

## General troubleshooting prompts

### Diagnose errors and failures

- "Why did my last Azure deployment fail?"
- "I'm seeing errors with my app — check the Azure logs to find out why."
- "Why am I seeing a 500 error when opening my Azure website?"
- "Are there any 501 errors in my Azure app logs?"
- "I'm getting an xxx error code in Azure — what could be the reasons?"
- "Show me all the 4xx errors in my Azure logs from the last 6 hours."

### Investigate performance issues

- "Help me analyze my Azure app for high CPU usage."
- "Why is my Azure application running slow?"
- "What's causing latency in my Azure web app?"
- "Take a memory dump of my Azure app."

### Analyze logs with timeframes

- "Troubleshoot my Azure app for any possible issues in the last 3 hours."
- "What errors did my Azure app 'myAppName' have in the last 24 hours?"
- "Grab all the Azure errors in the logs between yesterday and today."
- "Find error messages in the Azure logs that might correlate to 500 errors."

### Monitor metrics and health

- "Where can I find metrics and logs in Azure?"
- "I want to see all the error messages in my Azure logs."
- "Diagnose my Azure app to show what problems it encountered."
- "Why are my clients being disconnected so often in Azure?"

## Service-specific troubleshooting prompts

### Azure App Service

- "Diagnose high CPU usage in Azure App Service."
- "Why am I seeing high memory usage in my Azure App Service?"
- "Help me diagnose slow performance in my Azure web app."
- "My Azure App Service container won't start."
- "Is there anything wrong with my Azure bakery-api web app?"
- "Troubleshoot why my Azure web app is not responding."
- "Help me collect a memory dump from Azure App Service."
- "Look into whether my Azure web app is having any downtime."

### Azure Container Apps

- "My Azure container app won't start."
- "My users are reporting errors with my Azure container app."
- "Can you look at my Azure container app 'energy-api-1' logs for any 404 errors?"
- "Have my Azure container app's system console logs contained any warnings recently?"

### Azure Kubernetes Service (AKS)

- "Help me troubleshoot my AKS cluster."
- "How can I get the logs of a specific pod in Azure?"
- "Do my Azure kube-apiserver logs show the last time a restart occurred?"
- "My AKS cluster 'assistant-orchestrator' is having performance problems."
- "Find out why my Azure Kubernetes cluster 'store-service-prod' is running slow."

### Azure OpenAI Service

- "What is using up my Azure OpenAI gpt-4o model quota?"
- "My Azure OpenAI deployment is returning 429 rate limit errors."
- "Help me troubleshoot token usage for my Azure OpenAI chat completion."

### Azure Functions

- "My Azure function isn't triggering. Help me troubleshoot."
- "Why is my Azure function timing out?"
- "Check the Azure function invocation logs for errors in the last hour."

### Azure Cosmos DB

- "Why are my Azure Cosmos DB queries slow?"
- "Help me troubleshoot high RU consumption in my Azure Cosmos DB account."
- "My Azure Cosmos DB request is returning a 429 error."

### Azure Event Hubs

- "My application needs help processing real-time events in Azure Event Hubs."
- "Why is my Azure Event Hubs consumer group falling behind?"

### Azure SignalR Service

- "My Azure SignalR client is not receiving messages. Why?"
- "Why are my Azure SignalR clients being disconnected so often?"
- "Where can I find metrics and logs for my Azure SignalR app?"

### Azure Storage

- "I got an Azure Storage error 403: unauthorized blob listing."
- "Why is my Azure Storage account throttling requests?"

### Azure Developer CLI (`azd`)

- "I'm getting this Azure Developer CLI error. What does it mean?"
- "My `azd up` command failed during provisioning. Help me understand why."

### Azure SDK

- "The npm Azure Resource Manager SDK is failing to install. What should I do?"
- "I'm getting authentication errors with the Azure SDK. Help me fix it."

### Azure Web PubSub

- "My Azure Web PubSub client is not receiving messages. Why?"

## Related content

- [Understand what GitHub Copilot for Azure is and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-deploy-app-agent-mode.md) to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [designing and developing applications for Azure](design-develop-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).

---
title: GitHub Copilot for Azure prompt engineering examples for troubleshooting your application
description: This article provides example prompts that can help you troubleshoot your application in the cloud.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: best-practice
ms.date: 5/30/2025
ms.collection: ce-skilling-ai-copilot
---

# Example prompts for troubleshooting your application with GitHub Copilot for Azure

If you're unfamiliar with Azure or you just want the tooling and AI to do most of the work, you can ask GitHub Copilot for Azure to help you troubleshoot problems with your application.

## Example prompts for troubleshooting your app

If you're unfamiliar with Azure or you just want the tooling and AI to do most of the work, you can ask GitHub Copilot for Azure and Azure MCP Server to help you deploy your application. Use [best practices](introduction.md#best-practices) to achieve the best results. Most importantly:

- Use "Agent" mode for the best experience. Avoid "Ask" mode.
- Include the word "Azure" in the prompt to help Copilot understand that it needs to call tools from the Azure MCP Server.
- If using Visual Studio Code, make sure you use "Configure Tools ..." and include both "Azure MCP" and "GitHub Copilot for Azure". [See the Tool calling section's Visual Studio Code tab](introduction.md#tool-calling) for more details.

### Open-ended prompts

- "Where can I find metrics and logs in Azure?"
- "I want to see all the error messages in my Azure logs."
- "I'm seeing errors with my app — check the Azure logs to find out why."
- "Why are my clients being disconnected so often in Azure?"
- "Why did my last Azure deployment fail?"
- "Help me analyze my Azure app for high CPU usage."
- "Why is my Azure application running slow?"
- "Take a memory dump of my Azure app."

### Prompts about specific timeframes

- "Grab all the Azure errors in the logs between yesterday and today."
- "Diagnose my Azure app to show what problems it encountered."
- "Tell me what goes wrong with my Azure app 'myAppName'."
- "Troubleshoot my Azure app for any possible issues in the last 3 hours."
- "What errors did my Azure app 'myAppName' have in the last 24 hours?"


### Prompts about specific errors

- "Are there any 501 errors in my Azure app logs?"
- "Why am I seeing a 500 error when opening my Azure website?"
- "I'm getting an xxx error code in Azure — what could be the reasons?"
- "Show me all the 4xx errors in my Azure logs from the last 6 hours."
- "Find error messages in the Azure logs that might correlate to 500 errors."


### Prompts about specific services and technologies

|Service or technology|Troubleshoot prompt examples|
|---|---|
|Azure Container Apps|<ul><li>"My Azure container app won't start."</li><li>"My users are reporting errors with my Azure container app."</li><li>"Can you look at my Azure container app 'energy-api-1' logs for any 404 errors?"</li><li>"Have my Azure container app's system console logs contained any warnings recently?"</li></ul>|
|Azure Kubernetes Service (AKS)|<ul><li>"Help me troubleshoot my AKS cluster."</li><li>"How do I troubleshoot Azure Kubernetes Service (AKS)?"</li><li>"How can I get the logs of a specific pod in Azure?"</li><li>"Do my Azure kube-apiserver logs show the last time a restart occurred?"</li><li>"My AKS cluster 'assistant-orchestrator' is having performance problems."</li><li>"Find out why my Azure Kubernetes cluster 'store-service-prod' is running slow."</li><li>"I'd like to investigate performance problems with my Azure Kubernetes cluster."</li></ul>|
|Azure App Service|<ul><li>"How can I improve my Azure web app's performance?"</li><li>"How do I improve my app's CPU usage in Azure?"</li><li>"How can I improve the performance of my Azure web app?"</li><li>"Diagnose high CPU usage in Azure App Service."</li><li>"Show me how to detect slow performance issues in my Azure App Service web app."</li><li>"Investigate high CPU usage for Azure App Service."</li><li>"What's causing latency in my Azure web app?"</li><li>"Can you help me diagnose high CPU usage in Azure App Service?"</li><li>"Why am I seeing high memory usage in my Azure App Service?"</li><li>"Help me analyze my Azure web app downtime."</li><li>"Help me diagnose slow performance in my Azure web app."</li><li>"Help me collect a memory dump from Azure App Service."</li><li>"My Azure App Service container won't start."</li><li>"Is there anything wrong with my Azure bakery-api web app?"</li><li>"Look into whether my Azure web app is having any downtime."</li><li>"Troubleshoot why my Azure web app is not responding."</li></ul>|
|Azure Developer CLI (`azd`)|<ul><li>"I'm getting this Azure Developer CLI error. What does it mean?"</li></ul>|
|Azure SDK|<ul><li>"The npm Azure Resource Manager SDK is failing to install. What should I do?"</li></ul>|
|Azure Event Hubs|<ul><li>"My application needs help processing real-time events in Azure Event Hubs."</li></ul>|
|Azure OpenAI Service|<ul><li>"What is using up my Azure OpenAI GPT4o model quota?"</li></ul>|
|Azure SignalR Service|<ul><li>"My Azure SignalR client is not receiving messages. Why?"</li><li>"Why are my Azure SignalR clients being disconnected so often?"</li><li>"Where can I find metrics and logs for my Azure SignalR app?"</li></ul>|
|Azure Storage|<ul><li>"Can you help me choose the right Azure Storage solution?"</li><li>"What are some ways to secure my Azure Storage account?"</li><li>"I got an Azure Storage error 403: unauthorized blob listing."</li></ul>|
|Azure Web PubSub|<ul><li>"My Azure Web PubSub client is not receiving messages. Why?"</li></ul>|

## Related content

- [Understand what GitHub Copilot for Azure is and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-deploy-app-agent-mode.md) to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [designing and developing applications for Azure](design-develop-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).

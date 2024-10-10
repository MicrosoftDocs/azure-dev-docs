---
title: GitHub Copilot for Azure Preview prompt engineering examples for troubleshooting your application
description: This article provides example prompts that can help you troubleshoot your application in the cloud.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: best-practice
ms.date: 09/03/2024
ms.collection: ce-skilling-ai-copilot
---

# Example prompts for troubleshooting your application with GitHub Copilot for Azure Preview

If you're unfamiliar with Azure or you just want the tooling and AI to do most of the work, you can ask GitHub Copilot for Azure Preview to help you troubleshoot problems with your application.

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

## Example prompts for troubleshooting your app

If you want to use GitHub Copilot for Azure Preview for help with troubleshooting your application, you can start with an open-ended question or request. Then, add details for better results.

### Open-ended prompts

- "@azure Where can I find metrics and logs?"
- "@azure I want to see all the error messages in the logs."
- "@azure I'm seeing errors with my app. Look at the logs to find out why."
- "@azure Why are my clients being disconnected so often?"
- "@azure Why did my last deployment fail?"
- "@azure Help me analyze my app for high CPU usage."
- "@azure Why is my application slow?"
- "@azure Take a memory dump of my app."

### Prompts about specific timeframes

- "@azure Grab all the errors in the logs between yesterday and today."
- "@azure Diagnose my app to show me what problems it encountered."
- "@azure Tell me what goes wrong with my app 'myAppName'."
- "@azure Troubleshoot my app for any possible issues in the last 3 hours."
- "@azure What errors did my app 'myAppName' have in the last 24 hours?"

### Prompts about specific errors

- "@azure Is there any 501 error in my app logs?"
- "@azure Why am I seeing a 500 error when opening my website?"
- "@azure I'm getting an xxx error code. What could be the reasons?"
- "@azure Show me all the 4xx errors in the logs in the last 6 hours."
- "@azure Find error messages in the logs that might correlate to 500 errors."

### Prompts about specific services and technologies

|Service or technology|Troubleshoot prompt examples|
|---|---|
|Azure Container Apps|<ul><li>"@azure My container app won't start."</li><li>"@azure My users are reporting errors with my container app."</li><li>"@azure Can you look at my energy-api-1 container app's logs for any 404 errors?"</li><li>"@azure Have my container app's system console logs contained any warnings recently?"</li></ul>|
|Azure Kubernetes Service (AKS)|<ul><li>"@azure Help me troubleshoot my AKS cluster."</li><li>"@azure How do I troubleshoot Azure Kubernetes Service (AKS)?"</li><li>"@azure How can I get the logs of a specific pod?"</li><li>"@azure Do my kube-apiserver logs show the last time a restart occurred?"</li><li>"@azure My assistant-orchestrator AKS cluster is having performance problems."</li><li>"@azure Find out why my store-service-prod Kubernetes cluster is running slow."</li><li>"@azure I'd like to investigate performance problems with my Kubernetes cluster."</li></ul>|
|Azure App Service|<ul><li>"@azure How can I improve my Azure web app's performance?"</li><li>"@azure How do I improve my app's CPU usage?"</li><li>"@azure How can I improve the performance of my Azure web app?"</li><li>"@azure Diagnose high CPU usage in Azure App Service."</li><li>"@azure Show me how to detect slow performance issues in my App Service web app."</li><li>"@azure Investigate high CPU usage for App Service."</li><li>"@azure What's causing latency in my Azure web app?"</li><li>"@azure Can you help me diagnose high CPU usage in Azure App Service?"</li><li>"@azure Why am I seeing high memory usage in App Service?"</li><li>"@azure Help me analyze my web app downtime."</li><li>"@azure Help me diagnose slow performance in my Azure web app."</li><li>"@azure Help me collect a memory dump from Azure App Service."</li><li>"@azure My App Service container won't start."</li><li>"@azure Is there anything wrong with my bakery-api web app?"</li><li>"@azure Look into if my web app is having any downtime."</li><li>"@azure Troubleshoot why my web app is not responding."</li></ul>|
|Azure Developer CLI (`azd`)|<ul><li>"@azure I'm getting this error. What does it mean?"</li></ul>|
|Azure SDK|<ul><li>"@azure The npm Azure Resource Manager SDK is failing to install. What should I do?"</li></ul>|
|Azure Event Hubs|<ul><li>"@azure My application needs help with processing real-time events."</li></ul>|
|Azure OpenAI Service|<ul><li>"@azure What is using up my GPT4o model quota?"</li></ul>|
|Azure SignalR Service|<ul><li>"@azure My SignalR client is not receiving messages. Why?"</li><li>"@azure Why are my SignalR clients being disconnected so often?"</li><li>"@azure Where can I find metrics and logs for my SignalR app?"</li></ul>|
|Azure Storage|<ul><li>"@azure Can you help me choose the right Azure storage solution?"</li><li>"@azure What are some ways to secure my Azure storage account?"</li><li>"@azure I got an error 403, unauthorized blob listing."</li></ul>|
|Azure Web PubSub|<ul><li>"@azure My Web PubSub client is not receiving messages. Why?"</li></ul>|

## Related content

- [Understand what GitHub Copilot for Azure Preview is and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure Preview in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).

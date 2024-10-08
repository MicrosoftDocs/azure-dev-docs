---
title: GitHub Copilot for Azure Preview prompt engineering examples for troubleshooting your application
description: This article provides example prompts that can be used to help troubleshoot your application in the cloud.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: best-practice
ms.date: 09/03/2024
ms.collection: ce-skilling-ai-copilot
---

# Best practices for troubleshooting your application with GitHub Copilot for Azure Preview

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


## Use Copilots responsibly

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
|Azure Container Service (ACA)|<ul><li>"@azure My Container App won't start."</li><li>"@azure My users are reporting errors with my foobar container app."</li><li>"@azure Can you look at my energy-api-1 container app's logs for any 404 errors?"</li><li>"@azure Has my container app's system console logs contained any warnings recently?"</li></ul>|
|Azure Kubernetes Service (AKS)|<ul><li>"@azure Help me troubleshoot my AKS cluster."</li><li>"@azure How do I troubleshoot my Azure Kubernetes Service (AKS)?"</li><li>"@azure How can I get the logs of a specific pod?"</li><li>"@azure Do my kube-apiserver logs show the last time a restart occured?"</li><li>"@azure My assistant-orchestrator AKS cluster is having performance problems."</li><li>"@azure Find out why my store-service-prod kube cluster is running slow."</li><li>"@azure I'd like to investigate performance issues with my kube cluster."</li></ul>|
|Azure App Service|<ul><li>"@azure How can I improve my Azure web app's performance?"</li><li>"@azure How do I improve my app's CPU usage?"</li><li>"@azure How can I improve the performance of my Azure web app?"</li><li>"@azure Diagnose high CPU usage in my Azure App service."</li><li>"@azure Show me how to detect slow performance issues in my app service web app."</li><li>"@azure Investigate high CPU usage for my app service."</li><li>"@azure What's causing latency in my Azure Web App?"</li><li>"@azure Can you help me diagnose high CPU usage on my Azure app service?"</li><li>"@azure Why am I seeing high memory usage in my App Service?"</li><li>"@azure Help me analyze my web app downtime."</li><li>"@azure Help me diagnose slow performance in my Azure Web App."</li><li>"@azure Help me collect a memory dump from my Azure App Service."</li><li>"@azure My AppService container won't start."</li><li>"@azure Is there anything wrong with my bakery-api web app?"</li><li>"@azure Look into if my web app is having any downtime."</li><li>"@azure Troubleshoot why my web app is not responding."</li></ul>|
|Azure Developer CLI (AZD)|<ul><li>"@azure I'm getting this error, what does it mean?"</li></ul>|
|Azure SDK|<ul><li>"@azure Azure npm ARM sdk failing to install, what should I do?"</li></ul>|
|Azure Event Hubs|<ul><li>"@azure My application needs help processing real-time events."</li></ul>|
|Azure OpenAI|<ul><li>"@azure What is using up my GPT4o model quota?"</li></ul>|
|SignalR|<ul><li>"@azure My SignalR client is not receiving messages, why?"</li><li>"@azure Why are my SignalR clients being disconnected so often?"</li><li>"@azure Where can I find metrics and logs for my SignalR app?"</li></ul>|
|Azure Storage|<ul><li>"@azure Can you help me choose the right Azure storage solution?"</li><li>"@azure What are some ways to secure my Azure storage account?"</li><li>"@azure I got an error 403 unathorized blob listing."</li></ul>|
|Azure Web PubSub|<ul><li>"@azure My web pubsub client is not receiving messages, why?"</li></ul>|


## Related content

- [Understand what is GitHub Copilot for Azure Preview and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure Preview in your software development workflow. The quickstart instructs you to deploy services to Azure, monitor their status, and troubleshoot issues.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
---
title: GitHub Copilot for Azure Preview prompt engineering examples for optimizing your application
description: This article provides example prompts that can help you optimize your application in the cloud.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: best-practice
ms.date: 11/18/2024
ms.collection: ce-skilling-ai-copilot
---

# Example prompts for optimizing your application with GitHub Copilot for Azure Preview

If you're unfamiliar with Azure or you just want the tooling and AI to do most of the work, you can ask GitHub Copilot for Azure Preview to help you optimize the performance of your Azure resources. Use [best practices](introduction.md#best-practices) to achieve the best results.

## Example prompts to optimize your app

If you want to use GitHub Copilot for Azure Preview for help with optimizing your application, you can start with an open-ended question or request. Then, add details like specific services and technologies for better results. Try the following example prompts.

|Service|Optimize prompt examples|
|---|---|
|Azure App Service|<ul><li>"@azure Are any app code optimizations available?"</li><li>"@azure Show me how to optimize CPU usage for Azure App Service."</li><li>"@azure How do I optimize code for Azure App Service?"</li><li>"@azure What are the best practices for security in Azure?"</li></ul>|
|Azure SQL|<ul><li>"@azure How can I optimize my Azure SQL database for better performance?"</li></ul>|

## Prompts to evaluate AI models

The Online Experimentation GitHub Copilot extension plugin is a powerful tool designed to streamline the process of online A/B model evaluation for AI application developers. This plugin is part of a broader initiative to enhance the developer experience by integrating experimentation capabilities directly into the development workflow. 

This includes two components: 

- An experimentation copilot plugin for the @azure extension. This chatbot assists with experimentation, generates feature flag code and metric, helps evaluate and summarize experiment results, and more. 
- A GitHub action that can be invoked as part of the AI development workflow in GitHub to start experiments and refresh and link to experiment results. 

The goal of this project is to provide a seamless and efficient way for developers to conduct experiments and analyze results without leaving their development environment. It supports the creation and management of experiments and metrics, leveraging Azure services such as Azure App Config for configuration delivery and Azure AI for model monitoring metrics. 

The preview of this plugin includes a code-first user experience in partnership with Azure App Config, enabling streamlined evaluation and experimentation in GitHub. This includes out-of-the-box model monitoring metrics and custom metrics. The public preview will evolve this into a full streamline integration and easy-to-use user experience in both App Config and AI Studio. 

Azure AI evaluation is already publicly available, but if you are interested in trying out our online experimentation feature please [sign up for our preview](https://aka.ms/genAI-CI-CD-private-preview) to learn more. 

## Optimize code level performance

If you use Azure Monitor, you can perform code-level performance optimizations with GitHub Coplit for Azure. This feature is under development, so at this time a separate `@Code_Optimization` (instead of `@azure`) extension needs to be used for optimizing code-level performance. For details on installing and using Code Optimizations, see [Code Optimizations extensions for Visual Studio and Visual Studio Code (preview) - Azure Monitor](/azure/azure-monitor/insights/code-optimizations-extensions).

## Related content

- [Understand what GitHub Copilot for Azure Preview is and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure Preview in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [designing and developing applications for Azure](design-develop-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).

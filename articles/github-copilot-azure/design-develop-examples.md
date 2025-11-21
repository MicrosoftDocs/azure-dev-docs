---
title: GitHub Copilot for Azure prompt engineering examples for designing and developing your application
description: This article provides example prompts that can help you design and develop your application in the cloud.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: best-practice
ms.date: 5/30/2025
ms.collection: ce-skilling-ai-copilot
---

# Example prompts for designing and developing your application with GitHub Copilot for Azure

If you're unfamiliar with Azure or you just want the tooling and AI to do most of the work, you can ask GitHub Copilot for Azure and Azure MCP Server to help you deploy your application. Use [best practices](introduction.md#best-practices) to achieve the best results. Most importantly:

- Use "Agent" mode for the best experience. Avoid "Ask" mode.
- Include the word "Azure" in the prompt to help Copilot understand that it needs to call tools from the Azure MCP Server.
- If using Visual Studio Code, make sure you use "Configure Tools ..." and include both "Azure MCP" and "GitHub Copilot for Azure". [See the Tool calling section's Visual Studio Code tab](introduction.md#tool-calling) for more details.

## Example prompts to create an entire sample app

If you want to use GitHub Copilot for Azure for help with building your application, you can start with an open-ended question or request. Then, add details like specific programming languages, frameworks, services and technologies for better results. Try the following example prompts.

- "Could you help me create and deploy a simple Flask website using Python on Azure?"
- "Can you help me build a Python RAG application on Azure?"

## Prompts to design APIs

You can now leverage GitHub Copilot for Azure for a variety of API-related tasks which utilizes the Azure API Center plugin: 

- **Generating API Specifications**: Describe your requirements in natural language, and GitHub Copilot for Azure will create new API specifications tailored to your needs. It can also help you register these APIs into the API Center swiftly. 
- **Designing Compliant APIs**: Design API specifications that comply with API Center governance. The AI assistance ensures that your APIs are designed according to best practices and standards.

Examples:

- "Generate an OpenAPI spec for an Azure API that accepts purchase orders for specialized coffee beans."
- "Generate an OpenAPI spec for an Azure API to handle customized pizza delivery orders for our pizza company."

## Related content

- [Understand what GitHub Copilot for Azure is and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-deploy-app-agent-mode.md) to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).

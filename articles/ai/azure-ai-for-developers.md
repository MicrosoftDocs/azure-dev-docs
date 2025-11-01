---
title: Overview of AI app development
description: Overview article introducing the resources available in this content area, and how to get started integrating generative AI into applications.
keywords: ai, azure openai service
ms.service: azure
ms.topic: overview
ms.date: 10/31/2025
ms.custom: overview, devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python, build-2024-intelligent-apps
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
---

# Overview of AI app development

This documentation is designed for experienced developers who are new to building generative AI apps on Azure using Azure Services and their favorite programming language.

## Introduction to generative AI for developers

Generative AI opens many new possibilities for applications. As a developer, it's important that you develop a mental model that maps how all the new terminology and technologies related to generative AI fit into what you already understand. The following series of articles show you how your current development experience applies to generative AI. 

* [Introduction to developing generative AI apps for experienced developers](./introduction-build-generative-ai-solutions.md)
* [Important concepts and considerations for developers building generative AI solutions](./gen-ai-concepts-considerations-developers.md)
* [Augmenting a Large Language Model with Retrieval-Augmented Generation and Fine-tuning](./augment-llm-rag-fine-tuning.md)
* [Building advanced Retrieval-Augmented Generation systems](./advanced-retrieval-augmented-generation.md)

## AI app design

Designing AI applications involves understanding user needs, selecting appropriate AI models, and integrating them effectively into your app architecture. The following resources provide guidance on best practices for designing AI-powered applications.

* [AI agent orchestration patterns](/azure/architecture/ai-ml/guide/ai-agent-design-patterns?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
* [Design your AI app to support foundation model life cycles](/azure/architecture/ai-ml/guide/manage-foundation-models-lifecycle?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)

## AI app templates

AI app templates provide you with well-maintained, easy to deploy reference samples that provide a high-quality starting point for your AI apps.

There are two categories of AI app templates, **building blocks** and **end-to-end solutions**. Building blocks are smaller-scale samples that focus on specific scenarios and tasks. End-to-end solutions are comprehensive reference samples including documentation, source code, and deployment to allow you to take and extend for your own purposes.

To review a list of key templates available for each programming language, see [AI app templates](/azure/developer/ai/intelligent-app-templates). To browse all available templates, see the AI app templates on the [AI App Template gallery](https://azure.github.io/ai-app-templates/?tags=azureopenai).

One of the most popular templates is the chat with your data sample using Azure OpenAI and Azure AI Search.

# [.NET](#tab/dotnet)

* [Get started with the chat using your own data sample for .NET](/dotnet/ai/get-started-app-chat-template?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
* [Source code](https://github.com/Azure-Samples/azure-search-openai-demo-csharp)

# [Java](#tab/java)

* [Get started with the chat using your own data sample for Java](/azure/developer/java/ai/get-started-app-chat-template?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
* [Source code](https://github.com/Azure-Samples/azure-search-openai-demo-java)
* [Video](https://aka.ms/azai/java/video)

# [Python](#tab/python)

* [Get started with the chat using your own data sample for Python](/azure/developer/python/get-started-app-chat-template?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
* [Source code](https://github.com/Azure-Samples/azure-search-openai-demo)

# [JavaScript](#tab/javascript)

* [Get started with the chat using your own data sample for JavaScript](/azure/developer/javascript/get-started-app-chat-template?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
* [Source code](https://github.com/Azure-Samples/azure-search-openai-javascript)
* [Video (JavaScript frontend and Python backend)](https://aka.ms/azai/js.py/video)

---

## Agents and Model Context Protocol (MCP)

For developers interested in building more advanced AI applications, including agents that can interact with various services and APIs, we provide comprehensive resources and templates.

* [Build Agents using Model Context Protocol on Azure](./intro-agents-mcp.md) - Learn how to build intelligent agents that can perform complex tasks by using the Model Context Protocol (MCP) on Azure.
* [Build a TypeScript MCP server using Azure Container Apps servers](./build-mcp-server-ts.md) - A step-by-step guide to creating a TypeScript-based MCP server hosted on Azure Container Apps
* [Create OpenAI-powered agents using MCP](./build-openai-mcp-server-dotnet.md) - A tutorial on building OpenAI-powered agents using MCP with .NET.

## Authentication and security

Building AI applications requires strong authentication and security to protect data and meet regulations. The following articles explain how to secure your AI apps on Azure.

* [Security planning for LLM-based applications](/ai/playbook/technology-guidance/generative-ai/mlops-in-openai/security/security-plan-llm-application?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)

* [Use Azure OpenAI without keys](./keyless-connections.md) 

* [Use Azure AI Search without keys](/azure/search/keyless-connections?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)

## More resources by language

Each language overview page links to popular articles, samples, documentation and more specific to your preferred programming language or platform.

- [Python](../python/azure-ai-for-python-developers.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
- [JavaScript](../javascript/ai/azure-ai-for-javascript-developers.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
- [Java](../java/ai/azure-ai-for-java-developers.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
- [.NET](/dotnet/ai/azure-ai-for-dotnet-developers?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)

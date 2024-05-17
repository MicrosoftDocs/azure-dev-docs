---
title: Overview of AI app development
description: Overview article introducing the resources available in this content area, and how to get started integrating generative AI into applications.
keywords: ai, azure openai service
ms.service: azure
ms.topic: overview
ms.date: 5/14/2024
ms.custom: overview, devx-track-dotnet, devx-track-extended-java, devx-track-go, devx-track-js, devx-track-python, build-2024-intelligent-apps
---

# Overview of AI app development

This documentation is designed for experienced developers who are new to building generative AI apps on Azure using Azure OpenAI Services and their favorite programming language.

## Introduction to generative AI for developers

These articles provide an overview of some foundational concepts relevant to building applications that use generative AI.

|Article|Description|
|---|---|
|[Introduction to developing generative AI apps for experienced developers](./introduction-build-generative-ai-solutions.md)|Explores the developers role in integrating generative AI into applications, exploring its business benefits, operational fundamentals, and the potential of large language models (LLMs).|
|[Important concepts and considerations for developers building generative AI solutions](./gen-ai-concepts-considerations-developers.md)|Explains the limitations of LLMs and where LLMs get their information, how tokenization works and impacts results, and how to get the best results by modifying prompts, implementing an inference pipeline and tweaking optional API call parameters.|
|[Augmenting a Large Language Model with Retrieval-Augmented Generation and Fine-tuning](./augment-llm-rag-fine-tuning.md)|Details the two mechanisms that developers can use to augment the information LLMs use to compose their models: retrieval-augmented generation and fine-tuning.|
|[Building advanced Retrieval-Augmented Generation systems](./advanced-retrieval-augmented-generation.md)|Discusses real-world considerations and patterns for RAG-based chat systems.|

## AI app templates

There are many AI app templates that provide you with well-maintained, easy to deploy reference implementations that help to ensure a high-quality starting point for your AI apps. These templates include building blocks (smaller-scale samples that focus on specific scenarios and tasks) and complete end-to-end solutions for each programming language. For a list of the available templates, see [AI app templates](./intelligent-app-templates.md).

One of the most popular templates is the enterprise chat sample using RAG.

# [.NET](#tab/dotnet)

|Article|Description|
|---|---|
|[Get started with the .NET enterprise chat sample](/dotnet/ai/get-started-app-chat-template?tabs=github-codespaces)|This article introduces the .NET enterprise chat app sample and guides you through the basics of deploying and using the app.|
|[Source code](https://github.com/Azure-Samples/azure-search-openai-demo-csharp)|This GitHub repository contains the source code for the sample and more details about the sample architecture, deployment options, and how to start extending the sample to your own production app.|
|[Video](https://aka.ms/azai/net/video)|This video provides an overview and demo of the enterprise chat app sample.|

# [Java](#tab/java)

|Article|Description|
|---|---|
|[Get started with the Java enterprise chat sample](/azure/developer/java/ai/get-started-app-chat-template?tabs=github-codespaces)|This article introduces the Java enterprise chat app sample and guides you through the basics of deploying and using the app.|
|[Source code](https://github.com/Azure-Samples/azure-search-openai-demo-java)|This GitHub repository contains the source code for the sample and more details about the sample architecture, deployment options, and how to start extending the sample to your own production app.|
|[Video](https://aka.ms/azai/java/video)|This video provides an overview and demo of the enterprise chat app sample.|

# [Python](#tab/python)

|Article|Description|
|---|---|
|[Get started with the Python enterprise chat sample](/azure/developer/python/get-started-app-chat-template?tabs=github-codespaces)|This article introduces the Python enterprise chat app sample and guides you through the basics of deploying and using the app.|
|[Source code](https://github.com/Azure-Samples/azure-search-openai-demo)|This GitHub repository contains the source code for the sample and more details about the sample architecture, deployment options, and how to start extending the sample to your own production app.|
|[Video](https://aka.ms/azai/py/video)|This video provides an overview and demo of the enterprise chat app sample.|

# [JavaScript](#tab/javascript)

|Article|Description|
|---|---|
|[Get started with the JavaScript enterprise chat sample](/azure/developer/javascript/get-started-app-chat-template?tabs=github-codespaces)|This article introduces the JavaScript  enterprise chat app sample and guides you through the basics of deploying and using the app.|
|[Source code](https://github.com/Azure-Samples/azure-search-openai-javascript)|This GitHub repository contains the source code for the sample and more details about the sample architecture, deployment options, and how to start extending the sample to your own production app.|
|[Video (full stack)](https://aka.ms/azai/js/video)|This video provides an overview and demo of the enterprise chat app sample.|
|[Video (JavaScript frontend and Python backend)](https://aka.ms/azai/js.py/video)|This video provides an overview and demo of the enterprise chat app sample with a JavaScript frontend and Python backend.|

---

## Additional resources by language

Each language overview page links to popular articles, samples, documentation and more specific to your preferred programming language or platform.

- [Python](../python/azure-ai-for-python-developers.md?&toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
- [JavaScript](../javascript/azure-ai-for-javascript-developers.md?&toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
- [Java](../java/ai/azure-ai-for-java-developers.md?&toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
- [.NET](/dotnet/ai/azure-ai-for-dotnet-developers?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)

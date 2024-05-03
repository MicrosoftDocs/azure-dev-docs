---
title: Azure AI reference templates
description: This article describes the reference templates provided as GitHub repositories to build and deploy intelligent applications on Azure.
keywords: ai, azure openai service
ms.service: azure
ms.topic: overview
ms.date: 05/03/2024
ms.custom: overview, devx-track-dotnet, devx-track-extended-java, devx-track-go, devx-track-js, devx-track-python
---

# Azure AI reference templates

The reference templates are complete end-to-end solutions including documention, source code, and deployment to allow you to take and extend for your own purposes. Use the following table to find a reference template. 



Language|Name|Description|
|--|--|--|
|.NET|[Contoso Chat Retail copilot with .NET and Semantic Kernel](https://github.com/Azure-Samples/chat-rag-openai-csharp-prompty)|A customer sales and support chat solution with rag. |
|.NET|[Process Automation: Speech to Text and Summarization with .NET and GPT 3.5 Turbo]()|This solution converts speech to text and then processes and summarizes the text based on the prompt scenario.|

|JavaScript|[Web Frontend UI for AI Integration]()|A web chat UI interface that can be used with any of the api llm backend solutions.|


|Python|[Multi-Modal Creative Writing copilot with Dalle]()|A creative writing multi-agent solution to help users write articles.|
|Python|[Contoso Chat Retail copilot with AI Studio]()|A customer sales and support chat solution with rag.|
|Python|[Process Automation: Speech to Text and Summarization with AI Studio]()|Python|This solution is a process automation solution which converts speech to text and provides summarization with Azure AI Studio.|
|Python|[Function Calling with Prompty, LangChain and Elastic Search]()|Function calling for vector database lookup based on user question.|
|Python|[Function Calling with Prompty, LangChain and Pinecone]()|Function calling for vector database lookup based on user question|
|Python|[Assistant API Analytics Copilot with Python and Azure AI Studio]()|Assistant API to chat with tabular data and perform analytics in natural language.|


## Multi-Modal Creative Writing copilot with Dalle

This python [reference template](https://github.com/Azure-Samples/agent-openai-python-prompty) is a 
creative writing multi-agent solution to help users write articles.

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Container registery<br>Azure Kubernetes<br>|Azure OpenAI<br>Bing Search<br>Azure Managed Identity<br>Azure Monitor<br>Azure AI Search<br>Azure AI Studio|GPT 3.5 Turbo<br>GPT 4.0<br>Dalle|

## Contoso Chat Retail copilot with .NET and Semantic Kernel

This .NET [reference template](https://github.com/Azure-Samples/agent-openai-python-prompty) is a customer sales and support chat solution with rag.

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Container Apps<br>|Azure OpenAI<br>Microsoft Entra ID<br>Azure Managed Identity<br>Azure Monitor<br>Azure AI Search<br>Azure AI Studio<br>Azure SQL<br>Azure Storage|GPT 3.5 Turbo<br>GPT 4.0|

## Contoso Chat Retail copilot with AI Studio

This python [reference template](https://github.com/Azure-Samples/contoso-chat) is a customer sales and support chat solution with rag. Learn to build an Large Language Model (LLM) Application with a RAG (Retrieval Augmented Generation) architecture using Azure AI Studio and Prompt Flow.

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Container Apps<br>|Azure OpenAI<br>Azure AI Search<br>Azure AI Studio<br>Azure Cosmos DB|GPT 3.5 Turbo<br>GPT 4.0<br>MIR|

## Process Automation with Speech to Text and Summarization with AI Studio

This python [reference template](https://github.com/Azure-Samples/summarization-openai-python-prompflow) is a process automation solution which converts speech to text and provides summarization with Azure AI Studio.

|Azure Hosting|Technologies|AI Models|
|--|--|--|
||Azure AI Studio<br>Speech to Text Service<br>Prompt Flow<br>MIR|GPT 3.5 Turbo|

## Process Automation: Speech to Text and Summarization with .NET and GPT 3.5 Turbo


This .NET [reference template](https://github.com/Azure-Samples/summarization-openai-csharp-prompty) is a process automation solution which converts speech to text and then processes and summarizes the text based on the prompt scenario.

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Container Apps|Speech to Text<br>Summarization<br>Azure OpenAI|GPT 3.5 Turbo|


## Function Calling with Prompty, LangChain and Elastic Search

This python [reference template](https://github.com/Azure-Samples/agent-python-openai-prompty-langchain) is

|Azure Hosting|Technologies|AI Models|
|--|--|--|
||Azure AI Studio<br>Elastic Search<br>Microsoft Entra ID<br>Azure Managed Identity<br>Azure Monitor<br>Azure Storage<br>Azure AI Studio<br>MIR|GPT 3.5 Turbo|

## Function Calling with Prompty, LangChain and Pinecone

This python [reference template](https://github.com/Azure-Samples/agent-openai-python-prompty-langchain-pinecone) is

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Container Apps|Pinecone<br>Microsoft Entra ID<br>Microsoft Managed Identity<br>Azure Monitor<br>Azure Storage|GPT 3.5 Turbo|

## Assistant API Analytics Copilot with Python and Azure AI Studio

This python [reference template](https://github.com/Azure-Samples/assistant-data-openai-python-promptflow) is an Assistant API to chat with tabular data and perform analytics in natural language.

|Azure Hosting|Technologies|AI Models|
|--|--|--|
||Azure AI Search<br>Azure AI Studio<br>MIR<br>Azure OpenAI|GPT 3.5 Turbo<br>GPT 4|

## Web Frontend UI for AI Integration

This JavaScript [reference template](https://github.com/Azure-Samples/web-openai-swa-frontend) is 

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Static Web Apps|||

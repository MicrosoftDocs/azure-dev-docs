---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

## Enterprise chat with .NET

This .NET [reference template](https://github.com/Azure-Samples/azure-search-openai-demo-csharp) is a complete end-to-end solution demonstrating the Retrieval-Augmented Generation (RAG) pattern running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-chat-dotnet.png" lightbox="../media/intelligent-app-templates/architecture-diagram-chat-dotnet.png" alt-text="Screenshot of chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::
   :::column-end:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-chat-dotnet.png" lightbox="../media/intelligent-app-templates/browser-app-chat-dotnet.png" alt-text="Diagram showing architecture from client to backend app":::
   :::column-end:::
:::row-end:::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Container Apps<br>Azure Functions|Azure OpenAI<br>Azure Computer Vision<br>Azure Form Recognizer<br>Azure AI Search<br>Azure Storage|GPT 3.5 Turbo<br>GPT 4.0|


## Contoso Chat Retail copilot with .NET and Semantic Kernel

This .NET [reference template](https://github.com/Azure-Samples/contoso-chat-csharp-prompty), we present Contoso Outdoors, a conceptual store specializing in outdoor gear for hiking and camping enthusiasts. This virtual store enhances customer engagement and sales support through an intelligent chat agent. This agent is powered by the Retrieval Augmented Generation (RAG) pattern within the Microsoft Azure AI Stack, enriched with Semantic Kernel and Prompty support.

:::row:::
   :::column span="":::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-contoso-chat-csharp-prompty-dotnet.png" lightbox="../media/intelligent-app-templates/architecture-diagram-contoso-chat-csharp-prompty-dotnet.png" alt-text="Screenshot of .NET hiking and camping enthusiast store.":::
   :::column-end:::
   :::column span="":::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-contoso-chat-csharp-prompty-dotnet.png" source="../media/intelligent-app-templates/browser-app-contoso-chat-csharp-prompty-dotnet.png" alt-text="Diagram showing architecture from client to backend app":::
   :::column-end:::
:::row-end:::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Container Apps<br>|Azure OpenAI<br>Microsoft Entra ID<br>Azure Managed Identity<br>Azure Monitor<br>Azure AI Search<br>Azure AI Studio<br>Azure SQL<br>Azure Storage|GPT 3.5 Turbo<br>GPT 4.0|


## Process Automation: Speech to Text and Summarization with .NET and GPT 3.5 Turbo


This .NET [reference template](https://github.com/Azure-Samples/summarization-openai-csharp-prompty) is a process automation solution which converts speech to text and then processes and summarizes the text based on the prompt scenario.

:::row:::
   :::column span="":::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-summarization-dotnet.png" lightbox="../media/intelligent-app-templates/architecture-diagram-summarization-dotnet.png" alt-text="Screenshot of .NET hiking and camping enthusiast store.":::
   :::column-end:::
   :::column span="":::
     
   :::column-end:::
:::row-end:::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Container Apps|Speech to Text<br>Summarization<br>Azure OpenAI|GPT 3.5 Turbo|

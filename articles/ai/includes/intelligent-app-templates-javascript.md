---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

### Enterprise chat with JavaScript

This JavaScript [reference template](https://github.com/azure-samples/azure-search-openai-javascript) is a complete end-to-end solution demonstrating the Retrieval-Augmented Generation (RAG) pattern running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-chat-javascript.png" lightbox="../media/intelligent-app-templates/architecture-diagram-chat-javascript.png" alt-text="Diagram showing architecture from client to backend app.":::
   :::column-end:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-chat-javascript.png" lightbox="../media/intelligent-app-templates/browser-app-chat-javascript.png" alt-text="Screenshot of chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::
   :::column-end:::
:::row-end:::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Container Apps<br>Azure Static Web Apps|Azure OpenAI<br>Azure AI Search<br>Azure Storage<br>Azure Monitor|text-embedding-ada-002|


### Azure OpenAI Chat Frontend

This JavaScript [reference template](https://github.com/Azure-Samples/azure-openai-chat-frontend) is a minimal OpenAI chat web component to hook as a client to any backend implementation.

:::image source="../media/intelligent-app-templates/chat-frontend-javascript-video.gif" alt-text="Video demonstrating JavaScript chat frontend application.":::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Static Web Apps|Azure AI Search<br>Azure OpenAI|GPT 3.5 Turbo<br>GPT4|

### Serverless AI Chat with RAG using LangChain.js

This JavaScript [reference template](https://github.com/Azure-Samples/serverless-chat-langchainjs) is a serverless AI chatbot with Retrieval-Augmented Generation using LangChain.js and Azure that uses a set of enterprise documents to generate responses to user queries. We use a fictitious company called Contoso Real Estate, and the experience allows its customers to ask support questions about the usage of its products. The sample data includes a set of documents that describes its terms of service, privacy policy and a support guide.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-chat-serverless-langchainjs-javascript.png" lightbox="../media/intelligent-app-templates/architecture-diagram-chat-serverless-langchainjs-javascript.png" alt-text="Diagram showing architecture for serverless API using LangChainjs to integrate with Azure OpenAI Service and Azure AI Search.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Static Web Apps|Azure AI Search<br>Azure OpenAI|GPT 3.5 Turbo<br>GPT4|

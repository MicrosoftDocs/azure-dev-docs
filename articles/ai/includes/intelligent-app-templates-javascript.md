---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.service: azure
---

### Enterprise chat with JavaScript

This template is a complete end-to-end solution demonstrating the Retrieval-Augmented Generation (RAG) pattern running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences.

To get started with this template, see [Get started with the JavaScript enterprise chat sample using RAG](../../javascript/get-started-app-chat-template.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json). To access the source code and read in-depth details about the template, see the [azure-search-openai-javascript](https://github.com/azure-samples/azure-search-openai-javascript) GitHub repo.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-chat-javascript.png" lightbox="../media/intelligent-app-templates/architecture-diagram-chat-javascript.png" alt-text="Diagram showing architecture from client to backend app.":::
   :::column-end:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-chat-javascript.png" lightbox="../media/intelligent-app-templates/browser-app-chat-javascript.png" alt-text="Screenshot of chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Azure Container Apps<br>Azure Static Web Apps|Azure OpenAI<br>Azure AI Search<br>Azure Storage<br>Azure Monitor|text-embedding-ada-002|


### Azure OpenAI chat frontend

This template is a minimal OpenAI chat web component that can be hooked to any backend implementation as a client.

To access the source code and read in-depth details about the template, see the [azure-openai-chat-frontend](https://github.com/Azure-Samples/azure-openai-chat-frontend) GitHub repo.

:::image source="../media/intelligent-app-templates/chat-frontend-javascript-video.gif" alt-text="Video demonstrating JavaScript chat frontend application.":::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Azure Static Web Apps|Azure AI Search<br>Azure OpenAI|GPT 3.5 Turbo<br>GPT4|


### Serverless AI chat with RAG using LangChain.js

The template is a serverless AI chatbot with Retrieval Augmented Generation using LangChain.js and Azure that uses a set of enterprise documents to generate responses to user queries. It uses a fictitious company called Contoso Real Estate, and the experience allows its customers to ask support questions about the usage of its products. The sample data includes a set of documents that describes its terms of service, privacy policy and a support guide.

To learn how to deploy and run this template, see [Get started with Serverless AI Chat with RAG using LangChain.js](../../javascript/get-started-app-chat-template-langchainjs.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json). To access the source code and read in-depth details about the template, see the [serverless-chat-langchainjs](https://github.com/Azure-Samples/serverless-chat-langchainjs) GitHub repo.

Learn [how to deploy and run](../../javascript/get-started-app-chat-template-langchainjs.md)
this JavaScript [reference template](). 

:::row:::
   :::column:::
      :::image type="content" source="../../javascript/media/get-started-app-chat-langchainjs/simple-architecture-diagram.png" lightbox="../../javascript/media/get-started-app-chat-langchainjs/simple-architecture-diagram.png" alt-text="Diagram showing architecture for serverless API using LangChainjs to integrate with Azure OpenAI Service and Azure AI Search.":::
   :::column-end:::
   :::column:::
      :::image type="content" source="../../javascript/media/get-started-app-chat-langchainjs/demo.gif" lightbox="../../javascript/media/get-started-app-chat-langchainjs/demo.gif" alt-text="Browser video of demonstration of JavaScript chat app using RAG and Langchain.js":::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Azure Static Web Apps<br>Azure Functions|Azure AI Search<br>Azure OpenAI<br>Azure Cosmos DB<br>Azure Storage<br>Azure Managed Identity|GPT4<br>Mistral<br>Ollama|

<!--

### Assistant API with Function Calling

Learn [how to deploy and run](../../javascript/get-started-app-chat-assistants-function-calling.md) this JavaScript [reference template](https://github.com/Azure-Samples/azure-openai-assistant-javascript). This application is a serverless Azure OpenAI Assistant Quick Start which implements an assistants app using JavaScript, Azure OpenAI Service assistants with function calling, and Azure Functions to get the latest stock price.

https://review.learn.microsoft.com/en-us/azure/developer/javascript/media/get-started-app-chat-assistants-function-calling/azure-openai-assistant-diagram.png

:::row:::
   :::column:::
      :::image type="content" source="../../javascript/media/get-started-app-chat-assistants-function-calling/azure-openai-assistant-diagram.png" lightbox="../../javascript/media/get-started-app-chat-assistants-function-calling/azure-openai-assistant-diagram.png" alt-text="Diagram showing architecture for assistants API using LangChainjs to integrate with Azure OpenAI Service.":::
   :::column-end:::
   :::column:::
      :::image type="content" source="../../javascript/media/get-started-app-chat-langchainjs/demo.gif" lightbox="../../javascript/media/get-started-app-chat-langchainjs/demo.gif" alt-text="Browser image of demonstration of JavaScript assistants chat app.":::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Azure Static Web Apps<br>Azure Functions|Azure OpenAI<br>Azure Managed Identity|GPT 3.5 Turbo|

-->
---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.service: azure
---


### Enterprise chat with Java

This template is a complete end-to-end solution demonstrating the Retrieval-Augmented Generation (RAG) pattern running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences. This sample supports different architectural styles. It can be deployed as standalone app on top of Azure App Service or as a microservice event driven architecture with web frontend, AI orchestration and document ingestion apps hosted by Azure Container Apps or Azure Kubernetes Service.

To get started with this template, see [Get started with the Java enterprise chat sample using RAG](../../java/ai/get-started-app-chat-template.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json). To access the source code and read in-depth details about the template, see the [azure-search-openai-demo-java](https://github.com/Azure-Samples/azure-search-openai-demo-java) GitHub repo.


:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-chat-java.png" lightbox="../media/intelligent-app-templates/architecture-diagram-chat-java.png" alt-text="Diagram showing architecture from client to backend app in Java.":::
   :::column-end:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-chat-java.png" lightbox="../media/intelligent-app-templates/browser-app-chat-java.png" alt-text="Screenshot of Java chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Azure App Service<br>Azure Container Apps<br>Azure Kubernetes Service|Azure OpenAI<br>Azure AI Search<br>Azure Storage<br>Azure Monitor||
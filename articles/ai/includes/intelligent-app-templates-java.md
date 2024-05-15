---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---


### Enterprise chat with Java

This Java[reference template](https://github.com/Azure-Samples/azure-search-openai-demo-java) is a complete end-to-end solution demonstrating the Retrieval-Augmented Generation (RAG) pattern running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences.

This sample supports different architectural styles. It can be deployed as standalone app on top of Azure App Service or as a microservice event driven architecture with web frontend, AI orchestration and document ingestion apps hosted by Azure Container Apps or Azure Kubernetes Service.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-chat-java.png" lightbox="../media/intelligent-app-templates/architecture-diagram-chat-java.png" alt-text="Diagram showing architecture from client to backend app in Java.":::
   :::column-end:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-chat-java.png" lightbox="../media/intelligent-app-templates/browser-app-chat-java.png" alt-text="Screenshot of Java chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::
   :::column-end:::
:::row-end:::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure App Service<br>Azure Container Apps<br>Azure Kubernetes Service|Azure OpenAI<br>Azure AI Search<br>Azure Storage<br>Azure Monitor||
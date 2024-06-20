---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.service: azure
---


### Chat with your data using Azure OpenAI and Azure AI Search with Java

This template is a complete end-to-end solution that demonstrates the Retrieval-Augmented Generation (RAG) pattern running in Azure. It uses Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences.

To get started with this template, see [Get started with the chat using your own data sample for Java](../../java/ai/get-started-app-chat-template.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json). To access the source code and read in-depth details about the template, see the [azure-search-openai-demo-java](https://github.com/Azure-Samples/azure-search-openai-demo-java) GitHub repo.


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
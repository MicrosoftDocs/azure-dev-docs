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
|Azure App Service<br>Azure Container Apps<br>Azure Kubernetes Service|Azure OpenAI<br>Azure AI Search<br>Azure Document Intelligence<br>Azure Storage<br>Azure App Insights<br> Azure Service Bus<br> Azure Event Grid|gpt-35-turbo|

### Multi Agents Banking Assistant with Java and Semantic Kernel

This project is designed as a Proof of Concept (PoC) to explore the innovative realm of generative AI within the context of multi-agent architectures. By leveraging Java and Microsoft Semantic Kernel AI orchestration framework, our aim is to build a chat web app to demonstrate the feasibility and reliability of using generative AI agents to transform user experience from web clicks to natural language conversations while maximizing reuse of the existing workload data and APIs.
The core use case revolves around a banking personal assistant designed to revolutionize the way users interact with their bank account information, transaction history, and payment functionalities. Utilizing the power of generative AI within a multi-agent architecture, this assistant aims to provide a seamless, conversational interface through which users can effortlessly access and manage their financial data.

Invoices samples are included in the data folder to make it easy to explore payments feature. The payment agent equipped with OCR tools ( Azure Document Intelligence) will lead the conversation with the user to extract the invoice data and initiate the payment process. Other account fake data as transactions, payment methods and account balance are also available to be queried by the user. All data and services are exposed as external REST APIs and consumed by the agents to provide the user with the requested information.

To access the source code and read in-depth details about the template, see the [agent-openai-java-banking-assistant](https://github.com/Azure-Samples/agent-openai-java-banking-assistant) GitHub repo.


:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-agent-java.png" lightbox="../media/intelligent-app-templates/architecture-diagram-chat-java.png" alt-text="Diagram showing architecture from client to backend app in Java.":::
   :::column-end:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-agent-java.png" lightbox="../media/intelligent-app-templates/browser-app-chat-java.png" alt-text="Screenshot of Java chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Azure Container Apps|Azure OpenAI<br>Azure Document Intelligence<br>Azure Storage<br>Azure Monitor|gpt-4o<br>gpt-4o-mini|

---
ms.custom: overview
ms.topic: include
ms.date: 5/16/2024
ms.service: azure
---

### Chat with your data using Azure OpenAI and Azure AI Search with Python

This template is a complete end-to-end solution demonstrating the Retrieval-Augmented Generation (RAG) pattern running in Azure. It uses Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Question and Answer (Q&A) experiences.

To get started with this template, see [Get started with the chat using your own data sample for Python](../../python/get-started-app-chat-template.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json). To access the source code and read in-depth details about the template, see the [azure-search-openai-demo](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repo.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-chat-python.png" lightbox="../media/intelligent-app-templates/architecture-diagram-chat-python.png" alt-text="Screenshot of chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::
   :::column-end:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-chat-python.png" lightbox="../media/intelligent-app-templates/browser-app-chat-python.png" alt-text="Diagram showing architecture from client to backend app":::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
| Azure Container Apps | Azure OpenAI<br>Azure AI Search<br>Azure Blob Storage<br>Azure Monitor<br>Azure Document Intelligence<br> | GPT 3.5 Turbo<br>GPT 4<br>GPT 4o<br>GPT 4o-mini |

### Multi-Modal Creative Writing Copilot with DALL-E

This template is a creative writing multi-agent solution to help users write articles. It demonstrates how to create and work with AI agents driven by [Azure OpenAI](/azure/ai-services/openai/).

It includes:

1. A Flask app that takes an article and instruction from a user.
1. A research agent that uses the [Bing Search API](/bing/search-apis/bing-web-search) to research the article.
1. A product agent that uses [Azure AI Search](/azure/search/) to do a semantic similarity search for related products from a vector store.
1. A writer agent to combine the research and product information into a helpful article.
1. An editor agent to refine the article presented to the user.

To access the source code and read in-depth details about the template, see the [agent-openai-python-prompty](https://github.com/Azure-Samples/agent-openai-python-prompty) GitHub repo.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-agent-openai-prompty-python.png" lightbox="../media/intelligent-app-templates/architecture-diagram-agent-openai-prompty-python.png" alt-text="Architectural diagram of python multi-modal creative writing copilot application.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Azure Container Registry<br>Azure Kubernetes<br>|Azure OpenAI<br>Bing Search<br>Azure Managed Identity<br>Azure Monitor<br>Azure AI Search<br>Azure AI Studio|GPT 3.5 Turbo<br>GPT 4.0<br>DALL-E|

### Contoso Chat Retail Copilot with AI Studio

This template implements _Contoso Chat_ - a retail copilot solution for Contoso Outdoor that uses a _retrieval augmented generation_ design pattern to ground chatbot responses in the retailer's product and customer data. Customers can ask questions from the website in natural language, and get relevant responses with potential recommendations based on their purchase history - with responsible AI practices to ensure response quality and safety.

This template illustrates the end-to-end workflow (GenAIOps) for building a RAG-based copilot **code-first** with Azure AI and Prompty. By exploring and deploying this sample, learn to:

1. Ideate and iterate rapidly on app prototypes using [Prompty](https://prompty.ai)
1. Deploy and use [Azure OpenAI](/azure/ai-services/openai/concepts/models?tabs=python-secure%2Cglobal-standard%2Cstandard-chat-completions) models for chat, embeddings, and evaluation
1. Use Azure AI Search (indexes) and Azure Cosmos DB (databases) for your data
1. Evaluate chat responses for quality using AI-assisted evaluation flows
1. Host the application as a FastAPI endpoint deployed to Azure Container Apps
1. Provision and deploy the solution using the Azure Developer CLI
1. Support Responsible AI practices with content safety & assessments

To access the source code and read in-depth details about the template, see the [contoso-chat](https://github.com/Azure-Samples/contoso-chat) GitHub repo.

:::row:::
   :::column span="":::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-contoso-chat-python.png" lightbox="../media/intelligent-app-templates/architecture-diagram-contoso-chat-python.png" alt-text="Diagram showing architecture from client to backend app for hiking app.":::
   :::column-end:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-contoso-chat-retail-copilot-python.png" lightbox="../media/intelligent-app-templates/browser-app-contoso-chat-retail-copilot-python.png" alt-text="Screenshot of chat app with prompt flow in visual editor for Contoso chat retail copilot.":::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Azure Container Apps<br>|Azure OpenAI<br>Azure AI Search<br>Azure AI Studio<br>Prompty<br>Azure Cosmos DB|GPT 3.5 Turbo<br>GPT 4.0<br>Managed Integration Runtime (MIR)|

### Process automation with speech to text and summarization with AI Studio

This template creates a web-based app that allows workers at a company called Contoso Manufacturing to report issues via text or speech. Audio input is translated to text and then summarized to highlight important information and the report is sent to the appropriate department.

To access the source code and read in-depth details about the template, see the [summarization-openai-python-promptflow](https://github.com/Azure-Samples/summarization-openai-python-promptflow) GitHub repo.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-speech-to-text-summarization-python.png" lightbox="../media/intelligent-app-templates/architecture-diagram-speech-to-text-summarization-python.png" alt-text="Architectural diagram for process automation with speech-to-text and summarization with AI Studio for Python.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Azure Container Apps|Azure AI Studio<br>Speech to Text Service<br>Prompty<br>Managed Integration Runtime (MIR)|GPT 3.5 Turbo|

### Assistant API Analytics Copilot with Python and Azure AI Studio

This template is an Assistant API to chat with tabular data and perform analytics in natural language.

To access the source code and read in-depth details about the template, see the [assistant-data-openai-python-promptflow](https://github.com/Azure-Samples/assistant-data-openai-python-promptflow) GitHub repo.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-assistant-data-openai-promptflow-python.png" lightbox="../media/intelligent-app-templates/architecture-diagram-assistant-data-openai-promptflow-python.png" alt-text="Architectural diagram for an Assistant API to chat with tabular data and perform analytics in natural language.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Machine Learning service|Azure AI Search<br>Azure AI Studio<br>Managed Integration Runtime (MIR)<br>Azure OpenAI|GPT 3.5 Turbo<br>GPT 4|

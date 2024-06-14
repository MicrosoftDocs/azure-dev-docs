---
ms.custom: overview
ms.topic: include
ms.date: 5/16/2024
ms.service: azure
---

### Chat with your data using Azure OpenAI and Azure AI Search with Python

This template is a complete end-to-end solution demonstrating the Retrieval-Augmented Generation (RAG) pattern running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences.

To get started with this template, see [Get started with the chat using your own data sample for Python](../../python/get-started-app-chat-template.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json). To access the source code and read in-depth details about the template, see the [azure-search-openai-demo](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repo.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-chat-javascript.png" lightbox="../media/intelligent-app-templates/architecture-diagram-chat-javascript.png" alt-text="Screenshot of chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::
   :::column-end:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-chat-javascript.png" lightbox="../media/intelligent-app-templates/browser-app-chat-javascript.png" alt-text="Diagram showing architecture from client to backend app":::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
| Azure App Service | Azure OpenAI<br>Bing Search<br>Azure Managed Identity<br>Azure Monitor<br>Azure AI Search<br>Azure AI Studio | GPT 3.5 Turbo<br>GPT 4.0<br>DALL-E |


### Multi-Modal Creative Writing Copilot with DALL-E

This template is a creative writing multi-agent solution to help users write articles. It demonstrates how to create and work with AI agents driven by [Azure OpenAI](/azure/ai-services/openai/). It includes a Flask app that takes a topic and instruction from a user then calls a research agent that uses the [Bing Search API](/bing/search-apis/bing-web-search) to research the topic, a product agent that uses [Azure AI Search](/azure/search/) to do a semantic similarity search for related products from a vectore store, a writer agent to combine the research and product information into a helpful article, and an editor agent to refine the article that's finally presented to the user.

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
|Azure Container registery<br>Azure Kubernetes<br>|Azure OpenAI<br>Bing Search<br>Azure Managed Identity<br>Azure Monitor<br>Azure AI Search<br>Azure AI Studio|GPT 3.5 Turbo<br>GPT 4.0<br>DALL-E|


### Contoso Chat Retail Copilot with AI Studio

This template is a customer sales and support chat solution. It demonstrates how to build a Large Language Model (LLM) application with a RAG (Retrieval Augmented Generation) architecture using Azure AI Studio and Prompt Flow.

To access the source code and read in-depth details about the template, see the [contoso-chat](https://github.com/Azure-Samples/contoso-chat) GitHub repo.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-contoso-chat-retail-copilot-python.png" lightbox="../media/intelligent-app-templates/browser-app-contoso-chat-retail-copilot-python.png" alt-text="Screenshot of chat app with prompt flow in visual editor for Contoso chat retail copilot.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Azure Container Apps<br>|Azure OpenAI<br>Azure AI Search<br>Azure AI Studio<br>Azure Cosmos DB|GPT 3.5 Turbo<br>GPT 4.0<br>Managed Integration Runtime (MIR)|

### Process automation with speech to text and summarization with AI Studio

This template is a process automation solution that recieves issues reported by field and shop floor workers at a company called Contoso Manufacturing, a manufacturing company that makes car batteries. The issues are shared by the workers either live through microphone input, pre-recorded as audio files or as text input. The solution translates audio input from speech to text and then uses the text reports as input to an LLM and Prompty/Promptflow to summarize the issue and return the results in a format specified by the solution.

To access the source code and read in-depth details about the template, see the [summarization-openai-python-prompflow](https://github.com/Azure-Samples/summarization-openai-python-prompflow) GitHub repo.

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
|Azure Container Apps|Azure AI Studio<br>Speech to Text Service<br>Prompt Flow<br>Managed Integration Runtime (MIR)|GPT 3.5 Turbo|

### Function calling with Prompty, LangChain and Elastic Search

This template is an application that uses Prompty, Langchain, and Elasticsearch to build a large language model (LLM) search agent. This agent with Retrieval Augmented Generation (RAG) technology is capable of answering user questions based on the provided data by integrating real-time information retrieval with generative responses.

To access the source code and read in-depth details about the template, see the [agent-python-openai-prompty-langchain](https://github.com/Azure-Samples/agent-python-openai-prompty-langchain) GitHub repo.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-function-calling-prompty-langchain-elasticsearch-python.png" lightbox="../media/intelligent-app-templates/architecture-diagram-function-calling-prompty-langchain-elasticsearch-python.png" alt-text="Architectural diagram for an app using the Prompty tool, Langchain, and Elasticsearch to build a large language model (LLM) search agent with function calling for Python.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Machine Learning service|Azure AI Studio<br>Elastic Search<br>Microsoft Entra ID<br>Azure Managed Identity<br>Azure Monitor<br>Azure Storage<br>Azure AI Studio<br>Managed Integration Runtime (MIR)|GPT 3.5 Turbo|

### Function calling with Prompty, LangChain and Pinecone

This template utilizes the new Prompty tool, Langchain, and Pinecone to build a large language model (LLM) search agent. This agent with Retrieval Augmented Generation (RAG) technology is capable of answering user questions based on the provided data by integrating real-time information retrieval with generative responses.

To access the source code and read in-depth details about the template, see the [agent-openai-python-prompty-langchain-pinecone](https://github.com/Azure-Samples/agent-openai-python-prompty-langchain-pinecone) GitHub repo.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-agent-openai-prompty-langchain-pinecone-python.png" lightbox="../media/intelligent-app-templates/architecture-diagram-agent-openai-prompty-langchain-pinecone-python.png" alt-text="Architectural diagram for an OpenAI agent app using the Prompty, Langchain, and Pinecone with Python.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::

This template demonstrates the use of these features.

| Azure hosting solution | Technologies | AI models |
|--|--|--|
|Azure Container Apps|Pinecone<br>Microsoft Entra ID<br>Microsoft Managed Identity<br>Azure Monitor<br>Azure Storage|GPT 3.5 Turbo|

### Assistant API Analytics Copilot with Python and Azure AI Studio

This template is an Assistant API to chat with tabular data and perform analytics in natural language. To access the source code and read in-depth details about the template, see the [assistant-data-openai-python-promptflow](https://github.com/Azure-Samples/assistant-data-openai-python-promptflow) GitHub repo.

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

---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.service: azure
---

### Enterprise chat with Python

This python [reference template](https://github.com/Azure-Samples/azure-search-openai-demo) is a complete end-to-end solution demonstrating the Retrieval-Augmented Generation (RAG) pattern running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-chat-javascript.png" lightbox="../media/intelligent-app-templates/architecture-diagram-chat-javascript.png" alt-text="Screenshot of chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::
   :::column-end:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-chat-javascript.png" lightbox="../media/intelligent-app-templates/browser-app-chat-javascript.png" alt-text="Diagram showing architecture from client to backend app":::
   :::column-end:::
:::row-end:::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure App Service|Azure OpenAI<br>Bing Search<br>Azure Managed Identity<br>Azure Monitor<br>Azure AI Search<br>Azure AI Studio|GPT 3.5 Turbo<br>GPT 4.0<br>Dalle|


### Multi-Modal Creative Writing copilot with Dalle

This python [reference template](https://github.com/Azure-Samples/agent-openai-python-prompty) is a 
creative writing multi-agent solution to help users write articles.

This sample demonstrates how to create and work with AI agents driven by [Azure OpenAI](/azure/ai-services/openai/). It includes a Flask app that takes a topic and instruction from a user then calls a research agent that uses the [Bing Search API](/bing/search-apis/bing-web-search) to research the topic, a product agent that uses [Azure AI Search](/azure/search/) to do a semantic similarity search for related products from a vectore store, a writer agent to combine the research and product information into a helpful article, and an editor agent to refine the article that's finally presented to the user.


:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-agent-openai-prompty-python.png" lightbox="../media/intelligent-app-templates/architecture-diagram-agent-openai-prompty-python.png" alt-text="Architectural diagram of python multi-modal creative writing copilot application.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::




|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Container registery<br>Azure Kubernetes<br>|Azure OpenAI<br>Bing Search<br>Azure Managed Identity<br>Azure Monitor<br>Azure AI Search<br>Azure AI Studio|GPT 3.5 Turbo<br>GPT 4.0<br>Dalle|


### Contoso Chat Retail copilot with AI Studio

This python [reference template](https://github.com/Azure-Samples/contoso-chat) is a customer sales and support chat solution with rag. Learn to build an Large Language Model (LLM) Application with a RAG (Retrieval Augmented Generation) architecture using Azure AI Studio and Prompt Flow.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/browser-app-contoso-chat-retail-copilot-python.png" lightbox="../media/intelligent-app-templates/browser-app-contoso-chat-retail-copilot-python.png" alt-text="Screenshot of chat app with prompt flow in visual editor for Contoso chat retail copilot.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Container Apps<br>|Azure OpenAI<br>Azure AI Search<br>Azure AI Studio<br>Azure Cosmos DB|GPT 3.5 Turbo<br>GPT 4.0<br>Managed Integration Runtime (MIR)|

### Process Automation with Speech to Text and Summarization with AI Studio

This python [reference template](https://github.com/Azure-Samples/summarization-openai-python-prompflow) is a process automation solution which recieves issues reported by field and shop floor workers at a company called Contoso Manufacturing, a manufacturing company that makes car batteries. The issues are shared by the workers either live through microphone input, pre-recorded as audio files or as text input. We translate audio input from speech to text and then use the text reports as input to an LLM and Prompty/Promptflow to summarize the issue and return the results in a format we specify..

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-speech-to-text-summarization-python.png" lightbox="../media/intelligent-app-templates/architecture-diagram-speech-to-text-summarization-python.png" alt-text="Architectural diagram for process automation with speech-to-text and summarization with AI Studio for Python.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
||Azure AI Studio<br>Speech to Text Service<br>Prompt Flow<br>Managed Integration Runtime (MIR)|GPT 3.5 Turbo|

### Function Calling with Prompty, LangChain and Elastic Search

This python [reference template](https://github.com/Azure-Samples/agent-python-openai-prompty-langchain) is an application using Prompty, Langchain, and Elasticsearch to build a large language model (LLM) search agent. This agent with Retrieval-Augmented Generation (RAG) technology is is capable of answering user questions based on the provided data by integrating real-time information retrieval with generative responses.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-function-calling-prompty-langchain-elasticsearch-python.png" lightbox="../media/intelligent-app-templates/architecture-diagram-function-calling-prompty-langchain-elasticsearch-python.png" alt-text="Architectural diagram for an app using the Prompty tool, Langchain, and Elasticsearch to build a large language model (LLM) search agent with function calling for Python.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
||Azure AI Studio<br>Elastic Search<br>Microsoft Entra ID<br>Azure Managed Identity<br>Azure Monitor<br>Azure Storage<br>Azure AI Studio<br>Managed Integration Runtime (MIR)|GPT 3.5 Turbo|

### Function Calling with Prompty, LangChain and Pinecone

This python [reference template](https://github.com/Azure-Samples/agent-openai-python-prompty-langchain-pinecone) utilizes the new Prompty tool, Langchain, and Pinecone to build a large language model (LLM) search agent. This agent with Retrieval-Augmented Generation (RAG) technologyis is capable of answering user questions based on the provided data by integrating real-time information retrieval with generative responses.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-agent-openai-prompty-langchain-pinecone-python.png" lightbox="../media/intelligent-app-templates/architecture-diagram-agent-openai-prompty-langchain-pinecone-python.png" alt-text="Architectural diagram for an OpenAI agent app using the Prompty, Langchain, and Pinecone with Python.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
|Azure Container Apps|Pinecone<br>Microsoft Entra ID<br>Microsoft Managed Identity<br>Azure Monitor<br>Azure Storage|GPT 3.5 Turbo|

### Assistant API Analytics Copilot with Python and Azure AI Studio

This python [reference template](https://github.com/Azure-Samples/assistant-data-openai-python-promptflow) is an Assistant API to chat with tabular data and perform analytics in natural language.

:::row:::
   :::column:::
      :::image type="content" source="../media/intelligent-app-templates/architecture-diagram-assistant-data-openai-promptflow-python.png" lightbox="../media/intelligent-app-templates/architecture-diagram-assistant-data-openai-promptflow-python.png" alt-text="Architectural diagram for an Assistant API to chat with tabular data and perform analytics in natural language.":::
   :::column-end:::
   :::column:::
   :::column-end:::
:::row-end:::

|Azure Hosting|Technologies|AI Models|
|--|--|--|
||Azure AI Search<br>Azure AI Studio<br>Managed Integration Runtime (MIR)<br>Azure OpenAI|GPT 3.5 Turbo<br>GPT 4|
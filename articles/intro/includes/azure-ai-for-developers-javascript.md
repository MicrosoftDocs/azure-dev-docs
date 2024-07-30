## Azure AI reference templates

Azure AI reference templates provide you with well-maintained, easy to deploy reference implementations. These ensure a high-quality starting point for your intelligent applications. The end-to-end solutions provide popular, comprehensive reference applications. The building blocks are smaller-scale samples that focus on specific scenarios and tasks.

### End-to-end solutions

|Link|Description|
|---|---|
|[Get started with the JavaScript enterprise chat sample using RAG](../../javascript/get-started-app-chat-template.md)|An article that walks you through deploying and using the [Enterprise chat app sample for JavaScript](https://github.com/Azure-Samples/azure-search-openai-javascript). This sample is a complete end-to-end solution demonstrating the [Retrieval-Augmented Generation (RAG) pattern](/azure/search/retrieval-augmented-generation-overview) running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences. |

* [Demo video](https://aka.ms/azai/js/video) - JavaScript fullstack 
* [Demo video](https://aka.ms/azai/js.py/video) - JavaScript frontend with Python backend 


### Building blocks

|Link|Description|
|---|---|
|[Build a chat app with Azure OpenAI (Python)](https://github.com/Azure-Samples/chatgpt-quickstart/blob/main/README.md)|A simple Python Quart app that streams responses from ChatGPT to an HTML/JS frontend using JSON Lines over a ReadableStream. (The Python code is provided as a reference and could be adapted to JavaScript.)|
|[Build a LangChain with Azure OpenAI (Python)](https://github.com/Azure-Samples/function-python-ai-langchain)|A sample shows how to take a human prompt as HTTP Get or Post input, calculates the completions using chains of human input and templates. This is a starting point that can be used for more sophisticated chains. (The Python code is provided as a reference and could be adapted to JavaScript.)|
|[Build a ChatGPT Plugin with Azure Container Apps (Python)](https://github.com/Azure-Samples/openai-plugin-fastapi/blob/main/README.md)|A sample for creating ChatGPT Plugin using GitHub Codespaces, VS Code, and Azure. The sample includes templates to deploy the plugin to Azure Container Apps using the Azure Developer CLI. (The Python code is provided as a reference and could be adapted to JavaScript.)|
|[Azure AI JavaScript Template Gallery](https://azure.github.io/awesome-azd/?tags=ai&tags=javascript)|For the full list of Azure AI templates, visit our gallery. All app templates in our gallery can be spun up and deployed using a single command: _azd up_.|

## Azure OpenAI

### End-to-end solutions

|Link|Description|
|---|---|
|[Get started with the JavaScript enterprise chat sample using RAG](../../javascript/get-started-app-chat-template.md)|An article that walks you through deploying and using the [Enterprise chat app sample for JavaScript](https://github.com/Azure-Samples/azure-search-openai-javascript). This sample is a complete end-to-end solution demonstrating the Retrieval-Augmented Generation (RAG) pattern running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences.|

### Building blocks

|Link|Description|
|---|---|
|[Vector Similarity Search with Azure Cache for Redis Enterprise (Python)](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/vector-similarity-search-with-azure-cache-for-redis-enterprise/ba-p/3822059)|A walkthrough of using Azure Cache for Redis as a backend vector store for RAG scenarios. (The Python code is provided as a reference and could be adapted to JavaScript.)|
|[OpenAI solutions with your own data using PostgreSQL (Python)](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/unlocking-the-power-of-open-ai-and-pgvector-with-azure/ba-p/3828539)|An article discussing how Azure Database for PostgreSQL Flexible Server and Azure Cosmos DB for PostgreSQL supports the pgvector extension, along with an overview, scenarios, etc. (The Python code is provided as a reference and could be adapted to JavaScript.)|

### SDKs and other samples/guidance

|Link|Description|
|---|---|
|[Azure OpenAI SDK for JavaScript](https://aka.ms/oai/js/sdk)|The GitHub source version of the Azure OpenAI client library for JavaScript is an adaptation of OpenAI's REST APIs that provides an idiomatic interface and rich integration with the rest of the Azure SDK ecosystem. It can connect to Azure OpenAI resources or to the non-Azure OpenAI inference endpoint, making it a great choice for even non-Azure OpenAI development.|
|[Azure OpenAI SDK Releases](https://azure.github.io/azure-sdk/?search=openai)|Links to all Azure OpenAI SDK library packages, including links for .NET, Java, JavaScript and Go.|
|[@azure/openai npm package](https://aka.ms/oai/js/npm)|The npm version of the Azure OpenAI client library for JavaScript.|
|[Get started using GPT-35-Turbo and GPT-4](/azure/ai-services/openai/chatgpt-quickstart?pivots=programming-language-javascript&tabs=command-line)|An article that walks you through creating a chat completion sample.|
|[Completions](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai/samples/v1-beta/javascript/completions.js)|A simple example demonstrating how to get completions for the provided prompt.|
|[Streaming Chat Completions](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai/samples/v1-beta/javascript/chatCompletions.js)|A simple example demonstrating how to use  streaming chat completions.|
|[Switch from OpenAI to Azure OpenAI](https://aka.ms/azai/oai-to-aoai)|Article with guidance on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[OpenAI with Microsoft Entra ID Role based access control](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at authentication using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/ai-services/openai/how-to/managed-identity)|An article detailing more complex security scenarios require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|
|[More samples](https://aka.ms/oai/js/samples)|OpenAI samples covering a range of scenarios.|
|[More guidance](/azure/ai-services/openai/)|The hub page for Azure OpenAI Service documentation.|

## Other Azure AI services

### End-to-end solutions

|Link|Description|
|---|---|
|[Captioning and Call Center Transcription](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios)|A repo containing samples for captions and transcriptions in a call center scenario.|

### Building blocks

|Link|Description|
|---|---|
|[Use Speech to converse with OpenAI (C# and Python)](/azure/ai-services/speech-service/openai-speech?tabs=windows)|An article that uses Azure AI Speech to converse with Azure OpenAI Service. The text recognized by the Speech service is sent to Azure OpenAI. The Speech service synthesizes the text response from Azure OpenAI. (The C# and Python code is provided as a reference and could be adapted to JavaScript.)|

### SDKs and samples/guidance

|Link|Description|
|---|---|
|[Integrate Speech into your apps with Speech SDK Samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk)|A collection of samples for the Azure Cognitive Services Speech SDK. Links to samples for speech recognition, translation, speech synthesis, and more.|
|[Azure AI Document Intelligence SDK](/azure/applied-ai-services/form-recognizer/sdk-preview)|Azure AI Document Intelligence (formerly Form Recognizer) is a cloud service that uses machine learning to analyze text and structured data from documents. The Document Intelligence software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Document Intelligence models and capabilities into your applications.|
|[Extract structured data from forms, receipts, invoices, and cards using Form Recognizer in JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v4/javascript/README.md#azure-form-recognizer-client-library-samples-for-javascript)|A collection of samples for the Azure.AI.FormRecognizer client library.|
|[Extract, classify, and understand text within documents using Text Analytics in JavaScript](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-latest&preserve-view=true)|The client Library for Text Analytics. This is part of the [Azure AI Language](/azure/ai-services/language-service) service, which provides Natural Language Processing (NLP) features for understanding and analyzing text.|
|[Document Translation in JavaScript](/azure/ai-services/translator/document-translation/quickstarts/document-translation-rest-api?pivots=programming-language-javascript)|A quickstart article that uses Document Translation to translate a source document into a target language while preserving structure and text formatting.|

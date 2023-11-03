## Azure AI reference templates

Azure AI reference templates provide you with well-maintained, easy to deploy reference implementations. These ensure a high-quality starting point for your intelligent applications. The end-to-end solutions provide popular, comprehensive reference applications. The building blocks are smaller-scale samples that focus on specific scenarios and tasks.

### End-to-end solutions

|Link|Description|
|---|---|
|[Build an enterprise chat app using your data with Azure OpenAI in JavaScript](https://github.com/Azure-Samples/azure-search-openai-javascript)|A sample app for the Retrieval-Augmented Generation pattern running in Azure, using Azure Cognitive Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences. Check out the [Get started](../javascript/get-started-app-chat-template) article that walks you through deployment.|
|[Get started with the enterprise chat app template for JavaScript](../javascript/get-started-app-chat-template)|An article that walks you through deploying and using the [enterprise chat app](https://github.com/Azure-Samples/azure-search-openai-javascript) to get answers about employee benefits at a fictitious company with JavaScript.|

## Azure OpenAI

### End-to-end solutions

|Link|Description|
|---|---|
|[Build an enterprise chat app using your data with Azure OpenAI in JavaScript](https://github.com/Azure-Samples/azure-search-openai-javascript)|A sample app for the Retrieval-Augmented Generation pattern running in Azure, using Azure Cognitive Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences. Check out the [Get started](../javascript/get-started-app-chat-template) article that walks you through deployment.|
|[Get started with the enterprise chat app template for JavaScript](../javascript/get-started-app-chat-template)|An article that walks you through deploying and using the [enterprise chat app](https://github.com/Azure-Samples/azure-search-openai-javascript) to get answers about employee benefits at a fictitious company with JavaScript.|

### Building blocks

|Link|Description|
|---|---|
|[Vector Similarity Search with Azure Cache for Redis Enterprise](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/vector-similarity-search-with-azure-cache-for-redis-enterprise/ba-p/3822059)|A walkthrough of using Azure Cache for Redis as a backend vector store for RAG scenarios.|
|[OpenAI solutions with your own data using PostgreSQL](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/unlocking-the-power-of-open-ai-and-pgvector-with-azure/ba-p/3828539)|An article discussing how Azure Database for PostgreSQL Flexible Server and Azure Cosmos DB for PostgreSQL supports the pgvector extension, along with an overview, scenarios, etc.|

### SDKs and other samples/guidance

|Link|Description|
|---|---|
|[Azure OpenAI SDK for JavaScript](https://aka.ms/oai/js/sdk)|The GitHub source version of the Azure OpenAI client library for JavaScript is an adaptation of OpenAI's REST APIs that provides an idiomatic interface and rich integration with the rest of the Azure SDK ecosystem. It can connect to Azure OpenAI resources or to the non-Azure OpenAI inference endpoint, making it a great choice for even non-Azure OpenAI development.|
|[@azure/openai npm package](https://aka.ms/oai/js/npm)|The npm version of the Azure OpenAI client library for JavaScript.|
|[Get started using GPT-35-Turbo and GPT-4](/ai-services/openai/chatgpt-quickstart?pivots=programming-language-javascript&tabs=command-line)|An article that walks you through creating a chat completion sample.|
|[Completions](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai/samples/v1-beta/javascript/completions.js)|A simple example demonstrating how to get completions for the provided prompt.|
|[Streaming Chat Completions](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai/samples/v1-beta/javascript/chatCompletions.js)|A simple example demonstrating how to use  streaming chat completions.|
|[Switch from OpenAI to Azure OpenAI](https://aka.ms/azai/oai-to-aoai)|Article with guidance on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[OpenAI with Azure Active Directory Role based access control](/azure/cognitive-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at authentication using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/cognitive-services/openai/how-to/managed-identity)|An article detailing more complex security scenarios require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|
|[More samples](https://aka.ms/oai/js/samples)|OpenAI samples covering a range of scenarios.|
|[More guidance](/ai-services/openai/)|The hub page for Azure OpenAI Service documentation.|

## Other Azure AI services

### End-to-end solutions

|Link|Description|
|---|---|
|[Captioning and Call Center Transcription](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios)|A repo containing samples for captions and transcriptions in a call center scenario.|

### Building blocks

|Link|Description|
|---|---|
|[Use Speech to converse with OpenAI](/azure/cognitive-services/speech-service/openai-speech?tabs=windows)|An article that uses Azure AI Speech to converse with Azure OpenAI Service. The text recognized by the Speech service is sent to Azure OpenAI. The Speech service synthesizes the text response from Azure OpenAI.|

### SDKs and samples/guidance

|Link|Description|
|---|---|
|Integrate Speech into your apps with [Speech SDK Samples](/samples/azure-samples/cognitive-services-speech-sdk/sample-repository-for-the-microsoft-cognitive-services-speech-sdk/)|A collection of samples for the Azure Cognitive Services Speech SDK. Links to samples for speech recognition, translation, speech synthesis, and more.|
|[Azure AI Document Intelligence SDK](/azure/applied-ai-services/form-recognizer/sdk-preview)|Azure AI Document Intelligence (formerly Form Recognizer) is a cloud service that uses machine learning to analyze text and structured data from documents. The Document Intelligence software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Document Intelligence models and capabilities into your applications.|
|[Extract structured data from forms, receipts, invoices, and cards using Form Recognizer in JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v4/javascript/README.md#azure-form-recognizer-client-library-samples-for-javascript)|A collection of samples for the Azure.AI.FormRecognizer client library.|
|[Extract, classify, and understand text within documents using Text Analytics in JavaScript](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-latest&preserve-view=true)|The Client Library for Text Analytics, which is part of the Azure Cognitive Service for Language, a cloud-based service that provides Natural Language Processing (NLP) features for understanding and analyzing text.|
|[Document Translation in JavaScript](/azure/ai-services/translator/document-translation/quickstarts/document-translation-rest-api?pivots=programming-language-javascript)|A quickstart article that uses Document Translation to translate a source document into a target language while preserving structure and text formatting.|

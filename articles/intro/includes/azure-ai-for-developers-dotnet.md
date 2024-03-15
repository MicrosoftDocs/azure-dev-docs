## Azure AI reference templates

Azure AI reference templates provide you with well-maintained, easy to deploy reference implementations. These ensure a high-quality starting point for your intelligent applications. The end-to-end solutions provide popular, comprehensive reference applications. The building blocks are smaller-scale samples that focus on specific scenarios and tasks.

### End-to-end solutions

|Link|Description|
|---|---|
|[Get started with the .NET enterprise chat sample using RAG](/dotnet/ai/get-started-app-chat-template)|An article that walks you through deploying and using the [Enterprise chat app sample for .NET](https://github.com/Azure-Samples/azure-search-openai-demo-csharp). This sample is a complete end-to-end solution demonstrating the [Retrieval-Augmented Generation (RAG) pattern](/azure/search/retrieval-augmented-generation-overview) running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences. |
|[Build an AI assistant using RAG](https://github.com/Azure/Vector-Search-AI-Assistant-MongoDBvCore)| This sample is a complete end-to-end solution demonstrating how to design and implement a Q&A AI assistant, which uses the [Embeddings API](/azure/ai-services/openai/tutorials/embeddings) and Completions API in Azure OpenAI Service, as well as the [vector database](/azure/cosmos-db/vector-database) in Azure Cosmos DB. |

* [Demo video](https://aka.ms/azai/net/video)

### Building blocks

|Link|Description|
|---|---|
|[Build a chat app with Azure OpenAI (Python)](https://github.com/Azure-Samples/chatgpt-quickstart/blob/main/README.md)|A simple Python Quart app that streams responses from ChatGPT to an HTML/JS frontend using JSON Lines over a ReadableStream. (The Python code is provided as a reference and could be adapted to .NET.)|
|[Build a LangChain with Azure OpenAI (Python)](https://github.com/Azure-Samples/function-python-ai-langchain)|A sample shows how to take a human prompt as HTTP Get or Post input, calculates the completions using chains of human input and templates. This is a starting point that can be used for more sophisticated chains. (The Python code is provided as a reference and could be adapted to .NET.)|
|[Build a ChatGPT Plugin with Azure Container Apps (Python)](https://github.com/Azure-Samples/openai-plugin-fastapi/blob/main/README.md)|A sample for creating ChatGPT Plugin using GitHub Codespaces, VS Code, and Azure. The sample includes templates to deploy the plugin to Azure Container Apps using the Azure Developer CLI. (The Python code is provided as a reference and could be adapted to .NET.)|
|[Azure AI .NET Template Gallery](https://azure.github.io/awesome-azd/?tags=ai&tags=dotnetCsharp)|For the full list of Azure AI templates, visit our gallery. All app templates in our gallery can be spun up and deployed using a single command: _azd up_.|
|[Smart load balancing with Azure Container Apps](https://github.com/Azure-Samples/openai-aca-lb)|This solution is built using the high-performance [YARP C# reverse-proxy framework](https://github.com/microsoft/reverse-proxy) from Microsoft. However, you don't need to understand C# to use it, you can just build the provided Docker image. This is an alternative solution to the [API Management OpenAI smart load balancer](https://github.com/Azure-Samples/openai-apim-lb/), with the same logic.|
|[Smart load balancing with Azure API Management](https://github.com/Azure-Samples/openai-apim-lb/)|The enterprise solution shows how to create an Azure API Management Policy to seamlessly expose a single endpoint to your applications while keeping an efficient logic to consume two or more OpenAI or any API backends based on availability and priority.|

## Azure OpenAI

### End-to-end solutions

|Link|Description|
|---|---|
|[Get started with the .NET enterprise chat sample using RAG](/dotnet/ai/get-started-app-chat-template)|An article that walks you through deploying and using the [Enterprise chat app sample for .NET](https://github.com/Azure-Samples/azure-search-openai-demo-csharp). This sample is a complete end-to-end solution demonstrating the Retrieval-Augmented Generation (RAG) pattern running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences.|

### Building blocks

|Link|Description|
|---|---|
|[Vector Similarity Search with Azure Cache for Redis Enterprise (Python)](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/vector-similarity-search-with-azure-cache-for-redis-enterprise/ba-p/3822059)|An article that walks you through using Azure Cache for Redis as a backend vector store for RAG scenarios. (The Python code is provided as a reference and could be adapted to .NET.)|
|[OpenAI solutions with your own data using PostgreSQL (Python)](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/unlocking-the-power-of-open-ai-and-pgvector-with-azure/ba-p/3828539)|An article discussing how Azure Database for PostgreSQL Flexible Server and Azure Cosmos DB for PostgreSQL supports the pgvector extension, along with an overview, scenarios, etc. (The Python code is provided as a reference and could be adapted to .NET.)|

### SDKs and other samples/guidance

|Link|Description|
|---|---|
|[Azure OpenAI SDK for .NET](https://aka.ms/oai/net/sdk)|The GitHub source version of the Azure OpenAI client library for .NET is an adaptation of OpenAI's REST APIs that provides an idiomatic interface and rich integration with the rest of the Azure SDK ecosystem. It can connect to Azure OpenAI resources or to the non-Azure OpenAI inference endpoint, making it a great choice for even non-Azure OpenAI development.|
|[Azure OpenAI SDK Releases](https://azure.github.io/azure-sdk/?search=openai)|Links to all Azure OpenAI SDK library packages, including links for .NET, Java, JavaScript and Go.|
|[Azure.AI.OpenAI NuGet package](https://aka.ms/oai/net/nuget)|The NuGet version of the Azure OpenAI client library for .NET.|
|[Get started using GPT-35-Turbo and GPT-4](/azure/ai-services/openai/chatgpt-quickstart?pivots=programming-language-csharp&tabs=command-line)|An article that walks you through creating a chat completion sample.|
|[Completions](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/tests/Samples)|A collection of 10 samples that demonstrate how to use the Azure OpenAI client library for .NET to chat, stream replies, use your own data, transcribe/translate audio, generate images, etc.|
|[Streaming Chat Completions](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/tests/Samples/StreamingChat.cs)|A deep link to the samples demonstrating streaming completions.|
|[OpenAI with Microsoft Entra ID Role based access control](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at authentication using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/ai-services/openai/how-to/managed-identity)|An article with more complex security scenarios that require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|
|[More samples](https://github.com/Azure-Samples/openai-dotnet-samples/blob/main/README.md)|A collection of OpenAI samples written in .NET.|
|[More guidance](/azure/ai-services/openai/)|The hub page for Azure OpenAI Service documentation.|

## Other Azure AI services

### End-to-end solutions

|Link|Description|
|---|---|
|[Captioning and Call Center Transcription](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios)|A repo containing samples for captions and transcriptions in a call center scenario.|
|[Use Form Recognizer to automate a paper based process using the New patient registration with Form Recognizer workshop](https://newpatiente2e.github.io/docs/). ([Code](https://github.com/newpatiente2e/Contoso-New-Patient-App))|A complete walkthrough of an Azure AI Document Intelligence scenario in a workshop format.|

### Building blocks

|Link|Description|
|---|---|
|[Use Speech to converse with OpenAI](/azure/ai-services/speech-service/openai-speech?tabs=windows)|An article detailing how to use Azure AI Speech to converse with Azure OpenAI Service. The text recognized by the Speech service is sent to Azure OpenAI. Speech service then synthesizes the text response from Azure OpenAI.|
|[Translate documents from and into more than 100 different languages](https://github.com/MicrosoftTranslator/DocumentTranslation)|An article showing how to translate local files or network files in many different formats, to more than 100 different languages. Supported formats include HTML, PDF, all Office document formats, Markdown, MHTML, Outlook, MSG, XLIFF, CSV, TSV and plain text.|

### SDKs and samples/guidance

|Link|Description|
|---|---|
|[Integrate Speech into your apps with Speech SDK Samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk)|A repo of samples for the Azure Cognitive Services Speech SDK. Links to samples for speech recognition, translation, speech synthesis, and more.|
|[Azure AI Document Intelligence SDK](/azure/applied-ai-services/form-recognizer/sdk-preview)|Azure AI Document Intelligence (formerly Form Recognizer) is a cloud service that uses machine learning to analyze text and structured data from documents. The Document Intelligence software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Document Intelligence models and capabilities into your applications.|
|[Extract structured data from forms, receipts, invoices, and cards using Form Recognizer in .NET](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md#common-scenarios-samples-for-client-library-version-400)|A repo of samples for the Azure.AI.FormRecognizer client library.|
|[Extract, classify, and understand text within documents using Text Analytics in .NET](https://aka.ms/azai/net/ta)|The client Library for Text Analytics. This is part of the [Azure AI Language](/azure/ai-services/language-service) service, which provides Natural Language Processing (NLP) features for understanding and analyzing text.|
|[Document Translation in .NET](https://aka.ms/azai/net/translate/doc)|A quickstart article that details how to use Document Translation to translate a source document into a target language while preserving structure and text formatting.|
|[Question Answering in .NET](https://aka.ms/azai/net/qna)|A quickstart article to get an answer (and confidence score) from a body of text that you send along with your question.|
|[Conversational Language Understanding in .NET](https://aka.ms/azai/net/convo)|The client library for Conversational Language Understanding (CLU), a cloud-based conversational AI service, which can extract intents and entities in conversations and acts like an orchestrator to select the best candidate to analyze conversations to get best response from apps like Qna, Luis, and Conversation App.|
|[Analyze images](/azure/ai-services/computer-vision/sdk/overview-sdk)|Sample code and setup documents for the Microsoft Azure AI Image Analysis SDK|

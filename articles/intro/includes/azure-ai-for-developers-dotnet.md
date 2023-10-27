## Get started with Azure OpenAI ChatGPT Copilots for .NET developers

|Link|Description|
|---|---|
|[ChatGPT QuickStarts for C#](/azure/cognitive-services/openai/chatgpt-quickstart?pivots=programming-language-csharp&tabs=command-line)|Minimal, straightforward steps to programmatically chat.|
|[ChatGPT .NET App with chats saved to CosmosDB](https://github.com/Azure-Samples/cosmosdb-chatgpt)|More full-featured chat example including a history of prompts/completions using a Blazor Server front-end.|

## OpenAI for .NET developers

|Link|Description|
|---|---|
|[Azure OpenAI SDK for .NET](https://aka.ms/oai/net/sdk)|Github source version of the Azure OpenAI client library for .NET is an adaptation of OpenAI's REST APIs that provides an idiomatic interface and rich integration with the rest of the Azure SDK ecosystem. It can connect to Azure OpenAI resources or to the non-Azure OpenAI inference endpoint, making it a great choice for even non-Azure OpenAI development.|
|[Azure.AI.OpenAI NuGet package](https://aka.ms/oai/net/nuget)|NuGet version of the Azure OpenAI client library for .NET (above).|
|[Completions](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/tests/Samples/Sample01_Chatbot.cs)|A collection of 10 samples that demonstrate how to use the Azure OpenAI client library for .NET to chat, stream replies, use your own data, transcribe/translate audio, generate images, etc.|
|[Streaming Chat Completions](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/tests/Samples/Sample04_StreamingChat.cs)|Deep link to the samples (above) demonstrating streaming completions.|
|[Summarize Text](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/tests/Samples/Sample03_SummarizeText.cs)|Deep link to the samples (above) demonstrating text summarization.|
|[ChatGPT .NET App with your own data](https://aka.ms/azai/dotnet/chatwithdata)|This sample demonstrates a few approaches for creating ChatGPT-like experiences over your own data using the Retrieval Augmented Generation (RAG) pattern. It uses Azure OpenAI Service to access the ChatGPT model (gpt-35-turbo), and Azure Cognitive Search for data indexing and retrieval.|
|[ChatGPT .NET App with chats saved to CosmosDB](https://github.com/Azure-Samples/cosmosdb-chatgpt)|Full-featured chat example including a history of prompts/completions using a Blazor Server front-end.|
|[MAUI chat app example](https://github.com/jpalvarezl/WhatsForDinner)|Small MAUI / Azure OpenAI C# SDK app demonstrating the streaming capabilities of the API.|
|[More Samples](https://github.com/Azure-Samples/openai-dotnet-samples/blob/main/README.md)|Collection of OpenAI samples written in .NET.|

## Azure OpenAI ChatGPT Copilots with your own data

|Link|Description|
|---|---|
|[ChatGPT .NET Copilot with your own data using Cognitive Search](https://aka.ms/azai/dotnet/chatwithdata)|.NET version sample demonstrates a few approaches for creating ChatGPT-like experiences over your own data using the Retrieval Augmented Generation pattern. It uses Azure OpenAI Service to access the ChatGPT model (gpt-35-turbo), and Azure Cognitive Search for data indexing and retrieval.|
|[ChatGPT .NET Copilot with your own data using MongoDB](https://github.com/AzureCosmosDB/VectorSearchAiAssistant/tree/MongovCore). ([Blog](https://devblogs.microsoft.com/cosmosdb/introducing-vector-search-in-azure-cosmos-db-for-mongodb-vcore/))|This solution is a series of samples that demonstrate how to build solutions that incorporate Azure Cosmos DB with Azure OpenAI to build vector search solutions with an AI assistant user interface. The solution shows hows to generate vectors on data stored in Azure Cosmos DB using Azure OpenAI, then shows how to implment vector search capabilities using a variety of different vector capable databases available from Azure Cosmos DB and Azure.|
|[Code behind ChatGPT Web App from uploading your data to the Azure OpenAI Playground](https://aka.ms/azai/chat-from-aoai)|This repo contains sample code for a simple chat webapp that integrates with Azure OpenAI.|
|[Vector Similarity Search with Azure Cache for Redis Enterprise](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/vector-similarity-search-with-azure-cache-for-redis-enterprise/ba-p/3822059)|Walkthrough of using Azure Cache for Redis as a backend vector store for RAG scenarios.|
|[OpenAI solutions with your own data using PostgreSQL](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/unlocking-the-power-of-open-ai-and-pgvector-with-azure/ba-p/3828539)|Discusses how Azure Database for PostgreSQL Flexible Server and Azure Cosmos DB for PostgreSQL have now introduced support for the pgvector extension, overview, scenarios, etc.|

## Create and manage Azure AI resources with code

|Link|Description|
|---|---|
|[Azure Developer CLI](https://azure.github.io/awesome-azd/?tags=ai)|Awesome AZD templates for use with the Azure Developer CLI that help you build and deploy AI solutions quickly.|
|[Azure CLI](/azure/ai-services/openai/how-to/create-resource?pivots=cli)|Article describes how to get started with Azure OpenAI Service and provides step-by-step instructions to create a resource and deploy a model using the Azure CLI.|
|[Bicep](/azure/cognitive-services/create-account-bicep?tabs=CLI)|Create Azure AI services resource using Bicep.|
|[Terraform](https://registry.terraform.io/modules/Azure/openai/azurerm/latest)|Terraform module for deploying Azure OpenAI Service. Includes reference docs and examples.|
|[.NET/C#](/azure/cognitive-services/cognitive-services-apis-create-account-client-library?pivots=programming-language-csharp)|Use .NET / C# to create and manage a multi-service resource for Azure AI services. A multi-service resource allows you to access multiple Azure AI services with a single key and endpoint. It also consolidates billing from the services you use.|

## Secure your Azure AI resources

|Link|Description|
|---|---|
|[OpenAI with Azure Active Directory Role based access control](/azure/cognitive-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at what's required to authenticate using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/cognitive-services/openai/how-to/managed-identity)|More complex security scenarios require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|

## Speech/Vision

|Link|Description|
|---|---|
|[Use Speech to converse with OpenAI](/azure/cognitive-services/speech-service/openai-speech?tabs=windows)|Use Azure AI Speech to converse with Azure OpenAI Service. The text recognized by the Speech service is sent to Azure OpenAI. The text response from Azure OpenAI is then synthesized by the Speech service.|
|[Captioning and Call Center Transcription](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios)|Repo containing samples for captioning and transcriptioning in a call center scenario.|
|Integrate Speech into your apps with [Speech SDK Samples](/samples/azure-samples/cognitive-services-speech-sdk/sample-repository-for-the-microsoft-cognitive-services-speech-sdk/)|Samples for the Microsoft Cognitive Services Speech SDK. Links to samples for speech recognition, translation, speech synthesis, and more.|
|[Analyze images](/samples/azure-samples/azure-ai-vision-sdk/azure-ai-vision-sdk-preview-samples/)|Hosts sample code and setup documents for the Microsoft Azure AI Vision SDK.|

## Language

|Link|Description|
|---|---|
|[Extract, classify, and understand text within documents using Text Analytics in .NET](https://aka.ms/azai/net/ta)|Client Library for Text Analytics, which is part of the Azure Cognitive Service for Language, a cloud-based service that provides Natural Language Processing (NLP) features for understanding and analyzing text.|
|[Document Translation in .NET](https://aka.ms/azai/net/translate/doc)|Quickstart to use Document Translation to translate a source document into a target language while preserving structure and text formatting.|
|[Translate documents from and into more than 100 different languages](https://github.com/MicrosoftTranslator/DocumentTranslation)|Translate local files or network files in many different formats, to more than 100 different languages. Supported formats include HTML, PDF, all Office document formats, Markdown, MHTML, Outlook .MSG, XLIFF, CSV, TSV and plain text.|
|[Question Answering in .NET](https://aka.ms/azai/net/qna)|Quickstart to get an answer (and confidence score) from a body of text that you send along with your question.|
|[Conversational Language Understanding in .NET](https://aka.ms/azai/net/convo)|Client library for Conversational Language Understanding (CLU), a cloud-based conversational AI service which can extract intents and entities in conversations and acts like an orchestrator to select the best candidate to analyze conversations to get best response from apps like Qna, Luis, and Conversation App.|

## Applied AI/Decision

|Link|Description|
|---|---|
|[Azure AI Document Intelligence SDK](/azure/applied-ai-services/form-recognizer/sdk-preview)|Azure AI Document Intelligence (formerly Form Recognizer) is a cloud service that uses machine learning to analyze text and structured data from documents. The Document Intelligence software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Document Intelligence models and capabilities into your applications.|
|[Extract structured data from forms, receipts, invoices, and cards using Form Recognizer in .NET](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md#common-scenarios-samples-for-client-library-version-400)|Samples for the Azure.AI.FormRecognizer client library.|
|[Use Form Recognizer to automate a paper based process using the New patient registration with Form Recognizer workshop](https://newpatiente2e.github.io/docs/). ([Code](https://github.com/newpatiente2e/Contoso-New-Patient-App))|Complete walkthrough of a Azure AI Document Intelligence scenario in a workshop format.|

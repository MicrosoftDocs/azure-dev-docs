## Azure AI Reference Templates

|Link|Description|
|---|---|
|[Build an enterprise chat app using your data with Azure OpenAI in Java](https://github.com/Azure-Samples/azure-search-openai-demo-java)|A sample app for the Retrieval-Augmented Generation pattern running in Azure, using Azure Cognitive Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences. Check out the [Get started](../java/quickstarts/get-started-app-chat-template) article that walks you through deployment.|
|[Get started with the enterprise chat app template for Java](../java/quickstarts/get-started-app-chat-template)|Walks you through deploying and using the [enterprise chat app](https://github.com/Azure-Samples/azure-search-openai-demo-java) (above) to get answers about employee benefits at a fictitious company with JavaScript.|

## Get started with Azure OpenAI ChatGPT Copilots for Java developers

|Link|Description|
|---|---|
|[ChatGPT QuickStarts for Java](/azure/cognitive-services/openai/chatgpt-quickstart?pivots=programming-language-java&tabs=command-line)|Minimal, straightforward steps to programmatically chat.|
|[Switch from OpenAI to Azure OpenAI](https://aka.ms/azai/oai-to-aoai)|Guidance on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[More Azure OpenAI Service Docs](/azure/cognitive-services/openai/)|Azure OpenAI Service Documentation Hub with links to even more Azure OpenAI service tutorials, quickstarts, how-to articles, and more.|

## OpenAI for Java developers

|Link|Description|
|---|---|
|[Azure OpenAI SDK for Java](https://aka.ms/oai/java/sdk)|GitHub source version of the the Azure OpenAI client library for Java, an adaptation of OpenAI's REST APIs that provides an idiomatic interface and rich integration with the rest of the Azure SDK ecosystem.|
|[azure.ai.openai maven package](https://aka.ms/oai/java/maven)|Maven package version of the Azure OpenAI client library for Java (above).|
|[Completions](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-openai_1.0.0-beta.1/sdk/openai/azure-ai-openai/src/samples/java/com/azure/ai/openai/ChatbotSample.java)|Simple example demonstrating how to get completions for the provided prompt.|
|[Streaming Chat Completions](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-openai_1.0.0-beta.1/sdk/openai/azure-ai-openai/src/samples/java/com/azure/ai/openai/StreamingChatSample.java)|Simple example demonstrating how to use  streaming chat completions.|
|[More Samples](https://aka.ms/oai/java/samples)|Azure OpenAI service samples are a set of self-contained Java programs that demonstrate interacting with Azure OpenAI service using the client library. Each sample focuses on a specific scenario and can be executed independently.|

## Azure OpenAI ChatGPT Copilots with your own data

|Link|Description|
|---|---|
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
|[Java](/azure/cognitive-services/cognitive-services-apis-create-account-client-library?pivots=programming-language-java)|Use Java to create and manage a multi-service resource for Azure AI services. A multi-service resource allows you to access multiple Azure AI services with a single key and endpoint. It also consolidates billing from the services you use.|

## Secure your Azure AI resources

|Link|Description|
|---|---|
|[OpenAI with Azure Active Directory Role based access control](/azure/cognitive-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at what's required to authenticate using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/cognitive-services/openai/how-to/managed-identity)|More complex security scenarios require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|

## Speech/Vision

|Link|Description|
|---|---|
|[Captioning and Call Center Transcription](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios)|Repo containing samples for captioning and transcriptioning in a call center scenario.|
|Integrate Speech into your apps with [Speech SDK Samples](/samples/azure-samples/cognitive-services-speech-sdk/sample-repository-for-the-microsoft-cognitive-services-speech-sdk/)|Samples for the Microsoft Cognitive Services Speech SDK. Links to samples for speech recognition, translation, speech synthesis, and more.|
|[Analyze images](/samples/azure-samples/azure-ai-vision-sdk/azure-ai-vision-sdk-preview-samples/)|Hosts sample code and setup documents for the Microsoft Azure AI Vision SDK.|

## Language

|Link|Description|
|---|---|
|[Extract, classify, and understand text within documents using Text Analytics in Java](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-stable&preserve-view=true)|Client Library for Text Analytics, which is part of the Azure Cognitive Service for Language, a cloud-based service that provides Natural Language Processing (NLP) features for understanding and analyzing text.|
|[Document Translation in Java](/azure/ai-services/translator/document-translation/quickstarts/document-translation-rest-api?pivots=programming-language-java)|Quickstart to use Document Translation to translate a source document into a target language while preserving structure and text formatting.|

## Applied AI/Decision

|Link|Description|
|---|---|
|[Azure Form Recognizer SDK for Java](/azure/applied-ai-services/form-recognizer/sdk-preview)|Azure AI Document Intelligence (formerly Form Recognizer) is a cloud service that uses machine learning to analyze text and structured data from documents. The Document Intelligence software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Document Intelligence models and capabilities into your applications.|
|[Extract structured data from forms, receipts, invoices, and cards using Form Recognizer in Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md#azure-form-recognizer-client-library-samples-for-java)|Samples for the Azure.AI.FormRecognizer client library.|

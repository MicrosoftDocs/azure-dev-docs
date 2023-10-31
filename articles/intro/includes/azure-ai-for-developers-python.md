## Azure AI Reference Templates

|Link|Description|
|---|---|
|[Build an enterprise chat app using your data with Azure OpenAI in Python](https://github.com/Azure-Samples/azure-search-openai-demo)|A sample app for the Retrieval-Augmented Generation pattern running in Azure, using Azure Cognitive Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences. Check out the [Get started](../python/get-started-app-chat-template.md) article that walks you through deployment.|
|[Get started with the enterprise chat app template for Python](../python/get-started-app-chat-template.md)|Walks you through deploying and using the [enterprise chat app](https://github.com/Azure-Samples/azure-search-openai-demo) (above) to get answers about employee benefits at a fictitious company with Python.|
|[Build a chat app with Azure OpenAI in Python](https://github.com/Azure-Samples/chatgpt-quickstart/blob/main/README.md)|Simple Python Quart app that streams responses from ChatGPT to an HTML/JS frontend using JSON Lines over a ReadableStream.|
|[Build a LangCghain with Azure OpenAI in Python](https://github.com/Azure-Samples/function-python-ai-langchain)|Sample shows how to take a human prompt as HTTP Get or Post input, calculates the completions using chains of human input and templates. This is a starting point that can be used for more sophisticated chains.|
|[Build a ChatGGPT Plugin with Azure Container Apps in Python](https://github.com/Azure-Samples/openai-plugin-fastapi/blob/main/README.md)|Sample for creating ChatGPT Plugin using GitHub Codespaces, VS Code, and Azure. The sample includes templates to deploy the plugin to Azure Container Apps using the Azure Developer CLI.|

## Get started with Azure OpenAI ChatGPT Copilots for Python developers

|Link|Description|
|---|---|
|[Simple Azure OpenAI ChatGPT Copilot in Python](https://aka.ms/azai/chat)|Easy to setup sample application via Azure Developer CLI. Includes a simple Python Quart app that streams responses from ChatGPT to an HTML/JS frontend.|
|[Simple ChatGPT Python Plugin App Authoring](https://aka.ms/azai/plugin)|This is a quickstart for sample for creating ChatGPT Plugin using GitHub Codespaces, VS Code, and Azure. The sample includes templates to deploy the plugin to Azure Container Apps using the Azure Developer CLI.|
|[ChatGPT QuickStarts for Python](/azure/cognitive-services/openai/chatgpt-quickstart?pivots=programming-language-python&tabs=command-line)|Minimal, straightforward steps to programmatically chat.|
|[ChatGPT Python App with Azure Functions using LangChain](https://github.com/Azure-Samples/function-python-ai-langchain)|This sample shows how to take a human prompt as HTTP Get or Post input, calculates the completions using chains of human input and templates. This is a starting point that can be used for more sophisticated chains.|

## OpenAI for Python developers

|Link|Description|
|---|---|
|[OpenAI SDK for Python](https://github.com/openai/openai-python/blob/main/README.md)|GitHub source code version of the OpenAI Python library provides convenient access to the OpenAI API from applications written in the Python language. It includes a pre-defined set of classes for API resources that initialize themselves dynamically from API responses which makes it compatible with a wide range of versions of the OpenAI API.|
|[openai Python Package](https://pypi.org/project/openai/)|PyPi version of the OpenAI Python library (above).|
|[Completions](https://github.com/openai/openai-cookbook/blob/main/examples/azure/completions.ipynb)|Notebook containing an example of operations needed to get completions working using the Azure endpoints. This example focuses on completions but also touches on some other operations that are also available using the API.|
|[Streaming Chat completions](https://github.com/openai/openai-cookbook/blob/main/examples/azure/chat.ipynb)|Notebook containng example of getting chat completions to work using the Azure endpoints. This example focuses on chat completions but also touches on some other operations that are also available using the API.|
|[Switch from OpenAI to Azure OpenAI](https://aka.ms/azai/oai-to-aoai)|Guidance on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[ChatGPT Python App](https://aka.ms/azai/chat)|Easy to setup sample application via Azure Developer CLI. Includes a simple Python Quart app that streams responses from ChatGPT to an HTML/JS frontend.|
|[ChatGPT Python Plugin App Authoring](https://aka.ms/azai/plugin)|This is a quickstart for sample for creating ChatGPT Plugin using GitHub Codespaces, VS Code, and Azure. The sample includes templates to deploy the plugin to Azure Container Apps using the Azure Developer CLI.|
|[ChatGPT Python App with your own data](https://aka.ms/azai/chatwithdata)|This sample demonstrates a few approaches for creating ChatGPT-like experiences over your own data using the Retrieval Augmented Generation pattern. It uses Azure OpenAI Service to access the ChatGPT model (gpt-35-turbo), and Azure Cognitive Search for data indexing and retrieval.|
|[Azure AI Content Safety SDK for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/contentsafety/azure-ai-contentsafety)|Azure AI Content Safety detects harmful user-generated and AI-generated content in applications and services. Content Safety includes text and image APIs that allow you to detect material that is harmful.|
|[Azure companion for Python experiment](https://github.com/johanste/easyaz)||
|[Vector Embeddings based Q&A App](https://github.com/ruoccofabrizio/azure-open-ai-embeddings-qna)|A simple web application for a OpenAI-enabled document search. This repo uses Azure OpenAI Service for creating embeddings vectors from documents. For answering the question of a user, it retrieves the most relevant document and then uses GPT-3 to extract the matching answer for the question.|
|[Use Speech to converse with OpenAI](/azure/ai-services/speech-service/openai-speech?tabs=windows&branch=main&pivots=programming-language-python)|Use Azure AI Speech to converse with Azure OpenAI Service. The text recognized by the Speech service is sent to Azure OpenAI. The text response from Azure OpenAI is then synthesized by the Speech service.|
|[Deploy a model and generate text](/azure/cognitive-services/openai/quickstart?pivots=programming-language-python)|Minimal, straightforward steps to programmatically chat.|
|[Embeddings](https://github.com/openai/openai-cookbook/blob/main/examples/azure/embeddings.ipynb)|Notebook demonstrating operations how to use embeddings that can be done using the Azure endpoints. This example focuses on embeddings but also touches some other operations that are also available using the API.|
|[Finetuning](https://github.com/openai/openai-cookbook/blob/main/examples/azure/finetuning.ipynb)||
|[More Samples](https://github.com/Azure-Samples/openai/blob/main/README.md)|This repo is a compilation of useful Azure OpenAI Service resources and code samples to help you get started and accelerate your technology adoption journey.|

## Azure OpenAI ChatGPT Copilots with your own data

|Link|Description|
|---|---|
|[ChatGPT Python Copilot with your own data using Cognitive Search](https://aka.ms/azai/chatwithdata)|Python version sample demonstrates a few approaches for creating ChatGPT-like experiences over your own data using the Retrieval Augmented Generation pattern. It uses Azure OpenAI Service to access the ChatGPT model (gpt-35-turbo), and Azure Cognitive Search for data indexing and retrieval.|
|[OpenAI Python ChatGPT Web App with batch processing on your own data using Redis](https://github.com/ruoccofabrizio/azure-open-ai-embeddings-qna#deploy-on-azure-webapp--azure-cache-for-redis-enterprise--batch-processing)|A simple web application for a OpenAI-enabled document search. This repo uses Azure OpenAI Service for creating embeddings vectors from documents. For answering the question of a user, it retrieves the most relevant document and then uses GPT-3 to extract the matching answer for the question. Easily deployed to Azure directly from the repo.|
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
|[Python](/azure/cognitive-services/cognitive-services-apis-create-account-client-library?pivots=programming-language-python)|Use Python to create and manage a multi-service resource for Azure AI services. A multi-service resource allows you to access multiple Azure AI services with a single key and endpoint. It also consolidates billing from the services you use.|

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
|[Integrate Speech into your apps with Speech SDK Samples](/samples/azure-samples/cognitive-services-speech-sdk/sample-repository-for-the-microsoft-cognitive-services-speech-sdk/)|Samples for the Microsoft Cognitive Services Speech SDK. Links to samples for speech recognition, translation, speech synthesis, and more.|
|[Analyze images](/samples/azure-samples/azure-ai-vision-sdk/azure-ai-vision-sdk-preview-samples/)|Hosts sample code and setup documents for the Microsoft Azure AI Vision SDK.|

## Language

|Link|Description|
|---|---|
|[Extract, classify, and understand text within documents using Text Analytics in Python](/python/api/overview/azure/ai-textanalytics-readme?view=azure-python&preserve-view=true)|Client Library for Text Analytics, which is part of the Azure Cognitive Service for Language, a cloud-based service that provides Natural Language Processing (NLP) features for understanding and analyzing text.|
|[Document Translation in Python](/azure/ai-services/translator/document-translation/quickstarts/document-translation-sdk?tabs=dotnet&pivots=programming-language-python)|Quickstart to use Document Translation to translate a source document into a target language while preserving structure and text formatting.|
|[Question Answering in Python](/azure/ai-services/language-service/question-answering/quickstart/sdk?tabs=windows&pivots=programming-language-csharp)|Quickstart to get an answer (and confidence score) from a body of text that you send along with your question.|
|[Conversational Language Understanding in Python](/python/api/overview/azure/ai-language-conversations-readme?view=azure-python&preserve-view=true)|Client library for Conversational Language Understanding (CLU), a cloud-based conversational AI service which can extract intents and entities in conversations and acts like an orchestrator to select the best candidate to analyze conversations to get best response from apps like Qna, Luis, and Conversation App.|

## Applied AI/Decision

|Link|Description|
|---|---|
|[Azure AI Document Intelligence SDK](/azure/applied-ai-services/form-recognizer/sdk-preview)|Azure AI Document Intelligence (formerly Form Recognizer) is a cloud service that uses machine learning to analyze text and structured data from documents. The Document Intelligence software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Document Intelligence models and capabilities into your applications.|
|[Extract structured data from forms, receipts, invoices, and cards using Form Recognizer in Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/README.md#samples-for-azure-form-recognizer-client-library-for-python)|Samples for the Azure.AI.FormRecognizer client library.|

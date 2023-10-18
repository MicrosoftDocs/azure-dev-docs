---
title: Develop Azure AI-powered applications
description: This article provides an organized list of resources about Azure AI scenarios for developers, including documentation and code samples.
keywords: ai, azure openai service
ms.service: azure
ms.topic: overview
ms.date: 10/16/2023
ms.custom: overview
zone_pivot_group_filename: developer/intro/intro-zone-pivot-groups.json
zone_pivot_groups: intelligent-apps-languages
---

# Develop Azure AI-powered applications

This article provides documentation, samples and other resources for learning how to develop applications that use Azure OpenAI Service and other Cognitive Services.

:::zone pivot="dotnet"

## Get started with Azure OpenAI ChatGPT Copilots for .NET Developers

|Link|Description|
|---|---|
|[ChatGPT QuickStarts for Python, C#, JavaScript and Java](/azure/cognitive-services/openai/chatgpt-quickstart?pivots=programming-language-csharp&tabs=command-line)|Minimal, straightforward steps to programmatically chat.|
|[ChatGPT .NET App with chats saved to CosmosDB](https://github.com/Azure-Samples/cosmosdb-chatgpt)|More full-featured chat example including a history of prompts/completions using a Blazor Server front-end.|

## OpenAI for .NET Developers

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

:::zone-end

:::zone pivot="python"

## Get started with Azure OpenAI ChatGPT Copilots for Python Developers

|Link|Description|
|---|---|
|[Simple Azure OpenAI ChatGPT Copilot in Python](https://aka.ms/azai/chat)|Easy to setup sample application via Azure Developer CLI. Includes a simple Python Quart app that streams responses from ChatGPT to an HTML/JS frontend.|
|[Simple ChatGPT Python Plugin App Authoring](https://aka.ms/azai/plugin)|This is a quickstart for sample for creating ChatGPT Plugin using GitHub Codespaces, VS Code, and Azure. The sample includes templates to deploy the plugin to Azure Container Apps using the Azure Developer CLI.|
|[ChatGPT QuickStarts for Python, C#, JavaScript and Java](/azure/cognitive-services/openai/chatgpt-quickstart?pivots=programming-language-csharp&tabs=command-line)|Minimal, straightforward steps to programmatically chat.|
|[ChatGPT Python App with Azure Functions using LangChain](https://github.com/Azure-Samples/function-python-ai-langchain)|This sample shows how to take a human prompt as HTTP Get or Post input, calculates the completions using chains of human input and templates. This is a starting point that can be used for more sophisticated chains.|

## OpenAI for Python Developers

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

:::zone-end

:::zone pivot="javascript"

## Get started with Azure OpenAI ChatGPT Copilots for JavaScript Developers

|Link|Description|
|---|---|
|[ChatGPT QuickStarts for Python, C#, JavaScript and Java](/azure/cognitive-services/openai/chatgpt-quickstart?pivots=programming-language-csharp&tabs=command-line)|Minimal, straightforward steps to programmatically chat.|
|[Switch from OpenAI to Azure OpenAI](https://aka.ms/azai/oai-to-aoai)|Guidance on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[More Azure OpenAI Service Docs](/azure/cognitive-services/openai/)|Azure OpenAI Service Documentation Hub with links to even more Azure OpenAI service tutorials, quickstarts, how-to articles, and more.|

## OpenAI for JavaScript Developers

|Link|Description|
|---|---|
|[Azure OpenAI SDK for JavaScript](https://aka.ms/oai/js/sdk)|GitHub source version of the Azure OpenAI client library for JavaScript is an adaptation of OpenAI's REST APIs that provides an idiomatic interface and rich integration with the rest of the Azure SDK ecosystem. It can connect to Azure OpenAI resources or to the non-Azure OpenAI inference endpoint, making it a great choice for even non-Azure OpenAI development.|
|[@azure/openai npm package](https://aka.ms/oai/js/npm)|npm version of the version of the Azure OpenAI client library for JavaScript (above).|
|[Completions](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai/samples/v1-beta/javascript/completions.js)|Simple example demonstrating how to get completions for the provided prompt.|
|[Streaming Chat Completions](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai/samples/v1-beta/javascript/chatCompletions.js)|Simple example demonstrating how to use  streaming chat completions.|
|[More Samples](https://aka.ms/oai/js/samples)|OpenAI samples covering a range of scenarios.|

:::zone-end

:::zone pivot="java"

## Get started with Azure OpenAI ChatGPT Copilots for Java Developers

|Link|Description|
|---|---|
|[ChatGPT QuickStarts for Python, C#, JavaScript and Java](/azure/cognitive-services/openai/chatgpt-quickstart?pivots=programming-language-csharp&tabs=command-line)|Minimal, straightforward steps to programmatically chat.|
|[Switch from OpenAI to Azure OpenAI](https://aka.ms/azai/oai-to-aoai)|Guidance on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[More Azure OpenAI Service Docs](/azure/cognitive-services/openai/)|Azure OpenAI Service Documentation Hub with links to even more Azure OpenAI service tutorials, quickstarts, how-to articles, and more.|

## OpenAI for Java Developers

|Link|Description|
|---|---|
|[Azure OpenAI SDK for Java](https://aka.ms/oai/java/sdk)|GitHub source version of the the Azure OpenAI client library for Java, an adaptation of OpenAI's REST APIs that provides an idiomatic interface and rich integration with the rest of the Azure SDK ecosystem.|
|[azure.ai.openai maven package](https://aka.ms/oai/java/maven)|Maven package version of the Azure OpenAI client library for Java (above).|
|[Completions](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-openai_1.0.0-beta.1/sdk/openai/azure-ai-openai/src/samples/java/com/azure/ai/openai/ChatbotSample.java)|Simple example demonstrating how to get completions for the provided prompt.|
|[Streaming Chat Completions](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-openai_1.0.0-beta.1/sdk/openai/azure-ai-openai/src/samples/java/com/azure/ai/openai/StreamingChatSample.java)|Simple example demonstrating how to use  streaming chat completions.|
|[More Samples](https://aka.ms/oai/java/samples)|Azure OpenAI service samples are a set of self-contained Java programs that demonstrate interacting with Azure OpenAI service using the client library. Each sample focuses on a specific scenario and can be executed independently.|

:::zone-end

:::zone pivot="golang"

## OpenAI for Go Developers

|Link|Description|
|---|---|
|[Azure OpenAI SDK for Go](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/ai/azopenai)|GitHub source version of the Azure OpenAI SDK for Go.|
|[Package (pkg.go.dev)](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai)|Go package version of Azure OpenAI client module for Go.|
|[ChatCompletions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#example-Client.GetChatCompletions)|Simple example demonstrating how to implement completions.|
|[ChatCompletions using Functions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#example-Client.GetChatCompletions-Functions)|Simple example demonstrating how to implement completions using Functions.|
|[Streaming Chat Completions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#example-Client.GetChatCompletionsStream)|Simple example demonstrating how to implement streaming completions.|
|[Image generation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#example-Client.CreateImage)|Simple example of implementing image generation.|
|[Embeddings](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#example-Client.GetEmbeddings)|Simple example demonstrating how to create embeddings.|
|[Other examples](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#pkg-examples)|Go package version of documentation for the OpenAI client module for Go.|

:::zone-end

## Azure OpenAI ChatGPT Copilots with your own data

|Link|Description|
|---|---|
|[ChatGPT JavaScript Copilot with your own data using Cognitive Search](https://github.com/Azure-Samples/azure-search-openai-javascript)|JavaScript version sample demonstrates a few approaches for creating ChatGPT-like experiences over your own data using the Retrieval Augmented Generation pattern. It uses Azure OpenAI Service to access the ChatGPT model (gpt-35-turbo), and Azure Cognitive Search for data indexing and retrieval.|
|[ChatGPT Python Copilot with your own data using Cognitive Search](https://aka.ms/azai/chatwithdata)|Python version sample demonstrates a few approaches for creating ChatGPT-like experiences over your own data using the Retrieval Augmented Generation pattern. It uses Azure OpenAI Service to access the ChatGPT model (gpt-35-turbo), and Azure Cognitive Search for data indexing and retrieval.|
|[ChatGPT .NET Copilot with your own data using Cognitive Search](https://aka.ms/azai/dotnet/chatwithdata)|.NET version sample demonstrates a few approaches for creating ChatGPT-like experiences over your own data using the Retrieval Augmented Generation pattern. It uses Azure OpenAI Service to access the ChatGPT model (gpt-35-turbo), and Azure Cognitive Search for data indexing and retrieval.|
|[ChatGPT .NET Copilot with your own data using MongoDB](https://github.com/AzureCosmosDB/VectorSearchAiAssistant/tree/MongovCore). ([Blog](https://devblogs.microsoft.com/cosmosdb/introducing-vector-search-in-azure-cosmos-db-for-mongodb-vcore/))|This solution is a series of samples that demonstrate how to build solutions that incorporate Azure Cosmos DB with Azure OpenAI to build vector search solutions with an AI assistant user interface. The solution shows hows to generate vectors on data stored in Azure Cosmos DB using Azure OpenAI, then shows how to implment vector search capabilities using a variety of different vector capable databases available from Azure Cosmos DB and Azure.|
|[OpenAI Python ChatGPT Web App with batch processing on your own data using Redis](https://github.com/ruoccofabrizio/azure-open-ai-embeddings-qna#deploy-on-azure-webapp--azure-cache-for-redis-enterprise--batch-processing)|A simple web application for a OpenAI-enabled document search. This repo uses Azure OpenAI Service for creating embeddings vectors from documents. For answering the question of a user, it retrieves the most relevant document and then uses GPT-3 to extract the matching answer for the question. Easily deployed to Azure directly from the repo.|
|[Code behind ChatGPT Web App from uploading your data to the Azure OpenAI Playground](https://aka.ms/azai/chat-from-aoai)|This repo contains sample code for a simple chat webapp that integrates with Azure OpenAI.|
|[Vector Similarity Search with Azure Cache for Redis Enterprise](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/vector-similarity-search-with-azure-cache-for-redis-enterprise/ba-p/3822059)|Walkthrough of using Azure Cache for Redis as a backend vector store for RAG scenarios.|
|[OpenAI solutions with your own data using PostgreSQL](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/unlocking-the-power-of-open-ai-and-pgvector-with-azure/ba-p/3828539)|Discusses how Azure Database for PostgreSQL Flexible Server and Azure Cosmos DB for PostgreSQL have now introduced support for the pgvector extension, overview, scenarios, etc.|

## Create and manage Azure AI Resources with code

|Link|Description|
|---|---|
|[Azure Developer CLI](https://azure.github.io/awesome-azd/?tags=ai)|Awesome AZD templates for use with the Azure Developer CLI that help you build and deploy AI solutions quickly.|
|[Azure CLI](/azure/ai-services/openai/how-to/create-resource?pivots=cli)|Article describes how to get started with Azure OpenAI Service and provides step-by-step instructions to create a resource and deploy a model using the Azure CLI.|
|[Bicep](/azure/cognitive-services/create-account-bicep?tabs=CLI)|Create Azure AI services resource using Bicep.|
|[Terraform](https://registry.terraform.io/modules/Azure/openai/azurerm/latest)|Terraform module for deploying Azure OpenAI Service. Includes reference docs and examples.|
|[Python](/azure/cognitive-services/cognitive-services-apis-create-account-client-library?pivots=programming-language-python)|Use Python to create and manage a multi-service resource for Azure AI services. A multi-service resource allows you to access multiple Azure AI services with a single key and endpoint. It also consolidates billing from the services you use.|
|[.NET/C#](/azure/cognitive-services/cognitive-services-apis-create-account-client-library?pivots=programming-language-csharp)|Use .NET / C# to create and manage a multi-service resource for Azure AI services. A multi-service resource allows you to access multiple Azure AI services with a single key and endpoint. It also consolidates billing from the services you use.|
|[JavaScript/TypeScript](/azure/cognitive-services/cognitive-services-apis-create-account-client-library?pivots=programming-language-javascript)|Use JavaScript / TypeScript to create and manage a multi-service resource for Azure AI services. A multi-service resource allows you to access multiple Azure AI services with a single key and endpoint. It also consolidates billing from the services you use.|
|[Java](/azure/cognitive-services/cognitive-services-apis-create-account-client-library?pivots=programming-language-java)|Use Java to create and manage a multi-service resource for Azure AI services. A multi-service resource allows you to access multiple Azure AI services with a single key and endpoint. It also consolidates billing from the services you use.|

## Secure your Azure AI Resources

|Link|Description|
|---|---|
|[OpenAI with Azure Active Directory Role based access control](/azure/cognitive-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at what's required to authenticate using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/cognitive-services/openai/how-to/managed-identity)|More complex security scenarios require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|

## Speech/Vision

|Link|Description|
|---|---|
|[Use Speech to converse with OpenAI](/azure/cognitive-services/speech-service/openai-speech?tabs=windows)|Use Azure AI Speech to converse with Azure OpenAI Service. The text recognized by the Speech service is sent to Azure OpenAI. The text response from Azure OpenAI is then synthesized by the Speech service.|
|[Captioning and Call Center Transcription in Python, .NET, JavaScript, Java, C++ and Go](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios)|Repo containing samples for captioning and transcriptioning in a call center scenario.|
|Integrate Speech into your apps with [Speech SDK Samples in Python, .NET, JavaScript, Java, C++ and other languages](/samples/azure-samples/cognitive-services-speech-sdk/sample-repository-for-the-microsoft-cognitive-services-speech-sdk/)|Samples for the Microsoft Cognitive Services Speech SDK. Links to samples for speech recognition, translation, speech synthesis, and more.|
|[Analyze images in Python, .NET and C++](/samples/azure-samples/azure-ai-vision-sdk/azure-ai-vision-sdk-preview-samples/)|Hosts sample code and setup documents for the Microsoft Azure AI Vision SDK.|

## Language

|Link|Description|
|---|---|
|Extract, classify, and understand text within documents using Text Analytics in [Python](/samples/azure/azure-sdk-for-python/textanalytics-samples/) , [.NET](/samples/azure/azure-sdk-for-net/azure-cognitive-services-text-analytics-client-library-for-net/) , [TypeScript](/samples/azure/azure-sdk-for-js/ai-language-text-typescript-beta/) , [JavaScript](/samples/azure/azure-sdk-for-js/ai-language-text-javascript-beta/) and [Java](/samples/azure/azure-sdk-for-java/textanalytics-java-samples/)|
|Document Translation in [Python](/samples/azure/azure-sdk-for-python/documenttranslation-samples/), [.NET](/samples/azure/azure-sdk-for-net/azure-document-translation-client-sdk-samples/), [TypeScript](/samples/azure/azure-sdk-for-js/ai-document-translator-typescript/), [JavaScript](/samples/azure/azure-sdk-for-js/ai-document-translator-javascript/) And [Java](/samples/azure/azure-sdk-for-java/documenttranslator-java-samples/)|
|Translate documents from and into more than 100 different languages using [**Document Translation sample apps**](https://github.com/MicrosoftTranslator/DocumentTranslation)|
|Question Answering in [Python](/samples/azure/azure-sdk-for-python/languagequestionanswering-samples/) and [.NET](/samples/azure/azure-sdk-for-net/azureailanguagequestionanswering-samples/)|
|Conversational Language Understanding in [Python](/samples/azure/azure-sdk-for-python/conversationslanguageunderstanding-samples/) and [.NET](/samples/azure/azure-sdk-for-net/azureailanguageconversations-samples/)|

## Applied AI/Decision

|Link|Description|
|---|---|
|[Azure Form Recognizer SDKs for .NET/C#, Python, JavaScript/TypeScript and Java](/azure/applied-ai-services/form-recognizer/sdk-preview)|
|Extract structured data from forms, receipts, invoices, and cards using Form Recognizer in [Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/README.md#samples-for-azure-form-recognizer-client-library-for-python), [.NET](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md#common-scenarios-samples-for-client-library-version-400), [TypeScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v4/typescript/README.md#azure-form-recognizer-client-library-samples-for-typescript), [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v4/javascript/README.md#azure-form-recognizer-client-library-samples-for-javascript), and [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md#azure-form-recognizer-client-library-samples-for-java)|
|Use Form Recognizer to automate a paper based process using the [New patient registration with Form Recognizer workshop](https://newpatiente2e.github.io/docs/). ([Code](https://github.com/newpatiente2e/Contoso-New-Patient-App))|
|Metrics Advisor SDK samples in [Python](/samples/azure/azure-sdk-for-python/metricsadvisor-samples/), [.NET](/samples/azure/azure-sdk-for-net/azure-metrics-advisor-client-sdk-samples/), [TypeScript](/samples/azure/azure-sdk-for-js/ai-metrics-advisor-typescript/), [JavaScript](/samples/azure/azure-sdk-for-js/ai-metrics-advisor-javascript/) and [Java](/samples/azure/azure-sdk-for-java/metricsadvisor-java-samples/)|
|Multi-variate Anomaly Detector in [Python](https://github.com/Azure-Samples/AnomalyDetector/blob/master/samples-multivariate/sample_multivariate_detect.py), [.NET](https://github.com/Azure-Samples/AnomalyDetector/blob/master/samples-multivariate/Sample_multivaraiate_detect.cs) , [Javascript](https://github.com/Azure-Samples/AnomalyDetector/blob/master/samples-multivariate/sample_multivariate_detection.js) and [Java](https://github.com/Azure-Samples/AnomalyDetector/blob/master/samples-multivariate/MultivariateSample.java)|

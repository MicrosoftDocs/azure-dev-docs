---
ms.custom: overview
ms.topic: include
ms.date: 05/16/2025
ms.author: johalexander
author: ms-johnalex
ms.service: azure
---
## Resources for Azure OpenAI in Microsoft Foundry Models

Azure OpenAI in Microsoft Foundry Models provides REST API access to the powerful language models available in OpenAI. Azure OpenAI helps you adapt these models to accomplish specific tasks, such as content generation, summarization, image understanding, semantic search, and natural language to code translation. Access Azure OpenAI by using the REST APIs, the OpenAI SDK for Python, or via the [Microsoft Foundry portal](/azure/ai-studio/azure-openai-in-ai-studio).

### Libraries

|Link|Description|
|---|---|
|[OpenAI SDK for .NET](https://aka.ms/oai/net/sdk)|The OpenAI .NET library provides convenient access to the OpenAI REST API from .NET applications. It can connect to Azure OpenAI resources or to the non-Azure OpenAI inference endpoint, making it a great choice for even non-Azure OpenAI development.|
|[OpenAI SDK Releases](https://azure.github.io/azure-sdk/?search=openai)|Links to all OpenAI SDK library packages, including links for .NET, Java, JavaScript and Go.|
|[OpenAI NuGet package](https://www.nuget.org/packages/OpenAI)|The NuGet version of the  OpenAI client library for .NET.|

### Samples

|Link|Description|
|---|---|
|[.NET OpenAI MCP Agent](https://github.com/Azure-Samples/openai-mcp-agent-dotnet)|This sample is an MCP agent app written in .NET, using Azure OpenAI, with a remote MCP server written in TypeScript.|
|[AI Travel Agents](https://github.com/Azure-Samples/azure-ai-travel-agents)|The **AI Travel Agents** is a robust enterprise application that leverages multiple AI agents to enhance travel agency operations. The application demonstrates how six AI agents collaborate to assist employees in handling customer queries, providing destination recommendations, and planning itineraries.|
|[deepseek-dotnet](https://github.com/Azure-Samples/deepseek-dotnet)|This is a sample chat demo that showcases the capabilities of DeepSeek-R1.|
|[Completions](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/tests/Samples)|A collection of 10 samples that demonstrate how to use the Azure OpenAI client library for .NET to chat, stream replies, use your own data, transcribe/translate audio, generate images, etc.|
|[OpenAI with Microsoft Entra ID Role based access control](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at authentication using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/ai-services/openai/how-to/managed-identity)|An article with more complex security scenarios that require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|
|[More samples](https://github.com/Azure-Samples/openai-dotnet-samples/blob/main/README.md)|A collection of OpenAI samples written in .NET.|

### Documentation

|Link|Description|
|---|---|
|[Azure OpenAI Service Documentation](/azure/ai-services/openai/)|The hub page for Azure OpenAI Service documentation.|
|[Overview of the .NET + AI ecosystem](/dotnet/ai/dotnet-ai-ecosystem)|Summary of the services and tools you might need to use in your applications, with links to learn more about each of them.|
|[Switch from OpenAI to Azure OpenAI](/azure/developer/ai/how-to/switching-endpoints?tabs=openai&pivots=dotnet)|A guidance article on the small changes you need to make to your code, so you can swap back and forth between OpenAI and the Azure OpenAI Service.|
[Microsoft Foundry Quickstart](/azure/ai-foundry/quickstarts/get-started-code?view=foundry&preserve-view=true&tabs=csharp)|The Microsoft Foundry SDK is available in multiple languages, including Python, Java, TypeScript, and C#.|
|[Build an AI chat app with .NET](/dotnet/ai/quickstarts/build-chat-app?pivots=openai)|Create a conversational .NET console chat app using an OpenAI or Azure OpenAI model. |
|[Connect to and prompt an AI model](/dotnet/ai/quickstarts/prompt-model?pivots=openai)|Create a .NET console chat app to connect to and prompt an OpenAI or Azure OpenAI model.|
|[Build a .NET AI vector search app](/dotnet/ai/quickstarts/quickstart-ai-chat-with-data)|Create a .NET console app to perform semantic search on a vector store to find relevant results for the user's query.|
|[Invoke .NET functions using an AI model](/dotnet/ai/quickstarts/use-function-calling?pivots=openai)|Create a .NET console AI chat app that connects to an AI model with local function calling enabled.|
|[Generate images using OpenAI.Images.ImageClient](/dotnet/ai/quickstarts/generate-images?pivots=openai)|Use the OpenAI DALL-E AI model. to generate an image.|

## Resources for other Azure AI services

In addition to Azure OpenAI Service, there are many other Azure AI services that help developers and organizations rapidly create intelligent, market-ready, and responsible applications with out-of-the-box and prebuilt customizable APIs and models. Example applications include natural language processing for conversations, search, monitoring, translation, speech, vision, and decision-making.

### Samples

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


### Documentation

|AI service|Description|API reference|Quickstart|
|---|---|---|---|
|[Content Safety](/azure/ai-services/content-safety/)|An AI service that detects unwanted content.|[Content Safety API reference](/dotnet/api/overview/azure/ai.contentsafety-readme?view=azure-dotnet&preserve-view=true)|[Quickstart](/azure/ai-services/content-safety/quickstart-text?tabs=visual-studio%2Cwindows&pivots=programming-language-csharp)|
|[Document Intelligence](/azure/ai-services/document-intelligence/)|Turn documents into intelligent data-driven solutions.|[Document Intelligence API reference](/dotnet/api/overview/azure/ai.documentintelligence-readme)|[Quickstart](/azure/ai-services/document-intelligence/quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&pivots=programming-language-csharp&preserve-view=true)|
|[Language](/azure/ai-services/language-service/)|Build apps with industry-leading natural language understanding capabilities.|[Language API reference](/dotnet/api/overview/azure/ai.textanalytics-readme?view=azure-dotnet&preserve-view=true)|[Quickstart](/azure/ai-services/language-service/text-analytics-for-health/quickstart?tabs=windows&pivots=programming-language-csharp)|
|[Search](/azure/search/)|Bring AI-powered cloud search to your applications.|[Search API reference](/dotnet/api/overview/azure/search?view=azure-dotnet&preserve-view=true)|[Quickstart](/azure/search/search-get-started-text?tabs=dotnet&preserve-view=true)|
|[Speech](/azure/ai-services/speech-service/)|Speech to text, text to speech, translation, and speaker recognition.|[Speech API reference](/dotnet/api/overview/azure/cognitiveservices/speech?view=azure-dotnet&preserve-view=true)|[Quickstart](/azure/ai-services/speech-service/get-started-speech-to-text?tabs=windows%2Cterminal&pivots=programming-language-csharp)|
|[Translator](/azure/ai-services/translator/)|Use AI-powered translation to translate more than 100 in-use, at-risk and endangered languages and dialects.|[Translation API reference](/dotnet/api/overview/azure/ai.translation.text-readme?view=azure-dotnet-preview&preserve-view=true)|[Quickstart](/azure/ai-services/translator/quickstart-text-sdk?pivots=programming-language-csharp&branch=main)|
|[Vision](/azure/ai-services/computer-vision/)|Analyze content in images and videos.|[Vision API reference](/dotnet/api/overview/azure/ai.vision.imageanalysis-readme)| [Quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library?tabs=windows%2Cvisual-studio&pivots=programming-language-csharp&branch=main)|

## Training

|Link|Description|
|---|---|
|[Generative AI for Beginners Workshop](https://github.com/microsoft/generative-ai-for-beginners/tree/main)|Learn the fundamentals of building Generative AI apps with our 18-lesson comprehensive course by Microsoft Cloud Advocates.|
|[AI Agents for Beginners Workshop](https://github.com/microsoft/ai-agents-for-beginners)|Learn the fundamentals of building Generative AI agents with our 10-lesson comprehensive course by Microsoft Cloud Advocates.|
|[Get started with Azure AI Services](/training/paths/get-started-azure-ai/)|Azure AI Services is a collection of services that are building blocks of AI functionality you can integrate into your applications. In this learning path, you'll learn how to provision, secure, monitor, and deploy Azure AI Services resources and use them to build intelligent solutions.|
|[Microsoft Azure AI Fundamentals: Generative AI](/training/paths/introduction-generative-ai/)|Training path to help you understand how large language models form the foundation of generative AI: how Azure OpenAI Service provides access to the latest generative AI technology, how prompts and responses can be fine-tuned and how Microsoft's responsible AI principles drive ethical AI advancements.|
|[Develop Generative AI solutions with Azure OpenAI Service](/training/paths/develop-ai-solutions-azure-openai/)|Azure OpenAI Service provides access to OpenAI's powerful large language models such as ChatGPT, GPT, Codex, and Embeddings models. This learning path teaches developers how to generate code, images, and text using the Azure OpenAI SDK and other Azure services.|

## AI app templates

AI app templates provide you with well-maintained, easy to deploy reference implementations that provide a high-quality starting point for your AI apps.

There are two categories of AI app templates, **building blocks** and **end-to-end solutions**. Building blocks are smaller-scale samples that focus on specific scenarios and tasks. End-to-end solutions are comprehensive reference samples including documentation, source code, and deployment to allow you to take and extend for your own purposes.

To review a list of key templates available for each programming language, see [AI app templates](/azure/developer/ai/intelligent-app-templates). To browse all available templates, see the AI app templates on the [AI App Template gallery](https://azure.github.io/ai-app-templates?tags=azureopenai&tags=dotnetCsharp).

---
ms.custom: overview
ms.topic: include
ms.date: 05/01/2025
ms.author: johalexander
author: ms-johnalex
ms.service: azure
---

## Resources for Azure OpenAI Service

Azure OpenAI Service provides REST API access to OpenAI's powerful language models. These models can be easily adapted to your specific task including but not limited to content generation, summarization, image understanding, semantic search, and natural language to code translation. Users can access the service through REST APIs, the OpenAI Node API Library, or via the [Azure AI Foundry portal](/azure/ai-studio/azure-openai-in-ai-studio).

### Libraries

|Package|Source code|npm|
|---|---|---|---|
|**OpenAI Node API Library**|[Source code](https://github.com/openai/openai-node/blob/master/README.md)|[Package](https://www.npmjs.com/package/openai)|
|**Azure OpenAI library for TypeScript**|[Source code](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai/README.md)|[Package](https://www.npmjs.com/package/@azure/openai)|

### Samples

|Link|Description|
|---|---|
|[DeepSeek on Azure](https://github.com/Azure-Samples/deepseek-azure-javascript)|Demonstrates how to use DeepSeek with JavaScript/TypeScript via the OpenAI Node.js client library or LangChain.js. DeepSeek excels at tasks requiring deep context understanding and complex reasoning. You may experience longer response times compared to other models, because it simulates a thought process (under the `<think>` tag) before providing an actual answer.|
|[Microblog AI](https://github.com/Azure-Samples/microblog-ai-swa-remix)|Microblog AI is an application that showcases the power of Azure Static Web Apps combined with Azure Functions and Server-Side Rendering (SSR) using Remix. The application leverages Azure OpenAI's GPT-4o artificial intelligence to enable the creation of microblogs in a simple and intuitive way.|
|[Completions](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai/samples/v2-beta/javascript/completions.js)|A simple example demonstrating how to get completions for the provided prompt.|
|[Streaming Chat Completions](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai/samples/v2-beta/javascript/streamChatCompletions.js)|A simple example demonstrating how to use  streaming chat completions.|
|[Switch from OpenAI to Azure OpenAI](https://aka.ms/azai/oai-to-aoai)|Article with guidance on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[OpenAI with Microsoft Entra ID Role based access control](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at authentication using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/ai-services/openai/how-to/managed-identity)|An article detailing more complex security scenarios require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|
|[LangChain.js with Azure OpenAI and Azure AI Search](https://github.com/Azure-Samples/azure-typescript-langchainjs)|Build an intelligent RAG agent with LangChain.js that evaluates whether questions can be answered using unstructured data in Azure AI Search, and delivers contextually relevant responses from that knowledge base when possible.|
|[More samples](https://aka.ms/oai/js/samples)|OpenAI samples covering a range of scenarios.|

### Documentation

|Link|Description|
|---|---|
|[Azure OpenAI Service Documentation](/azure/ai-services/openai/)|The hub page for Azure OpenAI Service documentation.|
|[Quickstart: Get started generating text using Azure OpenAI Service](/azure/ai-services/openai/quickstart?pivots=programming-language-javascript)|A quick set of instructions to set up the services you need and code you must write to prompt a model using JavaScript.|
|[Quickstart: Get started using GPT-35-Turbo and GPT-4 with Azure OpenAI Service](/azure/ai-services/openai/chatgpt-quickstart?pivots=programming-language-javascript)|Similar to the previous quickstart, but provides an example of system, assistant and user roles to tailor the content when asked certain questions.|
|[Quickstart: Chat with Azure OpenAI models using your own data](/azure/ai-services/openai/use-your-data-quickstart?pivots=programming-language-javascript)|Similar to the first quickstart, but this time you add your own data (like a PDF or other document).|
|[Quickstart: Get started using Azure OpenAI Assistants (Preview)](/azure/ai-services/openai/assistants-quickstart?pivots=programming-language-javascript)|Similar to the first quickstart in this list, but this time you tell the model to use the built-in Python code interpreter to solve math problems step by step. This is a starting point to using your own AI assistants accessed through custom instructions.|
|[Quickstart: Use images in your AI chats](/azure/ai-services/openai/gpt-v-quickstart?pivots=programming-language-studio)|How to programmatically ask the model to describe the contents of an image.|
|[Quickstart: Generate images with Azure OpenAI Service](/azure/ai-services/openai/dall-e-quickstart?pivots=programming-language-javascript)|Programmatically generate images using Dall-E based on a prompt.|

## Resources for other Azure AI services

In addition to Azure OpenAI Service, there are many other Azure AI services that help developers and organizations rapidly create intelligent, market-ready, and responsible applications with out-of-the-box and prebuilt customizable APIs and models. Example applications include natural language processing for conversations, search, monitoring, translation, speech, vision, and decision-making.

### Samples

|Link|Description|
|---|---|
|[Integrate Speech into your apps with Speech SDK Samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk)|A collection of samples for the Azure Cognitive Services Speech SDK. Links to samples for speech recognition, translation, speech synthesis, and more.|
|[Extract structured data from forms, receipts, invoices, and cards using Form Recognizer in JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v5/javascript/README.md#azure-form-recognizer-client-library-samples-for-javascript)|A collection of samples for the Azure.AI.FormRecognizer client library.|
|[Extract, classify, and understand text within documents using Text Analytics in JavaScript](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-latest&preserve-view=true)|The client Library for Text Analytics. This is part of the [Azure AI Language](/azure/ai-services/language-service) service, which provides Natural Language Processing (NLP) features for understanding and analyzing text.|
|[Document Translation in JavaScript](/azure/ai-services/translator/document-translation/quickstarts/document-translation-rest-api?pivots=programming-language-javascript)|A quickstart article that uses Document Translation to translate a source document into a target language while preserving structure and text formatting.|
|[Analyze images](/azure/ai-services/computer-vision/sdk/overview-sdk)|Sample code and setup documents for the Microsoft Azure AI Image Analysis SDK.|


### Documentation

|AI service|Description|API reference|Quickstart|
|---|---|---|---|
|[Content Safety](/azure/ai-services/content-safety/)|An AI service that detects unwanted content.|[Content Safety API reference](/javascript/api/overview/azure/ai-content-safety-rest-readme)|[Quickstart](/azure/ai-services/content-safety/quickstart-text?tabs=visual-studio%2Cwindows&pivots=programming-language-javascript)|
|[Document Intelligence](/azure/ai-services/document-intelligence/)|Turn documents into intelligent data-driven solutions.|[Document Intelligence API reference](/javascript/api/overview/azure/ai-form-recognizer-readme)|[Quickstart](/azure/ai-services/document-intelligence/quickstarts/get-started-sdks-rest-api?pivots=programming-language-javascript)|
|[Language](/azure/ai-services/language-service/)|Build apps with industry-leading natural language understanding capabilities.|[Text Analytics API reference](/javascript/api/overview/azure/ai-form-recognizer-readme)|[Quickstart](/azure/ai-services/language-service/text-analytics-for-health/quickstart?tabs=windows&pivots=programming-language-javascript)|
|[Search](/azure/search/)|Bring AI-powered cloud search to your applications.|[Search API reference](/javascript/api/overview/azure/search-documents-readme)|[Quickstart](/azure/search/search-get-started-text?tabs=javascript)|
|[Speech](/azure/ai-services/speech-service/)|Speech to text, text to speech, translation, and speaker recognition.|[Speech API reference](/javascript/api/overview/azure/microsoft-cognitiveservices-speech-sdk-readme)|[Quickstart](/azure/ai-services/speech-service/get-started-speech-to-text?tabs=windows%2Cterminal&pivots=programming-language-javascript)|
|[Translator](/azure/ai-services/translator/)|Use AI-powered translation to translate more than 100 in-use, at-risk and endangered languages and dialects.|[Translation API reference](/javascript/api/overview/azure/ai-translation-text-rest-readme)|[Quickstart](/azure/ai-services/translator/quickstart-text-sdk?pivots=programming-language-javascript)|
|[Vision](/azure/ai-services/computer-vision/)|Analyze content in images and videos.|[Image Analysis API reference](/javascript/api/overview/azure/ai-vision-image-analysis-rest-readme)|[Quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library?tabs=windows%2Cvisual-studio&pivots=programming-language-javascript)|

## Training

|Link|Description|
|---|---|
|[Generative AI for Beginners Workshop](https://github.com/microsoft/generative-ai-for-beginners/tree/main)|Learn the fundamentals of building Generative AI apps with our 18-lesson comprehensive course by Microsoft Cloud Advocates.|
|[Generative AI for JavaScript developers](https://github.com/microsoft/generative-ai-with-javascript)|This covers the basics of generative AI and how to build AI applications using JavaScript, from local development to deployment on Azure, up to running and scaling your AI models. The [YouTube playlist of videos](https://www.youtube.com/playlist?list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk) includes a series of videos around 10 minutes long, each focusing on a specific topic.|
|[AI Agents for Beginners Workshop](https://github.com/microsoft/ai-agents-for-beginners)|Learn the fundamentals of building Generative AI agents with our 10-lesson comprehensive course by Microsoft Cloud Advocates.|
|[Get started with Azure AI Services](/training/paths/get-started-azure-ai/)|Azure AI Services is a collection of services that are building blocks of AI functionality you can integrate into your applications. In this learning path, you learn how to provision, secure, monitor, and deploy Azure AI Services resources and use them to build intelligent solutions.|
|[Microsoft Azure AI Fundamentals: Generative AI](/training/paths/introduction-generative-ai/)|Training path to help you understand how large language models form the foundation of generative AI: how Azure OpenAI Service provides access to the latest generative AI technology, how prompts and responses can be fine-tuned and how Microsoft's responsible AI principles drive ethical AI advancements.|
|[Develop Generative AI solutions with Azure OpenAI Service](/training/paths/develop-ai-solutions-azure-openai/)|Azure OpenAI Service provides access to OpenAI's powerful large language models such as ChatGPT, GPT, Codex, and Embeddings models. This learning path teaches developers how to generate code, images, and text using the Azure OpenAI SDK and other Azure services.|
|[Build AI apps with Azure Database for PostgreSQL](/training/paths/build-ai-apps-azure-database-postgresql/)|This learning path explores how the Azure AI and Azure Machine Learning Services integrations provided by the Azure AI extension for Azure Database for PostgreSQL - Flexible Server can enable you to build AI-powered apps.|

## AI app templates

AI app templates provide you with well-maintained, easy to deploy reference implementations that provide a high-quality starting point for your AI apps.

There are two categories of AI app templates, **building blocks** and **end-to-end solutions**. Building blocks are smaller-scale samples that focus on specific scenarios and tasks. End-to-end solutions are comprehensive reference samples including documentation, source code, and deployment to allow you to take and extend for your own purposes.

To review a list of key templates available for each programming language, see [AI app templates](/azure/developer/ai/intelligent-app-templates?pivots=javascript). To browse all available templates, see the AI app templates on the [AI App Template gallery](https://azure.github.io/ai-app-templates?tags=azureopenai&tags=javascript).

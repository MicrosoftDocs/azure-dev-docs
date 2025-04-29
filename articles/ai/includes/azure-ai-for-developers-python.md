---
ms.custom: overview
ms.topic: include
ms.date: 04/28/2025
ms.author: johalexander
author: ms-johnalex
ms.service: azure
---
## Resources for Azure OpenAI Service

Azure OpenAI Service provides REST API access to OpenAI's powerful language models. These models can be easily adapted to your specific task including but not limited to content generation, summarization, image understanding, semantic search, and natural language to code translation. Users can access the service through REST APIs, the OpenAI SDK, or via the [Azure AI Foundry portal](/azure/ai-studio/azure-openai-in-ai-studio).

>[!INFO]
>While OpenAI and Azure OpenAI Service rely on a [common Python client library](https://github.com/openai/openai-python), small code changes are needed when using Azure OpenAI endpoints.

### SDKs and libraries

|Link|Description|
|---|---|
|[OpenAI SDK for Python](https://github.com/openai/openai-python/blob/main/README.md)|The GitHub source code version of the OpenAI Python library provides convenient access to the OpenAI API from applications written in the Python language.|
|[OpenAI Python Package](https://pypi.org/project/openai/)|The PyPi version of the OpenAI Python library.|
|[Switch from OpenAI to Azure OpenAI](https://aka.ms/azai/oai-to-aoai)|Guidance article on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[Streaming Chat completions](https://github.com/openai/openai-cookbook/blob/main/examples/azure/chat.ipynb)|A notebook containing example of getting chat completions to work using the Azure endpoints. This example focuses on chat completions but also touches on some other operations that are also available using the API.|
|[Embeddings](https://github.com/openai/openai-cookbook/blob/main/examples/azure/embeddings.ipynb)|A notebook demonstrating operations how to use embeddings that can be done using the Azure endpoints. This example focuses on embeddings but also touches some other operations that are also available using the API.|
|[Deploy a model and generate text](/azure/ai-services/openai/quickstart?pivots=programming-language-python)|An article with minimal, straightforward detailing steps to programmatically chat.|
|[OpenAI with Microsoft Entry ID Role based access control](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at authentication using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/ai-services/openai/how-to/managed-identity)|An article with more complex security scenarios requires Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|
|[More samples](https://github.com/Azure-Samples/openai/blob/main/README.md)|A compilation of useful Azure OpenAI Service resources and code samples to help you get started and accelerate your technology adoption journey.|

### Documentation

|Link|Description|
|---|---|
|[Azure OpenAI Service Documentation](/azure/ai-services/openai/)|The hub page for Azure OpenAI Service documentation.|
|[Quickstart: Get started generating text using Azure OpenAI Service](/azure/ai-services/openai/quickstart?tabs=command-line%2Cpython-new&pivots=programming-language-python)|A very quick set of instructions to set up the services you need and code you must write to prompt a model using Python.|
|[Quickstart: Get started using GPT-35-Turbo and GPT-4 with Azure OpenAI Service](/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line%2Cpython-new&pivots=programming-language-python)|Similar to the previous quickstart, but provides an example of system, assistant and user roles to tailor the content when asked certain questions.|
|[Quickstart: Chat with Azure OpenAI models using your own data](/azure/ai-services/openai/use-your-data-quickstart?tabs=command-line%2Cpython-new&pivots=programming-language-python)|Similar to the first quickstart, but this time you add your own data (like a PDF or other document).|
|[Quickstart: Get started using Azure OpenAI Assistants (Preview)](/azure/ai-services/openai/assistants-quickstart?tabs=command-line%2Ctypescript&pivots=programming-language-python)|Similar to the first quickstart in this list, but this time you tell the model to use the built-in Python code interpreter to solve math problems step by step. This is a starting point to using your own AI assistants accessed through custom instructions.|
|[Quickstart: Use images in your AI chats](/azure/ai-services/openai/gpt-v-quickstart?tabs=image%2Ccommand-line&pivots=programming-language-python)|How to programmatically ask the model to describe the contents of an image.|
|[Quickstart: Generate images with Azure OpenAI Service](/azure/ai-services/openai/dall-e-quickstart?tabs=dalle3%2Ccommand-line&pivots=programming-language-python)|Programmatically generate images using Dall-E based on a prompt.|

## Resources for other Azure AI services

In addition to Azure OpenAI Service, there are many other Azure AI services that help developers and organizations rapidly create intelligent, market-ready, and responsible applications with out-of-the-box and prebuilt customizable APIs and models. Example applications include natural language processing for conversations, search, monitoring, translation, speech, vision, and decision-making.

### Samples

|Link|Description|
|---|---|
|[Integrate Speech into your apps with Speech SDK Samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk)|Samples for the Azure Cognitive Services Speech SDK. Links to samples for speech recognition, translation, speech synthesis, and more.|
|[Azure AI Document Intelligence SDK](/azure/applied-ai-services/form-recognizer/sdk-preview)|Azure AI Document Intelligence (formerly Form Recognizer) is a cloud service that uses machine learning to analyze text and structured data from documents. The Document Intelligence software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Document Intelligence models and capabilities into your applications.|
|[Extract structured data from forms, receipts, invoices, and cards using Form Recognizer in Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/README.md#samples-for-azure-form-recognizer-client-library-for-python)|Samples for the Azure.AI.FormRecognizer client library.|
|[Extract, classify, and understand text within documents using Text Analytics in Python](/python/api/overview/azure/ai-textanalytics-readme?view=azure-python&preserve-view=true)|The client Library for Text Analytics. This is part of the [Azure AI Language](/azure/ai-services/language-service) service, which provides Natural Language Processing (NLP) features for understanding and analyzing text.|
|[Document Translation in Python](/azure/ai-services/translator/document-translation/quickstarts/document-translation-sdk?tabs=dotnet&pivots=programming-language-python)|A quickstart article that uses Document Translation to translate a source document into a target language while preserving structure and text formatting.|
|[Question Answering in Python](/azure/ai-services/language-service/question-answering/quickstart/sdk?tabs=windows&pivots=programming-language-csharp)|A quickstart article with steps to get an answer (and confidence score) from a body of text that you send along with your question.|
|[Conversational Language Understanding in Python](/python/api/overview/azure/ai-language-conversations-readme?view=azure-python&preserve-view=true)|The client library for Conversational Language Understanding (CLU), a cloud-based conversational AI service, which can extract intents and entities in conversations and acts like an orchestrator to select the best candidate to analyze conversations to get best response from apps like Qna, Luis, and Conversation App.|
|[Analyze images](/azure/ai-services/computer-vision/sdk/overview-sdk)|Sample code and setup documents for the Microsoft Azure AI Image Analysis SDK|
|[Azure AI Content Safety SDK for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/contentsafety/azure-ai-contentsafety)|Detects harmful user-generated and AI-generated content in applications and services. Content Safety includes text and image APIs that allow you to detect material that is harmful.|

### Documentation

|AI service|Description|API reference|Quickstart|
|---|---|---|---|
|[Content Safety](/azure/ai-services/content-safety/)|An AI service that detects unwanted content.|[Content Safety API reference](/python/api/overview/azure/ai-contentsafety-readme)|[Quickstart](/azure/ai-services/content-safety/quickstart-text?tabs=visual-studio%2Cwindows&pivots=programming-language-python)|
|[Document Intelligence](/azure/ai-services/document-intelligence/)|Turn documents into intelligent data-driven solutions.|[Document Intelligence API reference](/python/api/overview/azure/ai-formrecognizer-readme)|[Quickstart](/azure/ai-services/document-intelligence/quickstarts/get-started-sdks-rest-api?pivots=programming-language-python)|
|[Language](/azure/ai-services/language-service/)|Build apps with industry-leading natural language understanding capabilities.|[Text Analytics API reference](/python/api/overview/azure/ai-textanalytics-readme)|[Quickstart](/azure/ai-services/language-service/text-analytics-for-health/quickstart?tabs=windows&pivots=programming-language-python)|
|[Search](/azure/search/)|Bring AI-powered cloud search to your applications.|[Search API reference](/python/api/overview/azure/search)|[Quickstart](/azure/search/search-get-started-text?tabs=python)|
|[Speech](/azure/ai-services/speech-service/)|Speech to text, text to speech, translation, and speaker recognition.|[Speech API reference](/python/api/overview/azure/cognitiveservices/speech)|[Quickstart](/azure/ai-services/speech-service/get-started-speech-to-text?tabs=windows%2Cterminal&pivots=programming-language-python)|
|[Translator](/azure/ai-services/translator/)|Use AI-powered translation to translate more than 100 in-use, at-risk and endangered languages and dialects.|[Translation API reference](/python/api/overview/azure/ai-translation-document-readme)|[Quickstart](/azure/ai-services/translator/quickstart-text-sdk?pivots=programming-language-python)|
|[Vision](/azure/ai-services/computer-vision/)|Analyze content in images and videos.|[Image Analysis API reference](/python/api/overview/azure/ai-vision-imageanalysis-readme)|[Quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library?tabs=windows%2Cvisual-studio&pivots=programming-language-python)|

## Training

|Link|Description|
|---|---|
|[Generative AI for Beginners Workshop](https://github.com/microsoft/generative-ai-for-beginners/tree/main)|Learn the fundamentals of building Generative AI apps with our 18-lesson comprehensive course by Microsoft Cloud Advocates.|
|[AI Agents for Beginners Workshop](https://github.com/microsoft/ai-agents-for-beginners)|Learn the fundamentals of building Generative AI agents with our 10-lesson comprehensive course by Microsoft Cloud Advocates.|
|[Get started with Azure AI Services](/training/paths/get-started-azure-ai/)|Azure AI Services is a collection of services that are building blocks of AI functionality you can integrate into your applications. In this learning path, you'll learn how to provision, secure, monitor, and deploy Azure AI Services resources and use them to build intelligent solutions.|
|[Microsoft Azure AI Fundamentals: Generative AI](/training/paths/introduction-generative-ai/)|Training path to help you understand how large language models form the foundation of generative AI: how Azure OpenAI Service provides access to the latest generative AI technology, how prompts and responses can be fine-tuned and how Microsoft's responsible AI principles drive ethical AI advancements.|
|[Develop Generative AI solutions with Azure OpenAI Service](/training/paths/develop-ai-solutions-azure-openai/)|Azure OpenAI Service provides access to OpenAI's powerful large language models such as ChatGPT, GPT, Codex, and Embeddings models. This learning path teaches developers how to generate code, images, and text using the Azure OpenAI SDK and other Azure services.|
|[Build AI apps with Azure Database for PostgreSQL](/training/paths/build-ai-apps-azure-database-postgresql/)|This learning path explores how the Azure AI and Azure Machine Learning Services integrations provided by the Azure AI extension for Azure Database for PostgreSQL - Flexible Server can enable you to build AI-powered apps.|

## AI app templates

AI app templates provide you with well-maintained, easy to deploy reference implementations that provide a high-quality starting point for your AI apps.

There are two categories of AI app templates, **building blocks** and **end-to-end solutions**. Building blocks are smaller-scale samples that focus on specific scenarios and tasks. End-to-end solutions are comprehensive reference samples including documentation, source code, and deployment to allow you to take and extend for your own purposes.

To review a list of key templates available for each programming language, see [AI app templates](/azure/developer/ai/intelligent-app-templates). To browse all available templates, see the AI app templates on the [AI App Template gallery](https://azure.github.io/ai-app-templates?tags=azureopenai&tags=python).
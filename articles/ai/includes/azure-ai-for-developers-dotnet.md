## AI app templates

[AI app templates](/azure/developer/ai/intelligent-app-templates) provide you with well-maintained, easy to deploy reference implementations. These ensure a high-quality starting point for your AI apps. The end-to-end solutions provide popular, comprehensive reference applications. The building blocks are smaller-scale samples that focus on specific scenarios and tasks.

## Azure OpenAI Service

Azure OpenAI Service provides REST API access to OpenAI's powerful language models. These models can be easily adapted to your specific task including but not limited to content generation, summarization, image understanding, semantic search, and natural language to code translation. Users can access the service through REST APIs, Azure OpenAI SDK for .NET, or the web-based interface in the Azure OpenAI Studio.


### Libraries and samples

|Link|Description|
|---|---|
|[Azure OpenAI SDK for .NET](https://aka.ms/oai/net/sdk)|The GitHub source version of the Azure OpenAI client library for .NET is an adaptation of OpenAI's REST APIs that provides an idiomatic interface and rich integration with the rest of the Azure SDK ecosystem. It can connect to Azure OpenAI resources or to the non-Azure OpenAI inference endpoint, making it a great choice for even non-Azure OpenAI development.|
|[Azure OpenAI SDK Releases](https://azure.github.io/azure-sdk/?search=openai)|Links to all Azure OpenAI SDK library packages, including links for .NET, Java, JavaScript and Go.|
|[Azure.AI.OpenAI NuGet package](https://aka.ms/oai/net/nuget)|The NuGet version of the Azure OpenAI client library for .NET.|
|[Get started using GPT-35-Turbo and GPT-4](/azure/ai-services/openai/chatgpt-quickstart?pivots=programming-language-csharp&tabs=command-line)|An article that walks you through creating a chat completion sample.|
|[Get started using GPT-35-Turbo and GPT-4](/azure/ai-services/openai/chatgpt-quickstart?pivots=programming-language-csharp&tabs=command-line)|An article that walks you through creating a chat completion sample.|
|[Completions](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/tests/Samples)|A collection of 10 samples that demonstrate how to use the Azure OpenAI client library for .NET to chat, stream replies, use your own data, transcribe/translate audio, generate images, etc.|
|[Streaming Chat Completions](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/tests/Samples/StreamingChat.cs)|A deep link to the samples demonstrating streaming completions.|
|[OpenAI with Microsoft Entra ID Role based access control](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at authentication using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/ai-services/openai/how-to/managed-identity)|An article with more complex security scenarios that require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|
|[More samples](https://github.com/Azure-Samples/openai-dotnet-samples/blob/main/README.md)|A collection of OpenAI samples written in .NET.|

### Documentation

|Link|Description|
|---|---|
|[Azure OpenAI Service Documentation](/azure/ai-services/openai/)|The hub page for Azure OpenAI Service documentation.|
|[Overview of the .NET + AI ecosystem](/dotnet/ai/dotnet-ai-ecosystem)|Summary of the services and tools you might need to use in your applications, with links to learn more about each of them.|
|[Build an Azure AI chat app with .NET](/dotnet/ai/quickstarts/get-started-azure-openai)|Use Semantic Kernel or Azure OpenAI SDK to create a simple .NET 8 console chat application.|
|[Summarize text using Azure AI chat app with .NET](/dotnet/ai/quickstarts/quickstart-openai-summarize-text)|Simiar to the previous article, but the prompt is to summarize text.|
|[Get insight about your data from an .NET Azure AI chat app](/dotnet/ai/quickstarts/quickstart-ai-chat-with-data)|Use Semantic Kernel or Azure OpenAI SDK to get analytics and information about your data.|
|[Extend Azure AI using Tools and execute a local Function with .NET](/dotnet/ai/quickstarts/quickstart-azure-openai-tool)|Create an assistant that handles certain prompts using custom tools build in .NET.|
|[Generate images using Azure AI with .NET](/dotnet/ai/quickstarts/quickstart-openai-generate-images)|Use the OpenAI dell-e-3 model to generate an image.|

### Training

|Link|Description|
|---|---|
|[Generative AI for Beginners Workshop](https://github.com/microsoft/generative-ai-for-beginners/tree/main)|Learn the fundamentals of building Generative AI apps with our 18-lesson comprehensive course by Microsoft Cloud Advocates.|
|[Microsoft Azure AI Fundamentals: Generative AI](/training/paths/introduction-generative-ai/)|Training path to help you understand how large language models form the foundation of generative AI: how Azure OpenAI Service provides access to the latest generative AI technology, how prompts and responses can be fine-tuned and how Microsoft's responsible AI principles drive ethical AI advancements.|
|[Develop Generative AI solutions with Azure OpenAI Service](/training/paths/develop-ai-solutions-azure-openai/)|Azure OpenAI Service provides access to OpenAI's powerful large language models such as ChatGPT, GPT, Codex, and Embeddings models. This learning path teaches developers how to generate code, images, and text using the Azure OpenAI SDK and other Azure services.|



## Other Azure AI Services

Azure AI Services are a collection of services (including Azure OpenAI Service) that help developers and organizations rapidly create intelligent, market-ready, and responsbile applications with out-of-the-box and prebuilt customizable APIs and models. These services include speech, vision, search, and more.

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
|[Document Intelligence](/azure/ai-services/document-intelligence/)|Turn documents into intelligent data-driven solutions.|[Document Intelligence API reference](/dotnet/api/overview/azure/cognitiveservices/documentintelligence?view=azure-dotnet&preserve-view=true)|[Quickstart](/azure/ai-services/document-intelligence/quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&pivots=programming-language-csharp&preserve-view=true)|
|[Language](/azure/ai-services/language-service/)|Build apps with industry-leading natural landuage understanding capabilities.|[Language API reference](/dotnet/api/overview/azure/ai.textanalytics-readme?view=azure-dotnet&preserve-view=true)|[Quickstart](/azure/ai-services/language-service/text-analytics-for-health/quickstart?tabs=windows&pivots=programming-language-csharp)|
|[Search](/azure/search/)|Bring AI-powered cloud search to your applications.|[Search API reference](/dotnet/api/overview/azure/search?view=azure-dotnet&preserve-view=true)|[Quickstart](/azure/search/search-get-started-text?tabs=dotnet&preserve-view=true)|
|[Speech](/azure/ai-services/speech-service/)|Speech to text, text to speech, translation, and speaker recognition.|[Speech API reference](/dotnet/api/overview/azure/cognitiveservices/speech?view=azure-dotnet&preserve-view=true)|[Quickstart](/azure/ai-services/speech-service/get-started-speech-to-text?tabs=windows%2Cterminal&pivots=programming-language-csharp)|
|[Translator](/azure/ai-services/translator/)|Use AI-powered trnslation to translate more than 100 in-use, at-risk and endangered languages and dialects.|[Translation API reference](/dotnet/api/overview/azure/ai.translation.text-readme?view=azure-dotnet-preview&preserve-view=true)|[Quickstart](/azure/ai-services/translator/quickstart-text-sdk?pivots=programming-language-csharp&branch=main)|
|[Vision](/azure/ai-services/computer-vision/)|Analyze content in images and videos.|[Vision API reference](/dotnet/api/overview/azure/ai.vision.imageanalysis-readme)| [Quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library?tabs=windows%2Cvisual-studio&pivots=programming-language-csharp&branch=main)|

### Training

|Link|Description|
|---|---|
|[Get started with Azure AI Services](/training/paths/get-started-azure-ai/)|Azure AI Services is a collection of services that are building blocks of AI functionality you can integrate into your applications. In this learning path, you'll learn how to provision, secure, monitor, and deploy Azure AI Services resources and use them to build intelligent solutions.|

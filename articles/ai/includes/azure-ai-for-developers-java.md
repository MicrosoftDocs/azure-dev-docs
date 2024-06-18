## Resources for Azure OpenAI Service

Azure OpenAI Service provides REST API access to OpenAI's powerful language models. These models can be easily adapted to your specific task including but not limited to content generation, summarization, image understanding, semantic search, and natural language to code translation. Users can access the service through REST APIs, Azure OpenAI SDK for .NET, or the web-based interface in the Azure OpenAI Studio.

### Libraries and samples

|Link|Description|
|---|---|
|[**langchain4j-azure-open-ai**](https://github.com/langchain4j/langchain4j/tree/main/langchain4j-azure-open-ai)|[Releases](https://central.sonatype.com/artifact/dev.langchain4j/langchain4j-azure-open-ai/versions) [Maven package](https://central.sonatype.com/artifact/dev.langchain4j/langchain4j-azure-open-ai)|
|[**langchain4j-azure-ai-search**](https://github.com/langchain4j/langchain4j/tree/main/langchain4j-azure-ai-search)|[Releases](https://central.sonatype.com/artifact/dev.langchain4j/langchain4j-azure-ai-search/versions) [Maven](https://central.sonatype.com/artifact/dev.langchain4j/langchain4j-azure-ai-search)|
|**langchain4j-document-loader-azure-storage-blob**|[Releases](https://central.sonatype.com/artifact/dev.langchain4j/langchain4j-document-loader-azure-storage-blob/versions) [Maven](https://central.sonatype.com/artifact/dev.langchain4j/langchain4j-document-loader-azure-storage-blob/overview)|
|[Get started using GPT-35-Turbo and GPT-4](/azure/ai-services/openai/chatgpt-quickstart?pivots=programming-language-java&tabs=command-line)|An article that walks you through creating a chat completion sample.|
|[Completions](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-openai_1.0.0-beta.1/sdk/openai/azure-ai-openai/src/samples/java/com/azure/ai/openai/ChatbotSample.java)|A simple example demonstrating how to get completions for the provided prompt.|
|[Streaming Chat Completions](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-openai_1.0.0-beta.1/sdk/openai/azure-ai-openai/src/samples/java/com/azure/ai/openai/StreamingChatSample.java)|A simple example demonstrating how to use  streaming chat completions.|
|[Switch from OpenAI to Azure OpenAI](https://aka.ms/azai/oai-to-aoai)|An article with guidance on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[OpenAI with Microsoft Entra ID Role based access control](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|An article that looks at authentication using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/ai-services/openai/how-to/managed-identity)|An article detailing more complex security scenarios that require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|
|[More Samples](https://aka.ms/oai/java/samples)|The Azure OpenAI service samples are a set of self-contained Java programs that demonstrate interacting with Azure OpenAI service using the client library. Each sample focuses on a specific scenario and can be executed independently.|

### Documentation

|Link|Description|
|---|---|
|[Azure OpenAI Service Documentation](/azure/ai-services/openai/)|The hub page for Azure OpenAI Service documentation.|
|[Quickstart: Get started generating text using Azure OpenAI Service](/azure/ai-services/openai/quickstart?pivots=programming-language-java)|A very quick set of instructions to set up the services you need and code you must write to prompt a model using Java.|
|[Quickstart: Get started using GPT-35-Turbo and GPT-4 with Azure OpenAI Service](/azure/ai-services/openai/chatgpt-quickstart?pivots=programming-language-java)|Similar to the previous quickstart, but provides an example of system, assistant and user roles to tailor the content when asked certain questions.|
|[Quickstart: Get started using GPT-35-Turbo and GPT-4 with Azure OpenAI Service in IntelliJ](/azure/developer/java/toolkit-for-intellij/chatgpt-intellij)|Similar to the first quickstart, but provides an example of system, assistant and user roles to tailor the content when asked certain questions using IntelliJ.|
|[Quickstart: Chat with Azure OpenAI models using your own data](/azure/ai-services/openai/use-your-data-quickstart?pivots=programming-language-spring)|Similar to the first quickstart, but this time you add your own data (like a PDF or other document).|
|[Quickstart: Get started using Azure OpenAI Assistants (Preview)](/azure/ai-services/openai/assistants-quickstart?tabs=command-line%2Ctypescript&pivots=programming-language-python)|Similar to the first quickstart in this list, but this time you tell the model to use the built-in Python code interpreter to solve math problems step by step. This is a starting point to using your own AI assistants accessed through custom instructions.|
|[Quickstart: Use images in your AI chats](/azure/ai-services/openai/gpt-v-quickstart?pivots=programming-language-studio)|How to programmatically ask the model to describe the contents of an image.|
|[Quickstart: Generate images with Azure OpenAI Service](/azure/ai-services/openai/dall-e-quickstart?pivots=programming-language-java)|Programmatically generate images using Dall-E based on a prompt.|

## Resources for other Azure AI services

In addition to Azure OpenAI Service, there are many other Azure AI services that help developers and organizations rapidly create intelligent, market-ready, and responsbile applications with out-of-the-box and prebuilt customizable APIs and models. Example applications include natural language processing for conversations, search, monitoring, translation, speech, vision, and decision-making.

### Samples

|Link|Description|
|---|---|
|[Integrate Speech into your apps with Speech SDK Samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk)|A collection of samples for the Azure Cognitive Services Speech SDK. Links to samples for speech recognition, translation, speech synthesis, and more.|
|[Extract structured data from forms, receipts, invoices, and cards using Form Recognizer in Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md#azure-form-recognizer-client-library-samples-for-java)|A collection of samples for the Azure.AI.FormRecognizer client library.|
|[Extract, classify, and understand text within documents using Text Analytics in Java](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-stable&preserve-view=true)|The client Library for Text Analytics. This is part of the [Azure AI Language](/azure/ai-services/language-service) service, which provides Natural Language Processing (NLP) features for understanding and analyzing text.|
|[Document Translation in Java](/azure/ai-services/translator/document-translation/quickstarts/document-translation-rest-api?pivots=programming-language-java)|A quickstart article that explains how to use Document Translation to translate a source document into a target language while preserving structure and text formatting.|
|[Analyze images](/azure/ai-services/computer-vision/sdk/overview-sdk)|Sample code and setup documents for the Microsoft Azure AI Image Analysis SDK|

### Documentation

|AI service|Description|API reference|Quickstart|
|---|---|---|---|
|[Content Safety](/azure/ai-services/content-safety/)|An AI service that detects unwanted content.|[Content Safety API reference](/java/api/overview/azure/ai-contentsafety-readme)|[Quickstart](/azure/ai-services/content-safety/quickstart-text?tabs=visual-studio%2Cwindows&pivots=programming-language-java)|
|[Document Intelligence](/azure/ai-services/document-intelligence/)|Turn documents into intelligent data-driven solutions.|[Document Intelligence API reference](/java/api/overview/azure/ai-formrecognizer-readme)|[Quickstart](/azure/ai-services/document-intelligence/quickstarts/get-started-sdks-rest-api?pivots=programming-language-java)|
|[Language](/azure/ai-services/language-service/)|Build apps with industry-leading natural landuage understanding capabilities.|[Language API reference](/java/api/overview/azure/ai-textanalytics-readme)|[Quickstart](/azure/ai-services/language-service/text-analytics-for-health/quickstart?tabs=windows&pivots=programming-language-java)|
|[Search](/azure/search/)|Bring AI-powered cloud search to your applications.|[Search API reference](/java/api/overview/azure/search-documents-readme)|[Quickstart](/azure/search/search-get-started-text?tabs=java) |
|[Speech](/azure/ai-services/speech-service/)|Speech to text, text to speech, translation, and speaker recognition.|[Speech API reference](/java/api/overview/azure/search-documents-readme)|[Quickstart](/azure/ai-services/speech-service/get-started-speech-to-text?tabs=windows%2Cterminal&pivots=programming-language-java)|
|[Translator](/azure/ai-services/translator/)|Use AI-powered trnslation to translate more than 100 in-use, at-risk and endangered languages and dialects.|[Translator API reference](/java/api/overview/azure/ai-translation-text-readme)|[Quickstart](/azure/ai-services/translator/quickstart-text-sdk?pivots=programming-language-java)|
|[Vision](/azure/ai-services/computer-vision/)|Analyze content in images and videos.|[Vision API reference](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40?pivots=programming-language-java&tabs=visual-studio%2Cwindows)|[Quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library?tabs=windows%2Cvisual-studio&pivots=programming-language-java)|

## Training

|Link|Description|
|---|---|
|[Generative AI for Beginners Workshop](https://github.com/microsoft/generative-ai-for-beginners/tree/main)|Learn the fundamentals of building Generative AI apps with our 18-lesson comprehensive course by Microsoft Cloud Advocates.|
|[Get started with Azure AI Services](/training/paths/get-started-azure-ai/)|Azure AI Services is a collection of services that are building blocks of AI functionality you can integrate into your applications. In this learning path, you'll learn how to provision, secure, monitor, and deploy Azure AI Services resources and use them to build intelligent solutions.|
|[Microsoft Azure AI Fundamentals: Generative AI](/training/paths/introduction-generative-ai/)|Training path to help you understand how large language models form the foundation of generative AI: how Azure OpenAI Service provides access to the latest generative AI technology, how prompts and responses can be fine-tuned and how Microsoft's responsible AI principles drive ethical AI advancements.|
|[Develop Generative AI solutions with Azure OpenAI Service](/training/paths/develop-ai-solutions-azure-openai/)|Azure OpenAI Service provides access to OpenAI's powerful large language models such as ChatGPT, GPT, Codex, and Embeddings models. This learning path teaches developers how to generate code, images, and text using the Azure OpenAI SDK and other Azure services.|

## AI app templates

AI app templates provide you with well-maintained, easy to deploy reference implementations that provide a high-quality starting point for your AI apps.

There are two categories of AI app templates, **building blocks** and **end-to-end solutions**. Building blocks are smaller-scale samples that focus on specific scenarios and tasks. End-to-end solutions are comprehensive reference samples including documention, source code, and deployment to allow you to take and extend for your own purposes.

To review a list of key templates available for each programming language, see [AI app templates](/azure/developer/ai/intelligent-app-templates). To browse all available templates, see the AI app templates on the [Azure Developer CLI gallery](https://aka.ms/ai-apps).

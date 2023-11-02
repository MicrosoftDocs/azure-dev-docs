## Azure AI Reference Templates

Azure AI Reference Templates are our strategic investment to provide you with well-maintained, easy to deploy reference implementations. These ensure a production-ready starting point for your intelligent applications, distinguishing them from typical samples/guidance you might encounter on the web that often go stale as the underlying products evolve.

### Azure AI E2E Solutions

|Link|Description|
|---|---|
|[Build an enterprise chat app using your data with Azure OpenAI in Python](https://github.com/Azure-Samples/azure-search-openai-demo)|A sample app for the Retrieval-Augmented Generation pattern running in Azure, using Azure Cognitive Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences. Check out the [Get started](../python/get-started-app-chat-template) article that walks you through deployment.|
|[Get started with the enterprise chat app template for Python](../python/get-started-app-chat-template)|Walks you through deploying and using the [enterprise chat app](https://github.com/Azure-Samples/azure-search-openai-demo) (above) to get answers about employee benefits at a fictitious company with Python.|

### Azure AI Building Blocks

|Link|Description|
|---|---|
|[Build a chat app with Azure OpenAI in Python](https://github.com/Azure-Samples/chatgpt-quickstart/blob/main/README.md)|Simple Python Quart app that streams responses from ChatGPT to an HTML/JS frontend using JSON Lines over a ReadableStream.|
|[Build a LangCghain with Azure OpenAI in Python](https://github.com/Azure-Samples/function-python-ai-langchain)|Sample shows how to take a human prompt as HTTP Get or Post input, calculates the completions using chains of human input and templates. This is a starting point that can be used for more sophisticated chains.|
|[Build a ChatGGPT Plugin with Azure Container Apps in Python](https://github.com/Azure-Samples/openai-plugin-fastapi/blob/main/README.md)|Sample for creating ChatGPT Plugin using GitHub Codespaces, VS Code, and Azure. The sample includes templates to deploy the plugin to Azure Container Apps using the Azure Developer CLI.|

## Azure OpenAI

### Azure OpenAI E2E Solutions

|Link|Description|
|---|---|
|[Build an enterprise chat app using your data with Azure OpenAI in Python](https://github.com/Azure-Samples/azure-search-openai-demo)|A sample app for the Retrieval-Augmented Generation pattern running in Azure, using Azure Cognitive Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences. Check out the [Get started](../python/get-started-app-chat-template) article that walks you through deployment.|
|[Get started with the enterprise chat app template for Python](../python/get-started-app-chat-template)|Walks you through deploying and using the [enterprise chat app](https://github.com/Azure-Samples/azure-search-openai-demo) (above) to get answers about employee benefits at a fictitious company with Python.|

### Azure OpenAI Building Blocks

|Link|Description|
|---|---|
|[Build a chat app with Azure OpenAI in Python](https://github.com/Azure-Samples/chatgpt-quickstart/blob/main/README.md)|Simple Python Quart app that streams responses from ChatGPT to an HTML/JS frontend using JSON Lines over a ReadableStream.|
|[Build a LangCghain with Azure OpenAI in Python](https://github.com/Azure-Samples/function-python-ai-langchain)|Sample shows how to take a human prompt as HTTP Get or Post input, calculates the completions using chains of human input and templates. This is a starting point that can be used for more sophisticated chains.|
|[Build a ChatGGPT Plugin with Azure Container Apps in Python](https://github.com/Azure-Samples/openai-plugin-fastapi/blob/main/README.md)|Sample for creating ChatGPT Plugin using GitHub Codespaces, VS Code, and Azure. The sample includes templates to deploy the plugin to Azure Container Apps using the Azure Developer CLI.|
|[Vector Similarity Search with Azure Cache for Redis Enterprise](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/vector-similarity-search-with-azure-cache-for-redis-enterprise/ba-p/3822059)|Walkthrough of using Azure Cache for Redis as a backend vector store for RAG scenarios.|
|[OpenAI solutions with your own data using PostgreSQL](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/unlocking-the-power-of-open-ai-and-pgvector-with-azure/ba-p/3828539)|Discusses how Azure Database for PostgreSQL Flexible Server and Azure Cosmos DB for PostgreSQL have now introduced support for the pgvector extension, overview, scenarios, etc.|

### Azure OpenAI SDKs and other samples/guidance

|Link|Description|
|---|---|
|[OpenAI SDK for Python](https://github.com/openai/openai-python/blob/main/README.md)|GitHub source code version of the OpenAI Python library provides convenient access to the OpenAI API from applications written in the Python language. It includes a pre-defined set of classes for API resources that initialize themselves dynamically from API responses which makes it compatible with a wide range of versions of the OpenAI API.|
|[openai Python Package](https://pypi.org/project/openai/)|PyPi version of the OpenAI Python library (above).|
|[Get started using GPT-35-Turbo and GPT-4](/ai-services/openai/chatgpt-quickstart?pivots=programming-language-python&tabs=command-line)|DESCRIPTION NEEDED|
|[Completions](https://github.com/openai/openai-cookbook/blob/main/examples/azure/completions.ipynb)|Notebook containing an example of operations needed to get completions working using the Azure endpoints. This example focuses on completions but also touches on some other operations that are also available using the API.|
|[Streaming Chat completions](https://github.com/openai/openai-cookbook/blob/main/examples/azure/chat.ipynb)|Notebook containng example of getting chat completions to work using the Azure endpoints. This example focuses on chat completions but also touches on some other operations that are also available using the API.|
|[Switch from OpenAI to Azure OpenAI](https://aka.ms/azai/oai-to-aoai)|Guidance on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[Embeddings](https://github.com/openai/openai-cookbook/blob/main/examples/azure/embeddings.ipynb)|Notebook demonstrating operations how to use embeddings that can be done using the Azure endpoints. This example focuses on embeddings but also touches some other operations that are also available using the API.|
|[Finetuning](https://github.com/openai/openai-cookbook/blob/main/examples/azure/finetuning.ipynb)||
|[Deploy a model and generate text](/azure/cognitive-services/openai/quickstart?pivots=programming-language-python)|Minimal, straightforward steps to programmatically chat.|
|[OpenAI with Azure Active Directory Role based access control](/azure/cognitive-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at what's required to authenticate using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/cognitive-services/openai/how-to/managed-identity)|More complex security scenarios require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|
|[More samples](https://github.com/Azure-Samples/openai/blob/main/README.md)|This repo is a compilation of useful Azure OpenAI Service resources and code samples to help you get started and accelerate your technology adoption journey.|
|[More guidance](/ai-services/openai/)|DESCRIPTION NEEDED|

## Other Azure AI services

### Other Azure AI E2E Solutions

|Link|Description|
|---|---|
|[Captioning and Call Center Transcription](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios)|Repo containing samples for captioning and transcriptioning in a call center scenario.|
|Use Document Intelligence to automate a paper based process using the [New patient registration with Form Recognizer workshop](https://newpatiente2e.github.io/docs/) ([Code](https://github.com/newpatiente2e/Contoso-New-Patient-App))|DESCRIPTION NEEDED|

### Other Azure AI Building Blocks

|Link|Description|
|---|---|
|[Use Speech to converse with OpenAI](/azure/cognitive-services/speech-service/openai-speech?tabs=windows)|Use Azure AI Speech to converse with Azure OpenAI Service. The text recognized by the Speech service is sent to Azure OpenAI. The text response from Azure OpenAI is then synthesized by the Speech service.|
|[Translate documents from and into more than 100 different languages using Document Translation sample apps](https://github.com/MicrosoftTranslator/DocumentTranslation)|DESCRIPTION NEEDED|

### Other Azure AI SDKs and samples/guidance

|Link|Description|
|---|---|
|[Integrate Speech into your apps with Speech SDK Samples](/samples/azure-samples/cognitive-services-speech-sdk/sample-repository-for-the-microsoft-cognitive-services-speech-sdk/)|Samples for the Microsoft Cognitive Services Speech SDK. Links to samples for speech recognition, translation, speech synthesis, and more.|
|[Azure AI Document Intelligence SDK](/azure/applied-ai-services/form-recognizer/sdk-preview)|Azure AI Document Intelligence (formerly Form Recognizer) is a cloud service that uses machine learning to analyze text and structured data from documents. The Document Intelligence software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Document Intelligence models and capabilities into your applications.|
|[Extract structured data from forms, receipts, invoices, and cards using Form Recognizer in Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/README.md#samples-for-azure-form-recognizer-client-library-for-python)|Samples for the Azure.AI.FormRecognizer client library.|
|[Extract, classify, and understand text within documents using Text Analytics in Python](/python/api/overview/azure/ai-textanalytics-readme?view=azure-python&preserve-view=true)|Client Library for Text Analytics, which is part of the Azure Cognitive Service for Language, a cloud-based service that provides Natural Language Processing (NLP) features for understanding and analyzing text.|
|[Document Translation in Python](/azure/ai-services/translator/document-translation/quickstarts/document-translation-sdk?tabs=dotnet&pivots=programming-language-python)|Quickstart to use Document Translation to translate a source document into a target language while preserving structure and text formatting.|
|[Question Answering in Python](/azure/ai-services/language-service/question-answering/quickstart/sdk?tabs=windows&pivots=programming-language-csharp)|Quickstart to get an answer (and confidence score) from a body of text that you send along with your question.|
|[Conversational Language Understanding in Python](/python/api/overview/azure/ai-language-conversations-readme?view=azure-python&preserve-view=true)|Client library for Conversational Language Understanding (CLU), a cloud-based conversational AI service which can extract intents and entities in conversations and acts like an orchestrator to select the best candidate to analyze conversations to get best response from apps like Qna, Luis, and Conversation App.|
|[Analyze images](/samples/azure-samples/azure-ai-vision-sdk/azure-ai-vision-sdk-preview-samples/)|Hosts sample code and setup documents for the Microsoft Azure AI Vision SDK.|
|[Azure AI Content Safety SDK for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/contentsafety/azure-ai-contentsafety)|Detects harmful user-generated and AI-generated content in applications and services. Content Safety includes text and image APIs that allow you to detect material that is harmful.|

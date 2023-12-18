## Azure AI reference templates

Azure AI reference templates provide you with well-maintained, easy to deploy reference implementations. These ensure a high-quality starting point for your intelligent applications. The end-to-end solutions provide popular, comprehensive reference applications. The building blocks are smaller-scale samples that focus on specific scenarios and tasks.

### End-to-end solutions

|Link|Description|
|---|---|
|[Get started with the Python enterprise chat sample using RAG](../../python/get-started-app-chat-template.md)|An article that walks you through deploying and using the [Enterprise chat app sample for Python](https://github.com/Azure-Samples/azure-search-openai-demo). This sample is a complete end-to-end solution demonstrating the [Retrieval-Augmented Generation (RAG) pattern](/azure/search/retrieval-augmented-generation-overview) running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences. |

* [Demo video](https://aka.ms/azai/py/video)

### Building blocks

|Link|Description|
|---|---|
|[Build a chat app with Azure OpenAI in Python](https://github.com/Azure-Samples/chatgpt-quickstart/blob/main/README.md)|A simple Python Quart app that streams responses from ChatGPT to an HTML/JS frontend using JSON Lines over a ReadableStream.|
|[Build a LangChain with Azure OpenAI in Python](https://github.com/Azure-Samples/function-python-ai-langchain)|An Azure Functions sample that shows how to take a human prompt as HTTP Get or Post input, calculates the completions using chains of human input and templates. This is a starting point that can be used for more sophisticated chains.|
|[Build a ChatGPT Plugin with Azure Container Apps in Python](https://github.com/Azure-Samples/openai-plugin-fastapi/blob/main/README.md)|A sample for creating ChatGPT Plugin using GitHub Codespaces, VS Code, and Azure. The sample includes templates to deploy the plugin to Azure Container Apps using the Azure Developer CLI.|
|[Summarize Text using Azure AI Language with Azure Functions](https://github.com/Azure-Samples/function-python-ai-textsummarize)|Take text documents as input, summarize using Azure AI Language, and then output to another text document using Azure Functions.|
|[Azure AI Python Template Gallery](https://aka.ms/azai/py/gallery)|For the full list of Azure AI templates, visit our gallery. All app templates in our gallery can be spun up and deployed using a single command: _azd up_.|

## Azure OpenAI

### End-to-end solutions

|Link|Description|
|---|---|
|[Get started with the Python enterprise chat sample using RAG](../../python/get-started-app-chat-template.md)|An article that walks you through deploying and using the [Enterprise chat app sample for Python](https://github.com/Azure-Samples/azure-search-openai-demo). This sample is a complete end-to-end solution demonstrating the Retrieval-Augmented Generation (RAG) pattern running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences. |

### Building blocks

|Link|Description|
|---|---|
|[Build a chat app with Azure OpenAI in Python](https://github.com/Azure-Samples/chatgpt-quickstart/blob/main/README.md)|A simple Python Quart app that streams responses from ChatGPT to an HTML/JS frontend using JSON Lines over a ReadableStream.|
|[Build a LangChain with Azure OpenAI in Python](https://github.com/Azure-Samples/function-python-ai-langchain)|A sample shows how to take a human prompt as HTTP Get or Post input, calculates the completions using chains of human input and templates. This is a starting point that can be used for more sophisticated chains.|
|[Build a ChatGPT Plugin with Azure Container Apps in Python](https://github.com/Azure-Samples/openai-plugin-fastapi/blob/main/README.md)|A sample for creating ChatGPT Plugin using GitHub Codespaces, VS Code, and Azure. The sample includes templates to deploy the plugin to Azure Container Apps using the Azure Developer CLI.|
|[Vector Similarity Search with Azure Cache for Redis Enterprise](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/vector-similarity-search-with-azure-cache-for-redis-enterprise/ba-p/3822059)|A walkthrough using Azure Cache for Redis as a backend vector store for RAG scenarios.|
|[OpenAI solutions with your own data using PostgreSQL](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/unlocking-the-power-of-open-ai-and-pgvector-with-azure/ba-p/3828539)|An article discussing how Azure Database for PostgreSQL Flexible Server and Azure Cosmos DB for PostgreSQL supports the pgvector extension, along with an overview, scenarios, etc.|

### SDKs and other samples/guidance

|Link|Description|
|---|---|
|[OpenAI SDK for Python](https://github.com/openai/openai-python/blob/main/README.md)|The GitHub source code version of the OpenAI Python library provides convenient access to the OpenAI API from applications written in the Python language.|
|[Azure OpenAI SDK Releases](https://azure.github.io/azure-sdk/?search=openai)|Links to all Azure OpenAI SDK library packages, including links for .NET, Java, JavaScript and Go.|
|[openai Python Package](https://pypi.org/project/openai/)|The PyPi version of the OpenAI Python library.|
|[Get started using GPT-35-Turbo and GPT-4](/azure/ai-services/openai/chatgpt-quickstart?pivots=programming-language-python&tabs=command-line)|An article that walks you through creating a chat completion sample.|
|[Completions](https://github.com/openai/openai-cookbook/blob/main/examples/azure/completions.ipynb)|A notebook containing an example of operations needed to get completions working using the Azure endpoints. This example focuses on completions but also touches on some other operations that are also available using the API.|
|[Streaming Chat completions](https://github.com/openai/openai-cookbook/blob/main/examples/azure/chat.ipynb)|A notebook containing example of getting chat completions to work using the Azure endpoints. This example focuses on chat completions but also touches on some other operations that are also available using the API.|
|[Switch from OpenAI to Azure OpenAI](https://aka.ms/azai/oai-to-aoai)|Guidance article on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[Embeddings](https://github.com/openai/openai-cookbook/blob/main/examples/azure/embeddings.ipynb)|A notebook demonstrating operations how to use embeddings that can be done using the Azure endpoints. This example focuses on embeddings but also touches some other operations that are also available using the API.|
|[Deploy a model and generate text](/azure/ai-services/openai/quickstart?pivots=programming-language-python)|An article with minimal, straightforward detailing steps to programmatically chat.|
|[OpenAI with Microsoft Entry ID Role based access control](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at authentication using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/ai-services/openai/how-to/managed-identity)|An article with more complex security scenarios requires Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|
|[More samples](https://github.com/Azure-Samples/openai/blob/main/README.md)|A compilation of useful Azure OpenAI Service resources and code samples to help you get started and accelerate your technology adoption journey.|
|[More guidance](/azure/ai-services/openai/)|The hub page for Azure OpenAI Service documentation.|

## Other Azure AI services

### End-to-end solutions

|Link|Description|
|---|---|
|[Captioning and Call Center Transcription](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios)|A repo containing samples for captions and transcriptions in a call center scenario.|
|Use Document Intelligence to automate a paper based process using the [New patient registration with Form Recognizer workshop](https://newpatiente2e.github.io/docs/) ([Code](https://github.com/newpatiente2e/Contoso-New-Patient-App))|A workshop style presentation that walks you through how to use Document Intelligence to convert and automate a paper-based process.|

### Building blocks

|Link|Description|
|---|---|
|[Use Speech to converse with OpenAI](/azure/ai-services/speech-service/openai-speech?tabs=windows)|Use Azure AI Speech to converse with Azure OpenAI Service. The text recognized by the Speech service is sent to Azure OpenAI. The Speech service synthesizes the text response from Azure OpenAI.|
|[Translate documents from and into more than 100 different languages using Document Translation sample apps](https://github.com/MicrosoftTranslator/DocumentTranslation)|A repo containing both a Command Line tool and Windows application that serves as a local interface to the Azure Document Translation service for Windows, macOS and Linux.|

### SDKs and samples/guidance

|Link|Description|
|---|---|
|[Integrate Speech into your apps with Speech SDK Samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk)|Samples for the Azure Cognitive Services Speech SDK. Links to samples for speech recognition, translation, speech synthesis, and more.|
|[Azure AI Document Intelligence SDK](/azure/applied-ai-services/form-recognizer/sdk-preview)|Azure AI Document Intelligence (formerly Form Recognizer) is a cloud service that uses machine learning to analyze text and structured data from documents. The Document Intelligence software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Document Intelligence models and capabilities into your applications.|
|[Extract structured data from forms, receipts, invoices, and cards using Form Recognizer in Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/README.md#samples-for-azure-form-recognizer-client-library-for-python)|Samples for the Azure.AI.FormRecognizer client library.|
|[Extract, classify, and understand text within documents using Text Analytics in Python](/python/api/overview/azure/ai-textanalytics-readme?view=azure-python&preserve-view=true)|The client Library for Text Analytics. This is part of the [Azure AI Language](/azure/ai-services/language-service) service, which provides Natural Language Processing (NLP) features for understanding and analyzing text.|
|[Document Translation in Python](/azure/ai-services/translator/document-translation/quickstarts/document-translation-sdk?tabs=dotnet&pivots=programming-language-python)|A quickstart article that uses Document Translation to translate a source document into a target language while preserving structure and text formatting.|
|[Question Answering in Python](/azure/ai-services/language-service/question-answering/quickstart/sdk?tabs=windows&pivots=programming-language-csharp)|A quickstart article with steps to get an answer (and confidence score) from a body of text that you send along with your question.|
|[Conversational Language Understanding in Python](/python/api/overview/azure/ai-language-conversations-readme?view=azure-python&preserve-view=true)|The client library for Conversational Language Understanding (CLU), a cloud-based conversational AI service, which can extract intents and entities in conversations and acts like an orchestrator to select the best candidate to analyze conversations to get best response from apps like Qna, Luis, and Conversation App.|
|[Analyze images](/samples/azure-samples/azure-ai-vision-sdk/azure-ai-vision-sdk-preview-samples/)|Sample code and setup documents for the Microsoft Azure AI Vision SDK|
|[Azure AI Content Safety SDK for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/contentsafety/azure-ai-contentsafety)|Detects harmful user-generated and AI-generated content in applications and services. Content Safety includes text and image APIs that allow you to detect material that is harmful.|

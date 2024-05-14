## Azure AI reference templates

Azure AI reference templates are well-maintained, easily deployed reference implementations. These ensure a high-quality starting point for your AI applications. The **end-to-end solutions** provide popular, comprehensive reference applications. The **building blocks** are smaller-scale samples that focus on specific scenarios and tasks.

[Learn more about about the reference templates and other building blocks](../azure-ai-for-developers.md), or 
[Get started with the Python enterprise chat sample using RAG](../../python/get-started-app-chat-template.md), an article that walks you through deploying and using the [Enterprise chat app sample for Python](https://github.com/Azure-Samples/azure-search-openai-demo). This sample is a complete end-to-end solution demonstrating the [Retrieval-Augmented Generation (RAG) pattern](/azure/search/retrieval-augmented-generation-overview) running in Azure, using Azure AI Search for retrieval and Azure OpenAI large language models to power ChatGPT-style and Q&A experiences.


### Azure OpenAI Service documentation

|Link|Description|
|---|---|
|[Azure OpenAI Service Documentation](/azure/ai-services/openai/)|The hub page for Azure OpenAI Service documentation.|
|[OpenAI SDK for Python](https://github.com/openai/openai-python/blob/main/README.md)|The GitHub source code version of the OpenAI Python library provides convenient access to the OpenAI API from applications written in the Python language.|
|[openai Python Package](https://pypi.org/project/openai/)|The PyPi version of the OpenAI Python library.|
|[Switch from OpenAI to Azure OpenAI](https://aka.ms/azai/oai-to-aoai)|Guidance article on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[Get started using GPT-35-Turbo and GPT-4](/azure/ai-services/openai/chatgpt-quickstart?pivots=programming-language-python&tabs=command-line)|An article that walks you through creating a chat completion sample.|


### Azure OpenAI Service training

|Link|Description|
|---|---|
|[Generative AI for Beginners Workshop](https://github.com/microsoft/generative-ai-for-beginners/tree/main)|Learn the fundamentals of building Generative AI applications with our 18-lesson comprehensive course by Microsoft Cloud Advocates.|
|[Microsoft Azure AI Fundamentals: Generative AI](https://learn.microsoft.comtraining/paths/introduction-generative-ai/)|Training path to help you understand how large language models form the foundation of generative AI: how Azure OpenAI Service provides access to the latest generative AI technology, how prompts and responses can be fine-tuned and how Microsoft's responsible AI principles drive ethical AI advancements.|
|[Get started with Azure AI Services](https://learn.microsoft.com/training/paths/get-started-azure-ai/)|Azure AI Services is a collection of services that are building blocks of AI functionality you can integrate into your applications. In this learning path, you'll learn how to provision, secure, monitor, and deploy Azure AI Services resources and use them to build intelligent solutions.|
|[Develop Generative AI solutions with Azure OpenAI Service](https://learn.microsoft.com/training/paths/develop-ai-solutions-azure-openai/)|Azure OpenAI Service provides access to OpenAI's powerful large language models such as ChatGPT, GPT, Codex, and Embeddings models. This learning path teaches developers how to generate code, images, and text using the Azure OpenAI SDK and other Azure services.|
|[Build AI Apps with Azure Database for PostgreSQL](https://learn.microsoft.com/training/paths/build-ai-apps-azure-database-postgresql/)|This learning path explores how the Azure AI and Azure Machine Learning Services integrations provided by the Azure AI extension for Azure Database for PostgreSQL - Flexible Server can enable you to build AI-powered apps.|


### Azure OpenAI Service samples

|Link|Description|
|---|---|
|[Streaming Chat completions](https://github.com/openai/openai-cookbook/blob/main/examples/azure/chat.ipynb)|A notebook containing example of getting chat completions to work using the Azure endpoints. This example focuses on chat completions but also touches on some other operations that are also available using the API.|
|[Embeddings](https://github.com/openai/openai-cookbook/blob/main/examples/azure/embeddings.ipynb)|A notebook demonstrating operations how to use embeddings that can be done using the Azure endpoints. This example focuses on embeddings but also touches some other operations that are also available using the API.|
|[Deploy a model and generate text](/azure/ai-services/openai/quickstart?pivots=programming-language-python)|An article with minimal, straightforward detailing steps to programmatically chat.|
|[OpenAI with Microsoft Entry ID Role based access control](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at authentication using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/ai-services/openai/how-to/managed-identity)|An article with more complex security scenarios requires Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|
|[More samples](https://github.com/Azure-Samples/openai/blob/main/README.md)|A compilation of useful Azure OpenAI Service resources and code samples to help you get started and accelerate your technology adoption journey.|



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
|[Analyze images](/azure/ai-services/computer-vision/sdk/overview-sdk)|Sample code and setup documents for the Microsoft Azure AI Image Analysis SDK|
|[Azure AI Content Safety SDK for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/contentsafety/azure-ai-contentsafety)|Detects harmful user-generated and AI-generated content in applications and services. Content Safety includes text and image APIs that allow you to detect material that is harmful.|

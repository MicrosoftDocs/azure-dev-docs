---
ms.custom: overview
ms.topic: include
ms.date: 01/30/2026
ms.author: johalexander
author: ms-johnalex
ms.service: azure
---
## Resources for Azure OpenAI in Microsoft Foundry Models

Azure OpenAI in Microsoft Foundry Models provides REST API access to OpenAI's powerful language models. These models can be easily adapted to your specific task including but not limited to content generation, summarization, image understanding, semantic search, and natural language to code translation. Users can access the service through REST APIs, the OpenAI Node API Library, or via the [Microsoft Foundry portal](/azure/ai-studio/azure-openai-in-ai-studio).

|Link|Description|
|---|---|
|[OpenAI SDK for Go](https://github.com/openai/openai-go)|The GitHub source version of the OpenAI SDK for Go.|
|[Switch from OpenAI to Azure OpenAI](/azure/developer/ai/how-to/switching-endpoints?tabs=openai&pivots=java)|Article with guidance on the small changes you need to make to your code in order to swap back and forth between OpenAI and the Azure OpenAI Service.|
|[Package (pkg.go.dev)](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai)|The Go package version of Azure OpenAI client module for Go.|
|[ChatCompletions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#example-package-GetChatCompletions)|A simple example demonstrating how to implement completions.|
|[ChatCompletions using Tools](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#example-package-GetChatCompletions_usingTools)|A simple example demonstrating how to implement completions using Functions.|
|[Streaming Chat Completions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#example-package-ChatCompletionStream)|A simple example demonstrating how to implement streaming completions.|
|[Image generation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#example-package-CreateImage)|A simple example of implementing image generation.|
|[Embeddings](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#example-package-Embeddings)|A simple example demonstrating how to create embeddings.|
|[Other examples](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#pkg-examples)|The Go package version of documentation for the OpenAI client module for Go.|
|[More guidance](/azure/ai-services/openai/)|The hub page for Azure OpenAI Service documentation.|

## Secure your Azure AI resources

|Link|Description|
|---|---|
|[OpenAI with Microsoft Entra ID Role based access control](/azure/cognitive-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)|A look at authentication using Microsoft Entra ID.|
|[OpenAI with Managed Identities](/azure/cognitive-services/openai/how-to/managed-identity)|An article detailing more complex security scenarios that require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.|

## Speech/Vision

|Link|Description|
|---|---|
|[Captioning and Call Center Transcription in Go](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios)|A repo containing samples for captions and transcriptions in a call center scenario.|
|[Integrate Speech into your apps with Speech SDK for Go](https://github.com/Microsoft/cognitive-services-speech-sdk-go)|The source for the Azure Cognitive Services Speech SDK.|

## Language

|Link|Description|
|---|---|
|[Extract, classify, and understand text within documents using Text Analytics in Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.0/textanalytics)|The client library for Text Analytics, which is part of the Azure Cognitive Service for Language, a cloud-based service that provides Natural Language Processing (NLP) features for understanding and analyzing text.|
|[Document Translation in Go](/azure/ai-services/translator/document-translation/quickstarts/document-translation-rest-api?pivots=programming-language-go)|A quickstart article showing how to use Document Translation to translate a source document into a target language while preserving structure and text formatting.|

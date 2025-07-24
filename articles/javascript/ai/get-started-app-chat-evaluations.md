---
title: "Evaluating JavaScript chat apps with Azure OpenAI"
description: "Learn how to effectively evaluate answers in your JavaScript RAG-based chat app using Azure OpenAI. Generate sample prompts, run evaluations, and analyze results."
ms.date: 06/23/2025
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-js, devx-track-js-ai, build-2024-intelligent-apps
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As a JavaScript developer new to Azure OpenAI, I want to evaluate the answers of my chat app and determine the best prompt.
---
# Get started with evaluating answers in a chat app in JavaScript

[!INCLUDE [evaluations-intro](../../ai/includes/evaluations-introduction.md)]

## Prerequisites

* Azure subscription.  [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true) 

* Deploy a chat app.

    * [JavaScript](get-started-app-chat-template.md)
    * [JavaScript with LangChain.js](get-started-app-chat-template-langchainjs.md)

* These chat apps load the data into the Azure AI Search resource. This resource is required for the evaluations app to work. Don't complete the **Clean up resources** section of the previous procedure.

    You need the following Azure resource information from that deployment, which is referred to as the **chat app** in this article:

    * Chat API URI: The service backend endpoint shown at the end of the `azd up` process.
    * Azure AI Search. The following values are required:
         * Resource name: The name of the Azure AI Search resource name, reported as `Search service` during the `azd up` process.
        * Index name: The name of the Azure AI Search index where your documents are stored. You can find the index name in the Azure portal for the Search service.

    The Chat API URL allows the evaluations to make requests through your backend application. The Azure AI Search information allows the evaluation scripts to use the same deployment as your backend, loaded with the documents.

    After you collect this information, you don’t need to use the **chat app** development environment again. This article refers to the **chat app** several times to show how the **Evaluations app** uses it. Don’t delete the **chat app** resources until you finish all steps in this article.

* A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

    #### [Codespaces (recommended)](#tab/github-codespaces)
    
    * GitHub account

    #### [Visual Studio Code](#tab/visual-studio-code)
    * [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
    * [Visual Studio Code](https://code.visualstudio.com/)
    * [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

    ---

[!INCLUDE [evaluations-procedure](../../ai/includes/evaluations-procedure.md)]

---
title: "Evaluating chat apps with Azure OpenAI"
description: "Learn how to effectively evaluate answers in your RAG-based chat app by using Azure OpenAI Service. Generate sample prompts, run evaluations, and analyze results."
ms.date: 12/19/2024
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai, build-2024-intelligent-apps
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As a Python developer new to Azure OpenAI Service, I want to evaluate the answers of my chat app and determine the best prompt.
---
# Get started with evaluating answers in a chat app in Python

[!INCLUDE [evaluations-intro](../ai/includes/evaluations-introduction.md)]

## Prerequisites

* An Azure subscription. [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true).
* Complete the [previous chat app procedure](get-started-app-chat-template.md) to deploy the chat app to Azure. This resource is required for the evaluations app to work. Don't complete the "Clean up resources" section of the previous procedure.

    You need the following Azure resource information from that deployment, which is referred to as the *chat app* in this article:

    * Chat API URI. The service backend endpoint shown at the end of the `azd up` process.
    * Azure AI Search. The following values are required:
         * **Resource name**: The name of the Azure AI Search resource name, reported as `Search service` during the `azd up` process.
        * **Index name**: The name of the Azure AI Search index where your documents are stored. You can find it in the Azure portal for the Search service.

    The Chat API URL allows the evaluations to make requests through your backend application. The Azure AI Search information allows the evaluation scripts to use the same deployment as your backend, loaded with the documents.

    After you have this information collected, you shouldn't need to use the chat app development environment again. It's referred to later in this article several times to indicate how the chat app is used by the evaluations app. Don't delete the chat app resources until you finish the entire procedure in this article.

* A [development container](https://containers.dev/) environment is available with all the dependencies that are required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally by using Visual Studio Code.

    #### [GitHub Codespaces (recommended)](#tab/github-codespaces)
    
    A GitHub account
    
    #### [Visual Studio Code](#tab/visual-studio-code)

    * [Docker Desktop](https://www.docker.com/products/docker-desktop/). Start Docker Desktop if it's not already running.
    * [Visual Studio Code](https://code.visualstudio.com/).
    * [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
    
    ---

[!INCLUDE [evaluations-procedure](../ai/includes/evaluations-procedure.md)]

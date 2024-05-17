---
title: "Evaluating chat apps with Azure OpenAI"
description: "Learn how to effectively evaluate answers in your RAG-based chat app using Azure OpenAI. Generate sample prompts, run evaluations, and analyze results."
ms.date: 05/15/2024
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai, build-2024-intelligent-apps
# CustomerIntent: As a python developer new to Azure OpenAI, I want to evaluate the answers of my chat app and determine the best prompt.
---
# Get started with evaluating answers in a chat app in Python

[!INCLUDE [evaluations-intro](../ai/includes/evaluations-introduction.md)]

## Prerequisites

* Azure subscription.  [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true) 
* Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access.

* Complete the [previous chat App procedure](get-started-app-chat-template.md) to deploy the chat app to Azure. This resource is required for the evaluations app to work. Don't complete the **Clean up resources** section of the previous procedure.      

    You'll need the following Azure resource information from that deployment, which is referred to as the **chat app** in this article:

    * Chat API URI: The service backend endpoint shown at the end of the `azd up` process. 
    * Azure AI Search. The following values are required:
         * Resource name: The name of the Azure AI Search resource name, reported as `Search service` during the `azd up` process.
        * Index name: The name of the Azure AI Search index where your documents are stored. This can be found in the Azure Portal for the Search service.

    The Chat API URL allows the evaluations to make requests through your backend application. The Azure AI Search information allows the evaluation scripts to use the same deployment as your backend, loaded with the documents. 

    Once you have this information collected, you shouldn't need to use the **chat app** development environment again. It's referred to later in this article several times to indicate how the **chat app** is used by the **Evaluations app**. Don't delete the **chat app** resources until you complete the entire procedure in this article.

* A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

    #### [Codespaces (recommended)](#tab/github-codespaces)
    
    * GitHub account
    
    #### [Visual Studio Code](#tab/visual-studio-code)
    * [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
    * [Visual Studio Code](https://code.visualstudio.com/)
    * [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    
    ---

[!INCLUDE [evaluations-procedure](../ai/includes/evaluations-procedure.md)]

---
title: "Evaluating JavaScript chat apps with Azure OpenAI"
description: "Learn how to effectively evaluate answers in your JavaScript RAG-based chat app using Azure OpenAI. Generate sample prompts, run evaluations, and analyze results."
ms.date: 01/31/2024
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-js, devx-track-js-ai
# CustomerIntent: As a JavaScript developer new to Azure OpenAI, I want to evaluate the answers of my chat app and determine the best prompt.
---
# Get started with evaluating answers in a chat app in JavaScript

[!INCLUDE [evaluations-intro](../ai/includes/evaluations-introduction.md)]

## Prerequisites

* Azure subscription.  [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true) 
* Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access.

* Complete the [previous chat App procedure](get-started-app-chat-template.md) to deploy the chat app to Azure. This procedure loads the data into the Azure AI Search resource. This resource is required for the evaluations app to work. Don't complete the **Clean up resources** section of the previous procedure.     

    You'll need the following Azure resource information from that deployment, which is referred to as the **chat app** in this article:

    * Web API URI: The URI of the deployed chat app API. 
    * Azure AI Search. The following values are required:
        * Resource name: The name of the Azure AI Search resource name.
        * Index name: The name of the Azure AI Search index where your documents are stored.
        * Query key: The key to query your Search index.
    * If you experimented with the chat app authentication, you need to disable user authentication so the evaluation app can access the chat app.

    Once you have this information collected, you shouldn't need to use the **chat app** development environment again. It's referred to later in this article several times to indicate how the **chat app** is used by the **Evaluations app**. Don't delete the **chat app** resources until you complete the entire procedure in this article.

* A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

    #### [Codespaces (recommended)](#tab/github-codespaces)
    
    * GitHub account
    
    #### [Visual Studio Code](#tab/visual-studio-code)
    * [Azure Developer CLI](../azure-developer-cli/install-azd.md?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
    * [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
    * [Visual Studio Code](https://code.visualstudio.com/)
    * [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    
    ---

[!INCLUDE [evaluations-procedure](../ai/includes/evaluations-procedure.md)]

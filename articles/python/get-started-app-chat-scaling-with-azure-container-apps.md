---
title: Get started scaling Python enterprise chat sample using RAG
description: Get started scaling Python chat app 
ms.date: 02/01/2024
ms.topic: get-started
ms.custom: devx-track-python, devx-track-python-ai
# CustomerIntent: As a python developer new to Azure OpenAI, I want to scale the app past rate limiting.
---

# Get started scaling a Python enterprise chat sample using Azure OpenAI

[!INCLUDE [aca-load-balancer-intro](../intro/includes/scaling-load-balancer-aca-introduction.md)]

## Prerequisites

* Azure subscription.  [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true) 
* Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access.

* A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

    #### [Codespaces (recommended)](#tab/github-codespaces)
    
    * GitHub account
    
    #### [Visual Studio Code](#tab/visual-studio-code)
    * [Azure Developer CLI](../azure-developer-cli/install-azd.md?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
    * [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
    * [Visual Studio Code](https://code.visualstudio.com/)
    * [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    
    ---

[!INCLUDE [py-deployment-procedure](../intro/includes/redeploy-procedure-py-chat.md)]

[!INCLUDE [locust load tests](../intro/includes/test-load-balancer-locust.md)]
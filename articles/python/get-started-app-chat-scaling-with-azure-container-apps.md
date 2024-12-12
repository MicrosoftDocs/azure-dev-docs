---
title: Scale Azure OpenAI for Python chat sample using RAG
description: Learn how to add load balancing to your application to extend the chat app beyond the Azure OpenAI token and model quota limits. 
ms.date: 05/13/2024
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai, build-2024-intelligent-apps
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As a Python developer new to Azure OpenAI, I want to scale my Azure OpenAI capacity to avoid rate limit errors.
---

# Scale Azure OpenAI for Python chat by using RAG with Azure Container Apps

[!INCLUDE [aca-load-balancer-intro](../ai/includes/scaling-load-balancer-introduction-azure-container-apps.md)]

## Prerequisites

* An Azure subscription. [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true).
* Access granted to Azure OpenAI in the Azure subscription that you want. Currently, you must apply to gain access to this service. To apply for access to Azure OpenAI, use the links in [Limited access for Azure OpenAI Service](https://aka.ms/oai/access) to complete the form.
* [Dev containers](https://containers.dev/) are available for both samples with all the dependencies that are required to complete this article. You can run the dev containers in GitHub Codespaces (in a browser) or locally by using Visual Studio Code.

    #### [GitHub Codespaces (recommended)](#tab/github-codespaces)
    
    * A GitHub account.
    
    #### [Visual Studio Code](#tab/visual-studio-code)

    * [Docker Desktop](https://www.docker.com/products/docker-desktop/). Start Docker Desktop if it's not already running
    * [Visual Studio Code](https://code.visualstudio.com/).
    * [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
    
    ---

[!INCLUDE [scaling-load-balancer-aca-procedure.md](../ai/includes/scaling-load-balancer-procedure-azure-container-apps.md)]

[!INCLUDE [py-deployment-procedure](../ai/includes/redeploy-procedure-chat.md)]

[!INCLUDE [logs](../ai/includes/scaling-load-balancer-logs-azure-container-apps.md)]

[!INCLUDE [capacity.md](../ai/includes/scaling-load-balancer-capacity.md)]

[!INCLUDE [py-aca-cleanup](../ai/includes/scaling-load-balancer-cleanup-azure-container-apps.md)]

## Sample code

Samples used in this article include:

* [Python chat app with Retrieval Augmented Generation (RAG)](https://github.com/Azure-Samples/azure-search-openai-demo)
* [Azure Load Balancer with Azure Container Apps](https://github.com/Azure-Samples/openai-aca-lb)

## Related content

Use [Azure Load Testing](/azure/load-testing/) to load test your chat app.

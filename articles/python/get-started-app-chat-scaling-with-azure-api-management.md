---
title: Scale OpenAI for Python with Azure API Management
description: Learn how to add load balancing with Azure API Management to your application to extend the chat app beyond the Azure OpenAI Models in Microsoft Foundry token and model quota limits. 
ms.date: 01/30/2026
ms.update-cycle: 180-days
ms.author: johalexander
author: ms-johnalex
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai, build-2024-intelligent-apps
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As a Python developer new to Azure OpenAI , I want to scale my Azure OpenAI Models in Microsoft Foundry capacity to avoid rate limit errors.
---

# Scale OpenAI for Python with Azure API Management

[!INCLUDE [apim-load-balancer-intro](../ai/includes/scaling-load-balancer-introduction-azure-api-management.md)]

## Prerequisites

* An Azure subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* [Dev containers](https://containers.dev/) are available for both samples, with all the dependencies that are required to complete this article. You can run the dev containers in GitHub Codespaces (in a browser) or locally by using Visual Studio Code.

    #### [GitHub Codespaces (recommended)](#tab/github-codespaces)
    
    * Only a [GitHub account](https://www.github.com/login) is required to use GitHub Codespaces.
    
    #### [Visual Studio Code](#tab/visual-studio-code)

    * [Docker Desktop](https://www.docker.com/products/docker-desktop/). Start Docker Desktop if it's not already running.
    * [Visual Studio Code](https://code.visualstudio.com/).
    * [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
    
    ---

[!INCLUDE [scaling-load-balancer-apim-procedure.md](../ai/includes/scaling-load-balancer-procedure-azure-api-management.md)]

[!INCLUDE [py-deployment-procedure](../ai/includes/redeploy-procedure-chat-azure-api-management.md)]

[!INCLUDE [capacity.md](../ai/includes/scaling-load-balancer-capacity.md)]

[!INCLUDE [py-apim-cleanup](../ai/includes/scaling-load-balancer-cleanup-azure-api-management.md)]

## Sample code

Samples used in this article include:

* [Python chat app with RAG](https://github.com/Azure-Samples/azure-search-openai-demo)
* [Azure Load Balancer with Azure API Management](https://github.com/Azure-Samples/openai-apim-lb)

## Related content

* View [Azure API Management diagnostic data in Azure Monitor](/azure/api-management/api-management-howto-use-azure-monitor#view-diagnostic-data-in-azure-monitor).
* Use [Azure Load Testing](/azure/load-testing/) to load test your chat app.

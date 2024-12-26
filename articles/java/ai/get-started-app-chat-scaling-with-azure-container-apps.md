---
title: Scale Azure OpenAI for Java Chat Sample Using RAG
description: Learn how to add load balancing to your Java solution to extend the chat app beyond the Azure OpenAI token and model quota limits. 
ms.date: 05/13/2024
ms.topic: get-started
ms.custom: devx-track-java, devx-track-java-ai, devx-track-extended-java, build-2024-intelligent-apps
# CustomerIntent: As a Java developer new to Azure OpenAI, I want to scale my OpenAI capacity to avoid rate limit errors.
---

# Scale Azure OpenAI for Java chat using RAG with Azure Container Apps

[!INCLUDE [aca-load-balancer-intro](../../ai/includes/scaling-load-balancer-introduction-azure-container-apps.md)]

## Prerequisites

* Azure subscription.  [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)

* Access granted to Azure OpenAI in the desired Azure subscription. Currently, only the application grants access to this service. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access.

* [Dev containers](https://containers.dev/) are available for both samples, with all dependencies required to complete this article. You can run the dev containers in GitHub Codespaces in a browser, or locally using Visual Studio Code.

    ### [Codespaces (recommended)](#tab/github-codespaces)
    
    * GitHub account
    
    ### [Visual Studio Code](#tab/visual-studio-code)
    * [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
    * [Visual Studio Code](https://code.visualstudio.com/)
    * [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
        
    ---

[!INCLUDE [scaling-load-balancer-aca-procedure.md](../../ai/includes/scaling-load-balancer-procedure-azure-container-apps.md)]

[!INCLUDE [py-deployment-procedure](../../ai/includes/redeploy-procedure-chat.md)]

[!INCLUDE [logs](../../ai/includes/scaling-load-balancer-logs-azure-container-apps.md)]

[!INCLUDE [capacity.md](../../ai/includes/scaling-load-balancer-capacity.md)]

[!INCLUDE [py-aca-cleanup](../../ai/includes/scaling-load-balancer-cleanup-azure-container-apps.md)]

## Sample code

The following samples are used in this article:

* [Java chat app with RAG](https://github.com/Azure-Samples/azure-search-openai-demo-java)
* [Load Balancer with Azure Container Apps](https://github.com/Azure-Samples/openai-aca-lb)

## Next step

* Use [Azure Load Testing](/azure/load-testing/) to load test your chat app.

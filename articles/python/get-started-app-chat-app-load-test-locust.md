---
title: Get started load testing Python enterprise chat sample using RAG
description: Get started load testing Python chat app. 
ms.date: 05/16/2024
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai, build-2024-intelligent-apps
# CustomerIntent: As a python developer new to Azure OpenAI, I want to load test my scaled app past rate limiting.
---

# Load testing Python chat app using RAG with Locust

This article provides the process to perform load testing on a Python chat application using the RAG pattern with Locust, a popular open-source load testing tool. The primary objective of load testing is to ensure that the expected load on your chat application doesn't exceed the current Azure OpenAI Transactions Per Minute (TPM) quota. By simulating user behavior under heavy load, you can identify potential bottlenecks and scalability issues in your application. This process is crucial for ensuring that your chat application remains responsive and reliable, even when faced with a high volume of user requests.

Watch the demonstration video to understand more about load testing the chat app. 
* [Video](https://www.youtube.com/watch?v=-oMqb6kBdDw)

> [!NOTE]
> This article uses one or more [AI app templates](../ai/intelligent-app-templates.md) as the basis for the examples and guidance in the article. AI app templates provide you with well-maintained, easy to deploy reference implementations that help to ensure a high-quality starting point for your AI apps.

## Prerequisites

* Azure subscription.  [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true) 
* Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access.
* [Dev containers](https://containers.dev/) are available for both samples, with all dependencies required to complete this article. You can run the dev containers in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

    #### [Codespaces (recommended)](#tab/github-codespaces)
        
    * You only need a [GitHub account](https://github.com/login)
    
    #### [Visual Studio Code](#tab/visual-studio-code)
    * [Azure Developer CLI](/azure/developer/azure-developer-cli)
    * [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
    * [Visual Studio Code](https://code.visualstudio.com/)
    * [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
        
    ---

* [Python chat app with RAG](get-started-app-chat-template.md) - if you configured your chat app to use one of the load balancing solutions, this article will help you test the load balancing. The load balancing solutions include [Azure Container Apps](get-started-app-chat-scaling-with-azure-container-apps.md).

## Open Load test sample app

The load test is in [Python chat app](get-started-app-chat-template.md) solution as a [Locust test](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/locustfile.py). You need to return to that article, deploy the solution, then use that dev container development environment to complete the following steps.

## Run the test

1. Install the dependencies for the load test.

    ```bash
    python3 -m pip install -r requirements-dev.txt
    ```

1. Start Locust, which uses the Locust test file: [locustfile.py](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/locustfile.py) found at the root of the repository.

    ```bash
    locust
    ```
1. Open the running Locust web site such as `http://localhost:8089`. 
1. Enter the following in the Locust web site.

    |Property|Value|
    |---|---|
    |Number of users|20|
    |Ramp up|1|
    |Host|`https://<YOUR-CHAT-APP-URL>.azurewebsites.net`|

    :::image type="content" source="./media/get-started-app-chat-app-load-test-locust/locust-test-settings.png" alt-text="Screenshot of Locust test with values filled in.":::

1. Select **Start Swarm** to start the test.
1. Select **Charts** to watch the test progress.

    :::image type="content" source="./media/get-started-app-chat-app-load-test-locust/locust-chart-results.png" alt-text="Screenshot of Locust chart during test run.":::

## Clean up resources

When you're done with load testing, clean up the resources. The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges. After you delete resource specific to this article, remember to return to the other chat app tutorial and follow the clean-up steps.

Return to the chat app article to [clean up](get-started-app-chat-template.md#clean-up-resources) those resources.

## Get help

If you have trouble using this load tester, log your issue to the [repository's Issues](https://github.com/Azure-samples/azure-search-openai-demo).

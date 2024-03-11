---
title: Get started load testing Python enterprise chat sample using RAG
description: Get started load testing Python chat app 
ms.date: 02/01/2024
ms.topic: get-started
ms.custom: devx-track-python, devx-track-python-ai
# CustomerIntent: As a python developer new to Azure OpenAI, I want to load test my scaled app past rate limiting.
---

# Load testing Python chat app using RAG with Locust

When your [load balanced chat app](get-started-app-chat-scaling-with-azure-container-apps.md) is ready to test, use this procedure to apply load using Locust. The local locust load test demonstrates the load balancer working. 
Watch the demonstration video to understand more about load testing the chat app. 
* [Video](https://www.youtube.com/watch?v=-oMqb6kBdDw)

## Prerequisites
* Azure subscription.  [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true) 
* Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access.
* [Dev containers](https://containers.dev/) are available for both samples, with all dependencies required to complete this article. You can run the dev containers in GitHub Codespaces (in a browser) or locally using Visual Studio Code.
    
#### [Codespaces (recommended)](#tab/github-codespaces)
    
* GitHub account
    
#### [Visual Studio Code](#tab/visual-studio-code)

* [Azure Developer CLI](../azure-developer-cli/install-azd.md?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
* [Visual Studio Code](https://code.visualstudio.com/) with [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    
---

* Deployed [load balancer](get-started-app-chat-scaling-with-azure-container-apps.md)
* Chat app deployed to use load balancer

## Run the test

1. Open the Python chat app sample's dev container with [Open in GitHub Codespaces](https://codespaces.new/Azure-Samples/azure-search-openai-demo) or [Visual Studio Code with your local computer](git-client://clone?repo=https%3A%2F%2Fgithub.com%2FAzure-Samples%2Fazure-search-openai-demo).
1. Install the dependencies for the load test.
    ```bash
    python3 -m pip install -r requirements-dev.txt
    ```
1. Instal the Locust load tester.
    ```bash
    python3 -m pip install locust
    ```
1. Start Locust, which uses the [Locust test file](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/locustfile.py) found at the root of the repository.
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

## View load balancer logs

To understand that the load balancer is switching between the three Azure OpenAI resources, use the Azure Container App logs. 
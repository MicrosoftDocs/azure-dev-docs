---
title: Get started load testing Python enterprise chat sample using RAG
description: Get started load testing Python chat app 
ms.date: 02/01/2024
ms.topic: get-started
ms.custom: devx-track-python, devx-track-python-ai
# CustomerIntent: As a python developer new to Azure OpenAI, I want to load test my scaled app past rate limiting.
---

# Load testing Python chat app using RAG with Locust

When your load balanced chat app is ready to test, use this procedure to apply load using Locust. The local locust load test demonstrates the load balancer working. 

**Chat app** available in these languages:

* [.NET](/dotnet/azure/ai/get-started-app-chat-template)
* [Java](/azure/developer/java/quickstarts/get-started-app-chat-template)
* [JavaScript](/azure/developer/javascript/get-started-app-chat-template)
* [Python](/azure/developer/python/get-started-app-chat-template)

Watch the demonstration video to understand more about load testing the chat app. 
* [Video](https://www.youtube.com/watch?v=-oMqb6kBdDw)

## Prerequisites
* Azure subscription.  [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true) 
* Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access.
* [Dev containers](https://containers.dev/) are available for both samples, with all dependencies required to complete this article. You can run the dev containers in GitHub Codespaces (in a browser) or locally using Visual Studio Code.
    
#### [Codespaces (recommended)](#tab/github-codespaces)
    
* You only need a [GitHub account](https://github.com/login)

#### [Visual Studio Code](#tab/visual-studio-code)

* [Azure Developer CLI](../azure-developer-cli/install-azd.md?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
* [Visual Studio Code](https://code.visualstudio.com/) with [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    
---

* Deployed load balancer with high quota
    * [Azure Container Apps solution](get-started-app-chat-scaling-with-azure-container-apps.md) with [OPENAI_CAPACITY set to 50](get-started-app-chat-scaling-with-azure-container-apps.md#configure-the-tokens-per-minute-quota-tpm)
* Chat app deployed to use load balancer
    * [.NET](/dotnet/azure/ai/get-started-app-chat-template)
    * [Java](/azure/developer/java/quickstarts/get-started-app-chat-template)
    * [JavaScript](/azure/developer/javascript/get-started-app-chat-template)
    * [Python](/azure/developer/python/get-started-app-chat-template)

## Open Load test sample app

The load test is the Python chat app repository:
* If you deployed the Python chat app, you need to return to that dev container to complete these steps.
* If you deployed a different language chat app, you need to open the Python dev container for the Python repository. 

#### [Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo)

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/Azure-Samples/azure-search-openai-demo)

---

## Run the test

1. Install the dependencies for the load test.

    ```bash
    python3 -m pip install -r requirements-dev.txt
    ```

1. Instal the Locust load tester.

    ```bash
    python3 -m pip install locust
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

## View load balancer logs

To understand that the load balancer is switching between the three Azure OpenAI resources, use the Azure Container App logs. 

* [View Azure Container Apps logs](get-started-app-chat-scaling-with-azure-container-apps.md#stream-logs-to-see-the-load-balancer-results) 

[!INCLUDE [py-aca-cleanup](../intro/includes/scaling-load-balancer-cleanup-azure-container-apps.md)]

[!INCLUDE [locust-clean-up-resources](../intro/includes/load-test-locust-clean-up.md)]

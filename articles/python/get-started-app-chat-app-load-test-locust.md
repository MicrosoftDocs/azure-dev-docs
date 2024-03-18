---
title: Get started load testing Python enterprise chat sample using RAG
description: Get started load testing Python chat app 
ms.date: 03/18/2024
ms.topic: get-started
ms.custom: devx-track-python, devx-track-python-ai
# CustomerIntent: As a python developer new to Azure OpenAI, I want to load test my scaled app past rate limiting.
---

# Load testing Python chat app using RAG with Locust

This article provides the process to perform load testing on a Python chat application using the RAG pattern with Locust, a popular open-source load testing tool. The primary objective of load testing is to ensure that the expected load on your chat application does not exceed the current Azure OpenAI Transactions Per Minute (TPM) quota. By simulating user behavior under heavy load, you can identify potential bottlenecks and scalability issues in your application. This process is crucial for ensuring that your chat application remains responsive and reliable, even when faced with a high volume of user requests.

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

* [Python chat app with RAG](get-started-app-chat-template.md) - if you configured your chat app to use one of the load balancing solutions, this article will help you test the load balancing. The load balancing solutions includ [Azure Container Apps](get-started-app-chat-scaling-with-azure-container-apps).

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

When you're done with load testing, clean up the resources. The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges. After you delete resource specific to this article, remember to return to the other chat app tutorial and follow the clean up steps.

### Clean up GitHub Codespaces

## Get help

If you have trouble using this load tester, log your issue to the [repository's Issues](https://github.com/Azure-samples/azure-search-openai-demo).

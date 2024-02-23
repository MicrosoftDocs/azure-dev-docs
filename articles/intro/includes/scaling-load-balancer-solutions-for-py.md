---
ms.custom: overview, devx-track-python
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

## Load testing the load balanced chat app

To test the load balancer with the Chat app, use the following procedure. The test is demonstrated in more detail in this [**YouTube demonstration**](https://www.youtube.com/live/-oMqb6kBdDw).

The [Python Locust test](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/locustfile.py) is available from the [Azure-Samples/azure-search-openai-demo](https://github.com/Azure-Samples/azure-search-openai-demo) repository. The test works with any Chat apps which conforms to the [HTTP protocol for AI chat apps](https://github.com/Azure-Samples/ai-chat-app-protocol). 

### Prerequisites

* The Chat app (re)deployed to use Container App load balancer.
* The Chat app URL: this is the URL for the client application.

### Run the test

1. If you don't have the [Azure-Samples/azure-search-openai-demo](https://github.com/Azure-Samples/azure-search-openai-demo) repository, clone it now or open its Codespace from GitHub. 

1. Install the dependencies for the test.

    ```bash
    python3 -m pip install -r requirements-dev.txt
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

    :::image type="content" source="../media/get-started-scaling-load-balancer-aca/locust-test-ui.png" alt-text="Screenshot of Locust test with values filled in.":::

1. Select **Start Swarm** to start the test.
1. Select **Charts** to watch the test progress.

    :::image type="content" source="../media/get-started-scaling-load-balancer-aca/locust-chart.png" alt-text="Screenshot of Locust chart during test run.":::

## View load balancer logs

To understand that the load balancer is switching between the three Azure OpenAI resources, use the Azure Container App logs. 
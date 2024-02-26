---
ms.custom: overview, devx-track-python
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

## Redeploy Chat app with load balancer endpoint

#### [Initial deployment](#tab/initial-deployment)

1. Open the chat app sample's dev container with [![GitHub Codespaces in a browser](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo) or [Visual Studio Code with your local computer](git-client://clone?repo=https%3A%2F%2Fgithub.com%2FAzure-Samples%2Fazure-search-openai-demo).

1. Sign in to Azure Developer CLI (AZD).

    ```bash
    azd auth login --use-device-code
    ```

    Finish the sign in instructions.

1. Create an AZD environment with a name such as `chat-app`.

    ```bash
    azd env new <name>
    ```

1. To run the script to set the load balancer environment variables, sign in to the Azure CLI (AZ).

    ```bash
    az login --use-device-code
    ```

1. Run the following bash script to configure the chat app to use the load balancer.

    ```bash
    bash scripts/load-balance-aca-setup.sh <RESOURCE-GROUP-NAME> <CONTAINER-APP-URL>
    ```

    This script adds environment variables to instruct the chat app where to send requests to Azure OpenAI. 

1. Deploy the chat app.

    ```bash
    azd up
    ```
    
    Wait until this process finishes before continuing.

#### [Redeployment](#tab/redeployment)

1. [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo) or [Visual Studio Code](git-client://clone?repo=https%3A%2F%2Fgithub.com%2FAzure-Samples%2Fazure-search-openai-demo).

1. To run the script to set the load balancer environment variables, sign in to the Azure CLI (AZ).

    ```bash
    az login --use-device-code
    ```

1. Run the following bash script to configure the chat app to use the load balancer.

    ```bash
    bash scripts/load-balance-aca-setup.sh <RESOURCE-GROUP-NAME> <CONTAINER-APP-URL>
    ```

    This script adds environment variables to instruct the chat app where to send requests to Azure OpenAI. 

1. Deploy the chat app.

    ```bash
    azd up
    ```
    
    Wait until this process finishes before continuing.

---

You can know use the chat app with the confidence that it's built to scale across many users without running out of quota. 


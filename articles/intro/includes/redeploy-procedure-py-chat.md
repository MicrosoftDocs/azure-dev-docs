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

This process uses two different CLIs:

* Azure Developer CLI (AZD): 
    * Create environment for deployment
    * Deploy chat app 
* Azure CLI (AZ):
    * Run bash script to get Azure Container App ingress FQDN URL, which also uses AZD to set environment variables in deployment environment

1. Open the chat app sample's dev container with [GitHub Codespaces](https://codespaces.new/Azure-Samples/azure-search-openai-demo) or [Visual Studio Code with your local computer](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/azure-search-openai-demo).

1. Sign in to Azure Developer CLI (AZD).

    ```bash
    azd auth login --use-device-code
    ```

    Finish the sign in instructions.

1. Create an AZD environment with a name such as `chat-app`.

    ```bash
    azd env new <name>
    ```

1. To run [the bash script](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/scripts/load-balance-aca-setup.sh) to set the load balancer environment variables, sign in to the Azure CLI (AZ).

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

#### [Redeployment](#tab/redeployment)

This process uses two different CLIs:

* Azure Developer CLI (AZD): 
    * Deploy chat app 
* Azure CLI (AZ):
    * Run bash script to get Azure Container App ingress FQDN URL, which also uses AZD to set environment variables in deployment environment


1. Open the chat app sample's dev container with [GitHub Codespaces](https://codespaces.new/Azure-Samples/azure-search-openai-demo) or [Visual Studio Code](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/azure-search-openai-demo).

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

You can now use the chat app with the confidence that it's built to scale across many users without running out of quota. 


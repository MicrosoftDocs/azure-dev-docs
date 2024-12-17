---
ms.custom: overview
ms.topic: include
ms.date: 05/13/2024
ms.author: diberry
author: diberry
ms.service: azure
---

## Open Container Apps local balancer sample app

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

[![Open in GitHub Codespaces.](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/openai-aca-lb)

> [!IMPORTANT]
> All GitHub accounts can use GitHub Codespaces for up to 60 hours free each month with two core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally by using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

[![Open this project in Dev Containers.](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/Azure-Samples/openai-aca-lb)

---

## Deploy Azure Container Apps load balancer

1. Sign in to the Azure Developer CLI to provide authentication to the provisioning and deployment steps.

    ```bash
    azd auth login --use-device-code
    ```

1. Set an environment variable to use Azure CLI authentication to the post provision step.

    ```bash
    azd config set auth.useAzCliAuth "true"
    ```

1. Deploy the load balancer app.

    ```bash
    azd up
    ```

    Select a subscription and region for the deployment. They don't have to be the same subscription and region as the chat app.

1. Wait for the deployment to finish before you continue.

## Get the deployment endpoint

1. Use the following command to display the deployed endpoint for the container app.

    ```bash
    azd env get-values
    ```
    
1. Copy the `CONTAINER_APP_URL` value. You use it in the next section.

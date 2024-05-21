---
ms.custom: overview
ms.topic: include
ms.date: 05/11/2024
ms.author: diberry
author: diberry
ms.service: azure
---

## Open Azure API Management local balancer sample app

#### [Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

[![Open this project in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/openai-aca-lb)

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).



#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

[![Open this project in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/Azure-Samples/openai-aca-lb)

---

## Deploy Azure API Management load balancer


1. To deploy the load balancer to Azure, sign in to Azure Developer CLI (AZD).

    ```bash
    azd auth login
    ```

1. Finish the sign in instructions.
1. Deploy the load balancer app.

    ```bash
    azd up
    ```

    You'll need to select a subscription and region for the deployment. These don't have to be the same subscription and region as the chat app. 

1. Wait for the deployment to complete before continuing. This may take up to 30 minutes. 

## Get load balancer endpoint

Run the following bash command to see the environment variables from the deployment. You need this information later.

```bash
azd env get-values | grep APIM_GATEWAY_URL
```

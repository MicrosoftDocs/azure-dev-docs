---
ms.custom: overview, devx-track-python
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

## Open Container apps local balancer sample app

#### [Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/openai-aca-lb)

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).



#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

1. Clone the repository to your local computer. 

    ```bash
    git clone https://github.com/Azure-Samples/openai-aca-lb
    ```

1. When prompted, reopen the container. 

---

## Deploy Azure Container Apps load balancer


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

1. Wait for the deployment to complete before continuing.

## Get load balancer endpoint

1. Open the `.env` file in the `.azure/<ENVIRONMENT-NAME>/` folder and subfolder in the root of the load balancer sample.
1. Collect the following information from the Load balancer sample's `.env` file found in the `.azure` folder, within the named environment subfolder. You need this information later.

|Property|Example value|
|---|---|
|RESOURCE_GROUP_NAME| `<ENVIRONMENT-NAME>-rg`|
|CONTAINER_APP_URL|`https://<ACA-URL>.<LOCATION>.azurecontainerapps.io`|

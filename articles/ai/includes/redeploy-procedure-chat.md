---
ms.custom: overview
ms.topic: include
ms.date: 03/08/2024
ms.author: diberry
author: diberry
ms.service: azure
---

## Redeploy Chat app with load balancer endpoint

These are completed on the chat app sample. 

#### [Initial deployment](#tab/initial-deployment)

1. Open the chat app sample's dev container using one of the following choices.

    |Language|Codespaces|Visual Studio Code|
    |--|--|--|
    |.NET|[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo-csharp)|[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/azure-search-openai-demo-csharp)|
    |JavaScript|[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-javascript)|[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/azure-search-openai-javascript)|
    |Python|[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo)|[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/azure-search-openai-demo)|

1. Sign in to Azure Developer CLI (AZD).

    ```bash
    azd auth login
    ```

    Finish the sign in instructions.

1. Create an AZD environment with a name such as `chat-app`.

    ```bash
    azd env new <name>
    ```

1. Add the following environment variable, which tells the Chat app's backend to use a custom URL for the OpenAI requests.

    ```bash
    azd env set OPENAI_HOST azure_custom
    ```

1. Add the following environment variable, substituting `<CONTAINER_APP_URL>` for the URL from the previous section. This action  tells the Chat app's backend what the value is of the custom URL for the OpenAI request.

    ```bash
    azd env set AZURE_OPENAI_CUSTOM_URL <CONTAINER_APP_URL>
    ```

1. Deploy the chat app.

    ```bash
    azd up
    ```

#### [Redeployment](#tab/redeployment)

1. Reopen the chat app sample's dev container using one of the following choices.

    |Language|Codespaces|Visual Studio Code|
    |--|--|--|
    |.NET|[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo-csharp)|[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/azure-search-openai-demo-csharp)|
    |JavaScript|[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-javascript)|[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/azure-search-openai-javascript)|
    |Python|[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo)|[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/azure-search-openai-demo)|

1. Add the following environment variable, which tells the Chat app's backend to use a custom URL for the OpenAI requests.

    ```bash
    azd env set OPENAI_HOST azure_custom
    ```

1. Add the following environment variable, which tells the Chat app's backend what the value is of the custom URL for the OpenAI request.

    ```bash
    azd env set CONTAINER_APP_URL <CONTAINER_APP_URL>
    ```

1. Deploy the chat app.

    ```bash
    azd up
    ```
    
    Wait until this process finishes before continuing.

---

You can now use the chat app with the confidence that it's built to scale across many users without running out of quota. 

---
title: 
description: 
ms.date: 01/16/2024
ms.topic: get-started
ms.custom: devx-track-python, devx-track-python-ai
# CustomerIntent: As a python developer new to Azure OpenAI, I want evaluate the prompt answers of my chat app.
---

# Get started with evaluating prompt answers in a chat app

This article shows you how to evaluate a chat app that uses the RAG architecture. Whenever you are making changes to a RAG chat with the goal of improving the answers, you should evaluate the results. This demo application offers a tool you can use today to make it easier to run evaluations.

[Video overview of evaluations app](https://www.youtube.com/watch?v=mM8pZAI2C5w)

By following the instructions in this article, you will:

- Generate sample prompts for evaulation.
- Run evaluations against sample prompts.
- Review analysis of prompts.

Once you complete this procedure, you can evaluate your own chat app.

## Architectural overview

A simple architecture of the evaluations app is shown in the following diagram:

Key components of the architecture include:

* **Azure App Service**: The chat app runs in Azure App Service. The chat app conforms to the Chat protocol which allows the evaluations app to run against any chat app that conforms to the protocol.
* **Azure AI Search**: The chat app uses Azure AI Search to store the data from your own documents. 
* **Sample prompts generator**: Can generate N number of prompts for each document. The more prompts, the longer the evaluation.
* **Evaluations app** runs sample prompts against the chat app and returns the results.

## Prerequisites

* Azure subscription with Azure OpenAI enabled. It's best to use a GPT-4 model for performing the evaluation, even if your chat app uses GPT-3.5 or another model. 

* Complete the [previous Chat App procedure](get-started-app-chat-template.md) to deploy the Chat app to Azure. This procedure loads the data into the Azure AI Search resource. This resource is required for the evaluations app to work. Do not complete the **Clean up resources** section of the previous procedure.     

    You will need the following environment variables from that deployment:

    * AZURE_SEARCH_SERVICE: The name of the Azure AI Search resource name.
    * AZURE_SEARCH_INDEX: The name of the Azure AI Search index where your documents are stored.
    * AZURE_SEARCH_KEY: The admin key for the Azure AI Search resource.

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this article, you need the following prerequisites:

#### [Codespaces (recommended)](#tab/github-codespaces)

1. An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true) 
1. GitHub account

#### [Visual Studio Code](#tab/visual-studio-code)
1. An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)
1. [Azure Developer CLI](../azure-developer-cli/install-azd.md?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
1. [Visual Studio Code](https://code.visualstudio.com/)
1. [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## Open development environment

Begin now with a development environment that has all the dependencies installed to complete this article. 

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Start the process to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/ai-rag-chat-evaluator`](https://github.com/Azure-Samples/ai-rag-chat-evaluator) GitHub repository.
1. Right-click on the following button, and select _Open link in new windows_ in order to have both the development environment and the documentation available at the same time. 

    > [!div class="nextstepaction"]
    > [Open this project in GitHub Codespaces](https://github.com/codespaces/new?azure-portal=true&hide_repo_select=true&ref=main&repo=721389005)

1. On the **Create codespace** page, review the codespace configuration settings and then select **Create new codespace**

    :::image type="content" source="./media/get-started-app-chat-evaluations/github-create-codespace.png" alt-text="Screenshot of the confirmation screen before creating a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. Provision the required Azure resources for the evaluations app.

    ```bash
    azd up
    ```

    This doesn't deploy the evaluations app, but it does create the Azure resources required to run the app locally.

1. The remaining tasks in this article take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.


1. Clone the [Azure-Samples/ai-rag-chat-evaluator](https://github.com/Azure-Samples/ai-rag-chat-evaluator) GitHub repository to your local machine.

    ```bash
    git clone https://github.com/Azure-Samples/ai-rag-chat-evaluator
    ```

1. Open **Visual Studio Code** in the context of the cloned repo:

    ```bash
    cd ai-rag-chat-evaluator
    code .
    ```

1. Ensure that you have the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed in Visual Studio Code.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen in Container**.

    > [!TIP]
    > Visual Studio Code may automatically prompt you to reopen the existing folder within a development container. This is functionally equivalent to using the command palette to reopen the current workspace in a container.

1. Open a new terminal in the editor.

1. If you intend to create a new Azure OpenAI resource for evaluations, sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

    When prompted, copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. Provision the required Azure resources for the evaluations app.

    ```bash
    azd up
    ```

    This doesn't deploy the evaluations app, but it does create the Azure resources required to run the app locally.

1. Reopen the Terminal window again (<kbd>Ctrl</kbd> + <kbd>`</kbd>) and leave it open.
1. The remaining exercises in this project take place in the context of this development container.

---

## Generate ground truth data in your dev container

In order to evaluate new answers, they must be compared to "ground truth" answers: the ideal answer for a particular question. 

Generate questions and answers from documents stored in Azure AI Search.

1. Create a `.env` file at the root of the **ai-rag-chat-evaluator** folder.
1. Fill in the values for your Azure AI Search instance:

    ```shell
    AZURE_SEARCH_SERVICE="<service-name>"
    AZURE_SEARCH_INDEX="<index-name>"
    AZURE_SEARCH_KEY=""
    ```

    The key may not be necessary if it's configured for keyless access from your account.

1. In a terminal in the **ai-rag-chat-evaluator** dev container, run the following command to generate the sample prompts:

    ```shell
    python3 -m scripts generate --output=example_input/qa.jsonl --numquestions=14 --persource=2
    ```

    The prompts are generated and stored them in `example_input/qa.jsonl` as input to the evaluator used in the next step.

## Run an evaluation in your dev container

A Python script loads the current Azure Developer CLI environment's variables, installs the requirements for the evaluation, and runs the evaluation against the local app.

```shell
python3 -m scripts evaluate --config=example_config.json
```

## Clean up resources

### Clean up Azure resources

The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

Run the following Azure Developer CLI command to delete the Azure resources and remove the source code:

```bash
azd down --purge
```

### Clean up GitHub Codespaces

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign into the GitHub Codespaces dashboard (<https://github.com/codespaces>).

1. Locate your currently running codespaces sourced from the [`Azure-Samples/azure-search-openai-demo`](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository.

    :::image type="content" source="./media/get-started-app-chat-template/github-codespace-dashboard.png" alt-text="Screenshot of all the running codespaces including their status and templates.":::

1. Open the context menu for the codespace and then select **Delete**.

    :::image type="content" source="./media/get-started-app-chat-template/github-codespace-delete.png" alt-text="Screenshot of the context menu for a single codespace with the delete option highlighted.":::

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="./media/get-started-app-chat-template/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code will stop the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main#troubleshooting).

If your issue isn't addressed, log your issue to the repository's [Issues](https://github.com/Azure-Samples/azure-search-openai-demo/issues).

## Next steps

* [Enterprise chat app GitHub repository](https://github.com/Azure-Samples/azure-search-openai-demo)
* [Build a chat app with Azure OpenAI](https://aka.ms/azai/chat) best practice solution architecture
* [Access control in Generative AI Apps with Azure AI Search](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/access-control-in-generative-ai-applications-with-azure/ba-p/3956408)
* [Build an Enterprise ready OpenAI solution with Azure API Management](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/build-an-enterprise-ready-azure-openai-solution-with-azure-api/bc-p/3935407)
* [Outperforming vector search with hybrid retrieval and ranking capabilities](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167)

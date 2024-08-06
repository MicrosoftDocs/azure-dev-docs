---
title: "Get started with Serverless AI Chat using LlamaIndex"
description: "Use LlamaIndex to simplify..."
ms.topic: get-started 
ms.date: 05/22/2024
ms.subservice: intelligent-apps
ms.custom: build-2024-intelligent-apps
ms.collection: ce-skilling-ai-copilot
#customer intent: As a TypeScript developer, I want deploy and use a serverless chat app so that I can understand how LLamaIndex helps a chat app.

---

# Get started with Serverless AI Chat with RAG using LlamaIndex

Creating AI apps can be complex. With LlamaIndex, Azure Functions, and Serverless technologies, you can simplify this process. These tools manage infrastructure and scale automatically, letting you focus on chatbot functionality. The chatbot uses enterprise documents to generate AI responses.

The code includes sample data for a fictitious company, Contoso Real Estate. Customers can ask support questions about the company's products. The data includes documents on the company's terms of service, privacy policy, and support guide.

:::image type="content" source="../media/get-started-app-chat-llama-index/chat-app-response-in-browser.png" alt-text="Screenshot of chat app in browser showing chat input and the response.":::

## Architectural overview

The user interacts with the application:

- With the chat interface in the client web app.
- The client web app sends the user's query to the Serverless API via HTTP calls.
- The Serverless API uses the LlamaIndex to process and stream the response.

A simple architecture of the chat app is shown in the following diagram:

:::image type="content" source="../media/get-started-app-chat-llama-index/architecture-diagram-llama-index-javascript.png" alt-text="Diagram of the architecture for the LlamaIndex RAG chat app.":::

### Where is Azure in this architecture?

The architecture of the application relies on the following services and components:

- Azure OpenAI represents the AI provider that we send the user's queries to.
- LlamaIndex is the framework that helps us ingest, transform and vectorize our content (PDF file) and create a search index from our data.
- Azure Container Apps is the container environment where the application is hosted.
- Azure Managed Identity helps us ensure best in class security and eliminates the requirements for you as a developer to deal with credentials and API keys.

### LlamaIndex manages the data from ingestion to retrieval

To implement a RAG (Retrieval-Augmented Generation) system using LlamaIndex, follow these steps:

#### Data Ingestion

| Process | Description | LlamaIndex |
|--|--|--|
| Load Documents | Import data from sources like PDFs, APIs, or databases. | SimpleDirectoryReader |
| Chunk Documents | Break down large documents into smaller chunks. | SentenceSplitter |

#### Index Creation

| Process | Description | LlamaIndex |
|--|--|--|
| Create Vector Index | Create a vector index for efficient similarity searches. | VectorStoreIndex |
| Recursive Retrieval (Optional) | Manage complex datasets with hierarchical retrieval. | |

#### Query Engine Setup

| Process | Description | LlamaIndex |
|--|--|--|
| Convert to Query Engine | Convert the vector index into a query engine. | asQueryEngine |
| Advanced Setup (Optional) | Use agents for a multi-agent system. | |

#### Retrieval and Generation

| Process | Description | LlamaIndex |
|--|--|--|
| Define Objective Function | Retrieve document chunks based on user queries. | |
| Perform Retrieval | Process queries and re-rank documents. | RetrieverQueryEngine, CohereRerank |

## Prerequisites


A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this article, you need the following prerequisites:

#### [Codespaces (recommended)](#tab/github-codespaces)

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)
- Azure account permissions - Your Azure Account must have Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
- Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access). Open an issue on this repo to contact us if you have an issue.
- GitHub account

#### [Visual Studio Code](#tab/visual-studio-code)

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)
- Azure account permissions - Your Azure Account must have Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
- Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access). Open an issue on this repo to contact us if you have an issue.
- [Azure Developer CLI](/azure/developer/azure-developer-cli)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## Open development environment

Begin now with a development environment that has all the dependencies installed to complete this article. 

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Open in Codespace.

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/llama-index-javascript)

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

    Complete the authentication process.

1. The remaining tasks in this article take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.


1. Create a new local directory on your computer for the project. 

    ```bash
    mkdir my-intelligent-app && cd my-intelligent-app
    ```

1. Open Visual Studio Code in that directory:

    ```bash
    code .
    ```

1. Open a new terminal in Visual Studio Code.
1. Run the following AZD command to bring the GitHub repository to your local computer.

    ```bash
    azd init -t llama-index-javascript
    ```

1. Open the Command Palette, search for and select **Dev Containers: Open Folder in Container** to open the project in a dev container. Wait until the dev container opens before continuing.
1. Sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

    Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.
1. The remaining exercises in this project take place in the context of this development container.

---

## Deploy and run

The sample repository contains all the code and configuration files you need to deploy the serverless chat app to Azure. The following steps walk you through the process of deploying the sample to Azure.

### Deploy chat app to Azure

> [!IMPORTANT]
> Azure resources created in this section incur immediate costs, primarily from the Azure AI Search resource. These resources may accrue costs even if you interrupt the command before it is fully executed.

1. Run the following Azure Developer CLI command to provision the Azure resources and deploy the source code:

    ```bash
    azd up
    ```

1. Use the following table to answer the prompts:

    |Prompt|Answer|
    |--|--|
    |Environment name|Keep it short and lowercase. Add your name or alias. For example, `john-chat`. It's used as part of the resource group name.|
    |Subscription|Select the subscription to create the resources in. |
    |Location (for hosting)|Select a location near you from the list.|
    |Location for the OpenAI model|Select a location near you from the list. If the same location is available as your first location, select that.|

1. Wait until app is deployed. It may take 5-10 minutes for the deployment to complete.
1. After the application has been successfully deployed, you see two URLs displayed in the terminal.
1. Select that URL labeled `Deploying service webapp` to open the chat application in a browser.

### Use chat app to get answers from PDF files

The chat app is preloaded with domestic postal mail information from a [PDF file catalog](https://github.com/Azure-Samples/llama-index-javascript/tree/main/data). You can use the chat app to ask questions about the mailing letter and packages. The following steps walk you through the process of using the chat app.

1. In the browser, select or enter **How much does it cost to send a large package to France?**.

    :::image type="content" source="../media/get-started-app-chat-llama-index/chat-app-response-in-browser.png" alt-text="Screenshot of chat app in browser showing chat input and the response.":::

1. LlamaIndex derives the answer uses the PDF file and streams the response.

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

1. Locate your currently running Codespaces sourced from the [`Azure-Samples/llama-index-javascript`](https://github.com/Azure-Samples/llama-index-javascript) GitHub repository.

    :::image type="content" source="../media/get-started-app-chat-llama-index/github-codespace-dashboard.png" alt-text="Screenshot of all the running Codespaces including their status and templates.":::

1. Open the context menu, `...`, for the codespace and then select **Delete**.

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="../media/get-started-app-chat-llama-index/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code will stop the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/llama-index-javascript/blob/main/README.md#troubleshooting).

If your issue isn't addressed, log your issue to the repository's [Issues](https://github.com/Azure-Samples/llama-index-javascript/issues).

## Related content

- [Get started with evaluating answers in a chat app in JavaScript](get-started-app-chat-evaluations.md)

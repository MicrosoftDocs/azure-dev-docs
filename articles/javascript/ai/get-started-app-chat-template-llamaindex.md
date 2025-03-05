---
title: "Get started with Serverless AI Chat using LlamaIndex"
description: "Use LlamaIndex to build intelligent apps. It aids in data ingestion, transformation, vectorization, and creating a searchable index for your data."
ms.topic: get-started 
ms.date: 12/11/2024
ms.subservice: intelligent-apps
ms.custom: build-2024-intelligent-apps
ms.collection: ce-skilling-ai-copilot
#customer intent: As a TypeScript developer, I want deploy and use a serverless chat app so that I can understand how LLamaIndex helps a chat app.

---

# Get started with Serverless AI Chat with RAG using LlamaIndex

Simplify [AI app development with RAG](/azure/developer/ai/augment-llm-rag-fine-tuning#understanding-rag) by using your own data managed by [LlamaIndex](https://ts.llamaindex.ai/), Azure Functions, and Serverless technologies. These tools manage infrastructure and scaling automatically, allowing you to focus on chatbot functionality. LlamaIndex handles the data pipeline all the way from ingestion to the streamed response.

:::image type="content" source="../media/get-started-app-chat-template-llamaindex/chat-app-response-in-browser.png" alt-text="Screenshot of chat app in browser showing chat input and the response.":::

## Architectural overview

The application flow includes:

- Using the chat interface to enter a prompt.
- Sending the user's prompt to the Serverless API via HTTP calls.
- Receiving the user's prompt then using LlamaIndex framework to process and stream the response. The serverless API uses an engine to create a connection to the Azure OpenAI large language model (LLM) and the vector index from LlamaIndex. 

A simple architecture of the chat app is shown in the following diagram:

:::image type="content" source="../media/get-started-app-chat-template-llamaindex/architecture-diagram-llama-index-javascript.png" alt-text="Diagram of the architecture for the LlamaIndex RAG chat app.":::

This sample uses LlamaIndex to generate embeddings and store in its own vector store. LlamaIndex also provides [integration with other vector stores](https://docs.llamaindex.ai/en/stable/community/integrations/vector_stores/) including [Azure AI Search](/azure/search/). That integration isn't demonstrated in this sample.  

### Where is Azure in this architecture?

The architecture of the application relies on the following services and components:

- [Azure OpenAI](/azure/ai-services/openai/) represents the AI provider that we send the user's queries to.
- LlamaIndex is the framework that helps us ingest, transform, and vectorize our content (PDF file) and create a search index from our data.
- [Azure Container Apps](/azure/container-apps/) is the container environment where the application is hosted.
- [Azure Managed Identity](/entra/identity/managed-identities-azure-resources/) helps us ensure best in class security and eliminates the requirements for you as a developer to deal with credentials and API keys.

### LlamaIndex manages the data from ingestion to retrieval

To implement a RAG (Retrieval-Augmented Generation) system using LlamaIndex, the following key steps are matched with the LlamaIndex functionality:

| Process | Description | LlamaIndex |
|--|--|--|
| Data Ingestion | Import data from sources like PDFs, APIs, or databases. | SimpleDirectoryReader |
| Chunk Documents | Break down large documents into smaller chunks. | SentenceSplitter |
| Vector index creation | Create a vector index for efficient similarity searches. | VectorStoreIndex |
| Recursive Retrieval (Optional) from index | Manage complex datasets with hierarchical retrieval. | |
| Convert to Query Engine | Convert the vector index into a query engine. | asQueryEngine |
| Advanced query setup (Optional) | Use agents for a multi-agent system. | |
| Implement the RAG pipeline | Define an objective function that takes user queries and retrieves relevant document chunks. | |
| Perform Retrieval | Process queries and rerank documents. | RetrieverQueryEngine, CohereRerank |

## Prerequisites


A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this article, you need the following prerequisites:

#### [Codespaces (recommended)](#tab/github-codespaces)

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)
- Azure account permissions - Your Azure Account must have Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
- A GitHub account.

#### [Visual Studio Code](#tab/visual-studio-code)

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)
- Azure account permissions - Your Azure Account must have Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
- [Azure Developer CLI](/azure/developer/azure-developer-cli)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## Open development environment

Use the following instructions to deploy a preconfigured development environment containing all required dependencies to complete this article.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Open in codespace.

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

1. To provision the Azure resources and deploy the source code, run the following Azure Developer CLI command:

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

1. Wait until app is deployed. It might take 5-10 minutes for the deployment to complete.
1. After successfully deploying the application, you see two URLs displayed in the terminal.
1. Select that URL labeled `Deploying service webapp` to open the chat application in a browser.

    :::image type="content" source="../media/get-started-app-chat-template-llamaindex/azd-up.png" alt-text="Screenshot of output of deployment command showing the web application URL.":::

### Use chat app to get answers from PDF files

The chat app is preloaded with information about the physical standards for domestic postal mail from a [PDF file catalog](https://github.com/Azure-Samples/llama-index-javascript/tree/main/data). You can use the chat app to ask questions about the mailing letter and packages. The following steps walk you through the process of using the chat app.

1. In the browser, select or enter **How much does it cost to send a large package to France?**.

1. LlamaIndex derives the answer uses the PDF file and streams the response.

    :::image type="content" source="../media/get-started-app-chat-template-llamaindex/chat-app-response-in-browser.png" alt-text="Screenshot of chat app in browser showing chat input and the response.":::

    The answer comes from Azure OpenAI with influence from the PDF data ingested into the LlamaIndex vector store. 

## Clean up resources

To clean up resources, there are two things to address:  

- Azure resources, you can clean the resources up with Azure Developer CLI, azd.  
- Your developer environment; either GitHub Codespaces or DevContainers via Visual Studio Code.

### Clean up Azure resources

The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

Run the following Azure Developer CLI command to delete the Azure resources and remove the source code:

```bash
azd down --purge
```

### Clean up developer environments

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign into the [GitHub Codespaces dashboard](https://github.com/codespaces).

1. Locate your currently running Codespaces sourced from the [`Azure-Samples/llama-index-javascript`](https://github.com/Azure-Samples/llama-index-javascript) GitHub repository.

    :::image type="content" source="../media/get-started-app-chat-template-llamaindex/github-codespace-dashboard.png" alt-text="Screenshot of all the running Codespaces including their status and templates.":::

1. Open the context menu, `...`, for the codespace and then select **Delete**.

#### [DevContainers Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

:::image type="content" source="../media/get-started-app-chat-template-llamaindex/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code will stop the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/llama-index-javascript/blob/main/README.md#troubleshooting).

If your issue isn't addressed, log your issue to the repository's [Issues](https://github.com/Azure-Samples/llama-index-javascript/issues).

## Next step

> [!div class="nextstepaction"]
> [Assistants and function calling in JavaScript](get-started-app-chat-assistants-function-calling.md)
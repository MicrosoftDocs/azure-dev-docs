---
title: "Get started with chat document security trimming"
description: "Secure your chat app with user authentication and document security trimming to ensure users receive answers based on their permissions."
ms.date: 11/17/2023
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-js, devx-track-js-ai, devx-track-extended-azdevcli
# CustomerIntent: 
---

# Get started with chat document security for Python

This article provides the process to secure your chat app to ensure users receive answers based on their permissions. When you build a chat application using the RAG pattern with your own data, make sure that each user gets answers from documents they are authorized to see.

An authorized user should have access to answers contained within the documents of the chat app.

:::image type="content" source="media/get-started-app-chat-document-security-trimming/chat-answer-with-authorized-access.png" alt-text="Screenshot of chat app with answer with required authentication access.":::

An unauthorized user shouldn't have access to answers from secured documents they don't have authorization to see.

:::image type="content" source="media/get-started-app-chat-document-security-trimming/chat-answer-with-no-access.png" alt-text="Screenshot of chat app with answer indicating user doesn't have access to data.":::

## Architectural overview

The enterprise chat app has a simply architecture using Azure OpenAI Search and Azure OpenAI. An answer is determined from queries to Azure AI Search where the documents are stored, in combination with a prompt response from Azure OpenAI. No user authentication is used in this simply flow.

:::image type="content" source="media/get-started-app-chat-document-security-trimming/simple-rag-chat-architecture.png" alt-text="Architectural diagram showing an answer determined from queries to Azure AI Search where the documents are stored, in combination with a prompt response from Azure OpenAI.":::

To secure the documents, user authentication to Azure Entra ID is required, then passed to Azure Search.

:::image type="content" source="media/get-started-app-chat-document-security-trimming/trimmed-rag-chat-architecture.png" alt-text="Architectural diagram showing a use authenticating with Entra ID, then passing that authentication to Azure AI Search.":::

Each document ingested into Azure AI Search includes user authentication, which is returned in the query result set.

:::image type="content" source="media/get-started-app-chat-document-security-trimming/azure-ai-search-with-user-authorization.png" alt-text="Architectural diagram showing that to secure the documents in Azure AI Search, each document includes user authentication, which is returned in the result set.":::



## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this article, you need the following prerequisites:

#### [Codespaces (recommended)](#tab/github-codespaces)

1. An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)
1. Azure account permissions - Your Azure Account must have Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
1. Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access). Open an issue on this repo to contact us if you have an issue.
1. GitHub account

#### [Visual Studio Code](#tab/visual-studio-code)
1. An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)
1. Azure account permissions - Your Azure Account must have Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
1. Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access). Open an issue on this repo to contact us if you have an issue.
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

1. Start the process to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/azure-search-openai-javascript`](https://github.com/Azure-Samples/azure-search-openai-javascript) GitHub repository.
1. Right-click on the following button, and select _Open link in new windows_ in order to have both the development environment and the documentation available at the same time. 

    > [!div class="nextstepaction"]
    > [Open this project in GitHub Codespaces](https://github.com/codespaces/new?azure-portal=true&hide_repo_select=true&ref=main&skip_quickstart=true&repo=684521881)

1. On the **Create codespace** page, review the codespace configuration settings and then select **Create new codespace**

    :::image type="content" source="./media/get-started-app-chat-template/github-create-codespace.png" alt-text="Screenshot of the confirmation screen before creating a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.


1. The remaining tasks in this article take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

1. Open **Visual Studio Code** in the context of an empty directory.

1. Ensure that you have the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed in Visual Studio Code.

1. Open a new terminal in the editor.

    > [!TIP]
    > You can use the main menu to navigate to the **Terminal** menu option and then select the **New Terminal** option.
    >
    > :::image type="content" source="./media/get-started-app-chat-template/open-terminal-option.png" lightbox="./media/get-started-app-chat-template/open-terminal-option.png" alt-text="Screenshot of the menu option to open a new terminal.":::

1. Sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

    Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. Create a folder and initialize it to use the sample project with Azure Developer CLI:

    ```bash
    azd init -t azure-search-openai-javascript
    ```

    You don't need to clone this repository.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen in Container**.

    > [!TIP]
    > Visual Studio Code may automatically prompt you to reopen the existing folder within a development container. This is functionally equivalent to using the command palette to reopen the current workspace in a container.

1. Reopen the Terminal window again (<kbd>Ctrl</kbd> + <kbd>`</kbd>) and leave it open.
1. The remaining exercises in this project take place in the context of this development container.

---

## Deploy and run


### Deploy chat app to Azure


### Use chat app to get secure answers


### Use chat app settings to change behavior of responses

The intelligence of the chat app is determined by the OpenAI model and the settings that are used to interact with the model. 

:::image type="content" source="./media/get-started-app-chat-template/browser-chat-developer-settings-chat-pane.png" alt-text="Screenshot of chat developer settings":::

|Setting|Description|
|---|---|
|Override prompt template|This is the prompt that is used to generate the answer.|
|Retrieve this many search results|This is the number of search results that are used to generate the answer. You can see these sources returned in the _Thought process_ and _Supporting content_ tabs of the citation. |
|Exclude category|This is the category of documents that are excluded from the search results.|
|Use semantic ranker for retrieval|This is a feature of [Azure AI Search](/azure/search/semantic-search-overview#what-is-semantic-search) that uses machine learning to improve the relevance of search results.|
|Use query-contextual summaries instead of whole documents|When both `Use semantic ranker` and `Use query-contextual summaries` are checked, the LLM uses captions extracted from key passages, instead of all the passages, in the highest ranked documents.|
|Suggest follow-up questions|Have the chat app suggest follow-up questions based on the answer.|
|Retrieval mode|**Vectors + Text** means that the search results are based on the text of the documents and the embeddings of the documents. **Vectors** means that the search results are based on the embeddings of the documents. **Text** means that the search results are based on the text of the documents.|
|Stream chat completion responses|Stream response instead of waiting until the complete answer is available for a response.|

The following steps walk you through the process of changing the settings.

1. In the browser, select the **Developer Settings** tab.
1. Check the **Use query-contextual summaries instead of** checkbox and ask the same question again.

    ```
    What happens if the rental doesn't fit the description?
    ```

    The chat returned with a more concise answer such as the following.

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

1. Locate your currently running codespaces sourced from the [`Azure-Samples/azure-search-openai-javascript`](https://github.com/Azure-Samples/azure-search-openai-javascript) GitHub repository.

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

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/azure-search-openai-javascript/tree/main#troubleshooting).

If your issued isn't addressed, log your issue to the repository's [Issues](https://github.com/Azure-Samples/azure-search-openai-javascript/issues).

## Next steps

* [Enterprise chat app GitHub repository](https://github.com/Azure-Samples/azure-search-openai-javascript)
* [Build a chat app with Azure OpenAI](https://aka.ms/azai/chat) best practice solution architecture
* [Access control in Generative AI Apps with Azure AI Search](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/access-control-in-generative-ai-applications-with-azure/ba-p/3956408)
* [Build an Enterprise ready OpenAI solution with Azure API Management](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/build-an-enterprise-ready-azure-openai-solution-with-azure-api/bc-p/3935407)
* [Outperforming vector search with hybrid retrieval and ranking capabilities](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167)

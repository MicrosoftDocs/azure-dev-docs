---
title: Get started with the enterprise chat app template for JavaScript
description: Get started with JavaScript and intelligent search across your own data using an Azure OpenAI chat app. Easily deploy with Azure Developer CLI. This article uses the Azure AI Reference Template sample.
ms.date: 10/26/2023
ms.topic: get-started
ms.custom: devx-track-javascript, devx-track-javascript-ai
# CustomerIntent: As a JavaScript developer new to Azure OpenAI, I want deploy and use sample code to interact with intelligent app infused with my own business data so that learn from the sample code.
---

# Get started with the enterprise chat app template for JavaScript

Deploy and use an intelligent chat app to get answers about rental properties with JavaScript. The rental properties chat app is seeded with data from markdown files (*.md) including a privacy policy, terms of service, and support. 

By following the instructions in this article, you will:

- Deploy an intelligent chat app to Azure.
- Get answers about employee benefits.
- Change settings to change behavior of responses.

Once you complete this article, you can start modifying the new project with your custom code and data.

This article is part of a collection of articles that show you how to build an intelligent chat app using Azure Cognitive Search and OpenAI. To see the full collection, see [Build an intelligent chat app with Azure Cognitive Search and OpenAI](/azure/search/cognitive-search-tutorial-blob).

## Architectural overview

A simple architecture of the intelligent chat app is shown in the following diagram:

:::image type="content" source="./media/get-started-intelligent-app-chat/simple-architecture-diagram.png" alt-text="Diagram showing architecture from client to backend app.":::

Key components of the architecture include:

* A web application to host the interactive chat experience.
* An Azure Cognitive Search resource to get answers from your own data. Data is ingested during app startup.
* An Azure OpenAI Service to provide: 
    * Keywords to enhance the search over your own data.
    * Answers from the OpenAI model.
    * Embeddings from the ada model

## Cost 

Most resources in this architecture use a basic or consumption pricing tier. Consumption pricing is based on usage, which means you only pay for what you use. To complete this article, there will be a charge but it will be minimal. When you are done with the article, you can delete the resources to stop incurring charges.

Learn more about [cost in the sample repo](https://github.com/Azure-Samples/azure-search-openai-javascript#cost-estimation).

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this article, you need the following prerequisites:

#### [Codespaces (recommended)](#tab/github-codespaces)

1. An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
1. GitHub account

#### [Visual Studio Code](#tab/visual-studio-code)
1. An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
1. [Azure Developer CLI](../azure-developer-cli/install-azd.md?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
1. [Visual Studio Code](https://code.visualstudio.com/)
1. [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## Open development environment

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this training module.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Start the process to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/azure-search-openai-javascript`](https://github.com/Azure-Samples/azure-search-openai-javascript) GitHub repository:

    > [!div class="nextstepaction"]
    > [Open this project in GitHub Codespaces](https://github.com/codespaces/new?azure-portal=true&hide_repo_select=true&ref=main&skip_quickstart=true&repo=684521881)

1. On the **Create codespace** page, review the codespace configuration settings and then select **Create new codespace**

    :::image type="content" source="./media/get-started-intelligent-app-chat/github-create-codespace.png" alt-text="Screenshot of the confirmation screen before creating a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. Sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.


1. The remaining tasks in this article take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this training module.

1. Open **Visual Studio Code** in the context of an empty directory.

1. Ensure that you have the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed in Visual Studio Code.

1. Open a new terminal in the editor.

    > [!TIP]
    > You can use the main menu to navigate to the **Terminal** menu option and then select the **New Terminal** option.
    >
    > :::image type="content" source="./media/get-started-intelligent-app-chat/open-terminal-option.png" lightbox="./media/get-started-intelligent-app-chat/open-terminal-option.png" alt-text="Screenshot of the menu option to open a new terminal.":::

1. Sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

    Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. Initialize the folder to use the sample project with Azure Developer CLI:

    ```bash
    azd init -t azure-search-openai-javascript
    ```

    You don't need to clone this repository.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen in Container**.

    > [!TIP]
    > Visual Studio Code may automatically prompt you to reopen the existing folder within a development container. This is functionally equivalent to using the command palette to reopen the current workspace in a container.

1. The remaining exercises in this project take place in the context of this development container.

---

## Deploy and run

The sample repository contains all the code and configuration files you need to deploy an intelligent chat app to Azure. The following steps walk you through the process of deploying the sample to Azure.

### Deploy intelligent chat app to Azure

> [!IMPORTANT]
> Azure resources created in this section immediate costs, primarily from the Cognitive Search resource. These resources may accrue costs even if you interrupt the command before it is fully executed. 

1. Run the following Azure Developer CLI command to provision the Azure resources and deploy the source code:

    ```bash
    azd up
    ```

1. When you're prompted to select a location the first time, select a location near you. This location is used for most the resources including hosting.
1. When you're prompted for a location for the OpenAI model, select a location that is near you. If the same location is available as your first location, select that.
1. Wait until app is deployed. It may take 5-10 minutes for the deployment to complete.
1. After the application has been successfully deployed, you see a URL displayed in the terminal. 
1. Select that URL to open the chat application in a browser.

    :::image type="content" source="./media/get-started-intelligent-app-chat/browser-chat-with-your-data.png" alt-text="Screenshot of intelligent chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::

### Use intelligent chat app to get answers from markdown files

The chat app is preloaded with rental information from a [markdown file catalog](https://github.com/Azure-Samples/azure-search-openai-javascript/tree/main/data). You can use the chat app to ask questions about the rental process. The following steps walk you through the process of using the chat app.

1. In the browser, enter a question about the catalog in the text box at the bottom of the page such as one of the following: 

    * How to search and book rentals?
    * What is the refund policy?
    * How to contact a representative? 

    :::image type="content" source="./media/get-started-intelligent-app-chat/browser-chat-initial-answer.png" alt-text="Screenshot of intelligent chat app's first answer.":::

1. From the answer, select one of the citations.

    :::image type="content" source="./media/get-started-intelligent-app-chat/browser-chat-initial-answer-citation-highlighted.png" alt-text="Screenshot of intelligent chat app's first answer with its citation highlighted in a red box.":::

1. In the right-pane, use the tabs to understand how the answer was generated.

    |Tab|Description|
    |---|---|
    |**Thought process**|This is a script of the interactions in chat.|
    |**Support content**|This includes the information to answer your question and the source material.|
    |**Citation**|This displays the content that contains the citation.|

1. When you're done, select the tab again to close the pane.

### Use intelligent chat app settings to change behavior of responses

The intelligence of the chat app is determined by the OpenAI model and the settings that are used to interact with the model. 

:::image type="content" source="./media/get-started-intelligent-app-chat/browser-chat-developer-settings-chat-pane.png" alt-text="Screenshot of intelligent chat developer settings":::

|Setting|Description|
|---|---|
|Override prompt template|This is the prompt that is used to generate the answer.|
|Retrieve this many search results|This is the number of search results that are used to generate the answer. You can see these sources returned in the _Thought process_ and _Supporting content_ tabs of the citation. |
|Exclude category|This is the category of documents that are excluded from the search results.|
|Use semantic ranker for retrieval|This is a feature of [Azure Cognitive Search](/azure/search/semantic-search-overview#what-is-semantic-search) that uses machine learning to improve the relevance of search results.|
|Use query-contextual summaries instead of whole documents| |
|Suggest follow-up questions|Have the chat app suggest follow-up questions based on the answer.|
|Retrieval mode|**Vectors + Text** means that the search results are based on the text of the documents and the embeddings of the documents. **Vectors** means that the search results are based on the embeddings of the documents. **Text** means that the search results are based on the text of the documents.|
|Stream chat completion responses|Stream response instead of waiting until the complete answer is available for a response.|

The following steps walk you through the process of changing the settings.

1. In the browser, select the **Developer Settings** tab.
1. Check the **Suggest follow-up questions** checkbox and ask the same question again.

    ```
    What happens if the rental doesn't fit the description?
    ```

    The chat returned suggested follow-up questions such as the following:

    ```
    1. Would you like to see the refund policy? 
    2. Would you like to see contact information? 
    3. Would you like to see the privacy policy? 
    ```

## Clean up resources

### Clean up Azure resources

The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

Run the following Azure Developer CLI command to delete the Azure resources and remove the source code:

```bash
azd down
```

### Clean up GitHub Codespaces

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign into the GitHub Codespaces dashboard (<https://github.com/codespaces>).

1. Locate your currently running codespaces sourced from the [`Azure-Samples/azure-search-openai-javascript`](https://github.com/Azure-Samples/azure-search-openai-javascript) GitHub repository.

    :::image type="content" source="./media/get-started-intelligent-app-chat/github-codespace-dashboard.png" alt-text="Screenshot of all the running codespaces including their status and templates.":::

1. Open the context menu for the codespace and then select **Delete**.

    :::image type="content" source="./media/get-started-intelligent-app-chat/github-codespace-delete.png" alt-text="Screenshot of the context menu for a single codespace with the delete option highlighted.":::

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="./media/get-started-intelligent-app-chat/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code will stop the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/azure-search-openai-javascript/tree/main#troubleshooting).

If your issued isn't addressed, log your issue to the repository's [Issues](https://github.com/Azure-Samples/azure-search-openai-javascript/issues).

## Related content

* [Azure Developer CLI templates for JavaScript](/azure/developer/azure-developer-cli/azd-templates?tabs=nodejs)
* [Browse JavaScript + AI code samples](/samples/browse/?branch=main&languages=javascript&products=azure-cognitive-services)

[Chat_API_protocol]: https://github.com/Azure/azureml_run_specification/blob/chat-protocol/specs/chat-protocol/chat-app-protocol.md
[Chat_Backend_Folder]:https://github.com/Azure-Samples/azure-search-openai-javascript/tree/main/packages/search
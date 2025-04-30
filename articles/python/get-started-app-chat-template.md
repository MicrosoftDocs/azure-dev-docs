---
title: Get started with the chat using your own data sample for Python
description: Get started with Python and search across your own data by using a chat app sample implemented using Azure OpenAI Service and Retrieval Augmented Generation (RAG) in Azure AI Search. Easily deploy with Azure Developer CLI. This article uses the Azure AI Reference Template sample.
ms.date: 12/20/2024
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai, devx-track-extended-azdevcli, build-2024-intelligent-apps
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As a Python developer new to Azure OpenAI Service, I want to deploy and use sample code to interact with an app infused with my own business data so that I can learn from the sample code.
---

# Get started with the chat by using your own data sample for Python

This article shows you how to deploy and run the [chat app with your own data sample for Python](https://github.com/Azure-Samples/azure-search-openai-demo). This sample implements a chat app by using Python, Azure OpenAI Service, and [Retrieval Augmented Generation (RAG)](/azure/search/retrieval-augmented-generation-overview) in Azure AI Search to get answers about employee benefits at a fictitious company. The app is seeded with PDF files that include the employee handbook, a benefits document, and a list of company roles and expectations.

Watch the following [demo video](https://aka.ms/azai/py/video).

By following the instructions in this article, you:

- Deploy a chat app to Azure.
- Get answers about employee benefits.
- Change settings to change the behavior of responses.

After you finish this procedure, you can start modifying the new project with your custom code.

This article is part of a collection of articles that show you how to build a chat app by using Azure OpenAI and Azure AI Search.

Other articles in the collection include:

* [.NET](/dotnet/ai/get-started-app-chat-template)
* [Java](../java/quickstarts/get-started-app-chat-template.md)
* [JavaScript](../javascript/ai/get-started-app-chat-template.md)
* [JavaScript frontend + Python backend](../javascript/ai/chat-app-with-separate-front-back-end.md)

> [!NOTE]
> This article uses one or more [AI app templates](../ai/intelligent-app-templates.md) as the basis for the examples and guidance in the article. AI app templates provide you with well-maintained reference implementations that are easy to deploy. They help to ensure a high-quality starting point for your AI apps.

## Architectural overview

The following diagram shows a simple architecture of the chat app.

:::image type="content" source="./media/get-started-app-chat-template/simple-architecture-diagram.png" alt-text="Diagram that shows architecture from the client to the backend app.":::

Key components of the architecture include:

* A web application to host the interactive chat experience.
* An Azure AI Search resource to get answers from your own data.
* Azure OpenAI to provide:

    * Keywords to enhance the search over your own data.
    * Answers from the Azure OpenAI model.
    * Embeddings from the `ada` model.

## Cost

Most resources in this architecture use a basic or consumption pricing tier. Consumption pricing is based on usage, which means that you only pay for what you use. There's a charge to complete this article, but it's minimal. When you're finished with the article, you can delete the resources to stop incurring charges.

Learn more about [cost in the sample repo](https://github.com/Azure-Samples/azure-search-openai-demo#cost-estimation).

## Prerequisites

A [development container](https://containers.dev/) environment is available with all the dependencies that are required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally by using Visual Studio Code.

To use this article, you need the following prerequisites.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

* An Azure subscription. [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true).
* Azure account permissions. Your Azure account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
* A GitHub account.

#### [Visual Studio Code](#tab/visual-studio-code)

* An Azure subscription. [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true).
* Azure account permissions. Your Azure account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
* [Azure Developer CLI](/azure/developer/azure-developer-cli).
* [Docker Desktop](https://www.docker.com/products/docker-desktop/). Start Docker Desktop if it's not already running.
* [Visual Studio Code](https://code.visualstudio.com/).
* [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

---

## Open a development environment

Use the following instructions to deploy a preconfigured development environment containing all required dependencies to complete this article.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface (UI). For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use GitHub Codespaces for up to 60 hours free each month with two core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Start the process to create a new GitHub codespace on the `main` branch of the [Azure-Samples/azure-search-openai-demo](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository.
1. Right-click the following button, and select **Open link in new windows** to have the development environment and the documentation available at the same time.

    [![Open in GitHub Codespaces.](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo)

1. On the **Create codespace** page, review the codespace configuration settings, and then select **Create codespace**.

    :::image type="content" source="./media/get-started-app-chat-template/github-create-codespace.png" alt-text="Screenshot that shows the confirmation screen before you create a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI:

    ```bash
    azd auth login --use-device-code
    ```

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

The remaining tasks in this article take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally by using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

1. Create a new local directory on your computer for the project:

    ```bash
    mkdir my-intelligent-app && cd my-intelligent-app
    ```

1. Open Visual Studio Code in that directory:

    ```bash
    code .
    ```

1. Open a new terminal in Visual Studio Code.
1. Run the following `AZD` command to bring the GitHub repository to your local computer:

    ```bash
    azd init -t azure-search-openai-demo
    ```

1. Open the **Command** palette, and search for and select **Dev Containers: Open Folder in Container** to open the project in a dev container. Wait until the dev container opens before you continue.
1. Sign in to Azure with the Azure Developer CLI:

    ```bash
    azd auth login
    ```

   Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

The remaining exercises in this project take place in the context of this development container.

---

## Deploy and run

The sample repository contains all the code and configuration files you need to deploy a chat app to Azure. The following steps walk you through the process of deploying the sample to Azure.

### Deploy the chat app to Azure

> [!IMPORTANT]
> Azure resources created in this section incur immediate costs, primarily from the Azure AI Search resource. These resources might accrue costs even if you interrupt the command before it fully executes.

1. Run the following Azure Developer CLI command to provision the Azure resources and deploy the source code:

    ```bash
    azd up
    ```

1. If you're prompted to enter an environment name, keep it short and use lowercase letters. An example is `myenv`. It's used as part of the resource group name.
1. When prompted, select a subscription in which to create the resources.
1. When you're prompted to select a location the first time, select a location near you. This location is used for most of the resources, including hosting.
1. If you're prompted for a location for the Azure OpenAI model or for the Azure AI Document Intelligence resource, select the location closest to you. If the same location is available as your first location, select that.
1. Wait 5 or 10 minutes after the app deploys before you continue.
1. After the application successfully deploys, a URL appears in the terminal.

    :::image type="content" source="media/get-started-app-chat-template/azd-deployed-endpoint.png" alt-text="Screenshot that shows the deployed app as reported at the end of the AZD CLI azd up process.":::

1. Select the URL labeled `(✓) Done: Deploying service webapp` to open the chat application in a browser.

    :::image type="content" source="./media/get-started-app-chat-template/browser-chat-with-your-data.png" alt-text="Screenshot that shows the chat app in a browser showing several suggestions for chat input and the chat text box to enter a question.":::

### Use the chat app to get answers from PDF files

The chat app is preloaded with employee benefits information from [PDF files](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main/data). You can use the chat app to ask questions about the benefits. The following steps walk you through the process of using the chat app. Your answers might vary as the underlying models are updated.

1. In the browser, select or enter **What happens in a performance review?** in the chat text box.

    :::image type="content" source="./media/get-started-app-chat-template/browser-chat-initial-answer.png" lightbox="./media/get-started-app-chat-template/browser-chat-initial-answer.png" alt-text="Screenshot that shows the chat app's first answer.":::

1. From the answer, select a citation.

    :::image type="content" source="./media/get-started-app-chat-template/browser-chat-initial-answer-citation-highlighted.png" lightbox="./media/get-started-app-chat-template/browser-chat-initial-answer-citation-highlighted.png" alt-text="Screenshot that shows the chat app's first answer with its citation highlighted in a red box.":::

1. On the right pane, use the tabs to understand how the answer was generated.

    |Tab|Description|
    |---|---|
    |**Thought process**|This tab is a script of the interactions in chat. You can view the system prompt (`content`) and your user question (`content`).|
    |**Supporting content**|This tab includes the information to answer your question and the source material. The number of source material citations is noted in **Developer settings**. The default value is **3**.|
    |**Citation**|This tab displays the original page that contains the citation.|

1. When you're finished, select the tab again to close the pane.

### Use chat app settings to change the behavior of responses

The intelligence of the chat is determined by the Azure OpenAI model and the settings that are used to interact with the model.

:::image type="content" source="./media/get-started-app-chat-template/browser-chat-developer-settings-chat-pane.png" alt-text="Screenshot that shows chat developer settings.":::

|Setting|Description|
|---|---|
|**Override prompt template**|Overrides the prompt used to generate the answer based on the question and search results.|
|**Temperature**|Sets the temperature of the request to the large language model (LLM) that generates the answer. Higher temperatures result in more creative responses, but they might be less grounded.|
|**Seed**|Sets a seed to improve the reproducibility of the model's responses. The seed can be any integer.|
| **Minimum search score**|Sets a minimum score for search results that come back from Azure AI Search. The score range depends on whether you're using [hybrid (default), vectors only, or text only](/azure/search/hybrid-search-ranking#scores-in-a-hybrid-search-results).|
| **Minimum reranker score**|Sets a minimum score for search results that come back from the semantic reranker. The score always ranges between 0 and 4. The higher the score, the more semantically relevant the result is to the question.|
|**Retrieve this many search results**|Sets the number of search results to retrieve from Azure AI Search. More results might increase the likelihood of finding the correct answer. But more results might also lead to the model getting "lost in the middle." You can see these sources returned on the **Thought process** and **Supporting content** tabs of the citation. |
|**Exclude category**|Specifies a category to exclude from the search results. There are no categories used in the default data set.|
|**Use semantic ranker for retrieval**|Enables the Azure AI Search [semantic ranker](/azure/search/semantic-search-overview#what-is-semantic-search), which is a model that reranks search results based on semantic similarity to the user's query.|
|**Use semantic captions**|Sends semantic captions to the LLM instead of the full search result. A semantic caption is extracted from a search result during the process of semantic ranking.|
|**Suggest follow-up questions**|Asks the LLM to suggest follow-up questions based on the user's query.|
|**Retrieval mode**|Sets the retrieval mode for the Azure AI Search query. **Vectors + Text (Hybrid)** uses a combination of vector search and full text search. **Vectors** uses only vector search. **Text** uses only full text search. Hybrid is optimal.|
|**Stream chat completion responses**|Continuously streams the generated response to the chat UI.|

The following steps walk you through the process of changing the settings.

1. In the browser, select the **Developer Settings** tab.
1. Select the **Suggest follow-up questions** checkbox and ask the same question again.

    ```
    What happens in a performance review?
    ```

    The chat returned suggested follow-up questions, such as the following examples:

    ```
    1. What is the frequency of performance reviews?
    2. How can employees prepare for a performance review?
    3. Can employees dispute the feedback received during the performance review?
    ```

1. On the **Settings** tab, clear the **Use semantic ranker for retrieval** checkbox.
1. Ask the same question again.

    ```
    What happens in a performance review?
    ```

1. What's the difference in the answers?

    - **With the semantic ranker**: During a performance review at Contoso Electronics, employees have the opportunity to discuss their successes and challenges in the workplace (1). The review provides positive and constructive feedback to help employees develop and grow in their roles (1). The employee receives a written summary of the performance review, which includes a rating of their performance, feedback, and goals and objectives for the upcoming year (1). The performance review is a two-way dialogue between managers and employees (1).
    - **Without the semantic ranker**: During a performance review at Contoso Electronics, employees have the opportunity to discuss their successes and challenges in the workplace. Positive and constructive feedback is provided to help employees develop and grow in their roles. A written summary of the performance review is given, including a rating of performance, feedback, and goals for the upcoming year. The review is a two-way dialogue between managers and employees (1).

## Clean up resources

The following steps walk you through the process of cleaning up the resources you used.

### Clean up Azure resources

The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

Run the following Azure Developer CLI command to delete the Azure resources and remove the source code:

```bash
azd down --purge --force
```

The switches provide:

* `purge`: Deleted resources are immediately purged so that you can reuse the Azure OpenAI tokens per minute.
* `force`: The deletion happens silently, without requiring user consent.

### Clean up GitHub Codespaces and Visual Studio Code

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement that you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign in to the [GitHub Codespaces dashboard](https://github.com/codespaces).

1. Locate your currently running codespaces that are sourced from the [Azure-Samples/azure-search-openai-demo](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository.

    :::image type="content" source="./media/get-started-app-chat-template/github-codespace-dashboard.png" alt-text="Screenshot that shows all the running codespaces including their status and templates.":::

1. Open the context menu for the codespace, and then select **Delete**.

    :::image type="content" source="./media/get-started-app-chat-template/github-codespace-delete.png" alt-text="Screenshot that shows the context menu for a single codespace with the Delete option highlighted.":::

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command** palette and search for the **Dev Containers** commands.
1. Select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="./media/get-started-app-chat-template/reopen-local-command-palette.png" alt-text="Screenshot that shows the Command palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code stops the running development container, but the container still exists in Docker in a stopped state. You can always delete the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main#troubleshooting).

If your issue isn't addressed, add your issue to the repository's [Issues](https://github.com/Azure-Samples/azure-search-openai-demo/issues) webpage.

## Related content

* Get the [source code for the sample used in this article](https://github.com/Azure-Samples/azure-search-openai-demo).
* Build a [chat app with Azure OpenAI](https://aka.ms/azai/chat) best-practices solution architecture.
* Learn about [access control in generative AI apps with Azure AI Search](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/access-control-in-generative-ai-applications-with-azure/ba-p/3956408).
* Build an [enterprise-ready Azure OpenAI solution with Azure API Management](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/build-an-enterprise-ready-azure-openai-solution-with-azure-api/bc-p/3935407).
* See [Azure AI Search: Outperforming vector search with hybrid retrieval and ranking capabilities](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167).

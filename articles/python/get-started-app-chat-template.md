---
title: "Get started sample: Chat using your data in Python"
description: Search your own data with a chat app sample in Python, and get started with Azure OpenAI Service and Retrieval Augmented Generation (RAG) in Azure AI Search.
ms.date: 10/28/2024
ms.topic: how-to
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai, devx-track-extended-azdevcli, build-2024-intelligent-apps
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As a python developer new to Azure OpenAI, I want to deploy and use a sample app configured with my own business data, so I can learn from the sample code.
---

# Get started: Chat using your own data (Python sample)

This article shows how to deploy and run the **Chat with your own data sample** [by using example code for Python](https://github.com/Azure-Samples/azure-search-openai-demo). This sample implements a chat app that runs on Python, Azure OpenAI Service, and [Retrieval Augmented Generation (RAG)](/azure/search/retrieval-augmented-generation-overview) in Azure AI Search. The app gets answers about employee benefits at a fictitious company by using supplied with PDF files, including the employee handbook, a benefits document, and a list of company roles and expectations. The article describes how to change the app settings to modify the app response behavior.

After you complete the procedures in this article, you can start modifying the new project with your custom code. This article is part of a collection of articles that show you how to build a chat app by using Azure OpenAI Service and Azure AI Search. Other articles in the collection include: 

* [.NET](/dotnet/ai/get-started-app-chat-template)
* [Java](../java/ai/get-started-app-chat-template.md)
* [JavaScript](../javascript/ai/get-started-app-chat-template.md)
* [JavaScript frontend with Python backend](../javascript/ai/chat-app-with-separate-front-back-end.md)

> [!NOTE]
> This article uses one or more [AI app templates](../ai/intelligent-app-templates.md) as the basis for the examples and development guidance. AI app templates provide you with well-maintained, easy to deploy reference implementations that help to ensure a high-quality starting point for your AI apps.

## Sample app architecture

A simple architecture of the chat app is shown in the following diagram:

:::image type="content" source="./media/get-started-app-chat-template/simple-architecture-diagram.png" border="false" alt-text="Diagram that shows the architecture for the sample from the client to the back-end chat app with data sources.":::

Key components of the architecture include:

* A web application to host the interactive chat experience.
* An Azure AI Search resource to get answers from your own data.
* An Azure OpenAI Service instance to provide: 
   * Keywords to enhance the search over your own data.
   * Answers from the OpenAI model.
   * Embeddings from the ada (adaptive) model.

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally by using Visual Studio Code.

To use this article, you need the following prerequisites:

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

* An Azure subscription. [Create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?icid=ai-services&azure-portal=true) before you begin.

* Azure account permissions. Your Azure Account must have Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

* Access granted to Azure OpenAI in the desired Azure subscription.

   * In most scenarios, you can create custom content filters and manage severity levels with general access to Azure OpenAI models. Registration for approval-based access isn't required. For more information, see [Limited Access features for Azure AI services](/azure/ai-services/cognitive-services-limited-access).
   
   * To modify content filters or support abuse monitoring, you need formal access approval. You can apply for access by completing the necessary registration forms. For more information, see [Registration for modified content filters and/or abuse monitoring](https://aka.ms/oai/access).

   * For access troubleshooting, open a support issue on this repo.

* A GitHub account.

#### [Visual Studio Code](#tab/visual-studio-code)

* An Azure subscription. [Create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?icid=ai-services&azure-portal=true) before you begin.

* Azure account permissions. Your Azure Account must have Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

* Access granted to Azure OpenAI in the desired Azure subscription.

   * In most scenarios, you can create custom content filters and manage severity levels with general access to Azure OpenAI models. Registration for approval-based access isn't required. For more information, see [Limited Access features for Azure AI services](/azure/ai-services/cognitive-services-limited-access).
   
   * To modify content filters or support abuse monitoring, you need formal access approval. You can apply for access by completing the necessary registration forms. For more information, see [Registration for modified content filters and/or abuse monitoring](https://aka.ms/oai/access).

* The [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli). For installation instructions, see [Install or update the Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).

* [Docker Desktop](https://www.docker.com/products/docker-desktop/). Before you begin, be sure to start Docker Desktop.

* [Visual Studio Code](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

---

### Usage cost for sample resources

Most resources in this architecture use a basic or consumption pricing tier. Consumption pricing is based on usage, which means you pay only for what you use. To complete this article, there's a slight charge for resource usage. After you complete the sample, you can delete the resources to prevent further charges. For more information about, see [Cost estimation](https://github.com/Azure-Samples/azure-search-openai-demo#cost-estimation) in the GitHub repository for the sample.

## Open development environment

Begin by setting up a development environment that has all the dependencies installed to complete this article.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use GitHub Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces - Monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-your-products/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. To start the process, you create a new GitHub codespace on the `main` branch of the [`Azure-Samples/azure-search-openai-demo`](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository.

   Right-click the following **GitHub Codespaces - Open** option and select **Open link in new window**. This option lets you create a development environment for the sample that includes the associated documentation. 

   [![Image of the 'Open in GitHub Codespaces' option.](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo)

1. On the **Create a new codespace** page, review the codespace configuration settings, and then select **Create codespace**:

   :::image type="content" source="./media/get-started-app-chat-template/github-create-codespace.png" alt-text="Screenshot of the confirmation screen to create a new GitHub codespace for the sample.":::

   Wait for the GitHub codespace to start. The startup process can take a few minutes.

1. After the GitHub codespace opens, sign in to Azure with the Azure Developer CLI by entering the following command in the Terminal pane of the codespace:

   ```bash
   azd auth login
   ```

   GitHub displays a security code in the Terminal.

   1. Copy the security code in the Terminal and select **Enter**. A browser window opens.
   
   1. At the prompt, paste the security code into the browser field.
   
   1. Follow the instructions to authenticate with your Azure account.

You complete the remaining GitHub Codespaces tasks in this article in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) installed on your local machine. The extension hosts the development container locally by using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

1. Open a Command Prompt window (terminal).

1. Run the following command to create a project directory named **my-intelligent-app**, and change to the directory:

   ```bash
   mkdir my-intelligent-app
   cd my-intelligent-app
   ```

1. Open Visual Studio Code in the project directory:

   ```bash
   code .
   ```

1. In Visual Studio Code, open a terminal by selecting **Terminal** > **New Terminal** or use the keyboard shortcut **Ctrl**+**Shift**+**`** (back tick).

1. In the Visual Studio Code Terminal, run the following command to download the GitHub repository to your local computer:

   ```bash
   azd init -t azure-search-openai-demo
   ```

1. At the prompt, enter an environment name. The name is added as a suffix to the directory name **my-intelligent-app**. Use a short value with all lowercase letters, such as **myenv**. The environment name is used as part of the resource group name. 

   Visual Studio Code opens the contents of the _my-intelligent-app_ project directory in the file **Explorer** view:

   :::image type="content" source="media/get-started-app-chat-template/azd-init-demo.png" alt-text="Screenshot of the  my-intelligent-app project directory open in the Explorer view in Visual Studio Code.":::

1. On the **Activity Bar**, select **Remote Explorer** for Dev Containers, and then select the **reopen the current folder in a container** link: 

   :::image type="content" source="media/get-started-app-chat-template/reopen-container-link.png" alt-text="Screenshot that shows how to select the 'reopen the current folder in a container' link in the Dev Containers Remote Explorer view.":::

   It can take some time for your project directory to open in a dev container. To monitor the progress, select **show log** on the progress dialog:

   :::image type="content" source="media/get-started-app-chat-template/dev-container-show-log.png" alt-text="Screenshot that shows how to select 'show log' on the Dev Containers operation progress dialog.":::

   Wait for your project directory to open in the **Remote Explorer** view, before you continue to the next step.

1. Sign in to Azure with the Azure Developer CLI.

   ```bash
   azd auth login
   ```
   Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

You complete the remaining exercises in this project in the context of this development container.

---

## Deploy chat app to Azure

The sample repository contains all the code and configuration files you need to deploy a chat app to Azure. The following steps walk you through the process of deploying the sample to Azure.

> [!IMPORTANT]
> Azure resources created in this section incur immediate costs, primarily from the Azure AI Search resource. These resources might accrue costs even if you interrupt the command before it fully executes. 

1. Create the Azure resources and deploy the source code by running the following Azure Developer CLI (azd) command:

   ```bash
   azd up
   ```

1. The process prompts you for one or more of the following settings based on your configuration:

   - **Environment name**: This value is used as part of the resource group name. Enter a short name with lowercase letters, such as **myenv**. 

   - **Subscription**: Select a subscription to create the resources in. The GitHub Codespaces UI shows a few values at a time. You might need to use the arrows to scroll the full list of available options. 

   - **Location**: This region location is used for most resources, including hosting. Select a region location near you. 

   - **Location for OpenAI model or Document Intelligence resource**: Select the location nearest you. If the region you selected for your **Location** is available for this setting, select the same region.

   It take can take some time for the app to deploy. Wait for the deployment to complete before continuing. 

1. After the app successfully deploys, the Terminal displays an endpoint URL:

   :::image type="content" source="media/get-started-app-chat-template/azd-deployed-endpoint.png" border="false" alt-text="Screenshot that shows the endpoint URL for the deployed app as reported after completion of the 'azd up' process.":::

1. Select the endpoint URL to open the chat application in a browser:

   :::image type="content" source="./media/get-started-app-chat-template/browser-chat-with-your-data.png" border="false" alt-text="Screenshot of the chat app showing several suggestions for chat input and the chat text box to enter a question.":::

## Use chat app to get answers from PDF files

The chat app is preloaded with employee benefits information from [PDF files](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main/data). You can use the chat app to ask questions about the benefits. The following steps walk you through the process of using the chat app. Your answers might vary as the underlying models are updated. 

1. In the chat app, select the **What happens in a performance review?** option, or enter the same text in the chat text box. The app returns the initial response:

   :::image type="content" source="./media/get-started-app-chat-template/browser-chat-initial-answer.png" border="false" lightbox="./media/get-started-app-chat-template/browser-chat-initial-answer.png" alt-text="Screenshot of the initial answer from the chat app for the question, What happens in a performance review?":::

1. In the answer box, select a citation:

   :::image type="content" source="./media/get-started-app-chat-template/browser-chat-initial-answer-citation.png" border="false" lightbox="./media/get-started-app-chat-template/browser-chat-initial-answer-citation.png" alt-text="Screenshot that shows a citation highlighted in the answer box for the chat app.":::

1. GitHub Codespaces opens the right **Citation** pane with three tabbed regions and the focus is on the **Citation** tab:

   :::image type="content" source="./media/get-started-app-chat-template/browser-chat-document-tabs.png" border="false" lightbox="./media/get-started-app-chat-template/browser-chat-document-tabs.png" alt-text="Screenshot of the right pane open in GitHub Codespaces with information visible for the Citation tab.":::

   GitHub Codespaces provides three tabs of information to help you understand how the chat app generated the answer:

   | Tab | Description |
   | --- | --- |
   | **Thought Process**    | Displays a script of the question/answer interactions in the chat. You can view the content provided by the chat app `system`, questions entered by the `user`, and clarifications made by the system `assistant`. |
   | **Supporting Content** | Lists the information used to answer your question and the source material. The number of source material citations is specified by the **Developer settings**. The default number of citations is **3**. |
   | **Citation**           | Shows the original source contain for the selected citation. |

1. When you're done, select the currently selected tab in the right pane. The right pane closes.

## Use settings to change response behavior

The specific OpenAI model determines the intelligence of the chat and the settings used to interact with the model. The **Developer settings** option opens the **Configure answer generation** pane where you can change settings for the chat app:

:::image type="content" source="./media/get-started-app-chat-template/browser-chat-developer-settings.png" border="false" lightbox="./media/get-started-app-chat-template/browser-chat-developer-settings.png" alt-text="Screenshot of the developer settings available in the right pane in the chat app.":::

| Setting | Description |
| --- | --- |
| **Override prompt template** | Overrides the prompt used to generate the answer based on the question and search results. |
| **Temperature** | Sets the temperature of the request to the large language model (LLM) that generates the answer. Higher temperatures result in more creative responses, but they might be less grounded. |
| **Seed** | Sets a seed to improve the reproducibility of the model's responses. The seed can be any integer. |
| **Minimum search score** | Sets a minimum score for search results returned from Azure AI Search. The score range depends on whether you use [Hybrid (default), Vectors only, or Text only](/azure/search/hybrid-search-ranking#scores-in-a-hybrid-search-results) for the **Retrieval mode** setting. |
| **Minimum reranker score** | Sets a minimum score for search results returned from the semantic reranker. The score always ranges between 0-4. The higher the score, the more semantically relevant the result is to the question. |
| **Retrieve this many search results** | Sets the number of search results to retrieve from Azure AI Search. More results can increase the likelihood of finding the correct answer, but might lead to the model getting 'lost in the middle.' You can see the returned sources in the **Thought Process** and **Supporting Content** tabs of the **Citation** pane. |
| **Include category** | Specifies the categories to include when generating the search results. Use the dropdown list to make your selection. The default action is to include **All** categories. |
| **Exclude category** | Specifies any categories to exclude from the search results. There are no categories used in the default data set. |
| **Use semantic ranker for retrieval** | Enables the Azure AI Search [semantic ranker](/azure/search/semantic-search-overview#what-is-semantic-search), a model that reranks search results based on semantic similarity to the user's query. |
| **Use semantic captions** | Sends semantic captions to the LLM instead of the full search result. A semantic caption is extracted from a search result during the process of semantic ranking. |
| **Suggest follow-up questions** | Asks the LLM to suggest follow-up questions based on the user's query. |
| **Retrieval mode** | Sets the retrieval mode for the Azure AI Search query. The default action is **Vectors + Text (Hybrid)**, which uses a combination of vector search and full text search. The **Vectors** option uses only vector search. The **Text** option uses only full text search. The **Hybrid** approach is optimal. |
| **Stream chat completion responses** | Continuously streams the response to the chat UI as the content is generated. |

The following steps walk you through the process of changing the settings.

1. In the browser, select the **Developer settings** option.

1. Select the **Suggest follow-up questions** checkbox to enable the option, and select **Close** to apply the setting change.

1. In the chat app, reask the question, this time by entering the text in the question box:

   ```text
   What happens in a performance review?
   ```

   The chat app answer now includes suggested follow-up questions:

   :::image type="content" source="./media/get-started-app-chat-template/browser-chat-question-suggestions.png" border="false" alt-text="Screenshot that shows how the chat app provides suggested follow-up questions after the answer.":::

1. Select the **Developer settings** option again, and unselect **Use semantic ranker for retrieval** option. Close the settings.

1. Ask the same question again, and notice the difference in the answer from the chat app.

   **With the Semantic ranker**: "During a performance review at Contoso Electronics, your supervisor will discuss your performance over the past year and provide feedback on areas for improvement. You will also have the opportunity to discuss your goals and objectives for the upcoming year. The review is a two-way dialogue between managers and employees, and it is encouraged for employees to be honest and open during the process (1). The feedback provided during the review should be positive and constructive, aimed at helping employees develop and grow in their roles. Employees will receive a written summary of their performance review, which will include a rating of their performance, feedback, and goals and objectives for the upcoming year (1)."

   **Without the Semantic ranker**: "During a performance review at Contoso Electronics, your supervisor will discuss your performance over the past year and provide feedback on areas for improvement. It is a two-way dialogue where you are encouraged to be honest and open (1). The feedback provided during the review should be positive and constructive, aimed at helping you develop and grow in your role. You will receive a written summary of the review, including a rating of your performance, feedback, and goals for the upcoming year (1)."

## Clean up resources

After you complete the exercise, it's a best practice to remove any resources that are no longer required.

### Clean up Azure resources

The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

Delete the Azure resources and remove the source code by running the following Azure Developer CLI (azd) command:

```bash
azd down --purge --force
```

The command switches include: 

* `purge`: Deleted resources are immediately purged. This option allows you to reuse the Azure OpenAI tokens per minute (TPM) metric.
* `force`: The deletion happens silently, without requiring user consent. 

### Clean up codespaces

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces - Monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-your-products/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign into the GitHub Codespaces dashboard (<https://github.com/codespaces>).

1. On the dashboard, locate your currently running codespaces sourced from the [`Azure-Samples/azure-search-openai-demo`](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository:

   :::image type="content" source="./media/get-started-app-chat-template/github-codespace-dashboard.png" lightbox="./media/get-started-app-chat-template/github-codespace-dashboard.png" alt-text="Screenshot of all the running GitHub codespaces, including their status and templates.":::

1. Open the context menu for the codespace and select **Delete**:

   :::image type="content" source="./media/get-started-app-chat-template/github-codespace-delete.png" lightbox="./media/get-started-app-chat-template/github-codespace-delete.png" alt-text="Screenshot of the context menu for a single codespace with the delete option highlighted.":::

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

- Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**:

   :::image type="content" source="./media/get-started-app-chat-template/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment in Visual Studio Code.":::

> [!TIP]
> Visual Studio Code stops the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main#troubleshooting).

If your issue isn't addressed, log your issue to the repository's [Issues](https://github.com/Azure-Samples/azure-search-openai-demo/issues).

## Related content

* [Get the source code for the sample used in this article](https://github.com/Azure-Samples/azure-search-openai-demo)
* [Build a chat app with Azure OpenAI](https://aka.ms/azai/chat) best practice solution architecture
* [Access control in Generative AI Apps with Azure AI Search](https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/access-control-in-generative-ai-applications-with-azure-ai/ba-p/3956408)
* [Build an Enterprise ready OpenAI solution with Azure API Management](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/build-an-enterprise-ready-azure-openai-solution-with-azure-api/bc-p/3935407)
* [Outperforming vector search with hybrid retrieval and ranking capabilities](https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/azure-ai-search-outperforming-vector-search-with-hybrid/ba-p/3929167)

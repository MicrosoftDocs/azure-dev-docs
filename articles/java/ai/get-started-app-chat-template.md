---
title: Get started with the Chat Using your Own Data Sample for Java
description: Get started with Java and search across your own data using a chat app sample implemented using Azure OpenAI Service and Retrieval Augmented Generation (RAG) in Azure AI Search. Easily deploy with Azure Developer CLI. This article uses the Azure AI Reference Template sample.
ms.date: 02/05/2025
ms.topic: get-started
ms.custom: devx-track-java, devx-track-java-ai, devx-track-extended-java, devx-track-extended-azdevcli, build-2024-intelligent-apps
# CustomerIntent: As a Java developer new to Azure OpenAI, I want deploy and use sample code to interact with app infused with my own business data so that learn from the sample code.
---

# Get started with the chat using your own data sample for Java

This article shows you how to deploy and run the [Chat with your data sample for Java](https://github.com/Azure-Samples/azure-search-openai-demo-java). This sample implements a chat app using Java, Azure OpenAI Service, and [Retrieval Augmented Generation (RAG)](/azure/search/retrieval-augmented-generation-overview) in Azure AI Search to get answers about employee benefits at a fictitious company. The app is seeded with PDF files including the employee handbook, a benefits document, and a list of company roles and expectations.

* [Demo video](https://aka.ms/azai/java/video)

In this article, you accomplish the following tasks:

- Deploy a chat app to Azure.
- Get answers about employee benefits.
- Change settings to change behavior of responses.

Once you complete this article, you can start modifying the new project with your custom code.

This article is part of a collection of articles that show you how to build a chat app using Azure OpenAI Service and Azure AI Search. Other articles in the collection include: 

* [.NET](/dotnet/ai/get-started-app-chat-template)
* [JavaScript](../../javascript/ai/get-started-app-chat-template.md)
* [Python](../../python/get-started-app-chat-template.md)

> [!NOTE]
> This article uses one or more [AI app templates](../../ai/intelligent-app-templates.md) as the basis for the examples and guidance in the article. AI app templates provide you with well-maintained, easy to deploy reference implementations that help to ensure a high-quality starting point for your AI apps.

## Architectural overview

A simple architecture of the chat app is shown in the following diagram:

:::image type="content" source="./media/get-started-app-chat-template/simple-architecture-diagram.png" alt-text="Diagram showing architecture from client to backend app.":::

Key components of the architecture include:

* A web application to host the interactive chat experience.
* An Azure AI Search resource to get answers from your own data.
* An Azure OpenAI Service to provide: 
    * Keywords to enhance the search over your own data.
    * Answers from the OpenAI model.
    * Embeddings from the ada model

## Cost

Most resources in this architecture use a basic or consumption pricing tier. Consumption pricing is based on usage, which means you only pay for what you use. To complete this article, there's a charge but it's minimal. When you're done with the article, you can delete the resources to stop incurring charges.

Learn more about [cost in the sample repo](https://github.com/Azure-Samples/azure-search-openai-demo-java#cost-estimation).

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this article, you need the following prerequisites:

#### [Codespaces (recommended)](#tab/github-codespaces)

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true).
* Azure account permissions - your Azure account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
* A GitHub account.

#### [Visual Studio Code](#tab/visual-studio-code)

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)
* Azure account permissions - Your Azure Account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
* [Azure Developer CLI](/azure/developer/azure-developer-cli)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
* [Visual Studio Code](https://code.visualstudio.com/)
* [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## Open development environment

Begin now with a development environment that has all the dependencies installed to complete this article.

### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with two core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Right-click on the following button, and select **Open link in new windows** in order to have both the development environment and the documentation available at the same time. 

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo-java)

1. On the **Create codespace** page, review the codespace configuration settings and then select **Create Codespace**.

    :::image type="content" source="./media/get-started-app-chat-template/github-create-codespace.png" alt-text="Screenshot of the confirmation screen before creating a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. The remaining tasks in this article take place in the context of this development container.

### [Visual Studio Code](#tab/visual-studio-code)

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
    azd init -t azure-search-openai-demo-java
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

The sample repository contains all the code and configuration files you need to deploy a chat app to Azure. The following steps walk you through the process of deploying the sample to Azure.

### Deploy chat app to Azure

> [!IMPORTANT]
> Azure resources created in this section incur immediate costs, primarily from the Azure AI Search resource. These resources might accrue costs even if you interrupt the command before it's fully executed. 

1. Provision the Azure resources and deploy the source code by running the following command:

   ```bash
   azd up
   ```

1. If you're prompted to enter an environment name, keep it short and lowercase, for example, `myenv`. It's used as part of the resource group name.

1. When prompted, select a subscription to create the resources in.

1. When you're prompted to select a location the first time, select a location near you. This location is used for most the resources including hosting.

1. If you're prompted for a location for the OpenAI model, select a location that is near you. If the same location is available as your first location, select that.

1. Wait until app is deployed, which can take 5-10 minutes to complete.

1. After the application successfully deploys, you see a URL displayed in the terminal.

1. Select that URL labeled `Deploying service web` to open the chat application in a browser.

   :::image type="content" source="./media/get-started-app-chat-template/browser-chat-with-your-data.png" alt-text="Screenshot of chat app in browser showing several suggestions for chat input, as well as the chat box where you enter a question.":::

### Use chat app to get answers from PDF files

The chat app is preloaded with employee benefits information from [PDF files](https://github.com/Azure-Samples/azure-search-openai-demo-java/tree/main/data). You can use the chat app to ask questions about the benefits. The following steps walk you through the process of using the chat app.

1. In the browser, select or enter **What is included in my Northwind Health Plus plan that is not in standard?** in the chat text box.

    :::image type="content" source="./media/get-started-app-chat-template/browser-chat-initial-answer.png" lightbox="./media/get-started-app-chat-template/browser-chat-initial-answer.png" alt-text="Screenshot of chat app's first answer.":::

1. From the answer, select one of the citations.

   :::image type="content" source="./media/get-started-app-chat-template/browser-chat-initial-answer-citation-highlighted.png" lightbox="./media/get-started-app-chat-template/browser-chat-initial-answer-citation-highlighted.png" alt-text="Screenshot of chat app's first answer with its citation highlighted in a red box.":::

1. In the right-pane, use the tabs to understand how the answer was generated.

   | Tab                    | Description                                                                    |
   |------------------------|--------------------------------------------------------------------------------|
   | **Thought process**    | Script of the interactions in chat.                                  |
   | **Supporting content** | Includes the information to answer your question and the source material. |
   | **Citation**           | Displays the PDF page that contains the citation.                         |

1. When you're done, select the selected tab again to close the pane.

### Use chat app settings to change behavior of responses

The OpenAI model and the settings that are used to interact with the model determine the intelligence of the chat app.

:::image type="content" source="./media/get-started-app-chat-template/browser-chat-developer-settings-chat-pane.png" alt-text="Screenshot of chat developer settings.":::

| Setting                                                   | Description                                                                                                                                                                                                                                                                                         |
|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Override prompt template                                  | Prompt that is used to generate the answer.                                                                                                                                                                                                                                             |
| Retrieve this many search results                         | Number of search results that are used to generate the answer. You can see these sources returned in the **Thought process** and **Supporting content** tabs of the citation.                                                                                                               |
| Exclude category                                          | Category of documents that are excluded from the search results.                                                                                                                                                                                                                        |
| Use semantic ranker for retrieval                         | Feature of [Azure AI Search](/azure/search/semantic-search-overview#what-is-semantic-search) that uses machine learning to improve the relevance of search results.                                                                                                                       |
| Use query-contextual summaries instead of whole documents | When both `Use semantic ranker` and `Use query-contextual summaries` are checked, the LLM uses captions extracted from key passages, instead of all the passages, in the highest ranked documents.                                                                                                  |
| Suggest follow-up questions                               | Have the chat app suggest follow-up questions based on the answer.                                                                                                                                                                                                                                  |
| Retrieval mode                                            | **Vectors + Text** means that the search results are based on the text of the documents and the embeddings of the documents. **Vectors** means that the search results are based on the embeddings of the documents. **Text** means that the search results are based on the text of the documents. |
| Stream chat completion responses                          | Stream response instead of waiting until the complete answer is available for a response.                                                                                                                                                                                                           |

The following steps walk you through the process of changing the settings.

1. In the browser, select the **Developer Settings** tab.

1. Select the **Suggest follow-up questions** checkbox and ask the same question again.

    ```
    What is my deductible?
    ```

    The chat returns suggested follow-up questions such as these:

    ```
    1. What is the cost sharing for out-of-network services?
    2. Are preventive care services subject to the deductible?
    3. How does the prescription drug deductible work?
    ```

1. In the **Settings** tab, deselect **Use semantic ranker for retrieval**.

1. Ask the same question again?

    ```
    What is my deductible?
    ```

1. What is the difference in the answers?

    For example the response, which used the Semantic ranker provided a single answer: `The deductible for the Northwind Health Plus plan is $2,000 per year`.

    The response without semantic ranking returned an answer, which required more work to get the answer: `Based on the information provided, it is unclear what your specific deductible is. The Northwind Health Plus plan has different deductible amounts for in-network and out-of-network services, and there is also a separate prescription drug deductible. I would recommend checking with your provider or referring to the specific benefits details for your plan to determine your deductible amount`.

## Clean up resources

### Clean up Azure resources

The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges. Use the following command to delete the Azure resources and remove the source code:

```bash
azd down --purge
```

### Clean up GitHub Codespaces

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign into the [GitHub Codespaces dashboard](https://github.com/codespaces).

1. Locate your currently running Codespaces sourced from the [Azure-Samples/azure-search-openai-demo-java](https://github.com/Azure-Samples/azure-search-openai-demo-java) GitHub repository.

    :::image type="content" source="./media/get-started-app-chat-template/github-codespace-dashboard.png" alt-text="Screenshot of all the running Codespaces including their status and templates.":::

1. Open the context menu for the codespace and then select **Delete**.

    :::image type="content" source="./media/get-started-app-chat-template/github-codespace-delete.png" alt-text="Screenshot of the context menu for a single codespace with the delete option highlighted.":::

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

:::image type="content" source="./media/get-started-app-chat-template/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code stops the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## How is the question answered?

The app is separated out into two apps:

* A front-end JavaScript application using the React framework with the Vite build tool.
* A back-end Java application answers the question.

The backend `/chat` API steps through the process of getting the answer:

* Build RAG options: Create a set of options used to generate an answer.
* Create approach using RAG options: Use a combination of retrieval-based and generative-based models to create an approach for generating an accurate and natural-sounding response.
* Run the approach with RAG options and previous conversation: Use the approach and RAG options to generate an answer based on the previous conversation. The answer includes information about which documents were used to generate the response.

## Get help

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/azure-search-openai-demo-java/tree/main#troubleshooting). If your issue isn't addressed, log it in the repository's [Issues](https://github.com/Azure-Samples/azure-search-openai-demo-java/issues).

## Next steps

* [Get the source code for the sample used in this article](https://github.com/Azure-Samples/azure-search-openai-demo-java)
* [Build a chat app with Azure OpenAI](https://aka.ms/azai/chat) best practice solution architecture
* [Access control in Generative AI Apps with Azure AI Search](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/access-control-in-generative-ai-applications-with-azure/ba-p/3956408)
* [Build an Enterprise ready OpenAI solution with Azure API Management](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/build-an-enterprise-ready-azure-openai-solution-with-azure-api/bc-p/3935407)
* [Outperforming vector search with hybrid retrieval and ranking capabilities](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167)
* [More Azure AI end-to-end templates](https://aka.ms/aigallery)

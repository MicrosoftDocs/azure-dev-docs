---
title: Deploy an Azure OpenAI Chat app with your data in Python
description: Quickstart to deploy and use an Azure OpenAI Chat app supplimented with your data in Python. Easily deploy with Azure Developer CLI.
ms.date: 10/05/2023
ms.topic: quickstart
ms.custom: devx-track-python
---

# Quickstart: Deploy an Azure OpenAI Chat app with your data in Python

In this quickstart, you deploy and use an intelligent Chat app to get answers about employee benefits at a fictitious company. The employee benefits chat app is seeded with PDF file including the employee handbook, a benefits document and a list of company roles and expections. By following the instructions in this quickstart, you will:

- Deploy an intelligent Chat app to Azure.
- Use intelligent Chat app to get answers about employee benefits.
- Use intelligent Chat app settings to change behavior of responses.
- Understand architecture of Azure resources.
- Review code of intelligent Chat app.

It should take less than 15 minutes to complete this tutorial. Upon completion, you can start modifying the new project with your custom code.

This quickstart is part of a collection of quickstarts that show you how to build an intelligent Chat app using Azure Cognitive Search and OpenAI. To see the full collection, see [Build an intelligent Chat app with Azure Cognitive Search and OpenAI](/azure/search/cognitive-search-tutorial-blob).

## Architectural overview

A simple architecture of the intelligent Chat app is shown in the following diagram:

:::image type="content" source="{source}" alt-text="{alt-text}":::

Key components of the architecture include:

* A web application to host the interactive chat experience.
* An Azure Cognitive Search service to provid search of the PDF file catalog.
* An Azure Cognitive Services account to use the OpenAI model.

A more complete architectural overview is available later in this quickstart: [Understand architecture of Azure resources]().

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this quickstart. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this quickstart, you need the following prerequisites:

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

## Open sample project in development environment

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this training module.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Start the process to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/azure-search-openai-demo`](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository:

    > [!div class="nextstepaction"]
    > [Open this project in GitHub Codespaces](https://github.com/codespaces/new?azure-portal=true&hide_repo_select=true&ref=start&repo=599293758)

1. On the **Create codespace** page, review the codespace configuration settings and then select **Create new codespace**

    :::image type="content" source="../media/codespace-configuration.png" alt-text="Screenshot of the confirmation screen before creating a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. The remaining tasks in this quickstart take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this training module.

1. Open **Visual Studio Code** in the context of an empty directory.

1. Ensure that you have the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed in Visual Studio Code.

1. Open a new terminal in the editor.

    > [!TIP]
    > You can use the main menu to navigate to the **Terminal** menu option and then select the **New Terminal** option.
    >
    > :::image type="content" source="../media/open-terminal-option.png" lightbox="../media/open-terminal-option.png" alt-text="Screenshot of the menu option to open a new terminal.":::

1. Sign in to Azure with the Azure Developer CLI.

    ```bash
    az auth login
    ```

    Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. Initialize the folder to use the sample project with Azure Developer CLI:

    ```bash
    azd init -t azure-search-openai-demo
    ```

    You do not need to clone this repository.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen in Container**.

    :::image type="content" source="../media/reopen-container-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within the context of a development container.":::

    > [!TIP]
    > Visual Studio Code may automatically prompt you to reopen the existing folder within a development container. This is functionally equivalent to using the command palette to reopen the current workspace in a container.
    >
    > :::image type="content" source="../media/reopen-container-toast.png" alt-text="Screenshot of a toast notification to reopen the current folder within the context of a development container.":::


1. The remaining exercises in this project take place in the context of this development container.

---

## Deploy intelligent Chat app to Azure

The sample repository contains all the code and configuration files you need to deploy an intelligent Chat app to Azure. The following steps walk you through the process of deploying the sample to Azure.

[!Caution] 
> Azure resources created in this section immediate costs, primarily from the Cognitive Search resource. These resources may accrue costs even if you interrupt the command before it is fully executed. 

1. Run the following Azure Developer CLI command to provision the Azure resources and deploy the source code:

    ```bash
    azd up
    ```

1. When you are prompted to select a location the first time, select a location near you. This location is used for the majority of the resources including hosting.
1. When you are prompted for a location for the OpenAI model, select a location that is near you. If the same location is available as your first location, select that.
1. Wait until app is deployed. It may take 5-10 minutes for the deployment to complete.
1. After the application has been successfully deployed, you see a URL displayed in the terminal. 
1. Select that URL to open the chat application in a browser.

## Use intelligent Chat app to get answers from PDF file catalog

The chat app is preloaded with employee benefits information from a [PDF file catalog](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main/data). You can use the chat app to ask questions about the benefits. The following steps walk you through the process of using the chat app.

1. In the browser, enter a question about the catalog in the text box at the bottom of the page such as one of the following: 

    * Do my benefits include legal services?
    * Does my plan cover annual eye exams?
    * What is my deductible?
    * How do I switch roles? 

1. From the answer, select one of the citations.
1. In the right-pane, use the tabs to understand how the answer was generated.

    |Tab|Description|
    |---|---|
    |**Thought process**|This is a script of the interactions in chat.|
    |**Supporting content**|This includes the information to answer your question and the source material.|
    |**Citation**|This displays the PDF page that contains the citation.|

## Use intelligent Chat app settings to change behavior of responses

The intelligence of the chat app is determined by the OpenAI model and the settings that are used to interact with the model. The following steps walk you through the process of changing the settings.

1. In the browser, select the **Developer Settings** tab.
1. Check the **Suggest follow-up questions** checkbox and ask the same question again.

    ```
    What is my deductible?
    ```

    The chat returned suggested follow-up questions such as the following:

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

    The answer which used the Semantic ranker provided a single answer: `The deductible for the Northwind Health Plus plan is $2,000 per year`.

    The answer without semantic ranking returned an answer which required additional work to get the answer: `Based on the information provided, it is unclear what your specific deductible is. The Northwind Health Plus plan has different deductible amounts for in-network and out-of-network services, and there is also a separate prescription drug deductible. I would recommend checking with your provider or referring to the specific benefits details for your plan to determine your deductible amount`.


## Understand architecture of Azure resources 



## Review code of intelligent Chat app


## Troubleshooting

* My chat app didn't deploy successfully?
* My chat app doesn't display in a web browser? 
* My chat app doesn't return the expected answer?

## Clean up resources



## Related Content

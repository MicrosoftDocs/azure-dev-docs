---
title: "JavaScript Azure OpenAI Assistants and function calling"
description: "This article shows you how to deploy and run the serverless Azure OpenAI Assistant with function calling."
ms.date: 12/11/2024
ms.topic: get-started
ms.service: azure-javascript
ms.subservice: intelligent-apps
ms.custom: devx-track-js, devx-track-js-ai
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As a JavaScript developer new to Azure OpenAI, I want to understand and deploy an app using assistants and function calling.
---
# Get started with Azure OpenAI with Assistants and function calling in JavaScript

This article shows you how to deploy and run the [serverless Azure OpenAI Assistant Quick Start](https://github.com/Azure-Samples/azure-openai-assistant-javascript). This sample implements an assistants app using JavaScript, Azure OpenAI Service assistants with function calling, and Azure Functions.

## Architectural overview

Azure OpenAI Assistants allows you to create AI assistants tailored to your needs through custom instructions and augmented by advanced tools like code interpreter, and custom functions. In this article, we provide an in-depth walkthrough of getting started with the Assistants API.

:::image type="content" source="../media/get-started-app-chat-assistants-function-calling/azure-openai-assistant-diagram.png" alt-text="Diagram showing architecture from client to backend app.":::

This application is built around two main components:

- A simple HTML page with a vanilla CSS and JavaScript files, and hosted on [Azure Static Web Apps](/azure/static-web-apps/overview). 

- A serverless API built with [Azure Functions](/azure/azure-functions/functions-overview?pivots=programming-language-javascript) and using OpenAI JavaScript SDK. The serverless app sends the assistants definition including the function call to the OpenAI endpoint. The endpoint responds with the follow-up function call and the parameters needed to complete that call. 

    - The sample's function call simulates an API call by generating a random stock ticker value based on the stock symbol sent into the Azure Function. This simulation can be replaced with a remote API in your solution.

    :::image type="content" source="../media/get-started-app-chat-assistants-function-calling/diagram-azure-openai-service-function-calling-architecture.png" alt-text="Diagram showing Azure Functions integration with Azure OpenAI where Azure OpenAI can return follow-up function names which Azure Functions should call.":::

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this article, you need the following prerequisites:

#### [Codespaces (recommended)](#tab/github-codespaces)

1. An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)
1. Azure account permissions - Your Azure Account must have Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
1. A GitHub account.

#### [Visual Studio Code](#tab/visual-studio-code)
1. An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)
1. Azure account permissions - Your Azure Account must have Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
1. [Azure Developer CLI](../../azure-developer-cli/install-azd.md?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
1. [Git](https://git-scm.com/downloads) 
1. [Visual Studio Code](https://code.visualstudio.com/)
1. [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## Open development environment

Use the following instructions to deploy a preconfigured development environment containing all required dependencies to complete this article.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Start the process to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/azure-openai-assistant-javascript`](https://github.com/Azure-Samples/azure-openai-assistant-javascript) GitHub repository.
1. Right-click on the following button, and select _Open link in new windows_ to have both the development environment and the documentation available at the same time.

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-openai-assistant-javascript)

1. On the **Create codespace** page, review the codespace configuration settings and then select **Create new codespace**

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. The remaining tasks in this article take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

1. Fork the sample repository by selecting this [Azure-Samples/azure-openai-assistant-javascript](https://github.com/Azure-Samples/azure-openai-assistant-javascript/fork) link.
1. Clone your fork repository. Replace `<YOUR-GITHUB-ACCOUNT>` with your GitHub account name.

    ```console
    git clone https://github.com/<YOUR-GITHUB-ACCOUNT>/azure-openai-assistant-javascript
    ```

1. Open **Visual Studio Code** in the new folder.

    ```console
    cd azure-openai-assistant-javascript
    code .
    ```

1. Ensure that you have the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed in Visual Studio Code.

1. Open a new terminal in the editor.

    > [!TIP]
    > You can use the main menu to navigate to the **Terminal** menu option and then select the **New Terminal** option.
    >
    > :::image type="content" source="../media/get-started-app-chat-assistants-function-calling/open-terminal-option.png" lightbox="../media/get-started-app-chat-assistants-function-calling/open-terminal-option.png" alt-text="Screenshot of the menu option to open a new terminal.":::

1. Sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

    Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen in Container**.

    > [!TIP]
    > Visual Studio Code may automatically prompt you to reopen the existing folder within a development container. This is functionally equivalent to using the command palette to reopen the current workspace in a container.

1. Reopen the Terminal window again (<kbd>Ctrl</kbd> + <kbd>`</kbd>) and leave it open.
1. The remaining exercises in this project take place in the context of this development container.

---

## Deploy and run

The sample repository contains all the code and configuration files you need to deploy a function app to Azure. The following steps walk you through the process of deploying the sample to Azure.

### Deploy assistants app to Azure

> [!IMPORTANT]
> Azure resources created in this section incur immediate costs, primarily from the Azure AI Search resource. These resources may accrue costs even if you interrupt the command before it is fully executed.

1. Run the following Azure Developer CLI command to provision the Azure resources and deploy the source code:

    ```bash
    azd up
    ```

1. When you're prompted to enter an environment name, keep it short and lowercase. For example, `myenv`. It's used as part of the resource group name. 
1. When prompted, select a subscription to create the resources in. 
1. When you're prompted to select a location the first time, select a location near you. This location is used for most the resources including hosting.
1. If you're prompted for a location for the OpenAI model, select a location that is near you. If the same location is available as your first location, select that.
1. Wait until app is deployed. It might take 5-10 minutes for the deployment to complete.
1. After deploying the application successfully, you see a URL displayed in the terminal.
1. Select that URL labeled `Deploying service web` to open the assistant application in a browser.

### Use the assistant app

You can use the assistant app to get the stock market price of `MSFT`. The following steps walk you through the process of using the assistant app. The assistant can send you the answers in email. Since the email sending feature isn't configured, modify the prompt to not use that instruction.

1. In the browser, copy and paste in the following prompt:

    ```
    Based on the latest financial data and current stock market trends, can you provide a detailed analysis of Microsoft's current state? Please include insights into their recent performance, market position, and future outlook. Additionally, retrieve and include the latest closing price of Microsoft's stock using its ticker symbol (MSFT). 
    ```

1. Select the **Run** button. Your results should look _similar_ to the following response.

    :::image type="content" source="../media/get-started-app-chat-assistants-function-calling/azure-openai-assistant-demo.png" alt-text="Screenshot of assistant app's first answer.":::

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

1. Sign into the [GitHub Codespaces dashboard](https://github.com/codespaces).

1. Locate your currently running Codespaces sourced from the [`Azure-Samples/azure-openai-assistant-javascript`](https://github.com/Azure-Samples/azure-openai-assistant-javascript) GitHub repository.

    :::image type="content" source="../media/get-started-app-chat-assistants-function-calling/github-codespace-dashboard.png" alt-text="Screenshot of all the running Codespaces including their status and templates.":::

1. Open the context menu, `...`, for the codespace and then select **Delete**.

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="../media/get-started-app-chat-assistants-function-calling/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code will stop the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/azure-openai-assistant-javascript/tree/main#troubleshooting).

If your issued isn't addressed, log your issue to the repository's [Issues](https://github.com/Azure-Samples/azure-openai-assistant-javascript/issues).

## Related content

- [What is the Azure OpenAI Assistants API?](/azure/ai-services/openai/concepts/assistants)
- [Get started with evaluating answers in a chat app in JavaScript](get-started-app-chat-evaluations.md)
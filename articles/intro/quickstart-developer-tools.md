---
title: "Quickstart: Get started with Azure developer tools"
description: Get hands-on with the Azure Developer CLI, Azure Tools for VS Code, and GitHub Copilot for Azure.
ms.service: azure
ms.topic: quickstart
ms.date: 03/25/2026
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Quickstart: Get started with Azure developer tools

In this quickstart, you use the core Azure developer tools to deploy a sample application to Azure. By the end, you have hands-on experience with:

- Azure Developer CLI (azd) to scaffold and deploy a full-stack app
- Azure Tools for VS Code extension pack to browse and manage your deployed resources
- GitHub Copilot for Azure to get AI-assisted answers about your Azure resources

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A [GitHub Copilot](https://github.com/features/copilot) subscription - required by GitHub Copilot for Azure
- Use either the local installation of the tools or the browser-based VS Code for the Web experience. For the local installation, ensure you have:
    - [Visual Studio Code](https://code.visualstudio.com/)
    - [Git](https://git-scm.com/downloads) - required by Azure Developer CLI to clone the template repository

## Set up the tools

You can choose to use the tools directly in the browser with VS Code for the Web or install them locally. The browser-based experience is the fastest way to get started, while the local installation provides a local development environment.

# [VS Code for the Web](#tab/vscode-web)

[VS Code for the Web (vscode.dev/azure)](https://vscode.dev/azure) gives you a browser-based VS Code environment with CLIs and several extensions preinstalled. No local installation is required.

1. Open [vscode.dev/azure](https://vscode.dev/azure) in your browser.
1. Sign in by using your Azure account when prompted.
1. Some Azure extensions are preinstalled. For all Azure tools, install the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) You can install it from the Extensions view in VS Code for the Web. Search for "Azure Tools" and select **Install**.

You now have access to the Azure Tools extensions and GitHub Copilot for Azure directly in the browser.

:::image type="content" source="media/quickstart-developer-tools/azure-extensions.png" alt-text="Screenshot of VS Code for the Web showing Azure Tools extension pack details and installed Azure extensions list.":::

For more information about using VS Code for the Web for Azure development, see [VS Code for the Web - Azure](https://code.visualstudio.com/docs/azure/vscodeforweb).

# [Install tools locally](#tab/local-install)

Install the following tools locally to get a full development experience on your machine.

1. The Azure Developer CLI (azd) is a command-line tool that simplifies provisioning and deploying applications to Azure. Follow the steps in [Install the Azure Developer CLI](../azure-developer-cli/install-azd.md) for your operating system.
1. The [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) includes extensions for Azure App Service, Azure Functions, Azure Storage, Azure Databases, and more.
1. [GitHub Copilot for Azure](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot) extends Copilot with Azure-specific knowledge so you can ask questions about your Azure resources, get deployment guidance, and troubleshoot problems.

---

## Deploy a sample app with azd

Use the Azure Developer CLI to deploy a full-stack to-do application to Azure. This step creates all the Azure resources and deploys the application code.

1. Open the terminal from the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) via **Terminal > Create New Terminal**.
1. In the terminal, create and change into a new directory for your project.

    ```bash
    mkdir my-todo-app && cd my-todo-app
    ```
1. Initialize a project from a starter template. The `todo-nodejs-mongo` template is a full-stack application built with Node.js, Express, and MongoDB. The template includes an Azure Resource Manager (ARM) template that defines the required Azure resources, such as an App Service for hosting the application and an Azure Cosmos DB account for the database.

    ```azdeveloper
    azd init --template todo-nodejs-mongo
    ```
     When prompted, enter an environment name like `my-todo-dev`. Use this name as a prefix for the Azure resources.

1. Sign in to Azure:

    ```azdeveloper
    azd auth login
    ```

1. Provision Azure resources and deploy the application:

    ```azdeveloper
    azd up
    ```

    When prompted, select a subscription and region.
    
    The `azd up` command:
    - Creates a resource group with the infrastructure defined in the template.
    - Provisions the required Azure services, such as App Service and Azure Cosmos DB.
    - Deploys the application code.

    This process takes a few minutes. When it finishes, Azure Developer CLI displays the URL of your deployed application.

1. Open the URL in your browser to verify the application is running. You see a to-do application where you can add and complete tasks.

For more information, see [What is the Azure Developer CLI](../azure-developer-cli/overview.md).

## Browse resources with Azure Tools for VS Code

Now use the Azure Tools extension to explore the resources that Azure Developer CLI created.

1. Verify that you're signed in to Azure by running the following command in the terminal:

    ```azdeveloper
    azd auth status
    ```

    If the command returns your account details, you're already signed in. If not, sign in through VS Code:
    - Open the Command Palette.
    - Type **Azure: Sign In** and select it.
    - Complete the sign-in flow in your browser.

1. Open the Azure view by selecting the Azure icon in the Activity Bar (left sidebar). Expand **Resources** to see your Azure subscriptions. Make sure the resource list is grouped by **Resource Group** by selecting the **Group By** icon at the top of the Resources view and choosing **Resource Group**. Expand your subscription and find the resource group created by Azure Developer CLI. The resource group name starts with the environment name you chose when running `azd init`.

    :::image type="content" source="media/quickstart-developer-tools/azure-resources.png" alt-text="Screenshot of VS Code Azure view showing resources grouped by resource group with the Group By menu open.":::

1. Explore the deployed resources:
    - Expand the resource group to see the App Service, Cosmos DB account, and other resources.
    - Right-click the **App Service** resource and select **Browse Website** to open your deployed app.
    - Right-click the **Cosmos DB** account and select **Open in Portal** to view the database in the Azure portal.

1. View application logs:
    - Right-click the **App Service** resource.
    - Select **Start Streaming Logs** to see live log output from your running application.
    - Open your to-do app in a browser and add a task to see log entries appear.

For more information, see [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack).

## Use GitHub Copilot for Azure

Use GitHub Copilot for Azure to learn about the resources you deployed and get guidance on next steps.

1. In VS Code, open the [Copilot Chat](https://code.visualstudio.com/docs/copilot/chat/copilot-chat) view by selecting the chat icon in the activity bar.


1. Ask for guidance on your application:

    ```text
    How can I add authentication to my Azure App Service?
    ```

    Copilot provides step-by-step guidance tailored to your deployed application.

For example prompts, see:

- [Example prompts for learning about Azure and your application with GitHub Copilot for Azure](../github-copilot-azure/learn-examples.md)
- [Example prompts for designing and developing your application with GitHub Copilot for Azure](../github-copilot-azure/design-develop-examples.md)
- [Example prompts for deploying your application with GitHub Copilot for Azure](../github-copilot-azure/deploy-examples.md)

For more information about GitHub Copilot for Azure, see the [GitHub Copilot for Azure overview](../github-copilot-azure/introduction.md). 

## Clean up resources

When you're done exploring, delete the Azure resources to avoid incurring charges:

```azdeveloper
azd down
```

This command deletes all Azure resources created by `azd up`, including the resource group, App Service, and Cosmos DB account.

## Next steps

Now that you used the core Azure developer tools, explore more:

- [Azure Developer CLI templates](../azure-developer-cli/azd-templates.md) - Find templates for different languages and architectures.
- [GitHub Copilot for Azure documentation](../github-copilot-azure/introduction.md) - Learn more about AI-assisted Azure development.
- [Azure Tools for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) - Explore all available extensions.

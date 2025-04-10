---
title: "Get started with chat private endpoints"
description: "Secure the chat app with a virtual network."
ms.date: 02/26/2025
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai, devx-track-extended-azdevcli, build-2024-intelligent-apps
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As a Python developer new to Azure, I want to deploy a chat app with private access so that I understand how to secure my chat app endpoint.
---

# Get started with chat private endpoints for Python

This article shows you how to deploy and run the [enterprise chat app sample for Python](https://github.com/Azure-Samples/azure-search-openai-demo) that's accessible by private endpoints.

This sample implements a chat app by using Python, Azure OpenAI Service, and [Retrieval Augmented Generation (RAG)](/azure/search/retrieval-augmented-generation-overview) in Azure AI Search to get answers about employee benefits at a fictitious company. The app is seeded with PDF files that include the employee handbook, a benefits document, and a list of company roles and expectations.

By following the instructions in this article, you:

- Deploy a chat app to Azure for public access in a web browser.
- Redeploy a chat app with private endpoints.

After you finish this procedure, you can start modifying the new project with your custom code and redeploy, knowing that your chat app is accessible only through the private network.

## Architectural overview

The default deployment creates a chat app with public endpoints.

:::image type="content" source="media/get-started-app-chat-private-endpoints/simple-architecture-diagram-chat-app.png" lightbox="media/get-started-app-chat-private-endpoints/simple-architecture-diagram-chat-app.png" alt-text="Diagram that shows the network architecture of a basic RAG chat app.":::

For chat apps enriched with private data, securing access to your chat app is crucial. This article presents a solution by using a virtual network.

:::image type="content" source="media/get-started-app-chat-private-endpoints/diagram-vnet.png" lightbox="media/get-started-app-chat-private-endpoints/diagram-vnet.png" alt-text="Diagram that shows network architecture with all services inside an Azure virtual network.":::

Within the virtual network, there's a separate subnet for the Azure App Service app versus the other back-end Azure services. This structure makes it easy to apply different network security group rules to each subnet.

:::image type="content" source="media/get-started-app-chat-private-endpoints/diagram-subnets.png" lightbox="media/get-started-app-chat-private-endpoints/diagram-subnets.png" alt-text="Diagram that shows a chat app subnet and a back-end subnet within the virtual network.":::

Within the virtual network, the services use private endpoints to communicate with each other. Each private endpoint is associated with a private Domain Name System (DNS) zone to resolve the private endpoint's name to an IP address within the virtual network.

:::image type="content" source="media/get-started-app-chat-private-endpoints/diagram-private-endpoint-openai.png" lightbox="media/get-started-app-chat-private-endpoints/diagram-private-endpoint-openai.png" alt-text="Diagram that shows the private endpoint and private DNS zone for Azure OpenAI within the virtual network.":::

## Deployment steps

We recommend that you deploy the solution twice. Deploy once with public access to validate that the chat app is working correctly. Deploy again with private access to secure your chat app by using a virtual network.

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies that are required to finish this article. You can run the development container in GitHub Codespaces (in a browser) or locally by using Visual Studio Code.

To use this article, you need the following prerequisites.

#### [Codespaces (recommended)](#tab/github-codespaces)

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true).
- Azure account permissions. Your Azure account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
- A GitHub account.

#### [Visual Studio Code](#tab/visual-studio-code)

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true).
- Azure account permissions. Your Azure account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
- [Azure Developer CLI](/azure/developer/azure-developer-cli).
- [Docker Desktop](https://www.docker.com/products/docker-desktop/). Start Docker Desktop if it's not already running.
- [Visual Studio Code](https://code.visualstudio.com/).
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

---

## Open development environment

Begin now with a development environment that has all the dependencies installed to complete this article.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use GitHub Codespaces for up to 60 hours free each month with two core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Start the process to create a new GitHub codespace on the `main` branch of the [Azure-Samples/azure-search-openai-demo](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository.
1. Right-click the following button, and select **Open link in new windows** to have the development environment and the documentation available at the same time.

    [![Open in GitHub Codespaces.](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo)

1. On the **Create codespace** page, review the codespace configuration settings, and then select **Create codespace**.

    :::image type="content" source="./media/get-started-app-chat-private-endpoints/github-create-codespace.png" lightbox="./media/get-started-app-chat-private-endpoints/github-create-codespace.png" alt-text="Screenshot that shows the confirmation screen before you create a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI:

    ```bash
    azd auth login
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

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

The remaining exercises in this project take place in the context of this development container.

---

## Custom settings

This solution configures and deploys the infrastructure based on custom settings configured with the Azure Developer CLI. The following table explains the custom settings for this solution.

|Setting|Description|
|--|----|
|`AZURE_PUBLIC_NETWORK_ACCESS`|Controls the value of public network access on supported Azure resources. Valid values are `Enabled` or `Disabled`.|
|`AZURE_USE_PRIVATE_ENDPOINT`|Controls deployment of private endpoints, which connect Azure resources to the virtual network. The `TRUE` value means that private endpoints are deployed for connectivity.|

## Deploy the chat app

The first deployment creates the resources and provides a publicly accessible endpoint.

1. Run the following command to configure this solution for public access:

    ```console
    azd env set AZURE_PUBLIC_NETWORK_ACCESS Enabled
    ```

    When you're asked for an environment name, remember that the environment name is used to create the resource group. Enter a meaningful name. If you're on a team or in an organization, include your name, as in `morgan-chat-private-endpoints`. Make note of the environment name. You need it later to find the resources in the Azure portal.

1. Run the following command to include provisioning the virtual network resources. Remember that the deployment doesn't restrict access until the second deployment.

    ```console
    azd env set AZURE_USE_PRIVATE_ENDPOINT true
    ```

1. Deploy the solution with the following command:

    ```console
    azd up
    ```

    Provisioning resources is the most time-consuming part of the deployment process. Wait for the deployment to finish before you continue.

1. At the end of the deployment process, the app endpoint appears. Copy that endpoint into a browser to open the chat app. Select one of the questions on the cards and then wait for the answer.

    Make note of the endpoint URL because you need it again later in the article.

## Deploy the chat app to Azure with private access

Change the deployment configuration to secure the chat app for private access.

1. Run the following command to turn off public access:

    ```console
    azd env set AZURE_PUBLIC_NETWORK_ACCESS Disabled
    ```

1. Run the following command to change the resource configuration. This command doesn't redeploy the application code because that code hasn't changed.

    ```console
    azd provision
    ```

1. After the provisioning finishes, open the chat app in a browser again. The chat app is no longer accessible because the public endpoint is disabled.

## Access the chat app

To access the chat app, use a tool such as [Azure VPN Gateway](/azure/vpn-gateway/) or [Azure Virtual Desktop](/azure/virtual-desktop/users/). Remember that any tool you use to access the app must be secure and compliant with your organization's security policies.

### Clean up resources

The following steps walk you through the process of cleaning up the resources you used.

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement that you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign in to the [GitHub Codespaces dashboard](https://github.com/codespaces).

1. Locate your currently running codespaces that are sourced from the [Azure-Samples/azure-search-openai-demo](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository.

    :::image type="content" source="./media/get-started-app-chat-private-endpoints/github-codespace-dashboard.png" lightbox="./media/get-started-app-chat-private-endpoints/github-codespace-dashboard.png" alt-text="Screenshot that shows all the running codespaces including their status and templates.":::

1. Open the context menu for the codespace and then select **Delete**.

    :::image type="content" source="./media/get-started-app-chat-private-endpoints/github-codespace-delete.png" lightbox="./media/get-started-app-chat-private-endpoints/github-codespace-delete.png" alt-text="Screenshot that shows the context menu for a single codespace with the Delete option highlighted.":::

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command** palette, and search for the **Dev Containers** commands.
1. Select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="./media/get-started-app-chat-private-endpoints/reopen-local-command-palette.png" lightbox="./media/get-started-app-chat-private-endpoints/reopen-local-command-palette.png" alt-text="Screenshot that shows the Command palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code stops the running development container, but the container still exists in Docker in a stopped state. You always have the option to delete the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main#troubleshooting).

If your issue isn't addressed, add your issue to the repository's [Issues](https://github.com/Azure-Samples/azure-search-openai-demo/issues) webpage.

## Related content

* See the [enterprise chat app GitHub repository](https://github.com/Azure-Samples/azure-search-openai-demo).
* Build a [chat app with Azure OpenAI](https://aka.ms/azai/chat) best-practices solution architecture.
* Learn about [access control in generative AI apps with Azure AI Search](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/access-control-in-generative-ai-applications-with-azure/ba-p/3956408).

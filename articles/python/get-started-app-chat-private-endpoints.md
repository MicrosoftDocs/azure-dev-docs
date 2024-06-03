---
title: "Get started with chat private endpoints"
description: "Secure the chat app with Azure VPN and access the chat app with a secured Azure VM. "
ms.date: 06/03/2024
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai, devx-track-extended-azdevcli, build-2024-intelligent-apps
# CustomerIntent: As a python developer new to Azure, I want to deploy a chat app with private access so that I understand how to secure my chat app endpoint.
---

# Get started with chat private endpoints for Python

This article shows you how to deploy and run the [Enterprise chat app sample for Python](https://github.com/Azure-Samples/azure-search-openai-demo) accessible by private endpoints. Use a Bastion RDP from the Azure portal to access the virtual machine. Use a web browser on the virtual machine to access the chat app.

This sample implements a chat app using Python, Azure OpenAI Service, and [Retrieval Augmented Generation (RAG)](/azure/search/retrieval-augmented-generation-overview) in Azure AI Search to get answers about employee benefits at a fictitious company. The app is seeded with PDF files including the employee handbook, a benefits document and a list of company roles and expectations.

By following the instructions in this article, you will:

- Deploy a chat app to Azure for public access in a web browser.
- Configure private endpoints.
- Redeploy chat app with private endpoints.
- Access chat app through a VM with Bastion.

Once you complete this procedure, you can start modifying the new project with your custom code and redeploy, knowing your chat app is accessible only through the private VM with a private endpoint.

## Architectural overview

The default deployment creates a chat app with public endpoints. For chat apps enriched with private data, you should secure access to your chat app. This article shows one solution: use a virtual private network (VPN).

:::image type="content" source="media/get-started-app-chat=private-endpoints/diagram-azure-bastion-private-endpoint.png" alt-text="Diagram showing network architecture using Azure Bastion to connect to private virtual machines using the Azure portal.":::

When the chat app is secured with a VPN, the chat app is on its own subnet. A virtual machine (VM) is created on a separate subnet. From the Azure portal, use the VM remote desktop (RDP) to access the chat app. The VM is a Windows server with a Microsoft Edge browser. Use the same chat app endpoint, just through the VM's browser.

## Deployment steps

This article deploys the solution twice. The first deployment creates all the chat resources and allows you to test the chat app with the public endpoint.

Then the second deployment creates the VPN and secures the chat app to the VPN with access from the VM. You test this access by connecting to the VM with RDP.

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this article, you need the following prerequisites:

#### [Codespaces (recommended)](#tab/github-codespaces)

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true) 

- Azure account permissions - Your Azure Account must have Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

- Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access). Open an issue on this repo to contact us if you have an issue.

- GitHub account

#### [Visual Studio Code](#tab/visual-studio-code)

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)

- Azure account permissions - Your Azure Account must have Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

- Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access). Open an issue on this repo to contact us if you have an issue.

- [Azure Developer CLI](/azure/developer/azure-developer-cli)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running

- [Visual Studio Code](https://code.visualstudio.com/)

- [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## Open development environment

Begin now with a development environment that has all the dependencies installed to complete this article.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Start the process to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/azure-search-openai-demo`](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository.
1. Right-click on the following button, and select _Open link in new windows_ in order to have both the development environment and the documentation available at the same time.

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo)

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
    azd init -t azure-search-openai-demo
    ```

1. Open the Command Palette, search for and select **Dev Containers: Open Folder in Container** to open the project in a dev container. Wait until the dev container opens before continuing.
1. Sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

    Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. The remaining exercises in this project take place in the context of this development container.

---

## Custom settings

This solution configures and deploys the infrastructure based on custom settings configured with Azure Developer CLI. The following table explains the custom settings for this solution.

|Setting|Description|
|--|----|
|`AZURE_PUBLIC_NETWORK_ACCESS`|Controls the value of public network access on supported Azure resources. Valid values are `Enabled` or `Disabled`.|
|`AZURE_USE_PRIVATE_ENDPOINT`|Controls deployment of private endpoints, which connect Azure resources to the virtual network. `TRUE` means private endpoints are deployed for connectivity even when AZURE_PUBLIC_NETWORK_ACCESS is 'Disabled'.|
|`AZURE_PROVISION_VM`|Controls deployment of a [virtual machine](/azure/virtual-machines/overview) and [Azure Bastion](/azure/bastion/bastion-overview). Azure Bastion allows you to securely connect to the virtual machine, without being connected to the virtual network. Since the virtual machine is connected to the virtual network, you're able to access the chat app. You must set `AZURE_VM_USERNAME` and `AZURE_VM_PASSWORD` to provision the built-in administrator account with the virtual machine so you can sign in through Azure Bastion.|
|`AZURE_VM_USERNAME`| Sets the VM user name.|
|`AZURE_VM_PASSWORD`| Sets the VM password.|

## Deploy the chat app

1. Run the following command to configure this solution for public access.

    ```console
    azd env set AZURE_PUBLIC_NETWORK_ACCESS Enabled
    ```

    When asked for an environment name, remember that the environment name is used to create the resource group. Enter a meaningful name. If you are on a team or in an organization, include your name: `morgan-chat-private-endpoints`. Make note of the environment name displayed in the console. You need it to find the resources in the Azure portal later.

1. Run the following command to configure this solution for private endpoints. You provision the VPN resources but the deployment doesn't restrict the access.

    ```console
    azd env set AZURE_USE_PRIVATE_ENDPOINT true
    ```

    Provisioning resources is the most time consuming part of this process. If you know you intend to secure the chat app, you can create the VPN resources. 

1. Deploy the solution with the following command:

    ```console
    azd up
    ```

    Wait for the deployment to complete before continuing.

1. At the end of the deployment process, the app endpoint is shown. Copy that endpoint into a browser to open the chat app. Select one of the questions on the cards then wait for the answer.

    Make note of the endpoint URL. You'll need it again later in the article.

## Deploy chat app to Azure with private access

Change the solution configuration for private access and change the chat app to use it.

1. Run the following command to turn off public access.

    ```console
    azd env set AZURE_PUBLIC_NETWORK_ACCESS Disabled
    ```

1. Run the following command to configure the VM user name using the correct [username requirements](/azure/virtual-machines/windows/faq#what-are-the-username-requirements-when-creating-a-vm-). Replace `<MY-USER-NAME>` with the user name.

    ```console
    azd env set AZURE_VM_USERNAME <MY-USER-NAME>
    ```

1. Run the following command to configure the VM password using the correct [password requirements](/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm-). Replace `<MY-PASSWORD>` with the password.

    ```console
    azd env set AZURE_VM_PASSWORD <MY-PASSWORD>
    ```

1. Run the following command to redeploy the solution to secure the chat app to the VM.

    ```console
    azd provision
    ```

## Use private chat app

1. Open the [Azure portal](http://portal.azure.com) and search for your resource group. 
1. Select your resource group to see the resources within it. 
1. Find the VM resource and select it. 
1. Select **Connect -> Bastion**. 
1. Select **VM Password** for Authentication Type.
1. Enter your user name and password and select **Connect**.
1. When the RDP session to the Windows server opens, find the **Edge** browser.
1. Paste the chat endpoint into the browser to use the chat app.
1. When the chat app displays, use one of the cards to get an answer. 

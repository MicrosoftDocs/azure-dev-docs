---
title: Get started with Python on Azure
description: How to set up a local Python dev environment for working with Azure.
ms.date: 07/25/2023
ms.topic: conceptual
ms.custom: devx-track-python, vscode-azure-extension-update-completed, devx-track-azurecli
---

# Get started with Python on Azure

If you are new to developing applications for the cloud, this short series of articles with videos will help you get up to speed quickly.

* Part 1: [Azure for developers overview](/azure/developer/intro/azure-developer-overview)
* Part 2: [Key Azure services for developers](/azure/developer/intro/azure-developer-key-services)
* Part 3: [Hosting applications on Azure](/azure/developer/intro/hosting-apps-on-azure)
* Part 4: [Connect your app to Azure services](/azure/developer/intro/connect-to-azure-services)
* Part 5: [How do I create and manage resources in Azure?](/azure/developer/intro/azure-developer-create-resources)
* Part 6: [Key concepts for building Azure apps](/azure/developer/intro/azure-developer-key-concepts)
* Part 7: [How am I billed?](/azure/developer/intro/azure-developer-billing)
* Part 8: [Versioning policy for Azure services, SDKs, and CLI tools](/azure/developer/intro/azure-service-sdk-tool-versioning)

Once you understand the basics of developing applications for the cloud, you will 
want to set up your development environment and follow a Quickstart or Tutorial 
to build your first app.

## Configure your local Python environment for Azure development

To develop Python applications using Azure, you first want to configure your local development environment.  Configuration includes creating an Azure account, installing tools for Azure development, and connecting those tools to your Azure account.

Developing on Azure requires [Python](https://www.python.org/downloads/) 3.7 or higher. To verify the version of Python on your workstation, in a console window type the command `python3 --version` for macOS/Linux or `py --version` for Windows.

## Create an Azure Account

To develop Python applications with Azure, you need an Azure account.  Your Azure account is the credentials you use to sign-in to Azure with and what you use to create Azure resources.

If you're using Azure at work, talk to your company's cloud administrator to get your credentials used to sign-in to Azure.

Otherwise, you can create an [Azure account for free](https://azure.microsoft.com/free/python/) and receive 12 months of popular services for free and a $200 credit to explore Azure for 30 days.

> [!div class="nextstepaction"]
> [Create an Azure account for free](https://azure.microsoft.com/free/python/)

## Use the Azure portal

Once you have your credentials, you can sign in to the [Azure portal](https://portal.azure.com) at https://portal.azure.com.  The Azure portal is typically easiest way to get started with Azure, especially if you're new to Azure and cloud development. In the Azure portal, you can do various management tasks such as creating and deleting resources.

If you're already experienced with Azure and cloud development, you'll probably start off using tools as well such as Visual Studio Code and Azure CLI. Articles in the Python developer center show how to work with the Azure portal, Visual Studio Code, and Azure CLI.

> [!div class="nextstepaction"]
> [Sign in to the Azure portal](https://portal.azure.com)

## Use Visual Studio Code

You can use any editor or IDE to write Python code when developing for Azure. However, you may want to consider using [Visual Studio Code](https://code.visualstudio.com/) for Azure and Python development. Visual Studio Code provides many extensions and customizations for Azure and Python, which make your development cycle and the deployment from a local environment to Azure easier.

For Python development using Visual Studio Code, install:

* [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python). This extension includes IntelliSense (Pylance), Linting, Debugging (multi-threaded, remote), Jupyter Notebooks, code formatting, refactoring, unit tests, and more.

* [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack). The extension pack contains extensions for working with Azure App Service, Azure Functions, Azure Storage, Azure Cosmos DB, and Azure Virtual Machines in one convenient package. The Azure extensions make it easy to discover and interact with the Azure.

To install extensions from Visual Studio Code:

1. Press <kbd>Ctrl+Shift+X</kbd> to open the **Extensions** window.
1. Search for the *Azure Tools* extension.
1. Select the **Install** button.

:::image type="content" source="./media/configure-local-development-environment/vs-code-azure-tools-install-small.png" alt-text="Screenshot of the Visual Studio Code showing extensions panel searching for the Azure Tools extension pack." lightbox="./media/configure-local-development-environment/vs-code-azure-tools-install.png":::

To learn more about installing extensions in Visual Studio Code, refer to the [Extension Marketplace](https://code.visualstudio.com/docs/editor/extension-gallery) document on the Visual Studio Code website.

After installing the Azure Tools extension, sign in with your Azure account. On the left-hand panel, you'll see an Azure icon. Select this icon, and a control panel for Azure services will appear. Choose **Sign in to Azure...** to complete the authentication process.

:::image type="content" source="./media/configure-local-development-environment/vs-code-azure-login-small.png" alt-text="Screenshot of the Visual Studio Code showing how to sign-in the Azure tools to Azure." lightbox="./media/configure-local-development-environment/vs-code-azure-login.png":::

[!INCLUDE [proxy-note](./includes/proxy-note.md)]

## Use the Azure CLI

In addition to the Azure portal and Visual Studio Code, Azure also offers the [Azure CLI](/cli/azure/) command-line tool to create and manage Azure resources. The Azure CLI offers the benefits of efficiency, repeatability, and the ability to script recurring tasks. In practice, most developers use both the Azure portal and the Azure CLI.

### [Install on macOS](#tab/macOS)

The Azure CLI is installed through homebrew on macOS. If you don't have homebrew available on your system, [install homebrew](https://docs.brew.sh/Installation.html) before continuing.

```bash
brew update && brew install azure-cli
```

This command will first update your brew repository information and then install the Azure CLI.

### [Install on Linux](#tab/linux)

[!INCLUDE [Azure CLI Install Linux](includes/azure-cli-install-linux.md)]

### [Install on Windows](#tab/windows)

Download and install the latest release of the Azure CLI for Windows.

> [!div class="nextstepaction"]
> [Download the Azure CLI for Windows](https://aka.ms/installazurecliwindows)

---

After installing, sign-in to your Azure account from the Azure CLI by typing the command `az login` in a terminal window on your workstation.

```azurecli
az login
```

The Azure CLI will open your default browser to complete the sign-in process.

## Configure Python virtual environment

When creating Python applications for Azure, it's recommended to create a [virtual environment](https://docs.python.org/3/tutorial/venv.html) for each application. A virtual environment is a self-contained directory for a particular version of Python plus the other packages needed for that application.

To create a virtual environment, follow these steps.

1. Open a terminal or command prompt.

1. Create a folder for your project.

1. Create the virtual environment:

    ### [Windows](#tab/cmd)

    ```bash
    # py -3 uses the global python interpreter. You can also use python3 -m venv .venv.
    py -3 -m venv .venv
    ```

    ### [macOS/Linux](#tab/bash)

    ```bash
    python3 -m venv .venv
    ```

    ---

    This command runs the Python `venv` module and creates a virtual environment in a folder ".venv".  Typically, [*.gitignore*](http://git-scm.com/docs/gitignore) files have a ".venv" entry so that the virtual environment doesn't get checked in with your code checkins.

1. Activate the virtual environment:

    ### [Windows](#tab/cmd)

    ```bash
    .venv\Scripts\activate
    ```

    ### [macOS/Linux](#tab/bash)

    ```bash
    source .venv/bin/activate
    ```

    ---

    > [!NOTE]
    > If you're using Windows Command shell, activate the virtual environment with `.venv\Scripts\activate`. If you're using [Git Bash in Visual Studio Code](https://code.visualstudio.com/docs/sourcecontrol/intro-to-git#_git-bash-on-windows) on Windows, use the command `source .venv/Scripts/activate` instead.

Once you activate that environment (which Visual Studio Code does automatically), running `pip install` installs a library into that environment only. Python code running in a virtual environment uses the specific package versions installed into that virtual environment. Using different virtual environments allows different applications to use different versions of a package, which is sometimes required. To learn more about virtual environments, see [Virtual Environments and Packages](https://docs.python.org/3/tutorial/venv.html) in the Python docs.

For example, if your [requirements](https://pip.pypa.io/en/stable/reference/requirements-file-format/) are in a *requirements.txt* file, then inside the activated virtual environment, you can install them with:

```bash
pip install -r requirements.txt
```

## Next steps

* [Develop a Python web app](/azure/app-service/quickstart-python?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)
* [Develop a container app](./containers-in-azure-overview-python.md)
* [Learn to use the Azure libraries for Python](./sdk/azure-sdk-overview.md)
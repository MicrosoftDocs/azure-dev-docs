---
title: Get started using Azure Developer CLI
description: Learn how to get started with Azure Developer CLI with a template for Node.js.
keywords: azure developer cli, azd
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/13/2024
ms.topic: quickstart
ms.service: azure-dev-cli
ms.custom: devx-track-azdevcli, build-2023, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_group_filename: developer/azure-developer-cli/azd-zone-pivot-groups.json
zone_pivot_groups: azd-languages-set
---

# Quickstart: Deploy an Azure Developer CLI template

In this quickstart, you'll learn how to provision and deploy app resources to Azure using an [Azure Developer CLI (`azd`) template](/azure/developer/azure-developer-cli/azd-templates) and only a few `azd` commands.  `azd` templates are standard code repositories that include your application source code, as well as `azd` configuration and infrastructure files to provision Azure resources. To learn more about `azd` templates and how they can accelerate your Azure provisioning and deployment process see [What are Azure Developer CLI templates?](/azure/developer/azure-developer-cli/azd-templates).

## Select and deploy the template

For the steps ahead, you'll use the following template to provision and deploy an app on Azure:

::: zone pivot="programming-language-nodejs"
[React Web App with Node.js API and MongoDB on Azure](https://github.com/azure-samples/todo-nodejs-mongo)
::: zone-end

::: zone pivot="programming-language-python"
[React Web App with Python API and MongoDB on Azure](https://github.com/azure-samples/todo-python-mongo)
::: zone-end

::: zone pivot="programming-language-csharp"
[React Web App with C# API and MongoDB on Azure](https://github.com/Azure-Samples/todo-csharp-cosmos-sql)
::: zone-end

::: zone pivot="programming-language-java"
[Containerized React Web App with Java API and MongoDB on Azure](https://github.com/azure-samples/todo-java-mongo-aca)
::: zone-end

You can also select a template that matches your preferences from the [Awesome AZD](https://azure.github.io/awesome-azd/) template gallery site. Regardless of which template you use, you'll end up with the template code in your development environment and be able to run commands to build, redeploy, and monitor the app in Azure.

Select your preferred environment to continue:

## [Local install](#tab/localinstall)

A local development environment is a great choice for traditional development workflows. You'll clone the template repository down onto your device and run commands against a local installation of `azd`.

### Prerequisites

::: zone pivot="programming-language-nodejs"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-python"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Python 3.8](https://www.python.org/downloads/)
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-python-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-csharp"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [.NET 6.0](https://dotnet.microsoft.com/download/dotnet/6.0)
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-csharp-cosmos-sql/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-java"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [OpenJDK 17](/java/openjdk/download#openjdk-17)
- [Docker](https://docs.docker.com/get-docker/).
- [Review the architecture diagram and the Azure resources you'll deploy in the Java template README](https://github.com/Azure-Samples/todo-java-mongo-aca/blob/main/README.md).

::: zone-end

### Initialize the project

1. In **File Explorer** or a terminal, create a new empty directory, and change into it.

1. Run the `azd init` command and specify the template you want to use as a parameter:

    ::: zone pivot="programming-language-nodejs"
  
    ```azdeveloper
    azd init --template todo-nodejs-mongo
    ```
  
    ::: zone-end
  
    ::: zone pivot="programming-language-python"
  
    ```azdeveloper
    azd init --template todo-python-mongo
    ```
  
    ::: zone-end
  
    ::: zone pivot="programming-language-csharp"
  
    ```azdeveloper
    azd init --template todo-csharp-cosmos-sql
    ```
  
    ::: zone-end
  
    ::: zone pivot="programming-language-java"
  
    ```azdeveloper
    azd init --template todo-java-mongo-aca
    ```
  
    ::: zone-end
  
    Enter an environment name when prompted, such as `azdquickstart`, which sets a naming prefix for the resource group that will be created to hold the Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name)
  
    After you specify the environment, `azd` clones the template project to your machine and initializes the project.

### Provision and deploy the app resources

1. Run the `azd auth login` command and `azd` launches a browser for you to complete the sign-in process.

    ```azdeveloper
    azd auth login
    ```

1. Run the `azd up` command:

    ```azdeveloper
    azd up
    ```

1. Once you are signed-in to Azure, you will be prompted for the following information:

    | Parameter | Description |
    | --------- | ----------- |
    | `Azure Location`   | The Azure location where your resources will be deployed. |
    | `Azure Subscription` | The Azure Subscription where your resources will be deployed. |
  
    Select your desired values and press enter. The `azd up` command handles the following tasks for you using the template configuration and infrastructure files:
  
    - Creates and configures all necessary Azure resources (`azd provision`), including:
    - Access policies and roles for your account
    - Service-to-service communication with Managed Identities
    - Packages and deploys the code (`azd deploy`)

    When the `azd up` command completes successfully, the CLI displays two links to view resources created:

    - ToDo API app
    - ToDo web app frontend

    :::image type="content" source="media/get-started/urls.png" alt-text="Screenshot of command output listing endpoint URLs.":::

    > [!NOTE]
    > You can call `azd up` as many times as you like to both provision and deploy updates to your application.
    > The deployment may fail due to a resource being undeployable in the selected region. Because this is a quick start, it is safe to delete the `.azure` directory and try `azd up` again. When asked, select a different region. In a more advanced scenario you could selectively edit files within the `.azure` directory to change the region.

## [Visual Studio Code](#tab/visual-studio-code)

The Azure Developer CLI provides a Visual Studio Code extension to streamline working with `azd` features. For example, you can use the command palette interface to run `azd` commands. You'll  need to install the Azure Developer CLI extension for Visual Studio Code to complete the steps ahead.

### Install the Azure Developer CLI extension

1. Open Visual Studio Code.

1. From the **View** menu, select **Extensions**.

1. In the search field, enter `Azure Developer CLI`.

    :::image type="content" source="media/get-started/install-extension.png" alt-text="Screenshot of the extension installation.":::

1. Select **Install** and wait for the installation process to complete.

### Initialize a new app

1. Open an empty directory in Visual Studio Code.

2. From the **View** menu, select **Command Palette...**.

3. Search for the `Azure Developer CLI (azd): Initialize app (init)` command and press enter. The `azd up` command instructs `azd` to provision and deploy the app resources.

    :::image type="content" source="media/debug/cmd-init.png" alt-text="Screenshot of the option to initialize a new app.":::

4. Choose the **Select a template** workflow.

   :::image type="content" source="media/debug/cmd-select-workflow.png" alt-text="Screenshot of the option to select a workflow.":::

::: zone pivot="programming-language-nodejs"
5. Search for the [React Web App with Node.js API and MongoDB on Azure](https://github.com/azure-samples/todo-nodejs-mongo) template and press enter to select it.

    Visual Studio Code clones down the `azd` template. The template includes infrastructure as code files in the `infra` folder and a sample app in the `src` folder. The infrastructure as code files provision the required resources on Azure required by the app when it is deployed.
::: zone-end

::: zone pivot="programming-language-python"
5. Search for the [React Web App with Python API and MongoDB on Azure](https://github.com/azure-samples/todo-python-mongo) template and press enter to select it.

    Visual Studio Code clones down the `azd` template. The template includes infrastructure as code files in the `infra` folder and a sample app in the `src` folder. The infrastructure as code files provision the required resources on Azure required by the app when it is deployed.
::: zone-end

::: zone pivot="programming-language-csharp"
5. Search for the [React Web App with C# API and MongoDB on Azure](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) template and press enter to select it.

    Visual Studio Code clones down the `azd` template. The template includes infrastructure as code files in the `infra` folder and a sample app in the `src` folder. The infrastructure as code files provision the required resources on Azure required by the app when it is deployed.
::: zone-end

::: zone pivot="programming-language-java"
5. Search for the [Containerized React Web App with Java API and MongoDB on Azure](https://github.com/azure-samples/todo-java-mongo-aca) template and press enter to select it.awesome-azd.

    Visual Studio Code clones down the `azd` template. The template includes infrastructure as code files in the `infra` folder and a sample app in the `src` folder. The infrastructure as code files provision the required resources on Azure required by the app when it is deployed.
::: zone-end

6. After the template is cloned, Visual Studio Code opens a terminal to prompt you for an environment name. Enter a short name of your choosing such as *azdvscode* and press enter.

    ```output
    Enter a new environment name: [? for help] azdvscode
    ```

    The environment name influences the naming of resources provisioned in Azure and creates a folder in the `.azure` template directory to store certain environment settings.

### Provision and deploy the app resources

1. Open the Command Palette and search for the `Azure Developer CLI (azd): Package, Provision and Deploy(up)` command and press enter. The `azd up` command instructs `azd` to provision and deploy the app resources.

    Visual Studio Code opens a terminal window to display the progress of the provisioning and deployment process. `azd` uses the subscription and location settings you selected during the `init` process when deploying resources.

    > [!NOTE]
    > The provisioning and deployment process can take several minutes.

1. When the deploy process complete, select the link in the output window provided by `azd` to launch your site in the browser.

## [Codespaces](#tab/codespaces)

Codespaces are a great option for developers who prefer to work in containerized cloud environments and avoid installing tools or dependencies locally.

### Set up your Codespace

::: zone pivot="programming-language-nodejs"
1. In your browser, navigate to the [React Web App with Node.js API and MongoDB on Azure](https://github.com/azure-samples/todo-nodejs-mongo) template (or select one from [Awesome AZD](https://azure.github.io/awesome-azd/))
::: zone-end

::: zone pivot="programming-language-python"
1. In your browser, navigate to the [React Web App with Python API and MongoDB on Azure](https://github.com/azure-samples/todo-python-mongo) template (or select one from [Awesome AZD](https://azure.github.io/awesome-azd/))
::: zone-end

::: zone pivot="programming-language-csharp"
1. In your browser, navigate to the [React Web App with C# API and MongoDB on Azure](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) template (or select one from [Awesome AZD](https://azure.github.io/awesome-azd/))
::: zone-end

::: zone pivot="programming-language-java"
1. In your browser, navigate to the [Containerized React Web App with Java API and MongoDB on Azure](https://github.com/azure-samples/todo-java-mongo-aca) template (or select one from [Awesome AZD](https://azure.github.io/awesome-azd/))
::: zone-end

2. Above the file list, click **Use this template** > **Open in a Codespace**.

  :::image type="content" source="media/get-started/codespaces-template-dropdown.png" alt-text="Screenshot demonstrating selecting the option to open a template in a Codespace via the GitHub repo UI.":::

  With Codespaces, all pre-requisites are installed for you, including the [`azd` Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev).

  :::image type="content" source="media/get-started/codespaces-initial-set-up.png" alt-text="Screenshot showing what your new Codespace will look like once initiated.":::

### Run the template

1. Once your Codespace is created, right-click **azure.yaml** in the root directory. From the options, select **up (provision resources, and deploy code to Azure)**.

    :::image type="content" source="media/get-started/codespaces-up-command.png" alt-text="Screenshot showing the azure.yaml menu option for running azd up.":::

1. When you run the `azd up` command, you'll be prompted to provide the following information and to sign in using a web browser and an authentication code:

    :::image type="content" source="media/get-started/codespaces-parameters.png" alt-text="Screenshot showing the parameter prompts and the prompt to sign in using your browser.":::

    | Parameter | Description |
    | --------- | ----------- |
    | `Environment Name` | Prefix for the resource group that will be created to hold all Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name) You can always create a new environment with `azd env new`. |
    | `Azure Location`   | The Azure location where your resources will be deployed. |
    | `Azure Subscription` | The Azure Subscription where your resources will be deployed. |

    This process may take some time to complete, as the `azd up` command handles the following tasks:

    - Creates and configures all necessary Azure resources (`azd provision`).
    - Configures access policies and roles for your account.
    - Implements service-to-service communication with Managed Identities.
    - Packages and deploys the code (`azd deploy`).

    Once you've provided the necessary parameters and the `azd up` command completes, the CodeSpaces terminal displays two Azure portal links to view resources created:

    - ToDo API app
    - ToDo web app frontend

    :::image type="content" source="media/get-started/urls.png" alt-text="Screenshot of command output listing endpoint URLs.":::

### What happened?

Upon successful completion of the `azd up` command:

- The [Azure resources referenced in the template's `README.md` file](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md) have been provisioned to the Azure subscription you specified after you ran `azd up`. You can now view those Azure resources via the [Azure portal](https://portal.azure.com).
- The app has been built and deployed to Azure. Using the web app URL output from the `azd up` command, you can browse to the fully functional app.

> [!NOTE]
> - You can call `azd up` as many times as you like to both provision and deploy your application.
> - Run and debug that requires launching a web browser is currently not support because of [known limitation with GitHub Codespaces](https://code.visualstudio.com/docs/remote/codespaces#_known-limitations-and-adaptations). For better experience, we recommend using Codespaces in Desktop.

## [DevContainer](#tab/devcontainer)

A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to work with the `azd` template on your local machine. They're a great choice for developers who prefer containerized environments that still run on a local device instead of a cloud service like GitHub Codespaces.

### Prerequisites

::: zone pivot="programming-language-nodejs"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-python"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-csharp"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-java"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Review the architecture diagram and the Azure resources you'll deploy in the Java template README](https://github.com/Azure-Samples/todo-java-mongo-aca/blob/main/README.md).

::: zone-end

### Initialize the project

1. Open a terminal, create a new empty directory, and change into it.

1. Run the following command to initialize the project:
  
    ::: zone pivot="programming-language-nodejs"
  
    ```azdeveloper
    azd init --template todo-nodejs-mongo
    ```
  
    ::: zone-end

    ::: zone pivot="programming-language-python"
  
    ```azdeveloper
    azd init --template todo-python-mongo
    ```
  
    ::: zone-end

    ::: zone pivot="programming-language-csharp"
  
    ```azdeveloper
    azd init --template todo-csharp-cosmos-sql
    ```
  
    ::: zone-end

    ::: zone pivot="programming-language-java"
  
    ```azdeveloper
    azd init --template todo-java-mongo-aca
    ```
  
    ::: zone-end

    When you run the `azd init` command, you'll be prompted to provide the following information:

    | Parameter | Description |
    | --------- | ----------- |
    | `Environment Name` | Prefix for the resource group that will be created to hold all Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name) You can always create a new environment with `azd env new`. |

### Open the DevContainer

1. Open the project in VS Code.
1. Press F1 and choose: `Remote-Containers: Rebuild and Reopen in Container`

### Run `up` command

Run the following command:

```azdeveloper
azd up
```

When you run the `azd up` command, you'll be prompted to provide the following information:

| Parameter | Description |
| --------- | ----------- |
| `Azure Location`   | The Azure location where your resources will be deployed. |
| `Azure Subscription` | The Azure Subscription where your resources will be deployed. |

The `azd up` command may take some time to run as it completes the following steps:

- Creates and configures all necessary Azure resources (`azd provision`), including:
  - Access policies and roles for your account
  - Service-to-service communication with Managed Identities
- Packages and deploys the code (`azd deploy`)

Once you've provided the necessary parameters and the `azd up` command completes, the CLI displays two Azure portal links to view resources created:

- ToDo API app
- ToDo web app frontend

:::image type="content" source="media/get-started/urls.png" alt-text="Screenshot of command output listing endpoint URLs.":::

> [!NOTE]
> You can run `azd up` as many times as you like to both provision and deploy your application to the same region and with the same configuration values you provided on the first run.

---

## Clean up resources

When you no longer need the resources created in this article, run the following command to power down the app:

```azdeveloper
azd down
```

If you want to redeploy to a different region, delete the `.azure` directory before running `azd up` again.  In a more advanced scenario you could selectively edit files within the `.azure` directory to change the region.

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

- [Learn how to run and debug apps with `azd`.](debug.md)
- [Troubleshoot common problems when using Azure Developer CLI (azd).](troubleshoot.md)
- [Read the Azure Developer CLI frequently asked questions (FAQ).](faq.yml)

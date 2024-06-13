---
title: Get started using Azure Developer CLI
description: Learn how to get started with Azure Developer CLI with a template for Node.js.
keywords: azure developer cli, azd
author: alexwolfmsft
ms.author: alexwolf
ms.date: 10/21/2022
ms.topic: quickstart
ms.service: azure-dev-cli
ms.custom: devx-track-azdevcli, build-2023, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_group_filename: developer/azure-developer-cli/azd-zone-pivot-groups.json
zone_pivot_groups: azd-languages-set
---

# Quickstart: Deploy an Azure Developer CLI template

In this quickstart, you'll learn how to provision and deploy app resources to Azure using an [Azure Developer CLI (`azd`) templates](/azure/developer/azure-developer-cli/azd-templates) using only a few `azd` commands.  `azd` templates are standard code repositories that include your application source code, as well as `azd` configuration and infrastructure files to provision Azure resources. Visit the [What are Azure Developer CLI templates?](/azure/developer/azure-developer-cli/azd-templates) page to learn more about `azd` templates and how they can accelerate your Azure provisioning and deployment process.

## Select and deploy the template

For the steps ahead, use the following template to provision and deploy an app on Azure:

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
[React Web App with Java API and MongoDB on Azure](https://github.com/azure-samples/todo-java-mongo)
::: zone-end

You can also select a template that matches your preferences from the [Awesome AZD](https://azure.github.io/awesome-azd/) template gallery site. Regardless of which template you use, you'll end up with the available code in your development environment and be able to run commands to build, redeploy, and monitor the app in Azure.

Select your preferred environment to continue:

## [Local install](#tab/localinstall)

A local development environment is a great choice for traditional development workflows. You'll clone the template repository down onto your device and run commands against a local installation of `azd`.

### Prerequisites

::: zone pivot="programming-language-nodejs"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-python"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python 3.8](https://www.python.org/downloads/)
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-csharp"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [.NET 6.0](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-java"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [OpenJDK 17](https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-17)
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

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
  azd init --template todo-java-mongo
  ```

  ::: zone-end

1. Enter an environment name when prompted, such as `azdquickstart`, which sets a naming prefix for the resource group that will be created to hold the Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name)

    After you specify the environment, `azd` clones the template project to your machine and initializes the project.

### Provision and deploy the app resources

1. Run the `azd up` command:

    ```azdeveloper
    azd up
    ```

1. If you are not already signed-in to Azure, the browser will launch and ask you to sign-in.

1. Once you are signed-in to Azure, you will be prompted for the following information:

| Parameter | Description |
| --------- | ----------- |
| `Azure Location`   | The Azure location where your resources will be deployed. |
| `Azure Subscription` | The Azure Subscription where your resources will be deployed. |

After you provide these values, the `azd up` command:

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
1. In your browser, navigate to the [React Web App with Java API and MongoDB on Azure](https://github.com/azure-samples/todo-java-mongo) template (or select one from [Awesome AZD](https://azure.github.io/awesome-azd/))
::: zone-end

1. Above the file list, click **Use this template** > **Open in a Codespace**.

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
  
  This process may take some time to complete, as the `azd up` command:

  - Creates and configures all necessary Azure resources (`azd provision`), including:
  - Access policies and roles for your account
  - Service-to-service communication with Managed Identities
  - Packages and deploys the code (`azd deploy`)

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
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-python"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python 3.8](https://www.python.org/downloads/)
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-csharp"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

::: zone-end

::: zone pivot="programming-language-java"

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

::: zone-end

### Initialize project

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
  azd init --template todo-java-mongo
  ```

  ::: zone-end

### Provide parameters

When you run the `azd init` command, you'll be prompted to provide the following information:

| Parameter | Description |
| --------- | ----------- |
| `Environment Name` | Prefix for the resource group that will be created to hold all Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name) You can always create a new environment with `azd env new`. |

### Open DevContainer

Open the project in VS Code, hit F1 and choose: `Remote-Containers: Rebuild and Reopen in Container`

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
> You can call `azd up` as many times as you like to both provision and deploy your application.

---

## Clean up resources

When you no longer need the resources created in this article, run the following command to power down the app:

```azdeveloper
azd down
```

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

- [Learn how to run and debug apps with `azd`.](debug.md)
- [Troubleshoot common problems when using Azure Developer CLI (azd).](troubleshoot.md)
- [Read the Azure Developer CLI frequently asked questions (FAQ).](faq.yml)

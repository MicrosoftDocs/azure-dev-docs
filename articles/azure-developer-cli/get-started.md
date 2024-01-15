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

# Get started using Azure Developer CLI

::: zone pivot="programming-language-nodejs"

## Run a Node.js template

Let's put the basic Azure Developer CLI (`azd`) commands to the test and run one of our Node.js template applications. We'll use the [React Web App with Node.js API and MongoDB on Azure](https://github.com/azure-samples/todo-nodejs-mongo) for this guide.

Upon completion, you'll get the code in your development environment and be able to run commands to build, deploy, and monitor the app in Azure.

Select your preferred environment to continue:

## [Local install](#tab/localinstall)

### Prerequisites

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

### Initialize the project

1. In **File Explorer** or a terminal, create a new empty directory, and change into it.

1. Run the `azd init` command and specify the template you want to use as a parameter:

    ```azdeveloper
    azd init --template todo-nodejs-mongo
    ```

  Note: this command will initialize the application, including cloning the GitHub repo. 

1. You will be prompted for an environment name, which sets the prefix for the resource group that will be created to hold the Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name)

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

### Set up your Codespace

1. In your browser, navigate to the [Node.js/Mongo `azd` template](https://github.com/azure-samples/todo-nodejs-mongo) (or [select one from our templates library](./azd-templates.md)).
2. Above the file list, click **Use this template** > **Open in a Codespace**.

   :::image type="content" source="media/get-started/codespaces-template-dropdown.png" alt-text="Screenshot demonstrating selecting the option to open a template in a Codespace via the GitHub repo UI.":::

With Codespaces, all pre-requisites are installed for you, including the [`azd` Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev). 

:::image type="content" source="media/get-started/codespaces-initial-set-up.png" alt-text="Screenshot showing what your new Codespace will look like once initiated.":::

### Run `up` command

Once your Codespace is created, right-click **azure.yaml** in the root directory. From the options, select **up (provision resources, and deploy code to Azure)**.

:::image type="content" source="media/get-started/codespaces-up-command.png" alt-text="Screenshot showing the azure.yaml menu option for running azd up.":::

### Provide parameters

When you run the `azd up` command, you'll be prompted to provide the following information and to sign in using a web browser and an authentication code:

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

A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine.

### Pre-requisites

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

### Initialize project

1. Open a terminal, create a new empty directory, and change into it.

1. Run the following command to initialize the project:

   ```azdeveloper
   azd init --template todo-nodejs-mongo
   ```

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

::: zone-end

::: zone pivot="programming-language-python"

## Run a Python template

Let's put the basic Azure Developer CLI (`azd`) commands to the test and run one of our Python template applications. We'll use the [React Web App with Python API and MongoDB on Azure](https://github.com/azure-samples/todo-python-mongo) for this guide.

Upon completion, you'll get the code in your development environment and be able to run commands to build, deploy, and monitor the app in Azure.

Select your preferred environment to continue:

## [Local install](#tab/localinstall)

### Pre-requisites

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Review the architecture diagram and the Azure resources you'll deploy in the Python template README](https://github.com/Azure-Samples/todo-python-mongo/blob/main/README.md).

### Create and activate a Python virtual environment

In this guide, the app uses Python Virtual Environments to isolate Python package installations. Start by [creating and activating a virtual environment](https://docs.python.org/3/library/venv.html).

### Initialize the project

1. In **File Explorer** or a terminal, create a new empty directory, and change into it.

1. Run the `azd init` command and specify the template you want to use as a parameter:

    ```azdeveloper
    azd init --template todo-python-mongo
    ```
  
  Note: this command will initialize the application, including cloning the GitHub repo. 


1. You will be prompted for an environment name, which sets the prefix for the resource group that will be created to hold the Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name)

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

### Set up your Codespace

1. In your browser, navigate to the [Python/Mongo `azd` template](https://github.com/Azure-Samples/todo-python-mongo) (or [select one from our templates library](./azd-templates.md)).
2. Above the file list, click **Use this template** > **Open in a Codespace**.

   :::image type="content" source="media/get-started/codespaces-template-dropdown.png" alt-text="Screenshot demonstrating selecting the option to open a template in a Codespace via the GitHub repo UI.":::

With Codespaces, all pre-requisites are installed for you, including the [`azd` Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev). 

:::image type="content" source="media/get-started/codespaces-initial-set-up.png" alt-text="Screenshot showing what your new Codespace will look like once initiated.":::

### Run `up` command

Once your Codespace is created, right-click **azure.yaml** in the root directory. From the options, select **up (provision resources, and deploy code to Azure)**.

:::image type="content" source="media/get-started/codespaces-up-command.png" alt-text="Screenshot showing the azure.yaml menu option for running azd up.":::

### Provide parameters

When you run the `azd up` command, you'll be prompted to provide the following information and to sign in using a web browser and an authentication code:

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

- The [Azure resources referenced in the template's `README.md` file](https://github.com/Azure-Samples/todo-python-mongo/blob/main/README.md) have been provisioned to the Azure subscription you specified after you ran `azd up`. You can now view those Azure resources via the [Azure portal](https://portal.azure.com).
- The app has been built and deployed to Azure. Using the web app URL output from the `azd up` command, you can browse to the fully functional app.

> [!NOTE]
> - You can call `azd up` as many times as you like to both provision and deploy your application.
> - Run and debug that requires launching a web browser is currently not supported because of [known limitation with GitHub Codespaces](https://code.visualstudio.com/docs/remote/codespaces#_known-limitations-and-adaptations). For a better experience, we recommend using Codespaces in Desktop.

## [DevContainer](#tab/devcontainer)

A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine.

### Pre-requisites

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Review the architecture diagram and the Azure resources you'll deploy in the Python template README](https://github.com/Azure-Samples/todo-python-mongo/blob/main/README.md).

### Initialize project

1. Open a terminal, create a new empty directory, and change into it.

1. Run the following command to initialize the project:

   ```azdeveloper
   azd init --template todo-python-mongo
   ```

### Provide parameters

When you run the `azd init` command, you'll be prompted to provide the following information:

| Parameter | Description |
| --------- | ----------- |
| `Environment Name` | Prefix for the resource group that will be created to hold all Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name) You can always create a new environment with `azd env new`. |

### Open DevContainer

Open the project in VS Code, hit F1 and choose: `Dev Containers: Rebuild and Reopen in Container`

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

::: zone-end

::: zone pivot="programming-language-csharp"

## Run a C# template

Let's put the basic Azure Developer CLI (`azd`) commands to the test and run one of our C# template applications. We'll use the [React Web App with C# API and MongoDB on Azure](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) for this guide.

Upon completion, you'll get the code in your development environment and be able to run commands to build, deploy, and monitor the app in Azure.

Select your preferred environment to continue:

## [Local install](#tab/localinstall)

### Pre-requisites

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [.NET SDK 6.0](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
- [Review the architecture diagram and the Azure resources you'll deploy in the C# template README](https://github.com/Azure-Samples/todo-csharp-cosmos-sql/blob/main/README.md).

### Initialize the project

1. In **File Explorer** or a terminal, create a new empty directory, and change into it.

1. Run the `azd init` command and specify the template you want to use as a parameter:

    ```azdeveloper
    azd init --template todo-csharp-cosmos-sql
    ```

  Note: this command will initialize the application, including cloning the GitHub repo. 

1. You will be prompted for an environment name, which sets the prefix for the resource group that will be created to hold the Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name)

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

### Set up your Codespace

1. In your browser, navigate to the [C#/Cosmos `azd` template](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) (or [select one from our templates library](./azd-templates.md)).
2. Above the file list, click **Use this template** > **Open in a Codespace**.

   :::image type="content" source="media/get-started/codespaces-template-dropdown.png" alt-text="Screenshot demonstrating selecting the option to open a template in a Codespace via the GitHub repo UI.":::

With Codespaces, all pre-requisites are installed for you, including the [`azd` Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev). 

:::image type="content" source="media/get-started/codespaces-initial-set-up.png" alt-text="Screenshot showing what your new Codespace will look like once initiated.":::

### Run `up` command

Once your Codespace is created, right-click **azure.yaml** in the root directory. From the options, select **up (provision resources, and deploy code to Azure)**.

:::image type="content" source="media/get-started/codespaces-up-command.png" alt-text="Screenshot showing the azure.yaml menu option for running azd up.":::

### Provide parameters

When you run the `azd up` command, you'll be prompted to provide the following information and to sign in using a web browser and an authentication code:

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

- The [Azure resources referenced in the template's `README.md` file](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) have been provisioned to the Azure subscription you specified after you ran `azd up`. You can now view those Azure resources via the [Azure portal](https://portal.azure.com).
- The app has been built and deployed to Azure. Using the web app URL output from the `azd up` command, you can browse to the fully functional app.

> [!NOTE]
> - You can call `azd up` as many times as you like to both provision and deploy your application.
> - Run and debug that requires launching a web browser is currently not supported because of [known limitation with GitHub Codespaces](https://code.visualstudio.com/docs/remote/codespaces#_known-limitations-and-adaptations). For a better experience, we recommend using Codespaces in Desktop.

## [DevContainer](#tab/devcontainer)

A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine.

### Pre-requisites

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Review the architecture diagram and the Azure resources you'll deploy in the C# template README](https://github.com/Azure-Samples/todo-csharp-cosmos-sql/blob/main/README.md).

### Initialize project

1. Open a terminal, create a new empty directory, and change into it.

1. Run the following command to initialize the project:

   ```azdeveloper
   azd init --template todo-csharp-cosmos-sql
   ```

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

::: zone-end

::: zone pivot="programming-language-java"

## Run a Java template

Let's put the basic Azure Developer CLI (`azd`) commands to the test and run one of our Java template applications. We'll use the [React Web App with Java API and MongoDB on Azure](https://github.com/azure-samples/todo-java-mongo) for this guide.

Upon completion, you'll get the code in your development environment and be able to run commands to build, deploy, and monitor the app in Azure.

Select your preferred environment to continue:

## [Local install](#tab/localinstall)

### Pre-requisites

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [OpenJDK 17](/java/openjdk/download#openjdk-17)
- [Review the architecture diagram and the Azure resources you'll deploy in the Java template README](https://github.com/Azure-Samples/todo-java-mongo/blob/main/README.md).

### Initialize the project

1. In **File Explorer** or a terminal, create a new empty directory, and change into it.

1. Run the `azd init` command and specify the template you want to use as a parameter:

    ```azdeveloper
    azd init --template todo-java-mongo
    ```

  Note: this command will initialize the application, including cloning the GitHub repo. 

1. You will be prompted for an environment name, which sets the prefix for the resource group that will be created to hold the Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name)

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

### Set up your Codespace

1. In your browser, navigate to the [Java/Mongo `azd` template](https://github.com/Azure-Samples/todo-java-mongo) (or [select one from our templates library](./azd-templates.md)).
2. Above the file list, click **Use this template** > **Open in a Codespace**.

   :::image type="content" source="media/get-started/codespaces-template-dropdown.png" alt-text="Screenshot demonstrating selecting the option to open a template in a Codespace via the GitHub repo UI.":::

With Codespaces, all pre-requisites are installed for you, including the [`azd` Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev). 

:::image type="content" source="media/get-started/codespaces-initial-set-up.png" alt-text="Screenshot showing what your new Codespace will look like once initiated.":::

### Run `up` command

Once your Codespace is created, right-click **azure.yaml** in the root directory. From the options, select **up (provision resources, and deploy code to Azure)**.

:::image type="content" source="media/get-started/codespaces-up-command.png" alt-text="Screenshot showing the azure.yaml menu option for running azd up.":::

### Provide parameters

When you run the `azd up` command, you'll be prompted to provide the following information and to sign in using a web browser and an authentication code:

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

- The [Azure resources referenced in the template's `README.md` file](https://github.com/Azure-Samples/todo-java-mongo/blob/main/README.md) have been provisioned to the Azure subscription you specified after you ran `azd up`. You can now view those Azure resources via the [Azure portal](https://portal.azure.com).
- The app has been built and deployed to Azure. Using the web app URL output from the `azd up` command, you can browse to the fully functional app.

> [!NOTE]
> - You can call `azd up` as many times as you like to both provision and deploy your application.
> - Run and debug that requires launching a web browser is currently not supported because of [known limitation with GitHub Codespaces](https://code.visualstudio.com/docs/remote/codespaces#_known-limitations-and-adaptations). For a better experience, we recommend using Codespaces in Desktop.

## [DevContainer](#tab/devcontainer)

A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine.

### Pre-requisites

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Review the architecture diagram and the Azure resources you'll deploy in the Java template README](https://github.com/Azure-Samples/todo-java-mongo/blob/main/README.md).

### Initialize project

1. Open a terminal, create a new empty directory, and change into it.

1. Run the following command to initialize the project:

   ```azdeveloper
   azd init --template todo-java-mongo
   ```

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

::: zone-end


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

---
title: Configure your local JavaScript environment for Azure development
description: How to set up a local JavaScript dev environment for working with Azure, including an editor, the Azure SDK libraries, optional tools, and the necessary credentials for library authentication.
ms.date: 08/22/2024
ms.topic: how-to
ms.custom: devx-track-js, azure-sdk-javascript-ai-text-analytics-5.0.0
---

# Configure your JavaScript develop environment for Azure

When creating cloud applications, developers typically prefer to test code on their local workstations before deploying that code to a cloud environment like Azure. Local development gives you the advantage of a wider variety of tools along with a familiar environment.

This article provides setup instructions to create and validate a local development environment that's suitable for JavaScript with Azure.

## One-time subscription creation

[Azure resources](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources?tabs=AzureManagementGroupsAndHierarchy) are created within a subscription and resource group. 

:::row:::
    :::column:::
        **Type**
    :::column-end:::
    :::column:::
        **Description**
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        Trial subscription
    :::column-end:::
    :::column:::
        Create a _free_ [trial subscription](https://azure.microsoft.com/free/).
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        Existing subscription
    :::column-end:::
    :::column:::
        If you already have a subscription, access your existing subscription with:
* [Azure portal](https://portal.azure.com)
* [Azure CLI](/cli/azure/install-azure-cli)
* [Azure SDKs for JavaScript](../azure-sdk-library-package-index.md)
* [Visual Studio Code extensions](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=Azure&sortBy=Relevance)
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        Across multiple subscriptions
    :::column-end:::
    :::column:::
        If you need to manage multiple subscriptions, [learn how](/azure/governance/management-groups/create-management-group-javascript) to create a management group with JavaScript.
    :::column-end:::
:::row-end:::

## One-time software installation

Azure development with JavaScript on your local workstation, we suggest you install the following:

|Name/Installer|Description|
|--|--|
|[Node.js LTS](https://www.npmjs.com/)|Install latest long-term support (LTS) runtime environment for local workstation development.|
|[Visual Studio Code](https://code.visualstudio.com/)| Visual Studio Code will give you a great JavaScript integration and coding experience but it is not required. You can use any code editor.|
|[Visual Studio Code extensions](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=Azure&sortBy=Relevance)|Install any relevant extensions for Azure services you intend to use.|

### Azure hosting runtime 

If you plan to use an Azure resource as the hosting environment for your application, such as an Azure web app or Azure Functions, you should [verify your local Node.js development environment runtime version of Node.js](what-is-azure-for-javascript-development.md#4-verify-runtime-for-javascript-apps-hosted-in-azure) matches the Azure resource runtime you plan to use.

### Recommended local installations

The following common local workstation installations are recommended to help with your local development tasks.

|Name|Description|
|--|--|
|[Azure CLI](/cli/azure/get-started-with-azure-cli)|Local or cloud-based CLI to create and use Azure resources.|
|[Azure Developer CLI](../../azure-developer-cli/overview.md?tabs=nodejs)|Developer-centric command-line tool for building cloud apps in developer workflow.|
|[Visual Studio Code extensions for Azure](../node-azure-tools.md#visual-studio-code-extensions) |VS Code extensions to the IDE.|
|[Git](https://git-scm.com/downloads) or [Git for Windows](https://gitforwindows.org/)| Command-line tools for source control. You can use a different source control tool if you prefer. |

## One-time configuration for authentication

To use the same authentication code in local development and the remote Azure hosting environment, use the [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential).

## Create a resource group for your project

[!INCLUDE [create resource group 3-tab](../../includes/create-resource-group.md)]


## Working with Azure and the Azure SDK client libraries

The [Azure SDK libraries](../azure-sdk-library-package-index.md) are provided individually for each service. You install each library based on the Azure service you need to use.

Each new project using Azure should:
- Create Azure resources and save associated keys or configuration to a [secure location](#securing-configuration-information).
- Install Azure SDK libraries from NPM or Yarn. 
- Use your local Service Principal credential to authenticate to the Azure SDK, then use configuration information to access specific services.

## Securing configuration information

You have several options to store configuration information:

- Azure [Key Vault](/azure/key-vault/) to create and maintain keys that access and encrypt your cloud resources, apps, and solutions.
- [Dotenv](https://www.npmjs.com/package/dotenv) is a popular npm package to read environment variables from a `.env` file. Make sure to add the `.env` file to the `.gitignore` file so the `.env` file is not checked into to source control. Learn more about [environment variables](../how-to/configure-web-app-settings.md) in web apps for Azure. 

### Create environment variables for the Azure libraries

To use the Azure settings needed by the Azure SDK libraries to access the Azure cloud, set the most common values to [environment variables](../how-to/configure-web-app-settings.md). The following commands set the environment variables for the local workstation. 

In the following examples, the client ID is the service principal ID and service principal secret.

# [bash](#tab/bash)

```bash
AZURE_SUBSCRIPTION_ID="<REPLACE-WITH-YOUR-AZURE-SUBSCRIPTION-ID>"
AZURE_TENANT_ID="<REPLACE-WITH-YOUR-AZURE-TENANT-ID>"
AZURE_CLIENT_ID="<REPLACE-WITH-YOUR-AZURE-CLIENT-ID>"
AZURE_CLIENT_SECRET="<REPLACE-WITH-YOUR-AZURE-CLIENT-SECRET>"
```

# [cmd](#tab/cmd)

```cmd
set AZURE_SUBSCRIPTION_ID="<REPLACE-WITH-YOUR-AZURE-SUBSCRIPTION-ID>"
set AZURE_TENANT_ID="<REPLACE-WITH-YOUR-AZURE-TENANT-ID>"
set AZURE_CLIENT_ID="<REPLACE-WITH-YOUR-AZURE-CLIENT-ID>"
set AZURE_CLIENT_SECRET="<REPLACE-WITH-YOUR-AZURE-CLIENT-SECRET>"
```

---

Replace the values shown in these commands with those of your specific service principal.

### Create `.env` file 

Another common mechanism is to use the `DOTENV` NPM package to create a `.env` file for these settings. If you plan to use a `.env`, make sure to **not check in** the file to source control. Add the `.env` file to git's `.ignore` file is the standard way to ensure those settings are checked into source control.

## Install npm packages

For every project, we recommend that you always create a separate folder, and its own `package.json` file using the following steps:

1. Open a terminal, command prompt, or bash shell and create a new folder to the project. Then move into that new folder.

    ```console
    mkdir MY-NEW-PROJECT && cd MY-NEW-PROJECT
    ```

1. Initialize the package file:

    ```console
    npm init -y
    ```

    This creates the package.json file and initializes the minimum properties.

1. Install the Azure SDK libraries you need, such as this example:

    ```console
    npm install @azure/ai-text-analytics@5.0.0
    ```

## Use source control with Visual Studio Code

We recommend that you get into the habit of creating a source control repository whenever you start a project. You can do this from Visual Studio Code. 

1. In Visual Studio Code, select the source control icon to open the **Source Control** explorer, then select **Initialize Repository** to initialize a local Git repository:

    ![Initialize git repository](../media/setup-environment/initialize-local-repository.png)

1. After the repository is initialized, and you have files to store in source control, enter the message `Initial commit` and select the checkmark to create the initial commit of your source files.

    ![Complete an initial commit to the repository](../media/setup-environment/initial-commit.png)

1. Create a new repository on [GitHub](https://github.com/new) or [Azure DevOps](https://dev.azure.com/) and copy the repository URL for the next few step. 

1. In the Visual Studio integrated terminal, use the following [git](https://git-scm.com/docs) command to add your remote repository to your local repository. Replace `YOUR-ALIAS` and `YOUR-REPOSITORY` with your own values.

    ```bash
    git remote add origin https://github.com/YOUR-ALIAS/YOUR-REPOSITORY
    ```

Visual Studio Code includes many built-in git features. For more information, see [Using Version Control in VS Code](https://code.visualstudio.com/docs/editor/versioncontrol).

## Next steps

* [Create and use a service principal](../sdk/authentication/local-development-environment-service-principal.md)
* [Authenticate with the Azure modules for Node.js](../sdk/authentication/local-development-environment-service-principal.md)
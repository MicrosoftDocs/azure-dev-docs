---
title: Configure your local JavaScript environment for Azure development
description: How to set up a local JavaScript dev environment for working with Azure, including an editor, the Azure SDK libraries, optional tools, and the necessary credentials for library authentication.
ms.date: 07/28/2021
ms.topic: how-to
ms.custom: devx-track-js, azure-sdk-javascript-ai-text-analytics-5.0.0
---

# Configure your local JavaScript dev environment for Azure

When creating cloud applications, developers typically prefer to test code on their local workstations before deploying that code to a cloud environment like Azure. Local development gives you the advantage of a wider variety of tools along with a familiar environment.

This article provides setup instructions to create and validate a local development environment that's suitable for JavaScript with Azure.

## One-time subscription creation

[Azure resources](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources?tabs=AzureManagementGroupsAndHierarchy) are created within a subscription and resource group. 

|Type|Description|
|--|--|
|Trial subscription|Create a _free_ [trial subscription](https://azure.microsoft.com/free/).|
|Existing subscription|If you already have a subscription, access your existing subscription in the [Azure portal](https://portal.azure.com), the [Azure CLI](/cli/azure/install-azure-cli), or [Azure SDKs for JavaScript](../azure-sdk-library-package-index.md).|
|Across multiple subscriptions|If you need to manage multiple subscriptions, [learn how](/azure/governance/management-groups/create-management-group-javascript) to create a management group with JavaScript.|

## One-time software installation

Azure development with JavaScript on your local workstation, we suggest you install the following:

|Name/Installer|Description|
|--|--|
|[Node.js LTS](https://www.npmjs.com/)|Install latest long-term support (LTS) runtime environment for local workstation development.|
|[Visual Studio Code](https://code.visualstudio.com/)| Visual Studio Code will give you a great JavaScript integration and coding experience but it is not required. You can use any code editor.|

### Azure hosting runtime 

If you plan to use an Azure resource as the hosting environment for your application, such as an Azure web app or Azure Functions, you should [verify your local Node.js development environment runtime version of Node.js](what-is-azure-for-javascript-development.md#4-verify-runtime-for-javascript-apps-hosted-in-azure) matches the Azure resource runtime you plan to use.

### Recommended local installations

The following common local workstation installations are recommended to help with your local development tasks.

|Name|Description|
|--|--|
|[Azure CLI](/cli/azure/get-started-with-azure-cli)|Local or cloud-based CLI to create and use Azure resources.|
|[Visual Studio Code extensions for Azure](../node-azure-tools.md#visual-studio-code-extensions) |VS Code extensions to the IDE.|
|[Git](https://git-scm.com/downloads) or [Git for Windows](https://gitforwindows.org/)| Command-line tools for source control. You can use a different source control tool if you prefer. |

## One-time configuration for authentication

To use the same authentication code in local development and the remote Azure hosting environment, use the [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential).

To use the same code in all environments: 

* For **local development**, [create a service principal](../core/nodejs-sdk-azure-authenticate.md) to create and manage Azure resources _without_ using your personal account. 
* For **Azure hosting**, [learn more](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/using-azure-identity.md#getting-started).  

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
AZURE_SUBSCRIPTION_ID="aa11bb33-cc77-dd88-ee99-0918273645aa"
AZURE_TENANT_ID="00112233-7777-8888-9999-aabbccddeeff"
AZURE_CLIENT_ID="12345678-1111-2222-3333-1234567890ab"
AZURE_CLIENT_SECRET="abcdef00-4444-5555-6666-1234567890ab"
```

# [cmd](#tab/cmd)

```cmd
set AZURE_SUBSCRIPTION_ID="aa11bb33-cc77-dd88-ee99-0918273645aa"
set AZURE_TENANT_ID=00112233-7777-8888-9999-aabbccddeeff
set AZURE_CLIENT_ID=12345678-1111-2222-3333-1234567890ab
set AZURE_CLIENT_SECRET=abcdef00-4444-5555-6666-1234567890ab
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

* [Create and use a service principal](../core/nodejs-sdk-azure-authenticate.md)
* [Authenticate with the Azure modules for Node.js](nodejs-sdk-azure-authenticate.md)
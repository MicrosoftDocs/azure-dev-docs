---
title: Configure your local JavaScript environment for Azure development
description: How to set up a local JavaScript dev environment for working with Azure, including an editor, the Azure SDK libraries, optional tools, and the necessary credentials for library authentication.
ms.date: 09/21/2020
ms.topic: conceptual
ms.custom: devx-track-javascript
---

# Configure your local JavaScript dev environment for Azure

When creating cloud applications, developers typically prefer to test code on their local workstations before deploying that code to a cloud environment like Azure. Local development gives you the advantage of a wider variety of tools along with a familiar development environment.

This article provides setup instructions to create and validate a local dev environment that's suitable for JavaScript with Azure.

## One-time subscription creation

Azure resources are created within a subscription, which is the billing unit for using Azure. While you can create free resources (each subscription offers a free resource for most services), you should create paid-tier resources when you expect to deploy your resource to production.

* If you already have a subscription, you don't need to create a new one. Use the [Azure portal](https://portal.azure.com) to access your existing subscription.
* [Begin a free trial subscription](https://azure.microsoft.com/free/cognitive-services)

## One-time installation

To develop using an Azure resource with JavaScript on your local workstation, you need the following installed once:

|Name/Installer|Description|
|--|--|
|[Node.js](https://www.npmjs.com/)|Install latest long-term support (LTS) runtime environment for local workstation development. |
| NPM (installed with modern versions of Node.js) or [Yarn](https://yarnpkg.com/)|Package manager to install Azure SDK libraries.|
|[VSCode](https://aka.ms/vscode-deploy)| VSCode will give you a great JavaScript integration and coding experience but it is not required. You can use any code editor. For this document, if you are using a different editor, check for integration with Azure or use the Azure CLI.|
|[Azure CLI](../azure-cli/what-is-azure-cli.md)|You can use the Azure CLI to recreate and manage Azure resources from a command line, terminal, or bash shell.|

> [!CAUTION]
> If you plan to use an Azure resource as the runtime environment for your code, such as an Azure web app or an Azure Container Instance, you should verify your local Node.js development environment matches the Azure resource runtime you plan to use.

### Optional local installations

The following common local workstation installations are optional to help with your local development tasks.

|Name/Installer|Description|
|--|--|
| [git](https://git-scm.com/downloads) | Command-line tools for source control. You can use a different source control tool if you prefer. |

## One-time configuration of service principal

Each Azure service has an authentication mechanism. This can include keys and endpoints, connection strings, or other mechanisms. To conform to best practices, create resources and authenticate to resources using a service principal. A service principal allows you to concretely define the access scope to the immediate development need.

Conceptually, the steps to create and use a service principal include:

* Log in to Azure with your individual user account, such as joe@microsoft.com.
* Create a named service principal with specific scope. Because most quickstarts ask you to create an Azure resource, the service principal needs to have the ability to create resources.
* Log off Azure with your user account.
* Authenticate to Azure programmatically with service principal.
* Service principal creates an Azure resource and uses the service associated with the service.

### Create service principal

To make service principal creation easier, use the following steps and provided script to create your service principal to use with Azure quickstarts. The following steps use the name `JOE` as an example user name. Replace this with your own name or email alias.

1. Open VSCode and install the [Azure CLI tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli) extension. This extension allows you to execute Azure CLI commands from the script file, line by line. When you run each command, a neighboring doc opens in VSCode to see the results.

1. Create a new file named `create-service-principal.sh` and copy the following Azure commands into the file:

    ```azurecli
    # Replace ALL-CAPS variables with your own values

    ####################################
    # Login as you
    ####################################

    # Login - command opens browser, select your account to finish authentication, then close browser
    az login

    ####################################
    # Optional, set default subscription
    ####################################

    # If you have more than 1 subscription, use the `list` command to find the subscription, then use the `set` command to set the default by name or id
    az account list
    az account set --subscription MYCOMPANYSUBSCRIPTION

    ####################################
    # Create service principal
    ####################################

    # Create a service principal with a name that indicates its purpose and owner - the response includes the `appId` which is necessary in some of the remaining commands
    az ad sp create-for-rbac --name JOE-SERVICEPRINCIPAL-DOCUMENT-QUICKSTARTS --skip-assignment

    ####################################
    # Add role of contributor
    ####################################

    # Add contributor role to service principal so it can create Azure resources
    az role assignment create --assignee APP-ID --role CONTRIBUTOR

    ####################################
    # Optional, verify role assignment
    ####################################

    # Verify role assignment for service principal
    az role assignment list --assignee APP-ID

    ####################################
    # Logout
    ####################################

    # Logout off Azure CLI
    az logout
    ```

    For the remaining steps in this procedure, for each line in the file that does **not** begin with `#`, place the VSCode cursor on the line, then **right-click** to select **Run Line in Editor**.

    :::image type="content" source="media/development-setup/vscode-rightclick-run-line-in-editor.png" alt-text="For the remaining steps in this procedure, for each line in the file that does not begin with `#`, place the VSCode cursor on the line, then right-click to select `Run Line in Editor`.":::

1. Use right-click/Run Line in Editor on the following line to authenticate to Azure with your own user account using the Azure CLI. This command opens an internet browser. Select your Azure account. Once your account is authenticated, close the browser window, you won't need it with the remaining tasks.

    ```azurecli
    az login
    ```

    The response includes all subscriptions you have access to, displayed in another VSCode doc window as a JSON array. Find the `name` or `id` property. You need one of these values for the remaining commands.

    ```json
    [  {
    "cloudName": "AzureCloud",
    "id": "320d9379-aaaa-bbbb-cccc-52f2b0fc40ac",
    "isDefault": false,
    "name": "contoso-development-team",
    "state": "Enabled",
    "tenantId": "72f988bf-aaaa-bbbb-cccc-2d7cd011db47",
    "user": {
      "name": "joe@contoso.com",
      "type": "user"
    }
    }]
    ```

    The subscription marked with `isDefault: true` is the subscription that receives the remaining commands. If you need to change the default subscription, use the `az account set --subscription <name or id>` command.


<a name='create-service-principal-command'></a>

1. Use right-click/Run Line in Editor on the following line to create the service principal tied to your user account. This service principal doesn't have any scoped permissions yet, due to the `--skip-assignment` parameter.


    ```azurecli
    az ad sp create-for-rbac --name JOE-SERVICEPRINCIPAL-DOCUMENT-QUICKSTARTS --skip-assignment
    ```

    The service principal name is `JOE-SERVICEPRINCIPAL-DOCUMENT-QUICKSTARTS`. You can see a list of all service principals associated with your Azure user account in the Azure portal, under the Active Directory service's list of applications.

    The result includes information you need: `appId` and `password`. Save the file with the name `create-service-principal.json`

    ```json
    {
      "appId": "93453d56-aaaa-bbbb-cccc-db600ecc4f6a",
      "displayName": "JOE-SERVICEPRINCIPAL-DOCUMENT-QUICKSTARTS",
      "name": "http://JOE-SERVICEPRINCIPAL-DOCUMENT-QUICKSTARTS",
      "password": "d88b21e0-aaaa-bbbb-cccc-e1e9b06d50f6",
      "tenant": "72f988bf-aaaa-bbbb-cccc-2d7cd011db47"
    }
    ```

1. Use right-click/Run Line in Editor on the following line to assign the scoped permission to create Azure resources. The `CONTRIBUTOR` scope allows the service principal to create Azure resources.

    ```azurecli
    az role assignment create --assignee APP-ID --role CONTRIBUTOR
    ```

    The result looks like the following:

    ```json
    {
      "canDelegate": null,
      "id": "/subscriptions/a5b1ca8b-aaaa-bbbb-cccc-4cf7ec4791a0/providers/Microsoft.Authorization/roleAssignments/3a155db5-aaaa-bbbb-cccc-0cbfebf75464",
      "name": "3a155db5-aaaa-bbbb-cccc-0cbfebf75464",
      "principalId": "c05d56c9-aaaa-bbbb-cccc-0535d6167ed4",
      "principalType": "ServicePrincipal",
      "roleDefinitionId": "/subscriptions/a5b1ca8b-aaaa-bbbb-cccc-4cf7ec4791a0/providers/Microsoft.Authorization/roleDefinitions/b24988ac-aaaa-bbbb-cccc-20f7382dd24c",
      "scope": "/subscriptions/a5b1ca8b-aaaa-bbbb-cccc-4cf7ec4791a0",
      "type": "Microsoft.Authorization/roleAssignments"
    }
    ```

    At this point, your service principal is ready to use.

1. Use right-click/Run Line in Editor on the following line to log out of the Azure CLI with the following command:

    ```azurecli
    az logout
    ```

## Steps for each new development project setup

Because the Azure SDK libraries are provided individually for each service, there isn't a single downloadable package to access all of the Azure resources. You install each library based on the Azure service you want to use.

Each new project using Azure should:
- Create Azure resources or find authentication information for existing Azure resources
- Install Azure SDK libraries from NPM or Yarn. Learn about [library versions](#library-versions).
- Manage authentication information within the project securely. One common method is to use **[Dotenv](https://www.npmjs.com/package/dotenv)** to read environment variables from a `.env` file. Make sure to add the `.env` file to the `.gitignore` file so the `.env` file is not checked into to source control.

### Library versions

[Azure libraries](azure-sdk-library-package-index.md) generally use the `@azure` scope.

The latest libraries use the scope `@azure`. Older packages from Microsoft typically begin with `azure-`. Many packages begin with this name, which are not produced by Microsoft. Verify the owner of the package is either Microsoft or Azure.

### Create resource using service principal

The following section provides an example of how to create an Azure service resource with a service principal. To sign in with a service principal, you need the `appId`, `tenant`, and `password` you saved from the [Create service principal](#create-service-principal) procedure into the `create-service-principal.json`.

1. Open VSCode and use the previously installed [Azure CLI tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli) extension. This extension allows you to execute Azure CLI commands from the script file, line by line. When you run each command, a neighboring doc opens in VSCode to see the results.

1. Create a new file named `create-service-resource.sh` and copy the following Azure commands into the file:

    ```azurecli
    ####################################
    # Login as service principal
    ####################################
    # User name for command is the app id
    az login --service-principal --username APP_ID --password PASSWORD --tenant TENANT_ID

    ####################################
    # Create resource group
    ####################################

    # Create resource group in westus region - check your quickstart if it requires a specific region, then change this value to the appropriate region
    # Common naming convention for resource group is `USERNAME-REGION-PURPOSE`
    az group create --location WESTUS --name JOE-WESTUS-QUICKSTARTS-RESOURCEGROUP

    ####################################
    # Create specific service resource
    ####################################

    # Create resource in westus
    # This is an example of creating a Cognitive Services TextAnalytics resource
    # Review your quickstart to find the exact command
    az SERVICENAME account create --name JOE-WESTUS-COGNITIVESERVICES-TextAnalytics --resource-group JOE-WESTUS-QUICKSTARTS-RESOURCEGROUP --kind TextAnalytics --sku F0 --location WESTUS --yes

    ####################################
    # Get resource keys
    ####################################

    # Get resource keys
    az cognitiveservices account keys list --name JOE-WESTUS-COGNITIVESERVICES-TextAnalytics --resource-group JOE-WESTUS-QUICKSTARTS-RESOURCEGROUP
    ```

1. Use right-click/Run Line in Editor on the following line to log in with the service principal. The variables in all caps were returned in the response from the [previous command to create the service principal](#create-service-principal-command).

    ```azurecli
    az login --service-principal --username APP_ID --password PASSWORD --tenant TENANT_ID
    ```

1. Use right-click/Run Line in Editor on the following line to create a resource group for all resources you need to create for the quickstart. The resource group region can only contain resources from that region.

    ```azurecli
    az group create --location WESTUS --name JOE-WESTUS-QUICKSTARTS-RESOURCEGROUP
    ```

    When you are done with the quickstart resources, you can delete the resource group, which deletes on the resources in one action.

1. Use right-click/Run Line in Editor on the following line to create a Cognitive Services TextAnalytics resource. This is an example, your own resource will have a different command.

    ```azurecli
    az SERVICENAME account create --name JOE-WESTUS-COGNITIVESERVICES-TextAnalytics --resource-group JOE-WESTUS-QUICKSTARTS-RESOURCEGROUP --kind TextAnalytics --sku F0 --location WESTUS --yes
    ```

    The TextAnalytics resource uses a key and endpoint, which you need to use the [quickstarts for TextAnalytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/quickstarts/text-analytics-sdk?tabs=version-3&pivots=programming-language-javascript).

1. Use right-click/Run Line in Editor on the following line to get the TextAnalytics key and endpoint. Authentication to the TextAnalytics service uses the key and endpoint.

    ```azurecli
    az cognitiveservices account keys list --name JOE-WESTUS-COGNITIVESERVICES-TextAnalytics --resource-group JOE-WESTUS-QUICKSTARTS-RESOURCEGROUP
    ```

### Create environment variables for the Azure libraries

To use the Azure settings needed by the Azure SDK libraries to access the Azure cloud, set the most common values to environment variables. The following commands set the environment variables to the local workstation. Another common mechanism is to use the `DOTENV` NPM package to create a `.env` file for these settings. If you plan to use a `.env`, make sure to not check in the file to source control. Add the `.env` file to git's `.ignore` file is the standard way to ensure those settings are checked into source control.

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

### Install NPM packages

For every project, we recommend that you always create a separate folder, and its own `package.json` file using the following steps:

1. Open a terminal, command prompt, or bash shell and create a new folder to the project. Then move into that new folder.

    ```console
    mkdir MY-NEW-PROJECT && cd MY-NEW-PROJECT
    ```

1. Initialize the package file:

    ```console
    npm init -y
    ```

    This command runs the NPM command to create the package.json file and initialize the minimum properties. As you install Azure SDK library packages with NPM or Yarn, the package.json file captures that installation information.

1. Install the Azure SDK libraries you need for the quickstart. The following command is an example.

    ```console
    npm install @azure/ai-text-analytics@5.0.0
    ```

## Use source control

We recommend that you get into the habit of creating a source control repository whenever you start a project. If you have Git installed, run the following command:

```bash
git init
```

From there, you can run commands like `git add` and `git commit` to commit changes. By regularly committing changes, you create a commit history with which you can revert to any previous state.

To make an online backup of your project, we also recommend uploading your repository to [GitHub](https://github.com) or [Azure DevOps](/azure/devops/user-guide/code-with-git?view=azure-devops). If you've initialized a local repository first, use `git remote add` to attach the local repository to GitHub or Azure DevOps.

Documentation for git is found on [git-scm.com/docs](https://git-scm.com/docs) and all around the Internet.

Visual Studio Code includes a number of built-in git features. For more information, see [Using Version Control in VS Code](https://code.visualstudio.com/docs/editor/versioncontrol).

You can also use any other source control tool of your choice; Git is simply one of the most widely used and supported.

## Next steps

* [Deploy a static website to Azure from Visual Studio Code](tutorial-vscode-static-website-node-01.md)
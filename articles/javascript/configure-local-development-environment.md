---
title: Configure your local JavaScript environment for Azure development
description: How to set up a local JavaScript dev environment for working with Azure, including an editor, the Azure SDK libraries, optional tools, and the necessary credentials for library authentication.
ms.date: 06/01/2020
ms.topic: conceptual
---

# Configure your local JavaScript dev environment for Azure

When creating cloud applications, developers typically prefer to test code on their local workstations before deploying that code to a cloud environment like Azure. Local development gives you the advantage of a wider variety of tools along with a familiar development environment.

This article provides setup instructions to create and validate a local dev environment that's suitable for JavaScript with Azure.

## One-time subscription creation

Azure resources are created within a subscription, which is the billing unit for using Azure. While you can create free resources (each subscription offers a free resource for most services), you should create paid-tier resources when you expect to deploy your resource to production.

* If you already have a subscription, you don't need to create a new one. Use the [Azure portal](https://portal.azure.com) to access your existing subscription.
* [Begin a free trial subscription]()

## One-time installation

To develop using an Azure resource with JavaScript on your local workstation, you need the following installed once:

|Name/Installer|Description|
|--|--|
|[Node.js]()|Install latest long-term support (LTS) runtime environment for local workstation development. |
| NPM (installed with modern versions of Node.js) or [Yarn]()|Package manager to install Azure SDK libraries.|
|[VSCode](https://aka.ms/vscode-deploy)| VSCode will give you a great JavaScript integration and coding experience but it is not required. You can use any code editor. For this document, if you are using a different editor, check for integration with Azure or use the Azure CLI.|
|[Azure CLI]()|You can use the Azure CLI to recreate and manage Azure resources from a command line, terminal, or bash shell.|

> [!CAUTION]
> If you plan to use an Azure resource as the runtime environment for your code, such as an Azure web app or an Azure Container Instance, you should verify your local Node.js development environment matches the Azure resource runtime you plan to use.

### Optional workstation installations

The following common installations are optional to help with your local development tasks.

|Name/Installer|Description|
|--|--|
| [git](https://git-scm.com/downloads) | Command-line tools for source control. You can use a different source control tool if you prefer. |

## One-time configuration of service principle

Each Azure service has an authentication mechanism. This can include keys and endpoints, connection strings, other mechanisms. To conform to best practices, create resources and authenticate to resources using a service principal. A service principal allows you to concretely define access scope to the immediate development need.

Conceptually, the steps to create and use a service principal include:

* Log in to Azure with your individual user account, such as joe@microsoft.com.
* Create a named service principle with specific scope. Because most quickstarts ask you to create an Azure resource, the service principal needs to have the ability to create resources.
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

    # If you have more than 1 subscription, use the `list` command to find the subscription, then use the `set` command to set the default by name or id
    az account list
    az account set --subscription MYCOMPANYSUBSCRIPTION

    # Create a service principal with a name that indicates its purpose and owner - the response includes the `appId` which is necessary in some of the remaining commands
    az ad sp create-for-rbac --name JOE-SERVICEPRINCIPAL-DOCUMENT-QUICKSTARTS --skip-assignment

    # Add contributor role to service principal so it can create Azure resources
    az role assignment create --assignee APP-ID --role CONTRIBUTOR

    # Verify role assignment for service principal
    az role assignment list --assignee APP-ID

    # Logout off Azure CLI
    az logout
    ```

    For the remaining steps in this procedure, for each line in the file that does **not** begin with `#`, place the VSCode cursor on the line, then right-click to select **Run Line in Editor**.

1. Select the line in the file that has the following command to authenticate to Azure with your own user account using the Azure CLI. This command opens an internet browser. Select your Azure account. Once your account is authenticated, close the browser window, you won't need it with the remaining tasks.

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

1. Select the line in the file that has the following command to create the service principal tied to your user account. This service principal doesn't have any scoped permissions yet, due to the `--skip-assignment` parameter.


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

1. Select and the line in the file that has the following command to assign the scoped permission to create Azure resources. The `CONTRIBUTOR` scope allows the service principal to create Azure resources.

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

1. Log out of the Azure CLI with the following command:

    ```azurecli
    az logout
    ```

## Steps for each new development project setup

Because the Azure SDK libraries are provided individually for each service, there isn't a single downloadable package to access all of the Azure resources. You install each library based on the Azure service you want to use.

![Conceptual image of local machine connecting to Azure cloud resource such as Cosmos and Storage (more than 1 resource) with SDK]()

Each new project using Azure should include:
- Create Azure resources or find authentication information for existing Azure resources
- Install Azure SDK libraries from NPM or Yarn
    - Modern Azure SDK libraries - These are scoped to **@azure**, for example [@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob) and [@azure/cosmos](https://www.npmjs.com/package/@azure/cosmos) and include TypeScript types.
    - Older packages - Before using libraries without the @azure scope, make sure they are available from GitHub from within the Microsoft or Azure organizations.
- Manage authentication information within the project securely. One common method is to use **[Dotenv](https://www.npmjs.com/package/dotenv)** to read environment variables from a `.env` file. Make sure to add the `.env` file to the `.gitignore` file so the `.env` file is not checked into to source control.

### Sign in using a service principal

Test the new service principal's credentials and permissions by signing in. To sign in with a service principal, you need the `appId`, `tenant`, and `password` you saved from the [Create service principal](#create-service-principal) procedure into the `create-service-principal.json`.

To sign in with a service principal using a password:

```azurecli-interactive
az login --service-principal --username APP_ID --password PASSWORD --tenant TENANT_ID
```

Once you have signed in as the service principal, create any Azure resources you need for the quickstart you intend to use. Once you have the resource, you can use the resource's suggest authentication mechanism safely. That mechanism can be keys and endpoints, and connection string, or another method. Set the values of the mechanism, along with typical Azure information, to environment variables, show in the [next section](#create-environment-variables-for-the-azure-libraries).

The point is that resource was created with the service principal instead of your own user account.

### Create environment variables for the Azure libraries

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

To retrieve your subscription ID, run the [`az account show`](/cli/azure/account?view=azure-cli-latest#az-account-show) command and look for the `id` property in the output.

For convenience, create a *.sh* or *.cmd* file with these commands that you can run whenever you open a terminal or command prompt for local testing. Again, don't add the file to source control so it remains only within your user account.

### Install NPM packages

For every project, we recommend that you always create a `package.json` file using the following steps:

1. Open a terminal, command prompt, or bash shell and create a new folder to the project. Then move into that new folder.

    ```console
    mkdir MY-NEW-PROJECT && cd MY-NEW-PROJECT
    ```

1. Initialize the package file:

    ```console
    npm init -y
    ```

    This command runs the NPM command to create the package.json file and initialize the minimum properties. As you install Azure SDK library packages with NPM or Yarn, the package.json file captures that installation information.

## Use source control

We recommend that you get into the habit of creating a source control repository whenever you start a project. If you have Git installed, simply run the following command:

```bash
git init
```

From there, you can run commands like `git add` and `git commit` to commit changes. By regularly committing changes, you create a commit history with which you can revert to any previous state.

To make an online backup of your project, we also recommend uploading your repository to [GitHub](https://github.com) or [Azure DevOps](/azure/devops/user-guide/code-with-git?view=azure-devops). If you've initialized a local repository first, use `git remote add` to attach the local repository to GitHub or Azure DevOps.

Documentation for git is found on [git-scm.com/docs](https://git-scm.com/docs) and all around the Internet.

Visual Studio Code includes a number of built-in git features. For more information, see [Using Version Control in VS Code](https://code.visualstudio.com/docs/editor/versioncontrol).

You can also use any other source control tool of your choice; Git is simply one of the most widely used and supported.

## Next step

With your local dev environment in place, take a quick look at the common usage patterns for the Azure libraries:

> [!div class="nextstepaction"]
> [Review common usage patterns >>>](azure-sdk-library-usage-patterns.md)

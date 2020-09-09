---
title: Configure your local Python environment for Azure development
description: How to set up a local Python dev environment for working with Azure, including Visual Studio Code, the Azure SDK libraries, and the necessary credentials for library authentication.
ms.date: 05/29/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# Configure your local Python dev environment for Azure

When creating cloud applications, developers typically prefer to test code on their local workstations before deploying that code to a cloud environment like Azure. Local development gives you the advantage of speed and a wider variety of debugging tools.

This article provides the one-time setup instructions to create and validate a local dev environment that's suitable for Python on Azure:

- [Install required components](#required-components), namely an Azure account, Python, and the Azure CLI.
- [Configure authentication](#configure-authentication) for when you use Azure libraries to provision, manage, and access Azure resources.
- Review the process of [using Python virtual environments](#use-python-virtual-environments) for each of your projects.

Once you've configured your workstation, you'll need only minimal added configuration to complete various quickstarts and tutorials elsewhere on this developer center and in the Azure documentation.

This setup for local development is a separate matter from [provisioning resources](cloud-development-flow.md) that make up your application's *cloud environment* on Azure. In your development process, you run code in your local dev environment that can access those cloud resources, but your code is not yet deployed to a [suitable hosting service](quickstarts-app-hosting.md) in the cloud. That deployment step comes later, as described in the [Azure development flow](cloud-development-flow.md) article.

## Install components

### Required components

| Name/Installer | Description |
| --- | --- |
| [Azure account with an active subscription](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=python-dev-center&mktingSource=environment-setup) | Accounts/subscriptions are free and include many free-to-use services. |
| [Python 2.7+ or 3.5.3+](https://www.python.org/downloads) | The Python language runtime. We recommend the latest version of Python 3.x unless you have specific version requirements. |
| [Azure Command-Line Interface (CLI)](/cli/azure/install-azure-cli) | Provides a full suite of CLI commands to provision and manage Azure resources. Python developers commonly use the Azure CLI in conjunction with custom Python scripts that use the Azure management libraries. |

Notes:

- You install individual Azure library packages on a per-project basis depending on your needs. We recommend [using Python virtual environments](#use-python-virtual-environments) for each project. There is no standalone "SDK" installer for Python.
- Although Azure PowerShell is generally equivalent to the Azure CLI, we recommend the Azure CLI when working with Python.

### Recommended components

| Name/Installer | Description |
| --- | --- |
| [Visual Studio Code](https://code.visualstudio.com) | Although you can work with any suitable editor or IDE, Microsoft's free, lightweight IDE is very popular among Python developers. For an introduction, see [Python in VS Code](https://code.visualstudio.com/docs/python/python-tutorial). |
| [Python extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-python.python) | Adds Python support to VS Code. |
| [Azure extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) | Adds support for a variety of Azure Services to VS Code. Support for specific services can also be installed individually. |
| [git](https://git-scm.com/downloads) | Command-line tools for source control. You can use different source control tools if you prefer. |

### Optional components

| Name/Installer | Description |
| --- | --- |
| [Docker extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-python.python) | Adds Docker support to VS Code, which is helpful if you regularly work with containers. |

### Verify components

1. Open a terminal or command prompt.
1. Verify your Python version by running the command, `python --version`.
1. Verify the Azure CLI version by running, `az --version`.
1. Verify VS Code installation:
    1. Run `code .` to open VS Code to the current folder.
    1. In VS Code, select the **View** > **Extensions** command to open the extensions view, then verify that you see "Python" and "Azure Account" in the list (among other "Azure" extensions and "Docker" if you installed that extension as well).

## Sign in to Azure from the CLI

In a terminal or command prompt, sign in to your Azure subscription:

```azurecli
az login
```

The `az` command is the root command of the Azure CLI. What follows `az` is one or more specific commands, such as `login`. See the [az login](/cli/azure/authenticate-azure-cli) command reference.

The Azure CLI normally maintains your sign-in across sessions, but it's a good practice to run `az login` whenever you open a new terminal or command prompt.

## Configure authentication

As described in [How to Authenticate apps](azure-sdk-authenticate.md#identity-when-running-the-app-locally), each developer needs a service principal to use as the application identity when testing app code locally.

The following sections describe how to create a service principal and the environment variables that provide the service principal's properties to the Azure libraries when needed.

Each developer in your organization should perform these steps individually.

### Create a service principal and environment variables for development

1. Open a terminal or command prompt in which you've signed into the Azure CLI (`az login`).

1. Create the service principal:

    ```azurecli
    az ad sp create-for-rbac --name localtest-sp-rbac --skip-assignment --sdk-auth > local-sp.json
    ```

    This command saves it output in *local-sp.json*. For more details on the command and its arguments, see [What the create-for-rbac command does](#what-the-create-for-rbac-command-does).

    If you're in an organization, you may not have permission in the subscription to run this command. In that case, contact the subscription owners to have them create the service principal for you.

1. Use the following commands to create environment variables that the Azure libraries require. (The `DefaultAzureCredential` object of the azure-identity library looks for these variables).

    # [cmd](#tab/cmd)

    ```cmd
    set AZURE_SUBSCRIPTION_ID="aa11bb33-cc77-dd88-ee99-0918273645aa"
    set AZURE_TENANT_ID=00112233-7777-8888-9999-aabbccddeeff
    set AZURE_CLIENT_ID=12345678-1111-2222-3333-1234567890ab
    set AZURE_CLIENT_SECRET=abcdef00-4444-5555-6666-1234567890ab
    ```

    # [bash](#tab/bash)

    ```bash
    AZURE_SUBSCRIPTION_ID="aa11bb33-cc77-dd88-ee99-0918273645aa"
    AZURE_TENANT_ID="00112233-7777-8888-9999-aabbccddeeff"
    AZURE_CLIENT_ID="12345678-1111-2222-3333-1234567890ab"
    AZURE_CLIENT_SECRET="abcdef00-4444-5555-6666-1234567890ab"
    ```

    ---

    Replace the values shown in these commands with those of your specific service principal.

    To retrieve your subscription ID, run the [`az account show`](/cli/azure/account?view=azure-cli-latest#az-account-show) command and look for the `id` property in the output.

    For convenience, create a command line script file (such as *setenv.sh* on macOS/Linux or *setenv.cmd* on Windows) that contains these same commands. You can then run the script to set the variables whenever you open a terminal or command prompt for local testing. Again, don't add the script file to source control so it remains only within your user account.

1. Safeguard the client ID and client secret (and any files storing them) so they always remain within a specific user account on a workstation. Never save these properties in source control or share them with other developers. If needed, you can delete the service principal and create a new one.

    For an additional layer of security, you can make a policy to delete and recreate service principals on a regular schedule, thereby invalidating previous IDs and secrets.

    Furthermore, a development service principal is ideally authorized only for non-production resources, or is created within an Azure subscription that's used only for development purposes. The production application would then use a separate subscription and separate production resources that are authorized only for the deployed cloud application.

1. To modify or delete service principals later on, see [How to manage service principals](how-to-manage-service-principals.md).

#### What the create-for-rbac command does

The `az ad create-for-rbac` command creates a service principal for "role-based authentication" (RBAC).

- `ad` means Azure Active Directory; `sp` means "service principal," and `create-for-rbac` means "create for role-based access control," Azure's primary form of authorization. See the [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command reference.

- The `--name` argument should be unique within your organization and typically uses the name of the developer that uses the service principal. If you omit this argument, the Azure CLI uses a generic name of the form `azure-cli-<timestamp>`. You can rename the service principal on the Azure portal, if desired.

- The `--skip-assignment` argument creates a service principal with no default permissions. You must then assign specific permissions to the service principal to allow locally-run code to access any resources. Different quickstarts and tutorials provide details for authorizing a service principal for the resources involved.

- The command provides JSON output, which in the example is saved in a file named *local-sp.json*.

- The `--sdk-auth` argument generates JSON output similar to the following values. Your ID values and secret will all be different):

    <pre>
    {
      "clientId": "12345678-1111-2222-3333-1234567890ab",
      "clientSecret": "abcdef00-4444-5555-6666-1234567890ab",
      "subscriptionId": "00000000-0000-0000-0000-000000000000",
      "tenantId": "00112233-7777-8888-9999-aabbccddeeff",
      "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
      "resourceManagerEndpointUrl": "https://management.azure.com/",
      "activeDirectoryGraphResourceId": "https://graph.windows.net/",
      "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
      "galleryEndpointUrl": "https://gallery.azure.com/",
      "managementEndpointUrl": "https://management.core.windows.net/"
    }
    </pre>

    Without the `--sdk-auth` argument, the command generates simpler output:

    <pre>
    {
      "appId": "12345678-1111-2222-3333-1234567890ab",
      "displayName": "localtest-sp-rbac",
      "name": "http://localtest-sp-rbac",
      "password": "abcdef00-4444-5555-6666-1234567890ab",
      "tenant": "00112233-7777-8888-9999-aabbccddeeff"
    }
    </pre>

    In this case, `tenant` is the tenant ID, `appId` is the client ID, and `password` is the client secret.

    > [!IMPORTANT]
    > The output from this command is the only place you ever see the client secret/password. You cannot retrieve the secret/password later on. You can, however, add a new secret if needed without invalidating the service principal or existing secrets.

## Use Python virtual environments

For every project, we recommend that you always create and activate a *virtual environment* using the following steps:

1. Open a terminal or command prompt.

1. Create a folder for your project.

1. Create the virtual environment:

    # [cmd](#tab/cmd)

    ```bash
    python -m venv .venv
    ```

    # [bash](#tab/bash)

    ```bash
    python -m venv .venv
    ```

    ---

    This command runs the Python `venv` module and creates a virtual environment in a folder named `.venv`.

1. Activate the virtual environment:

    # [cmd](#tab/cmd)

    ```bash
    .venv\scripts\activate
    ```

    # [bash](#tab/bash)

    ```bash
    source .venv/scripts/activate
    ```

    ---

A virtual environment is a folder within a project that isolates a copy of a specific Python interpreter. Once you activate that environment (which Visual Studio Code does automatically), running `pip install` installs a library into that environment only. When you then run your Python code, it runs in the environment's exact context with specific versions of every library. And when you run `pip freeze`, you get the exact list of the those libraries. (In many of the examples in this documentation, you create a *requirements.txt* file for the libraries you need, then use `pip install -r requirements.txt`. A requirements file is generally needed when you deploy code to Azure.)

If you don't use a virtual environment, then Python runs in its *global environment*. Although using the global environment is quick and convenient, it tends to bloat over time with all the libraries you install for any project or experiment. Furthermore, if you update a library for one project, you might break others projects that depend on different versions of that library. And because the environment is shared by any number of projects, you can't use `pip freeze` to retrieve of a list of any one project's dependencies.

The global environment is where you do want to install tool packages that you want to use in multiple projects. For example, you might run `pip install gunicorn` in the global environment to make the gunicorn web server available everywhere.

## Use source control

We recommend that you get into the habit of creating a source control repository whenever you start a project. If you have Git installed, simply run the following command:

```cmd
git init
```

From there you can run commands like `git add` and `git commit` to commit changes. By regularly committing changes, you create a commit history with which you can revert to any previous state.

To make an online backup of your project, we also recommend uploading your repository to [GitHub](https://github.com) or [Azure DevOps](/azure/devops/user-guide/code-with-git?view=azure-devops). If you've initialized a local repository first, use `git remote add` to attach the local repository to GitHub or Azure DevOps.

Documentation for git is found on [git-scm.com/docs](https://git-scm.com/docs) and all around the Internet.

Visual Studio Code includes a number of built-in git features. For more information, see [Using Version Control in VS Code](https://code.visualstudio.com/docs/editor/versioncontrol).

You can also use any other source control tool of your choice; Git is simply one of the most widely used and supported.

## Next step

With your local dev environment in place, take a quick look at the common usage patterns for the Azure libraries:

> [!div class="nextstepaction"]
> [Review common usage patterns >>>](azure-sdk-library-usage-patterns.md)

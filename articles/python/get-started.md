---
title: Get started with Python on Azure
description: How to set up a local Python dev environment for working with Azure.
ms.date: 07/25/2023
ms.topic: conceptual
ms.custom: devx-track-python, vscode-azure-extension-update-completed
---

# Get started with Python on Azure

Use this document as a checklist and a guide as you begin developing Python applications
that will be hosted in the cloud or utilize cloud services. If you follow the links
and instructions in this document, you'll:

* have a fundamental understanding of what the cloud is and how you design your 
application with the cloud in mind.
* setup your local development environment including the tools and libraries you'll
need to build cloud-based applications.
* understand the workflow when developing cloud-based applications.

## Phase 1: Learn concepts

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

## Phase 2: Configure your local Python environment for Azure development

To develop Python applications using Azure, you first want to configure your local development environment.  Configuration includes creating an Azure account, installing tools for Azure development, and connecting those tools to your Azure account.

Developing on Azure requires [Python](https://www.python.org/downloads/) 3.8 or higher. To verify the version of Python on your workstation, in a console window type the command `python3 --version` for macOS/Linux or `py --version` for Windows.

### Create an Azure Account

To develop Python applications with Azure, you need an Azure account.  Your Azure account is the credentials you use to sign-in to Azure with and what you use to create Azure resources.

If you're using Azure at work, talk to your company's cloud administrator to get your credentials used to sign-in to Azure.

Otherwise, you can create an [Azure account for free](https://azure.microsoft.com/free/python/) and receive 12 months of popular services for free and a $200 credit to explore Azure for 30 days.

> [!div class="nextstepaction"]
> [Create an Azure account for free](https://azure.microsoft.com/free/python/)

### Use the Azure portal

Once you have your credentials, you can sign in to the [Azure portal](https://portal.azure.com) at https://portal.azure.com.  The Azure portal is typically easiest way to get started with Azure, especially if you're new to Azure and cloud development. In the Azure portal, you can do various management tasks such as creating and deleting resources.

If you're already experienced with Azure and cloud development, you'll probably start off using tools as well such as Visual Studio Code and Azure CLI. Articles in the Python developer center show how to work with the Azure portal, Visual Studio Code, and Azure CLI.

> [!div class="nextstepaction"]
> [Sign in to the Azure portal](https://portal.azure.com)

### Use Visual Studio Code

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

### Use the Azure CLI

In addition to the Azure portal and Visual Studio Code, Azure also offers the [Azure CLI](/cli/azure/) command-line tool to create and manage Azure resources. The Azure CLI offers the benefits of efficiency, repeatability, and the ability to script recurring tasks. In practice, most developers use both the Azure portal and the Azure CLI.

After [installing the Azure CLI](/cli/azure/install-azure-cli), sign-in to your Azure account from the Azure CLI by typing the command `az login` in a terminal window on your workstation.

```azurecli
az login
```

The Azure CLI will open your default browser to complete the sign-in process.

### Configure Python virtual environment

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

## Phase 3: Understand the Azure development workflow

[Previous article: provisioning, accessing, and managing resources](cloud-development-provisioning.md)

Now that you understand Azure's model of services and resources, you can understand the overall flow of developing cloud applications with Azure: **provision**, **code**, **test**, **deploy**, and **manage**.

| Step | Primary tools | Activities |
| --- | --- | --- |
| Provision | Azure CLI, Azure portal, VS Code Azure Tools extensions, Cloud Shell, Python scripts using Azure SDK management libraries | Create resource groups and create resources in those groups; configure resources to be ready for use from app code and/or ready to receive Python code in deployments. |
| Code | Code editor (such as Visual Studio Code and PyCharm), Azure SDK client libraries, reference documentation | Write Python code using the Azure SDK client libraries to interact with provisioned resources. |
| Test | Python runtime, debugger | Run Python code locally against active cloud resources (typically dev or test resources rather than production resources). The code itself isn't yet hosted on Azure, which helps you debug and iterate quickly. |
| Deploy | VS Code, Azure CLI, GitHub Actions, Azure Pipelines | Once code has been tested locally, deploy it to an appropriate Azure hosting service where the code itself can run in the cloud. Deployed code typically runs against staging or production resources. |
| Manage | Azure CLI, Azure portal, VS Code, Python scripts, Azure Monitor | Monitor app performance and responsiveness, make adjustments in production environment, migrate improvements back to dev environment for the next round of provisioning and development. |

### Step 1: Provision and configure resources

As described in the [previous article of this series](cloud-development-provisioning.md), the first step in developing any application is to provision and configure the resources that make up the target environment for your application.

Provisioning begins by creating a resource group in a suitable Azure region. You can create a resource group through the Azure portal, VS Code with Azure Tools extensions, the Azure CLI, or with a custom script that uses the Azure SDK management libraries (or REST API).

Within that resource group, you then provision and configure the individual resources you need, again using the portal, VS Code, the CLI, or the Azure SDK. (Again, review the [Azure developer's guide](/azure/guides/developer/azure-developer-guide) for an overview of available resource types.)

Configuration includes setting access policies that control what identities (service principals and/or application IDs) are able to access those resources. Access policies are managed through Azure [Role-Based Access Control (RBAC)](/azure/role-based-access-control/overview); some services have more specific access controls as well. As a cloud developer working with Azure, make sure to familiarize yourself with Azure RBAC because you use it with just about any resource that has security concerns.

For most application scenarios, you typically create provisioning scripts with the Azure CLI and/or Python code using the Azure SDK management libraries. Such scripts describe the totality of your application's resource needs (essentially defining the custom cloud computer to which you're deploying the application). A script enables you to easily recreate the same set of resources within different environment like development, test, staging, and production. When you automate, you can avoid manually performing many repeated steps in Azure portal or VS Code. Such scripts also make it easy to provision an environment in a different region, or to use different resource groups. If you also maintain these scripts in source control repositories, you also have full auditing and change history.

### Step 2: Write your app code to use resources

Once you've provisioned the resources you need for your application, you write the application code to work with the run time aspects of those resources.

For example, in the provisioning step you might have created an Azure storage account, created a blob container within that account, and set access policies for the application on that container. This provisioning process is demonstrated in [Example - Provision Azure Storage](./sdk/examples/azure-sdk-example-storage.md). From your code, you can then authenticate with that storage account and then create, update, or delete blobs within that container. This run time process is demonstrated in [Example - Use Azure Storage](./sdk/examples/azure-sdk-example-storage.md). Similarly, you might have provisioned a database with a schema and appropriate permissions (as demonstrated in [Example - Provision a database](./sdk/examples/azure-sdk-example-database.md)), so that your application code can connect to the database and perform the usual create-read-update-delete queries.

App code typically uses environment variables to identify the names and URLs of the resources to use. Environment variables allow you to easily switch between cloud environments (dev, test, staging, and production) without any changes to the code. The various Azure services that host application code provide a means to define the necessary variables. For example, in Azure App Service (to host web apps) and Azure Functions (serverless compute for Azure), you define *application settings* through the Azure portal, VS Code, or Azure CLI, which then appear to your code as environment variables.

As a Python developer, you'll likely write your application code in Python using the Azure SDK client libraries for Python. That said, any independent part of a cloud application can be written in any supported language. If you're working on a team using multiple programming languages, it's possible that some parts of the application use Python, some JavaScript, some Java, and others C#.

Application code can use the Azure SDK management libraries to perform provisioning and management operations as needed. Provisioning scripts, similarly, can use the SDK client libraries to initialize resources with specific data, or perform housekeeping tasks on cloud resources even when those scripts are run locally.

### Step 3: Test and debug your app code locally

Developers typically like to test app code on their local workstations before deploying that code to the cloud. Testing app code locally means that you're typically accessing other resources that you've already provisioned in the cloud, such as storage, databases, and so forth. The difference is that you're not yet running the app code itself within a cloud service.

By running the code locally, you can also take full advantage of debugging features offered by tools such as Visual Studio Code and manage your code in a source control repository.

You don't need to modify your code at all for local testing: Azure fully supports local development and debugging using the same code you deploy to the cloud. Environment variables are again the key: in the cloud, your code can access the hosting resource's settings as environment variables. When you create those same environment variables locally, the same code runs without modification. This pattern works for authentication credentials, resource URLs, connection strings, and any number of other settings, making it easy to use resources in a development environment when running code locally and production resources once the code is deployed to the cloud.

### Step 4: Deploy your app code to Azure

Once you've tested your code locally, you're ready to deploy the code to the Azure resource that you've provisioned to host it. For example, if you're writing a Django web app, you either deploy that code to a virtual machine (where you provide your own web server) or to Azure App Service (which provides the web server for you). Once deployed, that code is running on the server rather than on your local machine, and can access all the Azure resources for which it's authorized.

As noted in the previous section, in typical development processes you first deploy your code to the resources you've provisioned in a development environment. After a round of testing, you deploy your code to resources in a staging environment, making the application available to your test team and perhaps preview customers. Once you're satisfied with the application's performance, you can deploy the code to your production environment. All of these deployments can also be automated through continuous integration and continuous deployment using Azure Pipelines and GitHub Actions.

However you do it, once the code is deployed to the cloud, it truly becomes a cloud application, running entirely on the server computers in Azure data centers.

### Step 5: Manage, monitor, and revise

After deployment, you want to make sure the application is performing as it should, responding to customer requests and using resources efficiently (and at the lowest cost). You can manage how Azure automatically scales your deployment as needed, and you can collect and monitor performance data with Azure portal, VS Code, the Azure CLI, or custom scripts written with the Azure SDK libraries. You can then make real-time adjustments to your provisioned resources to optimize performance, again using any of the same tools.

Monitoring gives you insight about how you might restructure your cloud application. For example, you may find that certain portions of a web app (such as a group of API endpoints) are used only occasionally in comparison to the primary parts. You could then choose to deploy those APIs separately as serverless Azure Functions. As functions, they have their own backing compute resources that don't compete with the main application but cost only pennies per month. Your main application then becomes more responsive to more customers without having to scale up to a higher-cost tier.

## Next steps

You're now familiar with the basic structure of Azure and the overall development flow: provision resources, write and test code, deploy the code to Azure, and then monitor and manage those resources.


* [Develop a Python web app](/azure/app-service/quickstart-python?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)
* [Develop a container app](./containers-in-azure-overview-python.md)
* [Learn to use the Azure libraries for Python](./sdk/azure-sdk-overview.md)

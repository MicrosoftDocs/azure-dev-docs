---
title: Get started with Python on Azure
description: A starting point with links to everything a Python developer needs to know about Azure.
ms.date: 07/10/2024
ms.topic: conceptual
ms.custom: devx-track-python, vscode-azure-extension-update-completed
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

## Create an Azure Account

To develop Python applications with Azure, you need an Azure account.  Your Azure account is the credentials you use to sign-in to Azure with and what you use to create Azure resources.

If you're using Azure at work, talk to your company's cloud administrator to get your credentials used to sign-in to Azure.

Otherwise, you can create an [Azure account for free](https://azure.microsoft.com/free/python/) and receive 12 months of popular services for free and a $200 credit to explore Azure for 30 days.

> [!div class="nextstepaction"]
> [Create an Azure account for free](https://azure.microsoft.com/free/python/)

## Create and manage resources

Before you can host your app on Azure or use Azure resources (like databases, message queues, file storage, and so on) you'll need to create Azure resources. In other words, you'll need to choose options for an instance of the service that belongs to you, add the resource to a resource group, select the region of the world where the service will run, give the service a unique name, and so on.

There are several tools you can use create and manage Azure resources, depending on your scenario:

- [Azure portal](https://portal.azure.com) - Use this when you're new to Azure and want a web-based user interface to create and manage a couple of resources.
- [Azure CLI](/cli/azure/install-azure-cli) - Use this if you're more comfortable with command line interfaces.
- [Azure PowerShell](/powershell/azure/) - Similar to the Azure CLI, but with a PowerShell style syntax. Use this if you're familiar with PowerShell.
- [Azure Developer CLI](/azure/developer/azure-developer-cli/) - Use this to create repeatable deployments involving many Azure resources with intricate dependencies. Requires learning Bicep templates an imperative language.
- [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) - The extension pack contains extensions for working with Azure App Service, Azure Functions, Azure Storage, Azure Cosmos DB, and Azure Virtual Machines in one convenient package. The Azure extensions make it easy to discover and interact with the Azure.

You can also use the [Azure Management Libraries for Python](https://azure.github.io/azure-sdk/releases/latest/mgmt/python.html) to create and manage resources. The management libraries allow you to use Python to implement custom deployment and management functionality. Here are a few articles that can help you get started:

* [Create a resource group](/python/sdk/examples/azure-sdk-example-resource-group)
* [List groups and resources](/python/sdk/examples/azure-sdk-example-list-resource-groups)
* [Create Azure storage](/python/sdk/examples/azure-sdk-example-storage)
* [Create and deploy a web app](/python/sdk/examples/azure-sdk-example-web-app)
* [Create and query a database](/python/sdk/examples/azure-sdk-example-database)
* [Create a virtual machine](/python/sdk/examples/azure-sdk-example-virtual-machines)


## Write your Python app

Developing on Azure requires [Python](https://www.python.org/downloads/) 3.8 or higher. To verify the version of Python on your workstation, in a console window type the command `python3 --version` for macOS/Linux or `py --version` for Windows.

Use your favorite tools to write your Python app. If you use Visual Studio Code, you should try the [Python extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-python.python).

Most of the instructions in this set of articles use a virtual environment because it is a best practice. Feel free to use any virtual environment you want, but the article instructions standardize on `venv` since it is integrated into Python 3.3 and later.

### Use client libraries

When starting out, you'll like follow the step-by-step instructions of an article. The articles instruct you on which Python on Azure libraries to install and reference using the `pip` utility.

Later, you may want to [install and reference](/python/sdk/azure-sdk-install) the [Azure SDK for Python client libraries](https://azure.github.io/azure-sdk/releases/latest/python.html) directly. [This article](https://learn.microsoft.com/en-us/azure/developer/python/sdk/azure-sdk-overview) is a great starting point.

### Authentication

When you use the Azure SDK for Python, your app will need to authenticate itself. How it authenticates depends on whether you are running your app locally during development and testing, hosting the app on your own servers, or hosting the app in Azure. Read [Authenticate Python apps to Azure services by using the Azure SDK for Python](https://learn.microsoft.com/en-us/azure/developer/python/sdk/authentication-overview) to understand more about this vital topic.

You will also need to set up access policies that control what identities (service principals and/or application IDs) are able to access those resources. Access policies are managed through Azure [Role-Based Access Control (RBAC)](/azure/role-based-access-control/overview); some services have more specific access controls as well. As a cloud developer working with Azure, make sure to familiarize yourself with Azure RBAC because you use it with just about any resource that has security concerns.

### Cross-cutting concerns

- Manage application secrets
- [Logging](/python/sdk/azure-sdk-logging)

## Host your Python app

If you want your app code to run on Azure, you have several options as described in [Hosting applications on Azure](/azure/developer/intro/hosting-apps-on-azure).

If you're building web apps or APIs (Django, Flask, FastAPI, and so on), consider:

- [Azure App Service](/app-service/quickstart-python)
- [Azure App Service (already containerized)](/python/tutorial-containerize-simple-web-app-for-app-service)
- [Azure Container Apps](/python/containers-in-azure-overview-python)
- [Azure Kubernetes cluster](/aks/learn/quick-kubernetes-deploy-cli)

If you're building a web application, see [Configure your local environment for deploying Python web apps on Azure](/python/configure-python-web-app-local-environment).

Also, if you're building a web API, you should consider using [Azure API Management](/api-management/api-management-key-concepts).

If you're building back-end processes:

- [Azure Functions](/azure/azure-functions/create-first-function-vs-code-python)
- [Azure App Service WebJobs](/app-service/webjobs-create)
- [Azure Container Apps](/container-apps/background-processing)

## Next steps

* [Develop a Python web app](/azure/app-service/quickstart-python?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)
* [Develop a container app](./containers-in-azure-overview-python.md)
* [Learn to use the Azure libraries for Python](./sdk/azure-sdk-overview.md)

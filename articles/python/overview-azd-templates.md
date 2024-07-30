---
title: Overview of the Python Web azd Templates
description: Conceptual overview of the Python web azd templates providing contextual background on how to get the most out of the Python web azd template experience.
ms.date: 9/18/2023
ms.topic: conceptual
ms.custom: devx-track-python, devx-track-extended-azdevcli
---

# Overview of the Python Web azd Templates

The Python web Azure Developer CLI (`azd`) templates are the fastest and easiest way to get started with building and deploying Python web applications to Azure. This article provides contextual background information as you're getting started.

The best way to get started is to [follow the quickstart](./quickstart-python-web-azd-templates.md) to create your first Python web application and deploy it to Azure in minutes with `azd` templates. If you don't want to set up a local development environment, you can still follow the [quickstart using GitHub Codespaces](./quickstart-python-web-azd-codespaces.md) instead.

## What are the Python web azd templates?

There are many `azd` templates available on the [Awesome AZD Templates gallery](https://azure.github.io/awesome-azd/). However, this collection of Python web `azd` templates is unique inasmuch as they provide a sample web application with feature parity across many different popular combinations of Azure resources and Python web frameworks.

When you run a Python web `azd` template, you'll:

- **Create a starter application** - Specifically, a website for a fictitious company named Relecloud. The project code features many best practices for the given Python frameworks and packages that are required for that particular stack of technologies. The template is intended to be a starting point for your application. You add or remove application logic and Azure resources as needed.
- **Provision Azure resources** - The template provisions Azure resources for hosting your web app and database using Bicep, a popular infrastructure-as-code tool. Again, you [modify the Bicep templates](./quickstart-python-scale-bicep.md) if you need to add more Azure services.
- **Deploy the starter application to the newly provisioned Azure resources** - The starter application is automatically deployed so you can see it all working in minutes and decide what you want to modify.
- **Optional: Set up a GitHub repository and a CI/CD pipeline** - If you like, the template contains the logic to set up a GitHub repository for you including a GitHub Actions CI/CD pipeline. Within minutes, you're able to make changes to the web project code. When you merge those changes to the *main* branch of your GitHub repo, the CI/CD pipeline publishes them to your new Azure hosting environment.

### Who is this for?

The templates are intended to be used by experienced Python web developers who want to start building a new Python web application targeting Azure deployment.

### Why would I want to use this?

Using the `azd` templates provides several benefits:

- **Fastest possible start** - With your local development environment and hosting environment setups out of the way, you can focus on building your application within minutes.
- **Easiest possible start** - Execute just a few command line instructions to build out an entire local development, hosting and deployment environment. The workflow is easy to use and easy to remember.
- **Build on Best practices** - Each template is built and maintained by Python on Azure industry veterans. Add your code following their design approaches to build on top of a solid foundation.

### Index of templates

The following table lists the available Python web `azd` template monikers to use with the `azd init` command, the technologies implemented in each template, and a link to the GitHub repository if you want to contribute changes.

   # [Django](#tab/django)

   |Template|Web Framework|Database|Hosting Platform|GitHub Repo|
   |----------|----------|----------|----------|----------|
   |azure-django-postgres-flexible-aca|Django|PostgreSQL Flexible Server|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-django-postgres-flexible-aca)|
   |azure-django-postgres-flexible-appservice|Django|PostgreSQL Flexible Server|Azure App Service|[repo](https://github.com/Azure-Samples/azure-django-postgres-flexible-appservice)|
   |azure-django-cosmos-postgres-aca|Django|Cosmos DB (PostgreSQL Adapter)|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-django-cosmos-postgres-aca)|
   |azure-django-cosmos-postgres-appservice|Django|Cosmos DB (PostgreSQL Adapter)|Azure App Service|[repo](https://github.com/Azure-Samples/azure-django-cosmos-postgres-appservice)|
   |azure-django-postgres-addon-aca|Django|Azure Container Apps PostgreSQL Add-on|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-django-postgres-addon-aca)|

   # [FastAPI](#tab/fastapi)

   |Template|Web Framework|Database|Hosting Platform|GitHub Repo|
   |----------|----------|----------|----------|----------|
   |azure-fastapi-postgres-flexible-aca|FastAPI|PostgreSQL Flexible Server|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-fastapi-postgres-flexible-aca)|
   |azure-fastapi-postgres-flexible-appservice|FastAPI|PostgreSQL Flexible Server|Azure App Service|[repo](https://github.com/Azure-Samples/azure-fastapi-postgres-flexible-appservice)|
   |azure-fastapi-cosmos-postgres-aca|FastAPI|Cosmos DB (PostgreSQL Adapter)|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-fastapi-cosmos-postgres-aca)|
   |azure-fastapi-cosmos-postgres-appservice|FastAPI|Cosmos DB (PostgreSQL Adapter)|Azure App Service|[repo](https://github.com/Azure-Samples/azure-fastapi-cosmos-postgres-appservice)|
   |azure-fastapi-postgres-addon-aca|FastAPI|Azure Container Apps PostgreSQL Add-on|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-fastapi-postgres-addon-aca)|

   # [Flask](#tab/flask)

   |Template|Web Framework|Database|Hosting Platform|GitHub Repo|
   |----------|----------|----------|----------|----------|
   |azure-flask-postgres-flexible-aca|Flask|PostgreSQL Flexible Server|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-flask-postgres-flexible-aca)|
   |azure-flask-postgres-flexible-appservice|Flask|PostgreSQL Flexible Server|Azure App Service|[repo](https://github.com/Azure-Samples/azure-flask-postgres-flexible-appservice)|
   |azure-flask-cosmos-postgres-aca|Flask|Cosmos DB (PostgreSQL Adapter)|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-flask-cosmos-postgres-aca)|
   |azure-flask-cosmos-postgres-appservice|Flask|Cosmos DB (PostgreSQL Adapter)|Azure App Service|[repo](https://github.com/Azure-Samples/azure-flask-cosmos-postgres-appservice)|
   |azure-flask-postgres-addon-aca|Flask|Azure Container Apps PostgreSQL Add-on|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-flask-postgres-addon-aca)|
   |azure-flask-cosmos-mongodb-aca|Flask|Cosmos DB (MongoDB)|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-flask-cosmos-mongodb-aca)|
   |azure-flask-cosmos-mongodb-appservice|Flask|Cosmos DB (MongoDB)|Azure App Service|[repo](https://github.com/Azure-Samples/azure-flask-cosmos-mongodb-appservice)|

   ---

### How do the templates work?

You use various `azd` commands to perform tasks defined by an `azd` template. These commands are covered in detail in [Get started using Azure Developer CLI](/azure/developer/azure-developer-cli/get-started).

The `azd` template comprises a GitHub repo containing the application code (Python code utilizing a popular web framework) and the infrastructure-as-code (namely, [Bicep](/azure/azure-resource-manager/bicep/overview)) files to create the Azure resources. It also contains the configuration required to set up a GitHub repo with a CI/CD pipeline.

The quickstart walks you through the steps to use a specific `azd` template. It only requires you to execute five command line instructions to production hosting environment, and local development environment:

1. `azd init --template <template name>` - creates a new project from a template and creates a copy of the application code on your local computer. The command prompts you to provide an environment name (like "myapp") that is used as a prefix int the naming of the deployed resources.
2. `azd auth login` - logs you in to Azure. The command opens a browser window where you can sign in to Azure. After you sign in, the browser window closes and the command completes. The `azd auth login` command is only required the first time you use the Azure Developer CLI (`azd`) per session.
3. `azd up` - provisions the cloud resources and deploys the app to those resources.
4. `azd deploy` - deploys changes to the application source code to resources already provisioned by `azd up`.
5. `azd down` - deletes the Azure resources and the CI/CD pipeline if it was used.

> [!TIP]
> Watch the output for `azd` prompts that you need to answer. For example, after executing the `azd up` command, you may be prompted to select a subscription if you belong to more than one. Furthermore, you will be prompted to select a region. You can change the answers to prompts by editing the environment variables stored in the */.azure/* folder of the template.

Once the template has finished, you have a personal copy of the original template where you can modify every file as needed. At a minimum, you can modify the Python project code so that the project has your design and application logic. You can also [modify the infrastructure-as-code configuration](./quickstart-python-scale-bicep.md) if you need to change the Azure resources.  See the section titled [What can I edit or delete?](#what-can-i-edit-or-delete)

**Optional: Modify and reprovision Azure resources**

If you want to change the Azure resources that are provisioned, you can [edit the appropriate Bicep files](./quickstart-python-scale-bicep.md) in the template and use:

6. `azd provision` - reprovisions Azure resources to the desired state as defined in the Bicep files.

### Set up a CI/CD Pipeline

The Azure Developer CLI (`azd`) provides an easy way to set up a CI/CD pipeline for your new Python web application. Each time you merge commits or pull requests into your main branch, the CI/CD pipeline automatically builds and publishes your changes to your Azure resources.

**Optional : Automatically set up the GitHub Actions CI/CD pipeline**

If you want to implement the GitHub Actions CI/CD pipeline functionality, use the following command:

1. `azd pipeline config` - Allows you to designate a GitHub repository and settings to enable the CI\CD pipeline. Once configured, each time code changes are merged to the *main* branch of the repository, the pipeline deploys the changes to your provisioned Azure services.

### What are my other options?

If you don't want to use `azd` templates, you can deploy your Python app to Azure and create Azure resources in many ways.

You can accomplish many of resource creation and deployment steps using one of the following tools:

- [Azure portal](https://portal.azure.com)
- [Azure CLI](/cli/azure/get-started-with-azure-cli)
- Visual Studio Code with the [Azure Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

Or if you're looking for an end-to-end tutorial that features Python web development frameworks, check out:

- [Deploy a Flask or FastAPI web app on Azure App Service](./tutorial-containerize-simple-web-app-for-app-service.md)
- [Containerized Python web app on Azure with MongoDB](./tutorial-containerize-deploy-python-web-app-azure-01.md)

### Do I have to use Dev Containers?

No. The Python web `azd` templates utilize [Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) by default. Dev Containers provide many benefits, but require some prerequisite knowledge and software. If you don't want to use Dev Containers and prefer to use your local development environment instead, see the *README.md* file in the root directory of the sample app for environment setup instructions.

### What can I edit or delete?

The contents of each `azd` template can vary depending on the type of project and the underlying technology stack employed. The templates listed in this article follow a common convention:

|Folder/Files|Purpose|Description|
|----------|----------|----------|
|/|root directory|The root directory contains many different kinds of files and folders for many different purposes.|
|/.azure|`azd` configuration files|Contains the environment variables that are used by the Azure Developer CLI (`azd`) commands. This folder is created after you run the `azd init` command. You can change the values of the environment variables to customize the app and the Azure resources. For more information, see [Environment-specific .env file](/azure/developer/azure-developer-cli/manage-environment-variables#environment-specific-env-file).|
|/.devcontainer|Dev Container configuration files|[Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) allow you to create a container-based development environment complete with all of the resources you need for software development inside of Visual Studio Code.|
|/.github|GitHub Actions configuration|Contains the configuration settings for the optional GitHub Actions CI/CD pipeline as well as linting and tests. The *azure-dev.yaml* file can be modified or deleted if you don't want to set up the GitHub Actions pipeline using `azd pipeline config` command.|
|/infra|Bicep files|[Bicep](/azure/azure-resource-manager/bicep/overview) allows you to declare the Azure resources you want deployed to your environment. You should only modify the *main.bicep* and *web.bicep* files. See [Quickstart: Scaling services deployed with the `azd` Python web templates using Bicep](./quickstart-python-scale-bicep.md).|
|/src|starter project code files|Includes any templates required by the web framework, static files, .py files for the code logic and data models, a `requirements.txt`, and so on. The specific files depend on the web framework, the data access framework, and so on. You can modify these files to suit your project requirements.|
|/.cruft.json|template generation file|Used internally to generate the `azd` templates. You can safely delete this file.|
|/.gitattributes|git attributes|Provides git with important configuration about handling files and folders. You can modify this file as needed.|
|/.gitignore|git ignore|Tells git to ignore files and folders from being included in the repository. You can modify this file as needed.|
|/azure.yaml|`azd` configuration file|Contains the configuration settings for `azd up` declaring what services and project folders will be deployed. This file MUST NOT be deleted.|
|/*.md|markdown files|There are several markdown files for different purposes. You can safely delete these files.|
|/docker-compose.yml|Docker compose|Creates the container package for the application before it's deployed to Azure.|
|/pyproject.toml|Python build system|Contains the build system requirements of Python projects. You can modify this file to including your preferred tools (for example, to use a linter and unit testing framework).|
|/requirements-dev.in|pip requirements file|Used to create a development environment version of the requirements using `pip install -r` command. You can modify this file to include other packages as needed.|

> [!TIP]
> Use good version control practices so you are able to get back to a point in time when the project was working in case you inexplicably break something.

### Frequently Asked Questions

Q: I got an error when using an `azd` template. What can I do?

A: See [Troubleshoot Azure Developer CLI](/azure/developer/azure-developer-cli/troubleshoot?tabs=Browser). You can also report issues on the respective `azd` template's GitHub repository.

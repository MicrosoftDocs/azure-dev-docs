---
title: Start here for the fastest, easiest way to build and deploy Python web apps on Azure
description: Index of the quickstart articles featuring azd templates to help you get started with a complete project in 15 minutes.
ms.date: 8/18/2023
ms.topic: conceptual
ms.custom: devx-track-python
---

# The fastest, easiest way to get started with Python web development on Azure

Azure Developer CLI (azd) templates are the fastest and easiest way to get started with building and deploying Python web applications to Azure. This article links to a collection of Python web quickstart articles, each article helps you find the azd template tailored to the specific web framework, database and hosting platform you want to use.

## Index of quickstarts and templates

The following table provides links to quickstart articles with steps describing how to use a given azd template.

|Template|Web Framework|Database|Hosting Platform|
|----------|----------|----------|----------|
|[django-cosmos-postgres-aca](#index-of-quickstarts-and-templates)|Django|Cosmos DB|Azure Container Apps|
|[django-postgres-aca](./quickstart-azd-django-postgres-aca.md)|Django|PostgreSQL|Azure Container Apps|
|[django-postgres-flexible-appservice](#index-of-quickstarts-and-templates)|Django|PostgreSQL|Azure App Service|
|[fastapi-cosmos-postgres-aca](#index-of-quickstarts-and-templates)|FastAPI|Cosmos DB|Azure Container Apps|
|[fastapi-postgres-flexible-appservice](#index-of-quickstarts-and-templates)|FastAPI|PostgreSQL|Azure App Service|
|[fastapi-postgres-aca](#index-of-quickstarts-and-templates)|FastAPI|Cosmos DB|Azure Container Apps|
|[flask-cosmos-postgres-aca](#index-of-quickstarts-and-templates)|Flask|Cosmos DB|Azure Container Apps|
|[azd-flask-postgres](#index-of-quickstarts-and-templates)|Flask|PostgreSQL|Azure Container Apps|
|[flask-postgres-flexible-appservice](#index-of-quickstarts-and-templates)|Flask|PostgreSQL|Azure App Service|


### Github - find a home for this stuff

You can check out the GitHub repository here: [https://github.com/Azure-Samples/azure-django-postgres-aca](https://github.com/Azure-Samples/azure-django-postgres-aca)

> [!NOTE]
> In this Quickstart, we use a Dev Container which bundles everything you'll need to get started. Alternatively, [this article](./quickstart-azd-templates.md) walks you through using azd templates and making changes to the project using your existing local Python web development environment without containers. Also, please see the README.md file in the root template directory for environment setup instructions.


- Pull a sample Django web app to your local computer. The sample Django web app communicates with the Postgres database using SQLAlchemy.
- Create instances of Azure Container Apps and Azure PostgreSQL, and configure security, environment variable values, etc.
- Deploy the web app from your local computer to Azure Container Apps and Azure PostgreSQL.


   > [!NOTE]
   > If you do not want to use Dev Containers, please see the README.md file in the root directory for environment setup instructions. Also, [this article](./quickstart-azd-templates.md) walks you through setting up your environment and making changes to the project using your existing local Python web development environment without containers.

### What is this?

Each link in the table navigates to a quickstart tutorial that guides you on how to use a Python web azd template. When you run the template, you'll:

- **Create a starter application** - Specifically, a website for a fictitious company named Relecloud. The project code features all of the best practices for the given Python frameworks and packages that are required for that particular stack of technologies. The template is intended to be a starting point for your application. You add or remove application logic and Azure resources as needed.
- **Provision Azure resources** - The template provisions Azure resources for hosting your web app and database using Bicep, a popular infrastructure-as-code tool. Again, you modify the Bicep templates if you need to add more Azure services.
- **Deploy the starter application to the newly provisioned Azure resources** - The starter application is automatically deployed so you can see it all working in minutes and decide what you want to modify.
- **Optional: Set up a GitHub repository and a CI/CD pipeline** - If you like, the template contains the logic to set up a GitHub repository for you including a GitHub Actions or an Azure Pipelines CI/CD pipeline. Within minutes, you're able to make changes to the web project code. When you merge those changes to the *main* branch of your GitHub repo, the CI/CD pipeline publishes them to your new Azure hosting environment.

### Why would I want to use this?

Using the azd templates provides several benefits:

- **Fastest possible start** - With your local development environment and hosting environment setups out of the way, you can focus on building your application within minutes.
- **Easiest possible start** - Execute just a few easy-to-remember command line instructions to build out an entire development, hosting and deployment environment. The workflow is easy to use and easy to remember.
- **Build on Best practices** - Each template is built and maintained by Python on Azure industry veterans. Add your code following their design approaches to build on top of a solid foundation.

### How does it work?

You use various `azd` commands to perform tasks defined by an azd template. These commands are covered in detail in [Get started using Azure Developer CLI](/azure/developer/azure-developer-cli/get-started).

The azd template comprises a GitHub repo containing the application code (Python code utilizing a popular web framework) and the infrastructure-as-code (namely, [Bicep](/azure/azure-resource-manager/bicep/overview)) files to create the Azure resources. It also contains the configuration required to set up a GitHub repo with a CI/CD pipeline.

Each quickstart walks you through the steps to use a specific azd template. But in general, it only requires you to execute five command line instructions to production hosting environment, and local development environment:

1. `azd init --template <template-url-goes-here>` - creates a new project from a template and creates a copy of the application code on your local computer. The command prompts you to provide an environment name (like "my-app") that is used as a prefix int the naming of the deployed resources.
2. `azd auth login` - logs you in to Azure. The command opens a browser window where you can sign in to Azure. After you sign in, the browser window closes and the command completes. The `azd auth login` command is only required the first time you use the Azure Developer CLI (azd) per session.
3. `azd up` - provisions the cloud resources and deploys the app to those resources.
4. `azd deploy` - deploys changes to the application source code to resources already provisioned by `azd up`.
5. `azd down` - deletes the Azure resources and the CI/CD pipeline if it was used.

> [!TIP]
> Watch the output for `azd` prompts that you need to answer. For example, after executing the `azd up` command, you may be prompted to select a subscription if you belong to more than one. Furthermore, you will be prompted to select a region. You can change the answers to prompts by editing the environment variables stored in the */.azure/* folder of the template.

Once the template has finished, you have a personal copy of the original template where you can modify every file as needed. At a minimum, you modify the Python project code so that the project has your design and application logic. You can also modify the infrastructure-as-code configuration if you need to change the Azure resources.  See the section titled [What can I edit or delete?](#what-can-i-edit-or-delete)

**Optional: Modify and reprovision Azure resources**

If you want to change the Azure resources that are provisioned, you can edit the appropriate Bicep files in the template and use:

6. `azd provision` - reprovisions Azure resources to the desired state as defined in the Bicep files.

**Optional : Automatically set up the GitHub Actions CI/CD pipeline**

If you want to implement the GitHub Actions CI/CD pipeline functionality, use the following command:

7. `azd pipeline config` - Allows you to designate a GitHub repository and settings to enable the CI\CD pipeline. Once configured, each time code changes are merged to the *main* branch of the repository, the pipeline deploys the changes to your provisioned Azure services.

**Optional : Automatically set up the Azure Pipelines CI/CD pipeline**

If you want to implement the Azure Pipelines functionality, use the following command:

8. `azd pipeline config --provider azdo` - Allows you to designate a GitHub repository and settings to enable the Azure Pipelines CI\CD pipeline. Once configured, each time code changes are merged to the *main* branch of the repository, the pipeline deploys the changes to your provisioned Azure services.


### What are my other options?

If you don't want to use azd templates, you can deploy your Python app to Azure and create Azure resources in many ways. For example, you can use the [Azure CLI](/azure/developer/python/azure-sdk-overview). For an example of how to deploy a Flask app to Azure using Azure CLI commands to create the Azure resources and deploy the app, see [Create and deploy a Flask Python web app to Azure with managed identity](./tutorial-python-managed-identity-cli.md).

You can also accomplish many of the deployment and resource creation steps with the [Azure portal](https://portal.azure.com) and Visual Studio Code with the [Azure Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack).


### What can I edit or delete?

The contents of each azd template can vary depending on the type of project and the underlying technology stack employed. The templates listed in this article follow a common convention:

|Folder/Files|Purpose|Description|
|----------|----------|----------|
|/|root directory|The root directory contains many different kinds of files and folders for many different purposes.|
|/.azure|azd configuration files|Contains the environment variables that are used by the Azure Developer CLI (azd) commands. This folder is created after you run the `azd init` command. You can change the values of the environment variables to customize the app and the Azure resources. For more information, see [Environment-specific .env file](/azure/developer/azure-developer-cli/manage-environment-variables#environment-specific-env-file).|
|/.devcontainer|Dev Container configuration files|[Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) allow you to create a container-based development environment complete with all of the resources you need for software development inside of Visual Studio Code.|
|/.github|GitHub Actions configuration|Contains the configuration settings for the optional GitHub Actions CI/CD pipeline. This file can be modified or deleted if you don't want to set up the GitHub Actions pipeline using `azd pipeline config` command.|
|/infra|Bicep files|[Bicep](/azure/azure-resource-manager/bicep/overview) allows you to declare the Azure resources you want deployed to your environment. You should only modify the *main.bicep* and *web.bicep* files.|
|/src|starter project code files|Includes any templates required by the web framework, static files, .py files for the code logic and data models, a `requirements.txt`, and so on. The specific files depend on the web framework, the data access framework, and so on. You can modify these files to suit your project requirements.|
|/.cruft.json|template generation file|Used internally to generate the azd templates. You can safely delete this file.|
|/.gitattributes|git attributes|Provides git with important configuration about handling files and folders. You can modify this file as needed.|
|/.gitignore|git ignore|Tells git to ignore files and folders from being included in the repository. You can modify this file as needed.|
|/azure.yaml|Azure Pipelines configuration|Contains the configuration settings for the optional Azure Pipelines CI/CD pipeline. This file can be modified or deleted if you don't want to set up Azure Pipelines using `azd pipeline config --provider azdo` command.|
|/*.md|markdown files|There are several markdown files for different purposes. You can safely delete these files.|
|/docker-compose.yml|Docker compose|Creates the container package for the application before it's deployed to Azure.|
|/pyproject.toml|Python build system|Contains the build system requirements of Python projects. You can modify this file to including your preferred tools (for example, to use a linter and unit testing framework).|
|/requirements-dev.in|pip-tools requirements file|Used to create a development environment version of the requirements using various pip-tools commands. You can modify this file to include additional packages as needed.|

> [!TIP]
> Use good version control practices so you are able to get back to a point in time when the project was working in case you inexplicably break something.

### Frequently Asked Questions

Q: I got an error when using an azd template. What can I do?

A: See [Troubleshoot Azure Developer CLI](/azure/developer/azure-developer-cli/troubleshoot?tabs=Browser). You can also report issues on the respective azd template's GitHub repository.
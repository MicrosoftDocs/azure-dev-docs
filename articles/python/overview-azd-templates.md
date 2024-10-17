---
title: Overview of the Python web azd templates
description: Explore the Python web templates for the Azure Developer CLI (azd), including tasks completed by the templates, 
ms.date: 10/16/2024
ms.topic: concept-article
ms.custom: devx-track-python, devx-track-extended-azdevcli

#Customer intent: As a Python web developer, I want to explore how Python web azd templates can me help quickly build and deploy Python web applications to Azure.
---

# Overview of the Python web azd templates

Python web Azure Developer CLI (`azd`) templates are the fastest and easiest way to build and deploy Python web applications to Azure. This article provides contextual background information as you begin to work with the templates.

The best approach to get started is to [follow the quickstart](quickstart-python-web-azd-templates.md) to create your first Python web app and deploy it to Azure in minutes with `azd` templates. If you prefer not to set up a local development environment, you can follow the [quickstart by using GitHub Codespaces](quickstart-python-web-azd-codespaces.md) instead.

## What are the Python azd templates?

<a name="why-would-i-want-to-use-this"><a/>

The Python web `azd` templates are commonly used by experienced Python web developers to build new Python web apps that target Azure deployment. The `azd` templates offer several benefits:

- **Easiest possible start**: Quickly build an entire local development/hosting environment and deployment environment by running just a few command-line instructions. The workflow is simple to use and the steps are easy to remember.
- **Fastest possible start**: After you set up your development and hosting environments, focus on building your web app within minutes. 
- **Build on Best practices**: Follow the template design approach and add your code by building on the solid foundation. The templates are created and maintained by industry veterans with extensive development experience in Python on Azure.

When you run a Python web `azd` template, you quickly complete several tasks:

- **Create a starter application**: You build a website for a fictitious company named Relecloud. The project code features many best practices for the Python frameworks and packages required for that particular stack of technologies. The template is intended to be a starting point for your application. You add or remove application logic and Azure resources as needed.
- **Provision Azure resources**: You provision Azure resources for hosting your web app and database by using [Bicep](/azure/azure-resource-manager/bicep/overview), a popular infrastructure-as-code tool. Similar to the previous task, you can [modify the Bicep templates](quickstart-python-scale-bicep.md) to add more Azure services, as needed.
- **Deploy the starter application to the newly provisioned Azure resources**: You automatically deploy your starter application. This approach lets you quickly review the running program and decide what you want to modify.
- **(Optional) Set up a GitHub repository and a CI/CD pipeline**: As an option, you can set up a GitHub repository, including a GitHub Actions [continuous integration/continuous delivery (CI/CD) pipeline](/azure-devops-docs/pipelines/apps/cd/azure/cicd-data-overview). This approach lets you quickly make changes to the web project code. When you merge those changes to the *main* branch of your GitHub repo, the CI/CD pipeline publishes them to your new Azure hosting environment.

## How can I access the templates?

Many `azd` templates are available on the [Awesome Azure Developer CLI Templates gallery](https://azure.github.io/awesome-azd/). This collection offers unique Python web `azd` templates that provide a sample web app with feature parity across many different popular combinations of Azure resources and Python web frameworks.

The following tables list the Python web `azd` template monikers that are available for use with the `azd init` command. The tables identify the technologies implemented in each template and provide a link to the corresponding GitHub repository, where you can contribute changes.

   # [Django](#tab/django)

   The following `azd` templates are available for the [Django web framework](https://www.djangoproject.com/).

   | Template | Database | Hosting platform | GitHub repository |
   | --- | --- | --- | --- |
   | azure-django-postgres-flexible-aca        | [Azure Database for PostgreSQL Flexible Server](/azure-databases-docs/postgresql/flexible-server/overview) | [Azure Container Apps](/azure/container-apps/overview) | [https://github.com/Azure-Samples/azure-django-postgres-flexible-aca](https://github.com/Azure-Samples/azure-django-postgres-flexible-aca)|
   | azure-django-postgres-flexible-appservice | Azure Database for PostgreSQL Flexible Server | [Azure App Service](/azure/app-service/overview) | [https://github.com/Azure-Samples/azure-django-postgres-flexible-appservice](https://github.com/Azure-Samples/azure-django-postgres-flexible-appservice)  |
   | azure-django-cosmos-postgres-aca          | [Azure Cosmos DB for Azure Database for PostgreSQL](/azure-databases-docs/cosmos-db/postgresql/introduction) | Azure Container Apps | [https://github.com/Azure-Samples/azure-django-cosmos-postgres-aca](https://github.com/Azure-Samples/azure-django-cosmos-postgres-aca)|
   | azure-django-cosmos-postgres-appservice   | Azure Cosmos DB for Azure Database for PostgreSQL | Azure App Service | [https://github.com/Azure-Samples/azure-django-cosmos-postgres-appservice](https://github.com/Azure-Samples/azure-django-cosmos-postgres-appservice)|
   | azure-django-postgres-addon-aca           | [Azure Container Apps with Azure Database for PostgreSQL](tutorial-deploy-python-web-app-azure-container-apps-01.md) | Azure Container Apps | [https://github.com/Azure-Samples/azure-django-postgres-addon-aca](https://github.com/Azure-Samples/azure-django-postgres-addon-aca)|

   # [FastAPI](#tab/fastapi)

   The following `azd` templates are available for the [FastAPI web framework](https://fastapi.tiangolo.com/).

   | Template | Database | Hosting platform | GitHub repository |
   | --- | --- | --- | --- |
   | azure-fastapi-postgres-flexible-aca        | [Azure Database for PostgreSQL Flexible Server](/azure-databases-docs/postgresql/flexible-server/overview) | [Azure Container Apps](/azure/container-apps/overview) | [https://github.com/Azure-Samples/azure-fastapi-postgres-flexible-aca](https://github.com/Azure-Samples/azure-fastapi-postgres-flexible-aca)|
   | azure-fastapi-postgres-flexible-appservice | Azure Database for PostgreSQL Flexible Server | [Azure App Service](/azure/app-service/overview) | [https://github.com/Azure-Samples/azure-fastapi-postgres-flexible-appservice](https://github.com/Azure-Samples/azure-fastapi-postgres-flexible-appservice)  |
   | azure-fastapi-cosmos-postgres-aca          | [Azure Cosmos DB for Azure Database for PostgreSQL](/azure-databases-docs/cosmos-db/postgresql/introduction) | Azure Container Apps | [https://github.com/Azure-Samples/azure-fastapi-cosmos-postgres-aca](https://github.com/Azure-Samples/azure-fastapi-cosmos-postgres-aca)|
   | azure-fastapi-cosmos-postgres-appservice   | Azure Cosmos DB for Azure Database for PostgreSQL | Azure App Service | [https://github.com/Azure-Samples/azure-fastapi-cosmos-postgres-appservice](https://github.com/Azure-Samples/azure-fastapi-cosmos-postgres-appservice)|
   | azure-fastapi-postgres-addon-aca           | [Azure Container Apps with Azure Database for PostgreSQL](tutorial-deploy-python-web-app-azure-container-apps-01.md) | Azure Container Apps | [https://github.com/Azure-Samples/azure-fastapi-postgres-addon-aca](https://github.com/Azure-Samples/azure-fastapi-postgres-addon-aca)|

   # [Flask](#tab/flask)

   The following `azd` templates are available for the [Flask web framework](https://palletsprojects.com/projects/flask/).

   | Template | Database | Hosting platform | GitHub repository |
   | --- | --- | --- | --- |
   | azure-flask-postgres-flexible-aca        | [Azure Database for PostgreSQL Flexible Server](/azure-databases-docs/postgresql/flexible-server/overview) | [Azure Container Apps](/azure/container-apps/overview) | [https://github.com/Azure-Samples/azure-flask-postgres-flexible-aca](https://github.com/Azure-Samples/azure-flask-postgres-flexible-aca)|
   | azure-flask-postgres-flexible-appservice | Azure Database for PostgreSQL Flexible Server | [Azure App Service](/azure/app-service/overview) | [https://github.com/Azure-Samples/azure-flask-postgres-flexible-appservice](https://github.com/Azure-Samples/azure-flask-postgres-flexible-appservice)  |
   | azure-flask-cosmos-postgres-aca          | [Azure Cosmos DB for Azure Database for PostgreSQL](/azure-databases-docs/cosmos-db/postgresql/introduction) | Azure Container Apps | [https://github.com/Azure-Samples/azure-flask-cosmos-postgres-aca](https://github.com/Azure-Samples/azure-flask-cosmos-postgres-aca)|
   | azure-flask-cosmos-postgres-appservice   | Azure Cosmos DB for Azure Database for PostgreSQL | Azure App Service | [https://github.com/Azure-Samples/azure-flask-cosmos-postgres-appservice](https://github.com/Azure-Samples/azure-flask-cosmos-postgres-appservice)|
   | azure-flask-postgres-addon-aca           | [Azure Container Apps with Azure Database for PostgreSQL](tutorial-deploy-python-web-app-azure-container-apps-01.md) | Azure Container Apps | [https://github.com/Azure-Samples/azure-flask-postgres-addon-aca](https://github.com/Azure-Samples/azure-flask-postgres-addon-aca)|
   | azure-flask-cosmos-mongodb-aca           | [Azure Cosmos DB for MongoDB](/azure-databases-docs/cosmos-db/mongodb/introduction) | Azure Container Apps | [https://github.com/Azure-Samples/azure-flask-cosmos-mongodb-aca](https://github.com/Azure-Samples/azure-flask-cosmos-mongodb-aca) |
   | azure-flask-cosmos-mongodb-appservice    | Azure Cosmos DB for MongoDB | Azure App Service | [https://github.com/Azure-Samples/azure-flask-cosmos-mongodb-appservice](https://github.com/Azure-Samples/azure-flask-cosmos-mongodb-appservice) |

   ---

## How should I use the templates?

<a name="how-do-the-templates-work"><a/>

Each `azd` template comprises a GitHub repository that contains the application code (Python code that utilizes a popular web framework) and the infrastructure-as-code (namely, [Bicep](/azure/azure-resource-manager/bicep/overview)) files to create the Azure resources. The template also contains the configuration required to set up a GitHub repository with a CI/CD pipeline.

To perform the tasks defined by an `azd` web template, you use various Python `azd` commands. For detailed descriptions of these commands, see [Quickstart: Deploy an Azure Developer CLI template](/azure/developer/azure-developer-cli/get-started). The quickstart walks you through the steps to use a specific `azd` template. You only need to run five essential command-line instructions to the production-hosting environment and the local-development environment.

The following table summarizes the five essential commands:

| Command | Task description | 
| --- | --- |
| `azd init --template <template name>` | Create a new project from a template and create a copy of the application code on your local computer. The command prompts you to provide an environment name (like "myapp") that's used as a prefix in the naming of the deployed resources. |
| `azd auth login` | Sign in to Azure. The command opens a browser window where you can sign in to Azure. After you sign in, the browser window closes and the command completes. The `azd auth login` command is required only the first time you use the Azure Developer CLI (`azd`) per session. |
| `azd up`         | Provision the cloud resources and deploy the app to those resources. |
| `azd deploy`     | Deploy changes to the application source code to resources already provisioned by the `azd up` command. |
| `azd down`       | Delete the Azure resources and the CI/CD pipeline, if it was used. |

> [!TIP]
> When you work with the `azd` commands, watch for prompts to enter more information. After you execute the `azd up` command, you might be prompted to select a subscription, if you have more than one. You might also be prompted to specify your region. You can change the answers to prompts by editing the environment variables stored in the */.azure/* folder of the template.

After you complete the essential template tasks, you have a personal copy of the original template where you can modify any file, as needed. At a minimum, you can modify the Python project code so the project uses your design and application logic. You can also [modify the infrastructure-as-code configuration](quickstart-python-scale-bicep.md) if you need to change the Azure resources. For more information, see the [What can I edit or delete](#what-can-i-edit-or-delete) section later in this article.

### Optional azd template tasks

In addition to the five essential commands, there are optional tasks you can complete with the `azd` templates.

#### Reprovision and modify Azure resources

After you provision Azure resources with an `azd` template, you can modify and reprovision a resource.

- To modify a provisioned resource, you [edit the appropriate Bicep files](quickstart-python-scale-bicep.md) in the template.
- To initiate the reprovision task, use the `azd provision` command.

#### Set up CI/CD pipeline

The Azure Developer CLI (`azd`) provides an easy way to set up a CI/CD pipeline for your new Python web app. When you merge commits or pull requests into your main branch, the pipeline automatically builds and publishes the changes to your Azure resources.

- To set up the CI/CD pipeline, you designate the GitHub repository and desired settings to enable the pipeline.
- To create the pipeline, use the `azd pipeline config` command. 

After you configure the pipeline, each time code changes are merged to the *main* branch of the repository, the pipeline deploys the changes to your provisioned Azure services.

## Alternatives to the azd templates

<a name="what-are-my-other-options"></a>

If you prefer to not use the Python web `azd` templates, there are alternate methods for deploying Python web apps to Azure and provisioning Azure resources.

You can create many resources and complete the deployment steps by using several tools:

- [Azure portal](https://portal.azure.com)
- The [Azure CLI](/cli/azure/get-started-with-azure-cli)
- Visual Studio Code with the [Azure Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

You can also follow an end-to-end tutorial that features Python web development frameworks:

- [Deploy a Flask or FastAPI web app on Azure App Service](tutorial-containerize-simple-web-app-for-app-service.md)
- [Containerized Python web app on Azure with MongoDB](tutorial-containerize-deploy-python-web-app-azure-01.md)

## Frequently asked questions

The following sections summarize answers to frequently asked questions about working with the Python web `azd` templates.

### Do I have to use Dev Containers?

No. The Python web `azd` templates use [Visual Studio Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) by default. Dev Containers provide many benefits, but they require some prerequisite knowledge and software. If you prefer to not use Dev Containers, and instead use your local development environment, see the *README.md* file in the root directory of the sample app for environment setup instructions.

### What can I edit or delete?

The contents of each Python web `azd` template can vary depending on the type of project and the underlying technology stack employed. The templates identified in this article follow a common folder and file convention, as described in the following table.

| Folder/file(s) | Purpose | Description |
| --- | --- | --- |
| **/**                    | Root directory | The root folder for each template contains many different kinds of files and folders for different purposes. |
| **/.azure**              | `azd` configuration files | The *.azure* folder is created after you run the `azd init` command. The folder stores configuration files for the environment variables used by the `azd` commands. You can change the values of the environment variables to customize the app and the Azure resources. For more information, see [Environment-specific .env file](/azure/developer/azure-developer-cli/manage-environment-variables#environment-specific-env-file).|
| **/.devcontainer**       | Dev Container configuration files | Dev Containers allow you to create a container-based development environment complete with all of the resources you need for software development inside of Visual Studio Code. The *.devcontainer* folder is created after Visual Studio Code generates a Dev Container configuration file in response to a template command. |
| **/.github**             | GitHub Actions configuration files | This folder contains configuration settings for the optional GitHub Actions CI/CD pipeline, linting, and tests. If you don't want to set up the GitHub Actions pipeline by using `azd pipeline config` command, you can modify or deleted the *azure-dev.yaml* file. |
| **/infra**               | Bicep files | The *infra* folder holds the Bicep configuration files. Bicep allows you to declare the Azure resources you want deployed to your environment. You should only modify the *main.bicep* and *web.bicep* files. For more information, see [Quickstart: Scaling services deployed with the azd Python web templates by using Bicep](quickstart-python-scale-bicep.md). |
| **/src**                 | Starter project code files | The *src* folder contains various code files required to prepare the starter project. Examples of the files include templates required by the web framework, static files, Python (.py) files for the code logic and data models, a *requirements.txt* file, and more. The specific files depend on the web framework, the data access framework, and so on. You can modify these files to suit your project requirements. |
| **/.cruft.json**         | Template generation file | The *.cruft* JSON file is used internally to generate the Python web `azd` templates. You can safely delete this file, as needed. |
| **/.gitattributes**      | File with attribute settings for git | This file provides git with important configuration settings for handling files and folders. You can modify this file, as needed. |
| **/.gitignore**          | File with ignored items for git | The *.gitignore* file informs git about the files and folders to exclude (ignore) when writing to the GitHub repository for the template. You can modify this file, as needed. |
| **/azure.yaml**          | `azd up` configuration file | This configuration file contains the configuration settings for the `azd up` command. It specifies the services and project folders to deploy. **Important**: This file must not be deleted. |
| **/*.md**                | Markdown format files | A template can include various Markdown (.md) format files for different purposes. You can safely delete Markdown files. |
| **/docker-compose.yml**  | Docker compose settings | This YML file creates the container package for the Python web application before the app deploys to Azure. |
| **/pyproject.toml**      | Python build settings file | The TOML file contains the build system requirements of Python projects. You can modify this file to identify your tool preferences, such as a specific linter or unit testing framework. |
| **/requirements-dev.in** | pip requirements file | This file is used to create a development environment version of the requirements by using the `pip install -r` command. You can modify this file to include other packages, as needed. |

> [!TIP]
> As you modify template files for your program, be sure to practice good version control. This approach can help you restore your repository to a previous working version, if recent changes cause program issues or failure.

### How can I handle errors from the template?

If you receive an error when you use an `azd` template, review the options described in the [Troubleshoot Azure Developer CLI](/azure/developer/azure-developer-cli/troubleshoot) article. You can also report issues on the GitHub repository associated with the `azd` template.

## Related content

- [Create and deploy Python web apps to Azure with azd templates](quickstart-python-web-azd-templates.md)
- [Create and deploy Python web apps from GitHub Codespaces to Azure with azd templates](quickstart-python-web-azd-codespaces.md)

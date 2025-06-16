---
title: Azure Developer CLI templates
description: Learn about what Azure Developer CLI templates are, how to work with them, and how to get started using them with your apps.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 09/13/2024
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
ms.service: azure-dev-cli
---

# Azure Developer CLI templates overview

Azure Developer CLI (`azd`) templates are regular code repositories that include sample application code, as well as `azd` configuration and infrastructure files. `azd` templates enable you to provision Azure resources, deploy your application, configure CI/CD pipelines, and more. You can either create your own templates, or get started using an existing template from a template repository such as [Awesome AZD](https://azure.github.io/awesome-azd/). In this article, you'll learn about the following concepts:

- How `azd` templates enable you to provision and deploy app resources
- How `azd` templates are structured
- How to decide whether to use an existing template or create one
- Explore existing `azd` starter templates

> [!VIDEO https://www.youtube.com/embed/KDgR-TXtOgM?si=rLzhrqC4M0o5d0BE]

## Why use Azure Developer CLI templates?

Developers often face many time consuming and challenging tasks when building properly architected and configured environment aware apps for the cloud. Teams must account for many different concerns in these environments, such as creating resources, applying configurations, setting up monitoring and logging, building CI/CD pipelines, and other tasks. `azd` templates reduce and streamline these responsibilities to help the developer on their journey from local development to a successfully deployed app on Azure.

For example, suppose you work at a company that operates a ticket management and customer communication platform, which requires the following Azure resources:

- Two App Service instances and an App Service Plan to host a front-end web app and back-end API
- A Key Vault instance to store secure app secrets
- A Cosmos DB database to permanently store app data
- Azure Monitor resources such as Application Insights dashboards
- A Service Bus to manage scalable messaging
- CI/CD pipelines to ensure changes can be reliably deployed through an automated, repeatable process.

Rather than starting from the ground up, with `azd` you can leverage existing architecture templates to provision and deploy most of the resources for you. The development team can then focus on building the app and making smaller adjustments to the template architecture.

## How Azure Developer CLI templates work

Azure Developer CLI templates are designed to work with `azd` commands such as `azd init` and `azd up`. The templates include configuration and infrastructure-as-code (IaC) files that are used by the commands to perform tasks such as provisioning Azure resources and deploy the app code to them.

For example, a typical `azd` workflow using an existing template includes the following steps:

1. Run the `azd init` command with the `--template` parameter to clone an existing template down from GitHub.

    ```azdeveloper
    azd init --template todo-nodejs-mongo
    ```

2. Run the `azd auth login` command to authenticate to your Azure subscription.

    ```azdeveloper
    azd auth login
    ```

3. Run the `azd up` command to provision and deploy the template resources to Azure. The `azd up` command leverages the configuration and infrastructure-as-code (IaC) files in your template to provision Azure resources and deploy your application to those resources.

    ```azdeveloper
    azd up
    ```

4. Once your environment is set up in Azure, you can locally modify the application features or Azure resource templates and then run `azd up` again to provision your changes.

[!INCLUDE [azd-template-structure](includes/azd-template-structure.md)]

## Start with an existing template or create your own

There are two main approaches to working with `azd` templates:

- **Start with an existing `azd` template.**
  - This is a good choice if you're just getting started with `azd` or if you're looking for a template to build off of for a new app with a similar architecture and frameworks.
- **Convert an existing project to an `azd` template.**
  - This is a good choice when you already have an existing app but you want to make it compatible with `azd` capabilities.

The following sections provide more information on these two options.

### Start with an existing template

A broad selection of `azd` templates is available on the [awesome-azd](https://azure.github.io/awesome-azd/) template gallery. These templates provide infrastructure and application code for various development scenarios, language frameworks, and Azure services. If you find a template that aligns with your local application stack or desired architecture, you can extend and replace the template code with your own

For example, the following `azd` templates provide starting points for common app architectures and frameworks:

### [C#](#tab/csharp)

| Template      | App host | Tech stack |
| ----------- | ----------| ----------- |
| [React Web App with C# API and MongoDB on Azure](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB for NoSQL](/learn/modules/intro-to-azure-cosmos-db-core-api/), Bicep |
| [React Web App with C# API and SQL Database on Azure](https://github.com/azure-samples/todo-csharp-sql) | [Azure App Service](/azure/app-service/) | [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview), Bicep |
| [Static React Web App + Functions with C# API and SQL Database on Azure](https://github.com/Azure-Samples/todo-csharp-sql-swa-func) | [Azure Static Web Apps](/azure/static-web-apps/), [Azure Functions](/azure/azure-functions/) | [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview), Bicep |

### [Java](#tab/java)

| Template      | App host | Tech stack     | 
| ----------- | ----------| ----------- | 
| [React Web App with Java API and MongoDB on Azure](https://github.com/Azure-Samples/todo-java-mongo) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB API for Mongo](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep | 
| [Containerized React Web App with Java API and MongoDB on Azure](https://github.com/Azure-Samples/todo-java-mongo-aca) | [Azure Container Apps](/azure/container-apps/overview) | [Azure Cosmos DB API for Mongo](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep | 

### [Node.js](#tab/nodejs)

| Template      | App host | Tech stack |
| ----------- | ----------| ----------- |
| [React Web App with Node.js API and MongoDB on Azure](https://github.com/azure-samples/todo-nodejs-mongo) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep |  
| [React Web App with Node.js API and MongoDB (Terraform) on Azure](https://github.com/azure-samples/todo-nodejs-mongo-terraform) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Terraform |  
| [Containerized React Web App with Node.js API and MongoDB on Azure](https://github.com/azure-samples/todo-nodejs-mongo-aca) | [Azure Container Apps](/azure/container-apps/overview) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep |
| [Static React Web App + Functions with Node.js API and MongoDB on Azure](https://github.com/azure-samples/todo-nodejs-mongo-swa-func) | [Azure Static Web Apps](/azure/static-web-apps/), [Azure Functions](/azure/azure-functions/) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep |
| [Kubernetes React Web App with Node.js API and MongoDB on Azure](https://github.com/Azure-Samples/todo-nodejs-mongo-aks) |  [Azure Kubernetes Service](/azure/aks/) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep

### [Python](#tab/python)

| Template      | App host | Tech stack |
| ----------- | ----------| ----------- |
| [React Web App with Python API and MongoDB on Azure](https://github.com/azure-samples/todo-python-mongo) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep  |  
| [React Web App with Python API and MongoDB (Terraform) on Azure](https://github.com/Azure-Samples/todo-python-mongo-terraform) | [Azure App Service](/azure/app-service/) | [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Terraform  |  
| [Containerized React Web App with Python API and MongoDB on Azure](https://github.com/azure-samples/todo-python-mongo-aca) | [Azure Container Apps](/azure/container-apps/overview) |  [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep |  
| [Static React Web App + Functions with Python API and MongoDB on Azure](https://github.com/azure-samples/todo-python-mongo-swa-func) | [Azure Static Web Apps](/azure/static-web-apps/), [Azure Functions](/azure/azure-functions/) |  [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), Bicep|

### [Starter Templates (IaC only)](#tab/starter-IaC)
| Template      | App host | Tech stack |
| ----------- | ----------| ----------- |
| [Bicep Starter](https://github.com/Azure-Samples/azd-starter-bicep) | - | Bicep, [dev container](https://containers.dev) configuration file, CI/CD pipeline definitions to test your app against your applications resources on Azure |  
| [Terraform Starter](https://github.com/Azure-Samples/azd-starter-terraform) | - | Terraform [dev container](https://containers.dev) configuration file, CI/CD pipeline definitions to test your app against your applications resources on Azure |  

---

### Create a new `azd` template for your app

You can also convert an existing app into an `azd` template to enhance the repository with provisioning and deployment capabilities. This approach allows for the most control and produces a reusable solution for future development work on the app. The high level steps to create your own template are as follows:

- Initialize the project template with `azd init`.
- Create the Bicep or Terraform infrastructure as code files in the `infra` folder.
- Update the `azure.yaml` file to tie the app services together with the Azure resources.
- Provision & deploy with `azd up`.

The following resources provide more information about creating your own templates:

- [Build your first Azure Developer CLI template](/training/modules/build-first-azd-template/)
- [Make your project compatible with `azd` guide](/azure/developer/azure-developer-cli/make-azd-compatible)

## Guidelines for using `azd` templates

Please note that each template that you use with Azure Developer CLI is licensed by its respective owner (which may or may not be Microsoft) under the agreement which accompanies the template. It is your responsibility to determine what license applies to any template you choose to use.

Microsoft is not responsible for any non-Microsoft templates and does not screen these templates for security, privacy, compatibility, or performance issues. The templates you use with Azure Developer CLI, including those provided from Microsoft, are not supported by any Microsoft support program or service. Any Microsoft-provided templates are provided AS IS without warranty of any kind.

## Next steps

> [!div class="nextstepaction"]
> [Select and deploy a template](./get-started.md)

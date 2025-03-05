---
title: Configure template sources
description: Learn how to configure the Azure Developer CLI to use different template sources
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/13/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Configure and consume template sources

The Azure Developer CLI is designed around a powerful template system that streamlines deploying and provisioning Azure resources. While developing with `azd`, you have the option to either build your own template, or choose from a configurable list of existing templates. In this article, you learn how to work with template lists and configure your local `azd` installation to support different template list sources.

## Understand template sources

An `azd` template source points to a JSON configuration file that describes a list of available templates and their essential metadata, such as the name, description, and location of the template source code (usually a GitHub repo). When you enable a template source, the templates it defines are made available to `azd` through other commands. For example, the template source JSON snippet below defines two templates:

```json
[
  {
    "name": "Starter - Bicep",
    "description": "A starter template with Bicep as infrastructure provider",
    "repositoryPath": "azd-starter-bicep",
    "tags": ["bicep"]
  },
  {
    "name": "Starter - Terraform",
    "description": "A starter template with Terraform as infrastructure provider",
    "repositoryPath": "azd-starter-terraform",
    "tags": ["terraform"]
  }
]
```

Each template entry in the JSON configuration file includes the following properties:

- **name**: The display name of the template.
- **description**: A brief summary of what the template does.
- **repositoryPath**: The path to the template's source code, which can be:
  - A fully qualified URI to a Git repository, like "https://dev.azure.com/org/project/_git/repo".
  - "{owner}/{repo}" for GitHub repositories.
  - "{repo}" for GitHub repositories under the Azure-Samples organization.
- **tags**: Keywords that help users filter templates with `azd init --filter <tag>` and `azd template list --filter <tag>`.

For a full example, see [this JSON file](https://github.com/Azure/azure-dev/blob/main/cli/azd/resources/templates.json), which is the default template source included in `azd`.

`azd` allows you to enable multiple template sources at a time. The following template source options are currently available to choose from:

- **awesome-azd** - A list of the templates from the [Awesome AZD gallery](https://azure.github.io/awesome-azd) that is enabled by default.
- **default** - A small set of curated templates to demonstrate different tech stacks.
- **file** -  A local/network path that points to a template source JSON configuration file.
- **url** - An HTTP(S) addressable path that points to a template source JSON configuration file.
- **gh** - Points to a GitHub repository.
- **ade** - Points to an Azure Deployment Environment template list. [Learn more about Azure Developer CLI support for Azure Deployment Environments](/azure/developer/azure-developer-cli/ade-integration).

## Work with template sources

`azd` provides several commands to configure template sources.

Use the `azd template source list` command to list all currently configured template sources:

```azdeveloper
azd template source list
```

Example output with two configured template sources:

```output
Key          Name         Type         Location

awesome-azd  Awesome AZD  awesome-azd  https://aka.ms/awesome-azd/templates.json
default      Default      resource
```

Use the `azd template source add` command to add a new template source. This command accepts the following parameters:

- **key**: The technical name of the template source.
- **--type, -t**: The template source type - valid values are **file**, **url** and **gh** for GitHub.
- **--location, -l**: The template source location, which should be a local network or HTTP(S) web URI.
- **--name, -n**: The template source display name (optional, uses **key** if omitted).

```azdeveloper
azd template source add <key> --type <file-or-url-or-gh> --location <your-uri> --name <your-display-name>
```

Use the `azd template source remove` command to remove a template source:

```azdeveloper
azd template source remove <key>
```

Use the `azd config reset` command to reset the template configuration back to default settings:

```azdeveloper
azd config reset
```

## Work with template lists

After you configure your template sources, use the `azd template list` command to list the available templates from those sources:

```azdeveloper
azd template list
```

For example, a default installation of `azd` lists the following templates from the **awesome-azd** template source:

```output
Name                                                         Source       Repository Path

Event Driven Java Application with Azure Service Bus         Awesome AZD  Azure-Samples/ASA-Samples-Event-Driven-Application
Static React Web App with Java API and PostgreSQL            Awesome AZD  Azure-Samples/ASA-Samples-Web-Application
SAP CAP on Azure App Service Quickstart                      Awesome AZD  Azure-Samples/app-service-javascript-sap-cap-quickstart
SAP Cloud SDK on Azure App Service Quickstart (TypeScript)   Awesome AZD  Azure-Samples/app-service-javascript-sap-cloud-sdk-quickstart
Java Spring Apps with Azure OpenAI                           Awesome AZD  Azure-Samples/app-templates-java-openai-springapps
WordPress with Azure Container Apps                          Awesome AZD  Azure-Samples/apptemplate-wordpress-on-ACA
Bicep template to bootstrap Azure Deployment Environments    Awesome AZD  Azure-Samples/azd-deployment-environments
Starter - Bicep                                              Awesome AZD  Azure-Samples/azd-starter-bicep
Starter - Terraform                                          Awesome AZD  Azure-Samples/azd-starter-terraform
...
# Additional templates omitted 
```

Include the `--source` flag to only list templates from a specific source:

```azdeveloper
azd template list --source <source-name>
```

To initialize a template from the displayed list, run the `azd init` command and provide the repository path of the template:

```azdeveloper
azd init --template <path-value>
```

## Work with Azure Deployment Environments

The Azure Developer CLI (`azd`) also provides support for Azure Deployment Environments. An Azure Deployment Environment (ADE) is a preconfigured collection of Azure resources deployed in predefined subscriptions. Azure governance is applied to those subscriptions based on the type of environment, such as sandbox, testing, staging, or production. With Azure Deployment Environments, your can enforce enterprise security policies and provide a curated set of predefined infrastructure as code (IaC) templates.

ADE integration is beyond the scope of this article. Learn more about configuring `ade` support in the [Azure Developer CLI support for Azure Deployment Environments](/azure/developer/azure-developer-cli/ade-integration) documentation.

## Next steps

> [!div class="nextstepaction"]
> [Azure Developer CLI support for Azure Deployment Environments](/azure/developer/azure-developer-cli/ade-integration)
> [Template list command reference](/azure/developer/azure-developer-cli/reference#azd-template)

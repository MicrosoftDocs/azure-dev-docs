---
title: Azure Developer CLI support for Azure Deployment Environments
description: Learn how to integrate the Azure Developer CLI with Azure Deployment Environments
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/14/2024
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Azure Developer CLI support for Azure Deployment Environments

The Azure Developer CLI (azd) provides support for [Azure Deployment Environments](/azure/deployment-environments/overview-what-is-azure-deployment-environments). An Azure Deployment Environment (ADE) is a preconfigured collection of Azure resources deployed in predefined subscriptions. Azure governance is applied to those subscriptions based on the type of environment, such as sandbox, testing, staging, or production. With Azure Deployment Environments, your can enforce enterprise security policies and provide a curated set of predefined infrastructure as code (IaC) templates.

## Prerequisites

Verify you have completed the following prerequisites to work with Azure Deployment Environments using `azd`:

* [Installed `azd` locally](/azure/developer/azure-developer-cli/install-azd) or have access to `azd` via Cloud Shell
* [Created and configured an Azure Deployment Environment](/azure/deployment-environments/quickstart-create-and-configure-devcenter) with a dev center, project, and template catalog
* [Configured environment types](/azure/deployment-environments/quickstart-create-access-environments) at the dev center level and project level
* Ensure the developer has Deployment Environments User role on the project

    > [!TIP]
    > [Understanding key concepts](/azure/deployment-environments/concept-environments-key-concepts) about Azure Deployment Environments is essential for working with them via `azd`.

## Enable Azure Deployment Environment support

You can configure `azd` to provision and deploy resources to your deployment environments using standard commands such as `azd up` or `azd provision`. To enable support for Azure Deployment Environments, run the following command:

```bash
azd config set platform.type devcenter
```

When `platform.type` is set to `devcenter`, all `azd` remote environment state and provisioning will leverage new dev center components. This configuration also means that the `infra` folder in your local templates will effectively be ignored. Instead, `azd` will use one of the infrastructure templates defined in your dev center catalog for resource provisioning.

You can also disable dev center support via the following command:

```bash
azd config unset platform
```

## Work with Azure Deployment Evironments

When the dev center feature is enabled, the default behavior of some common `azd` commands changes to work with these remote environments. The dev center feature expands on functionality provided by standard `azd` [remote environment support](/azure/developer/azure-developer-cli/remote-environments-support).

### azd init

The `azd init` command experience in dev center mode shows all the azd compatible ADE templates for selection from your configured catalog. During the init process, after `azd` clones down the template code, the `azure.yaml` file will automatically be updated to include a `platform` section with the selected configuration based on the template that was chosen. The configuration includes the dev center name, catalog, and environment definition.

```bash
`azd init`
```

### azd up

The `azd up` command will package, provision, and deploy your application to Azure Deployment Environments. However, the provision stage of the `azd up` command will use the curated infrastructure-as-code templates in your remote dev center, while the deployment stage will deploy the source code in your `azd` template. While dev center mode is enabled, `azd` will ignore the `infra` folder in your local `azd` template and only provision resources using the dev center templates. The command will also prompt you for any necessary values, such as the Azure Deployment Environment project or environment type.

```bash
azd up
```

### azd template list

The `azd template list` command will display the available infrastructure templates in your dev center catalog, rather than showing templates from the default AZD Awesome gallery. [Catalogs](/azure/deployment-environments/concept-environments-key-concepts#catalogs) provide a set of curated and approved infrastructure-as-code templates your development teams can use to create environments.

```bash
azd template list
```

:::image type="content" source="media/azure-deployment-environments/azure-dev-center-templates.png" alt-text="A screenshot showing the updated template gallery.":::

### azd provision

The `azd provision` command will create new dev center environments. The command will prompt you for any missing values, such as the environment type or project. When the command runs, it will use the associated infrastructure template to provision the correct set of Azure resources for that environment. While dev center mode is enabled, `azd` will ignore the `infra` folder in your local `azd` template and only provision resources using the dev center templates.

```bash
azd provision
```

### azd env list

The `azd env list` command will display the same list of environments you would see in the developer portal.

```bash
azd env list
```

## Tagging resources for Azure Deployment Environments

`azd` provisioning for Azure Deployment Environments relies on curated templates from the dev center catalog. Templates in the catalog may or may not assign tags to provisioned Azure resources for you to associate your app services with in the `azure.yaml` file. If the templates do not assign tags, you can address this issue in one of two ways:

* Work with your dev center catalog administrator to ensure the provisioned Azure resources include tags to associate them with services defined in your `azure.yaml` file.
* Specify the `resoureName` in your `azure.yaml` file instead of using tags:

    ```yml
    services:
        api:
            project: ./src/api
            host: containerapp
            language: js
            resourceName: sample-api-containerapp
        web:
            project: ./src/web
            host: containerapp
            language: js
            resourceName: sample-web-containerapp
    ```

## Configure dev center settings

You can define `azd` settings for your dev centers in multiple places. Settings are combined from these locations to create the final set of configurations in the following order of precedence:

1. Environment variables
2. Azd environment configuration
3. Project configuration
4. User configuration

`azd` will automatically prompt you for any configuration values that are missing from these sources. Each of these configuration options is detailed in the following sections.

### Environment variables

The following environment variables will be discovered and used by `azd`:

* AZURE_DEVCENTER_NAME
* AZURE_DEVCENTER_PROJECT
* AZURE_DEVCENTER_CATALOG
* AZURE_DEVCENTER_ENVIRONMENT_DEFINITION
* AZURE_DEVCENTER_ENVIRONMENT_TYPE
* AZURE_DEVCENTER_ENVIRONMENT_USER

### Define configurations

Define configurations for your dev centers at the `azd` environment scope in `.azure/<env>/config.json` file:

```json
{
    "platform": {
        "config": {
            "catalog": "SampleCatalog",
            "environmentDefinition": "Todo",
            "environmentType": "Dev",
            "name": "sample-devcenter",
            "Project": "SampleProject"
        }
    }
}
```

### Project scope

Define configurations for your dev centers at the `azd` project scope in the `platform` node of the `azure.yaml` file:

```yaml
name: todo-nodejs-mongo-aca
metadata:
    template: todo-nodejs-mongo-aca@0.0.1-beta
platform:
    type: devcenter
    config:
        catalog: SampleCatalog
        environmentDefinition: Todo
        name: sample-devcenter
        project: SampleProject
services:
    api:
        project: ./src/api
        host: containerapp
        language: js
    web:
        project: ./src/web
        host: containerapp
        language: js
```

### User scope

Define configurations for your dev centers at the user scope in the `~/<user_profile>/.azd/config.json` file:

```json
{
    "platform": {
        "config": {
            "catalog": "SampleCatalog",
            "environmentDefinition": "Todo",
            "environmentType": "Dev",
            "name": "sample-devcenter",
            "Project": "SampleProject"
        }
    }
}
```

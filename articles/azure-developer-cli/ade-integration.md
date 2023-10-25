---
title: Azure Developer CLI support for Azure Deployment Environments
description: Learn how to integrate the Azure Developer CLI with Azure Deployment Environments
author: alexwolfmsft
ms.author: alexwolf
ms.date: 10/23/2023
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Azure Developer CLI support for Azure Deployment Environments

The Azure Developer CLI (azd) includes support for [Azure Deployment Environments](/azure/deployment-environments/overview-what-is-azure-deployment-environments). A deployment environment is a preconfigured collection of Azure resources deployed in predefined subscriptions. Azure governance is applied to those subscriptions based on the type of environment, such as sandbox, testing, staging, or production. With Azure Deployment Environments, your platform engineer can enforce enterprise security policies and provide a curated set of predefined infrastructure as code (IaC) templates. You can learn more about the [key concepts for Azure Deployment Environments](/azure/deployment-environments/concept-environments-key-concepts).

## Enable Azure Deployment Environment support in azd

You can provision and deploy resources to your deployment environments using standard azd commands such as `azd up` or `azd provision`. To configure support for Azure Deployment Environments, run the following command:

```bash
azd config set platform.type devcenter
```

When `platform.type` is set to `devcenter` all `azd` remote environment state and provisioning will leverage new dev center components. This configuration also means that the `infra` folder in your local templates will effectively be ignored. Instead, `azd` will use one of the infrastructure templates defined in your dev center catalog.

## Use azd commands with deployment environments

When dev center support is enabled, the default behavior of some common `azd` commands changes to work with these remote environments.

### azd up

The `azd up` command will continue to package, provision, and deploy your application. However, the provision stage of the `azd up` command will use the curated infrastructure-as-code templates in your remote dev center, while the deployment stage will deploy the source code in your local `azd` template. While dev center mode is enabled, `azd` will ignore the `infra` folder in your local `azd` template and only provision resources using the dev center templates. The command will also prompt you for any necessary values, such as the Azure Deployment Environment project or environment type.

```bash
azd up
```

### azd template list

For example, the `azd template list` command will display the available infrastructure templates in your dev center catalog, rather than showing templates from the AZD Awesome gallery. [Catalogs](/azure/deployment-environments/concept-environments-key-concepts#catalogs) provide a set of curated and approved infrastructure-as-code templates your development teams can use to create environments.

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

The `azd env list` command will display the same list of environments you would see in the [developer portal](https://devportal.azure.com).

```bash
azd env list
```

## Configure Azure Deployment Environment settings in azd

You can define `azd` settings for Azure Deployment Environment in multiple places. Settings are combined from these locations to create the final set of configurations in the following order of precedence:

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

### Environment scope

Define configurations for Azure Deployment Environments at the `azd` environment scope in `.azure/<env>/config.json` file:

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
    },
    "provision": {
        "parameters": {
            "environmentName": "sample-todo-team-dev",
            "repourl": "https://github.com/azure-samples/todo-nodejs-mongo-aca"
        }
    }
}
```

### Project scope

Define configurations for Azure Deployment Environments at the `azd` project scope in the `platform` node of the `azure.yaml` file:

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

Define configurations for Azure Deployment Environments at the user scope in the `~/<user_profile>/.azd/config.json` file:

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


---
title: Azure Developer CLI schema
description: Describes the schema for the Azure Developer CLI.
author: hhunter-ms
ms.author: hannahhunter
ms.date: 10/24/2022
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Azure Developer CLI schema

[Templates](./overview.md#azure-developer-cli-templates) are sample repositories that include app code, tools, and infrastructure code. You can use these templates to create your own solutions using Azure Developer CLI (azd). The [azure.yaml](https://github.com/Azure/azure-dev/blob/main/schemas/v1.0/azure.yaml.json/) schema defines and describes the apps and types of Azure resources that are included in these templates.

## Sample

```json

```

## Property descriptions

| Element Name | Required | Description |
| ------------ | -------- | ----------- | 
| `name` | Y | _(string)_ Name of the application. |
| `resourceGroup` | N | _(string)_ Name of the Azure resource group. When specified, will override the resource group name used for infrastructure provisioning. |
| `metadata` | N | _(object)_ See [metadata properties](#metadata-properties) for more details. |
| `infra` | N | _(object)_ Provides additional configuration for Azure infrastruction provisioning. See [infra properties](#infra-properties) for more details. |
| `services` | Y | _(object)_ Definition of services that comprise the application. See [services properties](#services-properties) for more details. |
| `pipeline` | N | _(object)_ Definition of continuous integration pipeline. See [pipeline properties](#pipeline-properties) for more details. |

### `metadata` properties

| Element Name | Required | Description | Example |
| --- | --- | --- | --- |
| `template` | N | _(string)_ Identifier of the template from which the application was created. | `todo-nodejs-mongo@0.0.1-beta` |

### `infra` properties

| Element Name | Required | Description | Example |
| --- | --- | --- | --- |
| `provider` | N | _(string)_ The infrastructure provisioning provider used to provision the Azure resources for the application. (Default: bicep). | `"bicep"`, `"terraform"` |
| `path` | N | _(string)_ The relative folder path to the location containing Azure provisioning templates for the specified provider. (Default: infra). |  |
| `module` | N | _(string)_ The name of the default module withing the Azure provisioning templates. (Default: main). |  |

### `services` properties

| Element Name | Required | Description | Example |
| --- | --- | --- | --- |
| `resourceName` | N | _(string)_ Name of the Azure resource that implements the service. If not specified, the resource name will be constructed from the current environment name, concatenated with the service name (`<environment-name><resource-name>`). | `"prodapi"` |
| `project` | Y | _(string)_ Path to the service source code directory. |  |
| `host` | Y | _(string)_ Type of Azure resource used for service implementation. If omitted, App Service will be assumed. | `"appservice"`, `"containerapp"`, `"function"`, `"staticwebapp"` | 
| `language` | Y | _(string)_ Service implementation language. If omitted, .NET will be assumed. | `"dotnet"`, `"csharp"`, `"fsharp"`, `"py"`, `"python"`, `"js"`, `"ts"`, `"java"` |
| `module` | Y | _(string)_ Path of the infrastructure module used to deploy the service relative to the root infra folder. If omitted, the CLI will assume the module name is the same as the service name. |  |
| `dist` | Y | _(string)_ Relative path to the service deployment artifacts. The CLI will use files under this path to create the deployment artifact (.zip file). If omitted, all files under the service project directory will be included. | 
| `docker` | N | This is only applicable when `host` is `containerapp`. Cannot contain additional properties. | <ul><li>`path` _(string)_: Path to the Dockerfile. Default: `"./Dockerfile"`</li><li>`context` _(string)_: The docker build context. When specified, overrides default context. Default: `"."`</li><li>`platform` _(string)_: The platform target. Default: `"amd64"` </li></ul> |

### `pipeline` properties

| Element Name | Required | Description | Example |
| --- | --- | --- | --- |
| `provider` | N | _(string)_ The pipeline provider to be used for continuous integration. (Default: `"github"`). | `"github"`, `"azdo"` |


## Next Steps

- [Learn more about Azure Developer CLI](./overview.md)
- [Get started with `azd up`](./get-started.md)
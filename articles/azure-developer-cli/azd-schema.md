---
title: Azure Developer CLI's azure.yaml schema
description: Describes the schema for the Azure Developer CLI azure.yaml file
author: alexwolfmsft
ms.author: alexwolf
ms.date: 10/24/2022
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Azure Developer CLI's azure.yaml schema

[`azd` templates](./overview.md#azure-developer-cli-templates) are sample repositories that include app code, tools, and infrastructure code. You can use these templates to create your own solutions using Azure Developer CLI (`azd`). The [azure.yaml](https://aka.ms/azure.yaml.json) schema defines and describes the apps and types of Azure resources that are included in these templates.

## Sample

Below is a generic example of an `azure.yaml` required for your `azd` template.

```yaml
name: yourApp
metadata:
  template: yourApp@0.0.1-beta
services:
  web:
    project: ./src/web # path to your web project
    dist: build # relative path to service deployment artifacts
    language: js # one of the supported languages
    host: appservice # one of the supported Azure services
```

Compare with the [`azure.yaml`](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/azure.yaml) from our [ToDo NodeJs Mongo template](https://github.com/Azure-Samples/todo-nodejs-mongo):

```yaml
name: todo-nodejs-mongo
metadata:
  template: todo-nodejs-mongo@0.0.1-beta
services:
  web:
    project: ./src/web
    dist: build
    language: js
    host: appservice
  api:
    project: ./src/api
    language: js
    host: appservice
```

## Property descriptions

| Element Name | Required | Description |
| ------------ | -------- | ----------- | 
| `name` | Y | _(string)_ Name of the application. |
| `resourceGroup` | N | _(string)_ Name of the Azure resource group. When specified, will override the resource group name used for infrastructure provisioning. |
| `metadata` | N | _(object)_ See [metadata properties](#metadata-properties) for more details. |
| `infra` | N | _(object)_ Provides extra configuration for Azure infrastruction provisioning. See [infra properties](#infra-properties) for more details. |
| `services` | Y | _(object)_ Definition of services that comprise the application. See [services properties](#services-properties) for more details. |
| `pipeline` | N | _(object)_ Definition of continuous integration pipeline. See [pipeline properties](#pipeline-properties) for more details. |

### `metadata` properties

| Element Name | Required | Description | Example |
| --- | --- | --- | --- |
| `template` | N | _(string)_ Identifier of the template from which the application was created. | `todo-nodejs-mongo@0.0.1-beta` |

### `infra` properties

| Element Name | Required | Description | Example |
| --- | --- | --- | --- |
| `provider` | N | _(string)_ The infrastructure provider for the application's Azure resources. (Default: bicep). | See the [Terraform sample](#terraform-as-iac-provider-sample) below. `bicep`, `terraform` |
| `path` | N | _(string)_ The relative folder path to the location containing Azure provisioning templates for the specified provider. (Default: infra). |  |
| `module` | N | _(string)_ The name of the default module withing the Azure provisioning templates. (Default: main). |  |

#### Terraform as IaC provider sample

```yaml
name: yourApp-terraform
metadata:
  template: yourApp-terraform@0.0.1-beta
services:
  web:
    project: ./src/web
    dist: build
    language: js
    host: appservice
  api:
    project: ./src/api
      language: js
      host: appservice
infra:
  provider: terraform
```

### `services` properties

| Element Name | Required | Description | Example |
| --- | --- | --- | --- |
| `resourceName` | N | _(string)_ Name of the Azure resource that implements the service. If not specified, `azd` will look for a resource by `azd-env-name` and `azd-service-name` tags. If not found, it will look for a resource name constructed from the current environment name, concatenated with the service name (`<environment-name><resource-name>`). | `prodapi` |
| `project` | Y | _(string)_ Path to the service source code directory. |  |
| `host` | Y | _(string)_ Type of Azure resource used for service implementation. If omitted, App Service will be assumed. | `appservice`, `containerapp`, `function`, `staticwebapp`, `aks` (only for projects deployable via `kubectl apply -f`), `springapp` (when [enabled](aka.ms/azd-may-2023) - learn more about [alpha features](./feature-versioning#alpha-features)) | 
| `language` | Y | _(string)_ Service implementation language. If omitted, .NET will be assumed. | `dotnet`, `csharp`, `fsharp`, `py`, `python`, `js`, `ts`, `java` |
| `module` | Y | _(string)_ Path of the infrastructure module used to deploy the service relative to the root infra folder. If omitted, the CLI will assume the module name is the same as the service name. |  |
| `dist` | Y | _(string)_ Relative path to the service deployment artifacts. The CLI will use files under this path to create the deployment artifact (.zip file). If omitted, all files under the service project directory will be included. | `build` |
| `docker` | N | Only applicable when `host` is `containerapp`. Can't contain extra properties. | See the [custom Docker sample](#docker-options-sample) below. `path` _(string)_: Path to the Dockerfile. Default: `./Dockerfile`; `context` _(string)_: The docker build context. When specified, overrides default context. Default: `.`; `platform` _(string)_: The platform target. Default: `amd64` |

#### Docker options sample

In the following example, we declare Docker options for a container app.

```yaml
name: yourApp-aca
metadata:
    template: yourApp-aca@0.0.1-beta
services:
  api:
    project: src/api
    language: js
    host: containerapp
    docker:
      path: ./Dockerfile
      context: ../
      web:
      project: src/web
  language: js
  host: containerapp
```

### `pipeline` properties

| Element Name | Required | Description | Example |
| --- | --- | --- | --- |
| `provider` | N | _(string)_ The pipeline provider to be used for continuous integration. (Default: `github`). | `github`, `azdo` |

#### Azure Pipelines (AzDo) as a CI/CD pipeline sample

```yaml
name: yourApp
services:  
  web:    
    project: src/web
    dist: build
    language: js
    host: appservice
pipeline: 
  provider: azdo
```


## Next steps

- [Learn more about Azure Developer CLI](./overview.md)
- [Get started with `azd init` and `azd up`](./get-started.md)
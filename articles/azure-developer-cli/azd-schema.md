---
title: Azure Developer CLI's azure.yaml schema
description: Describes the schema for the Azure Developer CLI azure.yaml file
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/14/2024
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Azure Developer CLI's azure.yaml schema

[`azd` templates](./azd-templates.md) are blueprint repositories that include proof-of-concept application code, editor/IDE configurations, and infrastructure code written in Bicep or Terraform. These templates are intended to be modified and adapted for your specific application requirements and then used to get your application on Azure using the Azure Developer CLI (`azd`). The [azure.yaml](https://aka.ms/azure.yaml.json) schema defines and describes the apps and types of Azure resources that are included in these templates.

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
| `infra` | N | _(object)_ Provides extra configuration for Azure infrastructure provisioning. See [infra properties](#infra-properties) for more details. |
| `services` | Y | _(object)_ Definition of services that comprise the application. See [services properties](#services-properties) for more details. |
| `pipeline` | N | _(object)_ Definition of continuous integration pipeline. See [pipeline properties](#pipeline-properties) for more details. |
| `hooks` | N | Command level hooks. Hooks should match `azd` command names prefixed with `pre` or `post` depending on when the script should execute. When specifying paths they should be relative to the project path. See [Customize your Azure Developer CLI workflows using command and event hooks](./azd-extensibility.md) for more details. |
| `requiredVersions` | N |A range of supported versions of `azd` for this project. If the version of `azd` is outside this range, the project will fail to load. Optional (allows all versions if absent). Example: `>= 0.6.0-beta.3` |

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
| `host` | Y | _(string)_ Type of Azure resource used for service implementation. If omitted, App Service will be assumed. | `appservice`, `containerapp`, `function`, `staticwebapp`, `aks` (only for projects deployable via `kubectl apply -f`), `springapp` (when [enabled](https://aka.ms/azd-may-2023) - learn more about [alpha features](./feature-versioning.md#alpha-features)) | 
| `language` | Y | _(string)_ Service implementation language. | `dotnet`, `csharp`, `fsharp`, `py`, `python`, `js`, `ts`, `java` |
| `module` | Y | _(string)_ Path of the infrastructure module used to deploy the service relative to the root infra folder. If omitted, the CLI will assume the module name is the same as the service name. |  |
| `dist` | Y | _(string)_ Relative path to the service deployment artifacts. The CLI will use files under this path to create the deployment artifact (.zip file). If omitted, all files under the service project directory will be included. | `build` |
| `docker` | N | Only applicable when `host` is `containerapp`. Can't contain extra properties. | See the [custom Docker sample](#docker-options-sample) below. `path` _(string)_: Path to the Dockerfile. Default: `./Dockerfile`; `context` _(string)_: The docker build context. When specified, overrides default context. Default: `.`; `platform` _(string)_: The platform target. Default: `amd64`; `remoteBuild` _(boolean)_: Enables remote ACR builds. Default: `false` |
| `k8s` | N | The Azure Kubernetes Service (AKS) configuration options. | See the [AKS sample](#aks-sample-with-service-level-hooks) below. `deploymentPath` _(string)_: Optional. The relative path from the service path to the k8s deployment manifests. When set, it will override the default deployment path location for k8s deployment manifests. Default: `manifests`; `namespace` _(string)_: Optional. The k8s namespace of the deployed resources. When specified, a new k8s namespace will be created if it does not already exist. Default: `Project name`; `deployment` _(object)_: See [deployment properties](#aks-deployment-properties); `service` _(object)_: See [service properties](#aks-service-properties); `ingress` _(object)_: See [ingress properties](#aks-ingress-properties).  |
| `hooks` | N | Service level hooks. Hooks should match `service` event names prefixed with `pre` or `post` depending on when the script should execute. When specifying paths they should be relative to the service path. | See [Customize your Azure Developer CLI workflows using command and event hooks](./azd-extensibility.md) for more details. |
| `apiVersion` | N | Specify an explicit `api-version` when deploying services hosted by Azure Container Apps (ACA). This feature helps you avoid using an incompatible API version and makes deployment more loosely coupled to avoid losing custom configuration data during JSON marshaling to a hard-coded Azure SDK library version. | `apiVersion: 2024-02-02-preview` |

#### Docker options sample

In the following example, we declare Docker options for a container app.

```yaml
name: yourApp-aca
metadata:
    template: yourApp-aca@0.0.1-beta
services:
  api:
    project: ./src/api
    language: js
    host: containerapp
    docker:
      path: ./Dockerfile
      context: ../
  web:
    project: ./src/web
    language: js
    host: containerapp
    docker:
      remoteBuild: true
```

### AKS `deployment` properties

| Element Name | Required | Description | Example |
| --- | --- | --- | --- |
| `name` | N | _(string)_ Optional. The name of the k8s deployment resource to use during deployment. Used during deployment to ensure if the k8s deployment rollout has been completed. If not set, will search for a deployment resource in the same namespace that contains the service name. Default: `Service name` | `api` |

### AKS `service` properties

| Element Name | Required | Description | Example |
| --- | --- | --- | --- |
| `name` | N | _(string)_ Optional. The name of the k8s service resource to use as the default service endpoint. Used when determining endpoints for the default service resource. If not set, will search for a deployment resource in the same namespace that contains the service name. (Default: Service name)  | `api` |

### AKS `ingress` properties

| Element Name | Required | Description | Example |
| --- | --- | --- | --- |
| `name` | N | _(string)_ Optional. The name of the k8s ingress resource to use as the default service endpoint. Used when determining endpoints for the default ingress resource. If not set, will search for a deployment resource in the same namespace that contains the service name. Default: `Service name` | `api` |
| `relativePath` | N | _(string)_ Optional. The relative path to the service from the root of your ingress controller. When set, will be appended to the root of your ingress resource path. | |

### AKS sample with service level hooks

```yaml
metadata:
  template: todo-nodejs-mongo-aks@0.0.1-beta
services:
  web:
    project: ./src/web
    dist: build
    language: js
    host: aks
    hooks:
      postdeploy:
        shell: sh
        run: azd env set REACT_APP_WEB_BASE_URL ${SERVICE_WEB_ENDPOINT_URL}
  api:
    project: ./src/api
    language: js
    host: aks
    k8s:
      ingress:
        relativePath: api
    hooks:
      postdeploy:
        shell: sh
        run: azd env set REACT_APP_API_BASE_URL ${SERVICE_API_ENDPOINT_URL}
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

### `workflows` properties

| Element Name | Type   | Required | Description |
|--------------|--------|----------|-------------|
| up           | object | No       | When specified will override the default behavior for the azd up workflow. |

#### `up` properties

| Element Name | Type   | Required | Description |
|--------------|--------|----------|-------------|
| workflow     | object | No       | The workflow configuration. |

#### `workflow` properties

| Element Name | Type   | Required | Description |
|--------------|--------|----------|-------------|
| steps        | array  | Yes      | The steps to execute in the workflow. |

#### `workflowStep` properties

| Element Name | Type   | Required | Description |
|--------------|--------|----------|-------------|
| azd          | object | Yes      | The azd command configuration. |

#### `azd` properties

| Element Name | Type   | Required | Description |
|--------------|--------|----------|-------------|
| azdCommand   | anyOf  | Yes      | The azd command to execute. |

#### `azdCommand` properties

| Element Name           | Type   | Required | Description |
|------------------------|--------|----------|-------------|
| title        | string | Yes      | The azd command to execute. |
| description  | string | No       | The name and args of the azd command to execute. (Example: deploy --all) |

#### Sample workflow

The following `azure.yaml` file changes the default behavior of `azd up` to move the `azd package` step after the `azd provision` step using workflows:

```yml
name: todo-nodejs-mongo
metadata:
  template: todo-nodejs-mongo@0.0.1-beta
workflows:
  up: 
    steps:
      - azd: provision
      - azd: deploy --all
```

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

- [Learn more about Azure Developer CLI](./overview.md)
- [Get started with `azd init` and `azd up`](./get-started.md)

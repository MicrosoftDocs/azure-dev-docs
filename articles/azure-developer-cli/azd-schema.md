---
title: Azure Developer CLI's azure.yaml schema
description: Describes the schema for the Azure Developer CLI azure.yaml configuration file, including all top-level properties, services, resources, hooks, and more.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/05/2026
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
ai-usage: ai-generated
---

# Azure Developer CLI schema reference

The `azure.yaml` file is the configuration file for Azure Developer CLI (`azd`) projects. Place it in the root of your project to define the services, Azure resources, infrastructure, hooks, and CI/CD pipeline that make up your application. When you run commands like `azd up`, `azd provision`, or `azd deploy`, the CLI reads this file to understand your app's structure and how to deploy it to Azure.

This article is a complete reference for the [azure.yaml schema](https://aka.ms/azure.yaml.json). For getting started with `azd` templates, see [Azure Developer CLI templates overview](./azd-templates.md).

## Sample

The following is a generic example of an `azure.yaml` file for an `azd` template. For a real-world example, see the [`azure.yaml`](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/azure.yaml) from the [ToDo NodeJs Mongo template](https://github.com/Azure-Samples/todo-nodejs-mongo):

```yaml
name: yourApp
metadata:
  template: yourApp@0.0.1-beta
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

## Top-level properties

| Element Name | Required | Type | Description |
| --- | --- | --- | --- |
| [`name`](#name) | Y | string | The application name. Only lowercase letters, numbers, and hyphens (`-`) are allowed. The name must start and end with a letter or number. |
| [`resourceGroup`](#resourcegroup) | N | string | Name of the Azure resource group. When specified, overrides the resource group name used for infrastructure provisioning. Supports environment variable substitution. |
| [`metadata`](#metadata) | N | object | Metadata about the application template. |
| [`infra`](#infra) | N | object | Provides additional configuration for Azure infrastructure provisioning. |
| [`services`](#services) | N | object | Definition of services that comprise the application. |
| [`resources`](#resources) | N | object | Definition of Azure resources used by the application. |
| [`pipeline`](#pipeline) | N | object | Definition of continuous integration pipeline. |
| [`hooks`](#hooks) | N | object | Command level hooks for `azd` commands. |
| [`requiredVersions`](#requiredversions) | N | object | Provides additional configuration for required versions of `azd` and extensions. |
| [`state`](#state) | N | object | Provides additional configuration for state management. |
| [`platform`](#platform) | N | object | Provides additional configuration for platform-specific features such as Azure Dev Center. |
| [`workflows`](#workflows) | N | object | Provides additional configuration for workflows such as overriding `azd up` behavior. |
| [`cloud`](#cloud) | N | object | Provides additional configuration for deploying to sovereign clouds. The default cloud is `AzureCloud`. |

## `name`

_(string, required)_ The application name. Only lowercase letters, numbers, and hyphens (`-`) are allowed. The name must start and end with a letter or number. Minimum length: 2 characters.

```yaml
name: my-app
```

## `resourceGroup`

_(string)_ Name of the Azure resource group. When specified, overrides the resource group name used for infrastructure provisioning. Supports environment variable substitution. Must be between 3 and 64 characters.

```yaml
resourceGroup: rg-my-app-${AZURE_ENV_NAME}
```

## `metadata`

_(object)_ Metadata about the application template.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `template` | N | string | Identifier of the template from which the application was created. |

```yaml
metadata:
  template: todo-nodejs-mongo@0.0.1-beta
```

## `infra`

_(object)_ Provides additional configuration for Azure infrastructure provisioning.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `provider` | N | string | The infrastructure provisioning provider used to provision the Azure resources for the application. Default: `bicep`. Allowed values: `bicep`, `terraform`. |
| `path` | N | string | The relative folder path to the Azure provisioning templates for the specified provider. Default: `infra`. |
| `module` | N | string | The name of the default module within the Azure provisioning templates. Default: `main`. |
| `layers` | N | array | Layers for Azure infrastructure provisioning. See [`infra.layers`](#infralayers). |

> [!NOTE]
> When `layers` is specified with at least one item, the `path` and `module` properties can't be used. Use layer-specific `path` and `module` values instead.

### `infra.layers`

_(array of objects)_ Defines provisioning layers for Azure infrastructure. Each layer represents an independent unit of provisioning.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | Y | string | The name of the provisioning layer. |
| `path` | Y | string | The relative folder path to the Azure provisioning templates for the specified provider. |
| `module` | N | string | The name of the Azure provisioning module used when provisioning resources. Default: `main`. |
| `dependsOn` | N | array of strings | Names of other layers this layer depends on. Use to declare hook-mediated dependencies (for example, when a `postprovision` hook in another layer writes an env var that this layer's bicepparam reads at provision time) that `azd`'s static analyzer can't infer from `.bicep` / `.bicepparam` / `.parameters.json` contents. |
| `hooks` | N | object | Provisioning layer hooks. Supports `preprovision` and `postprovision` hooks. When specifying paths, they should be relative to the layer path. See [Hook definition](#hook-definition). |

```yaml
infra:
  provider: bicep
  layers:
    - name: core
      path: ./infra/core
    - name: services
      path: ./infra/services
      dependsOn:
        - core
      hooks:
        postprovision:
          shell: sh
          run: ./scripts/post-provision.sh
```

### Terraform as IaC provider sample

To use Terraform instead of Bicep, set the `provider` to `terraform`. For more information, see [Use Terraform as an IaC provider](./use-terraform-for-azd.md).

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

## `services`

_(object)_ Definition of services that comprise the application. Each key is a service name, and the value is a service configuration object.

### Service properties

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `host` | Y | string | The type of Azure resource used for service implementation. See [Host types](#host-types). |
| `project` | Conditional | string | Path to the service source code directory. Required for most host types. |
| `image` | Conditional | string | The source image to be used for the container image instead of building from source. Supports environment variable substitution. Only valid for `containerapp` host. |
| `language` | N | string | Service implementation language. Allowed values: `dotnet`, `csharp`, `fsharp`, `py`, `python`, `js`, `ts`, `java`, `docker`. |
| `module` | N | string | Path of the infrastructure module used to deploy the service relative to the root infra folder. If omitted, the CLI assumes the module name is the same as the service name. |
| `dist` | N | string | Relative path to service deployment artifacts. |
| `resourceName` | N | string | Name of the Azure resource that implements the service. By default, the CLI discovers the Azure resource with tag `azd-service-name` set to the current service's name. Supports environment variable substitution. |
| `resourceGroup` | N | string | Name of the Azure resource group that contains the resource. When specified, the CLI finds the Azure resource within the specified resource group. Supports environment variable substitution. |
| `remoteBuild` | N | boolean | Whether to use remote build for function app deployment. Only valid when `host` is `function`. When set to `true`, the deployment package is built remotely using Oryx. Defaults to `true` for JavaScript, TypeScript, and Python function apps. |
| `docker` | N | object | Docker configuration. Only applicable for container-based hosts. See [`docker`](#docker). |
| `k8s` | N | object | AKS configuration options. Only valid when `host` is `aks`. See [`k8s`](#k8s). |
| `config` | N | object | Extra configuration options for the service. |
| `uses` | N | array | List of service names and resource names that this service depends on. |
| `env` | N | object | A map of environment variable names to values. Supports environment variable substitution. |
| `apiVersion` | N | string | Resource provider API version for deployments. Only valid when `host` is `containerapp`. |
| `hooks` | N | object | Service level hooks. See [Service hooks](#service-hooks). |

> [!TIP]
> See [Service samples](#service-samples) for complete YAML examples of different service configurations.

#### Host types

The `host` property determines the type of Azure resource used for service implementation and controls which other properties are valid.

| Host value | Description | Requires `project` | Supports `image` | Supports `docker` | Supports `k8s` | Supports `env` | Supports `apiVersion` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `appservice` | Azure App Service | Y | N | N | N | N | N |
| `containerapp` | Azure Container Apps | `project` or `image` (not both) | Y | Y | N | Y | Y |
| `function` | Azure Functions | Y | N | N | N | N | N |
| `staticwebapp` | Azure Static Web Apps | Y | N | N | N | N | N |
| `springapp` | Azure Spring Apps | Y | N | N | N | N | N |
| `aks` | Azure Kubernetes Service | N | N | Y | Y | N | N |
| `ai.endpoint` | Azure AI online endpoint | Y | N | Y | N | N | N |
| `azure.ai.agent` | Azure AI Agent | Y | N | Y | N | N | N |

> [!NOTE]
> `springapp` support requires opt-in to alpha features. For more information, see [Alpha features](./feature-versioning.md#alpha-features).

> [!NOTE]
> When `host` is `containerapp`, you must provide either `image` or `project`, but not both. If `image` is set, the container is deployed from the specified image. If `project` is set, the container image is built from source.

#### `ai.endpoint` config

_(object, required when `host` is `ai.endpoint`)_ Provides additional configuration for Azure AI online endpoint deployment.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `workspace` | N | string | The name of the AI Studio project workspace. When omitted, `azd` uses the value specified in the `AZUREAI_PROJECT_NAME` environment variable. Supports environment variable substitution. |
| `flow` | N | object | The Azure AI Studio Prompt Flow configuration. When omitted, a prompt flow isn't created. See [AI component config](#ai-component-config). |
| `environment` | N | object | The Azure AI Studio custom environment configuration. When omitted, a custom environment isn't created. See [AI component config](#ai-component-config). |
| `model` | N | object | The Azure AI Studio model configuration. When omitted, a model isn't created. See [AI component config](#ai-component-config). |
| `deployment` | Y | object | The Azure AI Studio online endpoint deployment configuration. A new online endpoint deployment is created and traffic is automatically shifted to the new deployment upon successful completion. See [AI deployment config](#ai-deployment-config). |

> [!NOTE]
> When `host` is `ai.endpoint`, both `project` and `config` are required. See [`ai.endpoint` config](#aiendpoint-config) for the required configuration properties.

##### AI component config

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | N | string | Name of the AI component. When omitted, `azd` generates a name based on the component type and the service name. Supports environment variable substitution. |
| `path` | Y | string | The path to the AI component configuration file or source code. |
| `overrides` | N | object | A map of key value pairs used to override the AI component configuration. Supports environment variable substitution. |

##### AI deployment config

Inherits all properties from [AI component config](#ai-component-config), plus:

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `environment` | N | object | A map of key/value pairs to set as environment variables for the deployment. Values support OS and `azd` environment variable substitution. |

```yaml
services:
  myendpoint:
    project: ./src/endpoint
    host: ai.endpoint
    config:
      workspace: my-ai-project
      deployment:
        path: ./deployment
        environment:
          MODEL_NAME: ${AZURE_OPENAI_MODEL}
```

#### `docker`

_(object)_ Docker configuration for a service. Only applicable for hosts that support containers (`containerapp`, `aks`, `ai.endpoint`, `azure.ai.agent`).

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `path` | N | string | The path to the Dockerfile, relative to your service. Default: `./Dockerfile`. |
| `context` | N | string | The docker build context. When specified, overrides the default context. Default: `.`. |
| `platform` | N | string | The platform target. Default: `amd64`. |
| `registry` | N | string | The container registry to push the image to. If omitted, defaults to the value of `AZURE_CONTAINER_REGISTRY_ENDPOINT` environment variable. Supports environment variable substitution. |
| `image` | N | string | The name that is applied to the built container image. If omitted, defaults to `{appName}/{serviceName}-{environmentName}`. Supports environment variable substitution. |
| `tag` | N | string | The tag that is applied to the built container image. If omitted, defaults to `azd-deploy-{unix time (seconds)}`. Supports environment variable substitution. |
| `buildArgs` | N | array of strings | Build arguments to pass to the docker build command. |
| `network` | N | string | The networking mode for RUN instructions during docker build. Passed as `--network` to docker build. For example, use `host` to allow the build container to access the host network. |
| `remoteBuild` | N | boolean | Whether to build the image remotely. If set to `true`, the image is built remotely using the Azure Container Registry remote build feature. If the remote build fails, `azd` automatically falls back to building locally using Docker or Podman if available. |

#### `k8s`

_(object)_ Azure Kubernetes Service (AKS) configuration options. Only valid when `host` is `aks`.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `deploymentPath` | N | string | The relative path from the service path to the k8s deployment manifests. Default: `manifests`. |
| `namespace` | N | string | The k8s namespace of the deployed resources. When specified, a new k8s namespace is created if it doesn't already exist. Default: project name. |
| `deployment` | N | object | The k8s deployment configuration. See [Deployment config](#deployment-config). |
| `service` | N | object | The k8s service configuration. See [Service config](#service-config). |
| `ingress` | N | object | The k8s ingress configuration. See [Ingress config](#ingress-config). |
| `helm` | N | object | The helm configuration. See [Helm config](#helm-config). |
| `kustomize` | N | object | The kustomize configuration. See [Kustomize config](#kustomize-config). |

##### Deployment config

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | N | string | The name of the k8s deployment resource to use during deployment. If not set, searches for a deployment resource in the same namespace that contains the service name. Default: service name. |

##### Service config

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | N | string | The name of the k8s service resource to use as the default service endpoint. If not set, searches for a service resource in the same namespace that contains the service name. Default: service name. |

##### Ingress config

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | N | string | The name of the k8s ingress resource to use as the default service endpoint. If not set, searches for an ingress resource in the same namespace that contains the service name. Default: service name. |
| `relativePath` | N | string | The relative path to the service from the root of your ingress controller. When set, it's appended to the root of your ingress resource path. |

##### Helm config

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `repositories` | N | array | The helm repositories to add. |
| `releases` | N | array | The helm releases to install. |

**`repositories` array items:**

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | Y | string | The name of the helm repository. |
| `url` | Y | string | The URL of the helm repository. |

**`releases` array items:**

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | Y | string | The name of the helm release. |
| `chart` | Y | string | The name of the helm chart. |
| `version` | N | string | The version of the helm chart. |
| `namespace` | N | string | The k8s namespace to install the helm chart. Defaults to the service namespace. |
| `values` | N | string | Relative path from service to a `values.yaml` to pass to the helm chart. |

##### Kustomize config

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `dir` | N | string | The relative path to the kustomize directory. Supports environment variable substitution. |
| `edits` | N | array of strings | The kustomize edits to apply before deployment. Supports environment variable substitution. |
| `env` | N | object | Environment key/value pairs used to generate a `.env` file in the kustomize directory. Values support environment variable substitution. |

#### Service hooks

Service level hooks execute during service lifecycle events. Hooks should match service event names prefixed with `pre` or `post`. When specifying paths, they should be relative to the service path. See [Customize your Azure Developer CLI workflows using command and event hooks](./azd-extensibility.md) for more details.

Supported service hooks: `prerestore`, `postrestore`, `prebuild`, `postbuild`, `prepackage`, `postpackage`, `prepublish`, `postpublish`, `predeploy`, `postdeploy`.

Each hook uses the [Hook definition](#hook-definition) format.

#### Service samples

##### Container Apps with Docker options

```yaml
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

##### Container Apps from a prebuilt image

```yaml
services:
  api:
    image: myregistry.azurecr.io/myapp:latest
    host: containerapp
```

##### AKS with service level hooks

```yaml
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

## `resources`

_(object)_ Definition of Azure resources used by the application. Each key is a resource name, and the value is a resource configuration object. Resources can be referenced by services through the `uses` property.

### Common resource properties

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `type` | Y | string | The type of resource. See [Resource types](#resource-types). |
| `uses` | N | array | Other resources that this resource depends on. |
| `existing` | N | boolean | When set to `true`, this resource isn't created and instead is used for referencing purposes. Default: `false`. |

> [!TIP]
> See [Resources sample](#resources-sample) for a complete YAML example combining multiple resource types.

### Resource types

The `type` property determines the kind of Azure resource and controls which additional properties are available.

| Type value | Description | Additional properties |
| --- | --- | --- |
| `host.appservice` | Azure App Service web app | See [`host.appservice` properties](#hostappservice-properties). |
| `host.containerapp` | Docker-based container app | See [`host.containerapp` properties](#hostcontainerapp-properties). |
| `ai.openai.model` | A deployed, ready-to-use AI model | See [`ai.openai.model` properties](#aiopenaimodel-properties). |
| `ai.project` | A Microsoft Foundry project with models | See [`ai.project` properties](#aiproject-properties). |
| `ai.search` | Azure AI Search | See [`ai.search` properties](#aisearch-properties). |
| `db.postgres` | Azure Database for PostgreSQL | No extra properties. |
| `db.mysql` | Azure Database for MySQL | No extra properties. |
| `db.redis` | Azure Cache for Redis | No extra properties. |
| `db.mongo` | Azure Cosmos DB for MongoDB | No extra properties. |
| `db.cosmos` | Azure Cosmos DB for NoSQL | See [`db.cosmos` properties](#dbcosmos-properties). |
| `messaging.eventhubs` | Azure Event Hubs namespace | See [`messaging.eventhubs` properties](#messagingeventhubs-properties). |
| `messaging.servicebus` | Azure Service Bus namespace | See [`messaging.servicebus` properties](#messagingservicebus-properties). |
| `storage` | Azure Storage Account | See [`storage` properties](#storage-properties). |
| `keyvault` | Azure Key Vault | See [`keyvault` properties](#keyvault-properties). |

### `host.appservice` properties

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `port` | N | integer | Port that the web app listens on. Default: `80`. |
| `runtime` | Y | object | The language runtime configuration. See below. |
| `env` | N | array | Environment variables. Each item has `name` (required), `value`, and `secret` properties. Supports environment variable substitution. |
| `startupCommand` | N | string | Startup command that runs as part of web app startup. |
| `uses` | N | array of strings | Other resources that this resource uses. |

**`runtime` object:**

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `stack` | Y | string | The language runtime stack. Allowed values: `node`, `python`. |
| `version` | Y | string | The language runtime version. Format varies by stack (for example, `22-lts` for Node, `3.13` for Python). |

```yaml
resources:
  web:
    type: host.appservice
    port: 8080
    runtime:
      stack: node
      version: 22-lts
    uses:
      - db
```

### `host.containerapp` properties

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `port` | N | integer | Port that the container app listens on. Default: `80`. |
| `env` | N | array | Environment variables. Each item has `name` (required), `value`, and `secret` properties. Supports environment variable substitution. |
| `uses` | N | array of strings | Other resources that this resource uses. |

### `ai.openai.model` properties

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `model` | Conditional | object | The underlying AI model. Required when `existing` is `false`. |
| `existing` | N | boolean | When set to `true`, this resource isn't created and instead is used for referencing purposes. Default: `false`. |

**`model` object:**

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | Y | string | The name of the AI model. |
| `version` | Y | string | The version of the AI model. |

```yaml
resources:
  chatModel:
    type: ai.openai.model
    model:
      name: gpt-4o
      version: "2024-08-06"
```

### `ai.project` properties

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `models` | N | array | The AI models to be deployed as part of the AI project. |
| `existing` | N | boolean | When set to `true`, this resource isn't created and instead is used for referencing purposes. Default: `false`. |

**`models` array items:**

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | Y | string | The name of the AI model. |
| `version` | Y | string | The version of the AI model. |
| `format` | Y | string | The format of the AI model (for example, `Microsoft`, `OpenAI`). |
| `sku` | Y | object | The SKU configuration for the AI model. |

**`sku` object:**

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | Y | string | The name of the SKU (for example, `GlobalStandard`). |
| `usageName` | Y | string | The usage name of the SKU for billing purposes (for example, `OpenAI.GlobalStandard.gpt-4o-mini`). |
| `capacity` | Y | integer | The capacity of the SKU. |

### `ai.search` properties

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `existing` | N | boolean | When set to `true`, this resource isn't created and instead is used for referencing purposes. Default: `false`. |

### `db.cosmos` properties

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `containers` | N | array | Containers to store data. Each container stores a collection of items. |

**`containers` array items:**

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | Y | string | The name of the container. |
| `partitionKeys` | Y | array | The partition key(s) used to distribute data across partitions. Maximum 3 keys. Default: `/id`. |

### `messaging.eventhubs` properties

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `hubs` | N | array of strings | Hub names to create in the Event Hubs namespace. |
| `existing` | N | boolean | When set to `true`, this resource isn't created and instead is used for referencing purposes. Default: `false`. |

### `messaging.servicebus` properties

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `queues` | N | array of strings | Queue names to create in the Service Bus namespace. |
| `topics` | N | array of strings | Topic names to create in the Service Bus namespace. |
| `existing` | N | boolean | When set to `true`, this resource isn't created and instead is used for referencing purposes. Default: `false`. |

### `storage` properties

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `containers` | N | array of strings | Azure Storage Account container names. |
| `existing` | N | boolean | When set to `true`, this resource isn't created and instead is used for referencing purposes. Default: `false`. |

### `keyvault` properties

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `existing` | N | boolean | When set to `true`, this resource isn't created and instead is used for referencing purposes. Default: `false`. |

### Resources sample

```yaml
resources:
  db:
    type: db.postgres
  cache:
    type: db.redis
  chatModel:
    type: ai.openai.model
    model:
      name: gpt-4o
      version: "2024-08-06"
  web:
    type: host.containerapp
    port: 3100
    uses:
      - db
      - chatModel
```

## `pipeline`

_(object)_ Definition of continuous integration pipeline.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `provider` | N | string | The pipeline provider to be used for continuous integration. Default: `github`. Allowed values: `github`, `azdo`. |
| `variables` | N | array of strings | List of `azd` environment variables to be used in the pipeline as variables. |
| `secrets` | N | array of strings | List of `azd` environment variables to be used in the pipeline as secrets. |

```yaml
pipeline:
  provider: azdo
  variables:
    - CUSTOM_SETTING
  secrets:
    - API_KEY
```

## `hooks`

_(object)_ Command level hooks. Hooks should match `azd` command names prefixed with `pre` or `post` depending on when the script should execute. When specifying paths, they should be relative to the project path. See [Customize your Azure Developer CLI workflows using command and event hooks](./azd-extensibility.md) for more details.

Supported command hooks: `preprovision`, `postprovision`, `preinfracreate`, `postinfracreate`, `preinfradelete`, `postinfradelete`, `predown`, `postdown`, `preup`, `postup`, `prepackage`, `postpackage`, `prepublish`, `postpublish`, `predeploy`, `postdeploy`, `prerestore`, `postrestore`.

Each hook uses the [Hook definition](#hook-definition) format.

> [!TIP]
> See [Hook samples](#hook-samples) for complete YAML examples including platform-specific hooks, typed executors, and multiple hooks per event.

```yaml
hooks:
  preprovision:
    shell: sh
    run: ./scripts/setup.sh
  postdeploy:
    shell: sh
    run: azd env set APP_URL ${SERVICE_WEB_ENDPOINT_URL}
```

### Hook definition

A hook can be a single hook object or an array of hook objects. Each hook object has the following properties:

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `run` | Conditional | string | The inline script or relative path of your script. Required when specifying `shell`, `kind`, `dir`, `interactive`, `continueOnError`, `secrets`, or `config`. When specifying an inline script, you also must specify the `shell` to use. The shell is automatically inferred when using file paths. |
| `shell` | N | string | Type of shell to execute scripts. Default: `sh`. Allowed values: `sh`, `pwsh`. |
| `kind` | N | string | Executor kind for the hook script. When omitted, the kind is auto-detected from the file extension of the `run` path (for example, `.py` becomes `python`, `.ps1` becomes `pwsh`). Allowed values: `sh`, `pwsh`, `js`, `ts`, `python`, `dotnet`. |
| `dir` | N | string | Working directory for hook execution. Used as the project root for dependency installation and as the working directory when running the script. Relative paths are resolved from the project or service root. When omitted, defaults to the directory containing the script file. |
| `continueOnError` | N | boolean | Whether a script error halts the `azd` command. Default: `false`. |
| `interactive` | N | boolean | Whether the script runs in interactive mode, binding to `stdin`, `stdout`, and `stderr` of the running console. Default: `false`. |
| `windows` | N | object | When specified, overrides the hook configuration when executed in Windows environments. Uses the same hook object format. |
| `posix` | N | object | When specified, overrides the hook configuration when executed in POSIX (Linux and macOS) environments. Uses the same hook object format. |
| `secrets` | N | object | A map of `azd` environment variables to hook secrets. If a variable was set as a secret in the environment, the secret value is passed to the hook. |
| `config` | N | object | Executor-specific configuration. The available properties depend on the `kind` value. See [Hook executor configuration](#hook-executor-configuration). |

> [!NOTE]
> When both `windows` and `posix` are specified, the `run`, `shell`, `kind`, `dir`, `interactive`, `continueOnError`, `secrets`, and `config` properties can't be used at the top level. Use the platform-specific objects instead.

### Hook executor configuration

The `config` property accepts different properties depending on the `kind` value.

#### JavaScript and TypeScript (`js`, `ts`) config

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `packageManager` | N | string | The package manager to use for dependency installation. Overrides auto-detection from lock files. Allowed values: `npm`, `pnpm`, `yarn`. |

#### Python config

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `virtualEnvName` | N | string | The directory name for the Python virtual environment. Defaults to auto-detection (`.venv`, `venv`) or `{baseName}_env`. |

#### .NET (`dotnet`) config

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `configuration` | N | string | The MSBuild configuration for building the hook script (for example, `Debug`, `Release`). |
| `framework` | N | string | The target framework moniker for building and running the hook script (for example, `net8.0`, `net10.0`). |

#### Shell (`sh`, `pwsh`) config

Shell executors don't currently support `config` properties.

### Hook samples

#### Platform-specific hooks

```yaml
hooks:
  preprovision:
    windows:
      shell: pwsh
      run: ./scripts/setup.ps1
    posix:
      shell: sh
      run: ./scripts/setup.sh
```

#### Python hook with kind

```yaml
hooks:
  postprovision:
    kind: python
    run: ./scripts/seed-data.py
    dir: ./scripts
    config:
      virtualEnvName: .venv
```

#### Multiple hooks for a single event

```yaml
hooks:
  postprovision:
    - shell: sh
      run: ./scripts/step1.sh
    - shell: sh
      run: ./scripts/step2.sh
```

## `requiredVersions`

_(object)_ Provides additional configuration for required versions of `azd` and extensions.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `azd` | N | string | A range of supported versions of `azd` for this project. If the version of `azd` is outside this range, the project fails to load. Supports semver range syntax. |
| `extensions` | N | object | A map of required extensions and version constraints for this project. Supports semver constraints. If the version is omitted, the latest version is installed. |

```yaml
requiredVersions:
  azd: ">= 0.6.0-beta.3"
  extensions:
    azure.ai.agents: ">=1.0.0"
    my-extension: latest
```

## `state`

_(object)_ Provides additional configuration for state management.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `remote` | N | object | Provides additional configuration for remote state management. See [`state.remote`](#stateremote). |

### `state.remote`

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `backend` | Y | string | The remote state backend type. Default: `AzureBlobStorage`. Allowed values: `AzureBlobStorage`. |
| `config` | Conditional | object | Backend-specific configuration. Required when `backend` is `AzureBlobStorage`. See [Azure Blob Storage config](#azure-blob-storage-config). |

### Azure Blob Storage config

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `accountName` | Y | string | The Azure Storage account name. |
| `containerName` | N | string | The Azure Storage container name. Defaults to the project name if not specified. |
| `endpoint` | N | string | The Azure Storage endpoint. Default: `blob.core.windows.net`. |

```yaml
state:
  remote:
    backend: AzureBlobStorage
    config:
      accountName: mystorageaccount
      containerName: azd-state
```

## `platform`

_(object)_ Provides additional configuration for platform-specific features such as Azure Dev Center.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `type` | Y | string | The platform type. Allowed values: `devcenter`. |
| `config` | N | object | Platform-specific configuration. See [Dev Center config](#dev-center-config). |

### Dev Center config

Available when `type` is `devcenter`:

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | N | string | The name of the Azure Dev Center. Used as the default dev center for this project. |
| `project` | N | string | The name of the Azure Dev Center project. |
| `catalog` | N | string | The name of the Azure Dev Center catalog. |
| `environmentDefinition` | N | string | The name of the Dev Center catalog environment definition. |
| `environmentType` | N | string | The Dev Center project environment type used for the deployment environment. |

```yaml
platform:
  type: devcenter
  config:
    name: my-devcenter
    project: my-project
    catalog: my-catalog
    environmentDefinition: my-env-def
    environmentType: dev
```

## `workflows`

_(object)_ Provides additional configuration for workflows such as overriding `azd up` behavior.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `up` | N | object or array | When specified, overrides the default behavior for the `azd up` workflow. |

### Workflow steps

The `up` workflow accepts a `steps` array (or can be specified directly as an array). Each step runs an `azd` command.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `azd` | Y | string or object | The `azd` command to execute. Can be a string (for example, `provision`) or an object with an `args` array. |

### Configure workflow step order

The following `azure.yaml` file changes the default behavior of `azd up` to move the `azd package` step after the `azd provision` step. Use this approach in scenarios where you need to know the URLs of resources during the build or packaging process.

```yaml
name: todo-nodejs-mongo
metadata:
  template: todo-nodejs-mongo@0.0.1-beta
workflows:
  up:
    steps:
      - azd: provision
      - azd: package
      - azd: deploy --all
```

## `cloud`

_(object)_ Provides additional configuration for deploying to sovereign clouds such as Azure Government. The default cloud is `AzureCloud`.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | N | string | The cloud environment name. Allowed values: `AzureCloud`, `AzureChinaCloud`, `AzureUSGovernment`. |

```yaml
cloud:
  name: AzureUSGovernment
```

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

- [Customize workflows using command and event hooks](./azd-extensibility.md)
- [Azure Developer CLI templates overview](./azd-templates.md)
- [Use Terraform as an IaC provider](./use-terraform-for-azd.md)
- [Manage environment variables](./manage-environment-variables.md)

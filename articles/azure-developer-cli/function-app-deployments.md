---
title: Deploy to Azure Functions with azd
description: Learn how Azure Developer CLI deploys code and containers to Azure Functions, how to configure azure.yaml, and what infrastructure your Function App requires.
ms.date: 10/26/2026
ms.service: azure-dev-cli
ms.topic: concept-article
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
#customer intent: As an azd user, I want to configure and deploy an Azure Functions service from code or a container image, so that I can choose the correct deployment mode and provision compatible infrastructure.
---

# Deploy to Azure Functions with Azure Developer CLI

Azure Developer CLI (`azd`) supports code and container deployments to Azure Functions. Use the dedicated `function` host in `azure.yaml` for both modes:

- **Code deployment** packages your built function code as a zip archive and uploads it to the Function App.
- **Container deployment** builds or resolves a container image, publishes it to Azure Container Registry (ACR) when needed, and updates the Function App to run the image.

Azure Functions and Azure App Service both use the `Microsoft.Web/sites` resource provider, and their container deployment flows share some internal mechanics. However, they aren't the same `azd` host. Functions uses `host: function`, has Functions-specific packaging and remote-build behavior, and doesn't use the App Service deployment-slot workflow.

## Choose a deployment mode

`azd` selects the deployment mode from the service configuration:

| Configuration | Deployment mode |
| --- | --- |
| A source `project` with a supported non-Docker `language` and no `docker.path` | Code deployment |
| `language: docker` | Container deployment |
| A `docker.path` value with a source language | Container deployment |
| A prebuilt `image` | Container deployment |

The provisioned Function App must use the same mode as the service configuration. If the Function App is configured for containers but `azure.yaml` selects code deployment, or the reverse, `azd deploy` stops before uploading and reports the mismatch.

## Deploy function code

Configure a code-based function service with a source project, supported language, and `host: function`:

```yaml
services:
  api:
    project: ./src/api
    language: ts
    host: function
```

During `azd deploy`, `azd` builds the project, applies `.funcignore` exclusions, creates a zip archive, and uploads the package through the Azure Functions deployment API.

Your Bicep or Terraform must provision a code-based Function App and tag it with `azd-service-name` set to the service name, unless you identify the resource by using `resourceName` in `azure.yaml`. Configure the hosting plan, runtime, storage, identities, networking, and application settings through infrastructure as code.

### Configure remote builds for code deployments

The top-level service `remoteBuild` property applies only to code-based Function Apps on the Flex Consumption plan. It controls whether Azure Functions uses Oryx to build the uploaded package:

```yaml
services:
  api:
    project: ./src/api
    language: python
    host: function
    remoteBuild: true
```

When you omit `remoteBuild` on Flex Consumption, `azd` selects a default based on the language and package contents:

| Language | Default behavior |
| --- | --- |
| JavaScript or TypeScript | Uses remote build when `.funcignore` excludes `node_modules`, or when no `.funcignore` file exists. Otherwise, uses the locally built package. |
| Python | Uses remote build. |
| Go | Builds locally. Go Function Apps don't support remote build. |
| Other supported languages | Uses the locally built package. |

For JavaScript and TypeScript, an explicitly configured `remoteBuild` value must agree with `.funcignore` when that file exists. Set `remoteBuild: true` when `.funcignore` excludes `node_modules`. Set `remoteBuild: false` when `.funcignore` includes `node_modules` in the package.

Don't set the top-level `remoteBuild` property for non-Flex plans. To enable an Oryx build on another supported plan, configure `ENABLE_ORYX_BUILD=true` and `SCM_DO_BUILD_DURING_DEPLOYMENT=true` as Function App settings in your infrastructure.

## Deploy a containerized function

For a source project with a Dockerfile, set `language: docker`, or keep the source language and specify `docker.path`.

The following example uses a TypeScript project with a Dockerfile:

```yaml
services:
  api:
    project: ./src/api
    language: ts
    host: function
    docker:
      path: ./Dockerfile
```

You can also deploy a prebuilt image without a local project:

```yaml
services:
  api:
    host: function
    image: myregistry.azurecr.io/functions/api:1.0
```

For a prebuilt image, omit `language` or set it to `docker`. Don't combine `image` with `project`.

During a container deployment, `azd`:

1. Builds the image locally or remotely, or resolves the configured prebuilt image.
1. Publishes the image to the ACR instance configured for the project when publishing is required.
1. Updates the Function App's `linuxFxVersion` to `DOCKER|<image>`.
1. Deploys to the main Function App site.

The top-level service `remoteBuild` property doesn't apply to containers. To build a container image with ACR Tasks, use `docker.remoteBuild`:

```yaml
services:
  api:
    project: ./src/api
    language: docker
    host: function
    docker:
      path: ./Dockerfile
      remoteBuild: true
```

### Provision a container-ready Function App

`azd deploy` updates the image reference but doesn't convert a code-based Function App into a container-based Function App. Your infrastructure must provision a compatible site before deployment.

| Requirement | Details |
| --- | --- |
| Linux Function App | Provision a Linux Function App on an Azure Functions Premium or Dedicated (App Service) plan. Flex Consumption doesn't support custom containers. This `host: function` workflow targets `Microsoft.Web/sites`, not Azure Functions hosted on Azure Container Apps. |
| Container site configuration | Set the site kind to include `functionapp`, `linux`, and `container`. Initialize `linuxFxVersion` with a `DOCKER\|<image>` value. A placeholder image is sufficient because `azd deploy` replaces it. |
| Container registry | For source builds, provision an ACR instance and expose its login server through the `AZURE_CONTAINER_REGISTRY_ENDPOINT` infrastructure output, or configure `docker.registry` for the service. A fully qualified prebuilt `image` can be used directly without a separate publishing registry. |
| Registry access | Grant the identity that publishes the image permission to push to the destination registry when publishing is required. Separately, configure the Function App to pull the deployed image. For private ACR images, grant the Function App's managed identity pull access and configure the site to use managed identity credentials. For another private registry, configure the appropriate pull credentials in your infrastructure. |
| Function settings | Configure required settings such as `FUNCTIONS_EXTENSION_VERSION`, `FUNCTIONS_WORKER_RUNTIME`, and `AzureWebJobsStorage` through Bicep or Terraform. |
| Resource discovery | Apply an `azd-service-name` tag whose value matches the service name in `azure.yaml`, or set `resourceName` explicitly. |

Service-level `env` settings aren't supported for the `function` host. Define Function App settings in your infrastructure instead.

## Understand deployment slots

`azd` always deploys a `function` service to the main Function App site. It doesn't discover, prompt for, or deploy to Function App slots. App Service slot settings such as `AZD_DEPLOY_{SERVICE}_SLOT_NAME` don't affect a Function App deployment.

If you need a slot-based Functions release process, manage the slot and deployment outside the built-in `host: function` workflow.

## Compare Functions and App Service hosts

Functions and App Service share the `Microsoft.Web/sites` resource type, but select the host that matches the workload:

| Behavior | `function` host | `appservice` host |
| --- | --- | --- |
| Workload | Event-driven Azure Functions | Web apps and APIs |
| Code deployment | Uses the Azure Functions zip deployment flow | Uses the App Service deployment flow |
| Container deployment | Updates the Function App image after validating that the site is container-based | Updates the Web App image after validating that the site is container-ready |
| Remote code build | Supports the service-level `remoteBuild` option for Flex Consumption Function Apps | Doesn't use the Functions `remoteBuild` option |
| Deployment slots | Always deploys to the main site | Supports the `azd` App Service slot workflow |
| Service-level `env` | Not supported; use Function App settings in infrastructure | Configure app settings in infrastructure |

## Related content

- [Azure Functions hosting options](/azure/azure-functions/functions-scale)
- [Create functions in custom containers](/azure/azure-functions/functions-how-to-custom-container)
- [Azure Developer CLI schema reference](./azd-schema.md)
- [Configure service packaging file exclusions](./service-packaging-ignore-files.md)
- [Use Docker support to deploy containerized apps in any language](./docker-language-support.md)

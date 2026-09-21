---
title: Edit Azure Developer CLI Template Files
description: Explore and edit azure.yaml, infrastructure-as-code files, and other assets in an Azure Developer CLI template to provision and deploy your app.
ms.date: 09/11/2026
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep
ai-usage: ai-generated
---

# Explore and edit Azure Developer CLI template files

An Azure Developer CLI (`azd`) template is a standard repository with configuration and infrastructure assets that enable `azd` to provision and deploy a project. Whether you build a new template or start from an existing one, you remain responsible for reviewing and maintaining its files as the project evolves.

This article explains how to inspect and edit the primary template files. For a conceptual description of the complete structure, see [Azure Developer CLI templates](azd-templates.md).

This article uses the [hello-azd](https://github.com/Azure-Samples/hello-azd) template as a standardized example so you can see what each file does in a real project. The same concepts apply to templates you generate for your own apps. To follow along, initialize the template in an empty directory:

```azdeveloper
azd init --template hello-azd
```

The `hello-azd` template deploys a containerized C# app to Azure Container Apps and provisions the supporting Azure resources through Bicep. It uses a folder structure like the following, where each primary asset maps to a section in this article:

```text
.
├── azure.yaml                # Project configuration (Explore azure.yaml)
├── infra/                    # Infrastructure as code (Infrastructure files)
│   ├── main.bicep            # Deployment entry point
│   ├── main.parameters.json  # Parameter values that azd supplies
│   ├── abbreviations.json    # Resource name abbreviations
│   ├── app/                  # Application-specific modules
│   └── core/                 # Reusable resource modules
├── src/                      # Application source code (Source code)
│   └── Dockerfile            # Container image build for the app
├── .azure/                   # Environment configuration
└── README.md
```

The exact structure varies by project, and `azure.yaml` identifies the paths that `azd` uses. The following sections describe how to edit each asset.

Before making substantial changes, commit or otherwise save a known-good version of the template. Review all changes for embedded credentials, unnecessary resources, excessive permissions, network exposure, service tiers, and environment-specific values.

## Explore `azure.yaml`

The `azure.yaml` file defines the project and tells `azd` how to provision infrastructure, package application code, and deploy each service. It can define services, infrastructure settings, hooks, workflows, and other project behavior.

The `hello-azd` template defines a single service named `aca`:

```yaml
name: azd-starter
metadata:
  template: hello-azd-dotnet
services:
  aca:
    project: ./src
    language: csharp
    host: containerapp
    docker:
      path: ./Dockerfile
      remoteBuild: true
```

Each property tells `azd` how to handle the service:

- `aca` is the service name. `azd` uses it to match the service to the Azure resource that hosts it. For more information, see [Configure service discovery](#configure-service-discovery).
- `project: ./src` points to the application source code that `azd` packages and deploys.
- `language: csharp` identifies the application language.
- `host: containerapp` tells `azd` to deploy the service to Azure Container Apps.
- `docker` builds the container image from the `Dockerfile` in the `src` directory.
- `remoteBuild` tells `azd` to use Azure Container Registry (ACR) to build the container image.

### Add a service definition

Add an entry under `services` for each additional application that `azd` should deploy. A service definition specifies its source directory, language, and Azure hosting target. For example, to describe a new API project:

```yaml
services:
  api:
    project: ./src/api
    language: csharp
    host: appservice
```

When you move application code, update the corresponding `project` path. When you change the hosting architecture, update both the service definition and the infrastructure that provisions the host.

For all available properties and supported values, see the [`azure.yaml` schema](azd-schema.md).

## Source code

Application source is optional. Templates with deployable applications often organize source code under the `src` directory, but you don't need to use a specific folder name or layout. The `project` property for each service in `azure.yaml` tells `azd` where its source code lives.

In `hello-azd`, the `aca` service sets `project: ./src`, so `azd` packages the C# app in the `src` directory and deploys it to Azure Container Apps. Because the service also sets a `docker` configuration, `azd` builds the container image from the `Dockerfile` in the `src` directory before deployment.

`azd` supports Node.js, Python, .NET, Java, and Go on supported Azure hosts. A template can also deploy containers. For current language, framework, and host combinations, see [Supported languages and environments](supported-languages-environments.md).

Edit source code as you would in any application repository. If you add a service or move its source directory, update its `azure.yaml` service definition. If the application needs a new Azure resource, update the infrastructure and pass the required endpoint or resource name to the application through configuration.

### Change a service source directory

For example, if you move the `hello-azd` app from `src` to `src/app`, update the `project` value of the `aca` service:

```yaml
services:
  aca:
    project: ./src/app
    language: csharp
    host: containerapp
    docker:
      path: ./Dockerfile
      remoteBuild: true
```

## Infrastructure files

The `infra` directory contains the Bicep or Terraform files that define the Azure resources for the template. In `hello-azd`, the `infra` directory uses Bicep and includes the following key assets:

- `main.bicep` is the standard deployment entry point that `azd` runs to provision resources.
- `main.parameters.json` supplies the parameter values for `main.bicep`.
- `app` contains modules specific to the application.
- `core` contains reusable modules for common resources, such as storage and hosting.

### How `main.bicep` runs during `azd up`

When you run `azd up`, the provision phase deploys `infra/main.bicep`. In `hello-azd`, `main.bicep` targets the subscription scope, creates a resource group, and then calls modules to provision the resources the app needs:

```bicep
targetScope = 'subscription'

// Create a storage account
module storage './core/storage/storage-account.bicep' = {
  name: 'storage'
  scope: rg
  params: {
    name: !empty(storageAccountName) ? storageAccountName : '${abbrs.storageStorageAccounts}${resourceToken}'
    location: location
    tags: tags
    allowSharedKeyAccess: false
    containers: [ { name: 'attachments' } ]
    tables: [ { name: 'tickets' } ]
  }
}

// Container app for the 'aca' service
module web 'app/app.bicep' = {
  name: serviceName
  scope: rg
  params: {
    // ...
    serviceName: serviceName
  }
}
```

The `main.bicep` file provisions a user-assigned managed identity, an Azure Storage account, an Azure Container Apps environment and registry, and the container app that hosts the `aca` service. It also assigns the roles that let the managed identity access storage. Modules keep each resource in its own file so `main.bicep` stays readable.

### Add a resource to `main.bicep`

Add resource declarations directly to `infra/main.bicep` for simple or one-off resources. Factor resources into separate Bicep modules when you reuse them, when a resource needs several related resources, or when you want to keep `main.bicep` readable. Like `hello-azd`, many templates group reusable modules under `infra/core`.

For common Azure resources, prefer an [Azure Verified Module](https://aka.ms/avm) over authoring a module from scratch. Verified modules are Microsoft-maintained, follow security and reliability best practices, and reduce the amount of infrastructure code you maintain in the template.

For a full walkthrough that adds a new resource to `hello-azd`, see [Extend a template](extend-template.md).

The `main.parameters.json` file maps the values that `azd` maintains into the Bicep parameters. The `hello-azd` template uses the following parameters:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "environmentName": { "value": "${AZURE_ENV_NAME}" },
    "location": { "value": "${AZURE_LOCATION}" },
    "principalId": { "value": "${AZURE_PRINCIPAL_ID}" },
    "principalType": { "value": "${AZURE_PRINCIPAL_TYPE=User}" }
  }
}
```

Each entry binds a Bicep parameter to a value that `azd` maintains in the environment, such as the environment name, location, and the principal that runs the deployment. Use `main.parameters.json` for values that vary by environment or deployment, such as the environment name, location, or resource names that `azd` generates. Keep stable values that don't change between environments as parameter defaults or literals in `main.bicep`. This approach keeps the same Bicep reusable across environments without editing it for each deployment.

When you add or edit infrastructure:

- Keep resource configuration environment independent. Use parameters and `azd` environment values instead of embedding subscription IDs, resource names, locations, or credentials.
- Use secure outputs for sensitive values, and don't expose secrets as plain-text deployment outputs.
- Apply least-privilege role assignments to managed identities.
- Keep service definitions in `azure.yaml` aligned with the resources they target.
- Review the effects of service tiers, scaling limits, redundancy, and retention settings on cost.

For Bicep language and module guidance, see the [Bicep documentation](/azure/azure-resource-manager/bicep/). For Terraform-based templates, see [Use Terraform with Azure Developer CLI](use-terraform-for-azd.md).

### Configure service discovery

By default, `azd` discovers the Azure resource for a service by finding the resource whose `azd-service-name` tag matches the service name in `azure.yaml`. If you rename a service, update the corresponding resource tag or explicitly configure the resource name in `azure.yaml`.

For example, in `hello-azd` the `aca` service name matches the `azd-service-name` tag on the container app resource. The `azure.yaml` service definition sets the name:

```yaml
services:
  aca:
    project: ./src
    language: csharp
    host: containerapp
```

The container app module in `infra/app/app.bicep` applies the matching tag:

```bicep
tags: union(tags, { 'azd-service-name': serviceName })
```

### Configure a nonstandard infrastructure path

The `infra` section of `azure.yaml` identifies the infrastructure provider and entry point. These values are optional when you use the default Bicep layout, but declaring them can make a nonstandard layout easier to understand:

```yaml
infra:
  provider: bicep
  path: infra
  module: main
```

## Environment configuration

The `.azure` directory contains local environment state and values that `azd` creates, such as the selected subscription, location, resource names, and deployment outputs. Treat this directory as local state rather than a reusable template asset. Don't commit environment files that contain secrets or environment-specific values.

### Add infrastructure outputs

When you run `azd provision` to deploy Bicep, it captures outputs from the infrastructure entry point as `azd` environment values. Add outputs for resource endpoints, resource names, and managed identity client IDs that application services or hooks need. For example, `hello-azd` outputs the container registry and managed identity details from `main.bicep`:

```bicep
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerAppsEnv.outputs.registryLoginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerAppsEnv.outputs.registryName
output AZURE_USER_ASSIGNED_IDENTITY_NAME string = identity.outputs.name
```

Don't output secrets when a managed identity or Key Vault reference can provide access instead. After provisioning, inspect captured values by running `azd env get-values`.

For more information, see [Manage environment variables](manage-environment-variables.md).

## Test your changes

Run `azd up` to provision the infrastructure and deploy any application services:

```azdeveloper
azd up
```

If you intend to share the template, initialize it in a clean directory and deploy it with a new environment. This test helps identify local files, cached values, or environment-specific assumptions that aren't part of the template.

## Related content

- [Template development overview](build-templates-overview.md)
- [Start with a new template](start-with-new-template.md)
- [Start from an existing template](start-with-existing-template.md)
- [Extend a template](extend-template.md)
- [Explore the `azd up` workflow](azd-up-workflow.md)

[!INCLUDE [request-help](includes/request-help.md)]

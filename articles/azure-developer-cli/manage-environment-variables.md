---
title: Manage environment variables
description: How to manage environment variables
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/11/2023
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep
---

# Manage environment variables

Environment variables are used to specify certain configurations for `azd` templates. These configurations can influence how resources are provisioned and deployed to Azure and how your CI/CD pipeline is setup.

## Input Parameters Substitution

Environment variables can be referenced in parameter files (`*.parameters.json` for Bicep, `*.tfvars.json` for Terraform) as part of provisioning. When an environment variable substitution syntax is encountered, `azd` will automatically substitute the reference with the actual environment variable value set. Substitution also occurs for certain configuration settings in `azure.yaml` (properties documented field 'Supports environment variable substitution'), and in deployment configuration files, such as deployment manifests for `aks`.

### Example: Input parameter substitution (Bicep)

Suppose that you have the environment variable `AZURE_LOCATION` set:

```bash
export AZURE_LOCATION=westus3
```

```powershell
$env:AZURE_LOCATION='westus3'
```

In the `main.parameters.json` file, you can reference `AZURE_LOCATION` and allow for environment substitution using the following syntax:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "value": "${AZURE_LOCATION}"
    }
  }
}
```

### Provide default values

To set `location` to the value `eastus2` if `AZURE_LOCATION` is not set, the syntax `${AZURE_LOCATION=eastus2}` can be used. For more details on the syntax, visit the [environment substitution](https://github.com/a8m/envsubst#docs) for Go.

## Environment-specific `.env` file

Outputs for infrastructure provisioning are automatically stored as environment variables in an `.env` file, located under `.azure/<environment name>/.env`. This allows for a local application, or deployment scripts, to leverage variables stored in the `.env` file to reference Azure-hosted resources if needed. To see these outputs, run `azd env get-values`, or `azd env get-values --output json` for JSON output.

### Environment variables provided by `azd`

The following are variables that are automatically provided by `azd`:

| Name  | Description  | Examples  | When available  |
|---------|---------|---------|---------|
|`AZURE_ENV_NAME`     | The name of the environment in-use.       | `todo-app-dev`        | When an environment is created (i.e. after running azd init or azd env new).        |
|`AZURE_LOCATION`     | The location of the environment in-use.        |  `eastus2`        |  Right before an environment is provisioned for the first time.       |
|`AZURE_PRINCIPAL_ID`     | The running user/service principal.       | `925cff12-ffff-4e9f-9580-8c06239dcaa4`        | Determined automatically during provisioning (ephemeral).        |
|`AZURE_SUBSCRIPTION_ID`    | The targeted subscription.       |  `925cff12-ffff-4e9f-9580-8c06239dcaa4`       | Right before an environment is provisioned for the first time.
|`SERVICE_<service>_IMAGE_NAME`     | The full name of the container image published to Azure Container Registry for containerapp services.        | `todoapp/web-dev:azdev-deploy-1664988805`        | After a successful publishing of a `containerapp` image        |

## User-provided environment variables

These are variables that can be declared as an infrastructure output parameter (which is automatically stored in `.env`), or set directly by the user in the environment (`azd env set <key> <value>`). `azd` will read the values as configuration and perform differently.

| Name  | Description  | Examples  | Effects  |
|---------|---------|---------|---------|
|`AZURE_AKS_CLUSTER_NAME`     | The name of the Azure Kubernetes Service cluster to target.     |   `aks-my-cluster`      |  Required property for deployment of an aks service.       |
|`AZURE_RESOURCE_GROUP`    | The specific resource group to target. Type string.   |  `rg-todo-dev`       | `azd` will not perform resource group discovery, and instead references this resource group. Note that azd does not control the authored IaC configuration files, thus changes to IaC files may be needed. |
|`AZURE_CONTAINER_REGISTRY_ENDPOINT`     | The Azure Container Registry endpoint to publish docker image. Type string.        |  `myexampleacr.azurecr.io`      |  Required property for deployment of a `containerapp` or `aks` service.        |
|`SERVICE_<service>_ENDPOINTS`    | The endpoints for the particular service. Type `array` (bicep) / `list-equivalent` (terraform).      | `['endpoint1', 'endpoint2']`      | Sets the public endpoints for the particular service will be used by azd for display. By default, azd discovers the automatically assigned hostnames for a given host. i.e. `*.azurewebsites.net` for `appservice`.        |

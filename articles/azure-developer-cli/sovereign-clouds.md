---
title: Use Azure Developer CLI in sovereign clouds
description: Configure the Azure Developer CLI (azd) for use in sovereign clouds
author: alexwolfmsft
ms.author: alexwolf
ms.date: 01/18/2024
ms.topic: how-to
ms.service: azure-dev-cli
ms.custom: devx-track-terraform
---

# Use Azure Developer CLI in sovereign clouds

This guide explains how to configure the Azure Developer CLI to provision resources and deploy applications in different clouds.

The Azure Developer CLI supports the following clouds:

* Azure Public (`AzureCloud`) default
* Azure China Cloud (`AzureChinaCloud`)
* Azure US Government (`AzureUSGovernment`)

The Azure Public cloud is the default and will be used if no cloud is specified.

## Authentication

When switching between clouds, run `azd auth login` to authenticate with the set cloud.

The following example sets a sovereign cloud and runs `azd auth login` to authenticate with that cloud:

```bash
azd config set cloud.name AzureUSGovernment
azd auth login
```

## Cloud configurations

Clouds can be configured at the user, project, or environment level. The order of configuration precedence is:

1. **Environment configuration** is selected first
1. If no cloud is confiugred in the environment, the **project configuration** (azure.yaml) is used
1. If no cloud is set in the project configuration, the **user configuration** (`azd config set`) is used
1. If no cloud is set in the user configuration azd uses the public `AzureCloud`

### Configure clouds with user settings (azd config set)

Set the cloud for all `azd` operations using `azd config`

```bash
azd config set cloud.name AzureCloud
```

```bash
azd config set cloud.name AzureChinaCloud
```

```bash
azd config set cloud.name AzureUSGovernment
```

### Configure clouds in the project's azure.yaml file

Use the `cloud` object to set the name of the cloud in the project's azure.yaml file.

```yaml
name: project-name
cloud:
  name: AzureCloud
# ...
```

```yaml
name: project-name
cloud:
  name: AzureChinaCloud
# ...
```

```yaml
name: project-name
cloud:
  name: AzureUSGovernment
# ...
```

### Configure clouds in an environment's config.json file

Configure cloud for specific environments by updating the environment configuration file in `.azure/<environment-name>/config.json`. This enables, for example, deployment in different clouds for different environments.

```json
{
    "cloud": {
        "name": "AzureCloud"
    }
}
```

```json
{
    "cloud": {
        "name": "AzureChinaCloud"
    }
}
```

```json
{
    "cloud": {
        "name": "AzureUSGovernment"
    }
}
```

## Supported commands and platforms

Supported commands include

* auth
* config
* deploy
* down
* env
* provision
* up
* monitor
* show

`azd pipeline` is not supported in Sovereign Clouds.

`devcenter` platform is not supported in Sovereign Clouds.

## Deploying with Terraform

When deploying to a sovereign cloud using `azd` and Terraform, the `az` CLI must also be configured to use the desired cloud. See Terraform's [Authenticating using the Azure CLI](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/azure_cli) documentation.

Set the environment variable `ARM_ENVIRONMENT` to the desired environment. Common values include:

* `public` (default)
* `usgovernment`
* `china`

Select the appropriate cloud using the `az` CLI:

```bash
az cloud set --name AzureCloud
```

```bash
az cloud set --name AzureChinaCloud
```

```bash
az cloud set --name AzureUSGovernment
```

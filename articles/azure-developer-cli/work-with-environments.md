---
title: Work with environments in Azure Developer CLI
description: Learn how to create, manage, and switch between different environments using Azure Developer CLI (azd).
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/04/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Work with Azure Developer CLI environments

The Azure Developer CLI (`azd`) lets you manage multiple deployment environments for your projects, to keep configurations separate for development, testing, and production. This article explains how to create, manage, and switch between environments to manage your development and deployment process.

## What are environments?

An environment in the Azure Developer CLI (`azd`) context represents a named collection of configuration settings, environment variables, and infrastructure parameters associated with a specific deployment of your application. Environments serve several important purposes:

- **Isolation**: Keep development, testing, staging, and production deployments separate.
- **Configuration management**: Maintain different settings for each environment.
- **Collaboration**: Enable team members to work with their own environments.
- **Resource organization**: Group and provision Azure resources by environment, such as using lower tier services for dev environments.
- **Reproducibility**: Ensure consistent deployments across different stages.

Each environment has its own Azure resource group and configuration settings. The environment name typically follows the pattern `rg-<environment-name>`, but this is not enforced by `azd` and is configurable by the user. This environment isolation helps prevent changes in one environment from affecting others.

### Environment structure and configuration files

Azure Developer CLI (`azd`) environments live in a directory structure within your project:

```txt
├── .azure                          [Created when you run azd init or azd up]
│   ├── <environment-name-1>        [Directory for environment-specific configurations]
│   │   ├── .env                    [Environment variables for this environment]
│   │   └── main.parameters.json    [Infrastructure parameters for this environment]
│   ├── <environment-name-2>        [Another environment]
│   │   ├── .env                    
│   │   └── main.parameters.json    
│   └── config.json                 [Global azd configuration]
```

The key components of this structure are:

1. **`.azure` directory**: The root directory for all environment configurations. Excluded from source control by the `.gitignore` file by default.
2. **Environment-specific directories**: Directories named after your environments, such as `dev`, `test`, `prod`.
3. **`.env` file**: Contains environment-specific variables used by your application and during deployment.
4. **`main.parameters.json`**: Contains parameters commonly used during infrastructure provisioning with Bicep or Terraform, but can be used for any per-environment `azd` configuration. This file is not intended to be used directly by end users.

## Environment variables

Azure Developer CLI [Environment variables](manage-environment-variables.md) provide a way to store configuration settings that influence and might vary between environments. When you run Azure Developer CLI commands, these variables are used to:

- Configure your application's settings
- Define infrastructure parameters
- Store connection strings, endpoints, and secrets

The `.env` file contains these variables in a standard format:

```output
AZURE_ENV_NAME=dev
AZURE_LOCATION=eastus
AZURE_SUBSCRIPTION_ID=00000000-0000-0000-0000-000000000000
RESOURCE_TOKEN=12345
AZURE_RESOURCE_GROUP=rg-dev-12345
SERVICE_WEB_HOSTNAME=web-dev-12345.azurewebsites.net
SERVICE_API_HOSTNAME=api-dev-12345.azurewebsites.net
```

Common environment variables include:

| Variable | Description |
|----------|-------------|
| `AZURE_ENV_NAME` | Name of the current environment |
| `AZURE_LOCATION` | Azure region where resources are deployed |
| `AZURE_SUBSCRIPTION_ID` | ID of the Azure subscription used for this environment |
| `AZURE_RESOURCE_GROUP` | Name of the resource group for this environment |

> [!TIP]
> For other common environment variables and service-specific examples, visit the [Environment variables](manage-environment-variables.md) documentation.

When working with environment variables:

- Avoid committing `.env` files to source control. If environment configuration needs to be persisted or shared, users should leverage [Remote environments](remote-environments-support.md).
- Use consistent naming across environments.
- Use the `azd env set` command to update variables safely.

> [!WARNING]
> Never store secrets in an Azure Developer CLI `.env` file. These files can easily be shared or copied into unauthorized locations, or checked into source control. Use services such as Azure Key Vault or Azure Role Based Access Control (RBAC) for protected or secretless solutions.

### Use the environment name in infrastructure files

You can use the `AZURE_ENV_NAME` variable from your environment's `.env` file to customize your infrastructure deployments in Bicep. This is useful for naming, tagging, or configuring resources based on the current environment.

1. The `AZURE_ENV_NAME` environment variable is set by `azd` when you initialize a project.

    ```output
    AZURE_ENV_NAME=dev
    ```

1. In your `main.parameters.json` file, reference the environment variable so `azd` will substitute its value:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "environmentName": {
          "value": "${AZURE_ENV_NAME}"
        }
      }
    }
    ```

    When you deploy with `azd`, the value from `.env` will be passed to your Bicep file from `main.parameters.json`.

1. In your Bicep template, define a parameter for the environment name:

    ```bicep
    param environmentName string
    ```

1. You can use the `environmentName` parameter to tag resources, making it easy to identify which environment a resource belongs to:

    ```bicep
    param environmentName string
    
    resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
      name: 'mystorage${uniqueString(resourceGroup().id)}'
      location: resourceGroup().location
      sku: {
        name: 'Standard_LRS'
      }
      kind: 'StorageV2'
      tags: {
        Environment: environmentName
        Project: 'myproject'
      }
    }
    ```

This approach helps with resource management, cost tracking, and automation by associating each resource with its deployment environment.

## Compare other framework environments

Many programming frameworks and tools such as Node.js, Django, or React use `.env` files for configuration. While Azure Developer CLI (`azd`) also uses `.env` files, there are important differences:

| Concept | Azure Developer CLI `.env` | Framework `.env` Files |
|--------|---------------------------|------------------------|
| **Location** | Stored in `.azure/<environment-name>/.env` | Typically stored in project root directory |
| **Environment Support** | Support for multiple user-defined environments (dev, test, prod) | Often require manual file switching or naming conventions (`.env.development`, `.env.production`) |
| **Loading Mechanism** | Automatically loaded by `azd` commands | Usually require explicit loading in application code or build scripts |
| **Integration** | Deeply integrated with Azure services and resource provisioning | General purpose configuration, not Azure-specific |
| **Variable Management** | Managed via `azd env` commands | Typically edited manually or via custom scripts |

While both serve similar purposes, Azure Developer CLI's `.env` approach adds structure and tooling designed for managing multiple deployment environments and Azure resources.

> [!NOTE]
> If your project already uses framework-specific `.env` files, you can keep both configuration systems without conflicts.
>
> `azd` environment variables override system environment variables of the same name for some operations.

## Create and manage environments

The Azure Developer CLI provides a set of commands to manage environments, such as creating, updating or switching between them. You can run these commands in specific environments without affecting others.

### Create environments

Create a new environment using the `azd env new` command:

```azdeveloper
azd env new <environment-name>
```

For example, to create a development environment:

```azdeveloper
azd env new dev
```

When you run a command such as `azd up` or `azd deploy`, you'll be prompted to select an Azure subscription and location for the new environment. Prompt settings are stored in the new environment `.env` or `config.json` files.

You can also specify subscription and location directly in the command:

```azdeveloper
azd env new prod --subscription "My Production Subscription" --location eastus2
```

### List environments

To see all available environments for your project, use:

```azdeveloper
azd env list
```

This command displays all the environments you created, highlighting the current active environment:

```output
NAME      DEFAULT   LOCAL     REMOTE
dev       true      true      false
test      false     true      false
prod      false     true      false
```

### Switch between environments

To switch to a different environment, use the `azd env select` command:

```azdeveloper
azd env select <environment-name>
```

For example, to switch to a production environment:

```azdeveloper
azd env select prod
```

> [!NOTE]
> This command changes your active environment, which affects subsequent `azd` commands like `provision` or `deploy`.

### Understand the default environment

The global configuration file `.azure/config.json` keeps track of your currently selected environment. When you run `azd init` and no environments exist yet, `azd` automatically creates your first environment and sets it as the default. If you already have one or more environments and run `azd env new <name>`, you'll be prompted to choose whether to make the new environment the default. If you decline, the new environment is created but your current selection remains unchanged.

You can temporarily override the default environment for a single command by using the `--environment` flag. This does not change the default for future commands—only for that specific

### Refresh environment settings

You can refresh your local environment variables using the `azd env refresh` command. This command locates the most recent Azure deployment for your app, retrieves the environment variable values by name, and then updates your local `.env` file with those latest values for the select environment. For example, if you provisioned both a `dev` and `prod` version, and you currently have the `dev` environment selected, it will retrieve lates outputs from that deployment to populate the .env file.

```azdeveloper
azd env refresh
```

> [!NOTE]
> The `azd env refresh` command doesn't redeploy resources. It only updates your local environment configuration to match the current state in Azure.

Refreshing your environment is useful when:

- You want to ensure your local `.env` file reflects the latest outputs from your infrastructure (like connection strings, endpoints, etc.).
- You need to sync environment variables after a teammate updated the environment.

If other team members made changes to environment configurations, or if you made changes through the Azure portal, you can refresh your local environment settings with:

### Run commands in specific environments

You can run many `azd` commands in a specific environment without changing your active environment by using the `--environment` or `-e` flag:

```azdeveloper
azd up --environment dev
```

This command runs the `up` workflow (provision and deploy) in the `dev` environment without changing your active environment.

Alternatively, you can first switch to your intended environment:

```azdeveloper
azd env select test
azd up
```

> [!NOTE]
> It's recommended that teams rely on CICD pipelines using the `azd pipeline config` command, rather than direct deployments using commands such as `azd up` or `azd provision`.

## Delete environment resources

To delete the Azure resources for a specific environment, using the `azd down` command:

```azdeveloper
azd down <environment-name>
```

> [!NOTE]
> It is currently not possible to delete or rename `azd` environments directly using commands. If you need to rename an environment:
>
> - Use `azd down` to delete the environment resources.
> - Run `azd env new <new-name>` to create the new environment.
> - Manually delete the old `.env` folder from `.azure`.

## Next steps

> [!div class="nextstepaction"]
> [Customize your Azure Developer CLI workflows using hooks](azd-extensibility.md)

> [!div class="nextstepaction"]
> [Configure CI/CD pipelines with Azure Developer CLI](pipeline-github-actions.md)

> [!div class="nextstepaction"]
> [Manage environment variables in Azure Developer CLI](manage-environment-variables.md)

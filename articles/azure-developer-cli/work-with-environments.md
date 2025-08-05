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

The Azure Developer CLI (`azd`) helps you manage multiple deployment environments for your projects. This capability is essential for maintaining separate development, testing, and production environments with different configurations, Azure resources, and workflows. In this article, you learn how to create, manage, and switch between environments to manage your development and deployment process.

## What are environments?

An environment in Azure Developer CLI represents a named collection of configuration settings, environment variables, and infrastructure parameters associated with a specific deployment of your application. Environments serve several important purposes:

- **Isolation**: Keep development, testing, staging, and production deployments separate.
- **Configuration management**: Maintain different settings for each environment.
- **Collaboration**: Enable team members to work with their own environments.
- **Resource organization**: Group and provision Azure resources by environment, such as using lower tier services for dev environments.
- **Reproducibility**: Ensure consistent deployments across different stages.

Each environment has its own Azure resource group (typically named `rg-<environment-name>`) and configuration settings. This isolation helps prevent changes in one environment from affecting others.

### Environment structure and configuration files

Azure Developer CLI environments are represented by a directory structure within your project:

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

1. **`.azure` directory**: The root directory for all environment configurations.
2. **Environment-specific directories**: Named after your environments (e.g., "dev", "test", "prod").
3. **`.env` file**: Contains environment-specific variables used by your application and during deployment.
4. **`main.parameters.json`**: Contains parameters used during infrastructure provisioning with Bicep or Terraform.

## Environment variables

Azure Developer CLI [Environment variables](manage-environment-variables.md) provide a way to store configuration settings that influence and may vary between environments. When you run Azure Developer CLI commands, these variables are used to:

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
DATABASE_CONNECTION_STRING=...
```

Common environment variables include:

| Variable | Description |
|----------|-------------|
| `AZURE_ENV_NAME` | Name of the current environment |
| `AZURE_LOCATION` | Azure region where resources are deployed |
| `AZURE_SUBSCRIPTION_ID` | ID of the Azure subscription used for this environment |
| `RESOURCE_TOKEN` | Unique token used to generate consistent resource names |
| `AZURE_RESOURCE_GROUP` | Name of the resource group for this environment |

When working with environment variables:

- Avoid committing `.env` files to source control if they contain secrets.
- Use consistent naming across environments.
- Use the `azd env set` command to update variables safely.

## Create and manage environments

Azure Developer CLI provides a set of commands to switch between environments, refresh their configurations, and run commands in specific environments without affecting others.

### Create environments

Create a new environment using the `azd env new` command:

```bash
azd env new <environment-name>
```

For example, to create a development environment:

```bash
azd env new dev
```

The command prompts you to select an Azure subscription and location. Once completed, it creates the environment directory structure and sets initial environment variables.

You can also specify subscription and location directly in the command:

```bash
azd env new prod --subscription "My Production Subscription" --location eastus2
```

### List environments

To see all available environments for your project, use:

```bash
azd env list
```

This command displays all environments, highlighting the current active environment. Example output:

```txt
dev (current)
test
prod
```

### Switch between environments

To switch to a different environment, use the `azd env select` command:

```bash
azd env select <environment-name>
```

For example, to switch to a production environment:

```bash
azd env select prod
```

> [!NOTE]
> This command changes your active environment, which affects subsequent `azd` commands like `provision` or `deploy`.

### Refresh environment settings

You can refresh your local environment variables using the `azd env refresh` command. This command locates the most recent Azure deployment for your app, retrieves the environment variable values by name, and then updates your local `.env` file with those latest values.

```bash
azd env refresh
```

> [!NOTE]
> The `azd env refresh` command does not redeploy resources. It only updates your local environment configuration to match the current state in Azure.

Refreshing your environment is useful when:

- Infrastructure changes have been made outside of `azd` (e.g., resources updated in the Azure Portal)
- You want to ensure your local `.env` file reflects the latest outputs from your infrastructure (like connection strings, endpoints, etc.)
- You need to sync environment variables after a teammate has updated the environment

If other team members have made changes to environment configurations, or if you've made changes through the Azure portal, you can refresh your local environment settings with:

### Run commands in specific environments

You can run any `azd` command in a specific environment without changing your active environment by using the `--environment` flag:

```bash
azd up --environment dev
```

This command runs the `up` workflow (provision and deploy) in the `dev` environment without changing your active environment.

Alternatively, you can first switch to your intended environment:

```bash
azd env select prod
azd up
```

## Delete an environment

If you no longer need an environment, you can delete it in two ways:

1. **Delete the configuration only** (keeps Azure resources):

   ```bash
   azd env delete <environment-name>
   ```

   This removes the environment's directory and configuration files but doesn't affect any Azure resources.

2. **Delete the configuration and all Azure resources**:

   ```bash
   azd down --environment <environment-name> --purge
   ```

   This command:
   - Deletes all Azure resources in the environment's resource group
   - Removes the environment's configuration files
   - Completely cleans up the environment

> [!CAUTION]
> The `azd down --purge` command permanently deletes Azure resources. Make sure you're working in the correct environment before running this command.

## Next steps

> [!div class="nextstepaction"]
> [Customize your Azure Developer CLI workflows using hooks](azd-extensibility.md)

> [!div class="nextstepaction"]
> [Configure CI/CD pipelines with Azure Developer CLI](pipeline-github-actions.md)

> [!div class="nextstepaction"]
> [Manage environment variables in Azure Developer CLI](manage-environment-variables.md)

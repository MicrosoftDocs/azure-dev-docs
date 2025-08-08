---
title: Work with Environments in Azure Developer CLI
description: Learn how to create, manage, and switch between different environments using Azure Developer CLI (azd).
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/04/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Work with Azure Developer CLI environments

The Azure Developer CLI (`azd`) helps you create and manage [Environments](environments-overview.md) with their own configurations, such as dev, test, and prod. This article shows how to create and manage environments, and how to use them with your Bicep infrastructure files.

## Create environments

Create a new environment using the `azd env new` command:

```azdeveloper
azd env new <environment-name>
```

For example, to create a development environment:

```azdeveloper
azd env new dev
```

When you run a command such as `azd up` or `azd deploy`, `azd` prompts you to select an Azure subscription and location for the new environment. Prompt settings are stored in the new environment `.env` or `config.json` files.

You can also specify subscription and location directly in the command:

```azdeveloper
azd env new prod --subscription "My Production Subscription" --location eastus2
```

## List environments

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

## Switch between environments

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

## Understand the default environment

The global configuration file `.azure/config.json` keeps track of your currently selected environment. When you run `azd init` and no environments exist yet, `azd` automatically creates your first environment and sets it as the default. If you already have one or more environments and run `azd env new <name>`, `azd` prompts you to choose whether to make the new environment the default. If you decline, the new environment is created but your current selection remains unchanged.

You can temporarily override the default environment for a single command by using the `--environment` flag. Using this flag doesn't change the default for future commands.

## Refresh environment settings

You can refresh your local environment variables using the `azd env refresh` command. This command locates the most recent Azure deployment for your app, retrieves the environment variable values by name, and then updates your local `.env` file with those latest values for the select environment. For example, if you provisioned both a `dev` and `prod` version, and you currently have the `dev` environment selected, it retrieves the latest output from that deployment to populate the .env file.

```azdeveloper
azd env refresh
```

> [!NOTE]
> The `azd env refresh` command doesn't redeploy resources. It only updates your local environment configuration to match the current state in Azure.

Refreshing your environment is useful when:

- You want to ensure your local `.env` file reflects the latest outputs from your infrastructure (like connection strings, endpoints, etc.).
- You need to sync environment variables after a teammate updated the environment.

If other team members made changes to environment configurations, or if you made changes through the Azure portal, you can refresh your local environment settings with:

## Run commands in specific environments

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
> Teams should consider using CICD pipelines via the `azd pipeline config` command, rather than direct deployments using commands such as `azd up` or `azd provision`.

## Delete environment resources

To delete the Azure resources for a specific environment, using the `azd down` command:

```azdeveloper
azd down <environment-name>
```

> [!NOTE]
> It's currently not possible to delete or rename `azd` environments directly using commands. If you need to rename an environment:
>
> - Use `azd down` to delete the environment resources.
> - Run `azd env new <new-name>` to create the new environment.
> - Manually delete the old `.env` folder from `.azure`.

## Use the environment name in infrastructure files

You can use the `AZURE_ENV_NAME` variable from your environment's `.env` file to customize your infrastructure deployments in Bicep. This is useful for naming, tagging, or configuring resources based on the current environment.

> [!NOTE]
> Visit the [Work with environment variables](manage-environment-variables.md) to learn more about how to use environment variables to configure your Azure Developer CLI projects.

1. `azd` sets the `AZURE_ENV_NAME` environment variable when you initialize a project.

    ```output
    AZURE_ENV_NAME=dev
    ```

1. In your `main.parameters.json` file, reference the environment variable so `azd` substitutes its value:

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

    When you deploy with `azd`, the value from `.env` is passed to your Bicep file from `main.parameters.json`.

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

## Next steps

> [!div class="nextstepaction"]
> [Manage environment variables in Azure Developer CLI](manage-environment-variables.md)

> [!div class="nextstepaction"]
> [Customize your Azure Developer CLI workflows using hooks](azd-extensibility.md)

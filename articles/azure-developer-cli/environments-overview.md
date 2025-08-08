---
title: Azure Developer CLI Environments Overview
description: Learn essential concepts about environments using Azure Developer CLI (azd).
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/04/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Azure Developer CLI environments overview

The Azure Developer CLI (`azd`) lets you manage multiple deployment environments for your projects, to keep configurations separate for development, testing, and production. This article explains essential concepts about how you can use environments to manage your development and deployment process.

## What are environments?

An environment in the Azure Developer CLI (`azd`) is a named set of configurations for a deployment of your app, such as dev, test, or prod. Different environments can be configured with different values. Environments serve several important purposes:

- **Isolation**: Keep development, testing, and production deployments separate.
- **Configuration management**: Maintain different settings for each environment.
- **Collaboration**: Enable team members to work with their own environments.
- **Resource organization**: Group and provision Azure resources by environment.
- **Reproducibility**: Ensure consistent deployments across different stages.

Each environment has its own Azure resource group and configuration settings. This environment isolation helps prevent changes in one environment from affecting others.

## Environment structure and configuration

Azure Developer CLI (`azd`) environments live in a directory structure within your project:

```txt
├── .azure                          [Created when you run azd init or azd up]
│   ├── <environment-name-1>        [Directory for environment-specific configurations]
│   │   ├── .env                    [Environment variables for this environment]
│   │   └── config.json             [Additional configuration parameters for this environment]
│   ├── <environment-name-2>        [Another environment]
│   │   ├── .env                    
│   │   └── config.json
│   └── config.json                 [Global azd configuration]
```

The key components of this structure are:

- **`.azure` directory**: The root directory for all environment configurations. Excluded from source control by the `.gitignore` file by default.
- **Environment-specific directories**: Directories named after your environments, such as `dev`, `test`, `prod`.
- **`.env` file**: Contains environment-specific variables used by your application and during deployment.
- **`config.json`**: Used to drive settings that influence `azd` command behavior and features. This file isn't intended to be used directly by end users.

### Environment names

Environment naming typically follows these patterns:

- Team projects: `<project-name-[dev/int/prod]>`
- Personal projects: `<personal-unique-alias-[dev/int/prod]>`

These naming conventions aren't enforced by `azd` and are configurable by the user.

## Environment variables

Azure Developer CLI [Environment variables](manage-environment-variables.md) provide a way to store configuration settings that influence and might vary between environments. When you run Azure Developer CLI commands, these variables are used to:

- Configure your application settings, such as endpoints for Azure services.
- Define infrastructure parameters to influence the provisioning process.

The `.env` file contains these variables in a standard format:

```output
AZURE_ENV_NAME=dev
AZURE_LOCATION=eastus
AZURE_SUBSCRIPTION_ID=00000000-0000-0000-0000-000000000000
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

- Avoid committing `.env` files to source control. If environment configuration needs to be persisted or shared, users should use [Remote environments](remote-environments-support.md).
- Use consistent naming across environments.
- Use the `azd env set` command to update variables safely.

> [!WARNING]
> Never store secrets in an Azure Developer CLI `.env` file. These files can easily be shared or copied into unauthorized locations, or checked into source control. Use services such as Azure Key Vault or Azure Role Based Access Control (RBAC) for protected or secretless solutions.

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
> If your project already uses framework-specific `.env` files, you can keep both configuration systems without conflicts. `azd` environment variables override system environment variables of the same name for some operations.

## Next steps

> [!div class="nextstepaction"]
> [Work with environments](work-with-environments.md)

> [!div class="nextstepaction"]
> [Manage environment variables in Azure Developer CLI](manage-environment-variables.md)

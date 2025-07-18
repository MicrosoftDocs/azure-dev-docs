---
title: Use Azure MCP with Azure Developer CLI
description: This article shows how to use Azure MCP with Azure Developer CLI (azd) to streamline your Azure development workflow.
ms.topic: how-to
ms.date: 07/17/2025
---

# Use Azure MCP with Azure Developer CLI

This article describes how to use Azure MCP with Azure Developer CLI (azd) to streamline your Azure development workflow.

## Prerequisites

- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure MCP Server](../install-mcp-server.md)
- [Azure Developer CLI (azd)](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd)
- A project that's compatible with azd

## Overview

Azure MCP provides integration with Azure Developer CLI (azd) through the `azmcp-extension-azd` command. This integration allows you to:

1. Execute azd commands through natural language
2. Learn best practices for using azd in your projects
3. Manage your environments, templates, and deployments more efficiently

## Azure Developer CLI (azd) extension

### Command syntax

```
azmcp-extension-azd --command <azdCommand> [--cwd <workingDirectory>] [--environment <environment>] [--learn <boolean>]
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| command | string | Yes (unless learn=true) | The Azure Developer CLI command to execute (without the 'azd' prefix) |
| cwd | string | Yes | The current working directory for the command |
| environment | string | No | The name of the azd environment to use |
| learn | boolean | No | Flag to learn best practices and usage patterns for azd |
| auth-method | integer | No | Authentication method to use |
| tenant | string | No | The Microsoft Entra ID tenant ID or name |
| retry-* | various | No | Various retry parameters for connection resilience |

### First-time usage

When using the azd extension for the first time, you should set the `learn` parameter to `true` to get familiar with best practices and usage patterns:

```
azmcp-extension-azd --learn true --cwd /path/to/project
```

This command returns comprehensive guidance on using Azure Developer CLI effectively with Azure MCP.

## Common azd commands through MCP

Here are some common Azure Developer CLI operations you can perform through Azure MCP:

### Initialize a project

```
azmcp-extension-azd --command "init" --cwd /path/to/project
```

### Deploy a project to Azure

```
azmcp-extension-azd --command "up" --cwd /path/to/project --environment dev
```

### View environment information

```
azmcp-extension-azd --command "env list" --cwd /path/to/project
```

### Get environment values

```
azmcp-extension-azd --command "env get-values" --cwd /path/to/project --environment dev
```

### Monitor deployed application

```
azmcp-extension-azd --command "monitor" --cwd /path/to/project --environment dev
```

### Clean up resources

```
azmcp-extension-azd --command "down" --cwd /path/to/project --environment dev
```

## Example prompts

Here are some example natural language prompts you can use with Azure MCP to work with Azure Developer CLI:

- "Initialize an azd project in my current directory"
- "Provision and deploy my application to Azure with azd"
- "Show me all my azd environments"
- "Get the environment variables for my dev environment"
- "Monitor my deployed application"
- "Delete all resources for my test environment"
- "Create a new azd environment called 'staging'"
- "Show me how to use azd effectively"
- "Set up a CI/CD pipeline for my project"

## Common development workflows

### Start a new project

1. Find and use an azd template:
   ```
   azmcp-extension-azd --command "template list" --cwd /path/to/project
   ```

2. Initialize your project with a template:
   ```
   azmcp-extension-azd --command "init --template <template-name>" --cwd /path/to/project
   ```

3. Deploy your application:
   ```
   azmcp-extension-azd --command "up" --cwd /path/to/project
   ```

### Iterate on existing project

1. Make code changes to your application

2. Deploy only code changes:
   ```
   azmcp-extension-azd --command "deploy" --cwd /path/to/project
   ```

3. Monitor the application:
   ```
   azmcp-extension-azd --command "monitor" --cwd /path/to/project
   ```

### Manage multiple environments

1. Create environments:
   ```
   azmcp-extension-azd --command "env new" --cwd /path/to/project
   ```

2. Switch between environments:
   ```
   azmcp-extension-azd --command "env select <env-name>" --cwd /path/to/project
   ```

3. Configure environment-specific values:
   ```
   azmcp-extension-azd --command "env set <key> <value>" --cwd /path/to/project --environment <env-name>
   ```

## Best practices

When using Azure Developer CLI through Azure MCP:

1. Always specify the current working directory to ensure commands run in the correct context
2. Use the `learn` parameter when you're new to a specific command or workflow
3. Set up different environments for development, testing, and production
4. Use templates to standardize your application architecture
5. Integrate with CI/CD pipelines for automated deployments
6. Monitor your application regularly to ensure optimal performance
7. Clean up resources when they're no longer needed

## Next steps

- [Learn more about Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/overview)
- [Azure Developer CLI command reference](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/reference)
- [Explore azd templates](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/azd-templates)
- [Set up CI/CD with azd](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/continuous-integration)

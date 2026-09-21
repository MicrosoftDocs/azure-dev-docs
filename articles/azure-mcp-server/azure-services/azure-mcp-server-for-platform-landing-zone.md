---
title: Plan Azure platform landing zones with Azure MCP Server
description: Azure MCP Server helps you get guidance, configure parameters, and generate or download Azure platform landing zone files for an Azure Migrate project.
author: diberry
ms.author: diberry
ms.reviewer: akrohill
ms.date: 09/02/2026
ms.service: azure-mcp-server
ms.topic: how-to
ms.custom:
  - build-2025
ai-usage: ai-generated
content_well_notification:
  - AI-contribution
mcp-cli.version: "3.0.0-beta.37+19951caeceada3430e56e2487379817219a98df5"
# customer intent: As an Azure platform landing zone administrator, I want to plan and configure a platform landing zone by using natural language so that I can get guidance and generate configuration files efficiently.
---

# Plan Azure platform landing zones with Azure MCP Server

Plan and configure Azure platform landing zones by using natural language conversations with AI assistants through Azure Model Context Protocol (MCP) Server.

[Azure platform landing zones](/azure/migrate/platform-landing-zone) provide guidance and tooling for configuring a platform landing zone within an Azure Migrate project. Azure MCP Server helps you get scenario-specific guidance, set generation parameters, and generate or download the resulting files. This article focuses only on platform landing zone planning and configuration.

## What is Azure MCP Server?

[!INCLUDE [mcp-introduction](../includes/mcp-introduction.md)]

For platform landing zone administrators, Azure MCP Server can:

- Provide guidance for changing platform landing zone settings and policies.
- Create or check the Azure Migrate project used for platform landing zone generation.
- Update and review generation parameters.
- Generate and download platform landing zone files.

## Prerequisites

To use Azure MCP Server with Azure platform landing zones, you need:

- **Azure subscription**: An active Azure subscription.
- **Resource group**: A resource group for the Azure Migrate project used as the platform landing zone generation context.
- **Azure Migrate project**: An existing project, or permission to create one by using the platform landing zone request tool.
- **Azure permissions**: Permissions to read the Azure Migrate project used for platform landing zone generation.

The platform landing zone tools are available when Azure MCP Server runs as a local server through standard input/output (STDIO).

[!INCLUDE [mcp-prerequisites](../includes/mcp-prerequisites.md)]

## Where can you use Azure MCP Server?

[!INCLUDE [mcp-usage-contexts](../includes/mcp-usage-contexts.md)]

## Available tools for Azure platform landing zones

Azure MCP Server provides two tools for platform landing zone planning and configuration.

| Tool | Description |
| --- | --- |
| `azuremigrate platformlandingzone getguidance` | Get how-to guidance for modifying, configuring, or customizing an existing platform landing zone. |
| `azuremigrate platformlandingzone request` | Configure, generate, and download platform landing zone files for an Azure Migrate project. |

The `azuremigrate platformlandingzone request` tool supports exactly these actions:

| Action | Purpose |
| --- | --- |
| `createmigrateproject` | Create an Azure Migrate project when one doesn't exist. This action requires a location. |
| `check` | Check whether a platform landing zone exists for the project. |
| `update` | Set all parameters required for platform landing zone generation. |
| `generate` | Generate the platform landing zone files. |
| `download` | Get instructions to download the generated files to the local workspace. |
| `status` | View the current cached parameter values. |

For detailed information about the tools, parameters, and examples, see [Azure Migrate tools for Azure MCP Server](../tools/azure-migrate.md).

## Get started

1. **Set up your environment**: Choose an AI assistant or development tool that supports a local Azure MCP Server. For setup and authentication instructions, see the links in [Where can you use Azure MCP Server?](#where-can-you-use-azure-mcp-server)

1. **Request guidance**: Ask for instructions that match the platform landing zone setting you want to change. For example:

   - "Show me how to turn off Bastion in my platform landing zone."
   - "List the available policies for my platform landing zone."
   - "Get guidance for changing the IP address ranges in my platform landing zone."

1. **Prepare and generate files**: Ask your assistant to check the project, collect all required parameter values, update the parameters, and generate the files. For example:

   - "Check whether a platform landing zone exists for project 'contoso-platform' in resource group 'rg-platform'."
   - "Show the current platform landing zone parameter status for project 'contoso-platform'."
   - "Generate the platform landing zone files for project 'contoso-platform', and then provide the download instructions."

1. **Learn more**: Review the [Azure Migrate tools reference](../tools/azure-migrate.md) for the complete parameter details.

## Best practices

When using Azure MCP Server for platform landing zone planning:

- **Get guidance**: Get guidance for modifying, configuring, or customizing an existing platform landing zone.
- **Check the existing state first**: Use the `check` action before you create a project or generate files.
- **Collect update values together**: The `update` action expects all generation parameters in one request. Confirm every value before you submit the update.
- **Review parameters before generation**: Use the `status` action to confirm the cached values before you use the `generate` action.
- **Download after generation**: Use the `download` action after generation completes to get the local download instructions.

## Related content

- [What is the Azure MCP Server?](../overview.md)
- [Get started with the Azure MCP Server](../get-started.md)
- [Azure Migrate tools for the Azure MCP Server overview](../tools/azure-migrate.md)
- [Azure platform landing zones](/azure/migrate/platform-landing-zone)
- [Azure skill for Azure enterprise infrastructure planning](../../azure-skills/skills/azure-enterprise-infra-planner.md)

---
title: Azure MCP Server Operations
description: Learn how to use the Azure MCP Server commands.
keywords:  azure mcp server, azmcp
author: diberry
ms.author: diberry
ms.date: 04/22/2025
ms.topic: how-to
ms.custom: build-2025
---
# Azure MCP Server operations

The Azure Model Context Protocol (MCP) Server enables interaction with Azure services through natural language commands. This article provides an overview of operations supported by the Azure MCP Server and links to detailed documentation for each service.

## How Azure MCP Server commands work

Azure MCP Server commands follow a consistent pattern across all supported Azure services:

1. **Natural language prompts**: You can use conversational language to perform operations on Azure resources.
2. **Direct commands**: For automation and scripting, you can use the command-line interface with specific parameters.
3. **Authentication and authorization**: Azure MCP Server uses your Azure credentials to authenticate and authorize operations based on your permissions.

[!INCLUDE [tip-about-params](../includes/commands/parameter-consideration.md)]

## Common parameters across services

All Azure MCP Server commands support these common parameters:

| Arg | Required | Default | Description |
|-----------|----------|---------|-------------|
| `--subscription` | Yes | - | Azure subscription ID for target resources |
| `--tenant-id` | No | - | Azure tenant ID for authentication |
| `--auth-method` | No | 'credential' | Authentication method ('credential', 'key', 'connectionString') |
| `--retry-max-retries` | No | 3 | Maximum retry attempts for failed operations |
| `--retry-delay` | No | 2 | Delay between retry attempts (seconds) |
| `--retry-max-delay` | No | 10 | Maximum delay between retries (seconds) |
| `--retry-mode` | No | 'exponential' | Retry strategy ('fixed' or 'exponential') |
| `--retry-network-timeout` | No | 100 | Network operation timeout (seconds) |

## Supported services

Azure MCP Server supports operations on the following Azure services:

- [App Configuration](app-configuration-operations.md): Manage centralized application settings and feature flags
- [Azure CLI Extensions](azure-cli-extension-operations.md): Execute Azure CLI commands within the MCP server
- [Cosmos DB](cosmos-db-operations.md): Work with Azure Cosmos DB accounts, databases, containers, and documents
- [Key Vault](key-vault-operations.md): Manage secrets, keys, and certificates in Azure Key Vault
- [Monitor](monitor-operations.md): Query Azure Monitor logs and metrics
- [Resource Groups](resource-group-operations.md): Manage Azure resource groups
- [Service Bus](service-bus-operations.md): Work with Azure Service Bus messaging services
- [Storage](storage-operations.md): Manage Azure Storage accounts, containers, blobs, and tables

## Example usage patterns

### Natural language examples

The Azure MCP Server accepts natural language commands, allowing you to interact with Azure resources conversationally:

- "Show me all my resource groups"
- "List blobs in my storage container named 'documents'"
- "What's the value of the 'ConnectionString' key in my app configuration?"
- "Query my log analytics workspace for errors in the last hour"
- "Show me all my Cosmos DB databases"

### Command-line examples

For scripting and automation, you can use the command-line syntax:

```console
# List resource groups
azmcp group list --subscription "my-subscription-id"

# Query log analytics
azmcp monitor log-query --subscription "my-subscription-id" --workspace "my-workspace" --resource-group "my-rg" --table-name "AppEvents" --query "where TimeGenerated > ago(1h)"

# Execute an Azure CLI command
azmcp extension az --command "group list"
```

## Next steps

- Learn about [getting started with Azure MCP Server](../get-started.md)
- Explore supported [App Configuration operations](app-configuration-operations.md)
- Discover how to [query Azure Monitor logs](monitor-operations.md)
- Read about [managing Azure Storage resources](storage-operations.md)


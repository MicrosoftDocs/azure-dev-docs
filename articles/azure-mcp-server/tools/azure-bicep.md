---
title: Use Azure MCP with Bicep
description: This article shows how to use Azure MCP to get Bicep schema information when creating Azure resources with Bicep.
ms.topic: how-to
ms.date: 07/17/2025
ms.reviewer: mcp-reviewer
---

# Use Azure MCP with Bicep

This article describes how to use Azure MCP to retrieve and work with Bicep schemas for Azure resources.

## Prerequisites

- [Azure subscription](https://azure.microsoft.com/free/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Azure MCP Server](../install-mcp-server.md)
- [Bicep tooling](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/install)

## Overview

The Azure MCP Bicep Schema tool helps you retrieve the latest API versions and schema information for Azure resources when working with Bicep files. This makes it easier to author accurate Infrastructure as Code (IaC) templates without having to manually search for the latest resource properties and allowed values.

## Get Bicep schema

Use the `azmcp-bicepschema-get` command to retrieve the Bicep schema for an Azure resource. This command provides the most recent API version and property information for the specified resource type.

### Command syntax

```
azmcp-bicepschema-get --resource-type <ResourceProviderNamespace>/<ResourceType>
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| resource-type | string | Yes | The name of the Bicep Resource Type in the full Azure Resource Manager format '{ResourceProvider}/{ResourceType}' (e.g., 'Microsoft.Storage/storageAccounts', 'Microsoft.KeyVault/vaults', 'Microsoft.Compute/virtualMachines') |
| auth-method | integer | No | Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString' |
| tenant | string | No | The Microsoft Entra ID tenant ID or name |
| retry-* | various | No | Various retry parameters for connection resilience |

### Example prompts

Here are some example natural language prompts you can use with Azure MCP to get Bicep schema information:

- "Get the Bicep schema for Azure Key Vault"
- "Show me the latest API version and properties for storage accounts in Bicep"
- "What are the required properties for a virtual machine in Bicep?"
- "Help me author a Bicep template for Azure App Service"
- "I need the schema for Microsoft.Network/virtualNetworks resource type"
- "What properties can I set on a Microsoft.Sql/servers resource in Bicep?"

## Best practices

When working with the Bicep schema command:

1. Always use the returned API version unless the one in your Bicep file is newer
2. Call this function separately for every resource type you're adding to your template
3. Use the Bicep schema to verify available property names and values
4. Consider the schema information more recent and accurate than other sources
5. Check for required vs. optional properties in the returned schema

## Next steps

- [Learn more about Bicep files structure and syntax](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/file)
- [Create Bicep files with Visual Studio Code](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/visual-studio-code)
- [Deploy resources with Bicep and Azure CLI](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-cli)
- [Bicep best practices](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/best-practices)

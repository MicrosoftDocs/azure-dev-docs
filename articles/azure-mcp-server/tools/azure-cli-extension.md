---
title: Azure CLI Extension Tools
description: Learn how to use the Azure MCP Server with the Azure CLI Extension.
keywords: azure mcp server, azmcp, azure cli extension
author: diberry
ms.author: diberry
ms.date: 05/14/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure CLI extension tools for the Azure MCP Server

The Azure MCP Server allows you to execute any Azure CLI command using natural language prompts. You can perform virtually any Azure resource management operation without needing to remember specific command syntax, parameters, or formatting.

[Azure Command-Line Interface (CLI)](/cli/azure) is a cross-platform command-line tool to connect to Azure and execute administrative commands on Azure resources. It allows the execution of commands through a terminal using interactive command-line prompts or a script. For a complete list of Azure CLI commands this tool can execute, see the [Azure CLI reference documentation](/cli/azure/reference-index).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Execute Azure CLI command

The Azure MCP Server can execute Azure CLI commands. This provides complete access to Azure resource management through familiar command-line syntax.

**Example prompts** include:

- **List my Azure resources**: "Show me all my resource groups"
- **Query specific details**: "Get details for storage account mystorageacct01 in the dev-rg resource group"

| Parameter | Description |
|-------------------|-----------|-------------|
| **Command** | Required. The Azure CLI command to execute (without the 'az' prefix). For a complete list of Azure CLI commands, see the [Azure CLI reference documentation](/cli/azure/reference-index). |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure CLI reference documentation](/cli/azure/reference-index)

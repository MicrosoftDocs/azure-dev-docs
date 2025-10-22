---
title: Azure CLI Tools
description: Learn how to use Azure CLI tools with the Azure MCP Server to generate commands, execute operations, and get installation instructions for Azure resource management.
keywords: azure mcp server, azmcp, azure cli extension
author: diberry
ms.author: diberry
ms.date: 10/15/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure CLI tools for the Azure MCP Server

The Azure MCP Server provides comprehensive support for Azure CLI operations, including finding commands, generating command syntax, and providing installation instructions. Perform virtually any Azure resource management operation without needing to remember specific command syntax, parameters, or formatting.

[Azure Command-Line Interface (CLI)](/cli/azure) is a cross-platform command-line tool to connect to Azure and execute administrative commands on Azure resources. It allows the execution of commands through a terminal using interactive command-line prompts or a script. For a complete list of Azure CLI commands this tool executes, see the [Azure CLI reference documentation](/cli/azure/reference-index).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Generate Azure CLI commands

The Azure MCP Server generates Azure CLI commands to accomplish specific goals. 

**Example prompts** include:

- **Generate creation commands**: "Generate an `az` command to create a storage account"
- **Generate query commands**: "Create an `az` command to list all virtual machines in a resource group"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Intent** | Required | The user intent of the task to be solved by using the CLI tool. This user intent is used to generate the appropriate CLI command to accomplish the desirable goal. |
| **Cli type** | Required | The type of CLI tool to use. Supported values are `az` for Azure CLI. |

## Get CLI installation instructions

The Azure MCP Server provides installation instructions for CLI tools including Azure CLI (az), Azure Developer CLI (azd), and Azure Functions Core Tools CLI (func). It incorporates knowledge of the CLI tool beyond what the LLM knows. Use this tool to get installation instructions if you attempt to use the CLI tool but it's not installed.

**Example prompts** include:

- **Azure CLI installation**: "How do I install the `az` CLI?"
- **Azure Developer CLI installation**: "Show me how to install `azd`"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **CLI type** | Required | The type of CLI tool to use. Supported values are `az` for Azure CLI, `azd` for Azure Developer CLI, and `func` for Azure Functions Core Tools CLI. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure CLI reference documentation](/cli/azure/reference-index)

---
title: Azure MCP Server tools for Azure CLI
description: Azure MCP Server tools for Azure CLI let you generate commands and get installation instructions for Azure resource management.
author: diberry
ms.author: diberry
ms.date: 09/27/2026
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
mcp-cli.version: "3.0.0-beta.47+bd724faf47e86348c7163a429b584aabfd714876"
---
# Azure MCP Server tools for Azure CLI

The Azure MCP Server provides comprehensive support for Azure CLI operations, including finding commands, generating command syntax, and providing installation instructions. Perform virtually any Azure resource management operation without needing to remember specific command syntax, parameters, or formatting.

[Azure Command-Line Interface (CLI)](/cli/azure) is a cross-platform command-line tool to connect to Azure and execute administrative commands on Azure resources. It allows the execution of commands through a terminal using interactive command-line prompts or a script. For a complete list of Azure CLI commands this tool executes, see the [Azure CLI reference documentation](/cli/azure/reference-index).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Generate Azure CLI commands

<!-- extension cli generate -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp extension cli generate \
  --intent <intent> \
  --cli-type <cli-type>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `intent` | string | Yes | The user intent of the task to solve by using the CLI tool. This user intent generates the appropriate CLI command to accomplish the goal. |
| `cli-type` | string | Yes | The type of CLI tool to use. Supported values are 'az' for Azure CLI. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli extension cli generate -->

- **Generate creation commands**: "Generate an `az` command to create a storage account"
- **Generate query commands**: "Create an `az` command to list all virtual machines in a resource group"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Intent** | Required | The user intent of the task to be solved by using the CLI tool. This user intent is used to generate the appropriate CLI command to accomplish the desirable goal. |
| **Cli type** | Required | The type of CLI tool to use. Supported values are `az` for Azure CLI. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Get CLI installation instructions

<!-- extension cli install -->

The Azure MCP Server provides installation instructions for CLI tools including Azure CLI (`az`), Azure Developer CLI (`azd`), and Azure Functions Core Tools CLI (`func`). It incorporates knowledge of the CLI tool beyond what the LLM knows. Use this tool to get installation instructions if you attempt to use the CLI tool but it's not installed.

**Example prompts** include:

- **Azure CLI installation**: "How do I install the `az` CLI?"
- **Azure Developer CLI installation**: "Show me how to install `azd`"
- **Azure Functions Core tools**: "What is Azure Functions Core tools and how to install it"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **CLI type** | Required | The type of CLI tool to use. Supported values are `az` for Azure CLI, `azd` for Azure Developer CLI, and `func` for Azure Functions Core Tools CLI. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure CLI reference documentation](/cli/azure/reference-index)
- [Azure Developer CLI reference documentation](/azure/developer/azure-developer-cli)

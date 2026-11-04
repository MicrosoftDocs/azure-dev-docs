---
title: Azure CLI Tools
description: Learn how to use Azure CLI tools with the Azure MCP Server to generate commands, execute operations, and get installation instructions for Azure resource management.
author: sandeep-sen
ms.author: sandeepsen
ms.date: 02/27/2026
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
tool_count: 2
mcp-cli.version: "3.0.0-beta.47+bd724faf47e86348c7163a429b584aabfd714876"
---
# Azure MCP Server tools for Azure CLI

The Azure MCP Server provides comprehensive support for Azure CLI operations, including finding commands, generating command syntax, and providing installation instructions. Perform virtually any Azure resource management operation without needing to remember specific command syntax, parameters, or formatting.

[Azure Command-Line Interface (CLI)](/cli/azure) is a cross-platform command-line tool to connect to Azure and execute administrative commands on Azure resources. It allows the execution of commands through a terminal using interactive command-line prompts or a script. For a complete list of Azure CLI commands this tool executes, see the [Azure CLI reference documentation](/cli/azure/reference-index).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Generate Azure CLI commands

<!-- extension cli generate -->

The Azure MCP Server generates Azure CLI commands to accomplish specific goals. 

**Example prompts** include:

- **Generate creation commands**: "Generate an `az` command to create a storage account"
- **Generate query commands**: "Create an `az` command to list all virtual machines in a resource group"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Intent** | Required | The user intent of the task to be solved by using the CLI tool. This user intent is used to generate the appropriate CLI command to accomplish the desirable goal. |
| **Cli type** | Required | The type of CLI tool to use. Supported values are `az` for Azure CLI. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Get CLI installation instructions

<!-- extension cli install -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp extension cli install \
  --cli-type <cli-type>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cli-type` | string | Yes | The type of CLI tool to use. Supported values are `az` for Azure CLI, `azd` for Azure Developer CLI, and `func` for Azure Functions Core Tools CLI. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli extension cli install -->

- **Azure CLI installation**: "How do I install the `az` CLI?"
- **Azure Developer CLI installation**: "Show me how to install `azd`"
- **Azure Functions Core tools**: "What is Azure Functions Core tools and how to install it"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **CLI type** | Required | The type of CLI tool to use. Supported values are `az` for Azure CLI, `azd` for Azure Developer CLI, and `func` for Azure Functions Core Tools CLI. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure CLI reference documentation](/cli/azure/reference-index)
- [Azure Developer CLI reference documentation](/azure/developer/azure-developer-cli)

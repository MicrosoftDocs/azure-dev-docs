---
title: Azure skill for resource lookup
description: List, find, and show Azure resources across subscriptions or resource groups. Handles prompts like "list websites", "list virtual machines", "list my VMs", "show storage accounts", "find container apps", and "what resources do I have".
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.1
---

# Azure skill for resource lookup

List, find, and show Azure resources across subscriptions or resource groups. Handles prompts like "list websites", "list virtual machines", "list my VMs", "show storage accounts", "find container apps", and "what resources do I have".

**Skill:** `azure-resource-lookup` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-resource-lookup/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. List, find, and show Azure resources across subscriptions or resource groups. Handles prompts like "list websites", "list virtual machines", "list my VMs", "show storage accounts", "find container apps", and "what resources do I have".

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **[Azure Key Vault](/azure/key-vault/general/quick-create-portal)**: A key vault for secrets and certificate management.
- **[Azure Storage](/azure/storage/common/storage-account-create)**: A storage account for blob, file, queue, or table data.
- **[Azure Kubernetes Service](/azure/aks/learn/quick-kubernetes-deploy-portal)**: An AKS cluster for container orchestration.
- **[Azure Cosmos DB](/azure/cosmos-db/nosql/quickstart-portal)**: A Cosmos DB account for NoSQL data.

### Related tools

| Tool | Command | Purpose |
|------|---------|---------|
| `extension_cli_generate` | `Generate `az graph query` commands` | Primary tool - generate ARG queries from user intent |
| `mcp_azure_mcp_subscription_list` | `List available subscriptions` | Discover subscription scope before querying |
| `mcp_azure_mcp_group_list` | `List resource groups` | Narrow query scope |

## When to use this skill

Use this skill when you need to:

- Work with resource inventory
- Find resources by tag
- Work with tag analysis
- Orphaned resource discovery (not for cost analysis)
- Work with unattached disks, count resources by type, and cross-subscription lookup
- And Azure Resource Graph queries

## Example prompts

Try these prompts to activate this skill:

- "List the websites in my subscription"
- "Show me the websites in my resource group"
- "List all virtual machines in my subscription"
- "Show me all VMs in resource group 'my-rg'"
- "List my Azure storage accounts"
- "List all my Azure Container Registries"
- "List the container apps in my subscription"
- "Show me the container apps in my resource group"
- "What resources do I have across all my subscriptions?"
- "Show me all my Azure resources"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-resource-lookup/SKILL.md)


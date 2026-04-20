---
title: Azure skill for storage
description: Azure Storage Services including Blob Storage, File Shares, Queue Storage, Table Storage, and Data Lake. Provides object storage, SMB file shares, async messaging, NoSQL key-value, and big data analytics capabilities. Includes access tiers (hot, cool, archive) and lifecycle management.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.0
---

# Azure skill for storage

Azure Storage Services including Blob Storage, File Shares, Queue Storage, Table Storage, and Data Lake. Provides object storage, SMB file shares, async messaging, NoSQL key-value, and big data analytics capabilities. Includes access tiers (hot, cool, archive) and lifecycle management.

**Skill:** `azure-storage` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-storage/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Azure Storage Services including Blob Storage, File Shares, Queue Storage, Table Storage, and Data Lake. Provides object storage, SMB file shares, async messaging, NoSQL key-value, and big data analytics capabilities. Includes access tiers (hot, cool, archive) and lifecycle management.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **[Azure Storage](/azure/storage/common/storage-account-create)**: A storage account for blob, file, queue, or table data.

### Azure services knowledge

| Service | When to use |
|---------|------------|
| Blob Storage | Objects, files, backups, static content |
| File Shares | SMB file shares, lift-and-shift |
| Queue Storage | Async messaging, task queues |
| Table Storage | NoSQL key-value (consider Cosmos DB) |
| Data Lake | Big data analytics, hierarchical namespace |

## When to use this skill

Use this skill when you need to:

- Work with blob storage, file shares, queue storage, and table storage
- Work with data lake
- Upload files in Azure
- Work with download blobs, storage accounts, access tiers, and lifecycle management

## Example prompts

Try these prompts to activate this skill:

- "Upload a file to my Azure Blob Storage container"
- "Download a blob from my storage account"
- "List all containers in my Azure Storage account"
- "Set up lifecycle management to move blobs to archive tier"
- "Create a file share in my storage account"
- "What's the difference between hot, cool, and archive access tiers?"
- "Set up a queue storage for async processing"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-storage/SKILL.md)


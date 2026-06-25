---
title: Azure skill for Azure Storage
description: The azure-storage skill helps you configure and manage Azure Storage services including Blob Storage, Azure Files, Queue Storage, Table Storage, and Data Lake Storage Gen2. Use it to set access tiers, configure lifecycle management, and manage storage account security.
ms.topic: reference
ms.date: 06/22/2026
author: diberry
ms.author: diberry
ms.reviewer: chuye
ms.service: azure-mcp-server
ms.custom: devx-track-copilot-skills
ms.skillversion: 1.0.0
ai-usage: ai-generated
---

# Azure skill for Azure Storage

The `azure-storage` skill helps you configure and manage Azure Storage services including Blob Storage, Azure Files, Queue Storage, Table Storage, and Data Lake Storage Gen2. Use it to set access tiers, configure lifecycle management policies, manage storage account security, and optimize storage costs.

**Skill** `azure-storage` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-storage/SKILL.md)

## What it provides

You get guidance on all Azure Storage services — Blob Storage (access tiers, lifecycle management, SAS tokens), Azure Files (SMB/NFS shares), Queue Storage (message processing), Table Storage (NoSQL key-value), and Data Lake Storage Gen2 (hierarchical namespace, ACLs). Also covers storage account security, encryption, and cost optimization.

### Azure services knowledge

| Service | When to use |
|---------|------------|
| Blob Storage | Objects, files, backups, static content |
| File Shares | SMB file shares, lift-and-shift |
| Queue Storage | Async messaging, task queues |
| Table Storage | NoSQL key-value (consider Cosmos DB) |
| Data Lake | Big data analytics, hierarchical namespace |

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **[Azure Storage](/azure/storage/common/storage-account-create)**: A storage account for blob, file, queue, or table data.

## When to use this skill

Use this skill when you need to:

- Work with blob storage, file shares, queue storage, and table storage
- Work with data lake
- Upload files in Azure
- Work with download blobs, storage accounts, access tiers, and lifecycle management

## When not to use this skill

- Database operations (use `azure-cosmos` for Cosmos DB or SQL-specific skills).
- Azure Data Factory or Synapse data pipelines.

## Example prompts

Try these prompts to activate this skill:

- "Set up blob storage"
- "Configure Azure file shares"
- "Upload files to Azure Storage"
- "Download blobs from my container"
- "Configure access tiers — hot, cool, cold, archive"
- "When should I use each storage tier?"
- "Set up lifecycle management for blobs"
- "Create a storage account"
- "Configure Data Lake Storage"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-storage/SKILL.md)
- [Azure Storage documentation](/azure/storage/)
- [Blob Storage overview](/azure/storage/blobs/storage-blobs-introduction)
- [Azure Files overview](/azure/storage/files/storage-files-introduction)
- [Storage account security](/azure/storage/common/storage-security-guide)

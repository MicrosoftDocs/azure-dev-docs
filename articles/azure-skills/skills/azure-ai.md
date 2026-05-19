---
title: Azure skill for AI Services
description: Azure AI Services including AI Search, Speech, OpenAI, and Document Intelligence.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.1
---

# Azure skill for AI Services

**Skill:** `azure-ai` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-ai/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge about Azure AI Services services and workflows in Azure.

### Azure services knowledge

| Service | When to use |
|---------|------------|
| AI Search | Full-text, vector, hybrid search |
| Speech | Speech-to-text, text-to-speech |
| OpenAI | GPT models, embeddings, DALL-E |
| Document Intelligence | Form extraction, OCR |

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Query and manage Azure AI Search resources.
- Perform full-text, vector, hybrid, and semantic search queries.
- Execute vector, hybrid, and semantic search queries.
- Convert speech to text and text to speech using Azure Cognitive Services.

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-ai/SKILL.md)


---
title: Azure skill for Azure AI Services
description: The azure-AI skill helps you integrate Azure AI search, speech, OpenAI, and Document Intelligence into applications. Use it to configure Cognitive Services, manage endpoints, and set quotas for AI-powered features.
ms.topic: reference
ms.date: 06/22/2026
author: diberry
ms.author: diberry
ms.reviewer: JasonYeMSFT
ms.service: azure-mcp-server
ms.custom: devx-track-copilot-skills
ms.skillversion: 1.0.1
ai-usage: ai-generated
---

# Azure skill for Azure AI Services

The `azure-ai` skill helps GitHub Copilot answer questions about Azure AI Services, including Azure AI Search, Azure AI Speech, Azure OpenAI, and Azure AI Document Intelligence. Use it to configure Cognitive Services endpoints, manage service keys, and set quotas for AI-powered features in your applications.

**Skill** `azure-ai` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-ai/SKILL.md)

## What it provides

You get expert guidance on Azure AI Services to build and configure AI-powered applications. This includes Azure AI Search (indexes, indexers, semantic ranking), Azure AI Speech (endpoints, language models, custom voice), Azure OpenAI (deployments, model quotas, prompt configurations), and Azure AI Document Intelligence (models, analyzers, API keys).

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

## Example prompts

Try these prompts to activate this skill:

- "Set up AI Search for my application"
- "How do I implement vector search with Azure AI Search?"
- "Configure hybrid search combining keyword and semantic search"
- "Help me with speech-to-text transcription"
- "Convert text to speech using Azure AI Speech"
- "Transcribe audio files with speaker diarization"
- "Extract text from documents using OCR"
- "What Azure AI Search index options are available?"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-ai/SKILL.md)
- [Azure AI Services overview](/azure/ai-services/)
- [Azure OpenAI Service](/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure?pivots=azure-openai#azure-openai-in-microsoft-foundry-models)
- [Azure AI Search documentation](/azure/search/)
- [Azure AI Speech documentation](/azure/ai-services/speech-service/)

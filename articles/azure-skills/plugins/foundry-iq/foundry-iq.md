---
title: Azure skill for Foundry IQ
description: Create, query, connect, and troubleshoot Foundry IQ knowledge bases with the Foundry IQ skill.
author: yunjchoi
ms.author: yunjchoi
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/05/2026
ms.custom: [devx-track-copilot-skills, skill-version-0.1.4]
ai-usage: ai-generated
---

# Azure skill for Foundry IQ

The `foundry-iq` skill supports Foundry IQ knowledge-base workflows. Use it to create or reuse a Search service, create knowledge sources and knowledge bases, retrieve answers with citations, and connect an existing knowledge base to an agent.

**Skill** `foundry-iq` | [Source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/foundry-iq-skills/skills/foundry-iq/SKILL.md)

## When to use this skill

Use this skill when you need to:

- Create or reuse an Azure AI Search service for a Foundry IQ workflow.
- Create a knowledge source from local files, Azure Blob Storage, or Azure Data Lake Storage Gen2.
- Create and validate a searchable knowledge base.
- Query an existing knowledge base and return citations.
- Connect an existing knowledge base to an agent.
- Diagnose knowledge-base failures or unsupported source configurations.
- Prepare a cleanup plan for resources created by the workflow.

Don't use this skill for classic Azure AI Search index or application development, repository-file search, or generic agent creation.

## Safety

Read-only operations don't require approval. The skill asks you to approve a plan before it creates Azure AI Search resources, knowledge sources, knowledge bases, or agent connections. Cleanup uses a separate approval workflow.

## Example prompts

- "Create a knowledge base from the files in `./docs`."
- "Create a knowledge base from this Blob container."
- "Query this knowledge base and include citations."
- "Connect this knowledge base to my existing agent."
- "Why is retrieval from this knowledge base failing?"

## Related content

- [Azure plugin catalog](../index.md#foundry-iq-plugin)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/foundry-iq-skills/skills/foundry-iq/SKILL.md)

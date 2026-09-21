---
title: Azure Skill for Azure Kusto IRQL
description: Use the azure-kusto-irql skill to compose reusable IRQL pipelines that select, extract, enrich, filter, and summarize Kusto security data.
author: diberry
ms.author: diberry
ms.reviewer: skaluvak
ms.date: 09/02/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom: [devx-track-copilot-skills, skill-version-1.2.0]
ai-usage: ai-generated
ms.skillversion: "1.2"
---

# Azure skill for Azure Kusto IRQL

The `azure-kusto-irql` skill helps you compose Incident Response Query Language (IRQL) pipelines for cybersecurity investigations in Azure Data Explorer. IRQL uses stored KQL functions to provide consistent schemas and reusable selectors, extractors, and enrichers across security data sources.

**Skill** `azure-kusto-irql` | [Source code](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugins/azure-kusto-graph-skills/skills/azure-kusto-irql/SKILL.md)

This skill isn't a general natural-language-to-IRQL converter. Use it to compose known IRQL functions or handle a basic request that maps directly to a known selector and simple filters.

## What it provides

You get guidance for composing IRQL pipelines with `Get_*` selectors, `Extract_*` functions, and `Enrich_*` functions. The skill helps you choose the minimum required selector, filter early, add investigation context, and shape the final KQL results without memorizing source-specific schemas or join keys.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../../install.md).
- **Azure Data Explorer access**: You need access to the cluster and database that contain your security data.
- **IRQL functions**: The required `Get_*`, `Extract_*`, and `Enrich_*` stored functions must be deployed in the target database.
- **Optional example environment**: The `kc7001.eastus.kusto.windows.net` cluster provides predeployed IRQL functions in the `ValdyTimes` and `JoJosHospital` databases.
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Compose an IRQL security-hunting or incident-response pipeline.
- Start with a schema-unified `Get_*` selector.
- Derive fields with `Extract_*` functions.
- Add employee, authentication, DNS, network, or threat context with `Enrich_*` functions.
- Build portable investigations that can run against different Kusto data sources.
- Combine IRQL functions with standard KQL filters, summaries, and projections.

## Example prompts

Try these prompts to activate this skill:

- "Use IRQL to find repeated failed logins by user."
- "Compose an IRQL pipeline for phishing triage."
- "Enrich suspicious usernames with employee details."
- "Investigate lateral movement with IRQL authentication events."
- "Find process execution on hosts that received a suspicious file."
- "Show the IRQL functions available in this database."

## Related content

- [Azure skill for Azure Kusto (Data Explorer)](../../skills/azure-kusto.md)
- [Azure skill for Azure Kusto Graph](azure-kusto-graph.md)
- [Azure skill for Azure Kusto IRQL Graph](azure-kusto-irql-graph.md)
- [Azure Data Explorer KQL overview](/kusto/query/index)
- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [IRQL examples](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugins/azure-kusto-graph-skills/skills/azure-kusto-irql/references/EXAMPLES.md)
- [Skill source code](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugins/azure-kusto-graph-skills/skills/azure-kusto-irql/SKILL.md)

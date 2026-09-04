---
title: Azure Skill for Azure Kusto IRQL Graph
description: Use the azure-kusto-irql-graph skill to map KQL or IRQL results into graph visualizations with enrichment, node folding, and Kusto Explorer rendering.
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

# Azure skill for Azure Kusto IRQL Graph

The `azure-kusto-irql-graph` skill helps you transform tabular KQL or IRQL results into graph visualizations in Kusto Explorer. Use it to define node and edge mappings, add graph-specific extraction or enrichment, fold related nodes, and render the result.

**Skill** `azure-kusto-irql-graph` | [Source code](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugins/azure-kusto-graph-skills/skills/azure-kusto-irql-graph/SKILL.md)

This skill isn't a general natural-language-to-KQL or natural-language-to-IRQL converter. Use it with an existing query and known result columns, or with a basic request that maps directly to one known table or selector.

## What it provides

You get mapping guidance for `Lift_To_Graph` and pipeline composition for `Graph_Render_View`, `Graph_Fold_By_Property`, `Extract_Node_*`, `Enrich_Node_*`, and `Enrich_Graph_*` stored functions. The skill preserves the supplied query and adds only the mapping and graph functions required for visualization.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../../install.md).
- **Azure Data Explorer access**: You need access to the cluster, database, and tabular query results you want to visualize.
- **IRQL graph functions**: `Lift_To_Graph` and `Graph_Render_View` must be deployed in the target database. Additional graph functions are required only when the requested pipeline uses them.
- **Optional example environment**: The `kc7001.eastus.kusto.windows.net` cluster provides predeployed graph functions in the `ValdyTimes` and `JoJosHospital` databases.
- **Kusto Explorer**: Use the desktop application when you want to render an interactive graph visualization.
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Turn existing KQL or IRQL query results into an icon-decorated graph.
- Generate a `Lift_To_Graph` mapping from known result columns.
- Render graph output with `Graph_Render_View`.
- Fold or collapse graph nodes by a shared property.
- Add node or graph context with extraction and enrichment functions.
- Preserve an existing investigation query while adding graph visualization.

## Example prompts

Try these prompts to activate this skill:

- "Visualize these KQL results as a graph in Kusto Explorer."
- "Create a Lift_To_Graph mapping for users, hosts, and IP addresses."
- "Render this IRQL authentication query as a graph."
- "Fold authentication event nodes by result."
- "Enrich IP nodes with employee information before rendering."
- "Map email senders and recipients as graph nodes and edges."

## Related content

- [Azure skill for Azure Kusto Graph](azure-kusto-graph.md)
- [Azure skill for Azure Kusto IRQL](azure-kusto-irql.md)
- [Azure Data Explorer graph semantics overview](/kusto/query/graph-semantics-overview)
- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Deploy IRQL graph functions](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugins/azure-kusto-graph-skills/skills/azure-kusto-irql-graph/references/DEPLOY_IRQL_FUNCTIONS.md)
- [IRQL graph examples](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugins/azure-kusto-graph-skills/skills/azure-kusto-irql-graph/references/EXAMPLES.md)
- [Skill source code](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugins/azure-kusto-graph-skills/skills/azure-kusto-irql-graph/SKILL.md)

---
title: Azure plugins
description: Compare the core Azure Skills plugin and specialized plugins available from the Azure Skills marketplace.
author: yunjchoi
ms.author: yunjchoi
ms.service: azure-mcp-server
ms.topic: overview
ms.date: 11/10/2026
ai-usage: ai-generated
---

# Azure plugins

The [Azure Skills marketplace](https://github.com/microsoft/azure-skills) includes a core plugin for broad Azure workflows and specialized plugins for focused scenarios. Register the marketplace once, and then install the plugins that match your tasks.

```text
/plugin marketplace add microsoft/azure-skills
```

The plugin catalog can change independently of the core plugin. Check the [Azure Skills repository plugin directory](https://github.com/microsoft/azure-skills/tree/main/.github/plugins) for the latest available plugins.

## Choose a plugin

| Plugin | Use it for | Representative skills | Install in GitHub Copilot CLI |
| --- | --- | --- | --- |
| **Azure Skills plugin (core)** (`azure`) | Broad Azure planning, deployment, diagnostics, resource management, AI, data, identity, and platform workflows. Use it as the default starting point and to discover skills in other plugins. | `discover-azure-skills`, `azure-prepare`, `azure-validate`, `azure-deploy`, `azure-diagnostics`, `azure-kubernetes` | `/plugin install azure@azure-skills` |
| **Azure Advisor plugin** (`azure-advisor`) | Azure Advisor recommendations, idle-resource savings and deletion prevalidation, service-retirement impact, and remediation guidance. | `azure-advisor`, `azure-advisor-cost-optimization`, `azure-advisor-actionability` | `/plugin install azure-advisor@azure-skills` |
| **Azure Cost plugin** (`azure-cost`) | Cost analysis, estimation, optimization, and governance. | `cost-analysis`, `cost-estimation`, `cost-optimization`, `cost-governance` | `/plugin install azure-cost@azure-skills` |
| **Azure Kusto Graph plugin** (`azure-kusto-graph-skills`) | Graph analysis in Azure Data Explorer, incident-response query pipelines, and graph visualization. | `azure-kusto-graph`, `azure-kusto-irql`, `azure-kusto-irql-graph` | `/plugin install azure-kusto-graph-skills@azure-skills` |
| **Azure Local plugin** (`azure-local-skills`) | Azure Local planning, deployment, operations, workload management, and multi-rack scenarios. | `azure-local`, `azure-local-multi-rack` | `/plugin install azure-local-skills@azure-skills` |
| **Foundry IQ plugin** (`foundry-iq-skills`) | Get help with Foundry IQ, build agents that answer questions from your documents, and explore entity graphs, topic graphs, and ontologies. | `foundry-iq` | `/plugin install foundry-iq-skills@azure-skills` |

## Azure Skills plugin (core)

Install the core plugin when you work across Azure services or aren't sure which skill matches your task. The `discover-azure-skills` skill searches the marketplace catalog, matches your task to skill metadata, identifies the owning plugin, and returns installation guidance.

The core plugin also configures Azure MCP capabilities used by many of its workflows. Installing the core plugin doesn't install every specialized plugin.

## Azure Advisor plugin

Install the Azure Advisor plugin to review and prioritize Advisor recommendations, find unused resources and their estimated savings, check deletion readiness, find resources affected by service retirements, update recommendation status, and get remediation guidance for a recommendation. Deletion prevalidation is read-only and doesn't authorize resource removal.

Learn about its skills:

- [Azure Advisor](azure-advisor/azure-advisor.md).
- [Azure Advisor Actionability](azure-advisor/azure-advisor-actionability.md).
- [Azure Advisor Cost Optimization](azure-advisor/azure-advisor-cost-optimization.md).

## Azure Cost plugin

Install the Azure Cost plugin for cost analysis, forecasts, pricing estimates, optimization opportunities, commitment analysis, budgets, and cost guardrails.

Learn about its skills:

- [Cost Analysis](azure-cost/cost-analysis.md).
- [Cost Estimation](azure-cost/cost-estimation.md).
- [Cost Optimization](azure-cost/cost-optimization.md).
- [Cost Governance](azure-cost/cost-governance.md).

## Azure Kusto Graph plugin

Install the Azure Kusto Graph plugin for graph construction and queries in Kusto Query Language (KQL), Incident Response Query Language (IRQL) pipelines, and graph visualizations.

Learn about its skills:

- [Azure Kusto Graph](azure-kusto-graph/azure-kusto-graph.md).
- [Azure Kusto IRQL](azure-kusto-graph/azure-kusto-irql.md).
- [Azure Kusto IRQL Graph](azure-kusto-graph/azure-kusto-irql-graph.md).

## Azure Local plugin

Install the Azure Local plugin for standard Azure Local deployments and multi-rack deployments. The plugin separates these deployment models because they use different procedures and resource providers.

Learn about its skills:

- [Azure Local](azure-local/azure-local.md).
- [Azure Local Multi-Rack](azure-local/azure-local-multi-rack.md).

## Foundry IQ plugin

Install the Foundry IQ plugin to get help with Foundry IQ (Azure AI Search), build agents that answer questions from your documents, and explore entity graphs, topic graphs, and ontologies.

For capabilities and safety guidance, see [Foundry IQ](foundry-iq/foundry-iq.md).

## Related content

- [What is Azure Skills?](../overview.md)
- [Install and configure Azure Skills](../install.md)
- [Azure Skills repository](https://github.com/microsoft/azure-skills)

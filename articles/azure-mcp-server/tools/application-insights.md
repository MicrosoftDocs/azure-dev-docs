---
title: Azure MCP Server tools for Application Insights
description: Use Azure MCP Server tools to list Application Insights code optimization recommendations, optionally by resource group, using natural language prompts.
author: diberry
ms.author: diberry
ms.date: 09/16/2026
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
tool_count: 1
mcp-cli.version: "3.0.0-beta.43+9faf528915a7575dc18c3e4b83753a2400a63032"
---
# Azure MCP Server tools for Application Insights

The Azure Model Context Protocol (MCP) Server lets you list Application Insights code optimization recommendations by using natural language prompts. You can list recommendations across a subscription or filter them by resource group.

[Application Insights](/azure/azure-monitor/app/app-insights-overview) is an extensible Application Performance Management (APM) service for developers and DevOps professionals. It provides insights into the performance and usage of your applications, helping you to detect and diagnose issues, understand user behavior, and improve application performance.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List code optimization recommendations

<!-- applicationinsights recommendation list -->

Lists [Application Insights](/azure/azure-monitor/app/app-insights-overview) code optimization recommendations in a subscription. You can optionally filter the recommendations by resource group.

The tool returns recommendations based on profiler data that identify code optimization opportunities for the selected scope.

Example prompts include:

- **List code optimization recommendations**: "List code optimization recommendations across my Application Insights components."
- **Show recommendations for all resources**: "Show me code optimization recommendations for all Application Insights resources in my subscription."
- **List recommendations by resource group**: "List code optimization recommendations for Application Insights in resource group 'devops-group'."

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Application Insights](/azure/azure-monitor/app/app-insights-overview)

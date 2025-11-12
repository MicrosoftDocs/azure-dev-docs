---
title: Application Insights Tools 
description: "Use Azure MCP Server with Application Insights to list resources and code optimization recommendations using natural language prompts."
keywords: azure mcp server, azmcp, application insights, log analytics
author: diberry
ms.author: diberry
ms.date: 10/27/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Application Insights tools for the Azure MCP Server

The Azure MCP Server allows you to list Application Insights resources using natural language prompts.

[Application Insights](/azure/azure-monitor/app/app-insights-overview) is an extensible Application Performance Management (APM) service for developers and DevOps professionals. It provides insights into the performance and usage of your applications, helping you to detect and diagnose issues, understand user behavior, and improve application performance.

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List recommendations

<!-- applicationinsights recommendation list -->

Lists [Application Insights](/azure/azure-monitor/app/app-insights-overview) code optimization recommendations in a subscription. 

Example prompts include:

- **List code optimization recommendations**: "List code optimization recommendations across my Application Insights components."
- **Show recommendations for all resources**: "Show me code optimization recommendations for all Application Insights resources in my subscription."
- **List profiler recommendations by group**: "List profiler recommendations for Application Insights in resource group 'devops-group'."

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [applicationinsights recommendation list](../includes/tools/annotations/azure-application-insights-recommendation-list-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Application Insights](/azure/azure-monitor/app/app-insights-overview)

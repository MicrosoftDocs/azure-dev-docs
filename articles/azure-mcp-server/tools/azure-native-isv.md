---
title: Azure Native ISV Tools for Azure MCP Server
description: Use Azure MCP Server tools with Azure Native ISV partner solutions like Datadog to manage integrated third-party services with natural language prompts.
author: diberry
ms.author: diberry
ms.date: 08/11/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
---

# Azure Native ISV tools for Azure MCP Server overview

The Azure MCP Server lets you manage Azure resources, including Azure Native ISV partner solutions, with natural language prompts. You can quickly manage third-party services that are natively integrated with Azure without remembering complex syntax, which improves productivity and reduces operational overhead.

By using [Azure Native Integrations](/azure/partner-solutions/partners), you can provision, manage, and tightly integrate software and services from partner companies on Azure. Microsoft and partner organizations develop these services and manage them together to provide a seamless experience through the Azure portal.

This article describes the Azure Native ISV tools that Azure MCP Server exposes, the example prompts you can use, and the parameters each tool accepts.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## ISV partners

- [Datadog](#datadog-monitored-resources): A monitoring and analytics platform for large-scale applications that includes infrastructure monitoring, application performance monitoring, log management, and user-experience monitoring.

## Datadog monitored resources

<!-- datadog monitoredresources list -->

The Azure MCP Server can list monitored resources in Datadog. [Datadog](/azure/partner-solutions/datadog/overview) is a monitoring and analytics platform for large-scale applications that includes infrastructure monitoring, application performance monitoring, log management, and user-experience monitoring.

The Datadog Azure Native Integration lets you manage Datadog directly in the Azure portal as an integrated service. This streamlined workflow covers everything from procurement to configuration, so you can quickly start monitoring the health and performance of your applications across Azure, hybrid, or multicloud environments.

Example prompts include:

- **List monitored resources:** "Show me all resources being monitored by Datadog resource 'my-datadog' in resource group 'my-resource-group'"
- **Check monitoring status:** "What resources are being monitored by Datadog 'main-datadog' in resource group 'my-resource-group'?"
- **View monitoring coverage:** "List all monitored resources for Datadog resource 'company-datadog' in resource group 'my-resource-group'"
- **Audit monitoring:** "Show me what's being monitored by Datadog 'prod-datadog' in resource group 'my-resource-group'"
- **Inventory check:** "Get the list of resources monitored by Datadog 'monitor-datadog' in resource group 'my-resource-group'"

| Parameter | Required | Description |
| --- | --- | --- |
| **Datadog resource** | Required | The name of the Datadog resource in Azure. |
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Partner Solutions documentation](/azure/partner-solutions/partners)
- [Datadog Azure integration documentation](/azure/partner-solutions/datadog/)

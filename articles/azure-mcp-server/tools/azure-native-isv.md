---
title: Azure Native ISV Tools for Azure MCP Server
description: Learn how to use Azure MCP Server with Azure Native ISV partner solutions like Datadog for monitoring and managing Azure resources using natural language prompts.
keywords: azure mcp server, azmcp, native isv, datadog, partner solutions, monitoring
author: diberry
ms.author: diberry
ms.date: 10/27/2025
ms.topic: reference
ms.service: azure
ai-usage: ai-assisted
---

# Azure Native ISV tools for Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Azure Native ISV partner solutions, using natural language prompts. This enables you to quickly manage third-party services that are natively integrated with Azure without remembering complex syntax, improving productivity and reducing operational overhead.

[Azure Native Integrations](/azure/partner-solutions/partners) enable you to easily provision, manage, and tightly integrate software and services from partner companies on Azure. Microsoft and partner organizations develop these services and manage them together, providing a seamless experience through the Azure portal.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## ISV partners

* [Datadog](#datadog-monitored-resources) - A monitoring and analytics platform for large-scale applications that encompasses infrastructure monitoring, application performance monitoring, log management, and user-experience monitoring.


## Datadog monitored resources

<!-- datadog monitoredresources list -->

The Azure MCP Server can list monitored resources in Datadog. [Datadog](/azure/partner-solutions/datadog/overview) is a monitoring and analytics platform for large-scale applications that encompasses infrastructure monitoring, application performance monitoring, log management, and user-experience monitoring.

Datadog's Azure Native Integration allows you to manage Datadog directly in the Azure console as an integrated service. This streamlined workflow covers everything from procurement to configuration, making it easy to start monitoring the health and performance of your applications across Azure, hybrid, or multicloud environments.

Example prompts include:

- **List monitored resources:** "Show me all resources being monitored by Datadog in my 'production-rg' resource group."
- **Check monitoring status:** "What resources are being monitored by my 'main-datadog' Datadog instance?"
- **View monitoring coverage:** "List all monitored resources for Datadog resource 'company-datadog' in resource group 'monitoring-rg'"
- **Audit monitoring:** "Show me what's being monitored by Datadog in subscription 'abc123'"
- **Inventory check:** "Get the list of resources monitored by our Datadog integration"

| Parameter | Required | Description |
| --- | --- | --- |
| **Datadog resource** | Required | The name of the Datadog resource in Azure. |

[!INCLUDE [datadog monitoredresources list](../includes/tools/annotations/azure-datadog-monitored-resources-list-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Partner Solutions documentation](/azure/partner-solutions/partners)
- [Datadog Azure integration documentation](/azure/partner-solutions/datadog/)

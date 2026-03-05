---
title: Azure Resource Health Tools 
description: Learn how to use the Azure MCP Server with Azure Resource Health.
keywords: azure mcp server, azmcp, resource health
author: diberry
ms.author: diberry
ms.date: 02/25/2026
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
tool_count: 2
mcp-cli.version: 2.0.0-beta.22+b6fc38c7fd6e025a7fd1dff42e49516225cae21b
--- 
# Azure Resource Health tools for the Azure MCP Server overview

The Azure MCP Server enables you to monitor resource health and availability by using natural language prompts. With this capability, you can quickly check the status of your Azure resources without needing to remember complex command syntax.

[Azure Service Health](/azure/service-health/) helps you stay informed and get support when Azure services are having issues that affect you now, or could cause issues in the future. Azure Service Health includes three main components - Azure Status, Service Health, and Resource Health.

## Get availability status

<!-- resourcehealth availability-status get -->

Get the availability and health status for your Azure resources. This command displays the health status of a specific virtual machine, storage account, or other resources. You can also list the availability status for all resources in a subscription or resource group to identify health issues and availability problems.

Example prompts include:

- Get the availability status for resource `resourceId`.
- Show me the health status of the virtual machine `vm_name`.
- What is the availability status of storage account `storage_account_name` in resource group `resource_group_name`?
- List availability status for all resources in subscription `subscription`.
- Show me the health status of all resources in resource group `resource_group_name`.
- What resources in subscription `subscription` have health issues?

| Parameter |  Required or optional | Description |
|-----------|----------|-------------|
| **Resource ID** | Required | The Azure resource ID to get health status for (for example, `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Compute/virtualMachines/{vm}`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get health event list

<!-- resourcehealth service-health-events list -->

List Azure service health events for a subscription to identify ongoing or past service issues. Provides comprehensive information about service incidents, planned maintenance, advisories, and security events. Supports filtering by event type, status, tracking ID, and custom OData filters.
Equivalent to Azure Service Health API for service events.

Example prompts include:

- "List service health events in subscription `<subscription>`"
- "Show me service health events for subscription `<subscription>` within the last month"
- "What service health issues have occurred recently?"
- "List resolved service health events for my subscription"
- "Show me all ongoing maintenance events for subscription `<subscription>`"

| Parameter      | Required or optional | Description |
|----------------|----------------------|-------------|
| **Event type** | Optional             | Filter by event type (`ServiceIssue`, `PlannedMaintenance`, `HealthAdvisory`, `Security`). If not specified, all event types are included. |
| **Filter**     | Optional             | Additional OData filter expression to apply to the service health events query. |
| **Query end time** | Optional         | End time for the query in ISO 8601 format (for example, `2024-01-31T23:59:59Z`). Events up to this time will be included. |
| **Query start time** | Optional       | Start time for the query in ISO 8601 format (for example, `2024-01-01T00:00:00Z`). Events from this time onwards will be included. |
| **Status**     | Optional             | Filter by status (`Active`, `Resolved`). If not specified, all statuses are included. |
| **Tracking ID**| Optional             | Filter by tracking ID to get a specific service health event. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Service Health](/azure/service-health/)

---
title: Azure MCP Server tools for Azure Resource Health
description: Use Azure MCP Server tools to manage resource health and availability of Azure resources with natural language prompts from your IDE.
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 03/24/2026
reviewer: shdesmu
tool_count: 2
mcp-cli.version: 2.0.0-beta.39
---

# Azure MCP Server tools for Azure Resource Health

The Azure MCP Server lets you manage resource health, including checking availability status, viewing health events, and tracking service-impacting issues across your Azure resources, with natural language prompts.

Azure Resource Health provides information about the health of your individual Azure resources and helps you diagnose and mitigate issues; for more information, see [Azure Resource Health documentation](/azure/service-health/resource-health-overview).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get resource health availability status

<!-- @mcpcli resourcehealth availability-status get -->

This tool retrieves the Azure Resource Health availability status for a specific resource or for all resources in a subscription or resource group. It reports whether a resource is `Available`, `Unavailable`, `Degraded`, or `Unknown`, and includes the reason and details to help you investigate and troubleshoot. You can check the health of Azure resources such as virtual machines and storage accounts. 

Example prompts include:

- "Get the availability status for resource 'vm-web-01'."
- "What is the Azure Resource Health availability status of the storage account 'mystorageacct'?"
- "What is the availability status of virtual machine 'app-server-01' in resource group 'rg-prod'?"
- "Get Azure Resource Health availability status for all resources in my subscription."
- "Show me the health status of all my Azure resources."
- "What resources in resource group 'rg-monitoring' have health issues?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **ResourceId** |  Optional | The Azure resource ID to get health status for such as `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Compute/virtualMachines/{vm}`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get resource health events

<!-- @mcpcli resourcehealth health-events list -->

List Azure Service Health events for your subscription to track incidents, planned maintenance, advisories, and security events over a specified time range (for example, `the last 30 days`). Query planned maintenance, past or ongoing incidents, advisories, and security events to retrieve details about resource availability, potential issues, and timestamps. The tool returns `trackingId`, `title`, `summary`, `eventType`, `status`, `startTime`, `endTime`, and `impactedServices`. Filter results by `Event type`, `Status`, `Tracking ID`, time range (`Query start time` and `Query end time`), or apply an OData `Filter` to narrow the results.

Example prompts include:

- "Show all service health events in my subscription."
- "Show Azure service health events for subscription <subscription_id>."
- "Which service issues occurred in the last 30 days?"
- "List active service health events in my subscription."
- "Show planned maintenance events for my Azure services."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Event type** |  Optional | Filter by event type (ServiceIssue, PlannedMaintenance, HealthAdvisory, Security). If not specified, all event types are included. |
| **Filter** |  Optional | Additional OData filter expression to apply to the service health events query. |
| **Query end time** |  Optional | End time for the query in ISO 8601 format (for example, `2024-01-31T23:59:59Z`). Events up to this time will be included. |
| **Query start time** |  Optional | Start time for the query in ISO 8601 format (for example, `2024-01-01T00:00:00Z`). Events from this time onwards will be included. |
| **Status** |  Optional | Filter by status (Active, Resolved). If not specified, all statuses are included. |
| **Tracking ID** |  Optional | Filter by tracking ID to get a specific service health event. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Resource Health documentation](/azure/service-health/resource-health-overview)
---
title: Azure MCP Server Tools for Azure Resource Health
description: Use Azure MCP Server tools to manage resource health and availability of Azure resources with natural language prompts from your IDE.
author: diberry
ms.author: diberry
reviewer: shdesmu
ms.date: 09/25/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 2
mcp-cli.version: "3.0.0-beta.47+bd724faf47e86348c7163a429b584aabfd714876"
---

# Azure MCP Server tools for Azure Resource Health

The Azure MCP Server lets you manage resource health, including checking availability status, viewing health events, and tracking service-impacting issues across your Azure resources, with natural language prompts.

Azure Resource Health provides information about the health of your individual Azure resources and helps you diagnose and mitigate issues. For more information, see [Azure Resource Health documentation](/azure/service-health/resource-health-overview).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get resource health availability status

This tool retrieves the Azure Resource Health availability status for a specific resource or for all resources in a subscription or resource group. It reports whether a resource is `Available`, `Unavailable`, `Degraded`, or `Unknown`, and includes the reason and details to help you investigate and troubleshoot. Specify a resource ID to check one resource, or specify a resource group to list statuses in that group. If you omit both parameters, the tool lists statuses across the subscription.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resourcehealth availability-status get \
  [--resourceId <resource-id>] \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resourceId` | string | No | The Azure resource ID to get health status for, such as `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Compute/virtualMachines/{vm}`. |
| `resource-group` | string | No | The Azure resource group name. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resourcehealth availability-status get -->

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
| **ResourceGroup** |  Optional | The name of the Azure resource group to filter results to. If you omit both **ResourceGroup** and **ResourceId**, availability statuses are listed for the entire subscription. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Get resource health events

List Azure Service Health events for your subscription to track incidents, planned maintenance, advisories, and security events over a specified time range (for example, `the last 30 days`). Query planned maintenance, past or ongoing incidents, advisories, and security events to retrieve details about resource availability, potential issues, and timestamps. The tool returns `trackingId`, `title`, `summary`, `eventType`, `status`, `startTime`, `endTime`, and `impactedServices`. Filter results by `Event type`, `Status`, `Tracking ID`, time range (`Query start time` and `Query end time`), or apply an OData `Filter` to narrow the results.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resourcehealth health-events list \
  [--event-type <event-type>] \
  [--status <status>] \
  [--tracking-id <tracking-id>] \
  [--filter <filter>] \
  [--query-start-time <query-start-time>] \
  [--query-end-time <query-end-time>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event-type` | string | No | Filter by event type (ServiceIssue, PlannedMaintenance, HealthAdvisory, Security). If not specified, all event types are included. |
| `status` | string | No | Filter by status (Active, Resolved). If not specified, all statuses are included. |
| `tracking-id` | string | No | Filter by tracking ID to get a specific service health event. |
| `filter` | string | No | Additional OData filter expression to apply to the service health events query. |
| `query-start-time` | string | No | Start time for the query in ISO 8601 format (for example, `2024-01-01T00:00:00Z`). Events from this time onwards are included. |
| `query-end-time` | string | No | End time for the query in ISO 8601 format (for example, `2024-01-31T23:59:59Z`). Events up to this time are included. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resourcehealth health-events list -->

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
| **Query end time** |  Optional | End time for the query in ISO 8601 format (for example, `2024-01-31T23:59:59Z`). Events up to this time are included. |
| **Query start time** |  Optional | Start time for the query in ISO 8601 format (for example, `2024-01-01T00:00:00Z`). Events from this time onwards are included. |
| **Status** |  Optional | Filter by status (Active, Resolved). If not specified, all statuses are included. |
| **Tracking ID** |  Optional | Filter by tracking ID to get a specific service health event. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Resource Health documentation](/azure/service-health/resource-health-overview)

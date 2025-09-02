---
title: Azure Health Resources Tools 
description: Learn how to use the Azure MCP Server with Azure Health Resources.
keywords: azure mcp server, azmcp, health resources
author: diberry
ms.author: diberry
ms.date: 08/20/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Health Resources tools for the Azure MCP Server

The Azure MCP Server enables you to monitor resource health and availability by using natural language prompts. With this capability, you can quickly check the status of your Azure resources without needing to remember complex command syntax.

[Azure Service Health](/azure/service-health/) helps you stay informed and get support when Azure services are having issues that affect you now, or could cause issues in the future. Azure Service Health includes three main components - Azure Status, Service Health, and Resource Health.

## Availability status: Get

Get the current availability status of an Azure resource to diagnose health issues. 
Provides detailed information about resource availability state, potential issues, and timestamps. 

Example prompts include:

- **Get resource health**: "Get the availability status for resource '/subscriptions/123/resourceGroups/mygroup/providers/Microsoft.Compute/virtualMachines/myvm'."
- **Check VM health**: "Show me the health status of my virtual machine 'myvm' in resource group 'mygroup'."
- **Resource status**: "What is the current status of resource '/subscriptions/abc/resourceGroups/infra/providers/Microsoft.Sql/servers/sql-prod'?"
- **Diagnose resource issue**: "Check the availability status for my storage account 'mystorageaccount'."
- **View health details**: "Show health details for resource '/subscriptions/xyz/resourceGroups/web/providers/Microsoft.Web/sites/webapp-prod'."

| Parameter |  Required or optional | Description |
|-----------|----------|-------------|
| **Resource ID** | Required | The Azure resource ID to get health status for (for example, `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Compute/virtualMachines/{vm}`). |


## Availability status: List

List availability statuses for all resources in a subscription or resource group.
Provides health status information for multiple Azure resources at once, including availability state, summaries, and timestamps. This information is useful for getting an overview of resource health across your infrastructure. You can filter results by resource group to narrow the scope.

Example prompts include:

- **List all resource health**: "List the availability statuses for all resources in my subscription."
- **Check resource group health**: "Show me the health status of all resources in resource group 'mygroup'."
- **Filter by resource type**: "Get the availability status for all virtual machines in my subscription."
- **Summarize resource health**: "What is the overall health status of resources in resource group 'mygroup'?"


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
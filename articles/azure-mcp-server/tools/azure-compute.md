---
title: Azure Compute tools for managing virtual machines
description: Discover Azure Compute tools for managing virtual machines and scale sets in Azure MCP Server. Explore features and start optimizing your resources.
#customer intent: As a system admin, I want to list all Virtual Machine Scale Sets in a subscription so I can manage their capacity and upgrade policies.
ms.date: 02/08/2026
keywords: Azure, MCP Server, compute, tools, virtual machines, scalability
ms.service: azure-mcp-server
ms.topic: concept-article
ms.reviewer: vigera
tool_count: 2
---

# Azure Compute tools for managing virtual machines

The MCP Server lets you manage virtual machines, handle load balancing, and achieve scalability with natural language prompts.

Azure Compute tools in the MCP Server help you manage virtual machines and scale sets efficiently. This article explains how to use these tools to optimize scalability and resource management. For more about Azure Compute, see [Azure Compute documentation](/azure/compute/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get virtual machine details

<!-- @mcpcli compute vm get -->

List or get Azure Virtual Machines (VMs) in a subscription or resource group. The command shows VM details including the name, location, size, provisioning state, OS type, and instance view with runtime status and power state.

Example prompts include:

- "Show me all virtual machines in resource group 'rg-prod'."
- "List the VMs in resource group 'webapp-dev'."
- "Get details for virtual machine 'myvm' in resource group 'rg-test'."
- "What is the status of VM 'production-vm' located in resource group 'rg-production'?"
- "Retrieve the instance view for VM 'test-vm' in resource group 'rg-development'."

| Parameter          | Required or optional | Description                                                                                          |
|--------------------|----------------------|------------------------------------------------------------------------------------------------------|
| **VM name**        | Optional             | The name of the virtual machine. You can specify a VM name to retrieve details for a specific VM. |
| **Instance view**  | Optional             | Include instance view details when retrieving a specific VM. Valid values: `true`, `false`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get virtual machine Scale Set

<!-- @mcpcli compute vmss get -->

List or get Azure Virtual Machine Scale Sets (VMSS) and their instances in a subscription or resource group. This command shows scale set details, including name, location, SKU, capacity, upgrade policy, and information about individual VM instances.

Example prompts include:

- "Show me all virtual machines in resource group 'rg-prod'."
- "List the VMs in resource group 'webapp-dev'."
- "Get details for virtual machine 'myvm' in resource group 'rg-test'."
- "What is the status of VM 'production-vm' located in resource group 'rg-production'?"
- "Retrieve the instance view for VM 'test-vm' in resource group 'rg-development'."

| Parameter       | Required or Optional | Description                                                    |
|------------------|----------------------|----------------------------------------------------------------|
| **VM scale set name**  | Optional             | Specify the name of the virtual machine scale set. |
| **Instance ID**| Optional             | Indicate the instance ID of the virtual machine in the scale set. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Compute documentation](/azure/compute/)
---
title: Azure Virtual Machines tools for managing virtual machines
description: Discover Azure Virtual Machines tools for managing virtual machines and scale sets in Azure MCP Server. Explore features and start optimizing your resources.
#customer intent: As a system admin, I want to list all Virtual Machine Scale Sets in a subscription so I can manage their capacity and upgrade policies.
ms.date: 02/12/2026
keywords: Azure, MCP Server, virtual machines, vm, tools, virtual machines, scalability
ms.service: azure-mcp-server
ms.topic: concept-article
ms.reviewer: vigera
tool_count: 2
optional_parameter: true
---

# Azure Virtual Machines tools for the Azure MCP Server overview

The MCP Server lets you manage virtual machines, handle load balancing, and achieve scalability with natural language prompts.

Azure virtual machines (VMs) are one of several types of on-demand, scalable computing resources that Azure offers. Typically, you choose a virtual machine when you need more control over the computing environment than the other choices offer. This article gives you information about what you should consider before you create a virtual machine, how you create it, and how you manage it. For more about Azure VMs, see [Azure Virtual Machines documentation](/azure/virtual-machines/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Get disk information

<!-- @mcpcli compute disk get -->

Retrieves detailed information about [Azure managed disks](/azure/virtual-machines/managed-disks-overview). You can list all disks under a subscription or a resource group, or get details about a specific disk. 

Example prompts:
- "Show me all managed disks in my subscription."
- "What managed disks are available under resource group 'rg-prod'?"
- "Get details for disk 'win_OsDisk1' in resource group 'rg-dev'."
- "I need information about the disk named `dataDisk*` across the subscription."
- "Retrieve details for the managed disk `myDataDisk` in resource group 'rg-production'."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Optional* | The name of the Azure resource group. Returns all VMs in the resource group if specified without VM name. *Required if **VM name** is provided.* |
| **Disk** | Optional* | The name of the disk. Support for wildcard patterns in disk names is available (e.g., `win_OsDisk*`). If you provide a disk name without specifying a resource group, the tool searches across the entire subscription. When you specify a resource group, the tool scopes the search to that resource group. Both parameters are optional.|

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get virtual machine details

<!-- @mcpcli compute vm get -->

List or get Azure Virtual Machines (VMs) in a subscription or resource group. The command shows VM details including the name, location, size, provisioning state, OS type, and instance view with runtime status and power state. If resource group name and VM name are not provided, it lists all VMs in the subscription.

Example prompts include:

- "Show me all virtual machines in resource group 'rg-prod'."
- "List the VMs in resource group 'webapp-dev'."
- "Get details for virtual machine 'myvm' in resource group 'rg-test'."
- "What is the status of VM 'production-vm' located in resource group 'rg-production'?"
- "Retrieve the instance view for VM 'test-vm' in resource group 'rg-development'."

| Parameter          | Required or optional | Description                                                                                          |
|--------------------|----------------------|------------------------------------------------------------------------------------------------------|
| **Resource group** |  Optional* | The name of the Azure resource group. Returns all VMs in the resource group if specified without VM name. *Required if **VM name** is provided.* |
| **VM name**        | Optional* | The name of the virtual machine. *Required if **Resource group** is provided.* |
| **Instance view**  | Optional               | Include instance view details when retrieving a specific VM. Valid values: `true`, `false`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get virtual machine Scale Set

<!-- @mcpcli compute vmss get -->

List or get [Azure Virtual Machine Scale Sets (VMSS)](/azure/virtual-machine-scale-sets) and their instances in a subscription or resource group. This command shows scale set details, including name, location, SKU, capacity, upgrade policy, and information about individual VM instances.  If parameters are not provided, it lists all VM scale sets in the subscription.

Example prompts include:

- "Show me all virtual machines in resource group 'rg-prod'."
- "List the VMs in resource group 'webapp-dev'."
- "Get details for virtual machine 'myvm' in resource group 'rg-test'."
- "What is the status of VM 'production-vm' located in resource group 'rg-production'?"
- "Retrieve the instance view for VM 'test-vm' in resource group 'rg-development'."

| Parameter       | Required or Optional | Description                                                    |
|------------------|----------------------|----------------------------------------------------------------|
| **Resource group**      | Optional* | The name of the Azure resource group. Returns all VM scale sets in the resource group if specified without VM scale set name. *Required if **VM scale set name** is provided.* |
| **VM scale set name**   | Optional* | The name of the virtual machine scale set. *Required if **Resource group** is provided.* |
| **Instance ID**         | Optional | The instance ID of the VM in the scale set. Requires **VM scale set name** and **Resource group**. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Compute documentation](/azure/compute/)
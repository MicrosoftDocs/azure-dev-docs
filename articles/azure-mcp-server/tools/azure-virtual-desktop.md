---
title: Azure Virtual Desktop Tools
description: Learn how to use the Azure MCP Server with Azure Virtual Desktop.
keywords: azure mcp server, azmcp, azure virtual desktop, avd, host pools, session hosts
author: diberry
ms.author: diberry
ms.date: 10/27/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
---

# Azure Virtual Desktop tools for the Azure MCP Server

The Azure MCP Server enables you to manage Azure Virtual Desktop resources by using natural language prompts. You can list host pools, view session hosts, monitor user sessions, and manage your virtual desktop infrastructure without needing to remember complex command syntax.

[Azure Virtual Desktop](/azure/virtual-desktop/overview) is a desktop and app virtualization service that runs on the cloud. It provides a full Windows experience with optimized Office 365 ProPlus, and supports Remote Desktop Services environments.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Conditional parameters

Some of the Azure Virtual Desktop tools require **one** of the following parameter options within the conversation context:

- **Option 1**: Host pool name
- **Option 2**: Host pool resource ID

Don't provide both parameters (host pool name and host pool resource ID) together, because this combination creates conflicting inputs. When you provide a host pool resource ID, the tool uses it instead of searching by name.

## Host pools: List host pools

<!-- virtualdesktop hostpool list -->

The Azure MCP Server can list all host pools in a subscription or resource group. This feature provides an overview of your virtual desktop infrastructure and helps you manage your desktop deployment.

Example prompts include:

- **List all host pools**: "Show me all host pools in my subscription."
- **View host pools**: "What host pools do I have available?"
- **Find host pools**: "List all virtual desktop host pools."
- **Query host pools**: "Show available host pools in my environment."
- **Check infrastructure**: "Get all Azure Virtual Desktop host pools."

[!INCLUDE [virtualdesktop hostpool list](../includes/tools/annotations/azure-virtual-desktop-hostpool-list-annotations.md)]

## Host pools: List session hosts in a host pool

<!-- virtualdesktop hostpool host list -->

The Azure MCP Server can list all session hosts in a host pool. This functionality helps you monitor your virtual machines and understand the capacity and status of your virtual desktop environment.

Example prompts include:

- **List session hosts**: "Show me all session hosts in the 'production-hostpool' host pool."
- **View VMs**: "What session hosts are in my host pool?"
- **Find hosts**: "List all virtual machines in hostpool 'dev-environment'."
- **Query capacity**: "Show session hosts in my virtual desktop pool."
- **Check hosts**: "Get all session hosts for host pool ID '/subscriptions/abc123/resourceGroups/rg/providers/Microsoft.DesktopVirtualization/hostPools/pool1'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Host pool** | [Conditionally](#conditional-parameters) required | The name of the Azure Virtual Desktop host pool. This is the unique name you choose for your host pool. |
| **Host pool resource ID** | [Conditionally](#conditional-parameters) required | The Azure resource ID of the host pool. When you provide this ID, the server uses it instead of searching by name. |

[!INCLUDE [virtualdesktop hostpool host list](../includes/tools/annotations/azure-virtual-desktop-hostpool-host-list-annotations.md)]

## Host pools: List user sessions

<!-- virtualdesktop hostpool host user-list -->

The Azure MCP Server can list all user sessions on a specific session host in a host pool. This capability helps you monitor active users, troubleshoot connection issues, and manage user workloads.

Example prompts include:

- **List user sessions**: "Show me all user sessions on session host 'vm-prod-001' in host pool 'production-pool'."
- **View active users**: "What users are connected to session host 'desktop-vm-02'?"
- **Find sessions**: "List all active sessions on host 'avd-host-001'."
- **Monitor users**: "Show user sessions for session host in my host pool."
- **Check connections**: "Get all user sessions on virtual machine 'session-host-03'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Host pool** | [Conditionally](#conditional-parameters) required | The name of the Azure Virtual Desktop host pool. This is the unique name you choose for your host pool. |
| **Host pool resource ID** | [Conditionally](#conditional-parameters) required | The Azure resource ID of the host pool. When you provide this ID, the server uses it instead of searching by name. |
| **Session host** | Required | The name of the session host. This name is the computer name of the virtual machine in the host pool. |

[!INCLUDE [virtualdesktop hostpool host user-list](../includes/tools/annotations/azure-virtual-desktop-hostpool-host-user-list-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Virtual Desktop documentation](/azure/virtual-desktop/)
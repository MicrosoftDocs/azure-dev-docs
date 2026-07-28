---
title: Azure Skill for Azure Compute
description: The azure-compute skill helps you manage Azure VMs and virtual machine scale sets (VMSS). Use it for VM size recommendations, pricing estimates, autoscale and orchestration options, capacity reservations, and Essential Machine Management (EMM) enrollment.
author: diberry
ms.author: diberry
ms.reviewer: alex-thompson, yinghuidong, jobanerj
ms.date: 07/22/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - devx-track-copilot-skills
ai-usage: ai-generated
ms.skillversion: "1.1.104"
---

# Azure Compute

Azure virtual machine (VM) and virtual machine scale set (VMSS) router for recommendations, pricing, autoscale, orchestration, capacity reservations, and Essential Machine Management (EMM) enrollment. This skill can answer questions about autoscaling and orchestration but isn't meant to help execute those tasks.

**Skill** `azure-compute` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-compute/SKILL.md)

## What it provides

You get guided recommendations to pick and compare Azure VM and VMSS sizes, pricing estimates, and autoscale configuration. Orchestration options (Flexible or Uniform) help you right-size workloads, manage load balancing, and control costs. The skill also supports capacity reservations and Essential Machine Management (EMM) enrollment.

## Prerequisites

- **Azure subscription** (required for working with actual VMs/VMSS): [Create a free account](https://azure.microsoft.com/free/) if you don't have one. Not required for general questions, recommendations, or pricing information.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+) (required for working with actual VMs/VMSS): [Install](/cli/azure/install-azure-cli) and sign in with `az login`. Not required for general questions, recommendations, or pricing information.

## When to use this skill

Use this skill when you need to:

- Recommend, compare, or price an Azure virtual machine (VM) or virtual machine scale set (VMSS).
- Create, provision, or deploy a VM or VMSS.
- Reserve or guarantee VM capacity with Capacity Reservation Groups (CRG).
- Enroll or monitor machines with Essential Machine Management (EMM).

> [!NOTE]
> To deploy an application (such as a Docker service, web app, API, or serverless workload), use the [`azure-prepare`](azure-prepare.md) skill instead. The `azure-compute` skill is for bare VM and VMSS infrastructure.
> To troubleshoot VM connectivity or access issues, use the [`azure-diagnostics`](azure-diagnostics.md) skill.

## Example prompts

Try these prompts to activate this skill:

- "Help me choose a VM"
- "Recommend a VM size for my workload"
- "Compare VM families for GPU workloads"
- "Cost estimate for my VMSS"
- "Create a Linux VM"
- "Provision a VMSS"
- "Set up a capacity reservation"
- "Configure Essential Machine Management"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-compute/SKILL.md)
- [Azure Diagnostics skill](azure-diagnostics.md)
- [Virtual Machines overview](/azure/virtual-machines/)
- [VM quickstart](/azure/virtual-machines/windows/quick-create-portal)
- [Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/)

---
title: Azure skill for Azure Compute
description: Azure VM and Virtual Machine Scale Set router for recommendations, pricing, autoscale, orchestration, connectivity troubleshooting, capacity reservations, and Essential Machine Management.
ms.topic: reference
ms.date: 5/12/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-2.4.2
ai-usage: ai-assisted
---

# Azure skill for Azure Compute

Azure virtual machine (VM) and Virtual Machine Scale Set router for recommendations, pricing, autoscale, orchestration, connectivity troubleshooting, capacity reservations, and Essential Machine Management.

**Skill** `azure-compute` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-compute/SKILL.md)

## What it provides

This skill helps with Azure VM and Virtual Machine Scale Set questions — including VM recommendations, connectivity troubleshooting, capacity reservations, and Essential Machine Management. It answers questions and provides guidance but doesn't execute infrastructure changes.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one. Not required for general questions, recommendations, or pricing information.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`. Not required for general questions, recommendations, or pricing information.

## When to use this skill

Use the **Azure Compute** skill when you need to:

- Select an appropriate VM SKU for your workload (server, web hosting, burstable, dev/test, or back-end)
- Configure autoscaling for virtual machine scale sets (Flexible or Uniform orchestration)
- Troubleshoot VM connectivity issues (RDP, SSH, port access)
- Get cost estimates for Azure VM configurations
- Work with capacity reservations (create, associate, or disassociate CRGs)
- Enroll VMs in Essential Machine Management

## Example prompts

Try these prompts to activate this skill:

- "Help me choose a VM for my workload"
- "What VM size should I use for a web server?"
- "Compare Azure VM families for machine learning workloads"
- "How much will a Standard D4s v3 VM cost?"
- "Help me set up autoscale for my VM scale set"
- "I can't connect to my VM through RDP, help me troubleshoot"
- "How do I reset the password on my Azure VM?"
- "What's the difference between Flexible and Uniform orchestration?"

## Related content

- [Virtual Machines overview](/azure/virtual-machines/)
- [VM quickstart](/azure/virtual-machines/windows/quick-create-portal)
- [Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/)
- [VM sizing and performance](/azure/virtual-machines/sizes)
- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-compute/SKILL.md)


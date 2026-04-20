---
title: Azure skill for compute
description: Azure VM and Virtual machine scale set (VMSS) router for recommendations, pricing, autoscale, orchestration, and connectivity troubleshooting. Answers questions but doesn't execute infrastructure changes.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-2.1.0
---

# Azure skill for compute

Azure virtual machine (VM) and Virtual machine scale set (VMSS) router for recommendations, pricing, autoscale, orchestration, and connectivity troubleshooting. This skill can answer questions about autoscaling and orchestration but isn't meant to help execute those tasks.

**Skill:** `azure-compute` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-compute/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Azure VM and Virtual machine scale set (VMSS) router for recommendations, pricing, autoscale, orchestration, and connectivity troubleshooting.

## Prerequisites

- **Azure subscription** (required for troubleshooting actual VMs/VMSS): [Create a free account](https://azure.microsoft.com/free/) if you don't have one. Not required for general questions, recommendations, or pricing information.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+) (required for pulling diagnostics from actual VMs/VMSS): [Install](/cli/azure/install-azure-cli) and sign in with `az login`. Not required for general questions, recommendations, or pricing information.

## When to use this skill

Use this skill when you need to:

- Create and manage Azure virtual machines (VMs) and virtual machine scale sets (VMSS).
- Configure autoscaling for virtual machine scale sets.
- Select appropriate VM SKUs for your workload (server, web hosting, burstable compute, or lightweight).
- Optimize VM selection for different workloads, including development/test scenarios and back-end services.
- Work with autoscale, load balancer, Flexible orchestration, and Uniform orchestration
- Work with cost estimate, Linux, black screen, and reset password
- Troubleshoot virtual machine connectivity issues.

## Example prompts

Try these prompts to activate this skill:

- "Help me choose a VM for my workload"
- "What VM size should I use for a web server?"
- "Compare Azure VM families for machine learning workloads"
- "How much will a Standard D4s v3 VM cost?"
- "Help me set up autoscale for my VM scale set"
- "I can't connect to my VM via RDP, help me troubleshoot"
- "How do I reset the password on my Azure VM?"
- "What's the difference between Flexible and Uniform orchestration?"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-compute/SKILL.md)


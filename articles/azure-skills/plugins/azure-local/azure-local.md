---
title: Azure skill for Azure Local
description: Plan, deploy, operate, and troubleshoot standard Azure Local environments with the Azure Local skill.
author: yunjchoi
ms.author: yunjchoi
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/05/2026
ms.custom: [devx-track-copilot-skills, skill-version-1.0.1]
ai-usage: ai-generated
---

# Azure skill for Azure Local

The `azure-local` skill helps you plan, deploy, operate, and troubleshoot Azure Local, formerly Azure Stack HCI. It covers standard deployments, rack-aware clusters, lifecycle updates, workloads, software-defined networking, and failure triage.

**Skill** `azure-local` | [Source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-local-skills/skills/azure-local/SKILL.md)

## When to use this skill

Use this skill for:

- Standard Azure Local deployments with 1-16 hyperconverged nodes.
- Disaggregated deployments and rack-aware clusters.
- Arc registration, custom locations, and Arc resource bridge.
- Azure Local virtual machines, AKS on Azure Local, images, disks, and logical networks.
- Lifecycle updates, disconnected sites, SDN, and troubleshooting.

Don't use this skill for multi-rack deployments that use Network Fabric Controller, Cluster Manager, or `Microsoft.NetworkCloud`. Use [Azure Local Multi-Rack](azure-local-multi-rack.md) instead.

## Safety

The skill starts with read-only checks. It asks for confirmation before updates, deletes, reimages, network changes, virtual machine power operations, or changes to Arc bridge and custom-location resources.

## Example prompts

- "Plan a standard Azure Local deployment for eight nodes."
- "Troubleshoot this Azure Local update failure."
- "Create a logical network for my Azure Local VMs."
- "Review the health of AKS on Azure Local."

## Related content

- [Azure Local Multi-Rack](azure-local-multi-rack.md)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-local-skills/skills/azure-local/SKILL.md)

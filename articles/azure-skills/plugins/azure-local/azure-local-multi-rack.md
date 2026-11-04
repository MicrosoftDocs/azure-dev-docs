---
title: Azure skill for Azure Local Multi-Rack
description: Plan, deploy, operate, and troubleshoot rack-scale Azure Local environments with the Azure Local Multi-Rack skill.
author: yunjchoi
ms.author: yunjchoi
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/05/2026
ms.custom: [devx-track-copilot-skills, skill-version-1.0.1]
ai-usage: ai-generated
---

# Azure skill for Azure Local Multi-Rack

The `azure-local-multi-rack` skill supports multi-rack, or rack-scale, Azure Local deployments. These preintegrated deployments can scale to hundreds of machines and use Network Fabric Controller, Cluster Manager, storage area network (SAN) storage, and managed network fabric.

> [!IMPORTANT]
> Azure Local multi-rack is in preview. Confirm current availability and limitations before you commit to a design.

**Skill** `azure-local-multi-rack` | [Source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-local-skills/skills/azure-local-multi-rack/SKILL.md)

## When to use this skill

Use this skill for:

- Rack-scale deployments with an aggregation rack and compute racks.
- Network Fabric Controller and Cluster Manager operations.
- Managed network fabric, isolation domains, load balancers, and network security groups.
- Multi-rack Azure Local virtual machines, AKS workloads, images, disks, and logical networks.
- Monitoring, serial console access, and failure triage for multi-rack resources.

Don't use this skill for standard 1-16 node or rack-aware deployments. Use [Azure Local](azure-local.md) instead.

## Safety

The skill starts read-only and asks for confirmation before fabric changes, isolation-domain edits, virtual machine power or delete operations, and changes that affect an aggregation rack or SAN.

## Example prompts

- "Plan a multi-rack Azure Local deployment."
- "Create an isolation domain for this network fabric."
- "Troubleshoot this Network Fabric Controller failure."
- "Deploy an Arc-enabled VM to my multi-rack environment."

## Related content

- [Azure Local](azure-local.md)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-local-skills/skills/azure-local-multi-rack/SKILL.md)

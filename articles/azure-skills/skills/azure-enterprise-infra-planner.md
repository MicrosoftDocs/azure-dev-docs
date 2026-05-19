---
title: Azure skill for enterprise infrastructure planning
description: Architect and provision enterprise Azure infrastructure from workload descriptions. For cloud architects and platform engineers planning networking, identity, security, compliance, and multi-resource topologies with waf alignment. Generates Bicep or Terraform directly (no azd).
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.2
---

# Azure skill for enterprise infrastructure planning

Architect and provision enterprise Azure infrastructure from workload descriptions. For cloud architects and platform engineers planning networking, identity, security, compliance, and multi-resource topologies with waf alignment. Generates Bicep or Terraform directly (no `azd`).

**Skill:** `azure-enterprise-infra-planner` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-enterprise-infra-planner/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Architect and provision enterprise Azure infrastructure from workload descriptions. For cloud architects and platform engineers planning networking, identity, security, compliance, and multi-resource topologies with waf alignment. Generates Bicep or Terraform directly (no `azd`).

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Design enterprise Azure infrastructure from high-level requirements.
- Architect Azure landing zones with security, governance, and cost controls.
- Design hub-and-spoke network topologies for multi-region Azure deployments.
- Plan multi-region disaster recovery topologies.
- Configure virtual network security with firewalls and private endpoints.
- Deploy Bicep templates at subscription scope (for infrastructure-only workflows; use `azure-prepare` for application-centric deployments).

## Example prompts

Try these prompts to activate this skill:

- "Deploy a geo-redundant backup solution for on-premises SQL servers using Azure Backup, configure encryption-at-rest, and automate monthly DR tests."
- "Deploy 3-tier architecture with hardened OS images, virtual machine (VM) backups scheduled daily, and application-level redundancy for the business logic tier."
- "Configure a site recovery plan for disaster failover from East to West Azure region, replicate major VM workloads, and automate DNS failbacks."
- "Provision a jumpbox VM for secure management, establish NSGs for each tier, and connect tiers using internal Azure Load Balancer."
- "Spin up Linux VMs for each tier using Terraform, automate patch management through Azure Automation, and log traffic between subnets for compliance."
- "Deploy three distinct VM scale sets for a legacy app, route incoming HTTP/S through Application Gateway with Web Application Firewall (WAF), and encrypt all data disks."
- "Set up Azure Backup for critical VM workloads, create a long-term retention policy for compliance, and test backup restores quarterly."
- "Deploy disaster recovery for VMware VMs using Azure Site Recovery, configure runbooks for smooth failover, and maintain compliance audit trails."

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-enterprise-infra-planner/SKILL.md)


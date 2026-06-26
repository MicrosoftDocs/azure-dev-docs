---
title: Azure Skill for Azure Enterprise Infrastructure Planning
description: The azure-enterprise-infra-planner skill helps you architect and provision enterprise-grade Azure infrastructure, applying Azure best practices and the Well-Architected Framework (WAF). Use it to plan networking, identity, security, compliance, and multi-resource topologies, and generate Bicep or Terraform code directly.
author: diberry
ms.author: diberry
ms.reviewer: arunrab
ms.date: 06/22/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - devx-track-copilot-skills
ai-usage: ai-generated
ms.skillversion: "1.0.2"
---

# Azure skill for Azure enterprise infrastructure planning

The `azure-enterprise-infra-planner` skill helps you architect and provision enterprise-grade Azure infrastructure by applying Azure best practices and the Well-Architected Framework (WAF). Use it to plan networking, identity, security, compliance, and multiresource topologies, and generate Bicep or Terraform code directly.

**Skill** `azure-enterprise-infra-planner` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-enterprise-infra-planner/SKILL.md)

## What it provides

You get guidance on designing enterprise Azure infrastructure, such as hub-spoke VNet topologies, Azure Firewall and network security group rules, Azure Backup policies, and multiregion disaster recovery patterns. You can also use it to generate Bicep or Terraform for your workload. The skill also fetches insights about your Azure environment and considers them when planning new workloads.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Design enterprise Azure infrastructure from high-level requirements.
- Architect Azure landing zones with security, governance, and cost controls.
- Design hub-and-spoke network topologies for multiregion Azure deployments.
- Plan multiregion disaster recovery topologies.
- Configure virtual network security with firewalls and private endpoints.
- Deploy Bicep templates at subscription scope (for infrastructure-only workflows; use `azure-prepare` for application-centric deployments).

## Example prompts

Try these prompts to activate this skill:

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
- [Azure landing zones](/azure/cloud-adoption-framework/ready/landing-zone/)
- [Cloud Adoption Framework](/azure/cloud-adoption-framework/)
- [Azure enterprise architecture](/azure/architecture/reference-architectures/enterprise-integration/)
- [Azure network architecture](/azure/architecture/networking/)

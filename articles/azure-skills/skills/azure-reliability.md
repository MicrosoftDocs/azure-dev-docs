---
title: Azure skill for reliability
description: Assess and improve the reliability posture of Azure Functions with zone redundancy, zone-redundant storage, health probes, and multi-region failover guidance.
ms.topic: reference
ms.date: 5/26/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.1
ai-usage: ai-assisted
---

# Azure skill for reliability

Assess and improve the reliability posture of Azure Functions: zone redundancy, zone-redundant storage, health probes, multi-region failover.

**Skill:** `azure-reliability` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-reliability/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge for assessing and improving the reliability of Azure Functions workloads. It scans deployed resources, presents a feature-pivoted reliability checklist, and drives staged remediation end-to-end with user confirmation.

The skill evaluates four core reliability dimensions:

- **Zone redundancy on compute** — determines whether your Azure Functions hosting plan is configured for availability zone redundancy, so failures in a single datacenter zone don't take your app offline.
- **Zone-redundant storage** — checks whether the storage account backing your Functions app uses zone-redundant replication (ZRS or GZRS) to protect against zone-level storage failures.
- **Health probes** — verifies whether health check endpoints are configured so load balancers can route traffic away from unhealthy instances.
- **Multi-region failover** — assesses whether your application is deployed across regions with traffic routing (Azure Front Door or Azure Traffic Manager) to survive a full regional outage.

When issues are found, the skill offers two remediation paths: running Azure CLI commands directly against live resources, or generating infrastructure-as-code patches (Bicep or Terraform) so changes persist across future deployments.

> **Scope note:** This skill currently supports Azure Functions only. App Service and Container Apps reliability are planned for a future version.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with the [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **Azure Resource Graph extension**: Install with `az extension add --name resource-graph` to enable resource discovery queries.
- **Reader access** on the target subscription or resource group for assessment. **Contributor access** is required to apply configuration changes.

## When to use this skill

Use this skill when you need to:

- Assess the reliability posture of an Azure Functions application.
- Determine whether a Functions app is zone redundant and identify which resources need to be updated.
- Check whether your storage account uses zone-redundant replication.
- Configure health check paths on your Functions app or hosting plan.
- Set up multi-region failover using Azure Front Door or Azure Traffic Manager for a Functions workload.
- Generate Bicep or Terraform patches to make reliability improvements durable across infrastructure deployments.
- Find single points of failure in a Functions workload before a production incident occurs.
- Prepare a Functions app for high availability or disaster recovery requirements.

## Example prompts

Try these prompts to activate this skill:

- "Assess the reliability of my Functions app"
- "Is my function app zone redundant?"
- "Make my function app zone redundant"
- "Check the reliability posture of my resource group"
- "Set up multi-region failover for my Functions app"
- "Enable high availability for my Azure Functions app"
- "Find single points of failure in my workload"
- "Check my disaster recovery readiness"
- "Upgrade my storage account to ZRS"
- "Add health probes to my Functions app"
- "Generate Bicep patches for zone redundancy"

## Related content

- [Azure Functions reliability in Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-functions)
- [Zone redundancy in Azure Functions](/azure/azure-functions/functions-zone-redundancy)
- [Azure Storage redundancy options](/azure/storage/common/storage-redundancy)
- [Azure Front Door overview](/azure/frontdoor/front-door-overview)
- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-reliability/SKILL.md)

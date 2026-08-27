---
title: Azure Skill for Kubernetes
description: Plan, create, and configure production-ready Azure Kubernetes Service (AKS) clusters. Covers Day-0 checklist, SKU selection, networking options, security, and operations.
author: diberry
ms.author: diberry
ms.date: 08/23/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - "skill-version-1.2.24"
---

# Azure skill for Kubernetes

Plan, create, and configure production-ready Azure Kubernetes Service (AKS) clusters. Covers Day-0 checklist, SKU selection (Automatic vs Standard), networking options (private API server, Azure cni Overlay, egress configuration), security, and operations (autoscaling, upgrade strategy, cost analysis).

**Skill:** `azure-kubernetes` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-kubernetes/SKILL.md)

## What it provides

This skill gives GitHub Copilot deep expertise in AKS cluster planning and configuration. It helps you make critical Day-0 decisions — networking topology, API server access, and pod IP model — that are difficult to change after cluster creation. This skill is scoped to cluster provisioning and configuration; to deploy an application to an existing AKS cluster, use the **azure-kubernetes-app-deploy** workflow instead. Specifically, it provides:

- **SKU selection guidance**: Recommends AKS Automatic vs Standard based on your control and customization needs.
- **Networking configuration**: Advises on Azure CNI Overlay vs VNet-routable CNI, egress strategies (Static Egress Gateway, UDR + Firewall), ingress options (App Routing, Istio, Application Gateway for Containers), and DNS settings.
- **Security best practices**: Guides Microsoft Entra ID integration, Workload Identity for pods, Key Vault secrets via CSI Driver, Azure Policy with Deployment Safeguards, and image signing.
- **Operations and scaling**: Configures autoscaling (KEDA, Node Auto Provisioning), upgrade strategies (maintenance windows, Fleet Manager), and observability (Managed Prometheus, Container Insights, Grafana).
- **Optimization**: Recommends rightsizing, Spot node pools, Cluster AutoScaler (CAS), and Vertical Pod Autoscaler (VPA).

### Related tools

| Tool | Command | Purpose |
|------|---------|---------|
| `mcp_azure_mcp_aks` | `AKS Model Context Protocol (MCP) entry point used to discover the exact AKS-specific tools exposed by the client` | Discover the callable AKS tool first, then use that tool's parameters |

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **[Azure Key Vault](/azure/key-vault/general/quick-create-portal)**: A key vault for secrets and certificate management.
- **[Azure Kubernetes Service](/azure/aks/learn/quick-kubernetes-deploy-portal)**: An AKS cluster for container orchestration.

## When to use this skill

Use this skill when you need to plan, provision, or configure an AKS cluster:

- Create AKS environment in Azure
- Provision AKS environment in Azure
- Enable AKS observability in Azure
- Design AKS networking in Azure
- Choose AKS SKU in Azure
- Secure AKS in Azure

## Example prompts

Try these prompts to activate this skill:

- "Help me create an AKS cluster"
- "I need to set up a new Kubernetes cluster on Azure"
- "Create a production-ready AKS cluster with best practices"
- "How do I provision an AKS cluster for my team?"
- "What networking options should I choose for AKS?"
- "AKS Day-0 checklist"
- "Plan AKS configuration for production"
- "Design AKS networking with private API server"
- "What's the difference between AKS Automatic and Standard?"
- "Should I use AKS Automatic or Standard SKU?"

## Related content

- [Azure MCP Server overview](/azure/developer/azure-mcp-server/overview)
- [Azure Kubernetes Service](/azure/aks/)

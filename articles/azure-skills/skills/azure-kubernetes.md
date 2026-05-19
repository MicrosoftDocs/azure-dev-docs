---
title: Azure skill for Kubernetes
description: Plan, create, and configure production-ready Azure Kubernetes Service (AKS) clusters. Covers Day-0 checklist, SKU selection (Automatic vs Standard), networking options (private API server, Azure cni Overlay, egress configuration), security, and operations (autoscaling, upgrade strategy, cost analysis).
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.4
---

# Azure skill for Kubernetes

Plan, create, and configure production-ready Azure Kubernetes Service (AKS) clusters. Covers Day-0 checklist, SKU selection (Automatic vs Standard), networking options (private API server, Azure cni Overlay, egress configuration), security, and operations (autoscaling, upgrade strategy, cost analysis).

**Skill:** `azure-kubernetes` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-kubernetes/SKILL.md)

## What it provides

This skill gives GitHub Copilot deep expertise in AKS cluster planning and configuration. It helps you make critical Day-0 decisions — networking topology, API server access, and pod IP model — that are difficult to change after cluster creation. Specifically, it provides:

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

Use this skill when you need to:

- Create AKS environment in Azure
- Provision AKS environment in Azure
- Enable AKS observability in Azure
- Design AKS networking in Azure
- Choose AKS SKU in Azure
- Secure AKS in Azure

## Suggested workflow

- **AKS Automatic** (default): Best for most production workloads, provides a curated experience with pre-configured best practices for security, reliability, and performance. Use unless you have specific custom requirements for networking, autoscaling, or node pool configurations not supported by Node Auto-Provisioning (NAP).
- **AKS Standard**: Use if you need full control over environment configuration, which requires additional overhead to set up and manage.
- **Azure CNI Overlay** (recommended): Uses private IP addresses for pods (not routable from the virtual network), scales to large environments, and works well for most production workloads.
- **Azure CNI (VNet-routable)**: pod IPs directly from VNet (pod subnet or node subnet), use when pods must be directly addressable from VNet or on-prem
- **Azure CNI powered by Cilium** (recommended): eBPF (extended Berkeley Packet Filter)-based for high-performance packet processing, network policies, and observability
- **Static Egress Gateway** for stable, predictable outbound IPs
- For restricted egress: user-defined route (UDR) + Azure Firewall or network virtual appliance (NVA)
- **App Routing addon with Gateway API** - recommended default for HTTP/HTTPS workloads
- **Istio service mesh with Gateway API** - for advanced traffic management, mTLS, canary releases
- **Application Gateway for Containers** - for L7 load balancing with Web Application Firewall (WAF) integration
- Enable **LocalDNS** on all node pools for reliable, performant DNS resolution
- Use **Microsoft Entra ID** everywhere (control plane, Workload Identity for pods, node access). Avoid static credentials.
- Azure Key Vault through **Secrets Store CSI Driver** for secrets
- Enable **Azure Policy** + **Deployment Safeguards**
- Enable **Encryption at rest** for etcd/API server; **in-transit** for node-to-node
- Allow only signed, policy-approved images (Azure Policy + Ratify), prefer **Azure Container Registry**
- **Isolation**: Use namespaces, network policies, scoped logging
- Use Managed Prometheus and Container Insights with Grafana for AKS observability (logs + metrics).
- Enable Diagnostic Settings to collect control plane logs and audit logs in a Log Analytics workspace for security monitoring and troubleshooting.
- For other monitoring and troubleshooting tools, use features like the Agentic CLI for AKS, Application Insights, Resource Health Center, AppLens detectors, and Azure Advisors.
- Configure **Maintenance Windows** for controlled upgrade timing
- Enable **automatic upgrades** for control plane and node OS to stay up-to-date with security patches and Kubernetes versions
- Consider **Long-Term Support (LTS) versions** for enterprise stability (2-year support) by upgrading your AKS environment to the Premium tier
- **Fleet upgrades**: Use **AKS Fleet Manager** for staged rollout across test to production environments
- Use **Ephemeral OS disks** (`--node-osdisk-type Ephemeral`) for faster node startup
- Select **Azure Linux** as node OS (smaller footprint, faster boot)
- Enable **KEDA (Kubernetes Event-Driven Autoscaling)** for event-driven autoscaling beyond Horizontal Pod Autoscaler (HPA)
- **Dedicated system node pool**: At least 2 nodes, tainted for system workloads only (`CriticalAddonsOnly`)
- Enable **Node Auto Provisioning (NAP)** on all pools for cost savings and responsive scaling
- Use **latest generation SKUs (v5/v6)** for host-level optimizations
- **Avoid B-series VMs** - burstable SKUs cause performance/reliability issues
- Use SKUs with **at least 4 vCPUs** for production workloads
- Set **topology spread constraints** to distribute pods across hosts/zones per SLO
- Deploy across **3 Availability Zones** (`--zones 1 2 3`)
- Use **Standard tier** for zone-redundant control plane + 99.95% SLA for API server availability
- Enable **Microsoft Defender for Containers** for runtime protection
- Configure **PodDisruptionBudgets** for all production workloads
- Use **topology spread constraints** to ensure pod distribution across failure domains
- Use **Spot node pools** for batch/interruptible workloads (up to 90% savings)
- **Stop/Start development and test clusters** to reduce costs: `az aks stop` and `az aks start`
- Consider **Reserved Instances** or **Savings Plans** for steady-state workloads

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


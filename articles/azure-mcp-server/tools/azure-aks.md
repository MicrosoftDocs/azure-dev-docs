---
title: Azure Kubernetes Service Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure Kubernetes Service (AKS) to manage your Kubernetes clusters and containers.
keywords: azure mcp server, azmcp, azure kubernetes service, aks, kubernetes, containers
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 09/23/2025
---
# Azure Kubernetes Service tools for the Azure MCP Server

Use the Azure MCP Server to manage Azure resources, including Azure Kubernetes Service (AKS) clusters, with natural language prompts. You can quickly manage your container workloads without remembering complex syntax.

[Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) is a managed container orchestration service that simplifies Kubernetes deployment and management. AKS provides serverless Kubernetes, integrated CI/CD, and enterprise-grade security and governance. With AKS, you focus on application development instead of infrastructure management.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Cluster: Get cluster details

<!-- azmcp aks cluster get -->

Use the Azure MCP Server to get detailed information about a specific Azure Kubernetes Service (AKS) cluster, including configuration, status, node pools, and networking details. This operation helps you examine cluster properties and monitor the health of your Kubernetes environment.

Example prompts include:

- **Cluster details**: "Show me details about the 'production-aks' cluster in my subscription."
- **Check cluster**: "Get information about cluster 'dev-kubernetes' in subscription 'dev-123'."
- **Cluster status**: "What's the current status of my 'staging-aks' cluster?"
- **View configuration**: "Show me the configuration for cluster 'web-app-cluster'."
- **Cluster health**: "Get detailed health information for my 'ml-workload-aks' cluster."
- **Node pool info**: "What are the node pool details for cluster 'analytics-cluster'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Name** | Required | The name of the AKS cluster to get details for. |

## Cluster: List clusters

<!-- azmcp aks cluster list --subscription -->

List all Azure Kubernetes Service (AKS) clusters in the specified subscription. Use this command to quickly inventory and monitor your AKS deployments across your Azure environment.

Example prompts include:

- **List all clusters**: "Show me all my AKS clusters in my subscription"
- **View cluster inventory**: "Can you list the Kubernetes clusters in resource group 'container-rg' for subscription 'dev-123'?"
- **Check cluster status**: "AKS clusters... dev environment... quick overview"
- **Cluster overview**: "I need a complete inventory of all our Kubernetes deployments across our enterprise subscription with their node counts and versions."
- **Find clusters**: "List clusters in the East US region only"
- **Monitor deployments**: "What's the status of our production AKS clusters? Are they all running properly?"

## Node pool: Get details for a specific node pool

<!-- azmcp aks nodepool get -->

Get details for a specific node pool (agent pool) in an Azure Kubernetes Service (AKS) cluster. This command returns key configuration and status, including size, count, OS, mode, autoscaling, and provisioning state.

Example prompts include:

- **Node pool details**: "Get details for node pool 'agentpool1' in AKS cluster 'production-aks' in resource group 'container-rg'"
- **View configuration**: "Show me the configuration for node pool 'spotpool' in AKS cluster 'web-app-cluster' in resource group 'dev-resources'"
- **Check setup**: "What is the setup of node pool 'gpu-pool' for AKS cluster 'analytics-aks' in 'data-group'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Cluster** |  Required | AKS cluster name. |
| **Node pool** |  Required | AKS node pool (agent pool) name. |

## Node pool: List node pools

<!-- azmcp aks nodepool list -->

List all node pools for a specific Azure Kubernetes Service (AKS) cluster. This command returns key node pool details, including sizing, count, OS type, mode, and autoscaling settings.

Example prompts include:

- **List node pools**: "List node pools for AKS cluster 'production-aks' in 'container-rg'"
- **Show node pool list**: "Show me the node pool list for AKS cluster 'web-app-cluster' in 'dev-resources'"
- **Check available node pools**: "What node pools do I have for AKS cluster 'analytics-aks' in 'data-group'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Cluster** |  Required | AKS cluster name. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Kubernetes Service documentation](/azure/aks/)
- [Kubernetes best practices](/azure/aks/best-practices)

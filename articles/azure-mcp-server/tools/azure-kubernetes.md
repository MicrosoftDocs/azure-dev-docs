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
ms.date: 10/27/2025
---
# Azure Kubernetes Service tools for the Azure MCP Server

Use the Azure MCP Server to manage Azure resources, including Azure Kubernetes Service (AKS) clusters, with natural language prompts. You can quickly manage your container workloads without remembering complex syntax.

[Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) is a managed container orchestration service that simplifies Kubernetes deployment and management. AKS provides serverless Kubernetes, integrated CI/CD, and enterprise-grade security and governance. With AKS, you focus on application development instead of infrastructure management.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Cluster: Get cluster details

<!-- aks cluster get -->

Get or list Azure Kubernetes Service (AKS) clusters. If a specific cluster name is provided, that cluster will
be retrieved. Otherwise, all clusters are listed in the specified subscription. Returns detailed cluster
information including configuration, network settings, and status.

Example prompts include:

- **Get cluster configuration**: "Get the configuration of AKS cluster 'production-aks'"
- **Cluster details with resource group**: "Show me the details of AKS cluster 'web-app-cluster' in resource group 'containers-rg'"
- **Network configuration**: "Show me the network configuration for AKS cluster 'ml-workloads'"
- **Detailed cluster info**: "What are the details of my AKS cluster 'dev-kubernetes' in 'development-rg'?"
- **List all clusters**: "List all AKS clusters in my subscription"
- **Show clusters**: "Show me my Azure Kubernetes Service clusters"
- **Cluster inventory**: "What AKS clusters do I have?"
- **Production environment**: "Get configuration details for AKS cluster 'prod-aks-001' in resource group 'production'"
- **Development setup**: "Show me the setup of AKS cluster 'staging-aks' in 'staging-resources'"
- **Microservices cluster**: "What's the configuration of AKS cluster 'microservices-cluster' in 'apps-rg'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Name** | Required | The name of the AKS cluster to get details for. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [aks cluster get](../includes/tools/annotations/azure-kubernetes-service-cluster-get-annotations.md)]

## Node pool: Get details for a specific node pool

<!-- aks nodepool get -->

Get or list Azure Kubernetes Service (AKS) node pools (agent pools) in a cluster. If a specific node pool name
is provided, that node pool is retrieved. Otherwise, all node pools are listed in the specified cluster.
Returns key configuration and status including size, count, OS, mode, autoscaling, and provisioning state.

Example prompts include:

- **Get node pool details**: "Get details for node pool 'agentpool1' in AKS cluster 'production-aks' in 'containers-rg'"
- **Node pool configuration**: "Show me the configuration for node pool 'spotpool' in AKS cluster 'web-app-cluster' in resource group 'apps-rg'"
- **Setup information**: "What is the setup of node pool 'gpu-pool' for AKS cluster 'ml-workloads' in 'ai-resources'?"
- **List all node pools**: "List node pools for AKS cluster 'dev-kubernetes' in 'development-rg'"
- **Show node pool list**: "Show me the node pool list for AKS cluster 'microservices-cluster' in 'production'"
- **Node pool inventory**: "What node pools do I have for AKS cluster 'analytics-aks' in 'data-rg'?"
- **Production node pools**: "Get details for node pool 'systempool' in AKS cluster 'prod-aks-001' in 'production-rg'"
- **User node pools**: "Show configuration for node pool 'userpool' in AKS cluster 'staging-aks' in 'staging-resources'"
- **Specialized pools**: "What's the setup of node pool 'gpupool' for AKS cluster 'training-cluster' in 'ml-rg'?"
- **Scale information**: "List all node pools with scaling details for AKS cluster 'scalable-apps' in 'compute-rg'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Cluster** |  Required | AKS cluster name. |
| **Node pool** |  Required | AKS node pool (agent pool) name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [aks nodepool get](../includes/tools/annotations/azure-kubernetes-service-node-pool-get-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Kubernetes Service documentation](/azure/aks/)
- [Kubernetes best practices](/azure/aks/best-practices)

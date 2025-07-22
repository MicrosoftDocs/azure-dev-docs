---
title: Azure Kubernetes Service Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure Kubernetes Service (AKS) to manage your Kubernetes clusters and containers.
keywords: azure mcp server, azmcp, azure kubernetes service, aks, kubernetes, containers
ms.service: azure-mcp-server
ms.topic: reference
---

# Azure Kubernetes Service tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Azure Kubernetes Service (AKS) clusters using natural language prompts. This enables you to quickly manage your container workloads without remembering complex syntax.

[Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) is a managed container orchestration service that simplifies Kubernetes deployment and management. AKS offers serverless Kubernetes, integrated CI/CD, and enterprise-grade security and governance, allowing you to focus on application development rather than infrastructure management.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## List clusters

<!--
azmcp aks cluster list --subscription
-->

Lists all Azure Kubernetes Service (AKS) clusters in the specified subscription. This command helps you quickly inventory and monitor your AKS deployments across your Azure environment.

Example prompts include:

- **List all clusters**: "Show me all my AKS clusters in my subscription"
- **View cluster inventory**: "What Kubernetes clusters do I have in my dev subscription?"
- **Check cluster status**: "List all AKS clusters in resource group 'container-rg'"
- **Cluster overview**: "Show me all my Kubernetes deployments in subscription 'prod-sub'"
- **Find clusters**: "Where are all my AKS clusters deployed?"


| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Subscription | Required | The ID or name of the subscription containing the AKS clusters. |


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Kubernetes Service documentation](/azure/aks/)
- [Kubernetes best practices](/azure/aks/best-practices)

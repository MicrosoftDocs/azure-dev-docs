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
ms.date: 7/22/2025
---

# Azure Kubernetes Service tools for the Azure MCP Server

The Azure MCP Server lets you manage Azure resources, including Azure Kubernetes Service (AKS) clusters, using natural language prompts. This feature enables you to quickly manage your container workloads without needing to remember complex syntax.

[Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) is a managed container orchestration service that simplifies Kubernetes deployment and management. AKS offers serverless Kubernetes, integrated CI/CD, and enterprise-grade security and governance. With AKS, you can focus on application development rather than infrastructure management.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## List clusters

<!--
azmcp aks cluster list --subscription
-->

Lists all Azure Kubernetes Service (AKS) clusters in the specified subscription. Use this command to quickly inventory and monitor your AKS deployments across your Azure environment.

Example prompts include:

- **List all clusters**: "Show me all my AKS clusters in my subscription"
- **View cluster inventory**: "Can you list the Kubernetes clusters in resource group 'container-rg' for subscription 'dev-123'?"
- **Check cluster status**: "AKS clusters... dev environment... quick overview"
- **Cluster overview**: "I need a complete inventory of all our Kubernetes deployments across our enterprise subscription with their node counts and versions."
- **Find clusters**: "List clusters in the East US region only"
- **Monitor deployments**: "What's the status of our production AKS clusters? Are they all running properly?"


| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Subscription | Required | The ID or name of your Azure subscription containing the AKS clusters. |


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Kubernetes Service documentation](/azure/aks/)
- [Kubernetes best practices](/azure/aks/best-practices)

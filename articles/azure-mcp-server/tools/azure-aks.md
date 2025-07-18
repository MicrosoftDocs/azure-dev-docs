---
title: Use Azure Kubernetes Service (AKS) with Azure MCP Server
titleSuffix: Azure MCP Server
description: Send natural language commands to Azure Kubernetes Service (AKS) to manage your Kubernetes clusters from Azure MCP Server.
ms.date: 07/17/2025
ms.topic: how-to
---

# Use Azure Kubernetes Service (AKS) with Azure MCP Server

The Azure MCP Server allows you to list the AKS Clusters in your Azure subscription using natural language commands. This feature simplifies managing your Kubernetes clusters by enabling you to interact with AKS through intuitive prompts.

[Azure Kubernetes Service (AKS)](https://azure.microsoft.com/products/kubernetes-service/) provides a managed Kubernetes container orchestration service.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List AKS clusters

<!-- azmcp aks cluster list --subscription <subscription> -->

List all AKS clusters in a specified Azure subscription.

Example prompts:

- **List all clusters**: "List all my AKS clusters in my subscription."
- **Find Kubernetes environments**: "Show me the available Kubernetes clusters in my Azure account."
- **View cluster inventory**: "Show me an inventory of all AKS clusters I have access to."
- **Find clusters by subscription**: "List the AKS clusters in my 'development' subscription."

| Parameter | Required | Description |
|-----------|----------|-------------|
| `subscription` | Yes | The Azure subscription ID or name |


## Next steps

- [Learn more about Azure Kubernetes Service](/azure/aks/intro-kubernetes)
- [Azure Kubernetes Service documentation](/azure/aks/)

---
title: Use Azure Kubernetes Service (AKS) with Azure MCP Server
titleSuffix: Azure MCP Server
description: Send natural language commands to Azure Kubernetes Service (AKS) to manage your Kubernetes clusters from Azure MCP Server.
ms.service: azure-mcp
ms.author: meburns
author: maggiesMSFT
ms.date: 07/17/2025
ms.topic: how-to
---

# Use Azure Kubernetes Service (AKS) with Azure MCP Server

This article describes how to use [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) features from Azure MCP Server. Azure MCP Server supports managing your Kubernetes clusters through natural language prompts.

## Prerequisites

* An Azure account with an active subscription.
* Azure MCP Server connected to your Azure subscriptions.
* Existing AKS clusters in your Azure subscription or permissions to list AKS clusters.

## Commands

### List AKS clusters

<!-- azmcp aks cluster list --subscription <subscription> -->

List all AKS clusters in a specified Azure subscription.

**Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `subscription` | Yes | The Azure subscription ID or name |

**Example prompts:**

- **List all clusters**: "List all my AKS clusters in my subscription."
- **Find Kubernetes environments**: "Show me the available Kubernetes clusters in my Azure account."
- **View cluster inventory**: "Show me an inventory of all AKS clusters I have access to."
- **Find clusters by subscription**: "List the AKS clusters in my 'development' subscription."

## Next steps

- [Learn more about Azure Kubernetes Service](/azure/aks/intro-kubernetes)
- [Azure Kubernetes Service documentation](/azure/aks/)

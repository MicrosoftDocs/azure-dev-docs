---
title: Azure Resource Group Operations
description: Learn how to use the Azure MCP Server with Azure Resource Groups.
keywords:  azure mcp server, azmcp, resource group
author: diberry
ms.author: diberry
ms.date: 5/05/2025
ms.topic: reference
ms.custom: build-2025
---
# Azure Resource Group operations for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Resource Groups.

[Azure Resource Groups](/azure/azure-resource-manager/management/overview) are logical containers that you use to group related resources in an Azure subscription. Resource groups include those resources that you want to manage as a group. The resources in a resource group typically share the same lifecycle, permissions, and policies. Resource groups help organize Azure resources for consistent management, deployment, and billing.

[!INCLUDE [tip-about-params](../includes/commands/parameter-consideration.md)]

## List resource groups

The Azure MCP Server can list [resource groups](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources) in a subscription. This is useful for quickly seeing all resource groups in your subscription.

### Example prompts

Example prompts for using the Azure MCP Server with Resource Groups.

- **List groups**: "List all resource groups in my subscription."
- **Show groups**: "What resource groups do I have?"
- **Find groups**: "I need to see my resource groups"
- **Query groups**: "Can you show me all my resource groups?"
- **Check groups**: "Resource groups in subscription abc123"

### Command reference

The Azure MCP Server has commands to manage Resource Groups. Advanced users and automation tools use these commands.

| Name            | Description               |
|-----------------|--------------------------|
| azmcp group list | List resource groups in a subscription.|

```console
azmcp group list \
    --subscription <SUBSCRIPTION_ID>
```

#### Required parameters

`--subscription`: The ID of the subscription to list resource groups from. This parameter is required.
 
#### Optional parameters

None

#### Examples

List all resource groups in the specified subscription.

```console
azmcp group list \
    --subscription "my-subscription-id"
```

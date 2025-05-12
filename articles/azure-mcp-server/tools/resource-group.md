---
title: Azure Resource Group Tools
description: Learn how to use the Azure MCP Server with Azure Resource Groups.
keywords:  azure mcp server, azmcp, resource group
author: diberry
ms.author: diberry
ms.date: 5/05/2025
ms.topic: reference
ms.custom: build-2025
---
# Azure Resource Group tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Resource Groups.

[Azure Resource Groups](/azure/azure-resource-manager/management/overview) are logical containers that you use to group related resources in an Azure subscription. Resource groups include those resources that you want to manage as a group. The resources in a resource group typically share the same lifecycle, permissions, and policies. Resource groups help organize Azure resources for consistent management, deployment, and billing.

[!INCLUDE [tip-about-params](../includes/toolsparameter-consideration.md)]

## List resource groups

The Azure MCP Server can list [resource groups](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources) in a subscription. This is useful for quickly seeing all resource groups in your subscription.

### Example prompts

Example prompts for using the Azure MCP Server with Resource Groups.

- **List groups**: "List all resource groups in my subscription."
- **Show groups**: "What resource groups do I have?"
- **Find groups**: "I need to see my resource groups"
- **Query groups**: "Can you show me all my resource groups?"
- **Check groups**: "Resource groups in subscription abc123"

### Reference

The Azure MCP Server has tools to manage Resource Groups. Advanced users and automation tools use these tools.

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

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

#### JSON response

[!INCLUDE [JSON response](../includes/response-format.md)]

#### Examples

List all resource groups in the specified subscription.

```console
azmcp group list \
    --subscription "my-subscription-id"
```

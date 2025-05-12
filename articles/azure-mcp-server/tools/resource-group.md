---
title: Azure Resource Group Tools 
description: Learn how to use the Azure MCP Server with Azure Resource Groups.
keywords: azure mcp server, azmcp, resource group
author: diberry
ms.author: diberry
ms.date: 5/12/2025
ms.topic: reference
ms.custom: build-2025
--- 
# Resource Group tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resource groups, providing foundational resource organization capabilities.

[Azure Resource Groups](/azure/azure-resource-manager/management/overview) are logical containers that help you organize and manage your Azure resources. Resource groups make it easier to administer your resources by deployment, billing, or natural affinity.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Use existing MCP server for Resource Groups

### List resource groups

The Azure MCP Server can list all resource groups in a subscription. This helps you see your organizational structure at a glance.

**Example prompts** include:

- **List groups**: "Show me all resource groups in my subscription."
- **View groups**: "What resource groups do I have available?"
- **Find groups**: "List all my resource groups"
- **Query groups**: "Show my resource group organization"
- **Check groups**: "Resource groups in subscription abc123"


## Develop new MCP server for Resource Groups

### List resource groups

The Azure MCP Server can list all resource groups in a subscription.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp group list | List resource groups in a subscription.|

```console
azmcp group list \
    --subscription <SUBSCRIPTION_ID>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription to list resource groups from.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

List all resource groups in the specified subscription.

```console
azmcp group list \
    --subscription "my-subscription-id"
```

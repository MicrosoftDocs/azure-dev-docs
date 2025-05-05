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
<!-- This is the proposed command article template for the Azure MCP Server documentation -->
<!-- H1 will be <SERVICE-NAME> operations -->
# Azure Resource Group operations

The Azure MCP Server allows you to manage Azure resources, including Resource Groups.

<!-- Brief description of the service with link to the official documentation. -->

[Azure Resource Groups](/azure/azure-resource-manager/management/overview) are logical containers that you use to group related resources in an Azure subscription. Resource groups include those resources that you want to manage as a group. The resources in a resource group typically share the same lifecycle, permissions, and policies. Resource groups help organize Azure resources for consistent management, deployment, and billing.

> [!TIP]
> When using the Azure MCP Server, required parameters need to be in the conversation context, but they don't always need to be in the exact prompt you use to call a command. If a parameter like a resource group name or subscription ID is already established in the conversation context, the MCP Server can use that information without requiring you to repeat it in every prompt. This creates a more natural conversational experience while still ensuring all necessary information is available.

<!--  
In this article...
Manage navigation by auto H2 links
-->

<!-- Each command is organized by intent - as an H2 that we can use for navigation -->
## List resource groups

The Azure MCP Server can list resource groups in a subscription. This is useful for quickly seeing all resource groups in your subscription.

<!-- the next subsection is for example prompts that would give the LLM a hint fort  -->
### Example prompts

Example prompts for using the Azure MCP Server with Resource Groups.

<!-- create several examples for the reader that capture the intent -->
- **List groups**: "List all resource groups in my subscription."
- **Show groups**: "What resource groups do I have?"
- **Find groups**: "I need to see my resource groups"
- **Query groups**: "Can you show me all my resource groups?"
- **Check groups**: "Resource groups in subscription abc123"

<!-- The command reference is for the tool command that will run by the MCP Server -->
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

- `--subscription`: The ID of the subscription to list resource groups from. This parameter is required.
 
#### Optional parameters

None

#### Examples

List all resource groups in the specified subscription.

```console
azmcp group list \
    --subscription "my-subscription-id"
```

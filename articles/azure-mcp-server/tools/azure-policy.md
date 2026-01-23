---
title: Azure Policy Tools for Azure MCP Server
description: 
keywords: azure mcp server, azmcp, policy
author: diberry
ms.author: diberry
ms.date: 01/23/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
reviewer: msalaman
--- 

# Azure Policy tools for Azure MCP Server overview

Azure MCP Server enables you to manage Azure Policy assignments, definitions, and initiatives using natural language prompts. Simplify policy management without complex syntax.

[Azure Policy](/azure/governance/policy/) is a service in Azure that allows you to create, assign, and manage policies to enforce rules and effects on your resources. It helps ensure compliance with organizational standards and regulatory requirements.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Policy: list assignments

<!-- @mcpcli policy assignment list -->

List policy assignments in a subscription or scope. This command retrieves all Azure Policy
assignments along with their complete policy definition details (rules, effects, parameters schema), enforcement modes, assignment parameters, and metadata. You can optionally filter by scope to list assignments at a specific resource group, resource, or management group level.

Example prompts include:

- "Show me all policy assignments in resource group 'rg-contoso'"
- "List every policy assignment available in resource group 'rg-production'"
- "Get details for policy assignment 'AuditVMUpdates' within resource group 'rg-contoso'"
- "Can you fetch the policy assignment called 'EnforceTagging' in resource group 'rg-marketing'?"
- "Retrieve the policy assignment named 'SecureStorage' from resource group 'rg-security'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Scope** |  Optional | The scope of the policy assignment (for example, `/subscriptions/{subscriptionId}`, `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}`). |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [policy assignment list](../includes/tools/annotations/azure-policy-assignment-list-annotations.md)]


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Policy](/azure/governance/policy/)
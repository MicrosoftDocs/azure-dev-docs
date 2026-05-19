---
title: Azure MCP Server tools for Azure Subscriptions
description: Use Azure MCP Server tools to list and identify Azure subscriptions with natural language prompts from your IDE.
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 03/27/2026
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
tool_count: 1
mcp-cli.version: 2.0.0-beta.33
---

# Azure MCP Server tools for Azure Subscriptions

The Azure Model Context Protocol (MCP) Server lets you list and identify Azure subscriptions with natural language prompts.

[Azure Subscriptions](/azure/cost-management-billing/manage/cloud-subscription) provide a way to organize and manage access to Azure resources. Subscriptions are the foundation for resource management, billing, and access control in Azure.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List subscriptions

<!-- @mcpcli subscription list -->

This tool lists all Azure subscriptions for the current account. For each subscription, it returns the subscription ID, display name, state, tenant ID, and whether it's the default subscription. The `isDefault` field indicates the user's default subscription as resolved from the Azure CLI profile (configured via [`az account set`](/cli/azure/account#az-account-set)) or, if not set there, from the `AZURE_SUBSCRIPTION_ID` environment variable.

Example prompts include:

- "Show me all of my subscriptions."
- "List all subscriptions starting with 'northeast'."
- "Which subscription is my default?"

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Subscriptions](/azure/cost-management-billing/manage/cloud-subscription)
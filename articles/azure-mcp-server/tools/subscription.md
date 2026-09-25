---
title: List Azure Subscriptions
description: Learn how to use Azure MCP Server tools to list Azure subscriptions, identify the default subscription, and understand each returned field.
author: diberry
ms.author: diberry
ms.date: 09/25/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
tool_count: 1
mcp-cli.version: "3.0.0-beta.47+bd724faf47e86348c7163a429b584aabfd714876"
---

# Azure MCP Server tools for Azure Subscriptions

The Azure Model Context Protocol (MCP) Server lets you list and identify Azure subscriptions with natural language prompts.

[Azure Subscriptions](/azure/cost-management-billing/manage/cloud-subscription) provide a way to organize and manage access to Azure resources. Subscriptions are the foundation for resource management, billing, and access control in Azure.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List subscriptions

This tool lists all Azure subscriptions for the current account. For each subscription, it returns the subscription ID, display name, state, tenant ID, and whether it's the default subscription. The `isDefault` field indicates the user's default subscription as resolved from the Azure CLI profile (configured via [`az account set`](/cli/azure/account#az-account-set)) or, if not set there, from the `AZURE_SUBSCRIPTION_ID` environment variable. If the tool identifies a default subscription, it lists that subscription first.

When a request doesn't specify a subscription, Azure MCP Server prefers the default subscription. If it can't determine a default and multiple subscriptions are available, it asks you which subscription to use.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp subscription list
```

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli subscription list -->

Example prompts include:

- "Show me all of my subscriptions."
- "List all subscriptions starting with 'northeast'."
- "Which subscription is my default?"

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Subscriptions](/azure/cost-management-billing/manage/cloud-subscription)

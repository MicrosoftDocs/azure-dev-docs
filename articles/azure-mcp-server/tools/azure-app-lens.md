---

title: Azure MCP Server tools for Azure AppLens
description: Use Azure MCP Server tools to diagnose and troubleshoot Azure App Service resources with natural language prompts from your IDE.
ms.date: 04/07/2026
ms.service: azure-mcp-server
ms.topic: concept-article
reviewer: msalaman 
tool_count: 1
mcp-cli.version: 2.0.0-beta.39
author: diberry
ms.author: diberry
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure AppLens

Use Azure MCP Server to diagnose Azure App Service resources by using natural language prompts.

Azure AppLens identifies and troubleshoots application and platform issues for Azure App Service. For more information, see [Azure AppLens documentation](/azure/app-service/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Diagnose applens resource

<!-- @mcpcli applens resource diagnose -->

Get diagnostic help from App Lens for Azure application and service issues to identify what's wrong with a service. Ask questions about performance, slowness, failures, errors, application state, or availability to receive expert analysis and solutions. Returns analysis, insights, and recommended solutions. Only the resource name and question are required. Subscription, resource group, and resource type are optional and used to narrow down results when multiple resources share the same name.

Example prompts include:

- "Diagnose resource 'webapp-prod' with AppLens, question: 'Why is the app responding slowly?'."
- "Use AppLens to check resource 'api-backend', question: 'Why are requests timing out under load?'."
- "What does AppLens report for resource 'orders-service', question: 'What is causing the recent 500 errors and failures?'."

| Parameter | Required or optional | Description |
|---|---|---|
| **Question** | Required | The diagnostic question to ask about the resource. |
| **Resource** | Required | The name of the resource to investigate or diagnose. |
| **Resource group** | Optional | Azure resource group name. Use to narrow results when multiple resources share the same name. |
| **Resource type** | Optional | The Azure resource type. Use to narrow results when multiple resources share the same name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure App Service diagnostics documentation](/azure/app-service/troubleshoot-diagnostic-logs)
---
title: Azure MCP Server tools for Azure Device Registry
description: Use Azure MCP Server tools to list and discover Azure Device Registry namespaces across subscriptions and resource groups with natural-language prompts.
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 05/21/2026
ms.custom: build-2025
ms.reviewer: diberry
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
mcp-cli.version: 3.0.0-beta.10+7287903f962dd029489594e2ae68842f3e10ac30
tool_count: 1
---

# Azure MCP Server tools for Azure Device Registry

Azure MCP Server helps you use natural-language prompts to discover Azure Device Registry resources in your Azure environment. You can list Azure Device Registry namespaces at the subscription scope or narrow the results to a specific resource group.

Azure Device Registry is part of Azure IoT Operations that provides a unified registry for managing assets and device endpoints in industrial IoT scenarios. For more information, see [What is Azure Device Registry?](/azure/iot-operations/discover-manage-assets/overview-manage-assets).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List Azure Device Registry namespaces

<!-- @mcpcli deviceregistry namespace list -->

Lists Azure Device Registry namespaces in a subscription or resource group. The tool returns details such as the namespace name, location, provisioning state, and UUID.

Example prompts include:

- "List all Azure Device Registry namespaces in my subscription."
- "What device registry namespaces do I have?"
- "Show me all device registry namespaces in resource group 'iot-resources'."
- "List device registry namespaces in the resource group 'production-iot'."
- "Can you list all my Azure Device Registry namespaces?"
- "Show device registry namespaces in subscription 11111111-1111-1111-1111-111111111111."
- "Find namespaces in the Contoso-IoT resource group and show their UUIDs."
- "Which device registry namespaces are available in my West US region?"

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [What is asset management in Azure IoT Operations?](/azure/iot-operations/discover-manage-assets/overview-manage-assets)

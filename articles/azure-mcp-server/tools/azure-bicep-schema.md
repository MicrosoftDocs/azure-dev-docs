---
title: Azure Bicep Schema Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure Bicep Schema to retrieve the latest API versions and properties for Azure resources in Bicep templates.
keywords: azure mcp server, azmcp, azure bicep, bicep schema, arm templates, infrastructure as code
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 07/22/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
---

# Azure Bicep Schema tools for the Azure MCP Server

The Azure MCP Server enables you to manage Azure resources, including Azure Bicep schemas, with natural language prompts. With this capability, you can quickly retrieve the latest API versions and property definitions for your Infrastructure as Code templates without needing to remember complex syntax.

[Azure Bicep](/azure/azure-resource-manager/bicep/) is a domain-specific language (DSL) that simplifies the authoring experience for Azure Resource Manager templates. Bicep offers concise syntax, reliable type safety, and support for all resource types and API versions.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get Bicep Resource Schema

<!-- azmcp bicepschema get -->

Gets the Bicep schema for the most recent apiVersion of an Azure resource. This operation helps you ensure your Bicep templates use the correct properties and values when defining Azure resources.

Example prompts include:

- **Get storage account schema**: "Get me the Bicep schema for Microsoft.Storage/storageAccounts"
- **Find service properties**: "How can I use Bicep to create an Azure OpenAI service?"
- **Check API version**: "What's the latest apiVersion for Microsoft.KeyVault/vaults?"
- **Need schema help**: "I'm creating a Bicep template for Microsoft.Cognitive/accounts"
- **Request schema guidance**: "Show me the properties for Microsoft.Web/sites"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource type** | Required | The Azure resource type in format `{ResourceProvider}/{ResourceType}` (such as `Microsoft.Storage/storageAccounts`, `Microsoft.Compute/virtualMachines`) |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Bicep documentation](/azure/azure-resource-manager/bicep/)
- [Azure Resource Manager template reference](/azure/templates/)
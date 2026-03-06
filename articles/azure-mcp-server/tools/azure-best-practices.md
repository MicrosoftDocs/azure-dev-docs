---
title: Azure best practices tools - Azure MCP Server
description: Use the Azure best practices tools in Azure MCP Server to get guidance on Azure Functions development, deployment, and Azure SDK usage.
keywords: azure mcp server, azmcp, best practices
ms.service: azure-mcp-server
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.date: 03/02/2026
author: diberry
ms.author: diberry
tool_count: 2
mcp-cli.version: 2.0.0-beta.23+535bd1649379f0596f18dc7d95987f8197de342d
ms.reviewer: conniey
---

# Azure best practices tools for the Azure MCP Server overview

The Azure MCP Server lets you manage data retrieval and analysis, including working with AI applications and executing get commands, with natural language prompts.

## Get Azure best practices for AI app

<!-- @mcpcli get azure bestpractices ai app -->

This command returns best practices and code generation guidance for building AI applications in Azure. Use it when you need recommendations on writing code for AI agents, chatbots, workflows, or any AI/LLM features. Additionally, this command provides guidance for code generation on Microsoft Foundry for application development. 

Example prompts include:

- "Get best practices for code generation in AI applications?"
- "Show me code guidance for chatbots in Azure?"
- "Get recommendations for building workflows using AI components?"
- "Create an AI app that helps me improve customer interactions?"
- "Create an AI app that supports data analysis in Microsoft Foundry?"

<!-- No parameters for this tool -->

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get Azure best practices

<!-- @mcpcli get azure bestpractices get -->

This tool returns a list of best practices for code generation, operations, and deployment when working with Azure services. Call this tool for any code generation, deployment, or operations involving Azure, `Azure Functions`, `Azure Kubernetes Service (AKS)`, `Azure Container Apps (ACA)`, `Bicep`, `Terraform`, `Azure Cache`, `Redis`, `CosmosDB`, `Entra`, `Azure Active Directory`, `Azure App Services`. 

Example prompts include:

- "Get the latest Azure coding agent best practices?"
- "Get the latest Azure operations best practices?"
- "Get the latest general Azure best practices?"
- "Get the latest Azure Static Web Apps code generation best practices?"
- "Get the latest Azure Static Web Apps deployment best practices?"
- "Get the latest Azure Static Web Apps best practices?"
- "Get the latest Azure Functions all best practices?"
- "What are coding agent best practices?"
- "Configure Azure MCP for my coding agent project?"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Action** | Required | The action type for the best practices. Options: `all`, `code-generation`, `deployment`. Note: `static-web-app` and `coding-agent` resources only support `all`. |
| **Resource** | Required | The Azure resource type for which to get best practices. Options: `general` (general Azure), `azurefunctions` (Azure Functions), `static-web-app` (Azure Static Web Apps), `coding-agent` (Coding Agent). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):
Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related resources

- [Azure Functions documentation](/azure/azure-functions/)
- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
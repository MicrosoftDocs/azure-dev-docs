---
title: Azure Best Practices Tools - Azure MCP Server
description: Use the Azure best practices tools in Azure MCP Server to get guidance on Azure Functions development, deployment, and Azure SDK usage.
author: diberry
ms.author: diberry
ms.reviewer: conniey
ms.date: 09/16/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
tool_count: 2
mcp-cli.version: "3.0.0-beta.37+19951caeceada3430e56e2487379817219a98df5"
---

# Azure best practices tools for the Azure MCP Server overview

The Azure MCP Server lets you manage data retrieval and analysis, including working with AI applications and executing get commands, with natural language prompts.

## Get Azure best practices for AI app

<!-- @mcpcli get azure bestpractices ai app -->

This command returns comprehensive best practices and code-generation guidance for building AI applications, workflows, and agents in Azure, including Microsoft Agent Framework usage and patterns and Microsoft Foundry application development. Call it before generating code for any AI application, working with Microsoft Agent Framework, or implementing an AI solution in Azure.

#### [MCP Server](#tab/mcp-server)

Example prompts include:

- "Get best practices for code generation in AI applications?"
- "Show me code guidance for chatbots in Azure?"
- "Get recommendations for building workflows using AI components?"
- "Create an AI app that helps me improve customer interactions?"
- "Create an AI app that supports data analysis in Microsoft Foundry?"

<!-- No parameters for this tool -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp get azure bestpractices ai app
```

This tool has no CLI parameters.

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Get Azure best practices

<!-- @mcpcli get azure bestpractices get -->

This tool returns secure, production-grade best practices for code generation, operations, and deployment when working with Azure services. Call this tool for any code generation, deployment, or operations involving Azure, `Azure Functions`, `Azure Kubernetes Service (AKS)`, `Azure Container Apps (ACA)`, `Bicep`, `Terraform`, `Azure Cache`, `Redis`, `CosmosDB`, `Entra`, `Azure Active Directory`, `Azure App Services`.

#### [MCP Server](#tab/mcp-server)

Example prompts include:

- "Get the latest Azure cloud agent best practices?"
- "Get the latest Azure operations best practices?"
- "Get the latest general Azure best practices?"
- "Get the latest Azure Static Web Apps code generation best practices?"
- "Get the latest Azure Static Web Apps deployment best practices?"
- "Get the latest Azure Static Web Apps best practices?"
- "Get the latest Azure Functions all best practices?"
- "What are cloud agent best practices?"
- "Configure Azure MCP for my cloud agent project?"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Action** | Required | The action type for the best practices. Options: `all`, `code-generation`, `deployment`. Note: the `static-web-app` and `coding-agent` resource values only support `all`. |
| **Resource** | Required | The Azure resource type for which to get best practices. Options: `general` (general Azure), `azurefunctions` (Azure Functions), `static-web-app` (Azure Static Web Apps), `coding-agent` (the resource value for Copilot cloud agent scenarios). |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp get azure bestpractices get \
  --resource <resource> \
  --action <action>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource` | string | Yes | The Azure resource type for which to get best practices. Options: `general` (general Azure), `azurefunctions` (Azure Functions), `static-web-app` (Azure Static Web Apps), `coding-agent` (Coding Agent). |
| `action` | string | Yes | The action type for the best practices. Options: `all`, `code-generation`, `deployment`. Note: `static-web-app` and `coding-agent` resources only support `all`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related resources

- [Azure Functions documentation](/azure/azure-functions/)
- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)

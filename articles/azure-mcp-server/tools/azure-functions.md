---
title: Azure MCP Server tools for Azure Functions
description: Use Azure MCP Server tools to manage Azure Functions app resources and generate Azure Functions code with natural language prompts from your IDE.
keywords: azure mcp server, azmcp, function apps
author: diberry
ms.author: diberry
ms.date: 04/06/2026
content_well_notification: 
  - AI-contribution
ai-usage: ai-generated
ms.topic: concept-article
ms.custom: build-2025
tool_count: 4
mcp-cli.version: 2.0.0-beta.39+0410ff6ade5c70a207a8e7c7a7c78be69f7f1d76
reviewer: manvkaur
ms.reviewer: manvkaur
---

# Azure MCP Server tools for Azure Functions

The Azure MCP Server enables you to manage Azure Functions resources by using natural language prompts. You can manage existing function app resources and generate Azure Functions code, including function templates, project scaffolding, and language discovery.

Azure Functions is a serverless compute service for running event-driven code without managing infrastructure. For more information, see [Azure Functions documentation](/azure/azure-functions/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Function app: list or get

<!-- @mcpcli functionapp get -->

Get details for a specific function app or list all function apps in your subscription. Returns information including name, location, status, and app service plan.

Example prompts include:

- "List all Function Apps in my subscription."
- "Show me all Function Apps in resource group 'rg-production'."
- "Retrieve details for the Function App named 'HealthMonitor' in resource group 'rg-production'."
- "Can you get the configuration of Function App 'DataProcessor' within resource group 'rg-analytics'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Function app** |  Optional | The name of the function app. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌



## Functions: get language list

<!-- @mcpcli functions language list -->

This tool lists supported programming languages for Azure Functions development. It helps you discover available languages, compare language options, and choose a language to start a project. It returns language names, runtime versions, prerequisites, recommended development tools, and init, run, and build commands. Review this information before you use functions project get and functions template get.

Example prompts include:

- "Which programming languages does Azure Functions support?"
- "Show a side-by-side comparison of all Azure Functions languages."
- "Which runtime versions are available for Azure Functions?"


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌


## Functions: get project get

<!-- @mcpcli functions project get -->

This tool returns project scaffolding information for a new Azure Functions app. It provides a project structure overview, setup instructions, and a file list that help you initialize a serverless project. The output helps you create the files and folders for the selected programming language.

Example prompts include:

- "Set up a new Azure Functions project in language 'python'."
- "Generate the project files for a TypeScript Azure Functions app, language 'typescript'."
- "Create the boilerplate for a Java Azure Functions app using JDK 21, language 'java'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Language** |  Required | Programming language for the Azure Functions project. Valid values: `python`, `typescript`, `javascript`, `java`, `csharp`, `powershell`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Functions: list or get template

<!-- @mcpcli functions template get -->

Generate Azure Functions code from templates that include triggers, bindings, AI agents, Durable Functions, and Model Context Protocol (MCP) servers, or list available templates. This tool generates serverless function code for a specified language. Without the template parameter, this tool lists available templates for the specified language. With the template parameter, this tool generates function code using the specified trigger and optional input and output bindings. You specify one trigger and zero or more bindings. Run this tool after you run `functions language list` and `functions project get`.

Example prompts include:

- "What triggers and bindings are available for Language 'csharp' Azure Functions?"
- "Show me all the Azure Function templates for Language 'python'."
- "Create a function from template 'TimerTrigger' in Language 'csharp' that runs every 5 minutes."
- "Show me template 'CosmosDBTrigger' with an output binding in Language 'java'."
- "I need template 'McpToolTrigger' in Language 'typescript' with runtime version '22'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Language** |  Required | Programming language for the Azure Functions project. Valid values: python, typescript, javascript, java, csharp, powershell. |
| **Runtime version** |  Optional | Optional runtime version for Java or TypeScript/JavaScript. When provided, template placeholders like {{javaVersion}} or {{nodeVersion}} are replaced automatically. See 'functions language list' for supported versions. |
| **Template name** |  Optional | Name of the function template to retrieve. Omit to list all available templates for the specified language and valid values of template name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Functions documentation](/azure/azure-functions/)
---
title: Manage Azure Functions with Azure MCP Server
description: Learn how to use the Azure MCP Server to manage function apps, review configurations, and troubleshoot deployments through AI-powered natural language interactions.
author: diberry
ms.author: diberry
ms.service: azure-functions
ms.topic: how-to
ms.date: 12/12/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-generated
ms.custom: build-2025

#customer intent: As an Azure Functions developer, I want to manage function apps using natural language conversations so that I can quickly verify configurations and troubleshoot issues without navigating portals.

---

# Manage Azure Functions with Azure MCP Server

Manage function apps, review configurations, and troubleshoot deployments using natural language conversations with AI assistants through the Azure MCP Server.

[Azure Functions](/azure/azure-functions/) is a serverless compute service that enables you to run event-driven code without managing infrastructure. While the Azure portal, Azure CLI, and Azure Functions Core Tools are powerful, the Azure MCP Server provides a more intuitive way to interact with your function apps through conversational AI.

## What is the Azure MCP Server?

[!INCLUDE [mcp-introduction](../includes/mcp-introduction.md)]

For Azure Functions developers, this means you can:

- Retrieve function app details and settings without navigating the portal
- Check function app status and configuration through simple questions
- Review hostnames and deployment information conversationally
- Troubleshoot function app issues by asking about current state
- Compare function app configurations across environments
- Verify function app settings before and after deployments

## Prerequisites

To use the Azure MCP Server with Azure Functions, you need:

### Azure requirements

- **Azure subscription**: An active Azure subscription. [Create one for free](https://azure.microsoft.com/free/).
- **Azure Functions resources**: At least one function app in your subscription, or permissions to create them.
- **Azure permissions**: Appropriate roles like Contributor or Website Contributor to perform the operations you want. See [Azure Functions security documentation](/azure/azure-functions/security-concepts).

[!INCLUDE [mcp-prerequisites](../includes/mcp-prerequisites.md)]

## Where can you use Azure MCP Server?

[!INCLUDE [mcp-usage-contexts](../includes/mcp-usage-contexts.md)]

## Available tools for Azure Functions

The Azure MCP Server provides one tool specifically designed for Azure Functions operations, enabling you to retrieve function app information through natural language conversations.

### Function app management

Get detailed information about your function apps, including configuration, status, hostnames, and deployment details.

**Common scenarios**:
- Quickly verify function app settings before deployments
- Check function app status and runtime information across environments
- Review hostnames and custom domains configured for function apps
- Troubleshoot function app issues by inspecting current configuration
- Compare function app settings between development and production
- Validate function app properties after infrastructure changes

For detailed information about each tool, including parameters and examples, see [Azure Functions tools for Azure MCP Server](../tools/azure-functions.md).

## Get started

Ready to use Azure MCP Server with your Azure Functions resources?

1. **Set up your environment**: Choose an AI assistant or development tool that supports MCP. See [Get started with Azure MCP Server](../get-started.md) for setup instructions.

2. **Connect to Azure**: Sign in to your Azure account through the MCP client. If you're prompted to authenticate, follow the authentication steps for your IDE:
   * [Cline](../get-started/tools/cline.md#use-prompts-to-test-the-azure-mcp-server)
   * [Cursor](../get-started/tools/cursor.md#use-prompts-to-test-the-azure-mcp-server)
   * [Eclipse](../get-started/tools/eclipse.md#use-prompts-to-test-the-azure-mcp-server)
   * [IntelliJ](../get-started/tools/jet-brains.md#use-prompts-to-test-the-azure-mcp-server)
   * [Visual Studio](../get-started/tools/visual-studio.md#use-prompts-to-test-the-azure-mcp-server)
   * [Visual Studio Code](../get-started/tools/visual-studio-code.md#use-prompts-to-test-the-azure-mcp-server)
   * [Windsurf](../get-started/tools/windsurf.md#use-prompts-to-test-the-azure-mcp-server)

3. **Start exploring**: Ask your AI assistant questions about your function apps or request operations. Try prompts like:
   - "Show me details for my function app 'my-functions' in resource group 'my-rg'"
   - "What's the current status of function app 'api-backend'?"
   - "List the hostnames for function app 'public-api'"

4. **Learn more**: Review the [Azure Functions tools reference](../tools/azure-functions.md) for all available capabilities and detailed parameter information.

## Best practices

When using Azure MCP Server with Azure Functions:

- **Specify resource group**: Always include the resource group name when querying function apps to avoid ambiguity in subscriptions with many resources.
- **Verify before changes**: Use read queries to understand current function app state before making configuration changes or deployments.
- **Compare environments**: Leverage conversational queries to compare function app settings across development, staging, and production environments for configuration consistency.
- **Check status regularly**: Ask about function app status and health as part of your deployment verification workflow to catch issues early.
- **Document configurations**: Use the conversation history to document current function app configurations for team knowledge sharing and troubleshooting.
- **Combine with other tools**: Use Azure MCP Server for quick queries and Azure Functions Core Tools for deployments to optimize your development workflow.

## Related content

* [Azure MCP Server overview](../overview.md)
* [Get started with Azure MCP Server](../get-started.md)
* [Azure Functions tools reference](../tools/azure-functions.md)
* [Azure Functions documentation](/azure/azure-functions/)
* [Azure Functions best practices](/azure/azure-functions/functions-best-practices)

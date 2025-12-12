---
ms.topic: include
ms.date: 12/12/2025
---

The Azure MCP Server works in three primary contexts:

### In AI-powered chat and code editors

Use the Azure MCP Server directly within AI assistants like GitHub Copilot, Cursor, or Windsurf. As you chat about your Azure resources, the AI assistant automatically invokes Azure MCP Server tools to retrieve information, make changes, or answer questions. This is the most common usage pattern.

**Example workflow**: Open VS Code, start GitHub Copilot agent mode, connect to Azure MCP Server, and ask questions about your Azure resources in natural language.

### In programmatic applications

Integrate the Azure MCP Server into your applications using the MCP SDK in Python, .NET, or other languages. Your app acts as an MCP client and invokes Azure MCP Server tools programmatically. This approach is useful for building custom automation, chatbots, or intelligent applications that need Azure integration.

**Example workflow**: Build a Python app that uses the MCP SDK to connect to Azure MCP Server and automate resource management based on business logic.

### In self-hosted scenarios

Deploy the Azure MCP Server in your own environment for advanced control, security requirements, or custom modifications. You can run it locally, in containers, or integrate it into existing infrastructure. This pattern suits enterprise scenarios requiring air-gapped environments or custom authentication flows.

**Example workflow**: Host Azure MCP Server in your Azure environment and connect multiple clients across your organization to a centralized instance.

For detailed setup instructions for each context, see [Get started with Azure MCP Server](../get-started.md).

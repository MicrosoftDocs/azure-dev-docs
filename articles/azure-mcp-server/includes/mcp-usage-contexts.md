---
ms.topic: include
ms.date: 12/12/2025
---

The Azure MCP Server works in three primary contexts:

### In AI-powered chat and code editors

Use the Azure MCP Server directly within AI assistants and code editors. As you chat about your Azure resources, the AI assistant automatically invokes Azure MCP Server tools to retrieve information, make changes, or answer questions. This is the most common usage pattern.

Get started with:
* [Cline](../get-started/tools/cline.md)
* [Cursor](../get-started/tools/cursor.md)
* [Eclipse](../get-started/tools/eclipse.md)
* [IntelliJ](../get-started/tools/jet-brains.md)
* [Visual Studio](../get-started/tools/visual-studio.md)
* [Visual Studio Code](../get-started/tools/visual-studio-code.md)
* [Windsurf](../get-started/tools/windsurf.md)
* [GitHub Copilot coding agent](../how-to/github-copilot-coding-agent.md)

### In programmatic applications

Integrate the Azure MCP Server into your applications using the MCP SDK. Your app acts as an MCP client and invokes Azure MCP Server tools programmatically. This approach is useful for building custom automation, chatbots, or intelligent applications that need Azure integration.

Get started with:
* [Python](../get-started/languages/python.md)
* [.NET](../get-started/languages/dotnet.md)

### In self-hosted scenarios

Deploy the Azure MCP Server in your own environment for advanced control, security requirements, or custom modifications. You can run it locally, in containers, or integrate it into existing infrastructure. This pattern suits enterprise scenarios requiring air-gapped environments or custom authentication flows.

Learn how to:
* [Deploy a remote MCP server with Microsoft Foundry](../how-to/deploy-remote-mcp-server-microsoft-foundry.md)
* [Deploy a remote MCP server with Copilot Studio](../how-to/deploy-remote-mcp-server-copilot-studio.md)

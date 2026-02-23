---
title: What is the Azure MCP Server?
description: Learn about the Azure MCP Server, its features, and how it helps developers build and deploy apps to Azure. Discover benefits and get started today.
#customer intent: As a developer, I want to understand what the Azure MCP Server is so that I can determine if it fits my app development needs.
ms.date: 02/09/2026
author: diberry
ms.author: diberry
ms.reviewer: sandeepsen
ms.topic: overview
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.custom: build-2025
---

# What is the Azure MCP Server?

The Azure MCP Server enables AI agents and clients to interact with Azure resources using natural language commands. This article explains its features, benefits, and how it helps developers build and deploy apps to Azure.

It implements the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) and supports a wide range of tools, languages, and frameworks to help you build and deploy apps to Azure.

## Key features

- **MCP support**: The Azure MCP Server implements the Model Context Protocol, making it compatible with MCP clients such as GitHub Copilot agent mode, the OpenAI Agents SDK, and Semantic Kernel.
- **Entra ID authentication**: The server uses Entra ID through the Azure Identity library, following Azure authentication best practices.
- **Service and tool integration**: The server supports Azure services and tools, including the Azure CLI, Azure Developer CLI (azd), and a broad set of Azure resources.

## Supported code editors and tools

You can connect to the Azure MCP Server from popular code editors and tools, including:

- [**Visual Studio Code**](get-started/tools/visual-studio-code.md)
- [**Visual Studio**](get-started/tools/visual-studio.md)
- [**Eclipse**](get-started/tools/eclipse.md)
- [**Cursor**](get-started/tools/cursor.md)
- [**Windsurf**](get-started/tools/windsurf.md)
- [**IntelliJ**](get-started/tools/jet-brains.md)
- [**Cline**](get-started/tools/cline.md)

## Supported languages and frameworks

The Azure MCP Server supports multiple languages and frameworks, such as:

- [**Python**](get-started/languages/python.md)
- [**.NET**](get-started/languages/dotnet.md)

## Concepts

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open protocol designed to manage how language models interact with external tools, memory, and context in a safe, structured, and stateful way. MCP defines a client-server architecture with several components:

- **Hosts**: Apps that use MCP clients to connect to and consume data from MCP servers.
- **Clients**: Components of MCP hosts that manage connections and retrieve data from MCP servers.
- **Servers**: Programs that provide features like data resources, tools for performing actions, and prompts to guide interactions.

For example, **Visual Studio Code** is considered a host, and GitHub Copilot agent mode in **Visual Studio Code** acts as an MCP client that connects to MCP servers. You can also build custom intelligent apps that host their own MCP client to connect to MCP servers.

The Azure MCP Server implements a set of [tools](./tools/index.md) per the Model Context Protocol. AI agents and other types of clients use these tools to interact with Azure resources.

## How-to guides

You can find step-by-step instructions for common tasks, including:

- [Connect GitHub Copilot coding agent to Azure MCP Server](how-to/github-copilot-coding-agent.md)
- [Deploy a self-hosted Azure MCP Server (Microsoft Foundry)](how-to/deploy-remote-mcp-server-microsoft-foundry.md)
- [Deploy a self-hosted Azure MCP Server (Copilot Studio)](how-to/deploy-remote-mcp-server-copilot-studio.md)

## Tools and best practices

The Azure MCP Server offers a wide range of tools for Azure development. For best practices and tool reference, see [Tools overview](tools/index.md).

## Scenarios for using the Azure MCP Server

The most common scenario is connecting to the Azure MCP Server from an existing client, such as GitHub Copilot agent mode in **Visual Studio Code** or a custom intelligent app. The client can use all available [tools](./tools/index.md) to access and interact with Azure resources using natural language. For example, you can use GitHub Copilot agent mode with the Azure MCP Server to list Azure storage accounts or run KQL queries on Azure databases. To learn how to connect to Azure MCP Server from an existing client, see [Get started using the Azure MCP Server](get-started.md).

In advanced scenarios, you might create your own MCP servers to offer custom tools, resources, and prompts for specific tasks involving Azure resources. If you're building an MCP server that needs to connect with Azure, you can use the Azure MCP Server tools from your MCP server.

[!INCLUDE [security-developer-environment](./includes/security-local-development.md)]

## Related content

- [Get started using the Azure MCP Server](get-started.md)
- [Azure MCP Server tools](./tools/index.md)
- [Model Context Protocol documentation](https://modelcontextprotocol.io/introduction)
- [Azure MCP Server repository](https://github.com/microsoft/mcp/tree/main/servers/Azure.Mcp.Server)

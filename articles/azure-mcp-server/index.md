---
title: What is the Azure MCP Server (Preview)?
description: Overview of the features and capabilities of the Azure MCP Server that helps developers be more productive when building and deploying apps to Azure.
author: ms-johnalex
ms.author: johalexander
ms.service: azure
ms.date: 05/14/2025
ms.topic: overview 
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.custom: build-2025
---

# What is the Azure MCP Server (Preview)?

The Azure MCP Server enables AI agents and other types of clients to interact with Azure resources through natural language commands. It implements the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) to provide these key features:

- **MCP support** Because the Azure MCP Server implements the Model Context Protocol, it works with MCP clients such as GitHub Copilot agent mode, the OpenAI Agents SDK, and Semantic Kernel.
- **Entra ID support** The Azure MCP Server uses Entra ID through the Azure Identity library to follow Azure authentication best practices.
- **Service and tool support** The Azure MCP Server supports Azure services and tools such as the Azure CLI and Azure Developer CLI (azd).

## Introduction to the Model Context Protocol (MCP)

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open protocol designed to manage how language models interact with external tools, memory, and context in a safe, structured, and stateful way. MCP defines a client-server architecture with several components:

- **Hosts**: Apps that use MCP clients to connect to and consume data from MCP servers.
- **Clients**: Components of MCP hosts that manage connections and retrieve data from MCP servers.
- **Servers**: Programs that provide features like data resources, tools for performing actions, and prompts to guide interactions.

For example, VS Code is considered a host, and GitHub Copilot agent mode in VS Code acts as an MCP client that connects to MCP servers. You might also build a custom intelligent app that hosts its own MCP client that connects to MCP servers.

The Azure MCP Server implements a set of [tools](./tools/index.md) per the Model Context Protocol. AI agents and other types of clients use these tools to interact with Azure resources.

## Scenarios for using the Azure MCP Server

The most common scenario for using the Azure MCP Server is to connect to it from an existing client, such as GitHub Copilot agent mode in VS Code or a custom intelligent app. The client can then use all the available [tools](./tools/index.md) to access and interact with Azure resources using natural language. For example, you could use GitHub Copilot agent mode with the Azure MCP Server to list Azure storage accounts or run KQL queries on Azure databases. To learn how to connect to Azure MCP server from an existing client, see [Get started using the Azure MCP Server](./get-started.md).

In more advanced scenarios, some developers may create their own MCP servers to offer custom tools, resources, and prompts for specific tasks that involve Azure resources. If you're building an MCP server that needs to connect with Azure, you can use the Azure MCP Server tools from your MCP server. For more information, see [Develop your own MCP server](./tools/index.md#develop-your-own-mcp-server).

## Related content

- [Get started using the Azure MCP Server](./get-started.md)
- [Azure MCP Server tools](./tools/index.md#develop-your-own-mcp-server)
- [Model Context Protocol documentation](https://modelcontextprotocol.io/introduction)
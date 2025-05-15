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

The Azure MCP Server provides a consistent and secure way for AI agents and other types of clients to access Azure resources and interact with them using natural language commands. With the Azure MCP Server, you can:

- Interact with Azure resources through AI agents such as GitHub Copilot agent mode in Visual Studio Code and other clients such as custom intelligent applications.
- Use natural language to interact with Azure resources without learning complex APIs or SDKs.
- Access Azure resources in secure ways so that sensitive data stays protected while still enabling AI-powered workflows.

## What is the Model Context Protocol (MCP)?

The Azure MCP Server is a server implementation of the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) for interacting with Azure services. MCP is a standard for connecting AI models to external systems like databases and APIs.

MCP defines a client-server architecture with three main components:

- **Hosts**: Apps that start client connections (for example, VS Code).
- **Clients**: Parts of hosts that manage connections to servers (for example, GitHub Copilot in VS Code).
- **Servers**: Services that provide features like data resources, tools for performing actions, and prompts to guide interactions.

The Azure MCP Server offers a large set of [tools](./tools/index.md) that AI agents use to interact with Azure.

## Scenarios for using the Azure MCP Server

The most common scenario for using the Azure MCP Server is to connect to it from an existing AI agent or client, such as GitHub Copilot agent mode in VS Code or a custom intelligent app. In this scenario, the [Azure MCP Server tools](./tools/index.md) for Azure service operations are available to the AI agent or client via natural language. For example, in VS Code, GitHub Copilot agent mode can use the Azure MCP Server to list Azure storage accounts or run KQL queries on Azure databases. For more information about consuming the Azure MCP Server from an existing AI agent or client, see [Get started using the Azure MCP Server](./get-started.md).

Some developers also create their own MCP servers to offer custom tools, resources, and prompts for specific tasks that involve Azure resources. If you're building an MCP server that needs to connect with Azure, you can use the Azure MCP Server tools from your MCP server. For more information, see [Develop your own MCP server](./tools/index.md#develop-your-own-mcp-server).

## Related content

- [Get started using the Azure MCP Server](./get-started.md)
- [Azure MCP Server tools](./tools/index.md#develop-your-own-mcp-server)
- [Model Context Protocol documentation](https://modelcontextprotocol.io/introduction)
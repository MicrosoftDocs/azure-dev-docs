---
title: "Build Agents using Model Context Protocol on Azure"
description: "This article explains how to build AI agents using the Model Context Protocol (MCP) on Azure to create intelligent, scalable applications."
ms.date: 09/04/2025
ms.topic: conceptual
ms.collection: ce-skilling-ai-copilot
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.subservice: intelligent-apps
#CustomerIntent: As a developer, I want to understand how to build AI agents using Model Context Protocol so that I can leverage them in modern applications.
---
# Build Agents using Model Context Protocol on Azure

The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) lets apps provide capabilities and context to a large language model. A key feature of MCP is defining tools that AI agents use to complete tasks. MCP servers can run locally, but remote MCP servers are crucial for sharing tools at cloud scale. The article aims to help developers understand these tools to create innovative solutions.

Developers can use the MCP in two main ways:

-	**Consume existing MCP servers**: Most developers use existing MCP servers, like the [Azure MCP Server](../azure-mcp-server/index.yml), to build agentic functionality into intelligent apps.

      Explore the [OpenAI MCP Agent Building Block AI template](https://aka.ms/mcp/openai), an example of consuming an existing MCP server. This template creates an MCP agent app in .NET that uses Azure OpenAI and connects to a remote MCP server written in TypeScript.

      The following diagram shows a simple architecture of the OpenAI MCP Agent Building Block:
      :::image type="content" source="./media/intro-agents-mcp/openai-mcp-agent-building-block-diagram.png" alt-text="Diagram showing architecture from MCP client to MCP server.":::

-	**Develop your own MCP server**: Some developers create their own MCP servers to offer custom tools, resources, and prompts for specific needs.

      Explore the [MCP Container App Building Block AI template](https://aka.ms/mcp/aca), an example of developing your own MCP server. This template sets up a remote Model Context Protocol (MCP) server using Azure Container Apps.

      The following diagram shows a simple architecture of the MCP Container App Building Block:
      :::image type="content" source="./media/intro-agents-mcp/mcp-container-app-building-block-diagram.png" alt-text="Diagram showing architecture of MCP server.":::

## Consume existing MCP servers

Most developers consume existing MCP clients in an MCP Host and AI agents instead of developing MCP servers from scratch. Your application or GitHub Copilot Agent Mode is the host. The agent component is the part of the application that contains the AI intelligence, while the MCP client component is responsible for MCP server communication.

### How MCP is integrated in your app

- **Host Application**: The overall application (like VS Code, a web app, etc.)
  - The host application is the environment where the MCP client and agent components run. Within the host, two key components interact:

      - **Agent Component**: The part that contains the AI intelligence (like GitHub Copilot Agent Mode or a custom agent built with Azure AI Agent Service or another framework).
        - This component is responsible for processing user requests and determining what external capabilities it needs.
        - It can be a separate module or integrated into the host application.
        - It might use AI models to interpret user input and generate responses.
        - The agent component is responsible for managing the flow of information between the user and the MCP client component.

      - **MCP Client Component**: The part that implements the MCP protocol.
        - This component is responsible for managing the connection to the MCP server and handling the communication between the agent component and the server.
        - The client can be a separate module or integrated into the host application.
        - The client component is responsible for sending requests to the MCP server and receiving responses.

## Develop your own MCP server

Some developers create their own MCP servers to offer custom tools, resources, and prompts for specific needs. This allows for greater flexibility and control over the capabilities provided to AI agents.

### How MCP servers are integrated in your app

- **MCP Server**: The server that implements the Model Context Protocol
  - The MCP server is responsible for providing tools, resources, and prompts to the agent component.
  - It can be hosted on Azure or any other cloud platform, or even run locally.
  - The server can be developed using various programming languages and frameworks, depending on the requirements and preferences of the developer.

There are two main scenarios for building your own MCP server:

  -	You build MCP servers that use features from existing MCP servers. In this case, your server calls existing MCP Server tool commands directly.
  
    For example, you can build a custom Cosmos DB MCP server that uses tools from the Azure MCP Server. This scenario lets you create a new server that uses existing features and adds your own custom features.
  
  - You build a custom MCP server that offers its own tools, resources, and prompts for your specific needs. This scenario lets you create a custom experience for your users while still using AI.
  
    For example, you can build a custom MCP server that provides tools for managing an in-house inventory system. This server could have tools for searching, adding, and updating inventory items, and resources that give information about the inventory system.

## Related resources

- [Build a TypeScript MCP server using Azure Container Apps](build-mcp-server-ts.md)
- [Build a .NET OpenAI Agent using an MCP server on Azure Container Apps](build-openai-mcp-server-dotnet.md)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Azure MCP Server](..\azure-mcp-server\index.yml)
- [Use MCP servers in VS Code (Preview)](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
- [Use MCP servers in Visual Studio (Preview)](/visualstudio/ide/mcp-servers)
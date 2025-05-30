---
title: "Build Agents using Model Context Protocol on Azure"
description: "Learn about AI agents, their types, and functionalities to use them in modern applications."
ms.date: 05/30/2025
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

-	**Consume existing MCP servers**: Most developers use existing MCP servers, like the Azure MCP Server, to build agentic functionality into intelligent apps.

  - **OpenAI MCP Agent Building Block**
  
    Use the following link to explore the OpenAI MCP Agent Building Block AI template, an example of consuming an existing MCP server. This template creates an MCP agent app in .NET that uses Azure OpenAI and connects to a remote MCP server written in TypeScript.

    https://aka.ms/mcp/openai

-	**Develop your own MCP server**: Some developers create their own MCP servers to offer custom tools, resources, and prompts for specific needs.

- **MCP Container App Building Block**

    Use the following link to explore the MCP Container App Building Block AI template, an example of developing your own MCP server. This template sets up a remote Model Context Protocol (MCP) server using Azure Container Apps.

    https://aka.ms/mcp/aca

## Consume existing MCP servers

Most developers consume existing MCP clients in an MCP Host and AI agents instead of developing MCP servers from scratch. Your application or GitHub Copilot Agent Mode is the host. The agent component is the part of the application that contains the AI intelligence, while the MCP client component is responsible for MCP server communication.

### How MCP is integrated in your app

- **Host Application**: The overall application (like VS Code, a web app, etc.)
  - The host application is the environment where the MCP client and agent components run.         
    - Within the host, two key components interact:
        - **Agent Component**: The part that contains the AI intelligence (like GitHub Copilot Agent Mode or a custom agent built with Azure AI Agent Service or another framework)
            - This component is responsible for processing user requests and determining what external capabilities it needs.
            - It can be a separate module or integrated into the host application.
            - It might use AI models to interpret user input and generate responses.
            - The agent component is responsible for managing the flow of information between the user and the MCP client component.
        - **MCP Client Component**: The part that implements the MCP protocol
            - This component is responsible for managing the connection to the MCP server and handling the communication between the agent component and the server.
            - The client can be a separate module or integrated into the host application.
            - The client component is responsible for sending requests to the MCP server and receiving responses.

## Related resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Azure MCP Server overview](..\azure-mcp-server\index.md)
- [Use MCP servers in VS Code (Preview)](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
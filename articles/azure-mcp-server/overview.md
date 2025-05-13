---
title: What is the Azure MCP Server (Preview)?
description: Overview of the features and capabilities of the Azure MCP Server that helps developers be more productive when building and deploying apps to Azure.
author: ms-johnalex
ms.author: johalexander
ms.service: azure
ms.date: 05/12/2025
ms.topic: overview 
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.custom: build-2025
---

# What is the Azure MCP Server?

The Azure MCP Server enables AI agents to interact with Azure resources through natural language commands. It provides a standardized way for developers to build intelligent applications that can use the power of AI while maintaining a consistent and secure way to access Azure resources.

## Why use the Azure MCP Server?

The Azure MCP Server helps developers work faster when building and deploying apps to Azure. With the Azure MCP Server, developers can:

- **Make development easier**: The Azure MCP Server gives a consistent way to access Azure resources, so it's easier to build apps that use AI.
- **Work faster**: Developers can use natural language commands to interact with Azure resources, so they don't need to learn complex APIs or SDKs.
- **Keep data safe**: The Azure MCP Server gives a secure way to access Azure resources, so sensitive data stays protected while still letting developers use AI.
- **Use existing tools**: The Azure MCP Server uses the Model Context Protocol (MCP), a standard for how AI models work with outside systems. Developers use existing tools and resources to build intelligent apps without starting from scratch.

## What is the Model Context Protocol (MCP)?

The Model Context Protocol (MCP) is a standard way for AI apps to safely use tools, data, and features from other sources. You can think of MCP like a "USB-C for AI apps"—it gives AI models one way to connect to different tools and data.

### Key components

The MCP has three main parts:

1. **Hosts**: Apps like GitHub Copilot Agent Mode in VS Code that start client connections
2. **Clients**: Parts of host apps that manage connections to servers
3. **Servers**: Services that provide special context and features 

### Core features

MCP servers offer three types of features:

1. **Resources**: Data files, database layouts, or other content that gives context to language models
2. **Tools**: Functions that let models perform actions like search, write files, or call APIs
3. **Prompts**: Templates that guide how language models interact
    with the server and its resources

## How do developers use the MCP?

Developers can use the MCP in two main ways:

1. **Consume existing MCP servers**: Most developers use existing MCP servers, like the Azure MCP Server, to build intelligent apps.

2. **Develop your own MCP server**: Some developers create their own MCP servers to offer custom tools, resources, and prompts for specific needs. This scenario is more advanced and needs a deeper understanding of the MCP protocol.

### Consume existing MCP servers

Most developers consume existing MCP clients in an MCP Host and AI agents instead of developing MCP servers from scratch. Your application or GitHub Copilot Agent Mode is the host. The agent component is the part of the application that contains the AI intelligence, while the MCP client component is responsible for MCP server communication.

**Host Application**: The overall application (like VS Code, a web app, etc.)
   
   Within the host, two key components interact:
   
   - **Agent Component**: The part that contains the AI intelligence (like GitHub Copilot Agent Mode or a custom agent)
     - This component is responsible for processing user requests and determining what external capabilities it needs.
     - It can be a separate module or integrated into the host application.
     - It might use AI models to interpret user input and generate responses.
     - The agent component is responsible for managing the flow of information between the user and the MCP client component.
   - **MCP Client Component**: The part that implements the MCP protocol
        - This component is responsible for managing the connection to the MCP server and handling the communication between the agent component and the server.
        - It can be a separate module or integrated into the host application.
        - The client component is responsible for sending requests to the MCP server and receiving responses.

For example:

    After you install the Azure MCP Server in VS Code, you can use GitHub Copilot Agent Mode to work with Azure resources.
    
    - You ask the agent to list all the storage accounts in your Azure subscription.
    - The agent handles your request and figures out what it needs to do.
    - The agent sends the request and any needed details to the MCP client.
    - The MCP client talks to the Azure MCP Server.
    - The server handles the request and works with Azure resources.
    - The results go back through the client.
    - The agent gets the results and shows them to you in VS Code.
    
    You can also update a command-line app so a user can chat with an agent that uses the MCP client to run a KQL query on an Azure database, instead of writing the KQL query themselves.
    
    - The user asks the command-line app for data in a certain format.
    - The agent handles the request and figures out what it needs to do.
    - The agent sends the request and details to the MCP client, which talks to the Azure MCP Server.
    - The server handles the request and works with Azure resources.
    - The results go back through the client.
    - The agent gets the results and shows them to the user in the command-line app.

### Develop your own MCP server

Most developers use existing MCP servers, but some build their own MCP servers. Building your own MCP server is more advanced and needs a deeper understanding of the MCP protocol and your app's needs.

There are two main scenarios for building your own MCP server:

- You build MCP servers that use features from existing MCP servers. In this case, your server calls the Azure MCP Server tool commands directly.

    For example, you can build a custom Cosmos DB MCP server that uses tools from the Azure MCP Server. This scenario lets you create a new server that uses existing features and adds your own custom features.

- You build a custom MCP server that offers its own tools, resources, and prompts for your specific needs. This scenario lets you create a custom experience for your users while still using AI.

    For example, you can build a custom MCP server for managing an in-house inventory system. This server could have tools for searching, adding, and updating inventory items, and resources that give information about the inventory system.

## Next step

[Get started using the Azure MCP Server](./get-started.md)
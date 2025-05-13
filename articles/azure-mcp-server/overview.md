---
title: What is the Azure MCP Server?
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

The Azure MCP Server enables AI agents to interact with Azure resources through natural language commands. It provides a standardized way for developers to build intelligent applications that can leverage the power of AI while maintaining a consistent and secure way to access Azure resources.

## Why use the Azure MCP Server?

The Azure MCP Server is designed to help developers be more productive when building and deploying applications to Azure.  By using the Azure MCP Server, developers can:

- **Simplify development**: The Azure MCP Server provides a consistent way to access Azure resources, making it easier to build intelligent applications that leverage the power of AI.
- **Improve productivity**: By using natural language commands, developers can quickly and easily interact with Azure resources without having to learn complex APIs or SDKs.   
- **Enhance security**: The Azure MCP Server provides a secure way to access Azure resources, ensuring that sensitive data is protected while still allowing developers to leverage the power of AI.
- **Leverage existing tools**: The Azure MCP Server is built on the Model Context Protocol (MCP), which is a standard for how AI models can work with outside systems. This means that developers can leverage existing tools and resources to build intelligent applications without having to reinvent the wheel.

## What is the Model Context Protocol (MCP)?

The Model Context Protocol (MCP) is a standard way for AI applications to safely access tools, data, and features from outside sources. You can think of MCP like a "USB-C for AI apps"— it gives AI models a universal way to connect to different tools and data.

### Key Components

The MCP has three main parts:

1. **Hosts**: Apps like GitHub Copilot Agent Mode in VS Code that start client connections
2. **Clients**: Parts of host apps that manage connections to servers
3. **Servers**: Services that provide special context and features

### Core Features

MCP servers offer three types of features:

1. **Resources**: Data files, database layouts, or other content that gives context to language models
2. **Tools**: Functions that let models perform actions like search, write files, or call APIs
3. **Prompts**: Templates that guide how language models interact
    with the server and its resources

## How do developers use the MCP?

Developers can use the MCP in two main ways:

1. **Consuming existing MCP servers**: Most developers use existing MCP servers, like the Azure MCP Server, to build intelligent applications. This is the most common scenario and is recommended for most developers. 

1. **Developing your own MCP server**: Some developers create their own MCP servers to provide custom tools, resources, and prompts for specific use cases. This is a more advanced scenario and requires a deeper understanding of the MCP protocol.

### Consuming existing MCP servers

Most developers consume existing MCP clients in an MCP Host and AI agents instead of developing MCP servers from scratch. Your application or GitHub Copilot Agent Mode is the host. The agent component is the part of the application that contains the AI intelligence, while the MCP client component is responsible for MCP server communication.

**Host Application**: The overall application (like VS Code, a web app, etc.)
   
   Within the host, two key components interact:
   
   - **Agent Component**: The part that contains the AI intelligence (like GitHub Copilot Agent Mode or a custom agent)
     - This component is responsible for processing user requests and determining what external capabilities it needs.
     - It can be a separate module or integrated into the host application.
     - It may use AI models to interpret user input and generate responses.
     - The agent component is responsible for managing the flow of information between the user and the MCP client component.
   - **MCP Client Component**: The part that implements the MCP protocol
        - This component is responsible for managing the connection to the MCP server and handling the communication between the agent component and the server.
        - It can be a separate module or integrated into the host application.
        - The client component is responsible for sending requests to the MCP server and receiving responses.

For example:

- After installing the Azure MCP Server in VS Code, you use GitHub Copilot Agent Mode to help you interact with Azure resources.
  
    - You ask the agent to list all the storage accounts in your Azure subscription.
    - The agent component processes your request and determines what external capabilities it needs. 
    - The agent passes the request along with any parameters to the MCP client component,
    - The client component communicates with the Azure MCP Server. 
    - The server processes the request and interacts with Azure resources.
    - The results are returned back through the client.
    - The agent component receives the results and presents them to the user  in VS Code.

- You update a command-line app so a user can chat with a agent that calls the client to use an Azure MCP Server tool to run a KQL query on an Azure database, instead of writing the KQL query themselves.
    - The user interacts with the command-line app requesting some data in a certain format.
    - The agent component processes the user's request and determines what external capabilities it needs.
    - The agent passes the request along with any parameters to the MCP client component, which communicates with the Azure MCP Server. 
    - The server processes the request and interacts with Azure resources.
    - The results are returned back through the client. 
    - The agent component receives the results and presents them to the user in the command-line app.

### Developing your own MCP server

Most developers use existing MCP servers, but some build their own MCP servers. Building your own MCP server is more advanced and needs a deeper understanding of the MCP protocol and your app's needs.

There are two main scenarios for building your own MCP server:

- You develop MCP Servers that leverage existing MCP Servers as part of their solution. In this case, you directly call the server tool commands.

    For example, you can build a custom Cosmos DB MCP server that uses those specfic tools in Azure MCP Server. This lets you create a new server that uses the features of the existing service and adds your own custom features. In this case, your new server calls the Azure MCP Server tool commands directly.

- You develop a custom MCP server that provides a set of tools, resources, and prompts for your specific use case. This allows you to create a tailored experience for your users while still leveraging the power of AI.

    For example, you develop a custom MCP server that provides tools for managing a in-house inventory system. This server could include tools for searching, adding, and updating inventory items, as well as resources that provide context about the inventory system.

## Next step

[Get started using the Azure MCP Server](./get-started.md)
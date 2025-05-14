---
title: Azure MCP Server (Preview)?
description: Overview of the features and capabilities of the Azure MCP Server that helps developers be more productive when building and deploying apps to Azure.
author: ms-johnalex
ms.author: johalexander
ms.service: azure
ms.date: 05/13/2025
ms.topic: overview 
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.custom: build-2025
---

# Azure MCP Server (Preview)

The Azure MCP Server enables AI agents to interact with Azure resources through natural language commands. It provides a standardized way for developers to build intelligent applications that can use the power of AI while maintaining a consistent and secure way to access Azure resources.

The Azure MCP Server helps developers work faster when building and deploying apps to Azure. With the Azure MCP Server, developers can:

- **Make development easier**: The Azure MCP Server gives a consistent way to access Azure resources, so it's easier to build apps that use AI.
- **Work faster**: Developers can use natural language commands to interact with Azure resources, so they don't need to learn complex APIs or SDKs.
- **Keep data safe**: The Azure MCP Server gives a secure way to access Azure resources, so sensitive data stays protected while still letting developers use AI.
- **Use existing tools**: The Azure MCP Server uses the Model Context Protocol (MCP), a standard for how AI models work with outside systems. Developers use existing tools and resources to build intelligent apps without starting from scratch.

## Introduction to the Model Context Protocol (MCP)

The Model Context Protocol (MCP) is a standard that helps AI models work with outside systems, like databases, APIs, and other services. It lets developers build apps that use AI in a consistent way, no matter what tools or data they need.

The MCP has three main components:

 - Hosts (apps like VS Code that start client connections), 
 - Clients (parts of host apps that manage connections to servers)
 - Servers (services that provide tools, resources, and prompts). 

An MCP server can provide features like data resources, tools for performing actions, and prompts to guide interactions with language models. Most developers use existing MCP servers, like the Azure MCP Server, to build apps, while some create custom MCP servers for specific needs.

The Azure MCP Server is a specific implementation of the MCP standard that focuses on several Azure services. It provides a set of tools and resources that developers can use to build intelligent applications that interact with Azure resources.

## Developer scenarios

Developers can use the Azure MCP Server in two main ways:

1. **Consume existing MCP servers**: Most developers use existing MCP servers, like the Azure MCP Server, to build intelligent apps.

   - **When to use this scenario**:
     - You need to integrate ready-to-use server capabilities.
     - Your application needs to perform specific Azure service operations through natural language.
     - You want to quickly add AI functionality without building servers from scratch.

2. **Develop your own MCP server**: Some developers create their own MCP servers to offer custom tools, resources, and prompts for specific needs. This scenario is more advanced and needs a deeper understanding of the MCP protocol.

    - **When to use this scenario**:
      - You need custom server functionality not available in existing solutions.
      - Your application requires deep integration with multiple Azure services.
      - You want to create specialized capabilities tailored to your domain expertise.
      - You need fine-grained control over how AI interacts with your data and services.
      - You're building advanced solutions that require custom reasoning or domain-specific knowledge.

Developers can integrate the Azure MCP Server into their apps to simplify workflows. For example, in VS Code, GitHub Copilot Agent Mode can use the MCP client to list Azure storage accounts or run KQL queries on Azure databases. Whether consuming or developing MCP servers, the Azure MCP Server helps developers work faster and more efficiently when building AI-powered applications.

## Next step

[Get started using the Azure MCP Server](./get-started.md)
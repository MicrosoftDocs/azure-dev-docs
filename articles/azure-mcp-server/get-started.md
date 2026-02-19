---
title: Get started with the Azure MCP Server
description: Overview of the options for using the Azure MCP Server with tools and languages
author: alexwolfmsft
ms.author: alexwolf
ms.date: 02/19/2026
ms.topic: get-started
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.custom: build-2025
---

# Get started with the Azure MCP Server

The [Azure MCP Server](overview.md) enables AI-powered development tools to interact with Azure cloud services through the Model Context Protocol (MCP). It provides a unified way to manage Azure resources, deploy applications, and query cloud services directly from your development environment.

Connect to Azure MCP Server using various tools, languages, and frameworks. Use it to manage Azure resources through natural language conversations, build automation scripts, or integrate Azure operations into your applications.

Explore and contribute to the [Azure MCP Server on GitHub](https://github.com/microsoft/mcp/tree/main/servers/Azure.Mcp.Server).

## Install using a package manager

You can install Azure MCP Server directly using one of the supported package managers. Package manager installation offers several advantages, including centralized dependency management, CI/CD integration, support for headless/server environments, version control, and project portability. For more information, see [Install with a package manager](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/README.md#package-manager).

- **NuGet**: [Azure.Mcp](https://www.nuget.org/packages/Azure.Mcp/2.0.0-beta.20)
- **NPM**: [@azure/mcp](https://www.npmjs.com/package/@azure/mcp/v/2.0.0-beta.20)
- **PyPI**: [msmcp-azure](https://pypi.org/project/msmcp-azure/)

## Connect using code editors

Azure MCP Server works with AI-powered code editors and tools that support the Model Context Protocol. Learn how to get started:

- [**Cline**](get-started/tools/cline.md)
- [**Cursor**](get-started/tools/cursor.md)
- [**IntelliJ**](get-started/tools/jet-brains.md)
- [**Visual Studio**](get-started/tools/visual-studio.md)
- [**Visual Studio Code**](get-started/tools/visual-studio-code.md)
- [**Windsurf**](get-started/tools/windsurf.md)

## Other tools and services

Connect to Azure MCP Server using other tools and services, such as GitHub Copilot coding agent and Docker. Learn how to get started:

- [**GitHub Copilot coding agent**](/azure/developer/azure-mcp-server/how-to/github-copilot-coding-agent)
- [**Docker**](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/README.md#docker)

## Connect using languages & frameworks

Connect to Azure MCP Server using programming languages and frameworks. This documentation currently provides guidance and examples for Python and .NET.

### Python

[Get started with Azure MCP Server and Python](get-started/languages/python.md) to enhance your apps and workflows.

- Use Python MCP client libraries to connect directly to Azure MCP Server.
- Build automation scripts that manage Azure resources.
- Integrate into web frameworks like Django, Flask, or FastAPI.
- Incorporate Azure operations into data science workflows with Jupyter notebooks.

### .NET

[Get started with Azure MCP Server and .NET](get-started/languages/dotnet.md) to enhance your apps and workflows.

- Create console applications and command-line tools for Azure management.
- Build ASP.NET Core web applications with integrated Azure capabilities.
- Develop Azure Functions that leverage Azure MCP Server for resource management.
- Create Windows desktop applications with Azure integration.

The Azure MCP Server provides flexibility to work with Azure in the way that best fits your development style and requirements, whether through interactive AI-powered editors or programmatic integration in your applications.

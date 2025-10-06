---
title: Azure App Lens Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure App Lens to manage your application performance and insights.
keywords: azure mcp server, azmcp, azure app lens, application performance, insights
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 09/23/2025
---

# Azure App Lens tools for the Azure MCP Server

The Azure MCP Server lets you manage Azure resources, including Azure App Lens, using natural language prompts. This feature enables you to quickly manage your application performance and insights without needing to remember complex syntax.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Resource: Diagnose

<!-- `azmcp applens resource diagnose` -->

Diagnose Azure resource performance issues, slowness, failures, and availability problems. This tool returns a list of insights and solutions to the user question.

Example prompts include:

- **Diagnose app issues**: "Please help me diagnose issues with my app 'mywebapp' using app lens for resource type 'WebApp'"
- **Check app slowness**: "Use app lens to check why my app 'orders-api' is slow for resource type 'API'"
- **Service health**: "What does app lens say is wrong with my service 'inventory-service' for resource type 'ServiceFabric'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Question** |  Required | User question. |
| **Resource** |  Required | The name of the resource to investigate or diagnose. |
| **Resource Type** |  Required | Resource type.  |

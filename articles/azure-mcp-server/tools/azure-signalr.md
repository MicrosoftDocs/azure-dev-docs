---
title: Azure SignalR Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure SignalR to manage your real-time messaging and communication services.
keywords: azure mcp server, azmcp, azure signalr, signalr service
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/08/2025
---

# Azure SignalR tools for the Azure MCP Server

The Azure MCP Server lets you manage Azure resources, including Azure SignalR resources, using natural language prompts. This feature lets you quickly manage your SignalR resources without remembering complex syntax.

[Azure SignalR](/azure/azure-signalr) is a fully managed real-time messaging service that enables you to build and integrate real-time communication into your applications.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Runtime: Get or list runtime information

<!-- `azmcp signalr runtime get` -->

Gets or lists details of an Azure SignalR runtimes. If a specific SignalR name is used, the details of that
SignalR runtime will be retrieved. Otherwise, all SignalR runtimes in the specified subscription or resource
group will be retrieved. Returns runtime information including identity, network ACLs, upstream templates.

Example prompts include:

- **Get specific SignalR details**: "Show me the details of SignalR 'my-signalr-service'"
- **Network information**: "Show me the network information of SignalR runtime 'chat-signalr'"
- **Resource group specific**: "Describe the SignalR runtime 'realtime-hub' in resource group 'messaging-rg'"
- **Detailed runtime info**: "Get information about my SignalR runtime 'notification-service' in 'production-rg'"
- **List by resource group**: "Show all the SignalRs information in 'communication-rg'"
- **Subscription-wide listing**: "List all SignalRs in my subscription"
- **Production environment**: "Show details of SignalR runtime 'prod-signalr-001' in resource group 'prod-messaging'"
- **Development setup**: "Get runtime information for SignalR 'dev-chat-service' in 'development-rg'"
- **Gaming application**: "Show me the details of SignalR 'game-hub' used for real-time gaming"
- **IoT messaging**: "Display network ACLs and upstream templates for SignalR 'iot-signalr' in 'iot-resources'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Signalr** |  Optional | The name of the SignalR runtime. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure SignalR](/azure/azure-signalr)
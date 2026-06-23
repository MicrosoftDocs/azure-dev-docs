---
title: Azure skill for Azure Messaging
description: The azure-messaging skill helps you troubleshoot SDK problems for Azure Event Hubs and Azure Service Bus. Use it when your app reports AMQP errors, connection failures, lock expirations, timeouts, or dead-lettered messages. It's focused on SDK-level fixes.
ms.topic: reference
ms.date: 06/22/2026
author: diberry
ms.author: diberry
ms.reviewer: kashifkhan
ms.service: azure-mcp-server
ms.custom: devx-track-copilot-skills
ms.skillversion: 1.0.4
ai-usage: ai-generated
---

# Azure skill for Azure Messaging

The `azure-messaging` skill helps you troubleshoot Azure Event Hubs and Azure Service Bus SDK problems across Python, Java, JavaScript, and .NET. Use it when your application reports AMQP protocol errors, connection failures, lock expirations, timeouts, dead-lettered messages, or SDK configuration issues.

**Skill** `azure-messaging` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-messaging/SKILL.md)

## What it provides

You get language-specific troubleshooting guidance for Azure Event Hubs and Azure Service Bus SDKs covering Python, Java, JavaScript, and .NET. This includes AMQP-level connection and authentication fixes, message lock expiration handling, dead-letter queue diagnostics, and SDK configuration corrections.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

### Related tools

| Tool | Command | Purpose |
|------|---------|---------|
| `mcp_azure_mcp_eventhubs` | `Namespace/hub ops` | List namespaces, hubs, consumer groups |
| `mcp_azure_mcp_servicebus` | `Queue/topic ops` | List namespaces, queues, topics, subscriptions |
| `mcp_azure_mcp_monitor` | `logs_query` | Query diagnostic logs with KQL |
| `mcp_azure_mcp_resourcehealth` | ``get`` | Check service health status |
| `mcp_azure_mcp_documentation` | `Doc search` | Search Microsoft Learn for troubleshooting docs |

## When to use this skill

Use this skill when you need to:

- Troubleshoot Event Hubs SDK errors, Service Bus SDK issues, and messaging connection failures (including AMQP protocol errors).
- Resolve event processor host issues, message lock expiration, and lock renewal failures.
- Work with lock renewal batch, send timeout, receiver disconnected, and SDK troubleshooting
- Debug Azure Messaging SDK problems affecting Event Hubs consumers, Service Bus queues, and topic subscriptions.
- Enable and configure logging for Event Hubs.
- Set up logging for Service Bus and configure SDK logging in Python, Java, and JavaScript.
- Configure .NET Service Bus clients and manage Event Hubs checkpoints.
- Event hub not receiving messages
- Handle dead-letter messages, resolve batch processing locks, and troubleshoot session timeouts.
- Address inactive connections, link detachment, slow reconnection, and session errors.

## Example prompts

Try these prompts to activate this skill:

- "I'm getting an Event Hub SDK error"
- "Service Bus SDK issue with my connection"
- "AMQP error in my messaging app"
- "Message lock lost in Service Bus"
- "Message lock expired"
- "Event processor host issue"
- "Send timeout in Event Hubs"
- "Receiver disconnected"
- "Service Bus dead letter queue issue"
- "Event Hub not receiving messages"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-messaging/SKILL.md)
- [Azure Service Bus documentation](/azure/service-bus-messaging/)
- [Azure Event Hubs documentation](/azure/event-hubs/)
- [Azure Messaging SDKs](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/servicebus)
- [AMQP troubleshooting guide](/azure/service-bus-messaging/service-bus-amqp-troubleshoot)

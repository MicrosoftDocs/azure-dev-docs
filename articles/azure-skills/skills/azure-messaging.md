---
title: Azure skill for messaging
description: Troubleshoot and resolve issues with Azure Messaging SDKs for Event Hubs and Service Bus. Covers connection failures, authentication errors, message processing issues, and SDK configuration problems.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.4
---

# Azure skill for messaging

Troubleshoot and resolve issues with Azure Messaging SDKs for Event Hubs and Service Bus. Covers connection failures, authentication errors, message processing issues, and SDK configuration problems.

**Skill:** `azure-messaging` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-messaging/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Troubleshoot and resolve issues with Azure Messaging SDKs for Event Hubs and Service Bus. Covers connection failures, authentication errors, message processing issues, and SDK configuration problems.

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

- "event hub SDK error in my Python app"
- "my event hub consumer isn't receiving messages"
- "event hub checkpoint store failing"
- "`eventhub` python connection timeout"
- "`eventhub` javascript client disconnects"
- "service bus SDK issue with message lock lost"
- "service bus queue issue with dead letter"
- "`servicebus` java send timeout"
- "`servicebus` dotnet receiver disconnected"
- "service bus message lock expired during batch processing"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-messaging/SKILL.md)


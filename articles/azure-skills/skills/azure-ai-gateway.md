---
title: Azure skill for Azure AI Gateway
description: The azure-aigateway skill helps you configure Azure API Management as a centralized AI gateway for AI models, MCP tools, and agents. Use it to set up routing, load balancing, authentication, and rate limiting for AI traffic across multiple backends.
ms.topic: reference
ms.date: 06/22/2026
author: diberry
ms.author: diberry
ms.reviewer: azaslonov
ms.service: azure-mcp-server
ms.custom: devx-track-copilot-skills
ms.skillversion: 3.0.1
ai-usage: ai-generated
---

# Azure skill for Azure AI Gateway

The `azure-aigateway` skill helps you configure Azure API Management as a centralized AI gateway for AI models, MCP tools, and agents. Use it to set up routing, load balancing, authentication, and rate limiting for AI traffic across multiple backends.

**Skill** `azure-aigateway` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-aigateway/SKILL.md)

## What it provides

You get guidance to configure Azure API Management as a centralized AI gateway that handles routing, load balancing, authentication, and rate limiting for AI traffic across multiple backends — including Azure OpenAI endpoints, custom model deployments, and MCP tool servers.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Work with semantic caching, token limit, content safety, and load balancing
- Work with AI model governance, MCP rate limiting, and jailbreak detection
- Add Azure OpenAI back end
- Add AI Foundry model
- Test AI gateway in Azure
- Work with LLM policies
- Configure AI back end in Azure
- Work with token metrics, AI cost control, convert API to MCP, and import OpenAPI to gateway

## Example prompts

Try these prompts to activate this skill:

- "Set up semantic caching for my AI gateway"
- "Configure token limits for Azure OpenAI"
- "Add content safety policies to my gateway"
- "Set up load balancing across AI backends"
- "Configure jailbreak detection"
- "Add an Azure OpenAI backend to my gateway"
- "Import OpenAPI spec to my AI gateway"
- "Configure rate limiting for MCP tools"
- "Set up AI cost control policies"
- "Convert my API to MCP"

## Related content

- [Azure API Management overview](/azure/api-management/api-management-key-concepts)
- [AI Gateway landing zone](/azure/api-management/ai-gateway-landing-zone-accelerator)
- [Load balancing Azure OpenAI endpoints](/azure/api-management/azure-openai-enable-semantic-caching)
- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-aigateway/SKILL.md)

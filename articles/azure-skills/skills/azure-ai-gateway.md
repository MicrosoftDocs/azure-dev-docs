---
title: Azure skill for AI Gateway
description: Configure Azure API Management as an AI Gateway for AI models, MCP tools, and agents.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-3.0.1
---

# Azure skill for AI Gateway

Configure Azure API Management as an AI Gateway for AI models, Model Context Protocol (MCP) tools, and agents.

**Skill:** `azure-aigateway` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-aigateway/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Configure Azure API Management as an AI Gateway for AI models, MCP tools, and agents.

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

- "Set up an AI Gateway for my Azure OpenAI models"
- "Configure Azure API Management as a gateway for my AI models"
- "Add a gateway to my MCP server"
- "Set up APIM for my AI workloads"
- "Add rate limiting to my model requests"
- "Limit tokens for my AI API"
- "How do I ratelimit my MCP server?"
- "Enable semantic caching for my AI API"
- "Set up semantic cache for Azure OpenAI in APIM"
- "Add content safety to my AI endpoint"

## Related content

- [Azure MCP Server overview](/azure/developer/azure-mcp-server/overview)


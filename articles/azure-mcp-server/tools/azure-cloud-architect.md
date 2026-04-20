---
title: Azure MCP Server tools for Azure Cloud Architect
description: Use Azure MCP Server tools to design cloud architectures through guided requirements gathering and receive optimal Azure solution recommendations from your IDE.
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 03/27/2026
reviewer: msalaman
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
tool_count: 1
mcp-cli.version: 2.0.0-beta.39
---

# Azure MCP Server tools for Azure Cloud Architect

The Azure Model Context Protocol (MCP) Server lets you design cloud architectures through guided requirements gathering and receive optimal Azure solution recommendations with natural language prompts.

Azure Cloud Architect helps you design scalable, resilient Azure solutions and apply guidance from the Azure Architecture Center; for more information, see [Azure Architecture Center documentation](/azure/architecture/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Design cloud architecture

<!-- @mcpcli cloudarchitect design -->

This tool recommends architecture designs for cloud services, applications, and solutions — including file storage, banking, video streaming, e-commerce, SaaS, and more. It gathers requirements iteratively by asking 1–2 focused questions at a time, tracks a confidence score (0.0–1.0), and returns architecture guidance aligned with the Azure Well-Architected Framework. When the confidence score reaches 0.7 or higher, the tool stops asking follow-up questions and presents the architecture recommendation.

The tool covers all tiers: infrastructure, platform, application, data, security, and operations. Recommendations are conservative, actionable, and provide a high-level overview.

Example prompts include:

- "Please help me design an architecture for a scalable file upload, storage, and retrieval service."
- "Help me design an Azure-based ATM service architecture for user transactions and account management."
- "I want to design a cloud app for ordering groceries with inventory and delivery tracking."
- "How can I design an Azure cloud service to store, transcode, and serve videos to users?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Answer** |  Optional | The user's response to the current question. |
| **Confidence score** |  Optional | A value between 0.0 and 1.0 representing confidence in understanding requirements. When this reaches 0.7 or higher, `nextQuestionNeeded` should be set to false. |
| **Next question needed** |  Optional | Whether another question is needed. |
| **Question** |  Optional | The current question being asked. |
| **Question number** |  Optional | Current question number. |
| **State** |  Optional | The complete architecture state from the previous request as JSON. Tracks architecture components, tiers (infrastructure, platform, application, data, security, operations), requirements (explicit, implicit, assumed), and confidence factors. |
| **Total questions** |  Optional | Estimated total questions needed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Architecture Center documentation](/azure/architecture/)
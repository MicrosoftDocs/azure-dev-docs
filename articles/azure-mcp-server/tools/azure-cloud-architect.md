---
title: Azure Cloud Architect - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure Cloud Architect to design cloud system by gathering requirements through guided questions and recommending optimal solutions.
keywords: azure mcp server, azmcp, azure cloud architect, cloud, architecture
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/27/2025
---

# Azure Cloud Architect design tools for the Azure MCP Server

The Azure MCP Server lets you manage Azure resources, including Azure Cloud Architect services, by using natural language prompts. This feature helps you quickly gather requirements and get architecture recommendations without having to remember complex syntax.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Design

<!-- cloudarchitect design -->

This operation gathers requirements through guided questions and recommends optimal solutions.

Example prompts include:

- **Design large-scale file storage**: "Please help me design an architecture for a large-scale file upload, storage, and retrieval service."
- **Design ATM cloud service**: "Help me create a cloud service that will serve as an ATM for users."
- **Design grocery ordering app**: "I want to design a cloud app for ordering groceries."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Question** |  Optional | The current question being asked |
| **Question number** |  Optional | Current question number |
| **Total questions** |  Optional | Estimated total questions needed |
| **Answer** |  Optional | The user's response to the question |
| **Next question needed** |  Optional | Whether another question is needed |
| **Confidence score** |  Optional | A value between 0.0 and 1.0 representing confidence in understanding requirements. When this reaches 0.7 or higher, set `nextQuestionNeeded` to false. |
| **State** |  Optional | The complete architecture state from the previous request. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [cloudarchitect design](../includes/tools/annotations/azure-cloud-architect-design-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
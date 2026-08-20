---
title: Azure Quick Review CLI Tools - Azure MCP Server
description: Generate compliance and security reports for Azure resources by using the Azure MCP Server with the Azure Quick Review CLI (azqr) tools.
author: diberry
ms.author: diberry
ms.reviewer: wabrez
ms.date: 08/11/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
---
# Azure Quick Review CLI tools for the Azure MCP Server overview

By using the Azure MCP Server, you can run Azure Quick Review (azqr) commands by using natural language prompts. You can generate compliance and security reports for your Azure resources to identify non-compliant configurations and areas for improvement, without needing to remember specific command syntax.

[Azure Quick Review CLI (azqr)](https://github.com/Azure/azqr) is a command-line interface (CLI) tool that analyzes Azure resources for alignment with Azure best practices and recommendations. It gives you a comprehensive overview of your Azure resources so you can identify non-compliant configurations or areas for improvement.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Generate compliance report

<!-- extension azqr -->

The Azure MCP Server can run Azure Quick Review CLI commands to generate compliance and security reports for Azure resources. These reports help you identify non-compliant configurations and areas for improvement in your Azure environment.

**Example prompts** include:

- **Scan subscription**: "Generate compliance report for my subscription."
- **Scan resource group**: "Run security assessment for production resource group."
- **Quick review**: "Check my subscription for compliance issues."
- **Security scan**: "Scan resources in dev-rg for security problems."
- **Generate report**: "Create compliance report for subscription abc123 and resource group web-apps."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Optional | The name of the Azure resource group. This is a logical container for Azure resources. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Quick Review CLI GitHub repository](https://github.com/Azure/azqr)

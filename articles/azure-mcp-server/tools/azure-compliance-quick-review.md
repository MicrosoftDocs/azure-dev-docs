---
title: Azure Quick Review CLI Tools - Azure MCP Server
description: Use Azure MCP Server tools with natural language prompts or Azure MCP CLI commands to generate Azure Quick Review compliance and security reports.
author: diberry
ms.author: diberry
ms.reviewer: wabrez
ms.date: 08/24/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
tool_count: 1
mcp-cli.version: "3.0.0-beta.37"
---
# Azure Quick Review CLI tools for the Azure MCP Server overview

By using the Azure MCP Server, you can run Azure Quick Review (azqr) commands by using natural language prompts. You can generate compliance and security reports for your Azure resources to identify noncompliant configurations and areas for improvement, without needing to remember specific command syntax.

[Azure Quick Review CLI (azqr)](https://github.com/Azure/azqr) is a command-line interface (CLI) tool that analyzes Azure resources for alignment with Azure best practices and recommendations. It gives you a comprehensive overview of your Azure resources so you can identify noncompliant configurations or areas for improvement.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Generate compliance report

The Azure MCP Server runs Azure Quick Review CLI commands to scan an Azure subscription or resource group for compliance issues. It generates a compliance and security assessment report. The report identifies noncompliant configurations and recommends improvements. The tool returns the generated report file paths in XLSX and JSON formats.

> [!NOTE]
> Azure Quick Review (azqr) is different from Azure CLI (`az`), Azure Policy assignments, and Azure Advisor recommendations.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp extension azqr \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-group` | string | No | The Azure resource group name. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli extension azqr -->

**Example prompts** include:

- **Scan subscription**: "Generate compliance report for my subscription."
- **Scan resource group**: "Run security assessment for production resource group."
- **Quick review**: "Check my subscription for compliance issues."
- **Security scan**: "Scan resources in dev-rg for security problems."
- **Generate report**: "Create compliance report for subscription abc123 and resource group web-apps."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Optional | The Azure resource group name. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started by using Azure MCP Server](../get-started.md)
- [Azure Quick Review CLI GitHub repository](https://github.com/Azure/azqr)

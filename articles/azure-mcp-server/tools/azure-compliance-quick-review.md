---
title: Azure Quick Review CLI Tools
description: Learn how to use the Azure MCP Server with the Azure Quick Review CLI Tools.
keywords: azure mcp server, azmcp, azure quick review, azqr, compliance
author: diberry
ms.author: diberry
ms.date: 10/27/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Quick Review CLI tools for the Azure MCP Server

The Azure MCP Server allows you to execute Azure Quick Review (azqr) commands using natural language prompts. This enables you to generate compliance and security reports for your Azure resources to identify non-compliant configurations and areas for improvement without needing to remember specific command syntax.

[Azure Quick Review CLI (azqr)](https://github.com/Azure/azqr) is a powerful command-line interface (CLI) tool that specializes in analyzing Azure resources to ensure compliance with Azure's best practices and recommendations. Its main objective is to offer users a comprehensive overview of their Azure resources, allowing them to easily identify any non-compliant configurations or areas for improvement.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Generate compliance report

The Azure MCP Server can execute Azure Quick Review CLI commands to generate compliance and security reports for Azure resources. This helps identify non-compliant configurations and areas for improvement in your Azure environment.

**Example prompts** include:

- **Scan subscription**: "Generate compliance report for my subscription"
- **Scan resource group**: "Run security assessment for production resource group"
- **Quick review**: "Check my subscription for compliance issues"
- **Security scan**: "scan resources in dev-rg for security problems"
- **Generate report**: "Create compliance report for subscription abc123 and resource group web-apps"

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Quick Review CLI GitHub repository](https://github.com/Azure/azqr)

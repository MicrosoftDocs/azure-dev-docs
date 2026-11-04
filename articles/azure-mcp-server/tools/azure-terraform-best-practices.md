---
title: Terraform Best Practices for Azure - Azure MCP Server
description: Use the Azure Terraform best practices tool in Azure MCP Server to get guidance on implementing Terraform for Azure resources.
author: sandeep-sen
ms.author: sandeepsen
ms.date: 02/27/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
tool_count: 1
mcp-cli.version: "3.0.0-beta.47+bd724faf47e86348c7163a429b584aabfd714876"
---

# Azure MCP Server tools for Terraform best practices

This article describes the Terraform best practices for Azure tool available in Azure MCP Server. The tool provides guidance for implementing Infrastructure as Code (IaC) with Terraform in Azure environments.

Terraform best practices for Azure help you implement secure, scalable, and maintainable infrastructure configurations by using recommended patterns and practices from Microsoft.

## Get best practices

Returns best practices for implementing Terraform with Azure. Use this tool to get guidance on creating secure, scalable, and maintainable infrastructure as code for Azure resources.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azureterraformbestpractices get
```

This tool has no CLI parameters.

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azureterraformbestpractices get -->

Example prompts include:

- **General best practices**: "What are the best practices for using Terraform with Azure?"
- **Implementation guidance**: "Show me guidance for implementing Azure resources with Terraform"
- **Module structure**: "How should I structure my Terraform modules for Azure?"
- **State management**: "What are the recommended patterns for managing state files in Azure Terraform projects?"
- **Secure infrastructure**: "I need help implementing secure Azure infrastructure using Terraform"

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related resources

- [Terraform on Azure documentation](/azure/developer/terraform/)
- [Azure Architecture Center - Best practices in cloud applications](/azure/architecture/best-practices/)

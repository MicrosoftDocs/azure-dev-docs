---
title: Azure pricing tools overview for the MCP Server
description: Discover Azure pricing tools for MCP Server to manage cost estimates and billing. Start optimizing your Azure costs today.
#customer intent: As a system administrator, I want to analyze pricing for Azure services like Virtual Machines and Storage so that I can recommend the best configurations for my organization.
ms.date: 02/18/2026
ms.reviewer: anannyapatra
keywords: Azure, MCP Server, pricing, tools, cost estimates, billing
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 1
---

# Azure pricing tools for the Azure MCP Server

Azure [pricing tools](/azure/cost-management-billing/) in MCP Server help you manage cost estimates, billing questions, and budget tracking using natural language prompts. This article explains how these tools let organizations learn about Azure spending and manage costs effectively.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get pricing information

<!-- @mcpcli pricing get -->

Get Azure retail pricing information. The tool can estimate deployment costs from an ARM or Bicep template. You can provide the template within the prompt or as a file input.

Example prompts include:

- "This is my Bicep template: <bicep_template>. Estimate my deployment costs."
- "What is the pricing for SKU `Standard_D4s_v5` in region `eastus`?"
- "Can I get the pricing details for service `Virtual Machines` and SKU `Standard_E64-16ds_v4`?"
- "Show me the `Consumption` pricing for SKU `Standard_D4s_v5` in `westeurope` and include savings plan."
- "List pricing information for all SKUs in the `Storage` service in region `westus2`."

| Parameter                  | Required or optional | Description                                                                                                                                        |
|---------------------------|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Currency**              | Optional             | Currency code for pricing (for example, `USD`, `EUR`). The default is `USD`.                                                                      |
| **SKU**                   | Optional*             | ARM SKU name (for example, `Standard_D4s_v5`, `Standard_E64-16ds_v4`).                                                                            |
| **Service**               | Optional*             | Azure service name (for example, `Virtual Machines`, `Storage`, `SQL Database`).                                                                   |
| **Region**                | Optional*             | Azure region (for example, `eastus`, `westeurope`, `westus2`).                                                                                    |
| **Service family**        | Optional*             | Service family (for example, `Compute`, `Storage`, `Databases`, `Networking`).                                                                    |
| **Price type**            | Optional*             | Price type filter (for options: `Consumption`, `Reservation`, `DevTestConsumption`).                                                              |
| **Include savings plan**  | Optional             | Include savings plan pricing information (uses preview API version).                                                                               |
| **Filter**                | Optional*             | Raw OData filter expression for advanced queries (for example,`meterId eq 'abc-123'`). For more about OData, see [OData documentation](https://www.odata.org/documentation/).                                               |

* At least one filter option is required.

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Pricing Calculator documentation](/azure/cost-management-billing/costs/pricing-calculator/)
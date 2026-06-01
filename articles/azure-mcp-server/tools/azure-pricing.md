---
title: Azure pricing tools overview for the MCP Server
description: Discover Azure pricing tools for MCP Server to manage cost estimates and billing. Start optimizing your Azure costs today.
#customer intent: As a system administrator, I want to analyze pricing for Azure services like Virtual Machines and Storage so that I can recommend the best configurations for my organization.
ms.date: 05/28/2026
ms.reviewer: anannyapatra
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 1
---

# Azure pricing tools for the Azure MCP Server

Azure [pricing tools](/azure/cost-management-billing/) in MCP Server help you manage cost estimates, billing questions, and budget tracking using natural language prompts. This article explains how these tools let organizations learn about Azure spending and manage costs effectively.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get pricing information

<!-- @mcpcli pricing get -->

Get Azure retail pricing information. Only call this tool after the user specifies a SKU (`--sku`) or confirms they want all pricing for a service. Don't call this tool if the user provides only a broad service name (for example, `Virtual Machines`, `Storage`, `SQL Database`) without a specific SKU — ask for the exact SKU or tier first. For comparisons across regions or SKUs, require explicit ARM SKU names and don't assume defaults. Requires at least one filter: `--sku`, `--service`, `--region`, `--service-family`, or `--filter`. `SavingsPlan` isn't a valid `--price-type` value; use `--include-savings-plan` instead. Valid `--price-type` values are `Consumption`, `Reservation`, and `DevTestConsumption`. When `--include-savings-plan` is `true`, `Consumption` results include a nested `savingsPlan` array with 1-year and 3-year pricing, mainly for Linux VMs. For Bicep/ARM cost estimation, extract the resource type and SKU, query per resource, and sum monthly costs (hourly × 730).

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
---
title: Marketplace Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure Marketplace to discover and manage marketplace products and offers.
keywords: azure mcp server, azmcp, marketplace, products, offers, solutions
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 08/05/2025
author: diberry
ms.author: diberry
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
---

# Marketplace tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Azure Marketplace products using natural language prompts. This enables you to quickly discover and retrieve information about marketplace offerings without remembering complex syntax.

[Azure Marketplace](/azure/marketplace/) is an online store for solutions that are built on or built for Azure and intended for IT professionals and developers. It offers a catalog of applications, services, and solutions from Microsoft and partners that help customers accelerate their cloud adoption and digital transformation.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get marketplace product information

<!--
azmcp marketplace productget --product-id --include-stop-sold-plans --language --market --lookup-offer-in-tenant-level --plan-id --sku-id --include-service-instruction-templates --partner-tenant-id --pricing-audience
-->

Retrieve detailed information about a specific product or offer from Azure Marketplace. This operation helps you get comprehensive details about marketplace solutions, including pricing, plans, and availability information for evaluation and procurement decisions.

Example prompts include:

- **Get product details**: "Show me information about product ID 'microsoft-ads.windows-data-science-vm'"
- **Check specific plan**: "Get marketplace product details for plan ID 'standard-data-science-vm'"
- **View pricing information**: "Retrieve marketplace product info with pricing audience set to 'public'"
- **Get localized information**: "Show marketplace product in French language for France market"
- **Include service templates**: "Get product details including service instruction templates"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Product ID** | Required | The unique identifier for the marketplace product you want to retrieve information about. |
| **Include stop sold plans** | Optional | Whether to include plans that are no longer available for purchase in the results. |
| **Language** | Optional | The language code for localized product information (e.g., 'en-us', 'fr-fr'). |
| **Market** | Optional | The market or region code to get region-specific pricing and availability (e.g., 'US', 'FR'). |
| **Lookup offer in tenant level** | Optional | Whether to look up the offer at the tenant level for organization-specific information. |
| **Plan ID** | Optional | The specific plan identifier within the product to get detailed plan information. |
| **SKU ID** | Optional | The Stock Keeping Unit identifier for a specific product variant or configuration. |
| **Include service instruction templates** | Optional | Whether to include service instruction templates in the response for deployment guidance. |
| **Partner tenant ID** | Optional | The tenant ID of the partner for partner-specific product information. |
| **Pricing audience** | Optional | The target audience for pricing information (e.g., 'public', 'private', 'government'). |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Marketplace documentation](/azure/marketplace/)
- [Find solutions in Azure Marketplace](/marketplace/find-solutions-azure-marketplace)
- [Azure Marketplace purchasing overview](/marketplace/purchasing-overview)

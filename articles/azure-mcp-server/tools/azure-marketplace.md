---
title: Marketplace Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure Marketplace to discover and manage marketplace products and offers.
keywords: azure mcp server, azmcp, marketplace, products, offers, solutions
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/27/2025
author: diberry
ms.author: diberry
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
---

# Marketplace tools for the Azure MCP Server

The Azure MCP Server lets you manage Azure resources, including Azure Marketplace products, by using natural language prompts. With this capability, you can quickly discover and retrieve information about marketplace offerings without needing to remember complex syntax.

[Azure Marketplace](/azure/marketplace/) is an online store for solutions that are built on or built for Azure. It's designed for IT professionals and developers. The marketplace offers a catalog of applications, services, and solutions from Microsoft and partners that help you accelerate your cloud adoption and digital transformation.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get Marketplace product information

<!-- marketplace product get -->

Get detailed information about a specific product or offer from Azure Marketplace. This operation helps you get comprehensive details about marketplace solutions, including pricing, plans, and availability information for evaluation and procurement decisions.

Example prompts include:

- **Get product details**: "Show me information about product ID `microsoft-ads.windows-data-science-vm`"
- **Check specific plan**: "Get marketplace product details for product ID `standard-data-science-vm`"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Product ID** | Required | The unique identifier for the marketplace product you want to retrieve information about. |
| **Include stop sold plans** | Optional | Whether to include plans that are no longer available for purchase in the results. |
| **Language** | Optional | The language code for localized product information (for example, `en-us`, `fr-fr`). |
| **Market** | Optional | The market or region code to get region-specific pricing and availability (for example, `US`, `FR`). |
| **Lookup offer in tenant level** | Optional | Whether to look up the offer at the tenant level for organization-specific information. |
| **Plan ID** | Optional | The specific plan identifier within the product to get detailed plan information. |
| **SKU ID** | Optional | The specific pricing SKU identifier for a specific product variant or configuration. |
| **Include service instruction templates** | Optional | Whether to include service instruction templates in the response for deployment guidance. |
| **Pricing audience** | Optional | The target audience for pricing information (for example, `public`, `private`, `government`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [marketplace product get](../includes/tools/annotations/azure-marketplace-product-get-annotations.md)]

## List Marketplace information

<!-- marketplace product list -->

Gets and lists all marketplace products (offers) available to a subscription in the Azure Marketplace. Use this tool to search, select, browse, or filter marketplace offers by product name, publisher, pricing, or metadata. Returns information for each product, including display name, publisher details, category, pricing data, and available plans.

Example prompts include:

- **List all products**: "List all marketplace products available in my subscription"
- **Search products**: "Find marketplace products related to `database`"
- **Filter by category**: "Show marketplace products in the `Analytics` category"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Language** |  Optional | Product language code (for example, `en` for English, `fr` for French). |
| **Search** |  Optional | Search for products using a short general term (up to 25 characters). |
| **Filter** |  Optional | OData filter expression to filter results based on ProductSummary properties (for example, `displayName eq 'Azure'`). |
| **Orderby** |  Optional | OData orderby expression to sort results by ProductSummary fields (for example, `displayName asc` or `popularity desc`). |
| **Select** |  Optional | OData select expression to choose specific ProductSummary fields to return (for example, `displayName,publisherDisplayName,uniqueProductId`). |
| **Next cursor** |  Optional | Pagination cursor to retrieve the next page of results. Use the NextPageLink value from a previous response. |
| **Expand** |  Optional | OData expand expression to include related data in the response (for example, `plans` to include plan details). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [marketplace product list](../includes/tools/annotations/azure-marketplace-product-list-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Marketplace documentation](/azure/marketplace/)
- [Find solutions in Azure Marketplace](/marketplace/find-solutions-azure-marketplace)
- [Azure Marketplace purchasing overview](/marketplace/purchasing-overview)

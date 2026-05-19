---
title: Azure MCP Server tools for Azure Cosmos DB
description: Use Azure MCP Server tools to manage Azure Cosmos DB resources with natural language prompts from your IDE.
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 03/24/2026
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
tool_count: 2
mcp-cli.version: 2.0.0-beta.31
---

# Azure MCP Server tools for Azure Cosmos DB

The Azure Model Context Protocol (MCP) Server lets you manage Azure Cosmos DB resources with natural language prompts. You can list accounts, databases, and containers, run SQL queries against containers, and inspect resource metadata.

Azure Cosmos DB is a globally distributed, multi-model database service. For more information, see [Azure Cosmos DB documentation](/azure/cosmos-db/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List accounts, databases, or containers

<!-- @mcpcli cosmos list -->

List Azure Cosmos DB accounts, databases, or containers. By default, this tool returns all accounts in your subscription. Specify the `Account` to list databases in that account, or specify both the `Account` and the `Database` to list containers in that database. Results are returned at the level you specify: account, database, or container.

Example prompts include:

- "List all Azure Cosmos DB accounts in my subscription."
- "Show me the databases in the Azure Cosmos DB account 'prod-cosmos'."
- "List all the containers in the database 'orders-db' for the Azure Cosmos DB account 'my-cosmosdb'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account** |  Optional | The name of the Azure Cosmos DB account. When not specified, lists all accounts in the subscription. Specify this parameter to list databases, or combine with `Database` to list containers. |
| **Database** |  Optional | The name of the database. Requires `Account` to be specified. When provided, lists containers within this database. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Query container items

<!-- @mcpcli cosmos database container item query -->

Query items from an Azure Cosmos DB container. Provide the account name, database name, and container name, and optionally supply a SQL query to filter results. The query uses Azure Cosmos DB SQL API syntax and the tool returns matching items as JSON documents.

Example prompts include:

- "List all items from container 'orders' in database 'ecommerce-db' for Azure Cosmos DB account 'contoso-cosmos'."
- "Query items from container 'orders' in database 'ecommerce-db' for account 'contoso-cosmos' using the SQL query 'SELECT * FROM c WHERE c.status = shipped'."
- "Show items containing 'outage' in container 'orders' in database 'sales' for Azure Cosmos DB account 'my-cosmos-account'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account** |  Required | The name of the Azure Cosmos DB account to query (for example, `contoso-cosmos`). |
| **Container** |  Required | The name of the container to query (for example, `orders`). |
| **Database** |  Required | The name of the database to query (for example, `ecommerce-db`). |
| **Query** |  Optional | SQL query to execute against the container. Uses Azure Cosmos DB SQL API syntax. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Cosmos DB documentation](/azure/cosmos-db/)
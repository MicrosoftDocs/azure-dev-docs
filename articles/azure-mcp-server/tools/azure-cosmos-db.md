---
title: Azure MCP Server Tools for Azure Cosmos DB
description: Use Azure MCP Server tools to manage Azure Cosmos DB resources with natural language prompts from your IDE.
ms.date: 06/01/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ai-usage: ai-assisted
tool_count: 7
mcp-cli.version: "3.0.0-beta.14+437cd2233b355c42c7f40d4b73354075117bd456"
---

# Azure MCP Server tools for Azure Cosmos DB

The Azure MCP Server lets you manage Azure Cosmos DB resources with natural language prompts. You can list accounts, databases, and containers, query and retrieve items, search by text or vector similarity, infer container schemas, and run SQL queries — all without writing complex code.

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

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

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

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Get container item

<!-- @mcpcli cosmos database container item get -->

Retrieve a single document from a Cosmos DB container by its ID. When you supply a partition key, the query targets a single partition, which is cheaper than a cross-partition fan-out. Without a partition key, the tool performs a cross-partition query.

Example prompts include:

- "Get document with ID `order-001` from container `orders` in database `ecommerce-db` for Cosmos DB account `contoso-cosmos`."

- "Retrieve item `user-42` from container `users` in database `app-db` for account `my-cosmos` using partition key `US`."

- "Fetch document `product-789` from container `catalog` in database `store-db` for account `retail-cosmos`."

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Account** | Required | The name of the Azure Cosmos DB account. |
| **Container** | Required | The name of the container. |
| **Database** | Required | The name of the database. |
| **ID** | Required | The ID of the document to retrieve. |
| **Partition key** | Optional | The partition key value. Scopes the query to a single partition for better performance. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## List recently modified container items

<!-- @mcpcli cosmos database container item list-recent -->

Retrieve the most recently modified documents from a Cosmos DB container, ordered by the system timestamp (`_ts`) in descending order. Use the `Count` parameter to control how many documents are returned.

Example prompts include:

- "Show the 10 most recently modified items in container `orders` in database `ecommerce-db` for account `contoso-cosmos`."

- "Get the latest 5 documents from container `events` in database `telemetry-db` for account `my-cosmos`."

- "List the most recently changed items in container `products` in database `catalog-db` for account `retail-cosmos`."

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Account** | Required | The name of the Azure Cosmos DB account. |
| **Container** | Required | The name of the container. |
| **Database** | Required | The name of the database. |
| **Count** | Optional | The number of documents to return. Accepted range: 1–20. Default is 10. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Search container items by text

<!-- @mcpcli cosmos database container item text-search -->

Retrieve the top N documents in a Cosmos DB container where a specified property matches a search phrase, using the Cosmos DB `FullTextContains` function. Matching is word-tokenized (not substring) and uses the container's configured full-text analyzer, so language-specific stemming and stop-word filtering apply. This tool requires a full-text index on the target property.

Example prompts include:

- "Search container `support-tickets` in database `helpdesk-db` for account `contoso-cosmos` for documents where `description` contains `network outage`."

- "Find the top 5 documents in container `articles` in database `content-db` for account `my-cosmos` where `body` contains `AI governance`."

- "Full-text search container `feedback` in database `app-db` for account `prod-cosmos` for `search-phrase` in the `comments` field."

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Account** | Required | The name of the Azure Cosmos DB account. |
| **Container** | Required | The name of the container. |
| **Database** | Required | The name of the database. |
| **Search phrase** | Required | The phrase to search for using the Cosmos DB `FullTextContains` function. |
| **Search property** | Required | The container property to search. Must have a full-text index configured. |
| **Count** | Optional | The number of documents to return. Accepted range: 1–20. Default is 10. |
| **Properties to select** | Optional | Comma-separated list of fields to return instead of the full document. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Search container items by vector similarity

<!-- @mcpcli cosmos database container item vector-search -->

Retrieve the top N documents in a Cosmos DB container most similar to a given search text, using the Cosmos DB `VectorDistance` function. The tool converts your search text into a query vector by calling an Azure OpenAI embedding deployment, then returns the closest matching documents ranked by similarity score (`_score`). This tool requires a vector index on the target property.

When you omit `Properties to select`, the full document is returned with the vector property stripped, because a typical 1,536-dimension embedding adds roughly 30 KB or 10,000 tokens per result.

Example prompts include:

- "Find the 5 most similar documents to 'cloud cost optimization strategies' in container `docs` in database `knowledge-db` for account `contoso-cosmos`, using vector property `embedding` and OpenAI endpoint `https://my-openai.openai.azure.com/`."

- "Vector search container `products` in database `catalog-db` for account `retail-cosmos` for items similar to 'lightweight running shoes', using embedding deployment `text-embedding-ada-002`."

- "Search container `articles` in database `content-db` for account `my-cosmos` for content similar to 'quantum computing breakthroughs', return only `title` and `summary` fields."

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Account** | Required | The name of the Azure Cosmos DB account. |
| **Container** | Required | The name of the container. |
| **Database** | Required | The name of the database. |
| **Embedding deployment** | Required | The Azure OpenAI embedding deployment name used to generate the query vector. |
| **OpenAI endpoint** | Required | The Azure OpenAI endpoint URL (for example, `https://my-openai.openai.azure.com/`). |
| **Search text** | Required | The text to convert to a query vector using Azure OpenAI embeddings. |
| **Vector property** | Required | The container property that holds the vector embeddings. Must have a Cosmos DB vector index. |
| **Count** | Optional | The number of documents to return. Accepted range: 1–20. Default is 10. |
| **Embedding dimensions** | Optional | The requested embedding vector length, for models that support custom dimensions (for example, `text-embedding-3-small` or `text-embedding-3-large`). |
| **Properties to select** | Optional | Comma-separated list of fields to return. When omitted, the full document is returned with the vector property stripped. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Infer container schema

<!-- @mcpcli cosmos database container schema infer -->

Infer an approximate schema for a Cosmos DB container by sampling documents and reporting top-level properties along with their inferred types and how many sampled documents contained each property. Nested objects and arrays are reported as `object` or `array` without recursion. To discover nested structure — for example, the dot-path to a vector property — fetch an individual document with the `Get container item` tool and inspect it directly.

Example prompts include:

- "Infer the schema for container `orders` in database `ecommerce-db` for Cosmos DB account `contoso-cosmos`."

- "What are the top-level properties in container `users` in database `app-db` for account `my-cosmos`? Sample 50 documents."

- "Show me the schema of container `telemetry` in database `metrics-db` for account `prod-cosmos`."

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Account** | Required | The name of the Azure Cosmos DB account. |
| **Container** | Required | The name of the container. |
| **Database** | Required | The name of the database. |
| **Sample size** | Optional | The number of documents to sample for schema inference. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Cosmos DB documentation](/azure/cosmos-db/)

---
title: Azure MCP Server tools for Azure Cosmos DB
description: Use Azure MCP Server tools to manage globally distributed, multi-model NoSQL databases with natural language prompts from your IDE.
ms.date: 06/01/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 7
mcp-cli.version: 3.0.0-beta.14+437cd2233b355c42c7f40d4b73354075117bd456
author: diberry
ms.author: diberry
ms.reviewer: mbaldwin
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Cosmos DB

The Azure MCP Server lets you manage Azure Cosmos DB resources, including: get, infer, list, list-recent, query, text-search, and vector-search, with natural language prompts.

Azure Cosmos DB is an Azure service that provides cloud-based capabilities for your applications. For more information, see [Azure Cosmos DB documentation](/azure/cosmos-db/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Database container item: Get

Gets a single Azure Cosmos DB document by ID from the specified database and container. When a partition key is supplied, the tool scopes the query to a single partition, which costs less than a cross-partition query. If no partition key is supplied, the tool runs a cross-partition query.

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli cosmos database container item get -->

Example prompts include:

- "Get the document with ID 'order123' from container 'orders' in database 'sales-db' of account 'my-cosmos-account'."
- "Retrieve document ID 'cust-456' from container 'customers' in database 'crm-db' from account 'prod-cosmos' using partition key 'country-US'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Cosmos DB account to query (for example, `my-cosmos-account`). |
| **Container name** |  Required | The name of the container to query (for example, `my-container`). |
| **Database name** |  Required | The name of the database to query (for example, `my-database`). |
| **ID** |  Required | The ID of the document to retrieve. |
| **Partition key** |  Optional | Optional partition key value for the document. When provided, the query is scoped to a single partition (cheaper than a cross-partition fan-out). |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp cosmos database container item get \
  --account <account> \
  --database <database> \
  --container <container> \
  --id <id> \
  [--partition-key <partition-key>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Cosmos DB account to query (e.g., my-cosmos-account). |
| `--database` | string | Yes | The name of the database to query (e.g., my-database). |
| `--container` | string | Yes | The name of the container to query (e.g., my-container). |
| `--id` | string | Yes | The id of the document to retrieve. |
| `--partition-key` | string | No | Optional partition key value for the document. When provided, the query is scoped to a single partition (cheaper than a cross-partition fan-out). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Database container item: List recent

Retrieves the most recently modified documents from an Azure Cosmos DB container, ordered by the system timestamp (`_ts`) in descending order. Use the count option to specify how many documents to return (1–20, default `10`). For example, list the 5 most recent documents from container 'orders' in database 'salesdb'.

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli cosmos database container item list-recent -->

Example prompts include:

- "Show the 15 most recent documents in container 'orders' of database 'sales-db' in account 'my-cosmos-account'."
- "Get the latest documents from container 'events' in database 'analytics-db' for account 'prod-cosmos-account'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Cosmos DB account to query (for example, `my-cosmos-account`). |
| **Container name** |  Required | The name of the container to query (for example, `my-container`). |
| **Database name** |  Required | The name of the database to query (for example, `my-database`). |
| **Count** |  Optional | Maximum number of documents to return (1-20). Defaults to 10. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp cosmos database container item list-recent \
  --account <account> \
  --database <database> \
  --container <container> \
  [--count <count>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Cosmos DB account to query (e.g., my-cosmos-account). |
| `--database` | string | Yes | The name of the database to query (e.g., my-database). |
| `--container` | string | Yes | The name of the container to query (e.g., my-container). |
| `--count` | string | No | Maximum number of documents to return (1-20). Defaults to 10. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Database container item: Query

Lists items from an Azure Cosmos DB container by `Account name`, `Database name`, and `Container name`. Optionally, provide a custom SQL query to filter results.

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli cosmos database container item query -->

Example prompts include:

- "Show me the items that contain the word 'invoice' in the container 'orders' in the database 'sales-db' for the Cosmos DB account 'my-cosmos-account'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Cosmos DB account to query (for example, `my-cosmos-account`). |
| **Container name** |  Required | The name of the container to query (for example, `my-container`). |
| **Database name** |  Required | The name of the database to query (for example, `my-database`). |
| **Query** |  Optional | SQL query to execute against the container. Uses Cosmos DB SQL syntax. |



Examples

- List all items in container 'orders' in database 'salesdb' for account 'contoso-cosmos-db'.
- List items in container 'orders' in database 'salesdb' for account 'contoso-cosmos-db' using query 'SELECT * FROM c WHERE c.quantity > 10'.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp cosmos database container item query \
  --account <account> \
  --database <database> \
  --container <container> \
  [--query <query>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Cosmos DB account to query (e.g., my-cosmos-account). |
| `--database` | string | Yes | The name of the database to query (e.g., my-database). |
| `--container` | string | Yes | The name of the container to query (e.g., my-container). |
| `--query` | string | No | SQL query to execute against the container. Uses Cosmos DB SQL syntax. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Database container item: Text search

Retrieves the top N documents in an Azure Cosmos DB container where a specified search property matches a search phrase, using the Azure Cosmos DB FullTextContains function. Matching uses word tokenization rather than substring matching, and the container's full-text analyzer applies language-specific stemming and stop-word filtering. For example, common English words like `the` or `hello` may be excluded from the index.

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli cosmos database container item text-search -->

Example prompts include:

- "Search documents in container 'orders' from database 'sales-db' of the cosmosdb account 'my-cosmos-account' where search property 'description' contains 'wireless headphones'."
- "Run a full-text search for 'project deadline' against search property 'profile.notes' in container 'tasks' of database 'prod-db' for cosmosdb account 'company-cosmos'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Cosmos DB account to query (for example, `my-cosmos-account`). |
| **Container name** |  Required | The name of the container to query (for example, `my-container`). |
| **Database name** |  Required | The name of the database to query (for example, `my-database`). |
| **Search phrase** |  Required | The phrase to search for. Passed as a parameterized value to a Cosmos DB FullTextContains query. The container must have a full-text index on the property. |
| **Search property** |  Required | The document property to search. Supports dot notation (for example, `'name'` or 'profile.name'). Allowed characters: letters, digits, and underscores. |
| **Count** |  Optional | Maximum number of documents to return (1-20). Defaults to 10. |
| **Properties to select** |  Optional | Comma-separated list of properties to project in the result (for example, `'ID,title,metadata.author'`). Wildcards ('*') are not supported in this list; omit this option to return all properties. |



Example:
`text-search` `--account-name` 'mycosmosacct' `--database-name` 'orders-db' `--container-name` 'orders' `--search-phrase` 'laptop' `--search-property` 'description' `--count` '5' `--properties-to-select` 'id,name,price'

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp cosmos database container item text-search \
  --account <account> \
  --database <database> \
  --container <container> \
  --search-property <search-property> \
  --search-phrase <search-phrase> \
  [--count <count>] \
  [--properties-to-select <properties-to-select>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Cosmos DB account to query (e.g., my-cosmos-account). |
| `--database` | string | Yes | The name of the database to query (e.g., my-database). |
| `--container` | string | Yes | The name of the container to query (e.g., my-container). |
| `--search-property` | string | Yes | The document property to search. Supports dot notation (e.g., 'name' or 'profile.name'). Allowed characters: letters, digits, and underscores. |
| `--search-phrase` | string | Yes | The phrase to search for. Passed as a parameterized value to a Cosmos DB FullTextContains query. The container must have a full-text index on the property. |
| `--count` | string | No | Maximum number of documents to return (1-20). Defaults to 10. |
| `--properties-to-select` | string | No | Comma-separated list of properties to project in the result (e.g., 'id,title,metadata.author'). Wildcards ('*') are not supported in this list; omit this option to return all properties. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Database container item: Vector search

Retrieves the top N documents in an Azure Cosmos DB container that are most similar to the provided search text. The tool converts the search text into an embedding by calling the Azure OpenAI embedding deployment specified by the Openai endpoint and Embedding deployment parameters. Optionally, specify embedding dimensions to request a custom length for models that support it (for example, `text-embedding-3-small`, `text-embedding-3-large`).

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli cosmos database container item vector-search -->

Example prompts include:

- "Run a vector search in Cosmos DB account 'my-cosmos-account', database 'knowledgebase', container 'articles' using search text 'how to migrate SQL to Cosmos DB', vector property 'embedding', Azure OpenAI endpoint 'https://oai-contoso.openai.azure.com/', and embedding deployment 'text-embedding-3-small'."
- "Find the top 5 documents in Cosmos DB account 'prod-cosmos', database 'contentdb', container 'prod-content' using search text 'best practices for indexing vector data', vector property 'metadata.vector', embedding deployment 'text-embedding-3-large', openai endpoint 'https://oai-prod.openai.azure.com/', embedding dimensions '1024', and properties to select 'ID,title,summary'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Cosmos DB account to query (for example, `my-cosmos-account`). |
| **Container name** |  Required | The name of the container to query (for example, `my-container`). |
| **Database name** |  Required | The name of the database to query (for example, `my-database`). |
| **Embedding deployment** |  Required | Name of the Azure OpenAI embedding deployment (for example, `'text-embedding-3-small'`) used to generate the embedding from `--search-text`. |
| **Openai endpoint** |  Required | Azure OpenAI endpoint (for example, `'https://my-endpoint.openai.azure.com/'`) used to generate the embedding from `--search-text`. |
| **Search text** |  Required | Free-form text to embed through Azure OpenAI before searching. |
| **Vector property** |  Required | The document property containing the vector embedding (for example, `'embedding'` or 'metadata.vector'). The container must have a vector index on this property. |
| **Count** |  Optional | Maximum number of documents to return (1-20). Defaults to 10. |
| **Embedding dimensions** |  Optional | Optional embedding dimensions to request from the model (only honored by models that support custom dimensions, for example, text-embedding-3-*). |
| **Properties to select** |  Optional | Comma-separated list of properties to project in the result (for example, `'ID,title,metadata.author'`). Wildcards ('*') are not supported in this list; omit this option to return all properties. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp cosmos database container item vector-search \
  --account <account> \
  --database <database> \
  --container <container> \
  --vector-property <vector-property> \
  --search-text <search-text> \
  --openai-endpoint <openai-endpoint> \
  --embedding-deployment <embedding-deployment> \
  [--properties-to-select <properties-to-select>] \
  [--count <count>] \
  [--embedding-dimensions <embedding-dimensions>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Cosmos DB account to query (e.g., my-cosmos-account). |
| `--database` | string | Yes | The name of the database to query (e.g., my-database). |
| `--container` | string | Yes | The name of the container to query (e.g., my-container). |
| `--vector-property` | string | Yes | The document property containing the vector embedding (e.g., 'embedding' or 'metadata.vector'). The container must have a vector index on this property. |
| `--properties-to-select` | string | No | Comma-separated list of properties to project in the result (e.g., 'id,title,metadata.author'). Wildcards ('*') are not supported in this list; omit this option to return all properties. |
| `--count` | string | No | Maximum number of documents to return (1-20). Defaults to 10. |
| `--search-text` | string | Yes | Free-form text to embed via Azure OpenAI before searching. |
| `--openai-endpoint` | string | Yes | Azure OpenAI endpoint (e.g., 'https://my-endpoint.openai.azure.com/') used to generate the embedding from --search-text. |
| `--embedding-deployment` | string | Yes | Name of the Azure OpenAI embedding deployment (e.g., 'text-embedding-3-small') used to generate the embedding from --search-text. |
| `--embedding-dimensions` | string | No | Optional embedding dimensions to request from the model (only honored by models that support custom dimensions, e.g., text-embedding-3-*). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Database container schema: Infer

Infers an approximate schema for an Azure Cosmos DB container by sampling documents. It reports top-level properties, their inferred JSON types, and the number of sampled documents that contain each property. Nested objects and arrays are reported as `object` or `array` without inspecting nested fields. To discover nested structure, fetch an individual document with `cosmos database container item get` and inspect its fields.

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli cosmos database container schema infer -->

- "Infer the schema for container 'orders' in database 'salesdb' on account 'contoso-account'."
- "Show top-level properties and types for container 'customer-data' in database 'crm-db' on account 'north-europe-account'."

Example prompts include:

- "Infer the schema of container 'orders' in database 'sales-db' for Cosmos DB account 'my-cosmos-account'."
- "Sample size '15' documents from container 'user-profiles' in database 'auth-db' of Cosmos DB account 'my-cosmos-account' and report top-level property names and inferred types."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Cosmos DB account to query (for example, `my-cosmos-account`). |
| **Container name** |  Required | The name of the container to query (for example, `my-container`). |
| **Database name** |  Required | The name of the database to query (for example, `my-database`). |
| **Sample size** |  Optional | Number of documents to sample for schema inference (1-20). Defaults to 10. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp cosmos database container schema infer \
  --account <account> \
  --database <database> \
  --container <container> \
  [--sample-size <sample-size>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Cosmos DB account to query (e.g., my-cosmos-account). |
| `--database` | string | Yes | The name of the database to query (e.g., my-database). |
| `--container` | string | Yes | The name of the container to query (e.g., my-container). |
| `--sample-size` | string | No | Number of documents to sample for schema inference (1-20). Defaults to 10. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get Cosmos DB accounts

Lists Azure Cosmos DB accounts, databases, or containers. By default, returns all accounts in the subscription. Specify the `account` parameter to list databases in that account. Specify both the `account` and `database` parameters to list containers in a specific database.

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli cosmos list -->

Example prompts include:

- "Show all cosmosdb accounts in my subscription."
- "What cosmosdb accounts do I have in my subscription?"
- "Display the cosmosdb accounts in my subscription."
- "List all databases in the cosmosdb account 'prod-cosmos'."
- "Show the databases in the cosmosdb account 'dev-cosmos'."
- "List all containers in database 'orders-db' for the cosmosdb account 'prod-cosmos'."
- "Show the containers in database 'inventory-db' for the cosmosdb account 'dev-cosmos'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Optional | The name of the Cosmos DB account (optional). When not specified, lists all accounts in the subscription. Specify this to list databases, or combine with `--database` to list containers. |
| **Database name** |  Optional | The name of the database (optional). Requires `--account` to be specified. When provided, lists containers within this database. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp cosmos list \
  [--account <account>] \
  [--database <database>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | No | The name of the Cosmos DB account (optional). When not specified, lists all accounts in the subscription. Specify this to list databases, or combine with --database to list containers. |
| `--database` | string | No | The name of the database (optional). Requires --account to be specified. When provided, lists containers within this database. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Cosmos DB documentation](/azure/cosmos-db/)

---
title: Azure Cosmos DB Tools 
description: Learn how to use the Azure MCP Server with Cosmos DB.
keywords: azure mcp server, azmcp, cosmos db
author: diberry
ms.author: diberry
ms.date: 5/12/2025
ms.topic: reference
ms.custom: build-2025
--- 
# Cosmos DB tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Cosmos DB accounts, databases, and containers.

[Azure Cosmos DB](/azure/cosmos-db/introduction) is a fully managed NoSQL database service for modern app development. Azure Cosmos DB offers single-digit millisecond response times, automatic and instant scalability, along with guaranteed speed at any scale.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Use existing server

### List accounts

The Azure MCP Server can list all Cosmos DB accounts in a subscription. This provides a quick overview of your Cosmos DB resources.

**Example prompts** include:

- **List accounts**: "List all my Cosmos DB accounts in my subscription."
- **Show accounts**: "What Cosmos DB accounts do I have?"
- **Find accounts**: "I need to see my Cosmos DB resources"
- **Query accounts**: "Show me all my Cosmos DB accounts"
- **Check accounts**: "Cosmos DB accounts in subscription abc123"

### List databases

The Azure MCP Server can list all databases in a Cosmos DB account. This helps you view your database resources in a specific account.

**Example prompts** include:

- **List databases**: "Show me all databases in my 'mycosmosaccount' Cosmos DB account."
- **View databases**: "What databases do I have in Cosmos DB account 'cosmosdb-prod'?"
- **Find databases**: "List databases in my Cosmos account 'data-store-cosmos'"
- **Query databases**: "Show all databases in my Cosmos DB account"
- **Check databases**: "What databases are available in my 'analytics-cosmos' account?"

### List containers

The Azure MCP Server can list all containers in a Cosmos DB database. This helps you manage your data organization within a database.

**Example prompts** include:

- **List containers**: "Show me all containers in database 'products' in my 'mycosmosaccount' Cosmos DB account."
- **View containers**: "What containers do I have in the 'users' database?"
- **Find containers**: "List all containers in database 'events' in my 'analytics-cosmos' account"
- **Query containers**: "Show containers in database 'inventory'"
- **Check containers**: "What containers are available in the 'orders' database in my Cosmos DB account?"

### Query items

The Azure MCP Server can execute SQL queries against items in a Cosmos DB container. This powerful feature allows you to retrieve specific data based on query conditions.

**Example prompts** include:

- **Simple query**: "Query all orders placed after January 1, 2025 from the 'orders' container in database 'sales'"
- **Filter query**: "Find all products with price less than $50 in the 'products' container"
- **Complex query**: "Query items where category is 'electronics' and stock is greater than 10"
- **Join query**: "Show me orders with their related customer information"
- **Aggregation query**: "Count how many orders we have by status in the 'orders' container"

## Develop new server

### List accounts

The Azure MCP Server can list all Cosmos DB accounts in a subscription. This provides a quick overview of your Cosmos DB resources.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp cosmos account list | List Cosmos DB accounts in a subscription.|


```console
azmcp cosmos account list \
    --subscription <SUBSCRIPTION_ID>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription to list Cosmos DB accounts from.

##### Optional parameters

View [optional parameters common to all tools](get-started.md#optional-parameters-common-to-all-tools). 

#### Examples

List all Cosmos DB accounts in the specified subscription.

```console
azmcp cosmos account list \
    --subscription "my-subscription-id"
```

### List databases

The Azure MCP Server can list all databases in a Cosmos DB account.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp cosmos database list | List databases in a Cosmos DB account.|

```console
azmcp cosmos database list \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Cosmos DB account.<br>
`--account-name`: The name of the Cosmos DB account.

##### Optional parameters

View [optional parameters common to all tools](get-started.md#optional-parameters-common-to-all-tools). 

#### Examples

List all databases in the specified Cosmos DB account.

```console
azmcp cosmos database list \
    --subscription "my-subscription-id" \
    --account-name "mycosmosaccount"
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

### List containers

The Azure MCP Server can list all containers in a Cosmos DB database.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp cosmos database container list | List containers in a Cosmos DB database.|

```console
azmcp cosmos database container list \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME> \
    --database-name <DATABASE_NAME>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Cosmos DB account.<br>
`--account-name`: The name of the Cosmos DB account.<br>
`--database-name`: The name of the database to list containers from.

##### Optional parameters

View [optional parameters common to all tools](get-started.md#optional-parameters-common-to-all-tools). 

#### Examples

List all containers in the specified database and Cosmos DB account.

```console
azmcp cosmos database container list \
    --subscription "my-subscription-id" \
    --account-name "mycosmosaccount" \
    --database-name "products"
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

### Query items

The Azure MCP Server can execute SQL queries against items in a Cosmos DB container.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp cosmos database container item query | Query items in a Cosmos DB container.|


```console
azmcp cosmos database container item query \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME> \
    --database-name <DATABASE_NAME> \
    --container-name <CONTAINER_NAME> \
    --query <QUERY>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Cosmos DB account.<br>
`--account-name`: The name of the Cosmos DB account.<br>
`--database-name`: The name of the database containing the container.<br>
`--container-name`: The name of the container to query items from.

##### Optional parameters

`--query`: The SQL query to execute against the container.

View [optional parameters common to all tools](get-started.md#optional-parameters-common-to-all-tools). 

#### Examples

Execute a simple query to retrieve all items from a container.

```console
azmcp cosmos database container item query \
    --subscription "my-subscription-id" \
    --account-name "mycosmosaccount" \
    --database-name "products" \
    --container-name "electronics" \
    --query "SELECT * FROM c"
```

Execute a filtered query to find specific items that match certain criteria.

```console
azmcp cosmos database container item query \
    --subscription "my-subscription-id" \
    --account-name "mycosmosaccount" \
    --database-name "orders" \
    --container-name "recent" \
    --query "SELECT * FROM c WHERE c.orderDate > '2025-01-01T00:00:00Z' AND c.status = 'pending'"
```
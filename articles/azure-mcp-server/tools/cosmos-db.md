---
title: Azure Cosmos DB Tools
description: Learn how to use the Azure MCP Server with Cosmos DB.
keywords: azure mcp server, azmcp, cosmos db
author: diberry
ms.author: diberry
ms.date: 5/05/2025
ms.topic: reference
ms.custom: build-2025
---

# Cosmos DB tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Cosmos DB databases and containers.

[Azure Cosmos DB](/azure/cosmos-db/introduction) is a fully managed NoSQL database service for modern app development. Azure Cosmos DB offers single-digit millisecond response times, automatic and instant scalability, along with guaranteed speed at any scale. It provides multiple data models including document, key-value, graph, and column-family for flexibility in application design.

[!INCLUDE [tip-about-params](../includes/toolsparameter-consideration.md)]


## List Cosmos DB accounts

The Azure MCP Server can list Cosmos DB accounts in a subscription. This is useful for quickly checking the status of your Cosmos DB resources.

### Example prompts

Example prompts for using the Azure MCP Server with Cosmos DB.

- **List accounts**: "List all Cosmos DB accounts in my subscription."
- **Show accounts**: "What Cosmos DB accounts do I have?"
- **Find accounts**: "I need to see my Cosmos DB resources"
- **Query accounts**: "Can you show me all my Cosmos DB instances?"
- **Check accounts**: "Cosmos DB accounts in subscription abc123"

### Reference

The Azure MCP Server has tools to manage Cosmos DB resources. Advanced users and automation tools use these tools.

| Name            | Description               |
|-----------------|--------------------------|
| azmcp cosmos account list | List Cosmos DB accounts in a subscription.|

```console
azmcp cosmos account list \
    --subscription <SUBSCRIPTION_ID>
```

#### Required parameters

`--subscription`: The ID of the subscription to list Cosmos DB accounts from. This parameter is required.
 
#### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

#### JSON response

[!INCLUDE [JSON response](../includes/response-format.md)]

#### Examples

List all Cosmos DB accounts in the specified subscription.

```console
azmcp cosmos account list \
    --subscription "my-subscription-id"
```

## List databases

The Azure MCP Server can list all [databases](/azure/cosmos-db/resource-model) in a Cosmos DB account. This allows you to view your databases in one place.

### Example prompts

- **List all databases**: "Show me all the databases in my mycosmosdb Cosmos DB account."
- **List databases**: "List all databases in my Cosmos DB account"
- **Get database names**: "What databases do I have in my dev-cosmosdb?"
- **View databases**: "List all databases from contoso-cosmosdb"
- **Check databases**: "Show me what databases are in my Cosmos account"

### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp cosmos database list | List databases in a Cosmos DB account.|

```console
azmcp cosmos database list \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME>
```

#### Required parameters

`--subscription`: The ID of the subscription containing the Cosmos DB account.<br>
`--account-name`: The name of the Cosmos DB account.

#### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

#### JSON response

[!INCLUDE [JSON response](../includes/response-format.md)]

#### Examples

List all databases in the specified Cosmos DB account.

```console
azmcp cosmos database list \
    --subscription "my-subscription-id" \
    --account-name "mycosmosdb"
```

## List containers

The Azure MCP Server can list all [containers](/azure/cosmos-db/resource-model) in a Cosmos DB database. This allows you to view your containers in one place.

### Example prompts

- **List all containers**: "Show me all the containers in the products database in my mycosmosdb Cosmos DB account."
- **List containers**: "List all containers in my users database"
- **Get container names**: "What containers do I have in the orders database of my dev-cosmosdb?"
- **View containers**: "List all containers from the inventory database in contoso-cosmosdb"
- **Check containers**: "Show me what containers are in my analytics database"

### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp cosmos database container list | List containers in a Cosmos DB database.|

```console
azmcp cosmos database container list \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME> \
    --database-name <DATABASE_NAME>
```

#### Required parameters

`--subscription`: The ID of the subscription containing the Cosmos DB account.<br>
`--account-name`: The name of the Cosmos DB account.<br>
`--database-name`: The name of the database.

#### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

#### JSON response

[!INCLUDE [JSON response](../includes/response-format.md)]

#### Examples

List all containers in the specified Cosmos DB database.

```console
azmcp cosmos database container list \
    --subscription "my-subscription-id" \
    --account-name "mycosmosdb" \
    --database-name "products"
```

## Query data container

[Execute a SQL query](/azure/cosmos-db/nosql/query/) against items in a Cosmos DB [container](/azure/cosmos-db/resource-model).

### Example prompts

- **Simple query**: "Find all orders in my orders container"
- **Filtered query**: "Show me customers in Seattle from my customers container"
- **Complex filter**: "Query my products container for items where price is less than 20 and category is 'electronics'"
- **Return specific fields**: "Get the name and email from all users in my profiles container"
- **Limit results**: "Show me the top 5 products from my inventory container"
- **Sort results**: "Get all tasks from my tasks container ordered by due date"
- **Count records**: "Count how many documents in my events container have status 'completed'"
- **Aggregation**: "Calculate the average age of users in my profiles container"
- **Join containers**: "Find orders and their matching customers from my store database"
- **Advanced filtering**: "Query my analytics container for events between January 1 and March 31 where the user was from Europe"

### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp cosmos database container item query | Query items in a Cosmos DB container.|

```console
azmcp cosmos database container item query \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME> \
    --database-name <DATABASE_NAME> \
    --container-name <CONTAINER-NAME> \
    --query <QUERY>
```

An example query is `"SELECT * FROM c"`.

#### Required parameters

`--subscription`: The ID of the subscription containing the App Configuration store.<br>
`--account-name`: The name of the Cosmos DB account.<br>
`--database-name`: The name of the database.<br>
`--container-name`: The name of the container.

#### Optional parameters

`--query`: The full text of the [query](/azure/cosmos-db/nosql/query/). If the query isn't provided, the default query is used: `"SELECT * FROM c"`.

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

#### JSON response

[!INCLUDE [JSON response](../includes/response-format.md)]

#### Examples

Select all items from the container.

```console
azmcp cosmos database container item query \
    --subscription "my-subscription-id" \
    --account-name "mycosmosdb" \
    --database-name "products" \
    --container-name "cars" \
    --query "SELECT * FROM c"
```

Filter items by a specific property.

```console
azmcp cosmos database container item query \
    --subscription "my-subscription-id" \
    --account-name "mycosmosdb" \
    --database-name "products" \
    --container-name "cars" \
    --query "SELECT * FROM c WHERE c.make = 'Toyota'"
```

Select only specific properties from items.

```console
azmcp cosmos database container item query \
    --subscription "my-subscription-id" \
    --account-name "mycosmosdb" \
    --database-name "products" \
    --container-name "cars" \
    --query "SELECT c.id, c.make, c.model, c.year FROM c"
```

Limit results and order them.

```console
azmcp cosmos database container item query \
    --subscription "my-subscription-id" \
    --account-name "mycosmosdb" \
    --database-name "products" \
    --container-name "cars" \
    --query "SELECT TOP 5 * FROM c ORDER BY c.price DESC"
```

Use aggregation functions.

```console
azmcp cosmos database container item query \
    --subscription "my-subscription-id" \
    --account-name "mycosmosdb" \
    --database-name "products" \
    --container-name "cars" \
    --query "SELECT AVG(c.price) AS averagePrice FROM c"
```
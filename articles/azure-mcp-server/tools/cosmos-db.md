---
title: Azure Cosmos DB Tools 
description: Learn how to use the Azure MCP Server with Cosmos DB.
keywords: azure mcp server, azmcp, cosmos db
author: diberry
ms.author: diberry
ms.date: 05/14/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Cosmos DB tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Cosmos DB accounts, databases, and containers with natural language prompts. You can query and manage your NoSQL databases using simple conversational commands.

[Azure Cosmos DB](/azure/cosmos-db/introduction) is a fully managed NoSQL database service for modern app development. Azure Cosmos DB offers single-digit millisecond response times, automatic and instant scalability, along with guaranteed speed at any scale.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List accounts

The Azure MCP Server can list all Cosmos DB accounts in a subscription. This provides a quick overview of your Cosmos DB resources.

**Example prompts** include:

- **List accounts**: "List all my Cosmos DB accounts in my subscription."
- **Show accounts**: "What Cosmos DB accounts do I have?"
- **Find accounts**: "I need to see my Cosmos DB resources"
- **Query accounts**: "Show me all my Cosmos DB accounts"
- **Check accounts**: "Cosmos DB accounts in subscription abc123"

| Required/Optional | Parameter | Description |
|-------------------|-----------|-------------|
| Required | **Subscription** | The Azure subscription ID or name. |

## List databases

The Azure MCP Server can list all databases in a Cosmos DB account. This helps you view your database resources in a specific account.

**Example prompts** include:

- **List databases**: "Show me all databases in my 'mycosmosaccount' Cosmos DB account."
- **View databases**: "What databases do I have in Cosmos DB account 'cosmosdb-prod'?"
- **Find databases**: "List databases in my Cosmos account 'data-store-cosmos'"
- **Query databases**: "Show all databases in my Cosmos DB account"
- **Check databases**: "What databases are available in my 'analytics-cosmos' account?"

| Required/Optional | Parameter | Description |
|-------------------|-----------|-------------|
| Required | **Subscription** | The Azure subscription ID or name. |
| Required | **Account name** | The name of the Cosmos DB account. |

## List containers

The Azure MCP Server can list all containers in a Cosmos DB database. This helps you manage your data organization within a database.

**Example prompts** include:

- **List containers**: "Show me all containers in database 'products' in my 'mycosmosaccount' Cosmos DB account."
- **View containers**: "What containers do I have in the 'users' database?"
- **Find containers**: "List all containers in database 'events' in my 'analytics-cosmos' account"
- **Query containers**: "Show containers in database 'inventory'"
- **Check containers**: "What containers are available in the 'orders' database in my Cosmos DB account?"

| Required/Optional | Parameter | Description |
|-------------------|-----------|-------------|
| Required | **Subscription** | The Azure subscription ID or name. |
| Required | **Account name** | The name of the Cosmos DB account. |
| Required | **Database name** | The name of the database. |

## Query items

The Azure MCP Server can execute SQL queries against items in a Cosmos DB container. This powerful feature allows you to retrieve specific data based on query conditions.

**Example prompts** include:

- **Simple query**: "Query all orders placed after January 1, 2025 from the 'orders' container in database 'sales'"
- **Filter query**: "Find all products with price less than $50 in the 'products' container"
- **Complex query**: "Query items where category is 'electronics' and stock is greater than 10"
- **Join query**: "Show me orders with their related customer information"
- **Aggregation query**: "Count how many orders we have by status in the 'orders' container"

| Required/Optional | Parameter | Description |
|-------------------|-----------|-------------|
| Required | **Subscription** | The Azure subscription ID or name. |
| Required | **Account name** | The name of the Cosmos DB account. |
| Required | **Database name** | The name of the database. |
| Required | **Container name** | The name of the container. |
| Optional | **Query** | SQL query to execute against the container. |

[!INCLUDE [global-params](../includes/tools/global-parameters-link.md)]
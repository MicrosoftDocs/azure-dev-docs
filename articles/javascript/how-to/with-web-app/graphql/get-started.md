---
title: Get started with GraphQL on Azure
description: Learn how to use a GraphQL API and deploy to Azure using the Apollo server in an Azure Function.  
ms.topic: how-to
ms.date: 07/19/2021
ms.custom: devx-track-js
---

# Get started with GraphQL on Azure

In this article, learn how to use a GraphQL API and deploy to Azure using the Apollo server in an Azure Function. 

## Use GraphQL to allow a client to query data

GraphQL provides a query language that allows you to ask for data from a server in a declarative way. You can ask for:

* The specific data you need in the schema you need it. 
* Return the data in a nested schema representing a collection of objects, regardless of how many datasources are required from a single query. 

It acts as a layer between the API endpoint and the database. You can use GraphQL providers to provide this functionality for you.  

## Your first GraphQL API queryy 

A GraphQL query, asking for the value `hello` from the server, _looks like JSON_ but isn't a true JSON object:

```graphql
{
    hello
}
```

The server responds with JSON:

```json
{
    "hello":"Hello from GraphQL backend"
}
```

Learn how to deploy this GraphQL API as an [Azure Function](azure-function-hello-world.md)








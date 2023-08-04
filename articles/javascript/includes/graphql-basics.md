---
title: include file graphql-basics.md
description: include file graphql-basics.md 
ms.topic: include
ms.date: 07/20/2021
ms.custom: devx-graphql
# used in several places to explain graphql basic concepts
---

## GraphQL APIs give the client control of API results

GraphQL provides a query language that allows you to ask for data from a server in a declarative way. You can ask for:

* The specific data you need, in the schema you need it. Changes to the data schema are done by the client in the schema definition for the API.
* Returning the data in a nested schema representing a collection of objects, regardless of how many data sources are required. Contrast this with a typical REST API that needs several API requests to provide the same data.

GraphQL acts as a layer between the API endpoint and the database. GraphQL providers, such as [Apollo](https://www.apollographql.com/), provide much of the functionality you need to build your GraphQL APIs. Like most software that uses databases, the provider can't write the actual database queries for you, because only you know your data. The providers do usually generate much of the boilerplate code to use GraphQL, so you are left with just your business or middleware logic.  

## Your first Apollo GraphQL API query

* [Sample code](https://github.com/azure-samples/js-e2e-azure-function-graphql-hello)

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

## Read and write Apollo GraphQL with queries and mutations

* [Sample code](https://github.com/azure-samples/js-e2e-azure-function-graphql-crud-operations)

In GraphQL, you perform read operations against data by using queries, and write operations, such as inserts and updates, by using mutations.

## Get all with an Apollo GraphQL API query

Suppose you have a data source that contains messages with an ID, an author, and the content of each message. 

To query for all messages, your GraphQL query looks like:

```graphql
{
  getMessages {
    id
    content
    author
  }
}
```

Your API endpoint might look like: `/api/graphql`, and the cURL request might look like:

```bash
curl -X POST 'http://localhost:7071/api/graphql' \
     -H 'content-type: application/json' \
     --data-raw '{"query":"{ getMessages { id content author } }"}'
```

The API response looks like:

```json
{
    "data": {
        "getMessages": [
            {
                "id": "d8732ed5-26d8-4975-98a5-8923e320a77f",
                "author": "dina",
                "content": "good morning"
            },
            {
                "id": "33febdf6-e618-4884-ae4d-90827280d2b2",
                "author": "john",
                "content": "oh happy day"
            }
        ]
    }
}
```

## Return a subset of the data with the client query

Although the previous example returned every message and every field within a message, there might be times when the client knows it only wants certain fields. This doesn't require any new code for the API, but does require a new query from the client, describing the schema of the expected response.

Here's a query that gets all messages, but only the `id` and `author` fields of them. The query tells the GraphQL server not to send the values for `content` to the client:

```graphql
{
  getMessages {
    id
    author
  }
}

```

Your API endpoint might look like: `/api/graphql`, and the cURL request might look like:

```bash
curl -X POST 'http://localhost:7071/api/graphql' \
     -H 'content-type: application/json' \
     --data-raw '{"query":"{ getMessages { id author } }"}'
```

The API response looks like:

```json
{
    "data": {
        "getMessages": [
            {
                "id": "d8732ed5-26d8-4975-98a5-8923e320a77f",
                "author": "dina"
            },
            {
                "id": "33febdf6-e618-4884-ae4d-90827280d2b2",
                "author": "john"
            }
        ]
    }
}
```

## Change the data with a mutation

To change the data, use a mutation that defines the change, and also defines what data to return from the change. Suppose you have a data source that contains messages with an ID, an author, and the content of each message, and you want to add a new message. 

### Apollo GraphQL syntax

To add a new message, your GraphQL mutation looks like:

```graphql
mutation {
  createMessage(input: { author: "John Doe", content: "Oh happy day" }) {
    id
  }
}
```

Notice that the last curly brace section, `{ id }`, describes the schema the client wants in the response.

### HTTP cURL request

Your API endpoint might look like: `/api/graphql`, and the cURL request might look like:

```bash
curl 'http://localhost:7071/api/graphql' \
    -X POST \
    -H 'Content-Type: application/json' \
    --data-raw '{"query": "mutation{ createMessage(input: { author: \"John Doe\", content: \"Oh happy day\" }){ id } }"}'
```

### HTTP response

The API response looks like:

```json
{
    "data": {
        "createMessage": {
            "id":"7f1413ec-4ffa-45bc-bce2-583072745d84"
        }
    }
}
```

## Change the data with variables for an Apollo mutation

The preceding query hard-coded the values of the `author` and `content`. This method isn't recommended, but is used here to illustrate where the values are expected on the request. Now, you can change the same mutation request to allow variables, and allow the client making the request to inject the appropriate values. 

### HTTP cURL request body

To pass variables, send them in the `variables` property. Describe them in the mutation parameters with the `$`, and a type that matches what the mutation expects, such as `String!`. Then assign them to the mutation arguments as required.

```json
{
  "variables": { "author": "jimbob", "content": "sunny in the `ham" },
  "query": "mutation ($author: String!, $content: String!) { createMessage(input: { author: $author, content: $content }){ id }}"
}
```

### cURL request

The following request body, `--data-raw` value, is stripped of all formatting.

```bash
curl 'http://localhost:7071/api/graphql' \
    -X POST \
    -H 'Content-Type: application/json' \
    --data-raw '{"variables": { "author": "jimbob", "content": "sunny in the `ham" },"query": "mutation ($author: String!, $content: String!){ createMessage(input: { author: $author, content: $content }){ id } }"}'
```

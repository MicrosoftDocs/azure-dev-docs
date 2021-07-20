---
title: include file graphql-basics.md
description: include file graphql-basics.md 
ms.topic: include
ms.date: 07/20/2021
ms.custom: devx-track-javascript
# used in several places to explain graphql basic concepts
---

## GraphQL APIs give client control of API results

GraphQL provides a query language that allows you to ask for data from a server in a declarative way. You can ask for:

* The specific data you need in the schema you need it. Changes to the data schema are done by the client in the schema definition based to the API.
* Return the data in a nested schema representing a collection of objects, regardless of how many data sources are required. Contrast this with a typical REST API that needs several API requests to provide the same data.

GraphQL acts as a layer between the API endpoint and the database. GraphQL providers, such as [Apollo](https://www.apollographql.com/), provide much of the functionality you need to build your GraphQL APIs. Like most software that uses databases, the provider can't write the actual database queries for you, because only you know your data. The providers do usually wire up much of the boilerplate code to use GraphQL so you are left with just your business or middleware logic.  

## Your first Apollo GraphQL API query

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

## Reading and writing Apollo GraphQL with queries and mutations

Reading the data from a GraphQL API is contained within _queries_ while any changes such as inserts and updates are contained within _mutations_. 

## Get all with a Apollo GraphQL API query

Suppose you have a data source that contains messages with an ID, author, and content of each message. 

To query for all messages, your GraphQL query looks like:

```graphql
{getMessages{id, content, author}}
```

Your API endpoint may look like: `/api/message` and the cURL request may look like:

```bash
curl -X POST 'http://localhost:7071/api/message' \
    -H 'content-type: application/json' \
    --data-raw '{"query":"{getMessages{id, content, author}}"}'
```

The API response looks like:

```json
{"data": {
    "getMessages": 
        [
            {"id": "d8732ed5-26d8-4975-98a5-8923e320a77f","author": "dina", "content": "good morning"},
            {"id": "33febdf6-e618-4884-ae4d-90827280d2b2","author": "john", "content": "oh happy day"}
        ]
    }
}
```

## Change Apollo schema definition with the client query

While this returned every message and every field within a message, there may be times when the client knows it only wants certain fields. This doesn't require any new code for the API but does require a new query from the client, describing the schema of the expected response:

To query for all messages, your GraphQL query looks like:

```graphql
{getMessages{id, author}}
```

Your API endpoint may look like: `/api/mymessages/getMessages` and the cURL request may look like:

```bash
curl -X POST 'http://localhost:7071/api/message' \
    -H 'content-type: application/json' \
    --data-raw '{"query":"{getMessages{id, author}}"}'
```

The API response looks like:

```json
{"data": {
    "getMessages": 
        [
            {"id": "d8732ed5-26d8-4975-98a5-8923e320a77f","author": "dina"},
            {"id": "33febdf6-e618-4884-ae4d-90827280d2b2","author": "john"}
        ]
    }
}
```

## Change the data with a mutation

To change the data, use a mutation that defines the change, _and_ defines what data to return from the change. Suppose you have a data source that contains messages with an ID, author, and content of each message and you want to add a new message. 

### Apollo GraphQL syntax

To add a new message, your GraphQL mutation looks like:

```graphql
mutation{createMessage(input:{author: "John Doe",content: "Oh happy day"}){id}}
```

Notice that the last curly brace section, `{id}`, describes the schema the client wants in the response.

### HTTP cURL request

Your API endpoint may look like: `/apimessage` and the cURL request may look like:

```bash
curl 'http://localhost:7071/api/message' \
    -X POST \
    -H 'Content-Type: application/json' \
    --data-raw '{"query": "mutation{createMessage(input:{author: \"John Doe\",content: \"Oh happy day\"}){id}}"}'
```

### HTTP response

The API response looks like:

```json
{
    "data":{
        "createMessage":{
            "id":"7f1413ec-4ffa-45bc-bce2-583072745d84"
        }
    }
}
```

## Change the data with variables for an Apollo mutation

The preceding query hard-coded the values of the `author` and `content`. That preceding example isn't a recommended method but used to illustrate where the values are expected on the request. Now, change the same mutation request to allow variables, and help make client code maintenance easier. 

### HTTP cURL request body

To pass variables, you need to send them in the `variables` property, and describe them in the mutation params with the `$` and non-nullable type, `String!`, then pass them to the mutation resolver, `createMessage`.

```json
{
  "variables": { "author": "jimbob", "content": "sunny in the `ham" },
  "query": "mutation ($author: String!, $content: String!) {createMessage(input:{author: $author,content: $content}){id}}"
}
```

### cURL request

The following request body, `--data-raw` value, is stripped of all formatting.

```bash
curl 'http://localhost:7071/api/message' \
    -X POST \
    -H 'Content-Type: application/json' \
    --data-raw '{"variables": { "author": "jimbob", "content": "sunny in the `ham" },"query": "mutation ($author: String!, $content: String!){createMessage(input:{author: $author,content: $content}){id}}"}'
```
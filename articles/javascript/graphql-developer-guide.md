---
title: GraphQL on Azure for JavaScript developers
description: Learn how to build and deploy GraphQL applications on Azure using JavaScript, and discover the Azure services that make your GraphQL implementation easier.
ms.topic: concept-article
ms.date: 04/22/2025
ms.custom: devx-graphql
#CustomerIntent: As a developer new to Azure, I want to understand how to find the right services and tools to bring or build GraphQL applications with Azure so that my application runs without any more work than is necessary. 
---

# GraphQL on Azure for JavaScript developers

GraphQL helps your JavaScript applications retrieve exactly the data they need with a single request. This article explains what GraphQL is, why you might use it, and how Azure services can help you build GraphQL applications with minimal effort. Whether you're migrating an existing GraphQL application or building a new one, Azure provides tools and services to simplify the process.

## What is GraphQL?

GraphQL is a modern way for your web application to talk to servers and databases. Think of it as a smarter way to request exactly the information you need:

* It's like ordering a custom meal instead of accepting a fixed menu - you ask for exactly what you want
* It works well with JavaScript applications like React, Vue, or Angular
* It can make your web apps faster and easier to build

Instead of making multiple requests to different server endpoints (like with traditional REST APIs - the standard way most web services communicate), GraphQL lets you make one precise request to get all the data you need.

## Why would I want to use GraphQL in my web app?

GraphQL makes your JavaScript applications better in three main ways:

* **Get exactly what you need**: Your app can ask for just the data it needs right now - no more, no less. This is like going to a buffet and taking only what you'll eat, instead of being served a giant fixed meal where most gets wasted. This makes your app faster because it downloads less data.

* **One request instead of many**: Need information from multiple places? Instead of making 5 different requests to 5 different endpoints, GraphQL lets you make just one request to get everything. This is like having one person gather all your shopping instead of you going to five different stores.

* **Fewer mistakes with better tools**: GraphQL comes with tools that help catch errors while you're coding instead of when your app is running. It's like having spell-check that works while you type, rather than discovering typos after you've published your document.

## Popular JavaScript tools for GraphQL

When building with GraphQL and JavaScript, you'll likely use one of these popular tools:

* **Apollo Client**: The most widely used GraphQL client that works with React, Vue, Angular and plain JavaScript.
* **URQL**: A lightweight alternative with good performance.
* **Relay**: Created by Facebook (who also created GraphQL), best for large React applications.

## Azure services for GraphQL applications

Choose your approach based on your specific scenario:

| If you want to... | Then you should... | Using these Azure services |
|-------------------|--------------------|-----------------------------|
| **Bring an existing GraphQL app to Azure** | Deploy your application without changing your code | Azure App Service or Azure Container Apps |
| **Add GraphQL to your existing data** | Create GraphQL endpoints for your data with minimal coding | Data API builder |
| **Build a GraphQL API layer** | Create a unified GraphQL interface over existing APIs | Azure API Management with GraphQL transformation |

## Host GraphQL applications on Azure

You have a few good options depending on what type of application you're building:

* **App Service**: This is like a traditional web hosting service, but with extra features. It's great for most JavaScript applications that need a server.

* **Container Apps**: If your application is packaged in containers (like Docker), this service makes running and scaling them easy.

## Data storage for GraphQL applications

GraphQL needs to connect to your data. Azure offers several ways to do this:

* **Turn your database into a GraphQL API**: The "Data API builder" tool can automatically create a GraphQL endpoint (a URL where your app can send GraphQL requests) from your existing database - no coding required!

* **Store your data**: Azure offers databases for different needs:
  * SQL Database: For traditional table-based data
  * Cosmos DB: For flexible, scalable data storage without rigid schemas

## Secure GraphQL applications

* **User login and security**: Azure's Identity platform helps you add login features to your application so only the right people can access your GraphQL data.
* **Role-based access**: Control exactly which users can query or modify what data through your GraphQL endpoints.
* **API protection**: Add rate limiting and monitoring to prevent abuse of your GraphQL APIs.

## Create GraphQL APIs for your existing data

Already have data in Azure and want to access it with GraphQL? There are simple ways to do this:

* **API Management**: This service can create a GraphQL layer in front of your existing APIs or data sources. It's like adding a GraphQL translator to systems that don't speak GraphQL natively.

* **Data API Builder**: This tool automatically creates GraphQL endpoints from your databases. It's the quickest way to add GraphQL to your existing data - just point it at your database and it does the work for you.

## A simple example: Creating a GraphQL API for a product database

Here's how the process works in simple terms:

1. You have a database with product information (names, prices, descriptions)
2. You set up Data API Builder to connect to your database
3. Data API Builder creates a GraphQL endpoint automatically
4. Your JavaScript application can now make GraphQL queries like:

```graphql
{
  products(where: { price_lt: 50 }) {
    name
    price
    description
  }
}
```

This query would get you all products under $50, showing just their names, prices, and descriptions.

## Resources to help you get started

If you want to learn more or start building with GraphQL on Azure, here are some helpful resources:

* [Introduction to GraphQL for beginners](https://graphql.org/learn/)
* [Getting started with Data API Builder](https://github.com/Azure/data-api-builder)
* [JavaScript GraphQL examples on Azure](/samples/browse/?languages=graphql%2Cjavascript%2Ctypescript&products=azure&filter-languages=graphql)

## Next steps

* [Install Data API Builder](/azure/data-api-builder/get-started/get-started-with-data-api-builder)
* [Azure Container Apps](/azure/container-apps)
* [Azure API Management](https://azure.microsoft.com/services/api-management/) - Create and manage APIs
* [Azure App service](/azure/app-service)
* [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) - Store structured data
* [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) - Store flexible, unstructured data


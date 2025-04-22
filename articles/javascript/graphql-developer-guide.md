---
title: GraphQL Guide For Azure JavaScript Developers
description: Discover the services and tools you need to build and deploy your GraphQL applications on Azure, whether you're hosting existing applications or creating new GraphQL endpoints.
ms.topic: concept-article
ms.date: 04/22/2025
ms.custom: devx-graphql
#CustomerIntent: As a developer new to Azure, I want to understand how to find the right services and tools to bring or build GraphQL applications with Azure so that my application runs without any more work than is necessary. 
---

# GraphQL for JavaScript developers on Azure?

Discover the services and tools you need to build and deploy your GraphQL applications on Azure. Whether you're hosting your existing GraphQL applications or creating new GraphQL endpoints, Azure provides the resources to do so without changes to your code.

Understand how to use [GraphQL](https://graphql.org/) on Azure. 

* **Bring** GraphQL applications to the Azure web app hosting services such as Static Web Apps, App Service, and Azure Functions.
* **Build** GraphQL endpoints to your existing data sources without adding GraphQL infrastructure. Integrate microservices, stitching together calls to existing backed services, using [API Management](/azure/api-management/graphql-apis-overview) or access to database via GraphQL using [Data API builder](/azure/data-api-builder/overview-to-data-api-builder).

## What is GraphQL?

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

GraphQL [language support](https://graphql.org/code/) is extensive, allowing you to choose your language of choice to build GraphQL applications. GraphQL is also supported by many [client libraries](https://graphql.org/code/#graphql-clients) and [server libraries](https://graphql.org/code/#graphql-servers).

JavaScript developers in particular benefit from GraphQL's ecosystem with powerful tooling such as Apollo Client 4.0, Relay, and the newer GraphQL Yoga integration. Recent advancements in incremental delivery and real-time features make GraphQL an even more compelling choice for modern web applications.

## Why use GraphQL in frontend applications?

GraphQL offers several key advantages for frontend and client applications:

* **Precise data fetching**: Frontend applications can request exactly the data they need and nothing more, reducing over-fetching and under-fetching issues common with REST APIs. This leads to smaller payloads, faster load times, and less bandwidth consumption - especially important for mobile web applications.

* **Single request for complex data**: GraphQL enables frontend developers to retrieve complex, nested data from multiple resources in a single API call, eliminating the need for multiple round-trips to different endpoints that can slow down application performance and complicate state management.

* **Strong typing and self-documenting APIs**: The GraphQL schema provides frontend developers with a contract that defines available data and operations, enabling powerful tooling for autocomplete, validation, and type checking during development. This improves developer experience and reduces runtime errors through compile-time validation.

## Bring your GraphQL applications to Azure

When you bring your existing application to Azure, consider the following services and their uses:
* **Hosting**: You can bring your existing applications to Azure and take advantage of the benefits of Azure's web app hosting services. Which service depends on how you deploy your application. 
    * Use [Azure App Service](/azure/app-service/). 
    * Use [Azure Container Apps](/azure/container-apps/) for containerized applications with built-in scaling, service discovery and enhanced observability.
* **Authentication**: Use [Identity platform](/azure/active-directory/develop/) to add authentication to your application.
* **Query and mutate data**: Use a data service to store data and take advantage of [Data API builder](/azure/data-api-builder/overview-to-data-api-builder) to use GraphQL to query and mutate data.
    * **GraphQL for Databases**: Use [Data API builder](/azure/data-api-builder/graphql) to automatically turn your databases into GraphQL endpoints. 
    * **Relational data**: Use [Azure SQL Database](/azure/sql-database/) or [Azure Database for PostgreSQL](/azure/postgresql/).
    * **NoSQL data**: Use [Azure Cosmos DB](/azure/cosmos-db/).
* **API** layer: Use [GraphQL APIs in Azure API Management](/azure/api-management/graphql-apis-overview) with enhanced schema stitching capabilities, federation support, and optimized JavaScript client integration. 

## Build GraphQL endpoints to your existing data sources

When you build GraphQL endpoints to your existing data sources, consider the following services and their uses:

* **Custom API endpoints**: Use [Azure API Management](/azure/api-management/graphql-apis-overview) to build a GraphQL endpoint to your existing Azure data sources. 
* **Database integration**: Data API builder now supports GraphQL fragments, improved nested query performance, and transparent integration with popular JavaScript GraphQL clients.
## Resources

Learn more about building GraphQL applications on Azure:

* [Azure API Management](/azure/api-management/graphql-apis-overview)

## Related content

* [Azure SQL DB](/azure/azure-sql/)
* [Azure Cosmos DB](/azure/cosmos-db/)
* [Data API builder](/azure/data-api-builder/overview-to-data-api-builder)
* [Azure API Management](/azure/api-management/graphql-apis-overview)
* [Static Web Apps](/azure/static-web-apps/database-overview)

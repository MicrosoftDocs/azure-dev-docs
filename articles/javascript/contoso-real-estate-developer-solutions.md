---
title: Contoso real estate solution set
description: 
ms.topic: concept
ms.date: 05/23/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
---

# Contoso real estate solution set

This reference architecture contains the components for building enterprise-grade modern composable frontends (or micro-frontends) and cloud-native applications. It's a collection of best practices, architecture patterns, and functional components that can be used to build and deploy modern JavaScript applications to Azure.


:::image type="content" source="./media/contoso-real-estate/e2e-full-horizontal-architecture.png" lightbox="./media/contoso-real-estate/e2e-full-horizontal-architecture.png" alt-text="Diagram showing cloud architecture of Contoso real estate with Hero services on the left and the complete interaction of the services on the right.":::

## Scenario 1: The blog

This scenario provides data authoring and storing capabilities for both vertical micro-frontend applications (Blog and Portal). We enable these capabilities, via the implementation of a Headless CMS, powered by Strapi. 

:::image type="content" source="./media/contoso-real-estate/scenario-1-blog-cms-api.png" alt-text="{alt-text}":::

There are two components that make up the architecture of this solution:

- A Headless CMS, implemented using Strapi.
- A frontend application, implemented using Next.js, that consumes the data from the Headless CMS and renders the blog pages.
- A PostegreSQL database that stores the data for the Headless CMS. The CMS is hosted in Azure Container Apps, and the database will be hosted in Azure Database for PostgreSQL. They'll connect to each other via the endpoints built in the Strapi server implementation.

Both of these applications are hosted in [Azure Container Apps](https://learn.microsoft.com/azure/container-apps/overview).


## Scenario 2: The portal

This frontend application is the main entry point for the users, implementing Angular as a JavaScript framework. 

:::image type="content" source="./media/contoso-real-estate/scenario-2-portal-swa-fn-api.png" alt-text="{alt-text}":::

This service is deployed to [Azure Static Web Apps](https://azure.microsoft.com/es-es/products/app-service/static/#features), including capabilities like 
  - Authentication and Authorization with Easy Auth

The API backend is deployed to [Azure Functions](https://azure.microsoft.com/services/functions/), which is a serverless compute service that allows you to run code on-demand without having to explicitly manage infrastructure.

The database for content, integrated to the serverless API backend, is an [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/) populated from a headless CMS implementation in Scenario 1.

A database for user events and user profiles, integrated into the serverless API backend is an [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/), which is a fully managed NoSQL database service that offers multiple APIs, including the MongoDB API. 

## Scenario 3: User authentication

User authentication is provided as built-in functionality in [Azure Static web apps](/azure/static-web-apps/). The typical flow of [sign in](/azure/static-web-apps/authentication-authorization), redirecting a user to an authorization provider to complete authentication, then redirecting the authenticated user back to the application, is offered with several social media providers:

:::image type="content" source="./media/contoso-real-estate/scenario-3-user-authentication-swa-cosmo-db-mongodb.png" alt-text="{alt-text}":::

Once a user is logged in, their user information is stored in [Cosmos DB for MongoDB API](/azure/cosmos-db/mongodb/choose-model) such as favorited-properties, and property reservations. 

## Scenario 4: Payments

This scenario supports the checkout process, in the portal, to pay for a property reservation. The payment flow is implemented with [Stripe](https://stripe.com/), a payment processing platform that allows you to accept payments online.
This scenario containerizes the [Fastify](https://fastify.dev/) payments application deployed to [Azure Container Apps](https://learn.microsoft.com/azure/container-apps/overview)

:::image type="content" source="./media/contoso-real-estate/scenario-4-payment-string-api-management.png" alt-text="{alt-text}":::

When Azure API Management receives a request for the webhook endpoint URL from Stripe, it forwards the request to the API. The API handles the incoming webhook event and performs the payment actions such as check out, checkout completed, checkout expired. 

Azure API Management is also used in this architecture to mediate the requests between the frontend portal and the backend portal API.

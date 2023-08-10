---
title: Contoso real estate solution set
description: Learn the Contoso real estate reference architecture for this enterprise-grade modern composable cloud-native application and its scenarios.
ms.topic: conceptual
ms.date: 08/10/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
---

# Packaged solutions for Contoso real estate 

This reference architecture contains the components for building enterprise-grade modern composable frontends (or micro-frontends) and cloud-native applications. It's a collection of best practices, architecture patterns, and functional components that can be used to build and deploy modern JavaScript applications to Azure.

:::image type="content" source="./media/contoso-real-estate-developer-solutions/end-to-end-full-horizontal-architecture.png" lightbox="./media/contoso-real-estate-developer-solutions/end-to-end-full-horizontal-architecture.png" alt-text="Diagram showing cloud architecture of Contoso real estate with Hero services on the left and the complete interaction of the services on the right.":::

The following packages are listed in order of learning priority.

## Package: The blog with Container Apps and Azure Database for PostgreSQL

This package provides data authoring and storing capabilities for both vertical micro-frontend applications (Blog and Portal). We enable these capabilities, via the implementation of a Headless CMS, powered by Strapi. 

:::image type="content" source="./media/contoso-real-estate-developer-solutions/scenario-1-blog-cms-api.png" alt-text="Architectural diagram of the blog client and API scenario.":::

There are two components that make up the architecture of this solution:

- A Headless CMS, implemented using Strapi.
- A frontend application, implemented using Next.js, that consumes the data from the Headless CMS and renders the blog pages.
- A PostegreSQL database that stores the data for the Headless CMS. The CMS is hosted in Azure Container Apps, and the database is hosted in Azure Database for PostgreSQL. They'll connect to each other via the endpoints built in the Strapi server implementation.

Both of these applications are hosted in [Azure Container Apps](/azure/container-apps/overview).

Packages:

* [Blog package source code](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/blog)
* [Blob CMS package source code](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/blog-cms)

## Package: The portal with Static Web Apps and Azure Functions API

This frontend application is the main entry point for the users implementing Angular as a JavaScript framework. 

:::image type="content" source="./media/contoso-real-estate-developer-solutions/scenario-2-portal-swa-fn-api.png" alt-text="Architectural diagram of the portal client and API scenario.":::

This service is deployed to [Azure Static Web Apps](/azure/static-web-apps/authentication-authorization), including capabilities like 
  - Authentication and Authorization with Easy Auth

The API backend is deployed to [Azure Functions](/azure/azure-functions/), which is a serverless compute service that allows you to run code on-demand without having to explicitly manage infrastructure.

The database for content, integrated to the serverless API backend, is an [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/) populated from a headless CMS implementation in Scenario 1.

A database for user events and user profiles, integrated into the serverless API backend is an [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/), which is a fully managed NoSQL database service that offers multiple APIs, including the MongoDB API. 

Packages:

* [Portal package source code](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/portal)
* [Portal API package source code](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/api)

## User authentication with built-in functionality

User authentication is provided as built-in functionality in the portal's [Azure Static web app](/azure/static-web-apps/). The typical flow of [sign in](/azure/static-web-apps/authentication-authorization), redirecting a user to an authorization provider to complete authentication, then redirecting the authenticated user back to the application, is offered with several social media providers.

:::image type="content" source="./media/contoso-real-estate-developer-solutions/scenario-3-user-authentication-swa-cosmo-db-mongodb.png" alt-text="Architectural diagram of the user authentication in the portal application.":::

Once a user is logged in, their user information is stored in [Cosmos DB for MongoDB API](/azure/cosmos-db/mongodb/choose-model) such as favorited-properties, and property reservations. 

## Package: Payments with Stripe

This package supports the checkout process, in the portal, to pay for a property reservation. The payment flow is implemented with [Stripe](https://stripe.com/), a payment processing platform that allows you to accept payments online.
This package containerizes the payment processing functionality in a [Fastify](https://fastify.dev/) application deployed to [Azure Container Apps](/azure/container-apps/overview)

:::image type="content" source="./media/contoso-real-estate-developer-solutions/scenario-4-payment-string-api-management.png" alt-text="Architectural diagram of the payments service to the Stripe payment provider.":::

When Azure API Management receives a request for the webhook endpoint URL from Stripe, it forwards the request to the Fastify API. The API handles the incoming webhook event and performs the payment actions such as checkout, checkout completed, checkout expired. 

[Stripe package source code](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/stripe)

## Package: Testing with Playwright

This package provides the end to end testing for Contoso real estate. It uses [Playwright](https://playwright.dev/) to automate the browser and test the user experience of the application. 

[Testing package source code](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/testing)

## Package: Docs

This package provides extensive documentation for the Contoso real estate reference architecture. It's built with [Docusaurus](https://docusaurus.io/), a modern static website generator. 

[Documentation package source code](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/docs)

## Next step

> [!div class="nextstepaction"]
> [Learn how to develop modern cloud solutions](contoso-real-estate-developer-tools.md)

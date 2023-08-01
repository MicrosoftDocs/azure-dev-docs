---
title: Getting started with JavaScript Enterprise applications
description: Enterprise-grade Reference Architecture for JavaScript including source code, deployment infrastructure, end to end testing.
ms.topic: overview
ms.date: 05/23/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
# CustomerIntent: As a Senior JavaScript Developer new to Azure, I want learn how to build and deploy complex architectures so that build and deploy my own architecture.
---

# Get started with Contoso real estate enterprise app

The Contoso real estate enterprise app allows employees of the Contoso company to search for a reserve relocation housing through a web app. This web app is an internal tool used by Contoso HR and new hire or relocating employees. Both authenticated Talent Managers, and new hires can interact with the application features, while nonauthenticated users can access some parts of it.

## Prerequisites

To deploy this entire app solution to Azure, you need:

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
* A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  
* A Strapi account for headless CMS
* A Stripe account for payments

## Application architecture

The Contoso real estate app has two client applications, the **portal** and the blog. The **blog** publicizes new real estate offerings and if visible without authentication. The portal app requires authentication to view, reserve, and pay for listings. Separate development teams have built and support this end-to-end architecture with their own choice of technical stack. 

Client apps:

* The **blog** and its API are hosted from [Azure Container Apps](/azure/container-apps). The blog content is served from a headless [Strapi](https://strapi.io/) CMS with data stored in [Azure Database for PostrgreSQL](/azure/postgresql). The CMS also stores the real estate listings. Property images for listings are stored in Azure Blob Storage.
* The **portal** is hosted in an [Azure Static Web](/azure/static-web-apps) app with API support from an [Azure Functions App](/azure/azure-functions). 

:::image type="content" source="./media/contoso-real-estate/e2e-full-horizontal-architecture.png" lightbox="./media/contoso-real-estate/e2e-full-horizontal-architecture.png" alt-text="Diagram showing cloud architecture of Contoso real estate with Hero services on the left and the complete interaction of the services on the right.":::

Other Azure services used include: 

* [Azure Key Vault](/azure/key-vault) to store keys, secrets, and certificates
* [Azure Cosmos DB](/azure/cosmos-db) to store user data
* [Azure API Management](/azure/api-management) to provide API to protect, accelerate, and observe APIs

## Packages

This application is divided into several packages. Each package describes a scenario of what is in the package and step-by-step instructions to help you build and deploy the package to Azure. 

|Package|technology stack|
|--|--|
|[Blog](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/blog), [Blob-CMS](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/blog-cms)|Next.js app with a Strapi CMS, both hosted in an Azure Container app.|
|[Portal](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/portal), [API](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/api)|Angular web portal hosted from Static Web Apps with Azure Functions API app for the backend.|
|[Stripe](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/stripe)|Fastify API Payment service API in an Azure Container app.|
|[Testing](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/testing)|E2E testing with Playwright.|
|[Docs](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/docs)|Learn more about this E2E solution.|

## Next step

> [!div class="nextstepaction"]
> [Understand the solution with User Scenarios](contoso-real-estate-user-scenarios.md)

---
title: Getting started with E2E Contoso real estate
description: Enterprise-grade reference Architecture for JavaScript with Contoso real estate, including source code, deployment infrastructure, end to end testing.
ms.topic: get-started
ms.date: 05/23/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
# CustomerIntent: As a Senior JavaScript Developer new to Azure, I want learn how to build and deploy complex architectures so that build and deploy my own architecture.
---

# Get started with Contoso real estate enterprise app

The Contoso real estate application is an example end to end architecture, along with full source code solution and deployment infrastructure. It is provided for JavaScript developers who need to learn how to design, develop, deploy, and devops (4Dx) to Azure. 

## The Contoso real estate app

The Contoso real estate enterprise app allows employees of the Contoso company to search for a reserve relocation housing through a web app. This web app is an internal tool used by Contoso HR and new hire or relocating employees. Both authenticated Talent Managers, and new hires can interact with the application features, while nonauthenticated users can access some parts of it.

## Prerequisites

To deploy this entire app solution to Azure, you need:

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
* A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  
* A Strapi account for headless CMS
* A Stripe account for payments

## Application architecture

The Contoso real estate app has two client applications, the **portal** and the blog. The **blog** publicizes new real estate offerings and if visible without authentication. The portal app requires authentication to view, reserve, and pay for listings. Separate development teams have built and support this end-to-end architecture with their own choice of technical stack. 

**Micro frontend client**:

* The **blog** and its API are hosted from [Azure Container Apps](/azure/container-apps). The blog content is served from a headless [Strapi](https://strapi.io/) CMS with data stored in [Azure Database for PostrgreSQL](/azure/postgresql). The CMS also stores the real estate listings. Property images for listings are stored in [Azure Blob Storage](/azure/storage/blobs/).

    :::image type="content" source="./media/contoso-real-estate/browser-blog-landing.png" lightbox="./media/contoso-real-estate/browser-blog-landing.png" alt-text="Screenshot of Contoso blog featuring information about technology, news, gastronomy, releases, and locations relevant to users of the HR relocation portal.":::


* The **portal** is hosted in an [Azure Static Web](/azure/static-web-apps) app with API support from an [Azure Functions App](/azure/azure-functions). It also uses the listings held in the [Azure Database for PostrgreSQL](/azure/postgresql). The portal provides authentication through social providers such as Microsoft, Google, and Facebook.

    :::image type="content" source="./media/contoso-real-estate/browser-portal-landing.png" lightbox="./media/contoso-real-estate/browser-blog-landing.png" alt-text="Screenshot of Contoso portal featuring several property listings with images, descriptions, and prices.":::

    Once a user signs in, and selects a property, they can choose to reserve the property then pay for it with a Stripe integration. 

    :::image type="content" source="./media/contoso-real-estate/browser-portal-reserve-property.png" lightbox="./media/contoso-real-estate/browser-portal-reserve-property.png" alt-text="Screenshot of Contoso portal property page showing property images, details, and offering a user the ability to reserve the property with a payment form.":::

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

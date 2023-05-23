---
title: Composable Cloud
description: Enterprise-grade Reference Architecture for JavaScript including a collection of best practices, architecture patterns, and functional components that can be used to build and deploy modern JavaScript applications to Azure.
ms.topic: how-to
ms.date: 05/23/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
---

# Enterprise-grade reference for composable architecture

This reference architecture contains the components for building enterprise-grade modern composable frontends (or micro-frontends) and cloud-native applications. It's a collection of best practices, architecture patterns, and functional components that can be used to build and deploy modern JavaScript applications to Azure.

## What is Contoso?

Contoso Corporation is a fictional but representative global manufacturing conglomerate with its headquarters in Paris. The company deployed Microsoft 365 for enterprise with to accelerate its digital transformation by using cloud services to bring together its employees, partners, data, and processes to create customer value and maintain its competitive advantage in a digital-first world.

Contoso is expanding to new regions and countries, which results in massive hiring. They offer relocation and have designed an application, to help HR and new hires find the right housing. This web app is an internal tool used by Contoso HR and new hire or relocating employees.

Both authenticated Talent Managers, and new hires can interact with the application features, while nonauthenticated users can access some parts of it.

## Enterprise developer experience

The developer experience for the HR app is: 

1. **Define** priority scenarios: What are the core application scenarios?
2. **Design** reference architecture: with Cloud-native and Azure.
3. **Develop** reference implementation: Project structure, code patterns, and best practices.
4. **Deploy** Code-to-Cloud: Simplified developer experience for build-to-deploy.
5. **Document** content resources: Training modules, documentation, and GitHub sample.

## Composable cloud native HR app

The architect designs a cloud native solution for the developer.

:::image type="content" source="./media/contoso-real-estate/contoso-real-estate-application-sketchnote-small.png" lightbox="./media/contoso-real-estate/contoso-real-estate-application-sketchnote-small.png" alt-text="Diagram showing architect explaining composable cloud native to developer for JavaScript enterprise end-to-end application development and deployment. ":::

To see more detail, select the preceding image to zoom in, or browse to the [high resolution image](./media/contoso-real-estate/contoso-real-estate-application-sketchnote.png).

## Simplified flow

The HR app is built as:

* UI for portal and blog front ends as vertical micro frontend splits - denoted as 1 and 2 in the diagram.
* API layer to communicate between client and cloud.
* Microservices for cloud integrations.

:::image type="content" source="./media/contoso-real-estate/azure-architecture-contoso-rentals-with-numbering.png" alt-text="Diagram showing the Architecture of building an end to end solution for Contoso Real Estate on Azure.":::

|#|Name|Description|
|:--|:--|--|
|1|**Blog** (UI)|Powered by Next.js front-end and Strapi back-end, both hosted from single Azure Container App. Azure Container App also hosted Stripe payment gateway integration.|
|2|**Main portal** (UI)|The Angular front-end deployed to the Azure cloud via Static Web Apps.|
|3|**APIs**|The API layer is build with Azure API Management to manage authorization, rate limiting, and caching.|
|4|**Storage** (Backend)|The storage layer for blobs and data is built with several Azure services. PostgreSQL is used for read-only and searchable data, Azure Cosmos DB for MongoDB is used for read/write data. Azure Blob Storage is used for storing images and other artifacts.|
|5|**Microservices** (Backend)| The microservices layer is built with Azure Functions and Node.js with Fastify, and the payment service is containerized and deployed to Azure Container Apps|
|6|**Payments**|The payments layer is built with Stripe.|

## Composable reference architecture

|#|Name|Description|
|:--|:--|--|
|1|**Local development** (Developer)|Using GitHub CodeSpaces either in the browser or locally with Visual Studio Code, the developer uses the typical tools and workflow to add new features, or fix issues. This development includes the all layers including the deployment infrastructure and deployment pipeline.|
|2|**Workloads** (DevOps)|When the developer pushes to the source control repository on GitHub, GitHub Action workflows provide testing automation, and deployment. Deploy packages to Azure using Azure Developer CLI, allowing you to manage resource creation with simple commands such as `azd deploy`|
|3|**Azure**|The composable web app is deployed with all Azure services configured to integrate with other services.|
|4|**Services**|The primary services used in this architecture are Azure Container Apps, Azure Static Web Apps, Azure Cosmos DB, Azure Cache for Redis, and Azure Functions.|

## Resources

* [Announcement](https://aka.ms/contoso-real-estate/announcement)
* [Source code](https://aka.ms/contoso-real-estate-github)
* [Learn Collection](https://aka.ms/javascript-e2e-serverless-learn-collection)

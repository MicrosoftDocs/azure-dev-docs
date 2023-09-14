---
title: "Contoso Real Estate serverless APIs"
description: In this tutorial, developer serverless APIs for Contoso Real Estate using npm workspaces, Azure Functions, OpenAPI and TypeScript.
ms.topic: tutorial
ms.date: 08/31/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
# CustomerIntent: As a senior developer new to Azure, I want to develop a API layer with modern tools so that I can build scalable and efficient APIs that can handle high traffic loads and integrate with other Azure services seamlessly.
---

# Contoso Real Estate serverless APIs 

The Contoso Real Estate API is a serverless API layer for the enterprise application. The APIs provide access to the headless CMS which stores data in Azure Blob Storage and Azure . 

* Cosmos DB
* Strapi CMS
* Application Insights
* Key Vault
    * CosmosDB connection string - mongodb
    * CMS database password - 



## API layer

## Monorepo design


## API design

The Contoso Real Estate API is designed with TypeSpec to generate an OpenAPI specification. 

## API development

The OpenAPI specification is used to develop the API with Azure Functions and TypeScript.

## Infrastructure development

* azd auth login
* azd provision creates resources and restores database
* azd deploy deploys source code to Azure Functions

## Resource provisioning

The API is contained within an npm workspace and deployed with Azure Developer CLI.

## Source code deployment

* ENABLE_ORYX_BUILD
* SCM_DO_BUILD_DURING_DEPLOYMENT

## API operations

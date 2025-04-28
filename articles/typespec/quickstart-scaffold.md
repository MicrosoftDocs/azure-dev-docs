---
title: Create a new API project using TypeSpec and TypeScript
description: Learn how to generate and set up a new RESTful API project using TypeSpec to scaffold consistent client and server code for cloud services.
ms.topic: quickstart
ms.date: 02/12/2025
ms.custom: devx-track-typespec, devx-track-ts, devx-track-
zone_pivot_groups: typespec-quickstart-on-azure-languages
zone_pivot_group_filename: developer/typespec/zone-pivot-groups.json
#customer intent: As a developer or API designer, I want to create an TypeSpec API and deploy it to Azure so that I can learn the entire end to end development and deployment cycle.
---

# Create a new API project with TypeSpec

This tutorial demonstrates how to use TypeSpec to design and implement a RESTful JavaScript API application. TypeSpec is an open-source language for describing cloud service APIs and generates client and server code for multiple platforms. By following this tutorial, you'll learn how to define your API contract once and generate consistent implementations, helping you build more maintainable and well-documented API services.

In this tutorial, you:

> [!div class="checklist"]
> * Define your API using TypeSpec
> * Create a TypeScript API server application
> * Integrate Azure Cosmos DB for persistent storage
> * Run and test your API locally
> * Deploy to Azure

## Prerequisites

::: zone pivot="csharp"


::: zone-end

::: zone pivot="typescript"

[!INCLUDE [ts-prereq](includes/quickstart/prereqs-typescript.md)]

::: zone-end

## Application structure with TypeSpec

TypeSpec defines your API in a language-agnostic way and generates the server and client code for multiple platforms. This allows you to:

* Define your API contract once
* Generate consistent server and client code
* Focus on implementing business logic rather than API infrastructure

**What TypeSpec provides (auto-generated)**:

* OpenAPI definitions for your API
* Server-side middleware and routing code
* Client SDKs for consuming your API
* Type definitions for requests and responses

**What you're responsible for:**

* Implementing service interfaces with business logic
* Integrating with data stores (like Azure Cosmos DB)
* Integrating with build and deployment processes
* Hosting your API (locally or in Azure)

## Application file structure

::: zone pivot="csharp"

::: zone-end

::: zone pivot="typescript"

::: zone-end

## Install TypeSpec

::: zone pivot="csharp"

::: zone-end

::: zone pivot="typescript"

::: zone-end

## Create a new TypeSpec application

::: zone pivot="csharp"

::: zone-end

::: zone pivot="typescript"

::: zone-end

## Configure TypeSpec compilation



## Generate a TypeSpec API server

::: zone pivot="csharp"

::: zone-end

::: zone pivot="typescript"

::: zone-end

## Compile a TypeSpec API server

::: zone pivot="csharp"

::: zone-end

::: zone pivot="typescript"

::: zone-end

## Run a TypeSpec API server locally

::: zone pivot="csharp"

::: zone-end

::: zone pivot="typescript"

::: zone-end

## Deploy application to Azure

You can deploy this application to Azure using Azure Container Apps:

1. Create an Azure Container Registry
2. Build and push your Docker image
3. Deploy to Azure Container Apps using the Azure Developer CLI:

  ```bash
  azd up
  ```

## Use application in browser

Once deployed, you can:

1. Access the Swagger UI to test your API
2. Create, read, update, and delete widgets through the API
3. Use the generated client SDK in another application to consume your API

## Clean up resources

When you're done with this tutorial, you can clean up the Azure resources:

```bash
azd down
```

Or delete the resource group directly from the Azure portal.

## Related articles

- [TypeSpec documentation](https://microsoft.github.io/typespec/)
- [Azure Cosmos DB documentation](/azure/cosmos-db/)
- [Deploy Node.js apps to Azure](/azure/app-service/quickstart-nodejs)
- [Azure Container Apps documentation](/azure/container-apps/)
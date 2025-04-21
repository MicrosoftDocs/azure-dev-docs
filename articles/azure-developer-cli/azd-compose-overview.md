---
title: Azure Developer CLI compose feature overview
description: Learn about the Azure Developer CLI compose feature
author: alexwolfmsft
ms.author: alexwolf
ms.date: 04/21/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep
---

# Get started with the Azure Developer CLI compose feature

The Azure Developer CLI (`azd`) composability (compose) feature enables you to progressively compose the Azure resources required for your app without manually writing Bicep code. Compose also uses [Azure Verified Modules (AVM)](https://aka.ms/avm) when possible, providing recommended practices using building blocks for Azure that are secure by design.

> [!NOTE]
> The `azd` compose feature is currently in alpha and should not be used in production apps. Changes to Alpha features in subsequent releases may result in breaking changes. Visit the [azd feature versioning and release strategy](/azure/developer/azure-developer-cli/feature-versioning) and [feature stages](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/feature-stages.md) pages for more information. Select the **Feedback** button on the upper right to leave feedback about the `compose` feature and this article.

## Enable the compose feature

The `azd` compose feature is currently in alpha, which means you need to enable it manually. Visit the [azd feature stages](https://aka.ms/azd-feature-stages) page for more information.

```bash
azd config set alpha.compose on
```

## What is the compose feature?

The Azure Developer CLI (azd) composability feature offers a new way to get started with azd. Before the compose feature, developers had two primary options to configure the Azure resources to provision and deploy an application.

- Start with a [prebuilt template](/azure/developer/azure-developer-cli/azd-templates), which defines resources and services that should be provisioned and deployed on Azure and then customize. Browse templates in the [AI template gallery](https://azure.github.io/ai-app-templates) or the [community gallery](https://azure.github.io/awesome-azd/)

- Start from an existing codebase following the instructions of [simplified init flow](/azure/developer/azure-developer-cli/start-with-app-code).

Any further customization required the user to modify the bicep files.

The `azd` compose feature introduces a third option to add Azure resources to your apps. Developers use the `azd add` command to instruct `azd` to compose new Azure resources and update template configurations using simple prompt workflows. This feature is particularly useful for developers who want to avoid writing Bicep or using an existing template.

The `azd compose` feature supports adding resources for the following Azure Services:

- Azure AI Services models and Azure AI Foundry
- Azure Container Apps
- Azure Cosmos DB
- Azure Cosmos DB for MongoDB
- Azure Cosmos DB for PostgreSQL
- Azure Cache for Redis
- Azure Database for MySQL
- Azure Key Vault
- Azure OpenAI with Microsoft Entra ID authentication
- Azure Service Bus and Azure Event Hubs
- Azure Blob Storage

## Next steps

> [!div class="nextstepaction"]
> [Compose quickstart](/azure/developer/azure-developer-cli/azd-compose-quickstart)

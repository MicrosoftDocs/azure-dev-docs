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

The Azure Developer CLI (`azd`) composability (compose) feature enables you to progressively compose the Azure resources required for your app without manually writing Bicep code. Compose also uses [Azure Verified Modules (AVM)](https://aka.ms/avm) when possible, providing recommended practices using building blocks for Azure.

> [!NOTE]
> The `azd` compose feature is currently in alpha and shouldn't be used in production apps. Changes to alpha features in subsequent releases can result in breaking changes. Visit the [azd feature versioning and release strategy](/azure/developer/azure-developer-cli/feature-versioning) and [feature stages](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/feature-stages.md) pages for more information. Use the **Feedback** button on the upper right to share feedback about the `compose` feature and this article.

## Enable the compose feature

The `azd` compose feature is currently in alpha, which means you need to enable it manually. Visit the [azd feature stages](https://aka.ms/azd-feature-stages) page for more information.

```bash
azd config set alpha.compose on
```

## What is the compose feature?

The `azd` compose feature offers a new way to get started with `azd`. Before the compose feature, developers had two primary options to configure the Azure resources to provision and deploy an application:

- Start with a [prebuilt template](/azure/developer/azure-developer-cli/azd-templates), which defines resources and services to be provisioned and deployed on Azure, and then customize. Browse templates in the [AI template gallery](https://azure.github.io/ai-app-templates) or the [community gallery](https://azure.github.io/awesome-azd/).
- Start from an existing codebase by following the instructions in the [simplified init flow](/azure/developer/azure-developer-cli/start-with-app-code).

Any further customization required the user to manually modify the Bicep files—until the introduction of the compose feature.

### Streamline resource creation with compose

The `azd` compose feature introduces a third option to add Azure resources to your apps. Developers use the `azd add` command to instruct `azd` to compose new Azure resources and update template configurations using minimal prompt workflows. This feature is useful for developers who want to avoid writing Bicep or using an existing template.

Run the `azd add` command to start the compose workflow and add a new resource:

```bash
azd add
```

This command begins a prompt-based workflow that allows you to select a new resource to create for your app:

```output
? What would you like to add?  [Use arrows to move, type to filter]
> AI
  Database
  Host service
  Key Vault
  Messaging
  Storage account
  ~Existing resource
```

When you're finished adding resources with `azd add`, run `azd up` or `azd provision` to create the resources in Azure. `azd` manages resource creation internally until you [Generate Bicep files for the resources](compose-generate.md) for further customization.

Visit the [Build a minimal template using the compose feature](compose-quickstart.md) article for a full walkthrough of this feature.

### Services supported by the compose feature

The `azd compose` feature supports adding resources for the following Azure services:

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
> [Compose quickstart](compose-quickstart.md)

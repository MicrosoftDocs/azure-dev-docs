---
ms.service: azure
ms.topic: include
ms.date: 04/02/2026
author: bmitchell287
ms.author: brendm
---

## Authenticate to Azure services from your app

The [Azure Identity library](/java/api/com.azure.identity) provides various *credentials*&mdash;implementations of [`TokenCredential`](/java/api/com.azure.core.credential.tokencredential) adapted to supporting different scenarios and Microsoft Entra authentication flows. Since managed identity is unavailable when running locally, the steps ahead demonstrate which credential to use in which scenario:

- **Local dev environment**: During **local development only**, use a class called [DefaultAzureCredential](../credential-chains.md#defaultazurecredential-overview) for an opinionated, preconfigured chain of credentials. `DefaultAzureCredential` discovers user credentials from your local tooling or IDE, such as the Azure CLI or Visual Studio Code. It also provides flexibility and convenience for retries, wait times for responses, and support for multiple authentication options. Visit the [Authenticate to Azure services during local development](../local-development-dev-accounts.md) article to learn more.
- **Azure-hosted apps**: When your app is running in Azure, use [`ManagedIdentityCredential`](/java/api/com.azure.identity.managedidentitycredential) to safely discover the managed identity configured for your app. Specifying this exact type of credential prevents other available credentials from being picked up unexpectedly.

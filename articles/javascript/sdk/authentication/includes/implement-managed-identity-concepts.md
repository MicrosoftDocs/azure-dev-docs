---
ms.topic: include
ms.date: 02/12/2025
---

## Authenticate to Azure services from your app

The [Azure Identity library](/javascript/api/%40azure/identity/) provides various *credentials* - implementations of [`TokenCredential`](/javascript/api/@azure/core-auth/tokencredential) adapted to supporting different scenarios and Microsoft Entra authentication flows. Since managed identity is unavailable when running locally, the steps ahead demonstrate which credential to use in which scenario:

- **Local dev environment**: During **local development only**, use a class called [DefaultAzureCredential](../credential-chains.md#use-defaultazurecredential-for-flexibility) for an opinionated, preconfigured chain of credentials. The [`DefaultAzureCredential`](/javascript/api/@azure/identity/defaultazurecredential) class discovers user credentials from your local tooling or IDE, such as the Azure CLI or Visual Studio. It also provides flexibility and convenience for retries, wait times for responses, and support for multiple authentication options. Visit the [Authenticate to Azure services during local development](../local-development-environment-developer-account.md) article to learn more.
- **Azure-hosted apps**: When your app is running in Azure, use [`ManagedIdentityCredential`](/javascript/api/@azure/identity/managedidentitycredential) to safely discover the managed identity configured for your app. Specifying this exact type of credential prevents other available credentials from being picked up unexpectedly.
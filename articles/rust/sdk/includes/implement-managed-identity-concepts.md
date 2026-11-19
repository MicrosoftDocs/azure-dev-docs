---
ms.topic: include
ms.date: 02/20/2026
---

## Authenticate to Azure services from your app

The [azure_identity](https://crates.io/crates/azure_identity) crate provides
various *credentials* — implementations of `TokenCredential` that support
different scenarios and Microsoft Entra authentication flows. Since managed
identity isn't available when you run locally, the following guidance explains
which credential to use in each scenario:

- **Local dev environment**: During **local development only**, use
  [`DeveloperToolsCredential`](https://docs.rs/azure_identity/latest/azure_identity/struct.DeveloperToolsCredential.html)
  for a simplified chain of developer tool credentials.
  `DeveloperToolsCredential` tries to authenticate by using developer tools
  such as the Azure CLI, and stops when one succeeds. To learn more, see
  [Authenticate to Azure services during local development](../authentication/local-development-dev-accounts.md).
- **Azure-hosted apps**: When your app is running in Azure, use
  [`ManagedIdentityCredential`](https://docs.rs/azure_identity/latest/azure_identity/struct.ManagedIdentityCredential.html).

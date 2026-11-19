---
title: Additional methods to authenticate to Azure resources from Rust apps
description: Learn about additional, less common methods you can use to authenticate your Rust app to Azure resources using the Azure SDK for Rust.
ms.date: 02/20/2026
ms.topic: how-to
ms.custom: devx-track-rust
ms.service: azure-rust
---

# Additional methods to authenticate to Azure resources from Rust apps

This article lists additional methods that apps can use to authenticate to Azure resources. These methods are less commonly used. When possible, use one of the methods outlined in the [authenticating Rust apps to Azure using the Azure SDK overview](./overview.md).

## Client certificate authentication

[`ClientCertificateCredential`](https://docs.rs/azure_identity/latest/azure_identity/struct.ClientCertificateCredential.html) authenticates a service principal by using a certificate instead of a client secret. This method is more secure than client secrets because you can manage and rotate certificates more easily.

> [!NOTE]
> `ClientCertificateCredential` requires the `client_certificate` feature flag. Add it to your `Cargo.toml`:
>
> ```toml
> [dependencies]
> azure_identity = { version = "0.32", features = ["client_certificate"] }
> ```

### Example using ClientCertificateCredential

:::code language="rust" source="../../snippets/authentication/examples/additional_methods_cert.rs":::

## Workload identity authentication

[`WorkloadIdentityCredential`](https://docs.rs/azure_identity/latest/azure_identity/struct.WorkloadIdentityCredential.html) supports [Microsoft Entra Workload Identity on Kubernetes](/azure/aks/workload-identity-overview). This credential authenticates pods in Azure Kubernetes Service (AKS) clusters configured with workload identity.

When you configure it, the AKS cluster provides the necessary environment variables (`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_FEDERATED_TOKEN_FILE`) that the credential uses automatically.

:::code language="rust" source="../../snippets/authentication/examples/additional_methods_workload.rs":::

For more information, see [Use Microsoft Entra Workload Identity with AKS](/azure/aks/workload-identity-overview).

## Azure Pipelines authentication

[`AzurePipelinesCredential`](https://docs.rs/azure_identity/latest/azure_identity/struct.AzurePipelinesCredential.html) authenticates an [Azure Pipelines service connection](/azure/devops/pipelines/library/service-endpoints). Use this credential in Azure DevOps pipeline tasks that need to access Azure resources.

:::code language="rust" source="../../snippets/authentication/examples/additional_methods_pipelines.rs":::

## Client assertion authentication (federated identity)

[`ClientAssertionCredential`](https://docs.rs/azure_identity/latest/azure_identity/struct.ClientAssertionCredential.html) authenticates a service principal with a client assertion, which is useful for [federated identity credential](/entra/workload-id/workload-identity-federation) scenarios. For example, you can configure an application to trust tokens from a managed identity:

:::code language="rust" source="../../snippets/authentication/examples/additional_methods_assertion.rs":::

For more information, see [Configure an application to trust a managed identity](/entra/workload-id/workload-identity-federation-config-app-trust-managed-identity).

---
title: Authenticate Azure-hosted Java applications
titleSuffix: Azure SDK for Java
description: Provides an overview of the Azure SDK for Java concepts related to authenticating applications hosted within Azure.
ms.date: 10/15/2024
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: vigera
---

# Authenticate Azure-hosted Java applications

This article looks at how the Azure Identity library supports Microsoft Entra token authentication for applications hosted on Azure. This support is made possible through a set of `TokenCredential` implementations, which are discussed in this article.

This article covers the following subjects:

* [DefaultAzureCredential](#defaultazurecredential)
* [ManagedIdentityCredential](#managedidentitycredential)

For troubleshooting authentication issues related to Azure-hosted applications, see [Troubleshoot Azure-hosted application authentication](../troubleshooting-authentication-azure-hosted.md).

## DefaultAzureCredential

`DefaultAzureCredential` combines credentials that are commonly used to authenticate when deployed, with credentials that are used to authenticate in a development environment. For more information, see [DefaultAzureCredential overview](credential-chains.md#defaultazurecredential-overview).

### Configure DefaultAzureCredential

`DefaultAzureCredential` supports a set of configurations through setters on the `DefaultAzureCredentialBuilder` or environment variables.

* Setting the environment variables `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` as defined in [Environment variables](#environment-variables) configures `DefaultAzureCredential` to authenticate as the service principal specified by the values.
* Setting `.managedIdentityClientId(String)` on the builder or the environment variable `AZURE_CLIENT_ID` configures `DefaultAzureCredential` to authenticate as a user-assigned managed identity, while leaving them empty configures it to authenticate as a system-assigned managed identity.
* Setting `.tenantId(String)` on the builder or the environment variable `AZURE_TENANT_ID` configures `DefaultAzureCredential` to authenticate to a specific tenant for either the shared token cache or IntelliJ IDEA.
* Setting the environment variable `AZURE_USERNAME` configures `DefaultAzureCredential` to pick the corresponding cached token from the shared token cache.

### Authenticate with DefaultAzureCredential

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using `DefaultAzureCredential`:

```java
// Azure SDK client builders accept the credential as a parameter.
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://<KEY_VAULT_NAME>.vault.azure.net")
  .credential(new DefaultAzureCredentialBuilder().build())
  .buildClient();
```

### Authenticate a user-assigned managed identity with DefaultAzureCredential

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using `DefaultAzureCredential` deployed to an Azure resource with a user-assigned managed identity configured.

```java
/**
 * DefaultAzureCredential uses the user-assigned managed identity with the specified client ID.
 */
DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
  .managedIdentityClientId("<CLIENT_ID>")
  .build();

// Azure SDK client builders accept the credential as a parameter.
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://<KEY_VAULT_NAME>.vault.azure.net")
  .credential(credential)
  .buildClient();
```

## ManagedIdentityCredential

[ManagedIdentityCredential](/java/api/com.azure.identity.managedidentitycredential?view=azure-java-stable&preserve-view=true) authenticates the managed identity (system-assigned or user-assigned) of an Azure resource. So, if the application is running inside an Azure resource that supports managed identity through `IDENTITY/MSI`, `IMDS` endpoints, or both, then this credential gets your application authenticated, and offers a secretless authentication experience.

For more information, see [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview).

### Authenticate in Azure with managed identity

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `ManagedIdentityCredential` in a Virtual Machine, App Service, Functions app, Cloud Shell, Service Fabric, Arc, or AKS environment on Azure, with system-assigned or user-assigned managed identity enabled.

```java
/**
 * Authenticate with a user-assigned managed identity.
 */
ManagedIdentityCredential credential = new ManagedIdentityCredentialBuilder()
  .clientId("<CLIENT_ID>") // required only for user-assigned
  .build();

// Azure SDK client builders accept the credential as a parameter.
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://<KEY_VAULT_NAME>.vault.azure.net")
  .credential(credential)
  .buildClient();
```

## Environment variables

You can configure `DefaultAzureCredential` and `EnvironmentCredential` with environment variables. Each type of authentication requires values for specific variables:

### Service principal with secret

| Variable name         | Value                                           |
|-----------------------|-------------------------------------------------|
| `AZURE_CLIENT_ID`     | ID of a Microsoft Entra application.            |
| `AZURE_TENANT_ID`     | ID of the application's Microsoft Entra tenant. |
| `AZURE_CLIENT_SECRET` | One of the application's client secrets.        |

### Service principal with certificate

| Variable name                   | Value                                                                                       |
|---------------------------------|---------------------------------------------------------------------------------------------|
| `AZURE_CLIENT_ID`               | ID of a Microsoft Entra application.                                                        |
| `AZURE_TENANT_ID`               | ID of the application's Microsoft Entra tenant.                                             |
| `AZURE_CLIENT_CERTIFICATE_PATH` | Path to a PEM-encoded certificate file including private key (without password protection). |
| `AZURE_CLIENT_CERTIFICATE_PASSWORD` | (optional) Password of the certificate file, if any. |
| `AZURE_CLIENT_SEND_CERTIFICATE_CHAIN` | (optional) Send certificate chain in x5c header to support subject name / issuer-based authentication. |

### Username and password

| Variable name     | Value                                           |
|-------------------|-------------------------------------------------|
| `AZURE_CLIENT_ID` | ID of a Microsoft Entra application.            |
| `AZURE_TENANT_ID` | ID of the application's Microsoft Entra tenant. |
| `AZURE_USERNAME`  | A username (usually an email address).          |
| `AZURE_PASSWORD`  | The associated password for the given username. |

Configuration is attempted in this order. For example, if values for a client secret and certificate are both present, the client secret is used.

## Next steps

This article covered authentication for applications hosted in Azure. This form of authentication is one of multiple ways you can authenticate in the Azure SDK for Java. The following articles describe other ways:

* [Azure authentication in development environments](dev-env.md)
* [Authentication with service principals](service-principal.md)
* [Authentication with user credentials](user.md)

If you run into issues related to Azure-hosted application authentication, see [Troubleshoot Azure-hosted application authentication](../troubleshooting-authentication-azure-hosted.md).

After you've mastered authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

<!-- LINKS -->
[secrets_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets

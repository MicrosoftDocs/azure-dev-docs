---
title: Authenticate Azure-hosted Java apps by using a system-assigned managed identity
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Azure-hosted Java apps to Azure resources by using a system-assigned managed identity.
ms.date: 02/05/2026
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-generated
---

# Authenticate Azure-hosted Java apps to Azure resources by using a system-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). Most Azure services support this approach, including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. For more information, see [Azure services and resource types supporting managed identities](/entra/identity/managed-identities-azure-resources/managed-identities-status). For more information about different authentication techniques and approaches, see [Authenticate Java apps to Azure services by using the Azure Identity library](overview.md).

In the following sections, you learn:

- Essential managed identity concepts.
- How to create a system-assigned managed identity for your app.
- How to assign roles to the system-assigned managed identity.
- How to authenticate by using the system-assigned managed identity from your app code.

[!INCLUDE [managed-identity-concepts](../../../includes/authentication/managed-identity-concepts.md)]

The following sections describe the steps to enable and use a system-assigned managed identity for an Azure-hosted app. If you need to use a user-assigned managed identity, see [Authenticate Azure-hosted Java apps to Azure resources by using a user-assigned managed identity](user-assigned-managed-identity.md).

[!INCLUDE [Language agnostic system assigned procedures](../../../includes/authentication/system-assigned-managed-identity.md)]

## Authenticate to Azure services from your app

The [Azure Identity library](/java/api/com.azure.identity) provides various credentials as implementations of `TokenCredential`. Each implementation supports different scenarios and Microsoft Entra authentication flows. For Azure-hosted apps, use `DefaultAzureCredential`, which automatically discovers managed identity credentials when running in Azure.

### Implement the code

Add the `azure-identity` dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

You access Azure services by using specialized client classes from the Azure SDK client libraries. The following code examples show you how to configure the credential for system-assigned managed identity authentication.

#### Use DefaultAzureCredential

Use `DefaultAzureCredential` for Azure-hosted apps because it automatically discovers managed identity credentials when running in Azure. For system-assigned managed identities, no extra configuration is required.

```java
import com.azure.identity.DefaultAzureCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// DefaultAzureCredential automatically discovers managed identity when running in Azure
DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

#### Use ManagedIdentityCredential

If you want to explicitly use the managed identity credential and avoid the credential chain lookup in `DefaultAzureCredential`, use `ManagedIdentityCredential` directly. For system-assigned managed identities, don't specify a client ID:

```java
import com.azure.identity.ManagedIdentityCredential;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// For system-assigned managed identity, don't specify a client ID
ManagedIdentityCredential credential = new ManagedIdentityCredentialBuilder().build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

## Next steps

This article covered authentication using a system-assigned managed identity. This form of authentication is one of multiple ways you can authenticate in the Azure SDK for Java. The following articles describe other ways:

- [Authenticate Azure-hosted Java apps to Azure resources by using a user-assigned managed identity](user-assigned-managed-identity.md)
- [Authenticate Java apps to Azure services during local development by using developer accounts](local-development-dev-accounts.md)
- [Authenticate Java apps to Azure services during local development by using service principals](local-development-service-principal.md)

If you run into issues related to Azure-hosted application authentication, see [Troubleshoot Azure-hosted application authentication](../troubleshooting-authentication-azure-hosted.md).

After you master authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

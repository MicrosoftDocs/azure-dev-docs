---
title: Authenticate Azure-hosted Java apps by using a system-assigned managed identity
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Azure-hosted Java apps to Azure resources by using a system-assigned managed identity.
ms.date: 04/02/2026
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

[!INCLUDE [Language-agnostic system-assigned procedures](../../../includes/authentication/system-assigned-managed-identity.md)]

[!INCLUDE [Java implement-managed-identity-concepts](includes/implement-managed-identity-concepts.md)]

### Implement the code

Add the `azure-identity` dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

Azure services are accessed using specialized client classes from the various Azure SDK client libraries. The following code example demonstrates how to create a credential instance and use it with an Azure SDK service client. In your application code, complete the following steps to authenticate using a managed identity:

1. Import the `DefaultAzureCredentialBuilder`, `ManagedIdentityCredentialBuilder`, and `TokenCredential` classes.
1. Pass an appropriate `TokenCredential` instance to the client:
    - Use `DefaultAzureCredential` when running locally
    - Use `ManagedIdentityCredential` when your app is running in Azure

The following example demonstrates authenticating a `SecretClient` using a system-assigned managed identity:

```java
import com.azure.core.credential.TokenCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

TokenCredential credential = null;

// Set up credential based on environment (Azure or local development)
String environment = System.getenv("ENV");

if (environment != null && environment.equals("production")) {
    credential = new ManagedIdentityCredentialBuilder()
        .build();
} else {
    credential = new DefaultAzureCredentialBuilder()
        .build();
}

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

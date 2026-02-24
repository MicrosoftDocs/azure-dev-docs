---
title: Authenticate Azure-hosted Java apps by using a user-assigned managed identity
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Azure-hosted Java apps to Azure resources by using a user-assigned managed identity.
ms.date: 02/24/2026
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-generated
---

# Authenticate Azure-hosted Java apps to Azure resources by using a user-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). Most Azure services support this approach, including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. For more information, see [Azure services and resource types supporting managed identities](/entra/identity/managed-identities-azure-resources/managed-identities-status). For more information about different authentication techniques and approaches, see [Authenticate Java apps to Azure services by using the Azure Identity library](overview.md).

In the following sections, you learn about:

- Essential managed identity concepts.
- How to create a user-assigned managed identity for your app.
- How to assign roles to the user-assigned managed identity.
- How to authenticate by using the user-assigned managed identity from your app code.

[!INCLUDE [managed-identity-concepts](../../../includes/authentication/managed-identity-concepts.md)]

The following sections describe the steps to enable and use a user-assigned managed identity for an Azure-hosted app. If you need to use a system-assigned managed identity, see [Authenticate Azure-hosted Java apps to Azure resources using a system-assigned managed identity](system-assigned-managed-identity.md).

[!INCLUDE [user-assigned-managed-identity](../../../includes/authentication/user-assigned-managed-identity.md)]

## Authenticate to Azure services from your app

The [Azure Identity library](/java/api/com.azure.identity) offers different credentials as implementations of `TokenCredential`. Each implementation supports different scenarios and Microsoft Entra authentication flows. For user-assigned managed identities, specify the identity's client ID, resource ID, or object ID when you configure the credential.

### Implement the code

Add the `azure-identity` dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

You access Azure services by using specialized client classes from the Azure SDK client libraries. The following code examples show you how to configure the credential for user-assigned managed identity authentication.

#### Use DefaultAzureCredential

Use `DefaultAzureCredential` as the credential for Azure-hosted apps. For user-assigned managed identities, configure the client ID by using the `managedIdentityClientId` method:

```java
import com.azure.identity.DefaultAzureCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// Configure DefaultAzureCredential with the user-assigned managed identity's client ID
DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
    .managedIdentityClientId("<user-assigned-managed-identity-client-id>")
    .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

#### Use ManagedIdentityCredential

If you want to explicitly use the managed identity credential and avoid the credential chain lookup in `DefaultAzureCredential`, use `ManagedIdentityCredential` directly. For user-assigned managed identities, you can specify the identity by using the client ID, resource ID, or object ID.

#### [Client ID](#tab/client-id)

Use the client ID to identify a managed identity when you configure applications or services that need to authenticate by using that identity.

Retrieve the client ID assigned to a user-assigned managed identity by using the following command:

```azurecli
az identity show \
    --resource-group <resource-group-name> \
    --name <identity-name> \
    --query clientId \
    --output tsv
```

Configure `ManagedIdentityCredential` with the client ID:

```java
import com.azure.identity.ManagedIdentityCredential;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// Specify the client ID of the user-assigned managed identity
ManagedIdentityCredential credential = new ManagedIdentityCredentialBuilder()
    .clientId("<user-assigned-managed-identity-client-id>")
    .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

#### [Resource ID](#tab/resource-id)

The resource ID is the full Azure Resource Manager (ARM) path to the user-assigned managed identity resource.

Retrieve the resource ID assigned to a user-assigned managed identity by using the following command:

```azurecli
az identity show \
    --resource-group <resource-group-name> \
    --name <identity-name> \
    --query id \
    --output tsv
```

Configure `ManagedIdentityCredential` with the resource ID:

```java
import com.azure.identity.ManagedIdentityCredential;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// Specify the resource ID of the user-assigned managed identity
ManagedIdentityCredential credential = new ManagedIdentityCredentialBuilder()
    .resourceId("/subscriptions/<subscription-id>/resourcegroups/<resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>")
    .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

#### [Object ID](#tab/object-id)

The object ID is the unique identifier of the managed identity's service principal in Microsoft Entra ID.

Retrieve the object ID assigned to a user-assigned managed identity by using the following command:

```azurecli
az identity show \
    --resource-group <resource-group-name> \
    --name <identity-name> \
    --query principalId \
    --output tsv
```

Configure `ManagedIdentityCredential` with the object ID:

```java
import com.azure.identity.ManagedIdentityCredential;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// Specify the object ID of the user-assigned managed identity
ManagedIdentityCredential credential = new ManagedIdentityCredentialBuilder()
    .objectId("<user-assigned-managed-identity-object-id>")
    .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

---

## Next steps

This article covered authentication using a user-assigned managed identity. This form of authentication is one of multiple ways you can authenticate in the Azure SDK for Java. The following articles describe other ways to authenticate:

- [Authenticate Azure-hosted Java apps to Azure resources by using a system-assigned managed identity](system-assigned-managed-identity.md)
- [Authenticate Java apps to Azure services during local development by using developer accounts](local-development-dev-accounts.md)
- [Authenticate Java apps to Azure services during local development by using service principals](local-development-service-principal.md)

If you run into issues related to Azure-hosted application authentication, see [Troubleshoot Azure-hosted application authentication](../troubleshooting-authentication-azure-hosted.md).

After you master authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

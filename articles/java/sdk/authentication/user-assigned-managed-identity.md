---
title: Authenticate Azure-hosted Java apps by using a user-assigned managed identity
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Azure-hosted Java apps to Azure resources by using a user-assigned managed identity.
ms.date: 04/02/2026
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
    - Use `ManagedIdentityCredential` when your app is running in Azure and configure either the client ID, resource ID, or object ID.

#### [Client ID](#tab/client-id)

The client ID is used to identify a managed identity when configuring applications or services that need to authenticate using that identity.

1. Retrieve the client ID assigned to a user-assigned managed identity by using the following command:

    ```azurecli
    az identity show \
        --resource-group <resource-group-name> \
        --name <identity-name> \
        --query clientId \
        --output tsv
    ```

1. Configure `ManagedIdentityCredential` with the client ID:

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
        // Specify the client ID of the user-assigned managed identity
        credential = new ManagedIdentityCredentialBuilder()
            .clientId("<user-assigned-managed-identity-client-id>")
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

#### [Resource ID](#tab/resource-id)

The resource ID uniquely identifies the managed identity resource within your Azure subscription using the following structure:

`/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}`

Resource IDs can be built by convention, which makes them more convenient when working with a large number of user-assigned managed identities in your environment.

1. Retrieve the resource ID assigned to a user-assigned managed identity by using the following command:

    ```azurecli
    az identity show \
        --resource-group <resource-group-name> \
        --name <identity-name> \
        --query id \
        --output tsv
    ```

1. Configure `ManagedIdentityCredential` with the resource ID:

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
        // Specify the resource ID of the user-assigned managed identity
        credential = new ManagedIdentityCredentialBuilder()
            .resourceId("/subscriptions/<subscription-id>/resourcegroups/<resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>")
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

#### [Object ID](#tab/object-id)

The object ID is the unique identifier of the managed identity's service principal in Microsoft Entra ID. A principal ID is another name for an object ID.

1. Retrieve the object ID assigned to a user-assigned managed identity by using the following command:

    ```azurecli
    az identity show \
        --resource-group <resource-group-name> \
        --name <identity-name> \
        --query principalId \
        --output tsv
    ```

1. Configure `ManagedIdentityCredential` with the object ID:

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
        // Specify the object ID of the user-assigned managed identity
        credential = new ManagedIdentityCredentialBuilder()
            .objectId("<user-assigned-managed-identity-object-id>")
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

---

## Next steps

This article covered authentication using a user-assigned managed identity. This form of authentication is one of multiple ways you can authenticate in the Azure SDK for Java. The following articles describe other ways to authenticate:

- [Authenticate Azure-hosted Java apps to Azure resources by using a system-assigned managed identity](system-assigned-managed-identity.md)
- [Authenticate Java apps to Azure services during local development by using developer accounts](local-development-dev-accounts.md)
- [Authenticate Java apps to Azure services during local development by using service principals](local-development-service-principal.md)

If you run into issues related to Azure-hosted application authentication, see [Troubleshoot Azure-hosted application authentication](../troubleshooting-authentication-azure-hosted.md).

---
title: Authenticate Java apps to Azure services
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Java apps to Azure services using the Azure Identity library, including managed identities and developer accounts.
ms.date: 02/02/2026
ms.topic: overview
ms.custom: devx-track-java
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-assisted
---

# Authenticate Java apps to Azure services by using the Azure Identity library

Apps can use the Azure Identity library to authenticate to Microsoft Entra ID, which allows the apps to access Azure services and resources. This authentication requirement applies whether the app is deployed to Azure, hosted on-premises, or running locally on a developer workstation. This article describes the recommended approaches to authenticate an app to Microsoft Entra ID across different environments when using the Azure SDK client libraries.

## Recommended approach for Java app authentication

Token-based authentication through Microsoft Entra ID is the recommended approach for authenticating apps to Azure, instead of using connection strings or key-based options. The [Azure Identity library](/java/api/com.azure.identity) provides classes that support token-based authentication and enable apps to authenticate to Azure resources whether the app runs locally, on Azure, or on an on-premises server.

### Advantages of token-based authentication for Java apps

Token-based authentication offers the following advantages over connection strings:

- Token-based authentication ensures that only the specific apps intended to access the Azure resource can access it, whereas anyone or any app with a connection string can connect to an Azure resource.
- Token-based authentication enables you to limit Azure resource access to only the specific permissions needed by the app. This approach follows the [principle of least privilege](https://wikipedia.org/wiki/Principle_of_least_privilege). In contrast, a connection string grants full rights to the Azure resource.
- When you use a [managed identity](/entra/identity/managed-identities-azure-resources/overview) for token-based authentication, Azure handles administrative functions for you, so you don't need to worry about tasks like securing or rotating secrets. This approach makes the app more secure because there's no connection string or application secret that can be compromised.
- The Azure Identity library acquires and manages Microsoft Entra tokens for you.

Limit use of connection strings to scenarios where token-based authentication isn't an option, initial proof-of-concept apps, or development prototypes that don't access production or sensitive data. When possible, use the token-based authentication classes available in the Azure Identity library to authenticate to Azure resources.

## Authentication across different environments

The specific type of token-based authentication an app should use to authenticate to Azure resources depends on where the app runs. The following diagram provides guidance for different scenarios and environments:

:::image type="content" source="../../../includes/authentication/media/mermaidjs/authentication-environments.svg" alt-text="A diagram showing the recommended token-based authentication strategies for an app depending on where it's running." :::

When an app is:

- **Hosted on Azure**: The app should authenticate to Azure resources by using a managed identity. For more information, see the [Authentication for Azure-hosted apps](#authentication-for-azure-hosted-apps) section.
- **Running locally during development**: The app can authenticate to Azure by using a developer account or a service principal. For more information, see the [Authentication during local development](#authentication-during-local-development) section.
- **Hosted on-premises**: The app should authenticate to Azure resources by using an application service principal.

## Authentication for Azure-hosted apps

When you host your app on Azure, it can use managed identities to authenticate to Azure resources without needing to manage any credentials. Two types of managed identities are available: user-assigned and system-assigned.

### Use a user-assigned managed identity

You can create a user-assigned managed identity as a standalone Azure resource. You can then assign it to one or more Azure resources so those resources can share the same identity and permissions. To authenticate by using a user-assigned managed identity, create the identity, assign it to your Azure resource, and then configure your app to use this identity for authentication by specifying its client ID, resource ID, or object ID.

For more information, see [Authenticate Azure-hosted Java apps to Azure resources by using a user-assigned managed identity](user-assigned-managed-identity.md).

### Use a system-assigned managed identity

You can enable a system-assigned managed identity directly on an Azure resource. The identity is tied to the lifecycle of that resource and is automatically deleted when the resource is deleted. To authenticate by using a system-assigned managed identity, enable the identity on your Azure resource and then configure your app to use this identity for authentication.

For more information, see [Authenticate Azure-hosted Java apps to Azure resources by using a system-assigned managed identity](system-assigned-managed-identity.md).

## Authentication during local development

During local development, you can authenticate to Azure resources by using your developer credentials or a service principal. By using one of these methods, you can test your app's authentication logic without deploying it to Azure.

### Use developer credentials

You can use your own Azure credentials to authenticate to Azure resources during local development. Typically, you use a development tool such as Azure CLI, Azure Developer CLI, Visual Studio Code, or IntelliJ IDEA. These tools can provide your app with the necessary tokens to access Azure services. This method is convenient but you should use it only for development purposes.

For more information, see [Authenticate Java apps to Azure services during local development by using developer accounts](local-development-dev-accounts.md).

### Use a service principal

You can create a service principal in a Microsoft Entra tenant to represent an app and authenticate to Azure resources. You can configure your app to use service principal credentials during local development. This method is more secure than using developer credentials and is closer to how your app authenticates in production. However, it's still less ideal than using a managed identity due to the need for secrets.

For more information, see [Authenticate Java apps to Azure services during local development by using service principals](local-development-service-principal.md).

## Add the Maven dependencies

To use the Azure Identity library in your project, include the `azure-sdk-bom` to take a dependency on the stable version of the library. In the following snippet, replace the `{bom_version_to_target}` placeholder with the version number. To learn more about the BOM and find available version numbers, see the [Add Azure SDK for Java to an existing project](../get-started-maven.md#add-azure-sdk-for-java-to-an-existing-project) section of [Get started with Azure SDK and Apache Maven](../get-started-maven.md).

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-sdk-bom</artifactId>
            <version>{bom_version_to_target}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Then include the direct dependency in the `dependencies` section without the version tag:

```xml
<dependencies>
  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
  </dependency>
</dependencies>
```

## Key concepts

Two key concepts help you understand the Azure Identity library: the concept of a credential, and the most common implementation of that credential, `DefaultAzureCredential`.

A credential is a class that contains or can obtain the data needed for a service client to authenticate requests. Service clients across the Azure SDK accept credentials when they're constructed, and service clients use those credentials to authenticate requests to the service.

The Azure Identity library focuses on OAuth authentication with Microsoft Entra ID, and it offers various credential classes that can acquire a Microsoft Entra token to authenticate service requests. All of the credential classes in this library are implementations of the `TokenCredential` abstract class in [azure-core](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/core). You can use any of these credential classes to construct service clients that authenticate with a `TokenCredential`.

`DefaultAzureCredential` is appropriate for most scenarios where the application ultimately runs in the Azure Cloud. `DefaultAzureCredential` combines credentials that are commonly used to authenticate when deployed, with credentials that are used to authenticate in a development environment. For more information, including examples using `DefaultAzureCredential`, see [Credential chains in the Azure Identity library for Java](credential-chains.md).

## Authenticate Azure client libraries

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets) client library by using `DefaultAzureCredential`.

```java
// Azure SDK client builders accept the credential as a parameter.
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-Key-Vault-name>.vault.azure.net")
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();
```

## Authenticate Azure management libraries

The Azure management libraries use the same credential APIs as the Azure client libraries, but they also require an [Azure subscription ID](/training/modules/create-an-azure-account/4-multiple-subscriptions) to manage the Azure resources on that subscription.

You can find the subscription IDs on the [Subscriptions page in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Alternatively, use the following [Azure CLI](/cli/azure) command to get subscription IDs:

```azurecli
az account list --output table
```

Set the subscription ID in the `AZURE_SUBSCRIPTION_ID` environment variable. `AzureProfile` picks up this ID as the default subscription ID during the creation of a `Manager` instance in the following example:

```java
AzureResourceManager azureResourceManager = AzureResourceManager.authenticate(
        new DefaultAzureCredentialBuilder().build(),
        new AzureProfile(AzureEnvironment.AZURE))
    .withDefaultSubscription();
```

`DefaultAzureCredential` used in this example authenticates an `AzureResourceManager` instance by using `DefaultAzureCredential`. You can also use other Token Credential implementations offered in the Azure Identity library in place of `DefaultAzureCredential`.

## Troubleshooting

For guidance, see [Troubleshoot Azure Identity authentication issues](../troubleshooting-authentication-overview.md).

## Next steps

This article introduced the Azure Identity functionality available in the Azure SDK for Java. It described `DefaultAzureCredential` as common and appropriate in many cases. The following articles describe other ways to authenticate by using the Azure Identity library, and provide more information about `DefaultAzureCredential`:

- [Authenticate Java apps to Azure services during local development by using developer accounts](local-development-dev-accounts.md)
- [Authenticate Java apps to Azure services during local development by using service principals](local-development-service-principal.md)
- [Authenticate Azure-hosted Java apps to Azure resources by using a system-assigned managed identity](system-assigned-managed-identity.md)
- [Authenticate Azure-hosted Java apps to Azure resources by using a user-assigned managed identity](user-assigned-managed-identity.md)
- [Credential chains in the Azure Identity library for Java](credential-chains.md)

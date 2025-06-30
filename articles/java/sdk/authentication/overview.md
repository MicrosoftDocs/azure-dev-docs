---
title: Azure authentication with Java and Azure Identity
titleSuffix: Azure SDK for Java
description: Provides an overview of the Azure SDK authentication and identity functionality.
ms.date: 04/01/2025 
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: vigera
---

# Azure authentication with Java and Azure Identity

This article provides an overview of the Azure Identity library for Java, which provides Microsoft Entra token authentication support across the Azure SDK for Java. This library provides a set of `TokenCredential` implementations that you can use to construct Azure SDK clients that support Microsoft Entra token authentication.

The Azure Identity library currently supports:

* [Azure authentication in Java development environments](dev-env.md), which enables:
  * IDEA IntelliJ authentication, with the sign-in information retrieved from the [Azure Toolkit for IntelliJ](../../toolkit-for-intellij/index.yml).
  * Azure CLI authentication, with the sign-in information saved in the [Azure CLI](/cli/azure/what-is-azure-cli)
  * Azure Developer CLI authentication, with the sign-in information saved in the [Azure Developer CLI](/azure/developer/azure-developer-cli/)
  * Azure PowerShell authentication, with the sign-in information saved in [Azure PowerShell](/powershell/azure)
* [Authenticating applications hosted in Azure](azure-hosted-apps.md), which enables:
  * `DefaultAzureCredential` authentication
  * Managed Identity authentication
* [Authentication with service principals](service-principal.md), which enables:
  * Client Secret authentication
  * Client Certificate authentication
* [Authentication with user credentials](user.md), which enables:
  * Interactive browser authentication
  * Device code authentication
  * Username/password authentication

Follow these links to learn more about the specifics of each of these authentication approaches. In the rest of this article, we introduce the commonly used `DefaultAzureCredential` and related subjects.

## Add the Maven dependencies

Include the `azure-sdk-bom` in your project to take a dependency on the stable version of the library. In the following snippet, replace the `{bom_version_to_target}` placeholder with the version number. To learn more about the BOM, see the [Add Azure SDK for Java to an existing project](../get-started-maven.md#add-azure-sdk-for-java-to-an-existing-project) section of [Get started with Azure SDK and Apache Maven](../get-started-maven.md).

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

There are two key concepts in understanding the Azure Identity library: the concept of a credential, and the most common implementation of that credential, `DefaultAzureCredential`.

A credential is a class that contains or can obtain the data needed for a service client to authenticate requests. Service clients across the Azure SDK accept credentials when they're constructed, and service clients use those credentials to authenticate requests to the service.

The Azure Identity library focuses on OAuth authentication with Microsoft Entra ID, and it offers various credential classes that can acquire a Microsoft Entra token to authenticate service requests. All of the credential classes in this library are implementations of the `TokenCredential` abstract class in [azure-core](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/core), and you can use any of them to construct service clients that can authenticate with a `TokenCredential`.

`DefaultAzureCredential` is appropriate for most scenarios where the application is intended to ultimately run in the Azure Cloud. `DefaultAzureCredential` combines credentials that are commonly used to authenticate when deployed, with credentials that are used to authenticate in a development environment. For more information, including examples using `DefaultAzureCredential`, see the [DefaultAzureCredential](azure-hosted-apps.md#defaultazurecredential) section of [Authenticating Azure-hosted Java applications](azure-hosted-apps.md).

## Examples

As noted in [Use the Azure SDK for Java](../overview.md#provision-and-manage-azure-resources-with-management-libraries), the management libraries differ slightly. One of the ways they differ is that there are libraries for consuming Azure services, called *client libraries*, and libraries for managing Azure services, called *management libraries*. In the following sections, there's a quick overview of authenticating in both client and management libraries.

### Authenticate Azure client libraries

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets) client library using `DefaultAzureCredential`.

```java
// Azure SDK client builders accept the credential as a parameter.
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://<your Key Vault name>.vault.azure.net")
  .credential(new DefaultAzureCredentialBuilder().build())
  .buildClient();
```

### Authenticate Azure management libraries

The Azure management libraries use the same credential APIs as the Azure client libraries, but also require an [Azure subscription ID](/training/modules/create-an-azure-account/4-multiple-subscriptions) to manage the Azure resources on that subscription.

You can find the subscription IDs on the [Subscriptions page in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Alternatively, use the following [Azure CLI](/cli/azure) command to get subscription IDs:

```azurecli
az account list --output table
```

You can set the subscription ID in the `AZURE_SUBSCRIPTION_ID` environment variable. `AzureProfile` picks up this ID as the default subscription ID during the creation of a `Manager` instance in the following example:

```java
AzureResourceManager azureResourceManager = AzureResourceManager.authenticate(
        new DefaultAzureCredentialBuilder().build(),
        new AzureProfile(AzureEnvironment.AZURE))
    .withDefaultSubscription();
```

`DefaultAzureCredential` used in this example authenticates an `AzureResourceManager` instance using `DefaultAzureCredential`. You can also use other Token Credential implementations offered in the Azure Identity library in place of `DefaultAzureCredential`.

## Troubleshooting

For guidance, see [Troubleshoot Azure Identity authentication issues](../troubleshooting-authentication-overview.md).

## Next steps

This article introduced the Azure Identity functionality available in the Azure SDK for Java. It described `DefaultAzureCredential` as common and appropriate in many cases. The following articles describe other ways to authenticate using the Azure Identity library, and provide more information about `DefaultAzureCredential`:

* [Azure authentication in development environments](dev-env.md)
* [Authenticating applications hosted in Azure](azure-hosted-apps.md)
* [Authentication with service principals](service-principal.md)
* [Authentication with user credentials](user.md)

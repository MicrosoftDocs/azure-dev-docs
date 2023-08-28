---
title: Azure authentication with Java and Azure Identity
description: An overview of the Azure SDK authentication and identity functionality
ms.date: 10/17/2022
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: vigera
---

# Azure authentication with Java and Azure Identity

This article provides an overview of the Java Azure Identity library, which provides Azure Active Directory token authentication support across the Azure SDK for Java. This library provides a set of `TokenCredential` implementations that you can use to construct Azure SDK clients that support Azure AD token authentication.

The Azure Identity library currently supports:

* [Azure authentication in Java development environments](identity-dev-env-auth.md), which enables:
  * IDEA IntelliJ authentication, with the login information retrieved from the [Azure Toolkit for IntelliJ](../toolkit-for-intellij/index.yml).
  * Visual Studio Code authentication, with the login information saved in [Azure plugin for Visual Studio Code](https://code.visualstudio.com/docs/azure/extensions).
  * Azure CLI authentication, with the login information saved in the [Azure CLI](/cli/azure/what-is-azure-cli)
* [Authenticating applications hosted in Azure](identity-azure-hosted-auth.md), which enables:
  * Default Azure Credential Authentication
  * Managed Identity Authentication
* [Authentication with service principals](identity-service-principal-auth.md), which enables:
  * Client Secret Authentication
  * Client Certificate Authentication
* [Authentication with user credentials](identity-user-auth.md), which enables:
  * Interactive browser authentication
  * Device code authentication
  * Username/password authentication

Follow the links above to learn more about the specifics of each of these authentication approaches. In the rest of this article, we'll introduce the commonly used `DefaultAzureCredential` and related topics.

## Add the Maven dependencies

To add the Maven dependency, include the following XML in the project's *pom.xml* file. Replace `{version_number}` with the latest stable release's version number, as shown on the [Azure Identity library page](https://search.maven.org/artifact/com.azure/azure-identity).

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>{version_number}</version>
</dependency>
```

## Key concepts

There are two key concepts in understanding the Azure Identity library: the concept of a credential, and the most common implementation of that credential, the `DefaultAzureCredential`.

A credential is a class that contains or can obtain the data needed for a service client to authenticate requests. Service clients across the Azure SDK accept credentials when they're constructed, and service clients use those credentials to authenticate requests to the service.

The Azure Identity library focuses on OAuth authentication with Azure Active Directory, and it offers various credential classes that can acquire an Azure AD token to authenticate service requests. All of the credential classes in this library are implementations of the `TokenCredential` abstract class in [azure-core](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/core), and you can use any of them to construct service clients that can authenticate with a `TokenCredential`.

The `DefaultAzureCredential` is appropriate for most scenarios where the application is intended to ultimately run in the Azure Cloud. `DefaultAzureCredential` combines credentials that are commonly used to authenticate when deployed, with credentials that are used to authenticate in a development environment. For more information, including examples using `DefaultAzureCredential`, see the [Default Azure credential](identity-azure-hosted-auth.md#default-azure-credential) section of [Authenticating Azure-hosted Java applications](identity-azure-hosted-auth.md).

## Examples

As noted in [Use the Azure SDK for Java](overview.md#provision-and-manage-azure-resources-with-management-libraries), the management libraries differ slightly. One of the ways they differ is that there are libraries for *consuming* Azure services, called client libraries, and libraries for *managing* Azure services, called management libraries. In the following sections, there's a quick overview of authenticating in both client and management libraries.

### Authenticate Azure client libraries

The following example below demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets) client library using the `DefaultAzureCredential`.

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

You can set the subscription ID in the `AZURE_SUBSCRIPTION_ID` environment variable. This ID is picked up by `AzureProfile` as the default subscription ID during the creation of a `Manager` instance, as shown in the following example:

```java
AzureResourceManager azureResourceManager = AzureResourceManager.authenticate(
        new DefaultAzureCredentialBuilder().build(),
        new AzureProfile(AzureEnvironment.AZURE))
    .withDefaultSubscription();
```

The `DefaultAzureCredential` used in this example authenticates an `AzureResourceManager` instance using the `DefaultAzureCredential`. You can also use other Token Credential implementations offered in the Azure Identity library in place of `DefaultAzureCredential`.

## Troubleshooting

Refer to the [troubleshoot Azure Identity authentication issues](troubleshooting-authentication-overview.md) documentation for guidance on troubleshooting Azure Identity authentication issues.

## Next steps

This article introduced the Azure Identity functionality available in the Azure SDK for Java. It described the `DefaultAzureCredential` as common and appropriate in many cases. The following articles describe other ways to authenticate using the Azure Identity library, and provide more information about the `DefaultAzureCredential`:

* [Azure authentication in development environments](identity-dev-env-auth.md)
* [Authenticating applications hosted in Azure](identity-azure-hosted-auth.md)
* [Authentication with service principals](identity-service-principal-auth.md)
* [Authentication with user credentials](identity-user-auth.md)

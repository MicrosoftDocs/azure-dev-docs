---
title: Azure authentication with Java and Azure Identity
description: An overview of the Azure SDK authentication and identity functionality
author: g2vinay
ms.date: 01/06/2021
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: vigera
---

# Azure authentication with Java and Azure Identity

This article provides an overview of the Java Azure Identity library, which provides Azure Active Directory token authentication support across the Azure SDK for Java. It provides a set of TokenCredential implementations which can be used to construct Azure SDK clients which support AAD token authentication.

The Azure Identity library currently supports:

* [Azure authentication in development environments](java-sdk-identity-dev-env-auth.md), which enables:
  * IDEA IntelliJ authentication, with the login information retrieved from the [Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/)
  * Visual Studio Code authentication, with the login information saved in [Azure plugin for Visual Studio Code](https://code.visualstudio.com/docs/azure/extensions)
  * Azure CLI authentication, with the login information saved in the [Azure CLI](/cli/azure/what-is-azure-cli)
* [Authenticating applications hosted in Azure](java-sdk-identity-azure-hosted-auth.md), which enables:
  * Default Azure Credential Authentication
  * Managed Identity Authentication
* [Authentication with Service Principals](java-sdk-identity-service-principal-auth.md), which enables:
  * Client Secret Authentication
  * Client Certificate Authentication
* [Authentication with User Credentials](java-sdk-identity-user-auth.md), which enables:
  * Interactive browser authentication
  * Device code authentication
  * Username/password authentication

Follow the links above to learn more about the specifics of each of these authentication approaches. In the remainder of this document we will introduce the commonly-used `DefaultAzureCredential` and related topics.

## Adding Maven dependencies

Adding the Maven dependency is simply a matter of including the following XML in the project Maven pom.xml file. Be sure to check online to see what the latest released version is, which at the time of this document being written was 1.2.1.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.2.1</version>
</dependency>
```

The latest release of azure-identity can be found [here](https://search.maven.org/artifact/com.azure/azure-identity).

## Key concepts

Two key concepts in understanding the Azure Identity library are those of a credential, and then the most common implementation of that credential, the `DefaultAzureCredential`.

A credential is a class which contains or can obtain the data needed for a service client to authenticate requests. Service clients across Azure SDK accept credentials when they are constructed, and service clients use those credentials to authenticate requests to the service.

The Azure Identity library focuses on OAuth authentication with Azure Active directory, and it offers a variety of credential classes capable of acquiring an AAD token to authenticate service requests. All of the credential classes in this library are implementations of the `TokenCredential` abstract class in [azure-core][azure_core_library], and any of them can be used to construct service clients capable of authenticating with a `TokenCredential`.

The `DefaultAzureCredential` is appropriate for most scenarios where the application is intended to ultimately be run in the Azure Cloud. This is because the `DefaultAzureCredential` combines credentials commonly used to authenticate when deployed, with credentials used to authenticate in a development environment. Further details and examples of using `DefaultAzureCredential` can be found [here](java-sdk-identity-azure-hosted-auth.md#default-azure-credential).

## Examples

As noted in the [overview](java-sdk-overview.md#provision-and-manage-azure-resources-with-management-libraries) documentation, the management libraries differ slightly, and one of the ways in which they differ is that there are libraries for *consuming* Azure services (called client libraries), and libraries for *managing* Azure services (called management libraries). In the sections below, we have a quick overview of authenticating in both client and management libraries.

### Authenticating Azure Client Libraries

This example below demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `DefaultAzureCredential`.

```java
// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
  .credential(new DefaultAzureCredentialBuilder().build())
  .buildClient();
```

### Authenticating Azure Management Libraries

The Azure management libraries use the same credential APIs as the Azure client libraries, but also require an [Azure subscription ID](/learn/modules/create-an-azure-account/4-multiple-subscriptions) to manage the Azure resources on that subscription.

The subscription IDs can be find on the [Subscriptions page in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Alternatively, use the [Azure CLI][azure_cli] snippet below to get subscription IDs:

```bash
az account list --output table
```

The subscription ID can be set in the `AZURE_SUBSCRIPTION_ID` environment variable. It will be picked up by `AzureProfile` as the default subscription ID, during the creation of `Manager` service API similar to the following code:

```java
AzureResourceManager azureResourceManager = AzureResourceManager.authenticate(
        new DefaultAzureCredentialBuilder().build(),
        new AzureProfile(AzureEnvironment.AZURE))
    .withDefaultSubscription();
```

The `DefaultAzureCredential` used in the example above authenticates a `AzureResourceManager` instance using the `DefaultAzureCredential`. Other Token Credential implementations offered in the Azure Identity library can be used here as well in place of `DefaultAzureCredential`.

## Troubleshooting

Credentials raise exceptions either when they fail to authenticate or cannot execute authentication.
When credentials fail to authenticate, the`ClientAuthenticationException` is raised and it has a `message` attribute which
describes why authentication failed. When this exception is raised by `ChainedTokenCredential`, the chained execution of underlying list of credentials is stopped.

When credentials cannot execute authentication due to one of the underlying resources required by the credential being unavailable on the machine, the`CredentialUnavailableException` is raised and it has a `message` attribute which
describes why the credential is unavailable for authentication execution . When this exception is raised by `ChainedTokenCredential`, the message collects error messages from each credential in the chain.

## Next Steps

This document has introduced the Azure Identity functionality available in the Azure SDK for Java. It has spoken about the `DefaultAzureCredential` being commonly-used and appropriate in many cases. In the links below, readers are encouraged to explore other ways of authenticating using the Azure Identity library, and to learn more about the `DefaultAzureCredential`:

* [Azure authentication in development environments](java-sdk-identity-dev-env-auth.md)
* [Authenticating applications hosted in Azure](java-sdk-identity-azure-hosted-auth.md)
* [Authentication with Service Principals](java-sdk-identity-service-principal-auth.md)
* [Authentication with User Credentials](java-sdk-identity-user-auth.md)

<!-- LINKS -->
[azure_cli]: /cli/azure
[azure_sub]: https://azure.microsoft.com/free/
[source]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity
[aad_doc]: /azure/active-directory/
[code_of_conduct]: https://opensource.microsoft.com/codeofconduct/
[keys_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-keys
[logging]: https://github.com/Azure/azure-sdk-for-java/wiki/Logging-with-Azure-SDK
[secrets_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets
[eventhubs_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventhubs/azure-messaging-eventhubs
[azure_core_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/core
[javadoc]: https://azure.github.io/azure-sdk-for-java
[jdk_link]: /java/azure/jdk/?view=azure-java-stable

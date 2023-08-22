---
title: Authentication troubleshooting overview when using the Azure SDK for Java
description: An overview of how to troubleshoot authentication issues related to using the Azure SDK for Java
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshoot Azure Identity authentication issues

This troubleshooting guide covers failure investigation techniques, common errors for the credential types in the Azure Identity Java client library, and mitigation steps to resolve these errors. As there are many credential types available in the Azure SDK for Java, we have split the troubleshooting guide into sections based on usage scenario. The following sections are available:

* [Azure Hosted Applications Auth](/azure/developer/java/sdk/troubleshooting-authentication-azure-hosted)
* [Development Environment Auth](/azure/developer/java/sdk/troubleshooting-authentication-dev-env)
* [Service Principal Auth](/azure/developer/java/sdk/troubleshooting-authentication-service-principal)
* [User Credential Auth](/azure/developer/java/sdk/troubleshooting-authentication-user-credential)

The remainder of this document will cover general troubleshooting techniques and guidance that apply to all credential types.

## Handling Azure Identity exceptions

As noted in the [troubleshooting overview](/azure/developer/java/sdk/troubleshooting-overview#exception-handling-in-the-azure-sdk-for-java), there is a comprehensive set of exceptions and error codes that can be thrown by the Azure SDK for Java. For Azure Identity specifically, there are a few key exception types that are important to understand.

### ClientAuthenticationException

Exceptions arising from authentication errors can be raised on any service client method that makes a request to the service. This is because the token is requested from the credential on the first call to the service and on any subsequent requests to the service that need to refresh the token.

To distinguish these failures from failures in the service client, Azure Identity classes raise the `ClientAuthenticationException` with details describing the source of the error in the exception message and possibly the error message. Depending on the application, these errors may or may not be recoverable.

```java
// Create a secret client using the DefaultAzureCredential
SecretClient client = new SecretClientBuilder()
        .vaultUrl("https://myvault.vault.azure.net/")
        .credential(new DefaultAzureCredentialBuilder().build())
        .buildClient();

try {
    KeyVaultSecret secret = client.geSecret("secret1");
} catch (ClientAuthenticationException e) {
    //Handle Exception
    e.printStackTrace();
}
```

### CredentialUnavailableException

The `CredentialUnavailableExcpetion` is a special exception type derived from `ClientAuthenticationException`. This exception type is used to indicate that the credential can't authenticate in the current environment, due to lack of required configuration or setup. This exception is also used as a signal to chained credential types, such as `DefaultAzureCredential` and `ChainedTokenCredential`, that the chained credential should continue to try other credential types later in the chain.

### Permission issues

Calls to service clients resulting in `HttpResponseException` with a `StatusCode` of 401 or 403 often indicate the caller doesn't have sufficient permissions for the specified API. Check the service documentation to determine which RBAC roles are needed for the specific request, and ensure the authenticated user or service principal have been granted the appropriate roles on the resource.

## Finding relevant information in exception messages

`ClientAuthenticationException` is thrown when unexpected errors occurred while a credential is authenticating. This can include errors received from requests to the AAD STS and often contains information helpful to diagnosis. Consider the following `ClientAuthenticationException` message.

![ClientAuthenticationException Message Example](https://raw.githubusercontent.com/Azure/azure-sdk-for-net/main/sdk/identity/Azure.Identity/images/AuthFailedErrorMessageExample.png)

This error contains several pieces of information:

* **Failing Credential Type**: The type of credential that failed to authenticate. This can be helpful when diagnosing issues with chained credential types such as `DefaultAzureCredential` or `ChainedTokenCredential`.

* **STS Error Code and Message**: The error code and message returned from the Azure AD STS. This can give insight into the specific reason the request failed. For instance, in this specific case because the provided client secret is incorrect. More information on STS error codes can be found [here](/azure/active-directory/develop/reference-aadsts-error-codes#aadsts-error-codes).

* **Correlation ID and Timestamp**: The correlation ID and call Timestamp used to identify the request in server-side logs. This information can be useful to support engineers when diagnosing unexpected STS failures.

## Enable and configure logging

Azure SDK for Java offers a consistent logging story to help aid in troubleshooting application errors and expedite their resolution. The logs produced will capture the flow of an application before reaching the terminal state to help locate the root issue. You can review the [logging conceptual documentation](/azure/developer/java/sdk/logging-overview) and the [troubleshooting documentation](/azure/developer/java/sdk/troubleshooting-overview) for guidance on using logging.

The underlying MSAL library, [MSAL4J](https://github.com/AzureAD/microsoft-authentication-library-for-java), also has detailed logging. It is highly verbose and will include all PII including tokens. This logging is most useful when working with product support. As of v1.10.0, credentials which offer this logging will have a method called `enableUnsafeSupportLogging()`.

> [!CAUTION]
> Requests and responses in the Azure Identity library contain sensitive information. Precaution must be taken to protect logs when customizing the output to avoid compromising account security.

## Next Steps

If the troubleshooting guidance above does not help to resolve issues when using the Azure SDK for Java client libraries, it is recommended that you reach out to the development team by [filing an issue on the projects GitHub page][azsdkjava_github_repo].

<!-- LINKS -->
[azsdkjava_github_repo]: https://github.com/Azure/azure-sdk-for-java

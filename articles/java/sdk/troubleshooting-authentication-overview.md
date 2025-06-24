---
title: Troubleshoot Azure Identity authentication issues
titleSuffix: Azure SDK for Java
description: Provides an overview of how to troubleshoot authentication issues related to using the Azure SDK for Java.
ms.date: 04/02/2025 
ms.topic: troubleshooting-general
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: jogiles
---

# Troubleshoot Azure Identity authentication issues

This article covers failure investigation techniques, common errors for the credential types in the Azure Identity Java client library, and mitigation steps to resolve these errors. Because there are many credential types available in the Azure SDK for Java, we've split the troubleshooting guide into sections based on usage scenario. The following sections are available:

* [Troubleshoot Azure-hosted application authentication](troubleshooting-authentication-azure-hosted.md)
* [Troubleshoot development environment authentication](troubleshooting-authentication-dev-env.md)
* [Troubleshoot service principal authentication](troubleshooting-authentication-service-principal.md)
* [Troubleshoot multi-tenant authentication](troubleshooting-authentication-multi-tenant.md)

The remainder of this article covers general troubleshooting techniques and guidance that apply to all credential types.

## Handle Azure Identity exceptions

As noted in the [Exception handling in the Azure SDK for Java](troubleshooting-overview.md#exception-handling-in-the-azure-sdk-for-java) section of [Troubleshooting overview](troubleshooting-overview.md), there's a comprehensive set of exceptions and error codes that the Azure SDK for Java can throw. For Azure Identity specifically, there are a few key exception types that are important to understand.

### ClientAuthenticationException

Any service client method that makes a request to the service can raise exceptions arising from authentication errors. These exceptions are possible because the token is requested from the credential on the first call to the service and on any subsequent requests to the service that need to refresh the token.

To distinguish these failures from failures in the service client, Azure Identity classes raise `ClientAuthenticationException` with details describing the source of the error in the exception message and possibly the error message. Depending on the application, these errors may or may not be recoverable. The following code shows an example of catching `ClientAuthenticationException`:

```java
// Create a secret client using the DefaultAzureCredential
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://myvault.vault.azure.net/")
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();

try {
    KeyVaultSecret secret = client.getSecret("secret1");
} catch (ClientAuthenticationException e) {
    //Handle Exception
    e.printStackTrace();
}
```

### CredentialUnavailableException

`CredentialUnavailableException` is a special exception type derived from `ClientAuthenticationException`. This exception type is used to indicate that the credential can't authenticate in the current environment due to lack of required configuration or setup. This exception is also used as a signal to chained credential types, such as `DefaultAzureCredential` and `ChainedTokenCredential`, that the chained credential should continue to try other credential types later in the chain.

### Permission issues

Calls to service clients resulting in `HttpResponseException` with a `StatusCode` of 401 or 403 often indicate the caller doesn't have sufficient permissions for the specified API. Check the service documentation to determine which roles are needed for the specific request. Ensure that the authenticated user or service principal has been granted the appropriate roles on the resource.

## Find relevant information in exception messages

`ClientAuthenticationException` is thrown when unexpected errors occur while a credential is authenticating. These errors can include errors received from requests to the Microsoft Entra security token service (STS) and often contain information helpful to diagnosis. Consider the following `ClientAuthenticationException` message:

```output
ClientSecretCredential authentication failed: A configuration issue is preventing authentication - check the error message from the server for details. You can modify the configuration in the application registration portal. See https://aka.ms/msal-net-invalid-client for details.

Original exception:
AADSTS7000215: Invalid client secret provided. Ensure the secret being sent in the request is the client secret value, not the client secret ID, for a secret added to app 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.
Trace ID: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
Correlation ID: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
Timestamp: 2022-01-01 00:00:00Z
```

This error message contains the following information:

* **Failing credential type**: The type of credential that failed to authenticate - in this case, `ClientSecretCredential`. This information is helpful when diagnosing issues with chained credential types, such as `DefaultAzureCredential` or `ChainedTokenCredential`.

* **STS error code and message**: The error code and message returned from the Microsoft Entra STS - in this case, `AADSTS7000215: Invalid client secret provided.` This information can give insight into the specific reason the request failed. For instance, in this specific case, because the provided client secret is incorrect. For more information on STS error codes, see the [AADSTS error codes](/azure/active-directory/develop/reference-aadsts-error-codes#aadsts-error-codes) section of [Microsoft Entra authentication and authorization error codes](/azure/active-directory/develop/reference-aadsts-error-codes).

* **Correlation ID and timestamp**: The correlation ID and call timestamp used to identify the request in server-side logs. This information is useful to support engineers when diagnosing unexpected STS failures.

## Enable and configure logging

Azure SDK for Java offers a consistent logging story to help in troubleshooting application errors and to help expedite their resolution. The logs produced capture the flow of an application before reaching the terminal state to help locate the root issue. For guidance on logging, see [Configure logging in the Azure SDK for Java](logging-overview.md) and [Troubleshooting over view](troubleshooting-overview.md).

The underlying MSAL library, [MSAL4J](https://github.com/AzureAD/microsoft-authentication-library-for-java), also has detailed logging. This logging is highly verbose and includes all personal data including tokens. This logging is most useful when working with product support. As of v1.10.0, credentials that offer this logging have a method called `enableUnsafeSupportLogging()`.

> [!CAUTION]
> Requests and responses in the Azure Identity library contain sensitive information. You must take precautions to protect logs when customizing the output to avoid compromising account security.

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when you use the Azure SDK for Java client libraries, we recommended that you [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

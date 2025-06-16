---
title: Azure authentication with user credentials
titleSuffix: Azure SDK for Java
description: Provides an overview of the Azure SDK for Java concepts related to authenticating applications with user credentials.
ms.date: 03/25/2025
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: vigera
---

# Azure authentication with user credentials

This article looks at how the Azure Identity library supports Microsoft Entra token authentication with user-provided credentials. This support is made possible through a set of TokenCredential implementations discussed in this article.

This article covers the following subjects:

* [Device code credential](#device-code-credential)
* [Interactive browser credential](#interactive-browser-credential)

## Device code credential

The device code credential interactively authenticates a user on devices with limited UI. It works by prompting the user to visit a sign-in URL on a browser-enabled machine when the application attempts to authenticate. The user then enters the device code mentioned in the instructions along with their sign-in credentials. Upon successful authentication, the application that requested authentication gets authenticated successfully on the device it's running on.

For more information, see [Microsoft identity platform and the OAuth 2.0 device authorization grant flow](/azure/active-directory/develop/v2-oauth2-device-code).

### Enable applications for device code flow

To authenticate a user through device code flow, use the following steps:

1. Go to Microsoft Entra ID in Azure portal and find your app registration.
2. Navigate to the **Authentication** section.
3. Under **Suggested Redirected URIs**, check the URI that ends with `/common/oauth2/nativeclient`.
4. Under **Default Client Type**, select `yes` for `Treat application as a public client`.

These steps enable the application to authenticate, but it still doesn't have permission to sign you into Microsoft Entra ID, or access resources on your behalf. To address this issue, navigate to **API Permissions**, and enable Microsoft Graph and the resources you want to access, such as Key Vault.

You also need to be the admin of your tenant to grant consent to your application when you sign in for the first time.

If you can't configure the device code flow option on your Microsoft Entra ID, then it may require your app to be multi- tenant. To make your app multi-tenant, navigate to the **Authentication** panel, then select **Accounts in any organizational directory**. Then, select **yes** for **Treat application as Public Client**.

### Authenticate a user account with device code flow

The following example demonstrates authenticating the `SecretClient` from the [Azure Key Vault Secret client library for Java][secrets_client_library] using the `DeviceCodeCredential` on an IoT device.

```java
/**
 * Authenticate with device code credential.
 */
DeviceCodeCredential deviceCodeCredential = new DeviceCodeCredentialBuilder()
    .challengeConsumer(challenge -> {
    // Lets the user know about the challenge.
    System.out.println(challenge.getMessage());
    }).build();

// Azure SDK client builders accept the credential as a parameter.
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your Key Vault name>.vault.azure.net")
    .credential(deviceCodeCredential)
    .buildClient();
```

## Interactive browser credential

This credential interactively authenticates a user with the default system browser and offers a smooth authentication experience by letting you use your own credentials to authenticate your application.

### Enable applications for interactive browser OAuth 2 flow

To use `InteractiveBrowserCredential`, you need to register an application in Microsoft Entra ID with permissions to sign in on behalf of a user. Follow the previous steps for device code flow to register your application. As mentioned previously, an admin of your tenant must grant consent to your application before any user account can sign in.

You may notice in `InteractiveBrowserCredentialBuilder`, a redirect URL is required. Add the redirect URL to the **Redirect URIs** subsection under the **Authentication** section of your registered Microsoft Entra application.

### Authenticate a user account interactively in the browser

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `InteractiveBrowserCredential`.

```java
/**
 * Authenticate interactively in the browser.
 */
InteractiveBrowserCredential interactiveBrowserCredential = new InteractiveBrowserCredentialBuilder()
    .clientId("<your app client ID>")
    .redirectUrl("YOUR_APP_REGISTERED_REDIRECT_URL")
    .build();

// Azure SDK client builders accept the credential as a parameter.
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your Key Vault name>.vault.azure.net")
    .credential(interactiveBrowserCredential)
    .buildClient();
```

## Next steps

This article covered authentication with user credentials. This form of authentication is one of multiple ways you can authenticate in the Azure SDK for Java. The following articles describe other ways:

* [Azure authentication in development environments](dev-env.md)
* [Authenticating applications hosted in Azure](azure-hosted-apps.md)
* [Authentication with service principals](service-principal.md)

After you've mastered authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

<!-- LINKS -->
[secrets_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets

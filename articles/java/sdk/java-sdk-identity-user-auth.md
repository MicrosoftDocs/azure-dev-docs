---
title: Azure authentication with user credentials
description: An overview of the Azure SDK for Java concepts related to authenticating applications with user credentials
author: g2vinay
ms.date: 01/06/2021
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: vigera
---

# Azure authentication with user credentials

This article looks at how the Azure Identity library supports Azure Active Directory token authentication with user-provided credentials. This support is made possible through a set of TokenCredential implementations discussed below.

This article covers the following topics:

* [Device Code Credential](#device-code-credential)
* [Interactive Browser Credential](#interactive-browser-credential)
* [Username Password Credential](#username-password-credential)

## Device code credential

The device code credential interactively authenticates a user on devices with limited UI. It works by prompting the user to visit a login URL on a browser-enabled machine when the application attempts to authenticate. The user then enters the device code mentioned in the instructions along with their login credentials. Upon successful authentication, the application that requested authentication gets authenticated successfully on the device it's running on.

More conceptual details can be found here for [Device code authentication](/azure/active-directory/develop/v2-oauth2-device-code).

### Enable applications for device code flow

In order to authenticate a user through device code flow, use the following steps:

1. Go to Azure Active Directory in Azure portal and find your app registration.
2. Navigate to the **Authentication** section.
3. Under **Suggested Redirected URIs**, check the URI that ends with `/common/oauth2/nativeclient`.
4. Under **Default Client Type**, select `yes` for `Treat application as a public client`.

These steps will let the application authenticate, but it still won't have permission to log you into Active Directory, or access resources on your behalf. To address this issue, navigate to **API Permissions**, and enable Microsoft Graph and the resources you want to access, such as Azure Service Management, Key Vault, and so on.

You also need to be the admin of your tenant to grant consent to your application when you log in for the first time. Also note that after 2018 your Active Directory may require your application to be multi-tenant. Select **Accounts in any organizational directory** on the **Authentication** panel (where you enabled Device Code) to make your application a multi-tenant app.

### Authenticating a user account with device code flow

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `DeviceCodeCredential` on an IoT device.

```java
/**
 * Authenticate with device code credential.
 */
DeviceCodeCredential deviceCodeCredential = new DeviceCodeCredentialBuilder()
    .challengeConsumer(challenge -> {
    // lets user know of the challenge
    System.out.println(challenge.getMessage());
    }).build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://{YOUR_KEY_VAULT_NAME}.vault.azure.net")
    .credential(deviceCodeCredential)
    .buildClient();
```

## Interactive browser credential

This credential interactively authenticates a user with the default system browser and offers a smooth authentication experience by letting users use their own credentials to authenticate their application.

### Enable applications for interactive browser OAuth 2 flow

Register an application in Azure Active Directory with permissions to log in on behalf of a user to use InteractiveBrowserCredential. Follow all the steps above for device code flow to register your application to support logging you into Active Directory and access certain resources. As mentioned previously, an admin of your tenant must grant consent to your application before any user account can log in.

You may notice in `InteractiveBrowserCredentialBuilder`, a redirect URL is required, and you need to add the redirect URL to the Redirect URIs subsection under the Authentication section of your registered AAD application.

### Authenticating a user account interactively in the browser

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `InteractiveBrowserCredential`.

```java
/**
 * Authenticate interactively in the browser.
 */
InteractiveBrowserCredential interactiveBrowserCredential = new InteractiveBrowserCredentialBuilder()
    .clientId("<YOUR_APP_CLIENT ID>")
    .redirectUrl("YOUR_APP_REGISTERED_REDIRECT_URL")
    .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://{YOUR_KEY_VAULT_NAME}.vault.azure.net")
    .credential(interactiveBrowserCredential)
    .buildClient();
```

## Username password credential

The `UsernamePasswordCredential` helps to authenticate a public client application using the user credentials that don't require multi factor authentication. This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `UsernamePasswordCredential`. The user must **not** have Multi-factor auth turned on.

More conceptual details can be found here for [Username + password authentication](/azure/active-directory/develop/v2-oauth-ropc).

```java
/**
 * Authenticate with username, password.
 */
UsernamePasswordCredential usernamePasswordCredential = new UsernamePasswordCredentialBuilder()
    .clientId("<YOUR_APP_CLIENT_ID>")
    .username("<YOUR_USERNAME>")
    .password("<YOUR_PASSWORD>")
    .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://{YOUR_KEY_VAULT_NAME}.vault.azure.net")
    .credential(usernamePasswordCredential)
    .buildClient();
```

## Next steps

This article has covered authentication with user credentials, which is one of the ways you can authenticate in the Azure SDK for Java. The following articles describe other authentication methods:

* [Azure authentication in development environments](java-sdk-identity-dev-env-auth.md)
* [Authenticating applications hosted in Azure](java-sdk-identity-azure-hosted-auth.md)
* [Authentication with service principals](java-sdk-identity-service-principal-auth.md)

Once you've mastered authentication, consider looking into the [logging functionality](java-sdk-logging-overview.md) offered by the Azure SDK for Java.

<!-- LINKS -->
[secrets_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets

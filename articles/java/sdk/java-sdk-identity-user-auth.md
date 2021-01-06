---
title: Authenticating with User Credentials
description: An overview of the Azure SDK for Java concepts related to authenticating applications with user credentials
ms.date: 01/06/2021
ms.topic: conceptual
ms.custom: devx-track-java
---

# Authenticating with User Credentials

The Azure Identity library provides Azure Active Directory token authentication support for applications running locally on developer machines through a set of TokenCredential implementations.

* [Device Code Credential](#device-code-credential)
* [Interactive Browser Credential](#interactive-browser-credential)
* [Username Password Credential](#username-password-credential)

## Device Code Credential

The Device Code Credential interactively authenticates a user on devices with limited UI. When the application runs and requests authentication via Device Code Credential, the user is then asked to visit the login URL on any browser supported machine. The user then enters the device code mentioned in the instructions along with their log in credentials. Upon successful authentication, the application that requested authentication gets authenticated successfully on the device its running on.

More conceptual details can be found here for [Device code authentication](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-device-code).

### Enable applications for device code flow

In order to authenticate a user through device code flow, you need to:

1. Go to Azure Active Directory on Azure portal and find your app registration.
2. Navigate to Authentication section.
3. Under Suggested Redirected URIs check the URI that ends with `/common/oauth2/nativeclient`.
4. Under Default Client Type, select `yes` for `Treat application as a public client`.

This will let the application authenticate, but the application still doesn't have permission to log you into Active Directory, or access resources on your behalf.

Navigate to API Permissions, and enable Microsoft Graph, and the resources you want to access, for example, Azure Service Management, Key Vault, etc.

You also need to be the admin of your tenant to grant consent to your application when you log in for the first time. Also note after 2018 your Active Directory may require your application to be multi-tenant. Select "Accounts in any organizational directory" under Authentication panel (where you enabled Device Code) to make your application a multi-tenant app.

### Authenticating a user account with device code flow

This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `DeviceCodeCredential` on an IoT device.

```java
/**
* Authenticate with device code credential.
*/
public void createDeviceCodeCredential() {
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
}
```

## Interactive Browser Credential

This credential interactively authenticates a user with the default system browser and offers a smooth authentication experience by letting users use their own credentials to authenticate their application.

### Enable applications for interactive browser oauth 2 flow

Register an application in Azure Active Directory with permissions to log in on behalf of a user to use InteractiveBrowserCredential. Follow all the steps above for device code flow to register your application to support logging you into Active Directory and access certain resources. Note the same limitations apply that an admin of your tenant must grant consent to your application before any user account can log in.

You may notice in `InteractiveBrowserCredentialBuilder`, a redirect URL is required, and you need to add the redirect URL to add to the Redirect URIs sub section under Authentication section of your registered AAD application.

### Authenticating a user account interactively in the browser

This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `InteractiveBrowserCredential`.

```java
/**
* Authenticate interactively in the browser.
*/
public void createInteractiveBrowserCredential() {
    InteractiveBrowserCredential interactiveBrowserCredential = new InteractiveBrowserCredentialBuilder()
        .clientId("<YOUR_APP_CLIENT ID>")
        .redirectUrl("YOUR_APP_REGISTERED_REDIRECT_URL")
        .build();

    // Azure SDK client builders accept the credential as a parameter
    SecretClient client = new SecretClientBuilder()
        .vaultUrl("https://{YOUR_KEY_VAULT_NAME}.vault.azure.net")
        .credential(interactiveBrowserCredential)
        .buildClient();
}
```

## Username Password Credential

The `UsernamePasswordCredential` helps to authenticate a public client application using the user credentials that don't require multi factor authentication. This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `UsernamePasswordCredential`. The user must **not** have Multi-factor auth turned on.

More conceptual details can be found here for [Username + password authentication](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth-ropc).

```java
/**
* Authenticate with username, password.
*/
public void createUserNamePasswordCredential() {
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
}
```

<!-- LINKS -->
[secrets_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets

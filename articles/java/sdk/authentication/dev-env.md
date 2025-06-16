---
title: Azure authentication in Java development environments
titleSuffix: Azure SDK for Java
description: Provides an overview of the Azure SDK for Java concepts related to authenticating within dev environments.
ms.date: 10/15/2024
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: vigera
---

# Azure authentication in Java development environments

This article provides an overview of the Azure Identity library support for Microsoft Entra token authentication. This support enables authentication for applications running locally on developer machines through a set of `TokenCredential` implementations.

This article covers the following subjects:

* [Device code credential](#device-code-credential)
* [Interactive browser credential](#interactive-browser-credential)
* [Azure CLI credential](#azure-cli-credential)
* [IntelliJ credential](#intellij-credential)

For troubleshooting development environment authentication issues, see [Troubleshoot development environment authentication](../troubleshooting-authentication-dev-env.md).

## Device code credential

The device code credential interactively authenticates a user on devices with limited UI. It works by prompting the user to visit a sign-in URL on a browser-enabled machine when the application attempts to authenticate. The user then enters the device code mentioned in the instructions along with their sign-in credentials. Upon successful authentication, the application that requested authentication gets authenticated successfully on the device it's running on.

For more information, see [Microsoft identity platform and the OAuth 2.0 device authorization grant flow](/azure/active-directory/develop/v2-oauth2-device-code).

### Enable applications for device code flow

To authenticate a user through device code flow, do the following steps:

1. Go to Microsoft Entra ID in the Azure portal and find your app registration.
2. Navigate to the **Authentication** section.
3. Under **Suggested Redirected URIs**, check the URI that ends with `/common/oauth2/nativeclient`.
4. Under **Default Client Type**, select **yes** for **Treat application as a public client**.

These steps enable the application to authenticate, but it still doesn't have permission to sign you into Microsoft Entra ID, or access resources on your behalf. To address this issue, navigate to **API Permissions**, and enable Microsoft Graph and the resources you want to access.

You must also be the admin of your tenant to grant consent to your application when you sign in for the first time.

If you can't configure the device code flow option on your Microsoft Entra ID, then it may require your app to be multi- tenant. To make your app multi-tenant, navigate to the **Authentication** panel, then select **Accounts in any organizational directory**. Then, select **yes** for **Treat application as Public Client**.

### Authenticate a user account with device code flow

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `DeviceCodeCredential` on an IoT device.

```java
DeviceCodeCredential deviceCodeCredential = new DeviceCodeCredentialBuilder()
  .challengeConsumer(challenge -> {
    // lets user know of the challenge
    System.out.println(challenge.getMessage());
  }).build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://<your Key Vault name>.vault.azure.net")
  .credential(deviceCodeCredential)
  .buildClient();
```

## Interactive browser credential

This credential interactively authenticates a user with the default system browser and offers a smooth authentication experience by letting you use your own credentials to authenticate your application.

### Enable applications for interactive browser OAuth 2 flow

To use `InteractiveBrowserCredential`, you need to register an application in Microsoft Entra ID with permissions to sign in on behalf of a user. Follow the earlier steps for device code flow to register your application. As mentioned previously, an admin of your tenant must grant consent to your application before any user account can sign in.

You may notice that in `InteractiveBrowserCredentialBuilder`, a redirect URL is required. Add the redirect URL to the **Redirect URIs** subsection under the **Authentication** section of your registered Microsoft Entra application.

### Authenticate a user account interactively in the browser

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `InteractiveBrowserCredential`.

```java
InteractiveBrowserCredential interactiveBrowserCredential = new InteractiveBrowserCredentialBuilder()
  .clientId("<your client ID>")
  .redirectUrl("http://localhost:8765")
  .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://<your Key Vault name>.vault.azure.net")
  .credential(interactiveBrowserCredential)
  .buildClient();
```

## Azure CLI credential

The Azure CLI credential authenticates in a development environment with the enabled user or service principal in Azure CLI. It uses the Azure CLI given a user that is already signed into it, and uses the CLI to authenticate the application against Microsoft Entra ID.

### Sign in Azure CLI for AzureCliCredential

Sign in as a user with the following [Azure CLI](/cli/azure) command:

```azurecli
az login
```

Sign in as a service principal using the following command:

```azurecli
az login \
    --service-principal \
    --username <client-ID> \
    --password <client-secret> \
    --tenant <tenant-ID>
```

If the account or service principal has access to multiple tenants, make sure the desired tenant or subscription is in the state "Enabled" in the output from the following command:

```azurecli
az account list
```

Before you use `AzureCliCredential` in code, run the following command to verify that the account has been successfully configured.

```azurecli
az account get-access-token
```

You may need to repeat this process after a certain time period, depending on the refresh token validity in your organization. Generally, the refresh token validity period is a few weeks to a few months. `AzureCliCredential` prompts you to sign in again.

### Authenticate a user account with Azure CLI

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `AzureCliCredential` on a workstation with Azure CLI installed and signed in.

```java
AzureCliCredential cliCredential = new AzureCliCredentialBuilder().build();

// Azure SDK client builders accept the credential as a parameter.
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://<your Key Vault name>.vault.azure.net")
  .credential(cliCredential)
  .buildClient();
```

## IntelliJ credential

The IntelliJ credential authenticates in a development environment with the account in Azure Toolkit for IntelliJ. It uses the signed-in user information on the IntelliJ IDE and uses it to authenticate the application against Microsoft Entra ID.

### Sign in Azure Toolkit for IntelliJ for IntelliJCredential

Use the following steps to sign in:

1. In your IntelliJ window, open **File > Settings > Plugins**.
1. Search for "Azure Toolkit for IntelliJ" in the marketplace. Install and restart IDE.
1. Find the new menu item **Tools > Azure > Azure Sign In**
1. **Device Login** helps you sign in as a user account. Follow the instructions to sign in on the `login.microsoftonline.com` website with the device code. IntelliJ prompts you to select your subscriptions. Select the subscription with the resources that you want to access.

### Authenticate a user account with IntelliJ IDEA

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `IntelliJCredential` on a workstation where IntelliJ IDEA is installed, and the user has signed in with an Azure account to the Azure Toolkit for IntelliJ.

```java
IntelliJCredential intelliJCredential = new IntelliJCredentialBuilder()
  .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://<your Key Vault name>.vault.azure.net")
  .credential(intelliJCredential)
  .buildClient();
```

## Next steps

This article covered authentication during development using credentials available on your computer. This form of authentication is one of multiple ways you can authenticate in the Azure SDK for Java. The following articles describe other ways:

* [Authenticating applications hosted in Azure](azure-hosted-apps.md)
* [Authentication with service principals](service-principal.md)
* [Authentication with user credentials](user.md)

If you run into issues related to development environment authentication, see [Troubleshoot development environment authentication](../troubleshooting-authentication-dev-env.md).

After you've mastered authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

<!-- LINKS -->
[secrets_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets

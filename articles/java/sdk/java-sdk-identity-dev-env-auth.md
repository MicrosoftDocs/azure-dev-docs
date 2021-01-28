---
title: Azure Authentication in Java development environments
description: An overview of the Azure SDK for Java concepts related to authenticating within dev environments
author: g2vinay
ms.date: 01/06/2021
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: vigera
---

# Azure Authentication in Java development environments

This article provides an overview of the Azure Identity library support for Azure Active Directory token authentication for applications running locally on developer machines through a set of `TokenCredential` implementations.

Topics covered in this article include:

* [Device Code Credential](#device-code-credential)
* [Interactive Browser Credential](#interactive-browser-credential)
* [Azure CLI Credential](#azure-cli-credential)
* [IntelliJ Credential](#intellij-credential)
* [Visual Studio Code Credential](#visual-studio-code-credential)

## Device Code Credential

The Device Code Credential interactively authenticates a user on devices with limited UI. When the application runs and requests authentication via Device Code Credential, the user is then asked to visit the login URL on any browser supported machine. The user then enters the device code mentioned in the instructions along with their login credentials. Upon successful authentication, the application that requested authentication gets authenticated successfully on the device it's running on.

More conceptual details can be found here for [Device code authentication](/azure/active-directory/develop/v2-oauth2-device-code).

### Enable applications for device code flow

In order to authenticate a user through device code flow, you need to:

1. Go to Azure Active Directory in the Azure portal and find your app registration.
2. Navigate to the **Authentication** section.
3. Under **Suggested Redirected URIs** check the URI that ends with `/common/oauth2/nativeclient`.
4. Under **Default Client Type**, select *yes* for **Treat application as a public client**.

This will let the application authenticate, but the application still doesn't have permission to log you into Active Directory, or access resources on your behalf.

Navigate to **API Permissions**, and enable Microsoft Graph, and the resources you want to access, such as Azure Service Management, Key Vault, and so on.

You must also be the admin of your tenant to grant consent to your application when you log in for the first time. Also note after 2018 your Active Directory may require your application to be multi-tenant. Select **Accounts in any organizational directory** on the **Authentication** panel (where you enabled Device Code) to make your application a multi-tenant app.

### Authenticating a user account with device code flow

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `DeviceCodeCredential` on an IoT device.

```java
DeviceCodeCredential deviceCodeCredential = new DeviceCodeCredentialBuilder()
  .challengeConsumer(challenge -> {
    // lets user know of the challenge
    System.out.println(challenge.getMessage());
  }).build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
  .credential(deviceCodeCredential)
  .buildClient();
```

## Interactive Browser Credential

This credential interactively authenticates a user with the default system browser and offers a smooth authentication experience by letting users use their own credentials to authenticate their application.

### Enable applications for interactive browser OAuth 2 flow

To use `InteractiveBrowserCredential`, you need to register an application in Azure Active Directory with permissions to log in on behalf of a user. Follow all the steps above for device code flow to register your application so that it supports logging you into Active Directory and accessing certain resources. As mentioned previously, an admin of your tenant must grant consent to your application before any user account can log in.

You may notice in `InteractiveBrowserCredentialBuilder`, a redirect URL is required, and you need to add the redirect URL to add to the Redirect URIs sub section under Authentication section of your registered AAD application.

### Authenticating a user account interactively in the browser

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `InteractiveBrowserCredential`.

```java
InteractiveBrowserCredential interactiveBrowserCredential = new InteractiveBrowserCredentialBuilder()
  .clientId("<YOUR CLIENT ID>")
  .redirectUrl("http://localhost:8765")
  .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
  .credential(interactiveBrowserCredential)
  .buildClient();
```

## Azure CLI Credential

The Visual Studio Code credential authenticates in a development environment with the enabled user or service principal in Azure CLI. It uses the Azure CLI given a user is already logged into it and uses the CLI to authenticate the application against Azure Active Directory.

### Sign in Azure CLI for AzureCliCredential

Sign in [Azure CLI][azure_cli] with command

```bash
az login
```

as a user, or

```bash
az login --service-principal --username <client-id> --password <client-secret> --tenant <tenant-id>
```

as a service principal.

If the account / service principal has access to multiple tenants, make sure the desired tenant or subscription is in the state "Enabled" in the output from command:

```bash
az account list
```

Before you use AzureCliCredential in the code, run

```bash
az account get-access-token
```

to verify the account has been successfully configured.

You may have to repeat this process after a certain period (usually a few weeks to a few months based on the refresh token validity configured in your organization). AzureCliCredential will prompt you to sign in again.

### Authenticating a user account with Azure CLI

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `AzureCliCredential` on a workstation with Azure CLI installed and signed in.

```java
AzureCliCredential cliCredential = new AzureCliCredentialBuilder().build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
  .credential(cliCredential)
  .buildClient();
```

## IntelliJ Credential

The Visual Studio Code credential authenticates in a development environment with the account in Azure Toolkit for IntelliJ. It uses the logged in user information on the IntelliJ IDE and uses it to authenticate the application against Azure Active Directory.

## Sign in Azure Toolkit for IntelliJ for IntelliJCredential

Follow the steps outlined below:

1. In your IntelliJ window, open **File > Settings > Plugins**. Search “Azure Toolkit for IntelliJ” in the marketplace. Install and restart IDE.
2. Find the new menu item **Tools > Azure > Azure Sign In…**
3. Device Login will help you log in as a user account. Follow the instructions to log in on the login.microsoftonline.com website with the device code. IntelliJ will prompt you to select your subscriptions. Please select the appropriate subscription for which you want to access its resources.

On Windows, you will also need the KeePass database path to read IntelliJ credentials. You can find the path in IntelliJ settings under **File > Settings > Appearance & Behavior > System Settings > Passwords**. Note down the location of the KeePassDatabase path.

## Authenticating a user account with IntelliJ IDEA

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `IntelliJCredential` on a workstation with IntelliJ IDEA installed, and the user has signed in with an Azure account.

```java
IntelliJCredential intelliJCredential = new IntelliJCredentialBuilder()
  // KeePass configuration required only for Windows. No configuration needed for Linux / Mac
  .keePassDatabasePath("C:\\Users\\user\\AppData\\Roaming\\JetBrains\\IdeaIC2020.1\\c.kdbx")
  .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
  .credential(intelliJCredential)
  .buildClient();
```

## Visual Studio Code Credential

The Visual Studio Code credential authenticates in a development environment with the account in Visual Studio Azure Account extension. It uses the logged in user information on the Visual Studio Code IDE and uses it to authenticate the application against Azure Active Directory.

### Sign in Visual Studio Code Azure Account Extension for VisualStudioCodeCredential

The Visual Studio Code authentication is handled by an integration with the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account). To use, install the Azure Account extension, then use **View > Command Palette** to execute the **Azure: Sign In** command:

This will open a browser that allows you to sign in to Azure. Once you have completed the login process, you can close the browser as directed. Running your application (either in the debugger or anywhere on the development machine) will use the credential from your sign-in.

### Authenticating a user account with Visual Studio Code

The following example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `VisualStudioCodeCredential` on a workstation with Visual Studio Code installed, and the user has signed in with an Azure account.

```java
VisualStudioCodeCredential visualStudioCodeCredential = new VisualStudioCodeCredentialBuilder().build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
  .credential(visualStudioCodeCredential)
  .buildClient();
```

## Next steps

In this article we have covered authentication during development using credentials available on a developers computer, which is one of the ways in which developers can authenticate in the Azure SDK for Java. There are other authentication methods that readers may wish to review:

* [Authenticating applications hosted in Azure](java-sdk-identity-azure-hosted-auth.md)
* [Authentication with Service Principals](java-sdk-identity-service-principal-auth.md)
* [Authentication with User Credentials](java-sdk-identity-user-auth.md)

Once you have mastered authentication, consider looking into the [logging functionality](java-sdk-logging-overview.md) offered by the Azure SDK for Java.

<!-- LINKS -->
[azure_cli]: /cli/azure
[secrets_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets

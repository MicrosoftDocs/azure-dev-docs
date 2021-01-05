# Azure Authentication in Development Environments

The Azure Identity library provides Azure Active Directory token authentication support for applications running locally on developer machines through a set of TokenCredential implementations.

* [Device Code Credential](#device-code-credential)
* [Interactive Browser Credential](#interactive-browser-credential)
* [Azure CLI Credential](#azure-cli-credential)
* [IntelliJ Credential](#intellij-credential)
* [Visual Studio Code Credential](#visual-studio-code-credential)

## Device Code Credential

The Device Code Credential interactively authenticates a user on devices with limited UI. When the application runs and requests authentication via Device Code Credential, the user is then asked to visit the login URL on any browser supported machine. The user then enters the device code mentioned in the instructions along with their login credentials. Upon successful authentication, the application that requested authentication gets authenticated successfully on the device its running on.

More conceptual details can be found here for [Device code authentication](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-device-code).

### Enable applications for device code flow

In order to authenticate a user through device code flow, you need to:

1. Go to Azure Active Directory on the Azure portal and find your app registration
2. Navigate to Authentication section
3. Under Suggested Redirected URIs check the URI that ends with `/common/oauth2/nativeclient`
4. Under Default Client Type, select `yes` for `Treat application as a public client`

This will let the application authenticate, but the application still doesn't have permission to log you into Active Directory, or access resources on your behalf.

Navigate to API Permissions, and enable Microsoft Graph, and the resources you want to access, e.g., Azure Service Management, Key Vault, etc.

Note that you also need to be the admin of your tenant to grant consent to your application when you log in for the first time. Also note after 2018 your Active Directory may require your application to be multi-tenant. Select "Accounts in any organizational directory" under Authentication panel (where you enabled Device Code) to make your application a multi-tenant app.

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
  .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
  .credential(deviceCodeCredential)
  .buildClient();
}
```

## Interactive Browser Credential

This credential interactively authenticates a user with the default system browser and offers a smooth authentication experience by letting users use their own credentials to authenticate their application.

### Enable applications for interactive browser oauth 2 flow

You need to register an application in Azure Active Directory with permissions to log in on behalf of a user to use InteractiveBrowserCredential. Follow all the steps above for device code flow to register your application to support logging you into Active Directory and access certain resources. Note the same limitations apply that an admin of your tenant must grant consent to your application before any user account can log in.

You may notice in `InteractiveBrowserCredentialBuilder`, a redirect URL is required, and you need to add the redirect URL to add to the Redirect URIs sub section under Authentication section of your registered AAD application.

### Authenticating a user account interactively in the browser

This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `InteractiveBrowserCredential`.

```java
/**
* Authenticate interactively in the browser.
*/
public void createInteractiveBrowserCredential() {
  InteractiveBrowserCredential interactiveBrowserCredential = new InteractiveBrowserCredentialBuilder()
    .clientId("<YOUR CLIENT ID>")
    .redirectUrl("http://localhost:8765")
    .build();

  // Azure SDK client builders accept the credential as a parameter
  SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
    .credential(interactiveBrowserCredential)
    .buildClient();
}
```

## Azure CLI Credential

The Visual Studio Code credential authenticate in a development environment with the enabled user or service principal in Azure CLI. It utilizes the `Azure CLI` given a user is already logged into it and uses the CLI to authenticate the application against Azure Active Directory.

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

This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `AzureCliCredential` on a workstation with Azure CLI installed and signed in.

```java
/**
* Authenticate with Azure CLI.
*/
public void createAzureCliCredential() {
  AzureCliCredential cliCredential = new AzureCliCredentialBuilder().build();

  // Azure SDK client builders accept the credential as a parameter
  SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
    .credential(cliCredential)
    .buildClient();
}
```

## IntelliJ Credential

The Visual Studio Code credential authenticates in a development environment with the account in Azure Toolkit for IntelliJ. It utilizes the logged in user information on the `IntelliJ IDE` and uses it to authenticate the application against Azure Active Directory.

## Sign in Azure Toolkit for IntelliJ for IntelliJCredential

In your IntelliJ window, open File -> Settings -> Plugins. Search “Azure Toolkit for IntelliJ” in the marketplace. Install and restart IDE.

Now you should be able to find a new menu item Tools -> Azure -> Azure Sign In…

Device Login will help you log in as a user account. Follow the instructions to log in on the login.microsoftonline.com website with the device code. IntelliJ will prompt you to select your subscriptions. Please select the 

On Windows, you will also need the KeePass database path to read IntelliJ credentials. You can find the path in IntelliJ settings under File -> Settings -> Appearance & Behavior -> System Settings -> Passwords. Note down the location of the KeePassDatabase path.

## Authenticating a user account with IntelliJ IDEA

This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `IntelliJCredential` on a workstation with IntelliJ IDEA installed, and the user has signed in with an Azure account.

```java
/**
* Authenticate with IntelliJ IDEA.
*/
public void createIntelliJCredential() {
  IntelliJCredential intelliJCredential = new IntelliJCredentialBuilder()
    // KeePass configuration required only for Windows. No configuration needed for Linux / Mac
    .keePassDatabasePath("C:\\Users\\user\\AppData\\Roaming\\JetBrains\\IdeaIC2020.1\\c.kdbx")
    .build();

  // Azure SDK client builders accept the credential as a parameter
  SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
    .credential(intelliJCredential)
    .buildClient();
}
```

## Visual Studio Code Credential

The Visual Studio Code credential authenticates in a development environment with the account in Visual Studio Azure Account extension. It utilizes the logged in user information on the `Visual Studio Code IDE` and uses it to authenticate the application against Azure Active Directory.

### Sign in Visual Studio Code Azure Account Extension for VisualStudioCodeCredential

The Visual Studio Code authentication is handled by an integration with the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account). To use, install the Azure Account extension, then use View->Command Palette to execute the “Azure: Sign In” command:

This will open a browser that allows you to sign in to Azure. Once you have completed the login process, you can close the browser as directed. Running your application (either in the debugger or anywhere on the development machine) will use the credential from your sign-in.

### Authenticating a user account with Visual Studio Code

This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `VisualStudioCodeCredential` on a workstation with Visual Studio Code installed, and the user has signed in with an Azure account.

```java
/**
* Authenticate with Visual Studio Code.
*/
public void createVisualStudioCodeCredential() {
  VisualStudioCodeCredential visualStudioCodeCredential = new VisualStudioCodeCredentialBuilder().build();

  // Azure SDK client builders accept the credential as a parameter
  SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
    .credential(visualStudioCodeCredential)
    .buildClient();
}
```

<!-- LINKS -->
[azure_cli]: https://docs.microsoft.com/cli/azure
[secrets_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets

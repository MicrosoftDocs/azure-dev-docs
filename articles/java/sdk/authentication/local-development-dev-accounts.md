---
title: Authenticate Java apps during local development by using developer accounts
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Java apps to Azure services during local development by using developer accounts and tools like Azure CLI, Azure Developer CLI, Azure PowerShell, Visual Studio Code, and IntelliJ IDEA.
ms.date: 02/05/2026
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-generated
---

# Authenticate Java apps to Azure services during local development by using developer accounts

During local development, applications need to authenticate to Azure to access various Azure services. You can authenticate locally by using one of the following approaches:

- Use a developer account with one of the developer tools supported by the Azure Identity library.
- Use a service principal. For more information, see [Authenticate Java apps to Azure services during local development by using service principals](local-development-service-principal.md).

This article explains how to authenticate by using a developer account with tools supported by the Azure Identity library. In this article, you learn:

- How to use Microsoft Entra groups to efficiently manage permissions for multiple developer accounts.
- How to assign roles to developer accounts to scope permissions.
- How to sign in to supported local development tools.
- How to authenticate by using a developer account from your app code.

## Supported developer tools for authentication

During local development, an app can authenticate to Azure by using your Azure credentials. For this authentication to work, you must be signed in to Azure from a developer tool such as one of the following:

- Azure CLI
- Azure Developer CLI
- Azure PowerShell
- Visual Studio Code
- IntelliJ IDEA

The Azure Identity library can detect that the developer is signed in from one of these tools. The library can then obtain the Microsoft Entra access token via the tool to authenticate the app to Azure as the signed-in user.

This approach takes advantage of the developer's existing Azure accounts to streamline the authentication process. However, a developer's account likely has more permissions than the app requires, therefore exceeding the permissions the app runs with in production. As an alternative, you can [create application service principals to use during local development](local-development-service-principal.md), which can be scoped to have only the access needed by the app.

[!INCLUDE [auth-create-entra-group](../../../includes/authentication/create-entra-group.md)]

[!INCLUDE [auth-assign-group-roles](../../../includes/authentication/assign-group-roles.md)]

## Sign in to Azure by using developer tooling

Next, sign in to Azure by using one of the developer tools that you can use to perform authentication in your development environment. The account you authenticate should also exist in the Microsoft Entra group you created and configured earlier.

### [Visual Studio Code](#tab/sign-in-vscode)

[!INCLUDE [sign-in-visual-studio-code](../../../includes/authentication/sign-in-visual-studio-code.md)]

### [IntelliJ IDEA](#tab/sign-in-intellij)

Developer using IntelliJ can authenticate by using the Azure Toolkit for IntelliJ plugin. Use the following steps to sign in:

1. In your IntelliJ window, open **File > Settings > Plugins**.
1. Search for "Azure Toolkit for IntelliJ" in the marketplace. Install and restart the IDE.
1. Find the new menu item **Tools > Azure > Azure Sign In**.
1. **Device Login** helps you sign in as a user account. Follow the instructions to sign in on the `login.microsoftonline.com` website by using the device code. IntelliJ prompts you to select your subscriptions. Select the subscription with the resources that you want to access.

### [Azure CLI](#tab/sign-in-azure-cli)

[!INCLUDE [sign-in-azure-cli](../../../includes/authentication/sign-in-azure-cli.md)]

### [Azure Developer CLI](#tab/sign-in-azure-developer-cli)

[!INCLUDE [sign-in-azure-developer-cli](../../../includes/authentication/sign-in-azure-developer-cli.md)]

### [Azure PowerShell](#tab/sign-in-azure-powershell)

[!INCLUDE [sign-in-azure-powershell](../../../includes/authentication/sign-in-azure-powershell.md)]

---

## Authenticate to Azure services from your app

The [Azure Identity library](/java/api/com.azure.identity) provides implementations of [TokenCredential](/java/api/com.azure.core.credential.tokencredential) that support various scenarios and Microsoft Entra authentication flows. The following steps show you how to use [DefaultAzureCredential](credential-chains.md#defaultazurecredential-overview) or a specific development tool credential when working with user accounts locally.

### Implement the code

Add the `azure-identity` dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

You access Azure services by using specialized client classes from the Azure SDK client libraries. The following code examples show you how to configure credentials for local development authentication.

#### Use DefaultAzureCredential

Use `DefaultAzureCredential` for local development and Azure-hosted apps because it automatically switches between environments. In development, it discovers credentials from Azure CLI, Azure Developer CLI, Azure PowerShell, Visual Studio Code, IntelliJ IDEA, or environment variables. In Azure, it automatically discovers managed identity credentials.

```java
import com.azure.identity.DefaultAzureCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// DefaultAzureCredential automatically discovers and uses the appropriate credential
DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

#### Use a specific tool credential

When your team uses multiple development tools to authenticate with Azure, prefer a local development-optimized instance of `DefaultAzureCredential` over tool-specific credentials. However, if you need to use a specific tool credential, pass a `TokenCredential` instance corresponding to the development tool to the Azure SDK client builder. The following example shows how to authenticate by using `AzureCliCredential`:

```java
import com.azure.identity.AzureCliCredential;
import com.azure.identity.AzureCliCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

AzureCliCredential credential = new AzureCliCredentialBuilder().build();

SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

Each tool credential follows the same pattern. Replace the credential type and its corresponding builder as needed:

- `AzureCliCredential` / `AzureCliCredentialBuilder`
- `AzureDeveloperCliCredential` / `AzureDeveloperCliCredentialBuilder`
- `AzurePowerShellCredential` / `AzurePowerShellCredentialBuilder`
- `IntelliJCredential` / `IntelliJCredentialBuilder`
- `VisualStudioCodeCredential` / `VisualStudioCodeCredentialBuilder`

## Next steps

This article covered authentication during development by using credentials available on your computer. This form of authentication is one of multiple ways you can authenticate in the Azure SDK for Java. The following articles describe other ways:

- [Authenticate Java apps to Azure services during local development by using service principals](local-development-service-principal.md)
- [Authenticate Azure-hosted Java apps to Azure resources by using a system-assigned managed identity](system-assigned-managed-identity.md)
- [Authenticate Azure-hosted Java apps to Azure resources by using a user-assigned managed identity](user-assigned-managed-identity.md)

If you run into issues related to development environment authentication, see [Troubleshoot development environment authentication](../troubleshooting-authentication-dev-env.md).

After you master authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

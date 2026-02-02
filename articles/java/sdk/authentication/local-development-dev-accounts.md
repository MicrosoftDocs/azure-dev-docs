---
title: Authenticate Java apps during local development by using developer accounts
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Java apps to Azure services during local development by using developer accounts and tools like Azure CLI, Visual Studio Code, and IntelliJ IDEA.
ms.date: 02/02/2026
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-generated
---

# Authenticate Java apps to Azure services during local development by using developer accounts

During local development, applications need to authenticate to Azure to access various Azure services. Authenticate locally by using one of these approaches:

- Use a developer account with one of the [developer tools supported by the Azure Identity library](#supported-developer-tools-for-authentication).
- Use a [service principal](local-development-service-principal.md).

This article explains how to authenticate by using a developer account with tools supported by the Azure Identity library. In the sections ahead, you learn:

- How to use Microsoft Entra groups to efficiently manage permissions for multiple developer accounts.
- How to assign roles to developer accounts to scope permissions.
- How to sign in to supported local development tools.
- How to authenticate by using a developer account from your app code.

## Supported developer tools for authentication

During local development, an app can authenticate to Azure by using your Azure credentials. For this authentication to work, you must be signed in to Azure from one of the following developer tools:

- Azure CLI
- Azure Developer CLI
- Visual Studio Code
- IntelliJ IDEA

The Azure Identity library can detect that the developer is signed in from one of these tools. The library can then obtain the Microsoft Entra access token via the tool to authenticate the app to Azure as the signed-in user.

This approach takes advantage of the developer's existing Azure accounts to streamline the authentication process. However, a developer's account likely has more permissions than the app requires, therefore exceeding the permissions the app runs with in production. As an alternative, you can [create application service principals to use during local development](local-development-service-principal.md), which can be scoped to have only the access needed by the app.

## Create a Microsoft Entra group for local development

Create a Microsoft Entra group to encapsulate the roles (permissions) the app needs in local development rather than assigning the roles to individual service principal objects. This approach offers the following advantages:

- Every developer has the same roles assigned at the group level.
- If a new role is needed for the app, you only need to add it to the app group.
- If a new developer joins the team, you create a new application service principal for the developer and add it to the group, ensuring the developer has the right permissions to work on the app.

#### [Azure portal](#tab/azure-portal)

1. Go to the Microsoft Entra ID overview page in the Azure portal.
1. Select **All groups** from the left-hand menu.
1. On the **Groups** page, select **New group**.
1. On the **New group** page, fill out the following form fields:
   - **Group type**: Select **Security**.
   - **Group name**: Enter a name for the group that includes a reference to the app or environment name.
   - **Group description**: Enter a description that explains the purpose of the group.
1. Select the **No members selected** link under **Members** to add members to the group.
1. In the flyout panel that opens, search for the user you want to add and select them from the filtered results. Choose the **Select** button at the bottom of the panel to confirm your selection.
1. Select **Create** at the bottom of the **New group** page to create the group and return to the **All groups** page. If you don't see the new group listed, wait a moment and refresh the page.

#### [Azure CLI](#tab/azure-cli)

Run the following command to create a new group. Replace the placeholder values with appropriate values for your environment:

```azurecli
az ad group create \
    --display-name <group-name> \
    --mail-nickname <group-nickname> \
    --description "<group-description>"
```

To add a user to the group:

```azurecli
az ad group member add \
    --group <group-name> \
    --member-id <user-object-id>
```

To get a user's object ID:

```azurecli
az ad user show --id <user-principal-name> --query id --output tsv
```

---

## Assign roles to the group

Next, determine what roles (permissions) your app needs on what resources and assign those roles to the Microsoft Entra group you created. You can assign roles to groups at the resource, resource group, or subscription scope. The following example shows how to assign roles at the resource group scope, since most apps group all their Azure resources into a single resource group.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to the **Overview** page of the resource group that contains your app.
1. Select **Access control (IAM)** from the left navigation.
1. On the **Access control (IAM)** page, select **+ Add** and then choose **Add role assignment** from the drop-down menu. The **Add role assignment** page provides several tabs to configure and assign roles.
1. On the **Role** tab, use the search box to locate the role you want to assign. Select the role, and then choose **Next**.
1. On the **Members** tab:
   - For the **Assign access to** value, select **User, group, or service principal**.
   - For the **Members** value, choose **+ Select members** to open the **Select members** flyout panel.
   - Search for the Microsoft Entra group you created earlier and select it from the filtered results. Choose **Select** to select the group and close the flyout panel.
   - Select **Review + assign** at the bottom of the **Members** tab.
1. On the **Review + assign** tab, select **Review + assign** at the bottom of the page.

#### [Azure CLI](#tab/azure-cli)

Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to assign a role to the group.

```azurecli
az role assignment create \
    --assignee "<group-object-id>" \
    --role "<role-name>" \
    --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>"
```

To get the group's object ID:

```azurecli
az ad group show --group <group-name> --query id --output tsv
```

---

## Sign in to Azure by using developer tooling

Next, sign in to Azure by using one of several developer tools that you can use to perform authentication in your development environment. The account you authenticate should also exist in the Microsoft Entra group you created and configured earlier.

#### [Visual Studio Code](#tab/sign-in-vscode)

Developers using Visual Studio Code can authenticate by using the Azure Resources extension. Use the following steps to sign in to Azure through the Azure Resources extension:

1. Open Visual Studio Code and install the [Azure Resources extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups) if you haven't already.
1. Select the Azure icon in the Activity Bar to open the Azure Resources view.
1. In the Azure Resources view, select **Sign in to Azure...** and follow the prompts.

#### [IntelliJ IDEA](#tab/sign-in-intellij)

Developers using IntelliJ IDEA can authenticate by using the Azure Toolkit for IntelliJ plugin. Use the following steps to sign in:

1. In your IntelliJ window, open **File > Settings > Plugins**.
1. Search for "Azure Toolkit for IntelliJ" in the marketplace. Install and restart the IDE.
1. Find the new menu item **Tools > Azure > Azure Sign In**.
1. **Device Login** helps you sign in as a user account. Follow the instructions to sign in on the `login.microsoftonline.com` website by using the device code. IntelliJ prompts you to select your subscriptions. Select the subscription with the resources that you want to access.

#### [Azure CLI](#tab/sign-in-azure-cli)

Sign in as a user by using the following [Azure CLI](/cli/azure) command:

```azurecli
az login
```

If the account or service principal has access to multiple tenants, make sure the desired tenant or subscription is in the state "Enabled" in the output from the following command:

```azurecli
az account list
```

Before you use `AzureCliCredential` in code, run the following command to verify that the account is successfully configured:

```azurecli
az account get-access-token
```

You might need to repeat this process after a certain time period, depending on the refresh token validity in your organization. Generally, the refresh token validity period is a few weeks to a few months. `AzureCliCredential` prompts you to sign in again.

#### [Azure Developer CLI](#tab/sign-in-azd)

Sign in by using the Azure Developer CLI with the following command:

```bash
azd auth login
```

Follow the prompts to authenticate your account. After authentication, your credentials are stored and used by `AzureDeveloperCliCredential`.

---

## Authenticate to Azure services from your app

The [Azure Identity library](/java/api/com.azure.identity) provides implementations of [TokenCredential](/java/api/com.azure.core.credential.tokencredential) that support various scenarios and Microsoft Entra authentication flows. The following steps demonstrate how to use `DefaultAzureCredential` or a specific development tool credential when working with user accounts locally.

### Implement the code

Add the `azure-identity` dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

You access Azure services by using specialized client classes from the Azure SDK client libraries. The following code samples demonstrate how to configure credentials for local development authentication.

#### Use DefaultAzureCredential

Use `DefaultAzureCredential` for local development and Azure-hosted apps because it automatically switches between environments. In development, it discovers credentials from Azure CLI, Azure Developer CLI, Visual Studio Code, IntelliJ IDEA, or environment variables. In production on Azure, it automatically discovers managed identity credentials.

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

When your team uses multiple development tools to authenticate with Azure, prefer a local development-optimized instance of `DefaultAzureCredential` over tool-specific credentials. However, if you need to use a specific tool credential, the following examples demonstrate how to do so.

##### Azure CLI credential

The following example demonstrates authenticating by using `AzureCliCredential`:

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

##### IntelliJ IDEA credential

The following example demonstrates authenticating by using `IntelliJCredential` on a workstation where IntelliJ IDEA is installed and the user signs in with an Azure account to the Azure Toolkit for IntelliJ:

```java
import com.azure.identity.IntelliJCredential;
import com.azure.identity.IntelliJCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

IntelliJCredential credential = new IntelliJCredentialBuilder().build();

SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

##### Visual Studio Code credential

The following example demonstrates authenticating by using `VisualStudioCodeCredential`:

```java
import com.azure.identity.VisualStudioCodeCredential;
import com.azure.identity.VisualStudioCodeCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

VisualStudioCodeCredential credential = new VisualStudioCodeCredentialBuilder().build();

SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

## Next steps

This article covered authentication during development by using credentials available on your computer. This form of authentication is one of multiple ways you can authenticate in the Azure SDK for Java. The following articles describe other ways:

- [Authenticate locally using a service principal](local-development-service-principal.md)
- [Authenticate using a system-assigned managed identity](system-assigned-managed-identity.md)
- [Authenticate using a user-assigned managed identity](user-assigned-managed-identity.md)

If you run into issues related to development environment authentication, see [Troubleshoot development environment authentication](../troubleshooting-authentication-dev-env.md).

After you master authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

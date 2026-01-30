---
title: Authenticate Azure-hosted Java apps by using a user-assigned managed identity
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Azure-hosted Java apps to Azure resources using a user-assigned managed identity.
ms.date: 01/30/2026
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-generated
---

# Authenticate Azure-hosted Java apps to Azure resources by using a user-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). This approach is [supported for most Azure services](/entra/identity/managed-identities-azure-resources/managed-identities-status), including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. Discover more about different authentication techniques and approaches on the [authentication overview](overview.md) page. In the sections ahead, you learn:

- Essential managed identity concepts.
- How to create a user-assigned managed identity for your app.
- How to assign roles to the user-assigned managed identity.
- How to authenticate by using the user-assigned managed identity from your app code.

## Essential managed identity concepts

A managed identity enables your app to securely connect to other Azure resources without using secret keys or other application secrets. Internally, Azure tracks the identity and which resources it's allowed to connect to. Azure uses this information to automatically obtain Microsoft Entra tokens for the app to allow it to connect to other Azure resources.

There are two types of managed identities to consider when configuring your hosted app:

- **System-assigned managed identities** are enabled directly on an Azure resource and are tied to its life cycle. When you delete the resource, Azure automatically deletes the identity for you. System-assigned identities provide a minimalistic approach to using managed identities.
- **User-assigned managed identities** are created as standalone Azure resources and offer greater flexibility and capabilities. They're ideal for solutions involving multiple Azure resources that need to share the same identity and permissions. For example, if multiple virtual machines need to access the same set of Azure resources, a user-assigned managed identity provides reusability and optimized management.

> [!TIP]
> For more information about selecting and managing system-assigned managed identities and user-assigned managed identities, see [Managed identity best practice recommendations](/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations).

The following sections describe the steps to enable and use a user-assigned managed identity for an Azure-hosted app. If you need to use a system-assigned managed identity, see [Authenticate Azure-hosted Java apps to Azure resources using a system-assigned managed identity](system-assigned-managed-identity.md).

## Create a user-assigned managed identity

You can create user-assigned managed identities as standalone resources in your Azure subscription by using the Azure portal or the Azure CLI. You can run Azure CLI commands in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, enter **Managed identities** in the main search bar. Select the matching result under the **Services** section.
1. On the **Managed Identities** page, select **+ Create**.
1. On the **Create User Assigned Managed Identity** page, select a subscription, resource group, and region for the user-assigned managed identity. Then provide a name.
1. Select **Review + create** to review and validate your inputs.
1. Select **Create** to create the user-assigned managed identity.
1. After the identity is created, select **Go to resource**.
1. On the new identity's **Overview** page, copy the **Client ID** value to use for later when you configure the application code.

#### [Azure CLI](#tab/azure-cli)

Use the [az identity create](/cli/azure/identity#az-identity-create) command to create a user-assigned managed identity:

```azurecli
az identity create \
    --resource-group <resource-group-name> \
    --name <identity-name>
```

To get the client ID of the identity:

```azurecli
az identity show \
    --resource-group <resource-group-name> \
    --name <identity-name> \
    --query clientId \
    --output tsv
```

---

## Assign the managed identity to your app

You can associate a user-assigned managed identity with one or more Azure resources. All resources that use the identity gain the permissions applied through the identity's roles.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to the resource that hosts your app code, such as an Azure App Service or Azure Container Apps instance.
1. From the resource's **Overview** page, expand **Settings** and select **Identity** from the navigation.
1. On the **Identity** page, switch to the **User assigned** tab.
1. Select **+ Add** to open the **Add user assigned managed identity** panel.
1. On the **Add user assigned managed identity** panel, use the **Subscription** dropdown to filter the search results for your identities. Use the **User assigned managed identities** search box to locate the user-assigned managed identity you enabled for the Azure resource hosting your app.
1. Select the identity and choose **Add** at the bottom of the panel to continue.

#### [Azure CLI](#tab/azure-cli)

For Azure App Service, use the [az webapp identity assign](/cli/azure/webapp/identity#az-webapp-identity-assign) command:

```azurecli
az webapp identity assign \
    --resource-group <resource-group-name> \
    --name <app-service-name> \
    --identities <identity-resource-id>
```

For Azure Container Apps, use [az containerapp identity assign](/cli/azure/containerapp/identity#az-containerapp-identity-assign):

```azurecli
az containerapp identity assign \
    --resource-group <resource-group-name> \
    --name <container-app-name> \
    --user-assigned <identity-resource-id>
```

To get the identity's resource ID:

```azurecli
az identity show \
    --resource-group <resource-group-name> \
    --name <identity-name> \
    --query id \
    --output tsv
```

---

## Assign roles to the managed identity

Next, determine which roles your app needs and assign those roles to the managed identity. You can assign roles to a managed identity at the following scopes:

- **Resource**: The assigned roles only apply to that specific resource.
- **Resource group**: The assigned roles apply to all resources contained in the resource group.
- **Subscription**: The assigned roles apply to all resources contained in the subscription.

The following example shows how to assign roles at the resource group scope, since many apps manage all their related Azure resources using a single resource group.

#### [Azure portal](#tab/azure-portal)

1. Go to the **Overview** page of the resource group that contains the app with the user-assigned managed identity.
1. Select **Access control (IAM)** in the left navigation.
1. On **Access control (IAM)**, select **+ Add** in the top menu, and then choose **Add role assignment** to go to **Add role assignment**.
1. **Add role assignment** presents a tabbed, multistep workflow to assign roles to identities. On the initial **Role** tab, use the search box at the top to locate the role you want to assign to the identity.
1. Select the role from the results and then choose **Next** to move to the **Members** tab.
1. For the **Assign access to** option, select **Managed identity**.
1. For the **Members** option, choose **+ Select members** to open the **Select managed identities** panel.
1. On the **Select managed identities** panel, use the **Subscription** and **Managed identity** dropdowns to filter the search results for your identities. Use the **Select** search box to locate the user-assigned managed identity you enabled for the Azure resource hosting your app.
1. Select the identity and choose **Select** at the bottom of the panel to continue.
1. Select **Review + assign** at the bottom of the page.
1. On the final **Review + assign** tab, select **Review + assign** to complete the workflow.

#### [Azure CLI](#tab/azure-cli)

Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to assign a role to the managed identity:

```azurecli
# Get the principal ID of the user-assigned managed identity
principalId=$(az identity show \
    --resource-group <resource-group-name> \
    --name <identity-name> \
    --query principalId \
    --output tsv)

# Assign a role to the managed identity
az role assignment create \
    --assignee "$principalId" \
    --role "<role-name>" \
    --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>"
```

---

## Authenticate to Azure services from your app

The [Azure Identity library](/java/api/com.azure.identity) provides different credentials as implementations of `TokenCredential` that support various scenarios and Entra authentication flows. For user-assigned managed identities, specify the identity's client ID, resource ID, or object ID when you configure the credential.

### Implement the code

Add the `azure-identity` dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

You access Azure services by using specialized client classes from the Azure SDK client libraries. The following code samples demonstrate how to configure the credential for user-assigned managed identity authentication.

#### Use DefaultAzureCredential

Use `DefaultAzureCredential` as the credential for Azure-hosted apps. For user-assigned managed identities, configure the client ID by using the `managedIdentityClientId` method:

```java
import com.azure.identity.DefaultAzureCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// Configure DefaultAzureCredential with the user-assigned managed identity's client ID
DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
    .managedIdentityClientId("<user-assigned-managed-identity-client-id>")
    .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

#### Use ManagedIdentityCredential

If you want to explicitly use the managed identity credential and avoid the credential chain lookup in `DefaultAzureCredential`, use `ManagedIdentityCredential` directly. For user-assigned managed identities, you can specify the identity by using the client ID, resource ID, or object ID.

#### [Client ID](#tab/client-id)

Use the client ID to identify a managed identity when you configure applications or services that need to authenticate by using that identity.

Retrieve the client ID assigned to a user-assigned managed identity by using the following command:

```azurecli
az identity show \
    --resource-group <resource-group-name> \
    --name <identity-name> \
    --query clientId \
    --output tsv
```

Configure `ManagedIdentityCredential` with the client ID:

```java
import com.azure.identity.ManagedIdentityCredential;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// Specify the client ID of the user-assigned managed identity
ManagedIdentityCredential credential = new ManagedIdentityCredentialBuilder()
    .clientId("<user-assigned-managed-identity-client-id>")
    .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

#### [Resource ID](#tab/resource-id)

The resource ID is the full Azure Resource Manager (ARM) path to the user-assigned managed identity resource.

Retrieve the resource ID assigned to a user-assigned managed identity by using the following command:

```azurecli
az identity show \
    --resource-group <resource-group-name> \
    --name <identity-name> \
    --query id \
    --output tsv
```

Configure `ManagedIdentityCredential` with the resource ID:

```java
import com.azure.identity.ManagedIdentityCredential;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// Specify the resource ID of the user-assigned managed identity
ManagedIdentityCredential credential = new ManagedIdentityCredentialBuilder()
    .resourceId("/subscriptions/<subscription-id>/resourcegroups/<resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>")
    .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

#### [Object ID](#tab/object-id)

The object ID is the unique identifier of the managed identity's service principal in Microsoft Entra ID.

Retrieve the object ID assigned to a user-assigned managed identity by using the following command:

```azurecli
az identity show \
    --resource-group <resource-group-name> \
    --name <identity-name> \
    --query principalId \
    --output tsv
```

Configure `ManagedIdentityCredential` with the object ID:

```java
import com.azure.identity.ManagedIdentityCredential;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// Specify the object ID of the user-assigned managed identity
ManagedIdentityCredential credential = new ManagedIdentityCredentialBuilder()
    .objectId("<user-assigned-managed-identity-object-id>")
    .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

---

## Next steps

This article covered authentication using a user-assigned managed identity. This form of authentication is one of multiple ways you can authenticate in the Azure SDK for Java. The following articles describe other ways:

- [Authenticate using a system-assigned managed identity](system-assigned-managed-identity.md)
- [Authenticate locally using developer credentials](local-development-dev-accounts.md)
- [Authenticate locally using a service principal](local-development-service-principal.md)

If you run into issues related to Azure-hosted application authentication, see [Troubleshoot Azure-hosted application authentication](../troubleshooting-authentication-azure-hosted.md).

After you master authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

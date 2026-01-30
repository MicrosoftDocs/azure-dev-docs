---
title: Authenticate Azure-hosted Java apps using a system-assigned managed identity
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Azure-hosted Java apps to Azure resources using a system-assigned managed identity.
ms.date: 01/30/2026
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-generated
---

# Authenticate Azure-hosted Java apps to Azure resources using a system-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). This approach is [supported for most Azure services](/entra/identity/managed-identities-azure-resources/managed-identities-status), including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. Discover more about different authentication techniques and approaches on the [authentication overview](overview.md) page. In the sections ahead, you learn:

- Essential managed identity concepts.
- How to create a system-assigned managed identity for your app.
- How to assign roles to the system-assigned managed identity.
- How to authenticate using the system-assigned managed identity from your app code.

## Essential managed identity concepts

A managed identity enables your app to securely connect to other Azure resources without the use of secret keys or other application secrets. Internally, Azure tracks the identity and which resources it's allowed to connect to. Azure uses this information to automatically obtain Microsoft Entra tokens for the app to allow it to connect to other Azure resources.

There are two types of managed identities to consider when configuring your hosted app:

- **System-assigned managed identities** are enabled directly on an Azure resource and are tied to its life cycle. When the resource is deleted, Azure automatically deletes the identity for you. System-assigned identities provide a minimalistic approach to using managed identities.
- **User-assigned managed identities** are created as standalone Azure resources and offer greater flexibility and capabilities. They're ideal for solutions involving multiple Azure resources that need to share the same identity and permissions. For example, if multiple virtual machines need to access the same set of Azure resources, a user-assigned managed identity provides reusability and optimized management.

> [!TIP]
> Learn more about selecting and managing system-assigned managed identities and user-assigned managed identities in the [Managed identity best practice recommendations](/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations) article.

The sections ahead describe the steps to enable and use a system-assigned managed identity for an Azure-hosted app. If you need to use a user-assigned managed identity, visit the [user-assigned managed identities](user-assigned-managed-identity.md) article for more information.

## Enable a system-assigned managed identity on the Azure hosting resource

To get started using a system-assigned managed identity with your app, enable the identity on the Azure resource hosting your app, such as an Azure App Service, Azure Container App, or Azure Virtual Machine.

You can enable a system-assigned managed identity for an Azure resource using either the Azure portal or the Azure CLI.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, navigate to the resource that hosts your application code, such as an Azure App Service or Azure Container App instance.
1. From the resource's **Overview** page, expand **Settings** and select **Identity** from the navigation.
1. On the **Identity** page, toggle the **Status** slider to **On**.
1. Select **Save** to apply your changes.

#### [Azure CLI](#tab/azure-cli)

Use the [az webapp identity assign](/cli/azure/webapp/identity#az-webapp-identity-assign) command to enable a system-assigned managed identity on an Azure App Service:

```azurecli
az webapp identity assign \
    --resource-group <resource-group-name> \
    --name <app-service-name>
```

For Azure Container Apps, use [az containerapp identity assign](/cli/azure/containerapp/identity#az-containerapp-identity-assign):

```azurecli
az containerapp identity assign \
    --resource-group <resource-group-name> \
    --name <container-app-name> \
    --system-assigned
```

For Azure Virtual Machines, use [az vm identity assign](/cli/azure/vm/identity#az-vm-identity-assign):

```azurecli
az vm identity assign \
    --resource-group <resource-group-name> \
    --name <vm-name>
```

---

## Assign roles to the managed identity

Next, determine which roles your app needs and assign those roles to the managed identity. You can assign roles to a managed identity at the following scopes:

- **Resource**: The assigned roles only apply to that specific resource.
- **Resource group**: The assigned roles apply to all resources contained in the resource group.
- **Subscription**: The assigned roles apply to all resources contained in the subscription.

The following example shows how to assign roles at the resource group scope, since many apps manage all their related Azure resources using a single resource group.

#### [Azure portal](#tab/azure-portal)

1. Navigate to the **Overview** page of the resource group that contains the app with the system-assigned managed identity.
1. Select **Access control (IAM)** on the left navigation.
1. On the **Access control (IAM)** page, select **+ Add** on the top menu and then choose **Add role assignment** to navigate to the **Add role assignment** page.
1. The **Add role assignment** page presents a tabbed, multi-step workflow to assign roles to identities. On the initial **Role** tab, use the search box at the top to locate the role you want to assign to the identity.
1. Select the role from the results and then choose **Next** to move to the **Members** tab.
1. For the **Assign access to** option, select **Managed identity**.
1. For the **Members** option, choose **+ Select members** to open the **Select managed identities** panel.
1. On the **Select managed identities** panel, use the **Subscription** and **Managed identity** dropdowns to filter the search results for your identities. Use the **Select** search box to locate the system-identity you enabled for the Azure resource hosting your app.
1. Select the identity and choose **Select** at the bottom of the panel to continue.
1. Select **Review + assign** at the bottom of the page.
1. On the final **Review + assign** tab, select **Review + assign** to complete the workflow.

#### [Azure CLI](#tab/azure-cli)

Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to assign a role to the managed identity. You need to get the principal ID of the managed identity first.

For Azure App Service:

```azurecli
# Get the principal ID of the managed identity
principalId=$(az webapp identity show \
    --resource-group <resource-group-name> \
    --name <app-service-name> \
    --query principalId \
    --output tsv)

# Assign a role to the managed identity
az role assignment create \
    --assignee "$principalId" \
    --role "<role-name>" \
    --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>"
```

For Azure Container Apps:

```azurecli
# Get the principal ID of the managed identity
principalId=$(az containerapp identity show \
    --resource-group <resource-group-name> \
    --name <container-app-name> \
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

The [Azure Identity library](/java/api/com.azure.identity) provides various credentials—implementations of `TokenCredential` adapted to supporting different scenarios and Microsoft Entra authentication flows. For Azure-hosted apps, use `DefaultAzureCredential`, which automatically discovers managed identity credentials when running in Azure.

### Implement the code

Add the `azure-identity` dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

Azure services are accessed using specialized client classes from the Azure SDK client libraries. The following code sample demonstrates how to configure the credential for system-assigned managed identity authentication.

#### Use DefaultAzureCredential

`DefaultAzureCredential` is the recommended credential for Azure-hosted apps because it automatically discovers managed identity credentials when running in Azure. For system-assigned managed identities, no additional configuration is required.

```java
import com.azure.identity.DefaultAzureCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// DefaultAzureCredential automatically discovers managed identity when running in Azure
DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

#### Use ManagedIdentityCredential

If you want to explicitly use the managed identity credential and avoid the credential chain lookup in `DefaultAzureCredential`, use `ManagedIdentityCredential` directly. For system-assigned managed identities, don't specify a client ID:

```java
import com.azure.identity.ManagedIdentityCredential;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// For system-assigned managed identity, don't specify a client ID
ManagedIdentityCredential credential = new ManagedIdentityCredentialBuilder().build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

## Next steps

This article covered authentication using a system-assigned managed identity. This form of authentication is one of multiple ways you can authenticate in the Azure SDK for Java. The following articles describe other ways:

- [Authenticate using a user-assigned managed identity](user-assigned-managed-identity.md)
- [Authenticate locally using developer credentials](local-development-dev-accounts.md)
- [Authenticate locally using a service principal](local-development-service-principal.md)

If you run into issues related to Azure-hosted application authentication, see [Troubleshoot Azure-hosted application authentication](../troubleshooting-authentication-azure-hosted.md).

After you've mastered authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

---
title: Authenticate Azure-hosted Java apps by using a system-assigned managed identity
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Azure-hosted Java apps to Azure resources by using a system-assigned managed identity.
ms.date: 02/05/2026
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-generated
---

# Authenticate Azure-hosted Java apps to Azure resources by using a system-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). Most Azure services support this approach, including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. For more information, see [Azure services and resource types supporting managed identities](/entra/identity/managed-identities-azure-resources/managed-identities-status). For more information about different authentication techniques and approaches, see [Authenticate Java apps to Azure services by using the Azure Identity library](overview.md).

In the following sections, you learn:

- Essential managed identity concepts.
- How to create a system-assigned managed identity for your app.
- How to assign roles to the system-assigned managed identity.
- How to authenticate by using the system-assigned managed identity from your app code.

[!INCLUDE [managed-identity-concepts](../../../includes/authentication/managed-identity-concepts.md)]

The following sections describe the steps to enable and use a system-assigned managed identity for an Azure-hosted app. If you need to use a user-assigned managed identity, see [Authenticate Azure-hosted Java apps to Azure resources by using a user-assigned managed identity](user-assigned-managed-identity.md).

## Enable a system-assigned managed identity on the Azure hosting resource

To start using a system-assigned managed identity with your app, enable the identity on the Azure resource hosting your app.

You can enable a system-assigned managed identity for an Azure resource by using either the Azure portal or the Azure CLI.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to the resource that hosts your application code.
1. From the resource's **Overview** page, expand **Settings** and select **Identity** from the navigation.
1. On the **Identity** page, toggle the **Status** slider to **On**.
1. Select **Save** to apply your changes.

    :::image type="content" source="../../../includes/authentication/media/system-assigned-identity-enable.png" alt-text="A screenshot showing how to enable a system-assigned managed identity on a container app." lightbox="../../../includes/authentication/media/system-assigned-identity-enable.png":::

#### [Azure CLI](#tab/azure-cli)

Use the [az webapp identity assign](/cli/azure/webapp/identity#az-webapp-identity-assign) command to enable a system-assigned managed identity on an Azure App Service instance:

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

1. Go to the **Overview** page of the resource group that contains the app with the system-assigned managed identity.
1. Select **Access control (IAM)** in the navigation pane.
1. On **Access control (IAM)**, select **+ Add** in the top menu, and then choose **Add role assignment** to go to **Add role assignment**.

    :::image type="content" source="../../../includes/authentication/media/system-assigned-identity-access-control.png" alt-text="A screenshot showing how to access the identity role assignment page." lightbox="../../../includes/authentication/media/system-assigned-identity-access-control.png":::

1. **Add role assignment** presents a tabbed, multistep workflow to assign roles to identities. On the initial **Role** tab, use the search box at the top to locate the role you want to assign to the identity.
1. Select the role from the results and then choose **Next** to move to the **Members** tab.
1. For the **Assign access to** option, select **Managed identity**.
1. For the **Members** option, choose **+ Select members** to open the **Select managed identities** panel.
1. On the **Select managed identities** panel, use the **Subscription** and **Managed identity** dropdowns to filter the search results for your identities. Use the **Select** search box to locate the system-identity you enabled for the Azure resource hosting your app.

    :::image type="content" source="../../../includes/authentication/media/system-assigned-identity-assign-roles.png" alt-text="A screenshot showing the managed identity assignment process." lightbox="../../../includes/authentication/media/system-assigned-identity-assign-roles.png":::

1. Select the identity and choose **Select** at the bottom of the panel to continue.
1. Select **Review + assign** at the bottom of the page.
1. On the final **Review + assign** tab, select **Review + assign** to complete the workflow.

#### [Azure CLI](#tab/azure-cli)

Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to assign a role to the managed identity. You need to get the principal ID of the managed identity first.

For Azure App Service:

```azurecli
# Get the principal ID of the managed identity
export PRINCIPAL_ID=$(az webapp identity show \
    --resource-group <resource-group-name> \
    --name <app-service-name> \
    --query principalId \
    --output tsv)

# Assign a role to the managed identity
az role assignment create \
    --assignee "$PRINCIPAL_ID" \
    --role "<role-name>" \
    --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>"
```

For Azure Container Apps:

```azurecli
# Get the principal ID of the managed identity
export PRINCIPAL_ID=$(az containerapp identity show \
    --resource-group <resource-group-name> \
    --name <container-app-name> \
    --query principalId \
    --output tsv)

# Assign a role to the managed identity
az role assignment create \
    --assignee "$PRINCIPAL_ID" \
    --role "<role-name>" \
    --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>"
```

---

## Authenticate to Azure services from your app

The [Azure Identity library](/java/api/com.azure.identity) provides various credentials as implementations of `TokenCredential`. Each implementation supports different scenarios and Microsoft Entra authentication flows. For Azure-hosted apps, use `DefaultAzureCredential`, which automatically discovers managed identity credentials when running in Azure.

### Implement the code

Add the `azure-identity` dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

You access Azure services by using specialized client classes from the Azure SDK client libraries. The following code examples show you how to configure the credential for system-assigned managed identity authentication.

#### Use DefaultAzureCredential

Use `DefaultAzureCredential` for Azure-hosted apps because it automatically discovers managed identity credentials when running in Azure. For system-assigned managed identities, no extra configuration is required.

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

- [Authenticate Azure-hosted Java apps to Azure resources by using a user-assigned managed identity](user-assigned-managed-identity.md)
- [Authenticate Java apps to Azure services during local development by using developer accounts](local-development-dev-accounts.md)
- [Authenticate Java apps to Azure services during local development by using service principals](local-development-service-principal.md)

If you run into issues related to Azure-hosted application authentication, see [Troubleshoot Azure-hosted application authentication](../troubleshooting-authentication-azure-hosted.md).

After you master authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

---
title: Authenticate Azure-Hosted JavaScript Apps to Azure Resources Using the Azure SDK
description: Learn to securely authenticate JavaScript apps on Azure hosting services like App Service, Functions, or VMs using the Azure SDK and managed identities.
ms.date: 01/24/2025
ms.topic: how-to
ms.custom: devx-track-js, devx-track-azurecli
---

# How to Authenticate Azure-Hosted JavaScript Apps to Azure resources using the Azure SDK

When an app is hosted in Azure (using a service like Azure App Service, Azure Functions, or Azure Container Apps), you can use a [managed identity](/azure/active-directory/managed-identities-azure-resources/overview) to securely authenticate your app to Azure resources.

A managed identity provides an identity for your app, allowing it to connect to other Azure resources without needing to use a secret (such as a connection string or key). Internally, Azure recognizes the identity of your app and knows which resources it is permitted to access. Azure uses this information to automatically obtain Microsoft Entra tokens for the app, enabling it to connect to other Azure resources without requiring you to manage (create or rotate) authentication secrets.

## Managed identity types

There are two types of managed identities:

* **System-assigned managed identities** - single Azure resource
* **User-assigned managed identities** - multiple Azure resources

This article covers the steps to enable and use a system-assigned managed identity for an app.  If you need to use a user-assigned managed identity, see the article [Manage user-assigned managed identities](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities) to see how to create a user-assigned managed identity.

### System-assigned managed identities for single resource

System-assigned managed identities are provided by and tied directly to an Azure resource. When you enable managed identity on an Azure resource, you get a system-assigned managed identity for that resource. It's tied to the lifecycle of the Azure resource. When the resource is deleted, Azure automatically deletes the identity for you. Since all you have to do is enable managed identity for the Azure resource hosting your code, this is the easiest type of managed identity to use.

### User-assigned managed identities for multiple resources

A User-assigned managed identity is a standalone Azure resource. This is most frequently used when your solution has multiple workloads that run on multiple Azure resources that all need to share the same identity and same permissions. For example, if your solution had components that ran on multiple App Service and virtual machine instances and they all needed access to the same set of Azure resources, creating and using a user-assigned managed identity across those resources would make sense.


## 1 - Enable system-assigned managed identity in hosted app

The first step is to enable managed identity on the Azure resource hosting your app. For example, if you're hosting a Express.js application using Azure App Service, you need to enable managed identity for that App Service web app.  If you were using a virtual machine to host your app, you would enable your VM to use managed identity.

You can enable managed identity to be used for an Azure resource using either the Azure portal or the Azure CLI.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Enable managed identity step 1](<../../../includes/sdk-auth-passwordless/enable-managed-identity-azure-portal-1.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/enable-managed-identity-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search bar in the Azure portal to locate and navigate to a resource in Azure." lightbox="../../../includes/media/sdk-auth-passwordless/enable-managed-identity-azure-portal-1.png"::: |
| [!INCLUDE [Enable managed identity step 2](<../../../includes/sdk-auth-passwordless/enable-managed-identity-azure-portal-2.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/enable-managed-identity-azure-portal-2-240px.png" alt-text="A screenshot showing the location of the Identity menu item in the left-hand menu for an Azure resource." lightbox="../../../includes/media/sdk-auth-passwordless/enable-managed-identity-azure-portal-2.png"::: |
| [!INCLUDE [Enable managed identity step 3](<../../../includes/sdk-auth-passwordless/enable-managed-identity-azure-portal-3.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/enable-managed-identity-azure-portal-3-240px.png" alt-text="A screenshot showing how to enable managed identity for an Azure resource on the resource's Identity page." lightbox="../../../includes/media/sdk-auth-passwordless/enable-managed-identity-azure-portal-3.png"::: |

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

The Azure CLI commands used to enable managed identity for an Azure resource are of the form `az <command-group> identity --resource-group <resource-group-name> --name <resource-name>`. Specific commands for popular Azure services are shown below.

[!INCLUDE [Enable managed identity Azure CLI](<../../../includes/sdk-auth-passwordless/enable-managed-identity-azure-cli.md>)]

The output looks like the following.

```json
{
  "principalId": "<REPLACE_WITH_YOUR_PRINCIPAL_ID>",
  "tenantId": "<REPLACE_WITH_YOUR_TENANT_ID>",
  "type": "SystemAssigned",
  "userAssignedIdentities": null
}

```

The `principalId` value is the unique ID of the managed identity. Keep a copy of this output as you'll need these values in the next step.

---

## 2 - Assign roles to the managed identity

Next, you need to determine what roles (permissions) your app needs and assign the managed identity to those roles in Azure. A managed identity can be assigned  roles at a resource, resource group, or subscription scope. This example shows how to assign roles at the resource group scope since most applications group all their Azure resources into a single resource group.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Assign managed identity to role step 1](<../../../includes/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-1.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search bar in the Azure portal to locate and navigate to a resource group in Azure." lightbox="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-1.png"::: |
| [!INCLUDE [Assign managed identity to role step 2](<../../../includes/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-2.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-2-240px.png" alt-text="A screenshot showing the location of the Access control (I A M ) menu item in the left-hand menu of an Azure resource group." lightbox="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-2.png"::: |
| [!INCLUDE [Assign managed identity to role step 3](<../../../includes/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-3.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-3-240px.png" alt-text="A screenshot showing how to navigate to the role assignments tab and the location of the button used to add role assignments to a resource group." lightbox="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-3.png"::: |
| [!INCLUDE [Assign managed identity to role step 4](<../../../includes/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-4.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-4-240px.png" alt-text="A screenshot showing how to filter and select role assignments to be added to the resource group." lightbox="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-4.png"::: |
| [!INCLUDE [Assign managed identity to role step 5](<../../../includes/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-5.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-5-240px.png" alt-text="A screenshot showing how to select managed identity as the type of user you want to assign the role (permission) on the add role assignments page." lightbox="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-5.png"::: |
| [!INCLUDE [Assign managed identity to role step 6](<../../../includes/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-6.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-6-240px.png" alt-text="A screenshot showing how to use the select managed identities dialog to filter and select the managed identity to assign the role to." lightbox="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-6.png"::: |
| [!INCLUDE [Assign managed identity to role step 7](<../../../includes/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-7.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-7-240px.png" alt-text="A screenshot of the final add role assignment screen where a user needs to select the Review + Assign button to finalize the role assignment." lightbox="../../../includes/media/sdk-auth-passwordless/assign-managed-identity-to-role-azure-portal-7.png"::: |

### [Azure CLI](#tab/azure-cli)

A managed identity is assigned a role in Azure using the [az role assignment create] command.

```azurecli
az role assignment create --assignee "{managedIdentityId}" \
    --role "{roleName}" \
    --resource-group "{resourceGroupName}"
```

To get the role names that a service principal can be assigned to, use the [az role definition list](/cli/azure/role/definition#az-role-definition-list) command.

```azurecli
az role definition list \
    --query "sort_by([].{roleName:roleName, description:description}, &roleName)" \
    --output table
```

For example, to allow the managed identity to read, write, and delete access to Azure Storage blob containers and data to all storage accounts in the *msdocs-sdk-auth-example* resource group, you would assign the application service principal to the *Storage Blob Data Contributor* role using the following command.

```azurecli
az role assignment create --assignee aaaaaaaa-bbbb-cccc-7777-888888888888 \
    --role "Storage Blob Data Contributor" \
    --resource-group "msdocs-sdk-auth-example"
```

For information on assigning permissions at the resource or subscription level using the Azure CLI, see the article [Assign Azure roles using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

---

## 3 - Implement DefaultAzureCredential in your application

The `DefaultAzureCredential` class will automatically detect that a managed identity is being used and use the managed identity to authenticate to other Azure resources. As discussed in the [Azure SDK for JavaScript authentication overview](./overview.md) article, `DefaultAzureCredential` supports multiple authentication methods and determines the authentication method being used at runtime.  In this way, your app can use different authentication methods in different environments without implementing environment specific code.

First, add the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package to your application.

```terminal
npm install @azure/identity
```

Next, for any JavaScript code that creates an Azure SDK client object in your app, you want to:

1. Import the `DefaultAzureCredential` class from the `@azure/identity` module.
1. Create a `DefaultAzureCredential` object.
1. Pass the `DefaultAzureCredential` object to the Azure SDK client object constructor.

An example of this is shown in the following code segment.

```javascript
// connect-with-default-azure-credential.js
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import 'dotenv/config'

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error('Azure Storage accountName not found');

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new DefaultAzureCredential()
);
```

When the code is run on the **Azure hosting resource**, the SDK method, _DefaultAzureCredential()_, looks for the green credential types in the order displayed in the image below: the environment, the Workload identity, then the Managed Identity.

When the above code is run on your local workstation during **local development**, the SDK method, _DefaultAzureCredential()_, looks in the orange credential typesin the order displayed in the image below: the Azure CLI, Azure PowerShell, then Azure Developer CLI for a set of developer credentials. These tools can be used to authenticate the app to Azure resources during local development. In this way, this same code can be used to authenticate your app to Azure resources during both local development and when deployed to Azure.

:::image type="content" source="../media/mermaidjs/default-azure-credential-auth-flow-inline.svg" alt-text="Diagram that shows DefaultAzureCredential authentication flow." lightbox="../media/mermaidjs/default-azure-credential-auth-flow-expanded.png":::

## More resources

* [Azure credential chains](credential-chains.md)
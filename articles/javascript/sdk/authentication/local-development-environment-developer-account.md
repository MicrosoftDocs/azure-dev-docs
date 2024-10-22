---
title: "Local dev: Auth JS apps to Azure services with dev accounts"
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for JavaScript during local development using developer accounts.
ms.date: 05/19/2022
ms.topic: how-to
ms.custom: dexx-track-js, devx-track-azurecli, devx-track-azurepowershell, devx-track-js
---

# Authenticate JavaScript apps to Azure services during local development using developer accounts

When you create cloud applications, developers need to debug and test applications on their local workstation. When an application is run on a developer's workstation during local development, it still must authenticate to any Azure services used by the app. This article covers how to use a developer's Azure credentials to authenticate the app to Azure during local development.

:::image type="content" source="../../../includes/media/sdk-auth-passwordless/javascript/local-dev-dev-accounts-overview.png" alt-text="A diagram showing a local dev app running obtaining a service principal from an .env file and use that identity to connect to Azure resources.":::

For an app to authenticate to Azure during local development using the developer's Azure credentials, the developer must be signed-in to Azure from the Visual Studio Code Azure Tools extension, the Azure CLI, or Azure PowerShell.  The Azure SDK for JavaScript is able to detect that the developer is signed-in from one of these tools and then obtain the necessary credentials from the credentials cache to authenticate the app to Azure as the signed-in user.

This approach is easiest to set up for a development team since it takes advantage of the developers' existing Azure accounts. However, a developer's account will likely have more permissions than required by the application, therefore exceeding the permissions the app runs with in production. As an alternative, you can create application service principals to use during local development, which can be scoped to have only the access needed by the app.

<a name='1---create-azure-ad-group-for-local-development'></a>

## 1 - Create Microsoft Entra group for local development

Since there are almost always multiple developers who work on an application, it's recommended to first create a Microsoft Entra group to encapsulate the roles (permissions) the app needs in local development.  This offers the following advantages.

- Every developer is assured to have the same roles assigned since roles are assigned at the group level.
- If a new role is needed for the app, it only needs to be added to the Microsoft Entra group for the app.
- If a new developer joins the team, they simply must be added to the correct Microsoft Entra group to get the correct permissions to work on the app.

If you have an existing Microsoft Entra group for your development team, you can use that group.  Otherwise, complete the following steps to create a Microsoft Entra group.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app AD group step 1](<../../../includes/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-1.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search bar in the Azure portal to search for and navigate to the Microsoft Entra ID page." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-1.png"::: |
| [!INCLUDE [Create app AD group step 2](<../../../includes/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-2.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-2-240px.png" alt-text="A screenshot showing the location of the Groups menu item in the left-hand menu of the Microsoft Entra ID Default Directory page." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-2.png"::: |
| [!INCLUDE [Create app AD group step 3](<../../../includes/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-3.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-3-240px.png" alt-text="A screenshot showing the location of the New Group button in the All groups page." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-3.png"::: |
| [!INCLUDE [Create app AD group step 4](<../../../includes/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-4.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-4-240px.png" alt-text="A screenshot showing how to create a new Microsoft Entra group. The location of the link to select to add members to this group is highlighted." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-4.png"::: |
| [!INCLUDE [Create app AD group step 5](<../../../includes/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-5.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-5-240px.png" alt-text="A screenshot of the Add members dialog box showing how to select developer accounts to be included in the group." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-5.png"::: |
| [!INCLUDE [Create app AD group step 6](<../../../includes/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-6.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-6-240px.png" alt-text="A screenshot of the New Group page showing how to complete the process by selecting the Create button." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-6.png"::: |

### [Azure CLI](#tab/azure-cli)

The [az ad group create](/cli/azure/ad/group#az-ad-group-create) command is used to create groups in Microsoft Entra ID.  The `--display-name` and `--main-nickname` parameters are required.  The name given to the group should be based on the name of the application.  It's also useful to include a phrase like 'local-dev' in the name of the group to indicate the purpose of the group.

```azurecli
az ad group create \
    --display-name MyDisplay \
    --mail-nickname MyDisplay  \
    --description <group-description>
```

To add members to the group, you'll need the object ID of Azure user.  Use the [az ad user list](/cli/azure/ad/sp#az-ad-user-list) to list the available service principals.  The `--filter` parameter command accepts OData style filters and can be used to filter the list on the display name of the user as shown.  The `--query` parameter returns specified columns.

```azurecli
az ad user list \
    --filter "startswith(displayName, 'Bob')" \
    --query "[].{objectId:objectId, displayName:displayName}" \
    --output table
```

The [az ad group member add](/cli/azure/ad/group/member#az-ad-group-member-add) command can then be used to add members to groups.  

```azurecli
az ad group member add \
    --group <group-name> \
    --member-id <object-id>
```

---

<a name='2---assign-roles-to-the-azure-ad-group'></a>

## 2 - Assign roles to the Microsoft Entra group

Next, you need to determine what roles (permissions) your app needs on what resources and assign those roles to your app.  In this example, the roles are assigned to the Microsoft Entra group created in step 1.  Roles can be assigned a role at a resource, resource group, or subscription scope.  This example shows how to assign roles at the resource group scope since most applications group all their Azure resources into a single resource group.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-1.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search box in the Azure portal to locate and navigate to the resource group you want to assign roles (permissions) to." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-1.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-2.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-2-240px.png" alt-text="A screenshot of the resource group page showing the location of the Access control (IAM) menu item." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-2.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-3.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-3-240px.png" alt-text="A screenshot showing how to navigate to the role assignments tab and the location of the button used to add role assignments to a resource group." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-3.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-4.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-4-240px.png" alt-text="A screenshot showing how to filter and select role assignments to be added to the resource group." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-4.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-5.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-5-240px.png" alt-text="A screenshot showing the radio button to select to assign a role to a Microsoft Entra group and the link used to select the group to assign the role to." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-5.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-6.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-6-240px.png" alt-text="A screenshot showing how to filter for and select the Microsoft Entra group for the application in the Select members dialog box." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-6.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-7.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-7-240px.png" alt-text="A screenshot showing the completed Add role assignment page and the location of the Review + assign button used to complete the process." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-7.png"::: |

### [Azure CLI](#tab/azure-cli)

An application service principal is assigned a role in Azure using the [az role assignment create](/cli/azure/role/assignment) command.

```azurecli
az role assignment create --assignee "{appId}" \
    --scope /subscriptions/"{subscriptionName}" \
    --role "{roleName}" \
    --resource-group "{resourceGroupName}"
```

To get the role names that a service principal can be assigned to, use the [az role definition list](/cli/azure/role/definition#az-role-definition-list) command.

```azurecli
az role definition list --query "sort_by([].{roleName:roleName, description:description}, &roleName)" --output table

```

For example, to allow the application service principal with the appId of `aaaaaaaa-bbbb-cccc-1111-222222222222` read, write, and delete access to Azure Storage blob containers and data to all storage accounts in the *msdocs-sdk-auth-example* resource group, you would assign the application service principal to the *Storage Blob Data Contributor* role using the following command.

```azurecli
az role assignment create --assignee "aaaaaaaa-bbbb-cccc-1111-222222222222" \
    --scope /subscriptions/"Storage Blob Data Subscriber" \
    --role "Storage Blob Data Contributor" \
    --resource-group "msdocs-sdk-auth-example"
```

For information on assigning permissions at the resource or subscription level using the Azure CLI, see the article [Assign Azure roles using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

---

## 3 - Sign-in to Azure using VS Code, the Azure CLI, or Azure PowerShell

### [Azure PowerShell](#tab/sign-in-azure-powershell)

Open a terminal on your developer workstation and sign-in to Azure from [Azure PowerShell](/powershell/azure/what-is-azure-powershell).

```azurepowershell
Connect-AzAccount
```

---

## 4 - Implement DefaultAzureCredential in your application

To authenticate Azure SDK client objects to Azure, your application should use the `DefaultAzureCredential` class from the `@azure/identity` package. In this scenario, `DefaultAzureCredential` will sequentially check to see if the developer has signed-in to Azure using the VS Code Azure tools extension, the Azure CLI, or Azure PowerShell.  If the developer is signed-in to Azure using any of these tools, then the credentials used to sign into the tool will be used by the app to authenticate to Azure with.

Start by adding the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package to your application.

```bash
npm install @azure/identity
```

Next, for any JavaScript code that creates an Azure SDK client object in your app, you'll want to:

1. Import the `DefaultAzureCredential` class from the `@azure/identity` module.
1. Create a `DefaultAzureCredential` object.
1. Pass the `DefaultAzureCredential` object to the Azure SDK client object constructor.

An example of this is shown in the following code segment.

```JavaScript
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

// Acquire a credential object
const tokenCredential = DefaultAzureCredential();

const blobServiceClient = BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        tokenCredential
);
```
`DefaultAzureCredential` will automatically detect the authentication mechanism configured for the app and obtain the necessary tokens to authenticate the app to Azure. If an application makes use of more than one SDK client, the same credential object can be used with each SDK client object.

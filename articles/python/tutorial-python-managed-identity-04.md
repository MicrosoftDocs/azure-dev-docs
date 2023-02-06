---
title: Create an Azure storage account with managed identity
description: Create a storage account that a deployed Python (Django or Flask) web app can access in Azure using managed identity.
ms.devlang: python
ms.topic: tutorial
ms.date: 07/20/2022
ms.custom: devx-track-python, devx-track-azurecli, vscode-azure-extension-update-completed
---

# Create an Azure storage account and configure a role for managed identity

This article is part of a tutorial about deploying a Python app to Azure App Service. The web app uses managed identity to authenticate to other Azure resources. In this article, you'll create an Azure Blob Storage account to store images saved by the sample app.

:::image type="content" source="./media/python-web-app-managed-identity/system-diagram-local-to-deploy-python-managed-identity-storage-800px.png" lightbox="./media/python-web-app-managed-identity/system-diagram-local-to-deploy-python-managed-identity-storage.png" alt-text="A screenshot showing the Azure services in the tutorial used with Azure Blob Storage highlighted." :::

## 1. Create a storage account

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create an Azure Storage account.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create storage account step 1](<./includes/python-web-app-managed-identity/create-storage-acct-azure-portal-1.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-storage-account-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find storage accounts in Azure." lightbox="./media/python-web-app-managed-identity/create-storage-account-azure-portal-1.png"::: |
| [!INCLUDE [Create storage account step 2](<./includes/python-web-app-managed-identity/create-storage-acct-azure-portal-2.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-storage-account-azure-portal-2-240px.png" alt-text="A screenshot showing the create button on the storage accounts page used to create a new storage account." lightbox="./media/python-web-app-managed-identity/create-storage-account-azure-portal-2.png"::: |
| [!INCLUDE [Create storage account step 3](<./includes/python-web-app-managed-identity/create-storage-acct-azure-portal-3.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-storage-account-azure-portal-3-240px.png" alt-text="A screenshot showing the form to fill out to create a new storage account in Azure." lightbox="./media/python-web-app-managed-identity/create-storage-account-azure-portal-3.png"::: |
| [!INCLUDE [Create storage account step 4](<./includes/python-web-app-managed-identity/create-storage-acct-azure-portal-4.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-storage-account-azure-portal-4-240px.png" alt-text="A screenshot of the completion page after a storage account has been created.  This page contains a button that will take you to the storage account you created." lightbox="./media/python-web-app-managed-identity/create-storage-account-azure-portal-4.png"::: |
| [!INCLUDE [Create storage account step 5](<./includes/python-web-app-managed-identity/create-storage-acct-azure-portal-5.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-storage-account-azure-portal-5-240px.png" alt-text="A screenshot of how to create a container in a storage account." lightbox="./media/python-web-app-managed-identity/create-storage-account-azure-portal-5.png"::: |

### [VS Code](#tab/vscode-aztools)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) and the [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) installed, and be signed into Azure from VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to find Azure extension in Visual Studio Code](<./includes/python-web-app-managed-identity/create-storage-visual-studio-code-1.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-storage-visual-studio-code-1-240px.png" lightbox="./media/python-web-app-managed-identity/create-storage-visual-studio-code-1.png" alt-text="A screenshot showing how to use Visual Studio Code Azure extension pack with the Storage extension." ::: |
| [!INCLUDE [A screenshot showing how to find the Azure Storage extension in Visual Studio Code](<./includes/python-web-app-managed-identity/create-storage-visual-studio-code-2.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-storage-visual-studio-code-2-240px.gif" lightbox="./media/python-web-app-managed-identity/create-storage-visual-studio-code-2.gif" alt-text="A screenshot showing how to create a storage account with the Azure Tools extension." :::  |
| [!INCLUDE [A screenshot showing how to configure the new storage](<./includes/python-web-app-managed-identity/create-storage-visual-studio-code-3.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-storage-visual-studio-code-3-240px.png" lightbox="./media/python-web-app-managed-identity/create-storage-visual-studio-code-3.png" alt-text="A screenshot showing how to create a storage container with the Azure extension." ::: <br><br> :::image type="content" source="./media/python-web-app-managed-identity/create-storage-visual-studio-code-3b-240px.png" lightbox="./media/python-web-app-managed-identity/create-storage-visual-studio-code-3b.png" alt-text="A screenshot showing how to create a storage container with the Azure extension and add a container." ::: |

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

Storage accounts are created using the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. Storage account names must also be unique across Azure.

Create a storage account.

[!INCLUDE [Create storage account with CLI](<./includes/python-web-app-managed-identity/create-storage-account-cli.md>)]

Create a container called *photos* in the storage account with the [az storage container create](/cli/azure/storage/container#az-storage-container-create) command.

[!INCLUDE [Create storage account with CLI](<./includes/python-web-app-managed-identity/create-storage-container-cli.md>)]

---

## 2. Assign data contributor role

In this step, you'll assign a role to a managed identity. A role is a collection of permissions for a scope or set of resources. Specifically, you assign the *Storage Blob Data Contributor* role to the app's managed identity so that the web app can access the storage account. 

Grouping Azure resources into a single resource group is commonly done when developing applications that use Azure resources. Up to this point in the tutorial, the App Service and Storage Account you created should be in the same resource group. Therefore, you'll assign the storage role at the resource group level. 

### [Azure portal](#tab/managed-identity-azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Assign managed identity to role step 1](<./includes/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-1.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search bar in the Azure portal to locate and navigate to a resource group in Azure. You'll assign roles (permissions) to this resource group." lightbox="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-1.png"::: |
| [!INCLUDE [Assign managed identity to role step 2](<./includes/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-2.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-2-240px.png" alt-text="A screenshot showing the location of the Access control (IAM) menu item in the left-hand menu of an Azure resource group." lightbox="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-2.png"::: |
| [!INCLUDE [Assign managed identity to role step 3](<./includes/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-3.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-3-240px.png" alt-text="A screenshot showing how to navigate to the role assignments tab and the location of the button used to add role assignments to a resource group." lightbox="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-3.png"::: |
| [!INCLUDE [Assign managed identity to role step 4](<./includes/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-4.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-4-240px.png" alt-text="A screenshot showing how to filter to find role assignments to be added to the resource group." lightbox="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-4.png"::: <br><br> :::image type="content" source="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-4a-240px.png" alt-text="A screenshot showing how to select a role assignment to be added to the resource group." lightbox="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-4a.png"::: |
| [!INCLUDE [Assign managed identity to role step 5](<./includes/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-5.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-5-240px.png" alt-text="A screenshot showing how to select managed identity as the type of user you want to assign the role (permission) on the add role assignments page." lightbox="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-5.png"::: |
| [!INCLUDE [Assign managed identity to role step 6](<./includes/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-6.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-6-240px.png" alt-text="A screenshot showing how to use the select managed identities dialog to filter and select the managed identity to assign the role to." lightbox="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-6.png"::: |
| [!INCLUDE [Assign managed identity to role step 7](<./includes/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-7.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-7-240px.png" alt-text="A screenshot of the final add role assignment screen where a user needs to select the Review + Assign button to finalize the role assignment." lightbox="./media/python-web-app-managed-identity/assign-managed-identity-to-role-azure-portal-7.png"::: |

### [Azure CLI](#tab/managed-identity-azure-cli)

A managed identity is assigned a role in Azure with the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. The general form of the command is:

[!INCLUDE [Create role with CLI](<./includes/python-web-app-managed-identity/create-role-cli.md>)]

Three pieces of information are needed:

* *\<managed-identity-id>* that is the managed identity ID of the App Service. If needed, return to the App Service **Identity** page to get this ID.

* *\<resource-group-name>* that is the group the App Service and Storage Account were created in.

* *\<role-name>* that for this tutorial is *Storage Blob Data Contributor*.

In general, to get the role names that a service principal can be assigned to, use the [az role definition list](/cli/azure/role/definition#az-role-definition-list) command.

[!INCLUDE [Get the role names with CLI](<./includes/python-web-app-managed-identity/get-role-names-cli.md>)]

For example, if the managed identity object ID is *99999999-9999-9999-9999-999999999999*, the resource group is *msdocs-web-app-rg*, then you can use the following command to assign the to *Storage Blob Data Contributor* role:

[!INCLUDE [Create role example with CLI](<./includes/python-web-app-managed-identity/create-role-example-cli.md>)]

For information on assigning permissions at the resource or subscription level using the Azure CLI, see the article [Assign Azure roles using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

---

## Next step

> [!div class="nextstepaction"]
> [Create an Azure database for PostgreSQL >>>](./tutorial-python-managed-identity-05.md)

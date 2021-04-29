---
title: Manage local service principals for Azure development
description: How to manage service principals created for local development by using the Azure portal or the Azure CLI.
ms.date: 08/18/2020
ms.topic: conceptual 
ms.custom: devx-track-python, devx-track-azurecli
---

# How to manage service principals

As described in [How to authenticate an app](azure-sdk-authenticate.md), you often use service principals to identify an app with Azure except when using managed identity.

Over time, you typically need to delete, rename, or otherwise manage these service principals, which you can do through the Azure portal or by using the Azure CLI.

## Manage service principals using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the **Azure Active Directory** page, using either the icon on the portal home page or searching for "Azure Active Directory" in the portal search bar.

    ![Searching for Azure Active Directory on the Azure portal](media/how-to-manage-service-principals/azure-ad-portal-search.png)

1. Select **Manage** > **App registrations** in the left-hand navigation menu. Your local development service principals appear in the list:

    ![App registrations in the Azure Active Directory](media/how-to-manage-service-principals/azure-ad-app-registrations.png)

1. Select any of the service principals to navigate to its properties page where you can examine ID values, rename or delete the service principal, and obtain various endpoint URLs.

1. The process of authorizing a service principal to access a specific resource typically depends on the service in question. For more information, see the documentation for that service. For example, the articles [Authorization for Blob storage](/azure/storage/common/storage-auth-aad-rbac-portal) and [Authorization for Queue storage](/azure/storage/common/storage-auth-aad-rbac-portal) describe the process in part of Azure Storage.

## Manage service principals using the Azure CLI

Using the Azure CLI, you can perform many of the same operations on service principals that you can through the Azure Portal:

- Create, view, update, and delete service principals: [az ad sp](/cli/azure/ad/sp) command. Also see [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli).
- Manage role assignments: [az role assignment](/cli/azure/role/assignment) command.

See also:

- [Authenticate with Azure using the Azure libraries](azure-sdk-authenticate.md)

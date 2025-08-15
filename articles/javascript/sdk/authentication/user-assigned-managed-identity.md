---
title: Authenticate Azure-hosted JavaScript apps to Azure resources using a user-assigned managed identity
description: Learn how to authenticate Azure-hosted JavaScript apps to other Azure services using a user-assigned managed identity.
ms.topic: how-to
ms.custom: devx-track-dotnet, engagement-fy23, devx-track-azurecli
ms.date: 08/15/2025
---

# Authenticate Azure-hosted JavaScript apps to Azure resources using a user-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). This approach is [supported for most Azure services](/entra/identity/managed-identities-azure-resources/managed-identities-status), including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. Discover more about different authentication techniques and approaches on the [authentication overview](/javascript/azure/sdk/authentication) page. In the sections ahead, you'll learn:

- Essential managed identity concepts
- How to create a user-assigned managed identity for your app
- How to assign roles to the user-assigned managed identity
- How to authenticate using the user-assigned managed identity from your app code

[!INCLUDE [managed-identity-concepts](../../../includes/authentication/managed-identity-concepts.md)]

The following sections describe the steps to enable and use a user-assigned managed identity for an Azure-hosted app. If you need to use a system-assigned managed identity, visit the [system-assigned managed identities](system-assigned-managed-identity.md) article for more information.

[!INCLUDE [Language agnostic user assigned procedures](<../../../includes/authentication/user-assigned-managed-identity.md>)]
---
title: Authenticate Java apps to Azure services
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Java apps to Azure services using the Azure Identity library, including managed identities and developer accounts.
ms.date: 02/24/2026
ms.topic: overview
ms.custom: devx-track-java
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-assisted
---

# Authenticate Java apps to Azure services by using the Azure Identity library

Apps can use the Azure Identity library to authenticate to Microsoft Entra ID, which allows the apps to access Azure services and resources. This authentication requirement applies whether the app is deployed to Azure, hosted on-premises, or running locally on a developer workstation. This article describes the recommended approaches to authenticate an app to Microsoft Entra ID across different environments when using the Azure SDK client libraries.

## Recommended approach for Java app authentication

Token-based authentication through Microsoft Entra ID is the recommended approach for authenticating apps to Azure, instead of using connection strings or key-based options. The [Azure Identity library](/java/api/com.azure.identity) provides classes that support token-based authentication and enable apps to authenticate to Azure resources whether the app runs locally, on Azure, or on an on-premises server.

### Advantages of token-based authentication for Java apps

[!INCLUDE [advantages-token-based-authentication](../../../includes/authentication/advantages-token-based-authentication.md)]

## Authentication across different environments

The specific type of token-based authentication an app should use to authenticate to Azure resources depends on where the app runs. The following diagram provides guidance for different scenarios and environments:

:::image type="content" source="../../../includes/authentication/media/mermaidjs/authentication-environments.svg" alt-text="A diagram showing the recommended token-based authentication strategies for an app depending on where it's running." :::

When an app is:

- **Hosted on Azure**: The app should authenticate to Azure resources by using a managed identity. For more information, see the [Authentication for Azure-hosted apps](#authentication-for-azure-hosted-apps) section.
- **Running locally during development**: The app can authenticate to Azure by using a [developer account](local-development-dev-accounts.md), a [broker](local-development-broker.md), or a [service principal](local-development-service-principal.md). For more information, see the [Authentication during local development](#authentication-during-local-development) section.
- **Hosted on-premises**: The app should authenticate to Azure resources using an application service principal, or a managed identity in the case of Azure Arc. On-premises workflows are discussed in more detail at [Authentication for apps hosted on-premises](#authentication-for-apps-hosted-on-premises).

## Authentication for Azure-hosted apps

When you host your app on Azure, it can use managed identities to authenticate to Azure resources without needing to manage any credentials. Two types of managed identities are available: user-assigned and system-assigned.

### Use a user-assigned managed identity

You can create a user-assigned managed identity as a standalone Azure resource. You can then assign it to one or more Azure resources so those resources can share the same identity and permissions. To authenticate by using a user-assigned managed identity, create the identity, assign it to your Azure resource, and then configure your app to use this identity for authentication by specifying its client ID, resource ID, or object ID.

> [!div class="nextstepaction"]
> [Authenticate by using a user-assigned managed identity](user-assigned-managed-identity.md)

### Use a system-assigned managed identity

You can enable a system-assigned managed identity directly on an Azure resource. The identity is tied to the lifecycle of that resource and is automatically deleted when the resource is deleted. To authenticate by using a system-assigned managed identity, enable the identity on your Azure resource and then configure your app to use this identity for authentication.

> [!div class="nextstepaction"]
> [Authenticate by using a system-assigned managed identity](system-assigned-managed-identity.md)

## Authentication during local development

During local development, you can authenticate to Azure resources by using your developer credentials, a broker, or a service principal. By using one of these methods, you can test your app's authentication logic without deploying it to Azure.

### Use developer credentials

You can use your own Azure credentials to authenticate to Azure resources during local development. Typically, you use a development tool such as Azure CLI, Azure Developer CLI, Azure PowerShell, Visual Studio Code, or IntelliJ IDEA. These tools can provide your app with the necessary tokens to access Azure services. This method is convenient but you should use it only for development purposes.

> [!div class="nextstepaction"]
> [Authenticate locally by using developer accounts](local-development-dev-accounts.md)

### Use a broker

Brokered authentication collects user credentials using the system authentication broker to authenticate an app. A system authentication broker runs on a user's machine and manages the authentication handshakes and token maintenance for all connected accounts.

> [!div class="nextstepaction"]
> [Authenticate locally by using a broker](local-development-broker.md)

### Use a service principal

You can create a service principal in a Microsoft Entra tenant to represent an app and authenticate to Azure resources. You can configure your app to use service principal credentials during local development. This method is more secure than using developer credentials and is closer to how your app authenticates in production. However, it's still less ideal than using a managed identity due to the need for secrets.

> [!div class="nextstepaction"]
> [Authenticate locally by using service principals](local-development-service-principal.md)

## Authentication for apps hosted on-premises

For apps hosted on-premises, you can use a service principal to authenticate to Azure resources. This involves creating a service principal in Microsoft Entra ID, assigning it the necessary permissions, and configuring your app to use its credentials. This method allows your on-premises app to securely access Azure services.

> [!div class="nextstepaction"]
> [Authenticate your on-prem app using a service principal](on-premises-apps.md)

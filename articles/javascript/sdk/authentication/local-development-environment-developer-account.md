---
title: Authenticate Node.js apps to Azure using developer accounts
description: Learn how to authenticate your application to Azure services when using the Azure SDK for Node.js during local development using developer accounts.
ms.topic: how-to
ms.date: 09/11/2025
ms.custom:
  - devx-track-azurecli
  - devx-track-azurepowershell
  - devx-track-js
  - sfi-image-nochange

---

# Authenticate Node.js apps to Azure services during local development using developer accounts

During local development, applications need to authenticate to Azure to access various Azure services. Two common approaches for local authentication are to [use a service principal](local-development-environment-service-principal.md) or to use a developer account. This article explains how to use a developer account. In the sections ahead, you learn:

- How to use Microsoft Entra groups to efficiently manage permissions for multiple developer accounts
- How to assign roles to developer accounts to scope permissions
- How to sign-in to supported local development tools
- How to authenticate using a developer account from your app code

:::image type="content" source="../../../includes/media/sdk-auth-passwordless/javascript/local-dev-dev-accounts-overview.png" alt-text="A diagram showing a local dev app running obtaining a service principal from an .env file and use that identity to connect to Azure resources.":::

For an app to authenticate to Azure during local development using the developer's Azure credentials, the developer must be signed-in to Azure from one of the following developer tools:

- Azure CLI
- Azure Developer CLI
- Azure PowerShell

The Azure Identity library can detect that the developer is signed-in from one of these tools. The library can then obtain the Microsoft Entra access token via the tool to authenticate the app to Azure as the signed-in user.

This approach takes advantage of the developer's existing Azure accounts to streamline the authentication process. However, a developer's account likely has more permissions than required by the app, therefore exceeding the permissions the app runs with in production. As an alternative, you can [create application service principals to use during local development](./local-development-environment-service-principal.md), which can be scoped to have only the access needed by the app.

[!INCLUDE [auth-create-entra-group](../../../includes/authentication/auth-create-entra-group.md)]

[!INCLUDE [auth-assign-group-roles](../../../includes/authentication/auth-assign-group-roles.md)]

[!INCLUDE [auth-sign-in-dev-tooling](../../../includes/authentication/auth-sign-in-dev-tooling.md)]

[!INCLUDE [Implement DefaultAzureCredential](<../includes/implement-defaultazurecredential.md>)]
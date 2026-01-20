---
title: "Local dev: Auth JS apps to Azure services with service principal"
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for JavaScript during local development using dedicated application service principals.
ms.date: 01/20/2026
ms.topic: how-to
ms.custom:
  - dexx-track-js
  - devx-track-azurecli
  - devx-track-js
  - sfi-image-nochange
#.NET:03/11/2025:https://github.com/dotnet/docs/blob/main/docs/azure/sdk/authentication/local-development-service-principal.md
---

# Authenticate JavaScript apps to Azure services during local development using service principals

During local development, applications need to authenticate to Azure to access various Azure services. Two common approaches for local authentication are to [use a developer account](./local-development-environment-developer-account.md) or a service principal. This article explains how to use an application service principal. In the following sections, you learn:

- How to register an application with Microsoft Entra to create a service principal
- How to use Microsoft Entra groups to efficiently manage permissions
- How to assign roles to scope permissions
- How to authenticate using a service principal from your app code

By using dedicated application service principals, you can adhere to the principle of least privilege when accessing Azure resources. Limit permissions to the specific requirements of the app during development, preventing accidental access to Azure resources intended for other apps or services. This approach also helps avoid issues when the app is moved to production by ensuring it isn't over-privileged in the development environment.

:::image type="content" source="../../../includes/authentication/media/mermaidjs/local-service-principal-authentication.svg" alt-text="A diagram showing how a JavaScript app during local development uses the developer's credentials to connect to Azure by obtaining those credentials locally installed development tools.":::

When you register the app in Azure, you create an application service principal. For local development:

- Create a separate app registration for each developer working on the app so each developer has their own application service principal and doesn't need to share credentials.
- Create a separate app registration for each app to limit the app's permissions to only what is necessary.

During local development, set environment variables with the application service principal's identity. The Azure Identity library reads these environment variables to authenticate the app to the required Azure resources.

[!INCLUDE [create-app-registration](../../../includes/authentication/create-app-registration.md)]

[!INCLUDE [create-entra-group](../../../includes/authentication/create-entra-group.md)]

[!INCLUDE [assign-group-roles](../../../includes/authentication/assign-group-roles.md)]

[!INCLUDE [add app environment variables](../../../includes/authentication/authenticate-set-environment-variables-javascript.md)]

[!INCLUDE [auth and implement code](./includes/implement-default-azure-credential.md)]

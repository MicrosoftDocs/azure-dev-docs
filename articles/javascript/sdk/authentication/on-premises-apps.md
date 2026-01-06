---
title: Authenticate to Azure resources from JavaScript apps hosted on-premises
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for JavaScript in on-premises hosted apps. 
ms.topic: how-to
ms.date: 03/13/2025
ms.custom:
  - devx-track-js
  - engagement-fy23
  - sfi-image-nochange
---

# Authenticate to Azure resources from JavaScript apps hosted on-premises

Apps hosted outside of Azure, such as on-premises or in a third-party data center, should use an application service principal through [Microsoft Entra ID](/entra/fundamentals/whatis) to authenticate to Azure services. In the sections ahead, you learn:

- How to register an application with Microsoft Entra to create a service principal
- How to assign roles to scope permissions
- How to authenticate using a service principal from your app code

Using dedicated application service principals allows you to adhere to the principle of least privilege when accessing Azure resources. Permissions are limited to the specific requirements of the app during development, preventing accidental access to Azure resources intended for other apps or services. This approach also helps avoid issues when the app is moved to production by ensuring it isn't over-privileged in the development environment.

A different app registration should be created for each environment the app is hosted in. This allows environment specific resource permissions to be configured for each service principal and make sure an app deployed to one environment doesn't talk to Azure resources that are part of another environment.

[!INCLUDE [authentication-create-app-registration](~/dotnet-docs/docs/azure/sdk/includes/auth-create-app-registration.md)]

[!INCLUDE [authentication-assign-service-principal-roles](../../../includes/authentication/includes/authentication-assign-service-principal-roles.md)]

[!INCLUDE [authentication-set-environment-variables](../../../includes/authentication/includes/authentication-set-environment-variables-javascript.md)]

[!INCLUDE [authentication-to Azure Services](~/dotnet-docs/docs/azure/sdk/includes/implement-service-principal-concepts.md)]


[!INCLUDE [Implement service principal](../../../includes/authentication/includes/implement-service-principal-javascript.md)]


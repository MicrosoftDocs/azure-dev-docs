---
title: Secure Java WebSphere apps using app roles and role claims
titleSuffix: Azure
description: Shows you how to add authorization using app roles and role claims to Java WebSphere app that signs in users with the Microsoft identity platform.
author: KarlErickson
ms.author: givermei
ms.date: 03/11/2024
ms.topic: article
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Secure Java WebSphere apps using app roles and role claims

This article demonstrates a Java WebSphere app that uses [OpenID Connect](/entra/identity-platform/v2-protocols-oidc) to sign in users and [Microsoft Entra ID Application Roles (app roles)](/entra/identity-platform/howto-add-app-roles-in-apps) for authorization.

[!INCLUDE [scenario-authorization-roles.md](includes/scenario-authorization-roles.md)]

## Prerequisites

[!INCLUDE [prerequisites-authorization-roles.md](includes/prerequisites-authorization-roles.md)]

[!INCLUDE [prerequisites-websphere.md](includes/prerequisites-websphere.md)]

## Recommendations

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-role-entra-id.md](includes/enable-java-servlet-webapp-authorization-role-entra-id.md)]

[!INCLUDE [deploy-websphere.md](includes/deploy-websphere.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-role-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-role-entra-id-explore.md)]

## Next step

[Deploy Java WebSphere apps to Traditional WebSphere on Azure Virtual Machines](deploy-websphere-to-vm.md)

---
title: Add authorization using app roles & roles claims to Java Tomcat Web app that signs-in users with the Microsoft identity platform
description: Shows you how to add authorization using app roles & roles claims to Java Tomcat Web app that signs-in users with the Microsoft identity platform
services: active-directory
documentationcenter: java
ms.date: 01/01/2024
ms.service: active-directory
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: identity
ms.custom: devx-track-java, devx-track-extended-java
adobe-target: true
---

# Add authorization using app roles & roles claims to Java Tomcat Web app that signs-in users with the Microsoft identity platform


This article shows how a Java Tomcat web app that uses [OpenID Connect](https://learn.microsoft.com/entra/identity-platform/v2-protocols-oidc) to sign in users and use [**Microsoft Entra ID Application Roles (app roles)**](https://learn.microsoft.com/entra/identity-platform/howto-add-app-roles-in-apps) for authorization. App roles, along with Security groups are popular means to implement authorization.

This application implements RBAC using Microsoft Entra ID's Application Roles & Role Claims feature. Another approach is to use Microsoft Entra ID Groups and Group Claims. Microsoft Entra ID Groups and Application Roles are by no means mutually exclusive; they can be used in tandem to provide even finer grained access control.

Using RBAC with Application Roles and Role Claims, developers can securely enforce authorization policies with minimal effort on their part.

- A Microsoft Identity Platform Office Hours session covered Microsoft Entra ID App roles and security groups, featuring this scenario and this sample. A recording of the session is is provided in this video [Using Security Groups and Application Roles in your apps](https://www.youtube.com/watch?v=LRoc-na27l0)

For more information about how the protocols work in this scenario and other scenarios, see [Authentication Scenarios for Microsoft Entra ID](http://go.microsoft.com/fwlink/?LinkId=394414).

[!INCLUDE [scenario-authz-roles.md](includes/scenario-authz-roles.md)]

[!INCLUDE [prereqs-authz-roles.md](includes/prereqs-authz-roles.md)]
[!INCLUDE [prereqs-tomcat.md](includes/prereqs-tomcat.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-role-entra-id.md](includes/enable-java-servlet-webapp-authorization-role-entra-id.md)]

[!INCLUDE [deploy-tomcat-app-service.md](includes/deploy-tomcat-app-service.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-role-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-role-entra-id-explore.md)]

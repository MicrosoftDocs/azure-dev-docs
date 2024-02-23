---
title: Enable your Java Websphere web app to sign in users and restrict access to pages using security groups and groups claims with the Microsoft identity platform
description: Shows you how to develop a Java Websphere web app to sign in users and restrict access to pages using security groups and groups claims with the Microsoft identity platform
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


# Enable your Java Websphere web app to sign in users and restrict access to pages using security groups and groups claims with the Microsoft identity platform

This article demonstrates how to create a Java Websphere web app that signs in users with [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java) and restricts access to pages based on Microsoft Entra ID security group membership.

![Overview](./media/topology.png)

An Identity Developer session covered Microsoft Entra ID App roles and security groups, featuring this scenario and how to handle the overage claim. [Watch the video Using Security Groups and Application Roles in your apps](https://www.youtube.com/watch?v=LRoc-na27l0)

[!INCLUDE [scenario-authz-groups.md](includes/scenario-authz-groups.md)]

[!INCLUDE [prereqs-authz-groups.md](includes/prereqs-authz-groups.md)]
[!INCLUDE [prereqs-websphere.md](includes/prereqs-websphere.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-group-entra-id.md](includes/enable-java-servlet-webapp-authorization-group-entra-id.md)]

[!INCLUDE [deploy-websphere.md](includes/deploy-websphere.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-group-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-group-entra-id-explore.md)]
---
title: Secure Java JBoss EAP apps using groups and group claims
titleSuffix: Azure
description: Shows how to enable sign-in for Java JBoss EAP apps and restrict access to pages using security groups and group claims with the Microsoft identity platform.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Secure Java JBoss EAP apps using groups and group claims

This article demonstrates how to create a Java JBoss EAP web app that signs in users with [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java) and restricts access to pages based on Microsoft Entra ID security group membership.

:::image type="content" source="./media/topology.png" alt-text="Overview":::

An Identity Developer session covered Microsoft Entra ID App roles and security groups, featuring this scenario and how to handle the overage claim. [Watch the video Using Security Groups and Application Roles in your apps](https://www.youtube.com/watch?v=LRoc-na27l0).

[!INCLUDE [scenario-authorization-groups.md](includes/scenario-authorization-groups.md)]

[!INCLUDE [prerequisites-authorization-groups.md](includes/prerequisites-authorization-groups.md)]
[!INCLUDE [prerequisites-jboss.md](includes/prerequisites-jboss.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-group-entra-id.md](includes/enable-java-servlet-webapp-authorization-group-entra-id.md)]

[!INCLUDE [deploy-jboss-app-service.md](includes/deploy-jboss-app-service.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-group-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-group-entra-id-explore.md)]

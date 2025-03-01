---
title: Secure Java Tomcat apps using groups and group claims
titleSuffix: Azure
description: Shows how to create a Java Tomcat app to sign in users and restrict access to pages using security groups and group claims with the Microsoft identity platform.
author: KarlErickson
ms.author: karler
ms.reviewer: givermei
ms.date: 03/11/2024
ms.topic: article
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Secure Java Tomcat apps using groups and group claims

This article shows you how to create a Java Tomcat app that signs in users with [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java). The app also restricts access to pages based on Microsoft Entra ID security group membership.

[!INCLUDE [scenario-authorization-groups.md](includes/scenario-authorization-groups.md)]

## Prerequisites

[!INCLUDE [prerequisites-authorization-groups.md](includes/prerequisites-authorization-groups.md)]

[!INCLUDE [prerequisites-tomcat.md](includes/prerequisites-tomcat.md)]

## Recommendations

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-group-entra-id.md](includes/enable-java-servlet-webapp-authorization-group-entra-id.md)]

[!INCLUDE [deploy-tomcat-app-service.md](includes/deploy-tomcat-app-service.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-group-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-group-entra-id-explore.md)]

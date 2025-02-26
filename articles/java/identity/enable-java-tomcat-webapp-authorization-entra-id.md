---
title: Enable Tomcat app sign-in and access to Microsoft Graph
titleSuffix: Azure
description: Shows you how to develop a Java Tomcat app to sign in users and call Microsoft Graph with the Microsoft identity platform.
author: KarlErickson
ms.author: karler
ms.reviewer: givermei
ms.date: 03/11/2024
ms.topic: article
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Enable Java Tomcat apps to sign in users and access Microsoft Graph

This article demonstrates a Java Tomcat app that signs in users and obtains an access token for calling [Microsoft Graph](/graph/overview). It uses the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [scenario-authorization-graph.md](includes/scenario-authorization-graph.md)]

## Prerequisites

[!INCLUDE [prerequisites-authorization-graph.md](includes/prerequisites-authorization-graph.md)]

[!INCLUDE [prerequisites-tomcat.md](includes/prerequisites-tomcat.md)]

## Recommendations

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-entra-id.md](includes/enable-java-servlet-webapp-authorization-entra-id.md)]

[!INCLUDE [deploy-tomcat-app-service.md](includes/deploy-tomcat-app-service.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-entra-id-explore.md)]

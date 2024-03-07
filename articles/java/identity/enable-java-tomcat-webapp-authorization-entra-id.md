---
title: Enable Tomcat app sign-in and access to Microsoft Graph
description: Shows you how to develop a Java Tomcat web app to sign in users and call Microsoft Graph with the Microsoft identity platform.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Enable Java Tomcat apps to sign in users and access Microsoft Graph

This article demonstrates a Java Tomcat web app that signs in users and obtains an access token for calling [Microsoft Graph](/graph/overview). It uses the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

:::image type="content" source="./media/topology.png" alt-text="Overview":::

[!INCLUDE [scenario-authorization-graph.md](includes/scenario-authorization-graph.md)]

[!INCLUDE [prerequisites-authorization-graph.md](includes/prerequisites-authorization-graph.md)]
[!INCLUDE [prerequisites-tomcat.md](includes/prerequisites-tomcat.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-entra-id.md](includes/enable-java-servlet-webapp-authorization-entra-id.md)]

[!INCLUDE [deploy-tomcat-app-service.md](includes/deploy-tomcat-app-service.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-entra-id-explore.md)]

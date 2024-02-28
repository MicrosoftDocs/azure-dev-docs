---
title: Enable your Java JBoss EAP web app to sign in users to your Microsoft Entra ID tenant with the Microsoft identity platform
description: Shows you how to develop a Java JBoss EAP web app which supports sign-in by Microsoft Entra account.
services: active-directory
ms.date: 01/01/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Enable your Java JBoss EAP web app to sign in users to your Microsoft Entra ID tenant with the Microsoft identity platform

This article demonstrates a Java JBoss EAP web app that signs in users to your Microsoft Entra ID tenant using the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

:::image type="content" source="./media/topology-sign-in.png" alt-text="Overview":::

[!INCLUDE [scenario-sign-in-entra.md](includes/scenario-sign-in-entra.md)]

[!INCLUDE [prereqs-sign-in-entra.md](includes/prereqs-sign-in-entra.md)]
[!INCLUDE [prereqs-jboss.md](includes/prereqs-jboss.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-entra-id.md](includes/enable-java-servlet-webapp-authentication-entra-id.md)]

[!INCLUDE [deploy-jboss-app-service.md](includes/deploy-jboss-app-service.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-entra-id-explore.md](includes/enable-java-servlet-webapp-authentication-entra-id-explore.md)]

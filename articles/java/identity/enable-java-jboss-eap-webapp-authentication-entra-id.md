---
title: Enable your Java Jboss EAP web app to sign in users to your Microsoft Entra ID tenant with the Microsoft identity platform
description: Shows you how to develop a Java Jboss EAP web app which supports sign-in by Microsoft Entra account.
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

# Enable your Java Jboss EAP web app to sign in users to your Microsoft Entra ID tenant with the Microsoft identity platform

This article demonstrates a Java JBoss EAP web app that signs in users to your Microsoft Entra ID tenant using the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

![Overview](./media/topology-sign-in.png)

[!INCLUDE [scenario-sign-in-entra.md](includes/scenario-sign-in-entra.md)]

[!INCLUDE [prereqs-sign-in-entra.md](includes/prereqs-sign-in-entra.md)]
[!INCLUDE [prereqs-jboss.md](includes/prereqs-jboss.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-entra-id.md](includes/enable-java-servlet-webapp-authentication-entra-id.md)]

[!INCLUDE [deploy-jboss-app-service.md](includes/deploy-jboss-app-service.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-entra-id-explore.md](includes/enable-java-servlet-webapp-authentication-entra-id-explore.md)]
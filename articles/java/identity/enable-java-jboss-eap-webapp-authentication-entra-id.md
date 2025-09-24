---
title: Enable sign-in for JBoss EAP apps using Microsoft Entra ID
titleSuffix: Azure
description: Shows you how to develop a Java JBoss EAP app that supports sign-in using a Microsoft Entra account.
author: bmitchell287
ms.author: brendm
ms.reviewer: givermei
ms.date: 08/21/2025
ms.topic: article
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Enable sign-in for Java JBoss EAP apps using Microsoft Entra ID

This article demonstrates a Java JBoss EAP app that signs in users to your Microsoft Entra ID tenant using the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [scenario-sign-in-entra.md](includes/scenario-sign-in-entra.md)]

## Prerequisites

[!INCLUDE [prerequisites-sign-in-entra.md](includes/prerequisites-sign-in-entra.md)]

[!INCLUDE [prerequisites-jboss.md](includes/prerequisites-jboss.md)]

## Recommendations

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-entra-id.md](includes/enable-java-servlet-webapp-authentication-entra-id.md)]

[!INCLUDE [deploy-jboss-app-service.md](includes/deploy-jboss-app-service.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-entra-id-explore.md](includes/enable-java-servlet-webapp-authentication-entra-id-explore.md)]

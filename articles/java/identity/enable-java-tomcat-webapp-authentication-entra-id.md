---
title: Enable sign-in for Tomcat apps using Microsoft Entra ID
titleSuffix: Azure
description: Shows you how to develop a Java Tomcat app that supports sign-in using a Microsoft Entra account.
author: KarlErickson
ms.author: karler
ms.reviewer: givermei
ms.date: 03/11/2024
ms.topic: article
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Enable sign-in for Java Tomcat apps using Microsoft Entra ID

This article demonstrates a Java Tomcat app that signs in users to your Microsoft Entra ID tenant using the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [scenario-sign-in-entra.md](includes/scenario-sign-in-entra.md)]

## Prerequisites

[!INCLUDE [prerequisites-sign-in-entra.md](includes/prerequisites-sign-in-entra.md)]

[!INCLUDE [prerequisites-tomcat.md](includes/prerequisites-tomcat.md)]

## Recommendations

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-entra-id.md](includes/enable-java-servlet-webapp-authentication-entra-id.md)]

[!INCLUDE [deploy-tomcat-app-service.md](includes/deploy-tomcat-app-service.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-entra-id-explore.md](includes/enable-java-servlet-webapp-authentication-entra-id-explore.md)]

---
title: Enable your Java JBoss EAP Web App using MSAL4J to authenticate users into Azure Active Directory B2C
description: Shows you how to develop a Java JBoss EAP web app which supports sign-in by Azure Active Directory B2C.
services: active-directory
ms.date: 01/01/2024
ms.service: active-directory
ms.subservice: B2C
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Enable your Java JBoss EAP Web App using MSAL4J to authenticate users into Azure Active Directory B2C

This article demonstrates a Java JBoss EAP web application that authenticates users against Azure Active Directory B2C (Azure AD B2C) using the [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [scenario-sign-in-azure-ad-b2c.md](includes/scenario-sign-in-azure-ad-b2c.md)]

[!INCLUDE [prerequisites-sign-in-azure-ad-b2c.md](includes/prerequisites-sign-in-azure-ad-b2c.md)]
[!INCLUDE [prerequisites-jboss.md](includes/prerequisites-jboss.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c.md)]

[!INCLUDE [deploy-jboss-app-service.md](includes/deploy-jboss-app-service.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md)]

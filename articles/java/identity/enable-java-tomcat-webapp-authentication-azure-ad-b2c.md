---
title: Enable your Java Tomcat Web App using MSAL4J to authenticate users into Azure Active Directory B2C
description: Shows you how to develop a Java Tomcat web app that supports sign-in by Azure Active Directory B2C.
services: active-directory
ms.date: 01/01/2024
ms.service: active-directory
ms.subservice: B2C
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Enable your  Java Tomcat Web App using MSAL4J to authenticate users into Azure Active Directory B2C

This article demonstrates a Java Tomcat web application that authenticates users against Azure Active Directory B2C (Azure AD B2C) using the [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [scenario-sign-in-azure-ad-b2c.md](includes/scenario-sign-in-azure-ad-b2c.md)]

[!INCLUDE [prerequisites-sign-in-azure-ad-b2c.md](includes/prerequisites-sign-in-azure-ad-b2c.md)]
[!INCLUDE [prerequisites-tomcat.md](includes/prerequisites-tomcat.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c.md)]

[!INCLUDE [deploy-tomcat-app-service.md](includes/deploy-tomcat-app-service.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md)]

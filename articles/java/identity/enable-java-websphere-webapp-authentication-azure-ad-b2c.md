---
title: Enable your Java Websphere Web App using MSAL4J to authenticate users into Azure Active Directory B2C
description: Shows you how to develop a Java Websphere web app which supports sign-in by Azure Active Directory B2C.
services: active-directory
documentationcenter: java
ms.date: 01/01/2024
ms.service: active-directory-b2c
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: identity
ms.custom: devx-track-java, devx-track-extended-java
adobe-target: true
---

# Enable your Java Websphere Web App using MSAL4J to authenticate users into Azure Active Directory B2C

This article demonstrates a Java Servlet web application that authenticates users against Azure Active Directory B2C (Azure AD B2C) using the the [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [scenario-sign-in-aadb2c.md](includes/scenario-sign-in-aadb2c.md)]

[!INCLUDE [prereqs-sign-in-aadb2c.md](includes/prereqs-sign-in-aadb2c.md)]
[!INCLUDE [prereqs-websphere.md](includes/prereqs-websphere.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c.md)]

[!INCLUDE [deploy-websphere.md](includes/deploy-websphere.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md)]
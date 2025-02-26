---
title: Enable sign-in for Java WebSphere apps using MSAL4J
titleSuffix: Azure Active Directory B2C
description: Shows you how to develop a Java WebSphere app that supports sign-in by Azure Active Directory B2C.
author: KarlErickson
ms.author: karler
ms.reviewer: givermei
ms.date: 03/11/2024
ms.topic: article
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Enable sign-in for Java WebSphere apps using MSAL4J with Azure Active Directory B2C

This article demonstrates a Java Servlet application that authenticates users against Azure Active Directory B2C (Azure AD B2C) using the [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [scenario-sign-in-azure-ad-b2c.md](includes/scenario-sign-in-azure-ad-b2c.md)]

## Prerequisites

[!INCLUDE [prerequisites-sign-in-azure-ad-b2c.md](includes/prerequisites-sign-in-azure-ad-b2c.md)]

[!INCLUDE [prerequisites-websphere.md](includes/prerequisites-websphere.md)]

## Recommendations

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c.md)]

[!INCLUDE [deploy-websphere.md](includes/deploy-websphere.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md)]

## Next step

[Deploy Java WebSphere apps to Traditional WebSphere on Azure Virtual Machines](deploy-websphere-to-vm.md)

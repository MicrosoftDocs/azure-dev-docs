---
title: Enable sign-in for WebSphere apps using Microsoft Entra ID
titleSuffix: Azure
description: Shows you how to develop a Java WebSphere app that supports sign-in by using a Microsoft Entra account.
author: KarlErickson
ms.author: karler
ms.reviewer: givermei
ms.date: 03/11/2024
ms.topic: article
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Enable sign-in for Java WebSphere apps using Microsoft Entra ID

This sample demonstrates a Java WebSphere app that signs in users to your Microsoft Entra ID tenant using the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [scenario-sign-in-entra.md](includes/scenario-sign-in-entra.md)]

## Prerequisites

[!INCLUDE [prerequisites-sign-in-entra.md](includes/prerequisites-sign-in-entra.md)]

[!INCLUDE [prerequisites-websphere.md](includes/prerequisites-websphere.md)]

## Recommendations

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-entra-id.md](includes/enable-java-servlet-webapp-authentication-entra-id.md)]

[!INCLUDE [deploy-websphere.md](includes/deploy-websphere.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-entra-id-explore.md](includes/enable-java-servlet-webapp-authentication-entra-id-explore.md)]

## Next step

[Deploy Java WebSphere apps to Traditional WebSphere on Azure Virtual Machines](deploy-websphere-to-vm.md)

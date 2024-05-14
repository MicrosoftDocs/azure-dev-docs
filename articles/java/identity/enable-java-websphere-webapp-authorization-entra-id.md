---
title: Enable WebSphere app sign-in and access to Microsoft Graph
titleSuffix: Azure
description: Shows you how to develop a Java WebSphere app to sign in users and call Microsoft Graph with the Microsoft identity platform.
author: KarlErickson
ms.author: givermei
ms.date: 03/11/2024
ms.topic: article
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Enable Java WebSphere apps to sign in users and access Microsoft Graph

This article demonstrates a Java WebSphere app that signs in users and obtains an access token for calling [Microsoft Graph](/graph/overview). It uses the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [scenario-authorization-graph.md](includes/scenario-authorization-graph.md)]

## Prerequisites

[!INCLUDE [prerequisites-authorization-graph.md](includes/prerequisites-authorization-graph.md)]

[!INCLUDE [prerequisites-websphere.md](includes/prerequisites-websphere.md)]

## Recommendations

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-entra-id.md](includes/enable-java-servlet-webapp-authorization-entra-id.md)]

[!INCLUDE [deploy-websphere.md](includes/deploy-websphere.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-entra-id-explore.md)]

## Next step

[Deploy Java WebSphere apps to Traditional WebSphere on Azure Virtual Machines](deploy-websphere-to-vm.md)

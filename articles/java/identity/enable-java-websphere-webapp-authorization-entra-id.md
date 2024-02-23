---
title: Enable your Java Websphere web app to sign in users and access resources on Microsoft Graph
description: Shows you how to develop a Java Websphere web app to sign in users and call Microsoft Graph with the Microsoft identity platform.
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

# Enable your Java Websphere web app to sign in users and access resources on Microsoft Graph

This article demonstrates a Java Websphere web app that signs in users and obtains an access token for calling [Microsoft Graph](https://docs.microsoft.com/graph/overview). It uses the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

![Overview](./media/topology.png)

[!INCLUDE [scenario-authz-graph.md](includes/scenario-authz-graph.md)]

[!INCLUDE [prereqs-authz-graph.md](includes/prereqs-authz-graph.md)]
[!INCLUDE [prereqs-websphere.md](includes/prereqs-websphere.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-entra-id.md](includes/enable-java-servlet-webapp-authorization-entra-id.md)]

[!INCLUDE [deploy-websphere.md](includes/deploy-websphere.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-entra-id-explore.md)]
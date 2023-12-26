---
title: Enable your Java Tomcat web app to sign in users to your Microsoft Entra ID tenant with the Microsoft identity platform
description: Shows you how to develop a Tomcat web app which supports sign-in by Microsoft Entra account.
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

# Enable your Java Tomcat web app to sign in users to your Microsoft Entra ID tenant with the Microsoft identity platform

This article demonstrates a Java Tomcat web app that signs in users to your Microsoft Entra ID tenant using the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

![Overview](./media/topology-sgin-in.png)

[!INCLUDE [enable-java-servlet-webapp-authn-entra-id.md](includes/enable-java-servlet-webapp-authn-entra-id.md)]

#### Deploying the Sample

TODO: update this with the actual steps or a link to the specific guidance

Our samples can be deployed to a number of application servers, such as Tomcat, WebLogic, or Webshpere, and MSAL Java itself can generally be integrated into existing applications without changes to your existing deployment set up.

You can find instructions for deploying our samples [here on MSAL Java's Github wiki](https://github.com/AzureAD/microsoft-authentication-library-for-java/wiki/Deployment-Instructions-for-MSAL-Java-Samples).

![Experience](./media/app.png)

[!INCLUDE [enable-java-servlet-webapp-authn-entra-id-explore.md](includes/enable-java-servlet-webapp-authn-entra-id-explore.md)]
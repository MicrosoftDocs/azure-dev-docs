---
title: Enable your Java Websphere web app to sign in users to your Microsoft Entra ID tenant with the Microsoft identity platform
description: Shows you how to develop a Java Websphere web app which supports sign-in by Microsoft Entra account.
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

# Enable your Java Websphere web app to sign in users to your Microsoft Entra ID tenant with the Microsoft identity platform

This sample demonstrates a Java Websphere web app that signs in users to your Microsoft Entra ID tenant using the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

![Overview](./media/topology-sign-in.png)

[!INCLUDE [enable-java-servlet-webapp-authn-entra-id.md](includes/enable-java-servlet-webapp-authn-entra-id.md)]


#### Deploying the Sample

(These instructions assume you have installed Websphere and set up some server ) Before you can deploy to Websphere, you will need to make some configuration changes in the sample itself and (re)build the package:

1. In the sample there is likely an application.properties or authentication.properties file where you configured the client ID, tenant, redirect URL, etc.
1. In the above mentioned steps, changed references to localhost:8080 or localhost:8443 to the URL/port Websphere will run on, which by default should be localhost:9080
1. You will also need to make the same change in the Azure app registration, where you set it as the 'Redirect URI' in the 'Authentication' tab

Top deploy the sample using the Websphere's Integrated Solutions Console:

1. In the 'Applications' tab, select 'New Application', then 'New Enterprise Application'

1. Choose the .war you built, then click 'next' until you get to the 'Map context roots for Web modules' installation step (the other default settings should be fine)

1. For the context root, set it to the same value as after the port number in the 'Redirect URI' you set in sample configuration/Azure app registration, i.e. if the redirect URI is http://localhost:9080/msal4j-servlet-auth/ then the context root should just be 'msal4j-servlet-auth'

1. Click 'Finish', and after the application finishes installing go to the 'Websphere enterprise applications' section of the 'Applications' tab

1. Select the .war you just installed from the list of applications and click 'Start' to deploy

1. One it finishes deploying, navigate to http://localhost:9080/{whatever you set as the context root} and you should be able to see the application

[!INCLUDE [enable-java-servlet-webapp-authn-entra-id-explore.md](includes/enable-java-servlet-webapp-authn-entra-id-explore.md)]
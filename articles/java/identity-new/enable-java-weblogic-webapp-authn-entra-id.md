---
title: Enable your Java WebLogic web app to sign in users to your Microsoft Entra ID tenant with the Microsoft identity platform
description: Shows you how to develop a Java WebLogic web app which supports sign-in by Microsoft Entra account.
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

# Enable your Java WebLogic web app to sign in users to your Microsoft Entra ID tenant with the Microsoft identity platform

This article demonstrates a Java WebLogic web app that signs in users to your Microsoft Entra ID tenant using the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

![Overview](./media/topology-sign-in.png)

[!INCLUDE [enable-java-servlet-webapp-authn-entra-id.md](includes/enable-java-servlet-webapp-authn-entra-id.md)]


#### Deploying the Sample

(These instructions assume you have installed WebLogic and set up some server domain)

Before you can deploy to WebLogic, you will need to make some configuration changes in the sample itself and (re)build the package:

1. In the sample there is likely an application.properties or authentication.properties file where you configured the client ID, tenant, redirect URL, etc.

2. In the above mentioned steps, changed references to localhost:8080 or localhost:8443 to the URL/port WebLogic will run on, which by default should be localhost:7001

3. You will also need to make the same change in the Azure app registration, where you set it as the 'Redirect URI' in the 'Authentication' tab

To deploy the sample to WebLogic via the web console:

1. Start the WebLogic server with DOMAIN_NAME\bin\startWebLogic.cmd

2. Navigate to the WebLogic web console in your browser, http://localhost:7001/console

3. Go to Domain Structure > Deployments, click Install, click upload your files, and find the .war file you built with Maven

4. Select Install this deployment as an application, click Next, click Finish, and then Save

    - Most of the default settings should be fine except that you should name the application to match the 'Redirect URI' you set in sample configuration/Azure app registration, i.e. if the redirect URI is http://localhost:7001/msal4j-servlet-auth then you should name the application 'msal4j-servlet-auth'
5. Go back to Domain Structure > Deployments, and Start your application

6. Once the application starts, navigate to http://localhost:7001/{whatever you named the application}/, and you should be able to access the application

[!INCLUDE [enable-java-servlet-webapp-authn-entra-id-explore.md](includes/enable-java-servlet-webapp-authn-entra-id-explore.md)]
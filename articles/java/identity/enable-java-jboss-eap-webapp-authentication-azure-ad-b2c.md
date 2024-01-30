---
title: Enable your Java Jboss EAP Web App using MSAL4J to authenticate users into Azure Active Directory B2C
description: Shows you how to develop a Java Jboss EAP web app which supports sign-in by Azure Active Directory B2C.
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

# Enable your Java Jboss EAP Web App using MSAL4J to authenticate users into Azure Active Directory B2C

This article demonstrates a Java Jboss EAP web application that authenticates users against Azure Active Directory B2C (Azure AD B2C) using the the [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c.md)]

## Deploying the Sample

Before you can deploy to JBoss, you will need to make some configuration changes in the sample itself and (re)build the package:

1. In the sample there is likely an application.properties or authentication.properties file where you configured the client ID, tenant, redirect URL, etc.

1. In the above mentioned file, changed references to localhost:8080 or localhost:8443 to the URL/port JBoss will run on, which by default should be localhost:9990

1. You will also need to make the same change in the Azure app registration, where you set it as the 'Redirect URI' in the 'Authentication' tab

To deploy the sample to JBoss EAP via the web console:

1. Start the JBoss server with %JBOSS_HOME%\bin\standalone.bat

1. Navigate to the JBoss web console in your browser, http://localhost:9990

1. Go to Deployments, click Add, and upload the .war you built

1. Most of the default settings should be fine except that you should name the application to match the 'Redirect URI' you set in sample configuration/Azure app registration, i.e. if the redirect URI is http://localhost:9990/msal4j-servlet-auth/ then you should name the application 'msal4j-servlet-auth'

1. Select the .war file you uploaded, click En/Disable, and Confirm to start the application

1. Once the application starts, navigate to http://localhost:9990/{whatever you named the application}/, and you should be able to access the application

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md)]

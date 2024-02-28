---
title: Enable your Java WebLogic Web App using MSAL4J to authenticate users into Azure Active Directory B2C
description: Shows you how to develop a Java WebLogic web app which supports sign-in by Azure Active Directory B2C.
services: active-directory
ms.date: 01/01/2024
ms.service: active-directory
ms.subservice: B2C
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Enable your Java WebLogic Web App using MSAL4J to authenticate users into Azure Active Directory B2C

This article demonstrates a Java Servlet web application that authenticates users against Azure Active Directory B2C (Azure AD B2C) using the [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [scenario-sign-in-azure-ad-b2c.md](includes/scenario-sign-in-azure-ad-b2c.md)]

[!INCLUDE [prerequisites-sign-in-azure-ad-b2c.md](includes/prerequisites-sign-in-azure-ad-b2c.md)]
[!INCLUDE [prerequisites-weblogic.md](includes/prerequisites-weblogic.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c.md)]

## Deploy the sample

(These instructions assume you have installed WebLogic and set up some server domain)

Before you can deploy to WebLogic, you need to make some configuration changes in the sample itself and build or rebuild the package:

1. In the sample there is likely an *application.properties* or *authentication.properties* file where you configured the client ID, tenant, redirect URL, etc.

1. In the above mentioned steps, changed references to localhost:8080 or localhost:8443 to the URL/port WebLogic runs on, which by default should be localhost:7001

1. You also need to make the same change in the Azure app registration, where you set it as the 'Redirect URI' in the 'Authentication' tab

To deploy the sample to WebLogic via the web console:

1. Start the WebLogic server by using *DOMAIN_NAME\bin\startWebLogic.cmd*.

1. Navigate to the WebLogic web console in your browser, http://localhost:7001/console

1. Go to Domain Structure > Deployments, select **Install**, select **Upload your files**, and then find the *.war* file that you built by using Maven.

1. Select Install this deployment as an application, select **Next**, select **Finish**, and then select **Save**.

    - Most of the default settings should be fine except that you should name the application to match the 'Redirect URI' you set in sample configuration/Azure app registration, i.e. if the redirect URI is http://localhost:7001/msal4j-servlet-auth then you should name the application 'msal4j-servlet-auth'
1. Go back to Domain Structure > Deployments, and Start your application

1. After the application starts, navigate to http://localhost:7001/{whatever you named the application}/, and you should be able to access the application

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md)]

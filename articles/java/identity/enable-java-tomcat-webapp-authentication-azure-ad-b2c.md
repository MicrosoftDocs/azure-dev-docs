---
title: Enable your Java Tomcat Web App using MSAL4J to authenticate users into Azure Active Directory B2C
description: Shows you how to develop a Java Tomcat web app which supports sign-in by Azure Active Directory B2C.
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

# Enable your  Java Tomcat Web App using MSAL4J to authenticate users into Azure Active Directory B2C

This article demonstrates a Java Tomcat web application that authenticates users against Azure Active Directory B2C (Azure AD B2C) using the the [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c.md)]

[!INCLUDE [deploy-tomcat-app-service.md](includes/deploy-tomcat-app-service.md)]

#### Running the sample locally

To run the sample on Tomcat:

1. In your Tomcat installation, ensure there is a entry in tomcat/conf/server.xml for the address you want to host your application on

     - By default, our samples just expect to connect to http://localhost:8080 or https://localhost:8443, as defined in the app.homePage value in authentication.properties file

1. Copy the .war file you generated with Maven to the /webapps/ directory in your Tomcat installation, and start the Tomcat server

1. Once Tomcat starts, open your browser and navigate to whatever URL you defined in step 1, and you should be able to access the application

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md)]
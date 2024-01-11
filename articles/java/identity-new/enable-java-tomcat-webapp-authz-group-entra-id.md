---
title: Enable your Java Tomcat web app to sign in users and restrict access to pages using security groups and groups claims with the Microsoft identity platform
description: Shows you how to develop a Java Tomcat web app to sign in users and restrict access to pages using security groups and groups claims with the Microsoft identity platform
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

# Enable your Java Tomcat web app to sign in users and restrict access to pages using security groups and groups claims with the Microsoft identity platform

This article demonstrates how to create a Java Tomcat web app that signs in users with [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java) and restricts access to pages based on Azure Active Directory security group membership.

![Overview](./media/topology.png)

An Identity Developer session covered Azure AD App roles and security groups, featuring this scenario and how to handle the overage claim. [Watch the video Using Security Groups and Application Roles in your apps](https://www.youtube.com/watch?v=LRoc-na27l0)

[!INCLUDE [enable-java-servlet-webapp-authz-group-entra-id.md](includes/enable-java-servlet-webapp-authz-group-entra-id.md)]


#### Deploying the Sample

To run the sample on Tomcat:

1. In your Tomcat installation, ensure there is a entry in tomcat/conf/server.xml for the address you want to host your application on

     - By default, our samples just expect to connect to http://localhost:8080 or https://localhost:8443, as defined in the app.homePage value in authentication.properties file

2. Copy the .war file you generated with Maven to the /webapps/ directory in your Tomcat installation, and start the Tomcat server

3. Once Tomcat starts, open your browser and navigate to whatever URL you defined in step 1, and you should be able to access the application


[!INCLUDE [enable-java-servlet-webapp-authz-group-entra-id-explore.md](includes/enable-java-servlet-webapp-authz-group-entra-id-explore.md)]
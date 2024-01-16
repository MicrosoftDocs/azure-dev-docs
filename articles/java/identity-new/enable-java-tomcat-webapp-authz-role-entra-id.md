---
title: Add authorization using app roles & roles claims to Java Tomcat Web app that signs-in users with the Microsoft identity platform
description: Shows you how to add authorization using app roles & roles claims to Java Tomcat Web app that signs-in users with the Microsoft identity platform
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

# Add authorization using app roles & roles claims to Java Tomcat Web app that signs-in users with the Microsoft identity platform


This article shows how a Java Tomcat web app that uses [OpenID Connect](https://docs.microsoft.com/azure/active-directory/develop/v1-protocols-openid-connect-code) to sign in users and use [**Azure AD Application Roles (app roles)**](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) for authorization. App roles, along with Security groups are popular means to implement authorization.

This application implements RBAC using Azure AD's Application Roles & Role Claims feature. Another approach is to use Azure AD Groups and Group Claims. Azure AD Groups and Application Roles are by no means mutually exclusive; they can be used in tandem to provide even finer grained access control.

Using RBAC with Application Roles and Role Claims, developers can securely enforce authorization policies with minimal effort on their part.

- A Microsoft Identity Platform Office Hours session covered Azure AD App roles and security groups, featuring this scenario and this sample. A recording of the session is is provided in this video [Using Security Groups and Application Roles in your apps](https://www.youtube.com/watch?v=LRoc-na27l0)

For more information about how the protocols work in this scenario and other scenarios, see [Authentication Scenarios for Azure AD](http://go.microsoft.com/fwlink/?LinkId=394414).

[!INCLUDE [enable-java-servlet-webapp-authz-role-entra-id.md](includes/enable-java-servlet-webapp-authz-role-entra-id.md)]

#### Deploying the Sample

To run the sample on Tomcat:

1. In your Tomcat installation, ensure there is a entry in tomcat/conf/server.xml for the address you want to host your application on

     - By default, our samples just expect to connect to http://localhost:8080 or https://localhost:8443, as defined in the app.homePage value in authentication.properties file

1. Copy the .war file you generated with Maven to the /webapps/ directory in your Tomcat installation, and start the Tomcat server

1. Once Tomcat starts, open your browser and navigate to whatever URL you defined in step 1, and you should be able to access the application

[!INCLUDE [enable-java-servlet-webapp-authz-role-entra-id-explore.md](includes/enable-java-servlet-webapp-authz-role-entra-id-explore.md)]

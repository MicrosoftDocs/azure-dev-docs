---
title: Add authorization using app roles & roles claims to Java WebLogic Web app that signs-in users with the Microsoft identity platform
description: Shows you how to add authorization using app roles & roles claims to Java WebLogic Web app that signs-in users with the Microsoft identity platform
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

# Add authorization using app roles & roles claims to Java WebLogic Web app that signs-in users with the Microsoft identity platform


This article shows how a Java WebLogic web app that uses [OpenID Connect](https://docs.microsoft.com/azure/active-directory/develop/v1-protocols-openid-connect-code) to sign in users and use [**Azure AD Application Roles (app roles)**](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) for authorization. App roles, along with Security groups are popular means to implement authorization.

This application implements RBAC using Azure AD's Application Roles & Role Claims feature. Another approach is to use Azure AD Groups and Group Claims. Azure AD Groups and Application Roles are by no means mutually exclusive; they can be used in tandem to provide even finer grained access control.

Using RBAC with Application Roles and Role Claims, developers can securely enforce authorization policies with minimal effort on their part.

- A Microsoft Identity Platform Office Hours session covered Azure AD App roles and security groups, featuring this scenario and this sample. A recording of the session is is provided in this video [Using Security Groups and Application Roles in your apps](https://www.youtube.com/watch?v=LRoc-na27l0)

For more information about how the protocols work in this scenario and other scenarios, see [Authentication Scenarios for Azure AD](http://go.microsoft.com/fwlink/?LinkId=394414).

[!INCLUDE [enable-java-servlet-webapp-authz-role-entra-id.md](includes/enable-java-servlet-webapp-authz-role-entra-id.md)]

#### Deploying the Sample

(These instructions assume you have installed WebLogic and set up some server domain)

Before you can deploy to WebLogic, you will need to make some configuration changes in the sample itself and (re)build the package:

1. In the sample there is likely an application.properties or authentication.properties file where you configured the client ID, tenant, redirect URL, etc.

2. In the above mentioned file, changed references to localhost:8080 or localhost:8443 to the URL/port WebLogic will run on, which by default should be localhost:7001

3. You will also need to make the same change in the Azure app registration, where you set it as the 'Redirect URI' in the 'Authentication' tab

To deploy the sample to WebLogic via the web console:

1. Start the WebLogic server with DOMAIN_NAME\bin\startWebLogic.cmd

1. Navigate to the WebLogic web console in your browser, http://localhost:7001/console

1. Go to Domain Structure > Deployments, click Install, click upload your files, and find the .war file you built with Maven

1. Select Install this deployment as an application, click Next, click Finish, and then Save

    - Most of the default settings should be fine except that you should name the application to match the 'Redirect URI' you set in sample configuration/Azure app registration, i.e. if the redirect URI is http://localhost:7001/msal4j-servlet-auth then you should name the application 'msal4j-servlet-auth'
1. Go back to Domain Structure > Deployments, and Start your application

1. Once the application starts, navigate to http://localhost:7001/{whatever you named the application}/, and you should be able to access the application

[!INCLUDE [enable-java-servlet-webapp-authz-role-entra-id-explore.md](includes/enable-java-servlet-webapp-authz-role-entra-id-explore.md)]
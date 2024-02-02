---
title: Add authorization using app roles & roles claims to Java Websphere Web app that signs-in users with the Microsoft identity platform
description: Shows you how to add authorization using app roles & roles claims to Java Websphere Web app that signs-in users with the Microsoft identity platform
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

# Add authorization using app roles & roles claims to Java Websphere Web app that signs-in users with the Microsoft identity platform

This article shows how a Java Websphere web app that uses [OpenID Connect](https://learn.microsoft.com/entra/identity-platform/v2-protocols-oidc) to sign in users and use [**Microsoft Entra ID Application Roles (app roles)**](https://learn.microsoft.com/entra/identity-platform/howto-add-app-roles-in-apps) for authorization. App roles, along with Security groups are popular means to implement authorization.

This application implements RBAC using Microsoft Entra ID's Application Roles & Role Claims feature. Another approach is to use Microsoft Entra ID Groups and Group Claims. Microsoft Entra ID Groups and Application Roles are by no means mutually exclusive; they can be used in tandem to provide even finer grained access control.

Using RBAC with Application Roles and Role Claims, developers can securely enforce authorization policies with minimal effort on their part.

- A Microsoft Identity Platform Office Hours session covered Microsoft Entra ID App roles and security groups, featuring this scenario and this sample. A recording of the session is is provided in this video [Using Security Groups and Application Roles in your apps](https://www.youtube.com/watch?v=LRoc-na27l0)

For more information about how the protocols work in this scenario and other scenarios, see [Authentication Scenarios for Microsoft Entra ID](http://go.microsoft.com/fwlink/?LinkId=394414).

[!INCLUDE [scenario-authz-roles.md](includes/scenario-authz-roles.md)]

[!INCLUDE [prereqs-authz-roles.md](includes/prereqs-authz-roles.md)]
[!INCLUDE [prereqs-websphere.md](includes/prereqs-websphere.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-role-entra-id.md](includes/enable-java-servlet-webapp-authorization-role-entra-id.md)]

#### Deploying the Sample

(These instructions assume you have installed Websphere and set up some server ) Before you can deploy to Websphere, you will need to make some configuration changes in the sample itself and (re)build the package:

1. In the sample there is likely an application.properties or authentication.properties file where you configured the client ID, tenant, redirect URL, etc.
1. In the above mentioned file, changed references to localhost:8080 or localhost:8443 to the URL/port Websphere will run on, which by default should be localhost:9080
1. You will also need to make the same change in the Azure app registration, where you set it as the 'Redirect URI' in the 'Authentication' tab

Top deploy the sample using the Websphere's Integrated Solutions Console:

1. In the 'Applications' tab, select 'New Application', then 'New Enterprise Application'

1. Choose the .war you built, then click 'next' until you get to the 'Map context roots for Web modules' installation step (the other default settings should be fine)

1. For the context root, set it to the same value as after the port number in the 'Redirect URI' you set in sample configuration/Azure app registration, i.e. if the redirect URI is http://localhost:9080/msal4j-servlet-auth/ then the context root should just be 'msal4j-servlet-auth'

1. Click 'Finish', and after the application finishes installing go to the 'Websphere enterprise applications' section of the 'Applications' tab

1. Select the .war you just installed from the list of applications and click 'Start' to deploy

1. One it finishes deploying, navigate to http://localhost:9080/{whatever you set as the context root} and you should be able to see the application

[!INCLUDE [enable-java-servlet-webapp-authorization-role-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-role-entra-id-explore.md)]
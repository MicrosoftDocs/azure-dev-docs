---
title: Secure Java WebLogic apps using roles and role claims
titleSuffix: Azure
description: Shows you how to add authorization using app roles and role claims to Java WebLogic Web app that signs-in users with the Microsoft identity platform.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Secure Java WebLogic apps using roles and role claims

This article shows how a Java WebLogic web app that uses [OpenID Connect](/entra/identity-platform/v2-protocols-oidc) to sign in users and use [Microsoft Entra ID Application Roles (app roles)](/entra/identity-platform/howto-add-app-roles-in-apps) for authorization. App roles, along with Security groups are popular means to implement authorization.

This application implements RBAC using Microsoft Entra ID's application roles and role claims feature. Another approach is to use Microsoft Entra ID groups and group claims. Microsoft Entra ID Groups and Application Roles are by no means mutually exclusive. You can use them in tandem to provide even finer grained access control.

You can use RBAC with application roles and role claims to securely enforce authorization policies.

A Microsoft identity platform Office Hours session covered Microsoft Entra ID App roles and security groups, featuring this scenario and this sample. A recording of the session is provided in this video [Using Security Groups and Application Roles in your apps](https://www.youtube.com/watch?v=LRoc-na27l0).

For more information about how the protocols work in this scenario and other scenarios, see [Authentication Scenarios for Microsoft Entra ID](https://go.microsoft.com/fwlink/?LinkId=394414).

[!INCLUDE [scenario-authorization-roles.md](includes/scenario-authorization-roles.md)]

[!INCLUDE [prerequisites-authorization-roles.md](includes/prerequisites-authorization-roles.md)]

[!INCLUDE [prerequisites-weblogic.md](includes/prerequisites-weblogic.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-role-entra-id.md](includes/enable-java-servlet-webapp-authorization-role-entra-id.md)]

#### Deploy the sample

These instructions assume that you installed WebLogic and set up some server domain.

Before you can deploy to WebLogic, you need to make some configuration changes in the sample itself and build or rebuild the package:

1. In the sample, there's likely an *application.properties* or *authentication.properties* file where you configured the client ID, tenant, redirect URL, and so on.

1. In the above mentioned file, change references to `localhost:8080` or `localhost:8443` to the URL and port that WebLogic runs on, which by default should be `localhost:7001`.

1. You also need to make the same change in the Azure app registration, where you set it as the **Redirect URI** value on the **Authentication** tab.

To deploy the sample to WebLogic via the web console:

1. Start the WebLogic server with *DOMAIN_NAME\bin\startWebLogic.cmd*.

1. Navigate to the WebLogic web console in your browser at `http://localhost:7001/console`.

1. Go to **Domain Structure** > **Deployments**, select **Install**, select **Upload your files**, and then find the *.war* file that you built using Maven.

1. Select Install this deployment as an application, select **Next**, select **Finish**, and then select **Save**.

1. Most of the default settings should be fine except that you should name the application to match the redirect URI you set in the sample configuration or Azure app registration. That is, if the redirect URI is `http://localhost:7001/msal4j-servlet-auth`, then you should name the application `msal4j-servlet-auth`.

1. Go back to **Domain Structure** > **Deployments**, and start your application.

1. After the application starts, navigate to `http://localhost:7001/<application-name>/`, and you should be able to access the application.

[!INCLUDE [enable-java-servlet-webapp-authorization-role-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-role-entra-id-explore.md)]

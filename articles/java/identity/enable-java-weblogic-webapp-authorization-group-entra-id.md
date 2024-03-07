---
title: Enable your Java WebLogic web app to sign in users and restrict access to pages using security groups and group claims with the Microsoft identity platform
description: Shows you how to develop a Java WebLogic web app to sign in users and restrict access to pages using security groups and group claims with the Microsoft identity platform.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Enable your Java WebLogic web app to sign in users and restrict access to pages using security groups and group claims with the Microsoft identity platform

This article demonstrates how to create a Java WebLogic web app that signs in users with [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java) and restricts access to pages based on Microsoft Entra ID security group membership.

:::image type="content" source="./media/topology.png" alt-text="Overview":::

An Identity Developer session covered Microsoft Entra ID App roles and security groups, featuring this scenario and how to handle the overage claim. [Watch the video Using Security Groups and Application Roles in your apps](https://www.youtube.com/watch?v=LRoc-na27l0).

[!INCLUDE [scenario-authorization-groups.md](includes/scenario-authorization-groups.md)]

[!INCLUDE [prerequisites-authorization-groups.md](includes/prerequisites-authorization-groups.md)]
[!INCLUDE [prerequisites-weblogic.md](includes/prerequisites-weblogic.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-group-entra-id.md](includes/enable-java-servlet-webapp-authorization-group-entra-id.md)]

#### Deploy the sample

(These instructions assume you've installed WebLogic and set up some server domain.)

Before you can deploy to WebLogic, you need to make some configuration changes in the sample itself and build or rebuild the package:

1. In the sample, there's likely an *application.properties* or *authentication.properties* file where you configured the client ID, tenant, redirect URL, and so on.

1. In the above mentioned steps, change references to `localhost:8080` or `localhost:8443` to the URL/port WebLogic runs on, which by default should be `localhost:7001`.

1. You also need to make the same change in the Azure app registration, where you set it as the **Redirect URI** in the **Authentication** tab.

To deploy the sample to WebLogic via the web console:

1. Start the WebLogic server with *DOMAIN_NAME\bin\startWebLogic.cmd*.

1. Navigate to the WebLogic web console in your browser at `http://localhost:7001/console`.

1. Go to **Domain Structure** > **Deployments**, select **Install**, select **Upload your files**, and then find the *.war* file that you built using Maven.

1. Select Install this deployment as an application, select **Next**, select **Finish**, and then select **Save**.

   Most of the default settings should be fine except that you should name the application to match the 'Redirect URI' you set in sample configuration/Azure app registration. That is, if the redirect URI is `http://localhost:7001/msal4j-servlet-auth`, then you should name the application `msal4j-servlet-auth`.

1. Go back to **Domain Structure** > **Deployments**, and start your application.

1. After the application starts, navigate to `http://localhost:7001/<application-name>/`, and you should be able to access the application.

[!INCLUDE [enable-java-servlet-webapp-authorization-group-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-group-entra-id-explore.md)]

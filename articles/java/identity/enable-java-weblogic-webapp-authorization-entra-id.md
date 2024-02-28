---
title: Enable your Java WebLogic web app to sign in users and access resources on Microsoft Graph
description: Shows you how to develop a Java WebLogic web app to sign in users and call Microsoft Graph with the Microsoft identity platform.
services: active-directory
ms.date: 01/01/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Enable your Java WebLogic web app to sign in users and access resources on Microsoft Graph

This article demonstrates a Java WebLogic web app that signs in users and obtains an access token for calling [Microsoft Graph](/graph/overview). It uses the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

:::image type="content" source="./media/topology.png" alt-text="Overview":::

[!INCLUDE [scenario-authz-graph.md](includes/scenario-authz-graph.md)]

[!INCLUDE [prereqs-authz-graph.md](includes/prereqs-authz-graph.md)]
[!INCLUDE [prereqs-weblogic.md](includes/prereqs-weblogic.md)]

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authorization-entra-id.md](includes/enable-java-servlet-webapp-authorization-entra-id.md)]

#### Deploy the sample

(These instructions assume you have installed WebLogic and set up some server domain)

Before you can deploy to WebLogic, you need to make some configuration changes in the sample itself and (re)build the package:

1. In the sample there is likely an *application.properties* or *authentication.properties* file where you configured the client ID, tenant, redirect URL, etc.

1. In the above mentioned file, changed references to localhost:8080 or localhost:8443 to the URL/port WebLogic runs on, which by default should be localhost:7001

1. You also need to make the same change in the Azure app registration, where you set it as the 'Redirect URI' in the 'Authentication' tab

To deploy the sample to WebLogic via the web console:

1. Start the WebLogic server with DOMAIN_NAME\bin\startWebLogic.cmd

1. Navigate to the WebLogic web console in your browser, http://localhost:7001/console

1. Go to Domain Structure > Deployments, click Install, click upload your files, and find the *.war* file you built with Maven

1. Select Install this deployment as an application, click Next, click Finish, and then Save

    - Most of the default settings should be fine except that you should name the application to match the 'Redirect URI' you set in sample configuration/Azure app registration, i.e. if the redirect URI is http://localhost:7001/msal4j-servlet-auth then you should name the application 'msal4j-servlet-auth'
1. Go back to Domain Structure > Deployments, and Start your application

1. Once the application starts, navigate to http://localhost:7001/{whatever you named the application}/, and you should be able to access the application

[!INCLUDE [enable-java-servlet-webapp-authorization-entra-id-explore.md](includes/enable-java-servlet-webapp-authorization-entra-id-explore.md)]

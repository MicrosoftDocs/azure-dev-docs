---
title: Enable sign-in for Java WebLogic apps using MSAL4J
titleSuffix: Azure Active Directory B2C
description: Shows you how to develop a Java WebLogic app that supports sign-in by Azure Active Directory B2C.
author: KarlErickson
ms.author: karler
ms.reviewer: bbanerjee
ms.date: 03/11/2024
ms.topic: how-to
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Enable sign-in for Java WebLogic apps using MSAL4J with Azure Active Directory B2C

This article demonstrates a Java Servlet application that authenticates users against Azure Active Directory B2C (Azure AD B2C) using the [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java).

[!INCLUDE [scenario-sign-in-azure-ad-b2c.md](includes/scenario-sign-in-azure-ad-b2c.md)]

## Prerequisites

[!INCLUDE [prerequisites-sign-in-azure-ad-b2c.md](includes/prerequisites-sign-in-azure-ad-b2c.md)]

[!INCLUDE [prerequisites-weblogic.md](includes/prerequisites-weblogic.md)]

## Recommendations

[!INCLUDE [java-servlet-overview-recommendation.md](includes/java-servlet-overview-recommendation.md)]

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c.md)]

## Run the sample

These instructions assume that you installed WebLogic and set up some server domain.

Before you can deploy to WebLogic, use the following steps to make some configuration changes in the sample itself and then build or rebuild the package:

1. In the sample, find the **application.properties** or **authentication.properties** file where you configured the client ID, tenant, redirect URL, and so on.

1. In this file, change references to `localhost:8080` or `localhost:8443` to the URL and port that WebLogic runs on, which by default should be `localhost:7001`.

1. You also need to make the same change in the Azure app registration, where you set it in the Azure portal as the **Redirect URI** value on the **Authentication** tab.

Use the following steps to deploy the sample to WebLogic via the web console:

1. Start the WebLogic server by using **DOMAIN_NAME\bin\startWebLogic.cmd**.

1. Navigate to the WebLogic web console in your browser at `http://localhost:7001/console`.

1. Go to Domain Structure > Deployments, select **Install**, select **Upload your files**, and then find the **.war** file that you built by using Maven.

1. Select Install this deployment as an application, select **Next**, select **Finish**, and then select **Save**.

1. Most of the default settings should be fine except that you should name the application to match the redirect URI you set in the sample configuration or Azure app registration. That is, if the redirect URI is `http://localhost:7001/msal4j-servlet-auth`, then you should name the application `msal4j-servlet-auth`.

1. Go back to **Domain Structure** > **Deployments**, and start your application.

1. After the application starts, navigate to `http://localhost:7001/<application-name>/`, and you should be able to access the application.

[!INCLUDE [enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md](includes/enable-java-servlet-webapp-authentication-azure-ad-b2c-explore.md)]

## Next step

[Deploy Java WebLogic apps to WebLogic on Azure Virtual Machines](deploy-weblogic-to-vm.md)

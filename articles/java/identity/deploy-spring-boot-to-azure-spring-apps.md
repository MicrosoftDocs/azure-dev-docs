---
title: Deploy Java Spring Boot apps to Azure Spring Apps
description: Shows you how to deploy a Java Spring Boot app with sign-in by Microsoft Entra account to Azure Spring Apps.
author: KarlErickson
ms.author: givermei
ms.date: 03/11/2024
ms.topic: article
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Deploy Java Spring Boot apps to Azure Spring Apps

This article shows you how to deploy a Java Spring Boot app with sign-in by Microsoft Entra account to Azure Spring Apps.

This article assumes that you completed one of the following articles using only the **Run locally** tab, and you now want to deploy to Azure. These instructions are the same as the ones in the **Deploy to Azure** tab in these articles:

- [Secure Java Spring Boot apps using Microsoft Entra ID](enable-spring-boot-webapp-authentication-entra-id.md)
- [Secure Java Spring Boot apps using Azure Active Directory B2C](enable-spring-boot-webapp-authentication-azure-ad-b2c.md)
- [Enable Java Spring Boot apps to sign in users and access Microsoft Graph](enable-spring-boot-webapp-authorization-entra-id.md)
- [Secure Java Spring Boot apps using roles and role claims   ](enable-spring-boot-webapp-authorization-role-entra-id.md)
- [Secure Java Spring Boot apps using groups and group claims](enable-spring-boot-webapp-authorization-group-entra-id.md)

## Prerequisites

[!INCLUDE [deploy-spring-apps-intro.md](includes/deploy-spring-apps-intro.md)]

## Prepare the Spring project

[!INCLUDE [deploy-spring-apps-prepare.md](includes/deploy-spring-apps-prepare.md)]

## Configure the Maven plugin

[!INCLUDE [deploy-spring-apps-configure-maven.md](includes/deploy-spring-apps-configure-maven.md)]

## Prepare the app for deployment

[!INCLUDE [deploy-spring-apps-prepare-deploy.md](includes/deploy-spring-apps-prepare-deploy.md)]

[!INCLUDE [deploy-spring-apps-secret-note.md](includes/deploy-spring-apps-secret-note.md)]

## Update your Microsoft Entra ID app registration

[!INCLUDE [deploy-spring-apps-update-registration.md](includes/deploy-spring-apps-update-registration.md)]

## Deploy the app

[!INCLUDE [deploy-spring-apps-deploy.md](includes/deploy-spring-apps-deploy.md)]

## Validate the app

[!INCLUDE [deploy-spring-apps-validate.md](includes/deploy-spring-apps-validate.md)]

## More information

- [Microsoft identity platform (Microsoft Entra ID for developers)](/entra/identity-platform/)
- [Overview of Microsoft Authentication Library (MSAL)](/entra/identity-platform/msal-overview)
- [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app)
- [Quickstart: Configure a client application to access web APIs](/entra/identity-platform/quickstart-configure-app-access-web-apis)
- [Understanding Microsoft Entra ID application consent experiences](/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [Application and service principal objects in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals)
- [National Clouds](/entra/identity-platform/authentication-national-cloud#app-registration-endpoints)
- [MSAL code samples](/entra/identity-platform/sample-v2-code?tabs=framework#java)
- [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory)
- [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [MSAL4J Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-java/wiki)
- [ID tokens](/entra/identity-platform/id-tokens)
- [Access tokens in the Microsoft identity platform](/entra/identity-platform/access-tokens)

## Next steps

For more information and other deployment options, see the following articles:

- [Quickstart: Deploy your first application to Azure Spring Apps](/azure/spring-apps/enterprise/quickstart?tabs=Azure-portal%2CAzure-portal-maven-plugin-ent%2CConsumption-workload&pivots=sc-enterprise)
- [Spring Boot to Azure Spring Apps](../migration/migrate-spring-boot-to-azure-spring-apps.md)

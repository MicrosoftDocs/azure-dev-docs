---
title: Deploy Java Spring Boot apps to Azure Container Apps
description: Shows you how to deploy a Java Spring Boot app with sign-in by Microsoft Entra account to Azure Container Apps.
author: KarlErickson
ms.author: karler
ms.reviewer: bbanerjee
ms.date: 10/04/2024
ms.topic: install-set-up-deploy
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Deploy Java Spring Boot apps to Azure Container Apps

This article shows you how to deploy a Java Spring Boot app with sign-in by Microsoft Entra account to Azure Container Apps.

This article assumes that you completed one of the following articles using only the **Run locally** tab, and you now want to deploy to Azure. These instructions are the same as the ones in the **Deploy to Azure** tab in these articles:

- [Secure Java Spring Boot apps using Microsoft Entra ID](enable-spring-boot-webapp-authentication-entra-id.md)
- [Secure Java Spring Boot apps using Azure Active Directory B2C](enable-spring-boot-webapp-authentication-azure-ad-b2c.md)
- [Enable Java Spring Boot apps to sign in users and access Microsoft Graph](enable-spring-boot-webapp-authorization-entra-id.md)
- [Secure Java Spring Boot apps using roles and role claims   ](enable-spring-boot-webapp-authorization-role-entra-id.md)
- [Secure Java Spring Boot apps using groups and group claims](enable-spring-boot-webapp-authorization-group-entra-id.md)

## Prerequisites

[!INCLUDE [deploy-container-apps-intro](includes/deploy-container-apps-intro.md)]

## Prepare the Spring project

[!INCLUDE [deploy-container-apps-prepare.md](includes/deploy-container-apps-prepare.md)]

## Setup

[!INCLUDE [deploy-container-apps-cli-setup.md](includes/deploy-container-apps-cli-setup.md)]

## Create the Azure Container Apps environment

[!INCLUDE [deploy-container-apps-cli-setup.md](includes/deploy-container-apps-create-env-variables.md)]

## Prepare the app for deployment

[!INCLUDE [deploy-container-apps-prepare-deploy.md](includes/deploy-container-apps-prepare-deploy.md)]

[!INCLUDE [deploy-container-apps-secret-note.md](includes/deploy-container-apps-secret-note.md)]

## Update your Microsoft Entra ID app registration

[!INCLUDE [deploy-container-apps-update-registration.md](includes/deploy-container-apps-update-registration.md)]

## Deploy the app

[!INCLUDE [deploy-container-apps-deploy.md](includes/deploy-container-apps-deploy.md)]

## Validate the app

[!INCLUDE [deploy-container-apps-validate.md](includes/deploy-container-apps-validate.md)]

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

- [Quickstart: Deploy your first application to Azure Container Apps](/azure/container-apps/java-get-started?pivots=jar)
- [Quickstart: Build and deploy from local source code to Azure Container Apps](/azure/container-apps/quickstart-code-to-cloud?tabs=bash%2Ccsharp&pivots=without-dockerfile)

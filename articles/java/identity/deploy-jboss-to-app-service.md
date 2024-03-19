---
title: Deploy Java JBoss EAP apps to Azure App Service
description: Shows you how to deploy a JBoss EAP app with sign-in by Microsoft Entra account to Azure App Service.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Deploy Java JBoss EAP apps to Azure App Service

This article shows you how to deploy a JBoss EAP app with sign-in by Microsoft Entra account to Azure App Service.

This article assumes that you completed one of the following articles using only the **Run locally** tab, and you now want to deploy to Azure. These instructions are the same as the ones in the **Deploy to Azure** tab in these articles:

- [Enable sign-in for Java JBoss EAP apps using Microsoft Entra ID](enable-java-jboss-eap-webapp-authentication-entra-id.md)
- [Enable sign-in for Java JBoss EAP apps using MSAL4J with Azure Active Directory B2C](enable-java-jboss-eap-webapp-authentication-azure-ad-b2c.md)
- [Enable Java JBoss EAP apps to sign in users and access Microsoft Graph](enable-java-jboss-eap-webapp-authorization-entra-id.md)
- [Secure Java JBoss EAP apps using roles and role claims](enable-java-jboss-eap-webapp-authorization-role-entra-id.md)
- [Secure Java JBoss EAP apps using groups and group claims](enable-java-jboss-eap-webapp-authorization-group-entra-id.md)

## Prerequisites

[!INCLUDE [deploy-app-service-intro.md](includes/deploy-app-service-intro.md)]

- [Azure CLI](/cli/azure/install-azure-cli)

## Configure the Maven plugin

[!INCLUDE [deploy-jboss-app-service-configure-maven.md](includes/deploy-jboss-app-service-configure-maven.md)]

## Prepare the app for deployment

[!INCLUDE [deploy-app-service-prepare-deploy.md](includes/deploy-app-service-prepare-deploy.md)]

## Update your Microsoft Entra ID app registration

[!INCLUDE [deploy-app-service-update-registration.md](includes/deploy-app-service-update-registration.md)]

## Deploy the app

[!INCLUDE [deploy-app-service-deploy.md](includes/deploy-app-service-deploy.md)]

## Remove secret values

[!INCLUDE [deploy-app-service-remove-secret.md](includes/deploy-app-service-remove-secret.md)]

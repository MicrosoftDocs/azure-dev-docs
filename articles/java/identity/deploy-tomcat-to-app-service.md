---
title: Deploy Java Tomcat apps to Azure App Service
description: Shows you how to deploy a Tomcat web app with sign-in by Microsoft Entra account to Azure App Service.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Deploy Java Tomcat apps to Azure App Service

This article shows you how to deploy a Tomcat web app with sign-in by Microsoft Entra account to Azure App Service.

## Prerequisites

- Completion of one of the following articles for enabling security with Microsoft Entra ID:
  - [Enable sign-in for Java Tomcat apps using Microsoft Entra ID](enable-java-tomcat-webapp-authentication-entra-id.md)
  - [Enable sign-in for Java Tomcat apps using MSAL4J with Azure Active Directory B2C](enable-java-tomcat-webapp-authentication-azure-ad-b2c.md)
  - [Enable Java Tomcat apps to sign in users and access Microsoft Graph](enable-java-tomcat-webapp-authorization-entra-id.md)
  - [Secure Java Tomcat apps using roles and role claims](enable-java-tomcat-webapp-authorization-role-entra-id.md)
  - [Secure Java Tomcat apps using groups and group claims](enable-java-tomcat-webapp-authorization-group-entra-id.md)
[!INCLUDE [deploy-app-service-intro.md](includes/deploy-app-service-intro.md)]
- [Azure CLI](/cli/azure/install-azure-cli)

## Configure the Maven plugin

[!INCLUDE [deploy-tomcat-app-service-configure-maven.md](includes/deploy-tomcat-app-service-configure-maven.md)]

## Prepare the web app for deployment

[!INCLUDE [deploy-app-service-prepare-deploy.md](includes/deploy-app-service-prepare-deploy.md)]

## Update your Microsoft Entra ID app registration

[!INCLUDE [deploy-app-service-update-registration.md](includes/deploy-app-service-update-registration.md)]

## Deploy the app

[!INCLUDE [deploy-app-service-deploy.md](includes/deploy-app-service-deploy.md)]

## Remove secret values

[!INCLUDE [deploy-app-service-remove-secret.md](includes/deploy-app-service-remove-secret.md)]

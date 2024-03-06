---
title: Deploy your Java JBoss web app to App Service
description: Shows you how to deploy a JBoss web app with sign-in by Microsoft Entra account to Azure App Service.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Deploy your Java JBoss web app to App Service

This article shows you how to deploy a JBoss web app with sign-in by Microsoft Entra account to Azure App Service.

This guidance assumes you have through any of the Tomcat Web app examples for enabling security with Microsoft Entra ID.

## Prerequisites

[!INCLUDE [deploy-app-service-intro.md](includes/deploy-app-service-intro.md)]

You also need the [Azure CLI](/cli/azure/install-azure-cli) tool.

## Configure the Maven plugin

[!INCLUDE [deploy-jboss-app-service-configure-maven.md](includes/deploy-jboss-app-service-configure-maven.md)]

## Prepare the web app for deployment

[!INCLUDE [deploy-app-service-prepare-deploy.md](includes/deploy-app-service-prepare-deploy.md)]

## Update your Microsoft Entra ID app registration

[!INCLUDE [deploy-app-service-update-registration.md](includes/deploy-app-service-update-registration.md)]

## Deploy the app

[!INCLUDE [deploy-app-service-deploy.md](includes/deploy-app-service-deploy.md)]

## Remove secret values

[!INCLUDE [deploy-app-service-remove-secret.md](includes/deploy-app-service-remove-secret.md)]

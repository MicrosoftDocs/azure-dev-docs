---
title: Deploy your Java Tomcat web app to App Service
description: Shows you how to deploy a Tomcat web app with sign-in by Microsoft Entra account to Azure App Service.
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

# Deploy your Java Tomcat web app to App Service

[!INCLUDE [deploy-tomcat-app-service-intro.md](includes/deploy-tomcat-app-service-intro.md)]

## Configure the Maven plugin

[!INCLUDE [deploy-tomcat-app-service-configure-maven.md](includes/deploy-tomcat-app-service-configure-maven.md)]

## Prepare the web app for deployment

[!INCLUDE [deploy-tomcat-app-service-prepare-deploy.md](includes/deploy-tomcat-app-service-prepare-deploy.md)]

## Remove secret values

TODO

## Update your Microsoft Entra ID App Registration

[!INCLUDE [deploy-tomcat-app-service-update-registration.md](includes/deploy-tomcat-app-service-update-registration.md)]

## Deploy the app

[!INCLUDE [deploy-tomcat-app-service-deploy.md](includes/deploy-tomcat-app-service-deploy.md)]
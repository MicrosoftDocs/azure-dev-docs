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

This guidance assumes you have run through any of the Tomcat Web app examples for enabling security with Microsoft Entra ID. 

## Prerequisites

[!INCLUDE [deploy-app-service-intro.md](includes/deploy-app-service-intro.md)]

You will also need the [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) tool.

## Configure the Maven plugin

[!INCLUDE [deploy-tomcat-app-service-configure-maven.md](includes/deploy-tomcat-app-service-configure-maven.md)]

## Prepare the web app for deployment

[!INCLUDE [deploy-app-service-prepare-deploy.md](includes/deploy-app-service-prepare-deploy.md)]

## Remove secret values

TODO

## Update your Microsoft Entra ID App Registration

[!INCLUDE [deploy-app-service-update-registration.md](includes/deploy-app-service-update-registration.md)]

## Deploy the app

[!INCLUDE [deploy-app-service-deploy.md](includes/deploy-app-service-deploy.md)]
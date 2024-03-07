---
title: Deploy Java Spring Boot apps to Azure Spring Apps
description: Shows you how to deploy a Java Spring Boot web app with sign-in by Microsoft Entra account to Azure Spring Apps.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Deploy Java Spring Boot apps to Azure Spring Apps

This article shows you how to deploy a Java Spring Boot web app with sign-in by Microsoft Entra account to Azure Spring Apps.

This guidance assumes you have through any of the Spring Boot Web app examples for enabling security with Microsoft Entra ID.

## Prerequisites

[!INCLUDE [deploy-spring-apps-intro.md](includes/deploy-spring-apps-intro.md)]

## Prepare the Spring project

[!INCLUDE [deploy-spring-apps-prepare.md](includes/deploy-spring-apps-prepare.md)]

## Configure the Maven plugin

[!INCLUDE [deploy-spring-apps-configure-maven.md](includes/deploy-spring-apps-configure-maven.md)]

## Prepare the web app for deployment

[!INCLUDE [deploy-spring-apps-prepare-deploy.md](includes/deploy-spring-apps-prepare-deploy.md)]

[!INCLUDE [deploy-spring-apps-secret-note.md](includes/deploy-spring-apps-secret-note.md)]

## Update your Microsoft Entra ID app registration

[!INCLUDE [deploy-spring-apps-update-registration.md](includes/deploy-spring-apps-update-registration.md)]

## Deploy the app

[!INCLUDE [deploy-spring-apps-deploy.md](includes/deploy-spring-apps-deploy.md)]

## Validate the app

[!INCLUDE [deploy-spring-apps-validate.md](includes/deploy-spring-apps-validate.md)]

## Next steps

For more information and other deployment options, see the following articles:

- [Quickstart: Deploy your first application to Azure Spring Apps](/azure/spring-apps/enterprise/quickstart?tabs=Azure-portal%2CAzure-portal-maven-plugin-ent%2CConsumption-workload&pivots=sc-enterprise)
- [Spring Boot to Azure Spring Apps](../migration/migrate-spring-boot-to-azure-spring-apps.md)

---
title: Migrate Spring Boot applications to Azure Spring Apps
description: This guide describes what you should be aware of when you want to migrate an existing Spring Boot application to run on Azure Spring Apps.
author: KarlErickson
ms.author: karler
ms.topic: conceptual
ms.date: 5/26/2020
ms.custom: devx-track-java, migration-java, devx-track-extended-java
recommendations: false
---

# Migrate Spring Boot applications to Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

This guide describes what you should be aware of when you want to migrate an existing Spring Boot application to run on Azure Spring Apps.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

If you can't meet any of these pre-migration requirements, see the following companion migration guides:

* Migrate executable JAR applications to containers on Azure Kubernetes Service (guidance planned)
* Migrate executable JAR Applications to Azure Virtual Machines (guidance planned)

### Inspect application components

[!INCLUDE [identify-local-state-azure-spring-apps](includes/identify-local-state-azure-spring-apps.md)]

[!INCLUDE [static-content-azure-spring-apps](includes/determine-whether-and-how-the-file-system-is-used-azure-spring-apps.md)]

#### Determine whether any of the services contain OS-specific code

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code-no-title.md)]

[!INCLUDE [switch-to-a-supported-platform-azure-spring-apps](includes/switch-to-a-supported-platform-azure-spring-apps.md)]

[!INCLUDE [determine-whether-your-application-relies-on-scheduled-jobs-azure-spring-apps](includes/determine-whether-your-application-relies-on-scheduled-jobs-azure-spring-apps.md)]

[!INCLUDE [identify-spring-boot-versions](includes/identify-spring-boot-versions.md)]

For any applications using Spring Boot 1.x, follow the [Spring Boot 2.0 migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide) to update them to a supported Spring Boot version. For supported versions, see the [Spring Boot and Spring Cloud versions](/azure/spring-apps/how-to-prepare-app-deployment#spring-boot-and-spring-cloud-versions) section of [Prepare an application for deployment in Azure Spring Apps](/azure/spring-apps/how-to-prepare-app-deployment).

[!INCLUDE [identify-logs-metrics-apm-azure-spring-apps](includes/identify-logs-metrics-apm-azure-spring-apps.md)]

### Inventory external resources

Identify external resources, such as data sources, JMS message brokers, and URLs of other services. In Spring Boot applications, you can typically find the configuration for such resources in the *src/main/directory* folder, in a file typically called *application.properties* or *application.yml*.

[!INCLUDE [inventory-databases-spring-boot](includes/inventory-databases-spring-boot.md)]

[!INCLUDE [identify-jms-brokers-in-spring](includes/identify-jms-brokers-in-spring.md)]

After you've identified the broker or brokers in use, find the corresponding settings. In Spring Boot applications, you can typically find them in the *application.properties* and *application.yml* files in the application directory.

[!INCLUDE [jms-broker-settings-examples-in-spring](includes/jms-broker-settings-examples-in-spring.md)]

[!INCLUDE [identify-external-caches-azure-spring-apps](includes/identify-external-caches-azure-spring-apps.md)]

[!INCLUDE [inventory-identity-providers-spring-boot.md](includes/inventory-identity-providers-spring-boot.md)]

#### Identify any clients relying on a non-standard port

Azure Spring Apps overwrites the `server.port` setting in the deployed application. If any clients of the clients rely on the application being available on a port other than 443, you will need to modify them.

#### All other external resources

It isn't feasible for this guide to document every possible external dependency. After the migration, it's your responsibility to verify that you can satisfy every external dependency of your application.

[!INCLUDE [inventory-configuration-sources-and-secrets-spring-boot](includes/inventory-configuration-sources-and-secrets-spring-boot.md)]

[!INCLUDE [inspect-the-deployment-architecture-spring-boot](includes/inspect-the-deployment-architecture-spring-boot.md)]

## Migration

[!INCLUDE [migrate-steps-spring-boot-azure-spring-apps](includes/migrate-steps-spring-boot-azure-spring-apps.md)]

## Post-migration

[!INCLUDE [post-migration-spring-boot-azure-spring-apps](includes/post-migration-spring-boot-azure-spring-apps.md)]

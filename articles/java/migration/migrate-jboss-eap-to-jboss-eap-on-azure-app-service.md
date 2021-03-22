---
title: Migrate JBoss EAP applications to JBoss EAP on Azure App Service
description: This guide describes what you should be aware of when you want to migrate an existing JBoss EAP application to run on JBoss EAP in an Azure App Service container.
author: vaangadi
ms.author: vaangadi
ms.topic: conceptual
ms.date: 3/16/2021
ms.custom: devx-track-java
---

# Migrate JBoss EAP applications to JBoss EAP on Azure App Service

This guide describes what you should be aware of when you want to migrate an existing JBoss EAP application to run on JBoss EAP in an Azure App Service.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

[!INCLUDE [inventory-server-capacity-aks](includes/inventory-server-capacity-aks.md)]

### Inventory all secrets

Check all properties and configuration files on the production server(s) for any secrets and passwords. Be sure to check *jboss-web.xml* in your WARs. Configuration files that contain passwords or credentials may also be found inside your application.

Consider storing those secrets in Azure KeyVault. For more information, see [Azure Key Vault basic concepts](/azure/key-vault/basic-concepts).

[!INCLUDE [inventory-all-certificates](includes/inventory-all-certificates.md)]

[!INCLUDE [validate-that-the-supported-java-version-works-correctly-jboss-eap](includes/validate-that-the-supported-java-version-works-correctly-jboss-eap.md)]

### Inventory JNDI resources

Inventory all JNDI resources. Some, such as JMS message brokers, may require migration or reconfiguration.

### Determine whether session replication is used

If your application relies on session replication, you'll have to change your application to remove this dependency.

#### Inside your application

Inspect the *WEB-INF/jboss-web.xml* and/or *WEB-INF/web.xml* files.

### Document datasources

If your application uses any databases, you need to capture the following information:

* What is the datasource name?
* What is the connection pool configuration?
* Where can I find the JDBC driver JAR file?

For more information, see [About JBoss EAP Datasources](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.3/html/configuration_guide/datasource_management) in the JBoss EAP documentation.

### Determine whether and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by JBoss EAP modules or by your application code. You may identify some or all of the scenarios described in the following sections.

[!INCLUDE [static-content](includes/static-content.md)]

[!INCLUDE [dynamic-or-internal-content-app-service](includes/dynamic-or-internal-content-app-service.md)]

[!INCLUDE [determine-whether-your-application-relies-on-scheduled-jobs](includes/determine-whether-your-application-relies-on-scheduled-jobs-app-service.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use](includes/determine-whether-jms-queues-or-topics-are-in-use.md)]


### Determine whether JCA connectors are in use

If your application uses JCA connectors, validate that you can use the JCA connector on JBoss EAP. If you can use the JCA connector on JBoss EAP, then for it to be available, you must add the JARs to the server classpath and put the necessary configuration files in the correct location in the JBoss EAP server directories.

[!INCLUDE [determine-whether-jaas-is-in-use](includes/determine-whether-jaas-is-in-use-jboss.md)]

[!INCLUDE [determine-whether-your-application-uses-a-resource-adapter](includes/determine-whether-your-application-uses-a-resource-adapter-jboss.md)]

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/determine-whether-your-application-is-composed-of-multiple-wars.md)]

### Determine whether your application is packaged as an EAR

If your application is packaged as an EAR file, be sure to examine the *application.xml* file and capture the configuration.

> [!NOTE]
> If you want to be able to scale each of your web applications independently for better use of your App Service resources you should break up the EAR into separate web applications.

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

[!INCLUDE [perform-in-place-testing](includes/perform-in-place-testing-jboss.md)]

## Migration

[!INCLUDE [provision-azure-app-service-for-jboss-eap-runtime](includes/provision-azure-app-service-for-jboss-eap-runtime.md)]

[!INCLUDE [build-and-deploy-war-to-app-service](includes/build-and-deploy-war-to-app-service.md)]

[!INCLUDE [setup-data-sources-and-deploy-app-service-jboss](includes/setup-data-sources-and-deploy-app-service-jboss.md)]


## Post-migration

Now that you have your application migrated to Azure App Service you should verify that it works as you expect. Once you've done that we have some recommendations for you that can make your application more cloud-native.


[!INCLUDE [post-migration-recomendations-app-service](includes/post-migration-recomendations-app-service.md)]


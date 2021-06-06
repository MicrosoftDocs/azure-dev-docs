---
title: Migrate JBoss EAP applications to JBoss EAP on Azure App Service
description: This guide describes what you should be aware of when you want to migrate an existing JBoss EAP application to run on JBoss EAP in an Azure App Service container.
author: VaijanathB
ms.author: vaangadi
ms.topic: conceptual
ms.date: 05/27/2021
ms.custom: devx-track-java
---

# Migrate JBoss EAP applications to JBoss EAP on Azure App Service

This guide describes what you should be aware of when you want to migrate an existing JBoss EAP application to run on JBoss EAP in an Azure App Service instance.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

[!INCLUDE [inventory-server-capacity-aks](includes/inventory-server-capacity-aks.md)]

### Inventory all secrets

Check all properties and configuration files on the production server(s) for any secrets and passwords. Be sure to check *jboss-web.xml* in your WARs. Configuration files that contain passwords or credentials may also be found inside your application.

Consider storing those secrets in Azure KeyVault. For more information, see [Azure Key Vault basic concepts](/azure/key-vault/basic-concepts).

You can use Key Vault secrets in your App Service instance with Key Vault references. Key Vault references allow you to use the secrets in your application while keeping them secured and encrypted at rest. For more information, see [Use Key Vault references for App Service and Azure Functions](/azure/app-service/app-service-key-vault-references).

[!INCLUDE [inventory-all-certificates](includes/inventory-all-certificates.md)]

[!INCLUDE [validate-that-the-supported-java-version-works-correctly-jboss-eap](includes/validate-that-the-supported-java-version-works-correctly-jboss-eap.md)]

[!INCLUDE [inventory-external-resources](includes/inventory-external-resources-jboss.md)]

### Determine whether session replication is used

If your application relies on session replication, you'll have to change your application to remove this dependency. App Service does not allow instances to communicate directly with one another.

### Determine whether and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. The file system may be used by JBoss EAP modules or by your application code. You may identify some or all of the scenarios described in the following sections.

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

### JBoss EAP on App Service feature notes

When using JBoss EAP on App Service, be sure to take the following notes into consideration.

* **Server-to-server clustering**: Due to network security constraints, application instances on App Service cannot communicate directly with one another. If your current JBoss deployment uses clustering, consider using JBoss EAP on virtual machine scale sets or externalizing the session and state information. For more information, see [Configuring high availability](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.1/html/configuration_guide/configuring_high_availability) and [Infinispan and cache containers](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.2/html/configuration_guide/configuring_high_availability#infinispan) in the Red Hat documentation.
* **JBoss EAP management console**: The JBoss web console isn't exposed on App Service. Instead, the Azure portal provides the management APIs for your application, and you should deploy using the Azure CLI, Azure Maven Plugin, or other Azure developer tools.
* **Transactions**: The application instances are run in a stateless manner, so the Transactions API isn't currently supported. For more information, see [Managing transactions on JBoss EAP](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.2/html-single/managing_transactions_on_jboss_eap/index) in the Red Hat documentation.
* **Managed domain mode**: In a multi-server production environment, Managed Domain mode in JBoss EAP offers centralized managed capabilities. However with JBoss EAP on App Service, the App Service platform assumes the responsibility for configuration and management of your server instances. App Service eliminates the need for JBoss EAP’s managed domain mode. Domain mode is a good choice for virtual machine-based multi-server deployments. For more information, see [About managed domains](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/6.4/html/administration_and_configuration_guide/about_managed_domains) in the Red Hat documentation.

## Migration

[!INCLUDE [provision-azure-app-service-for-jboss-eap-runtime](includes/provision-azure-app-service-for-jboss-eap-runtime.md)]

[!INCLUDE [build-and-deploy-war-to-app-service](includes/build-and-deploy-war-to-app-service.md)]

[!INCLUDE [setup-data-sources-and-deploy-app-service-jboss](includes/setup-data-sources-and-deploy-app-service-jboss.md)]

## Post-migration

Now that you've migrated your application to Azure App Service, you should verify that it works as you expect. After you've done that, we have some recommendations for you that can make your application more cloud-native.

[!INCLUDE [post-migration-recomendations-app-service](includes/post-migration-recomendations-app-service.md)]

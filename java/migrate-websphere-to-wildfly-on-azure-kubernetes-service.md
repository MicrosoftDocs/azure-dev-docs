---
title: Migrate WebSphere applications to WildFly on Azure Kubernetes Service
description: This guide describes what you should be aware of when you want to migrate an existing WebSphere application to run on WildFly in an Azure Kubernetes Service container.
author: mriem
ms.author: manriem
ms.topic: conceptual
ms.date: 2/28/2020
---

# Migrate WebSphere applications to WildFly on Azure Kubernetes Service

This guide describes what you should be aware of when you want to migrate an existing WebSphere application to run on WildFly in an Azure Kubernetes Service container.

## Pre-migration

[!INCLUDE [inventory-server-capacity-aks](includes/migration/inventory-server-capacity-aks.md)]

### Inventory all secrets

Check all properties and configuration files on the production server(s) for any secrets and passwords. Be sure to check *ibm-web-bnd.xml* in your WARs. Configuration files that contain passwords or credentials may also be found inside your application. These files may include, for Spring (Boot) applications, *application.properties* or *application.yml* files.

[!INCLUDE [inventory-all-certificates](includes/migration/inventory-all-certificates.md)]

### Validate that the supported Java version works correctly

Using WildFly on Azure Kubernetes Service requires a specific version of Java. Therefore, you'll need to validate that your application is able to run correctly using that supported version. This validation is especially important if your current server is using a supported JDK (such as Oracle JDK or IBM OpenJ9).

To obtain your current version, sign in to your production server and run

```bash
java -version
```

### Inventory JNDI resources

Inventory all JNDI resources. Some, such as JMS message brokers, may require migration or reconfiguration.

#### Inside your application

Inspect the file *WEB-INF/ibm-web-bnd.xml* and/or *WEB-INF/web.xml*.

### Document datasources

If your application uses any databases, you need to capture the following information:

1. What is the datasource name?
2. What is the connection pool configuration?
3. Where can I find the JDBC driver JAR file?

### Determine whether and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by WebSphere modules or by your application code. You may identify some or all of the scenarios described in the following sections.

#### Read-only static content

If your application currently serves static content, you'll need an alternate location for it. You may wish to consider moving static content to Azure Blob Storage and adding Azure CDN for lightning-fast downloads globally. For more information, see [Static website hosting in Azure Storage](/azure/storage/blobs/storage-blob-static-website) and [Quickstart: Integrate an Azure storage account with Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn).

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We've provided a sample implementation for your use at [Uploading and CDN-preloading static content with Azure Functions](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, you can mount Azure Storage shares as persistent volumes. For more information, see [Dynamically create and use a persistent volume with Azure Files in Azure Kubernetes Service](/azure/aks/azure-files-dynamic-pv).

[!INCLUDE [determine-whether-your-application-relies-on-scheduled-jobs](includes/migration/determine-whether-your-application-relies-on-scheduled-jobs.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/migration/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use](includes/migration/determine-whether-jms-queues-or-topics-are-in-use.md)]

### Determine whether your application uses WebSphere-specific APIs

If your application uses WebSphere-specific APIs, you'll need to refactor it to remove those dependencies. For example, if you have used a class mentioned in the [IBM WebSphere Application Server, Release 9.0
API Specification](https://www.ibm.com/support/knowledgecenter/en/SSEQTJ_9.0.5/com.ibm.websphere.javadoc.doc/web/apidocs/overview-summary.html?view=embed), you have used a WebSphere specific API in your application.

[!INCLUDE [determine-whether-your-application-uses-entity-beans](includes/migration/determine-whether-your-application-uses-entity-beans.md)]

[!INCLUDE [determine-whether-the-java-ee-application-client-feature-is-in-use-aks](includes/migration/determine-whether-the-java-ee-application-client-feature-is-in-use-aks.md)]

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/migration/determine-whether-your-application-contains-os-specific-code.md)]

[!INCLUDE [determine-whether-ejb-timers-are-in-use](includes/migration/determine-whether-ejb-timers-are-in-use.md)]

### Determine whether JCA connectors are in use

If your application uses JCA connectors, you'll have to validate the JCA connector can be used on WildFly. If the JCA implementation is tied to WebSphere, you'll have to refactor your application to remove that dependency. If it can be used, then you'll need to add the JARs to the server classpath and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

[!INCLUDE [determine-whether-jaas-is-in-use](includes/migration/determine-whether-jaas-is-in-use.md)]

[!INCLUDE [determine-whether-your-application-uses-a-resource-adapter](includes/migration/determine-whether-your-application-uses-a-resource-adapter.md)]

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/migration/determine-whether-your-application-is-composed-of-multiple-wars.md)]

### Determine whether your application is packaged as an EAR

If your application is packaged as an EAR file, be sure to examine the *application.xml* and *application-bnd.xml* files and capture their configurations.

> [!NOTE]
> If you want to be able to scale each of your web applications independently for better use of your AKS resources you should break up the EAR into separate web applications.

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/migration/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

[!INCLUDE [perform-in-place-testing](includes/migration/perform-in-place-testing.md)]

## Migration

[!INCLUDE [provision-azure-container-registry-and-azure-kubernetes-service](includes/migration/provision-azure-container-registry-and-azure-kubernetes-service.md)]

[!INCLUDE [create-a-docker-image-for-wildfly](includes/migration/create-a-docker-image-for-wildfly.md)]

[!INCLUDE [configure-keyvault-flexvolume](includes/migration/configure-keyvault-flexvolume.md)]

[!INCLUDE [set-up-data-sources](includes/migration/set-up-data-sources.md)]

[!INCLUDE [set-up-jndi-resources](includes/migration/set-up-jndi-resources.md)]

[!INCLUDE [review-wildfly-configuration](includes/migration/review-wildfly-configuration.md)]

[!INCLUDE [build-and-push-the-docker-image-to-azure-container-registry](includes/migration/build-and-push-the-docker-image-to-azure-container-registry.md)]

[!INCLUDE [provision-a-public-ip-address](includes/migration/provision-a-public-ip-address.md)]

[!INCLUDE [deploy-to-aks](includes/migration/deploy-to-aks.md)]

### Configure persistent storage

If your application requires non-volatile storage, configure one or more [Persistent Volumes](/azure/aks/azure-disks-dynamic-pv).

[!INCLUDE [migrate-scheduled-jobs-aks](includes/migration/migrate-scheduled-jobs-aks.md)]

## Post-migration

Now that you have migrated your application to Azure Kubernetes Service, you should verify that it works as you expect. After you've done that, we have some recommendations for you that can make your application more cloud-native.

[!INCLUDE [recommendations-wildfly-on-aks](includes/migration/recommendations-wildfly-on-aks.md)]

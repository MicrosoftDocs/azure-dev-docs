---
title: Migrate WebLogic applications to WildFly on Azure Kubernetes Service
description: This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on WildFly in an Azure Kubernetes Service container.
author: mriem
ms.author: manriem
ms.topic: conceptual
ms.date: 2/28/2020
---

# Migrate WebLogic applications to WildFly on Azure Kubernetes Service

This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on WildFly in an Azure Kubernetes Service container.

## Before you start

If you can't meet any of the pre-migration requirements, see the companion migration guide:

* [Migrate WebLogic applications to Azure Virtual Machines](migrate-weblogic-to-virtual-machines.md)

## Pre-migration

[!INCLUDE [inventory-server-capacity-aks](includes/migration/inventory-server-capacity-aks.md)]

[!INCLUDE [inventory-all-secrets](includes/migration/inventory-all-secrets.md)]

[!INCLUDE [inventory-all-certificates](includes/migration/inventory-all-certificates.md)]

[!INCLUDE [inventory-jndi-resources](includes/migration/inventory-jndi-resources.md)]

### Determine whether session replication is used

If your application relies on session replication, with or without Oracle Coherence*Web, you have two options:

1. Refactor your application to use a database for session management.
2. Refactor your application to externalize the session to Azure Redis Service. For more information, see [Azure Cache for Redis](/azure/azure-cache-for-redis/cache-overview).

[!INCLUDE [document-datasources](includes/migration/document-datasources.md)]

[!INCLUDE [determine-whether-weblogic-has-been-customized](includes/migration/determine-whether-weblogic-has-been-customized.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/migration/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use](includes/migration/determine-whether-jms-queues-or-topics-are-in-use.md)]

[!INCLUDE [determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries](includes/migration/determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries.md)]

[!INCLUDE [determine-whether-osgi-bundles-are-used](includes/migration/determine-whether-osgi-bundles-are-used.md)]

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/migration/determine-whether-your-application-contains-os-specific-code.md)]

[!INCLUDE [determine-whether-oracle-service-bus-is-in-use](includes/migration/determine-whether-oracle-service-bus-is-in-use.md)]

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/migration/determine-whether-your-application-is-composed-of-multiple-wars.md)]

[!INCLUDE [determine-whether-your-application-is-packaged-as-an-ear](includes/migration/determine-whether-your-application-is-packaged-as-an-ear.md)]

<!-- AKS-specific extension of the last INCLUDE. -->
> [!NOTE]
> If you want to be able to scale each of your web applications independently for better use of your AKS resources, you should break up the EAR into separate web applications.
<!-- end extension -->

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/migration/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

### Validate that the supported Java version works correctly

Using WildFly on Azure Kubernetes Service requires a specific version of Java. Therefore, you'll need to validate that your application is able to run correctly using that supported version. This validation is especially important if your current server is using a supported JDK (such as Oracle JDK or IBM OpenJ9).

To obtain your current version, sign in to your production server and run the following command:

```bash
java -version
```

### Determine whether your application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or cron jobs, should NOT be used with Azure Kubernetes Service. Azure Kubernetes Service will not prevent you from deploying an application containing scheduled tasks internally. However, if your application is scaled out, the same scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

To execute scheduled jobs on Azure, consider using [Azure Functions with a Timer Trigger](/azure/azure-functions/functions-bindings-timer). You don't need to migrate the job code itself into a function. Instead, the function can invoke a URL in your application to trigger the job.

> [!NOTE]
> To prevent malicious use, you'll likely need to ensure that the job invocation endpoint requires credentials. In this case, the trigger function will need to provide the credentials.

### Determine whether WLST is used

If you currently use WebLogic Scripting Tool (WLST) to perform the deployment, you'll need to assess what it's doing. If WLST is changing any (runtime) parameters of your application as part of the deployment, you'll need to make sure those parameters conform to one of the following options:

1. They are externalized as app settings.
2. They are embedded in your application.
3. They are using the JBoss CLI during deployment.

If WLST is doing more than what is mentioned above, you will have some additional work to do during migration.

### Determine whether your application uses WebLogic specific APIs

If your application uses WebLogic-specific APIs, you'll need to refactor it to remove those dependencies. For example, if you have used a class mentioned in the [Java API Reference for Oracle WebLogic Server](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/wlapi/index.html?overview-summary.html), you have used a WebLogic-specific API in your application.

### Determine whether your application uses Entity Beans or EJB 2.x-style CMP Beans

If your application uses Entity Beans or EJB 2.x style CMP beans, we recommend that you refactor your application to remove those dependencies.

### Determine whether the Java EE Application Client feature is used

If you have client applications that connect to your (server) application using the Java EE Application Client feature, you'll need to refactor both your client applications and your (server) application to use HTTP APIs.

### Determine whether a deployment plan was used

If your app was deployed using a deployment plan, you'll need to assess what the deployment plan is doing. If the deployment plan is a straight deploy, then you'll be able to deploy your web application without any changes. If the deployment plan is more elaborate, you'll need to determine whether you can use the JBoss CLI to properly configure your application as part of the deployment. If it isn't possible to use the JBoss CLI, you'll need to refactor your application in such a way that a deployment plan is no longer needed.

### Determine whether EJB timers are in use

If your application uses EJB timers, you'll need to validate that the EJB timer code can be triggered by each WildFly instance independently. This validation is needed because, in the Azure Kubernetes Service deployment scenario, each EJB timer will be triggered on its own WildFly instance.

### Validate whether and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. The file system may be used by WebLogic shared modules or by your application code. You may identify some or all of the scenarios described in the following sections.

#### Read-only static content

If your application currently serves static content, you'll need an alternate location for that static content. You may wish to consider moving [static content to Azure Blob Storage](/azure/storage/blobs/storage-blob-static-website) and [adding Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn#enable-azure-cdn-for-the-storage-account) for lightning-fast downloads globally.

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We have provided [a sample implementation for your use](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, Azure Files can be [mounted into the Azure Kubernetes Service pod](/azure/aks/concepts-storage).

### Determine whether JCA connectors are used

If your application uses JCA connectors you'll have to validate that the JCA connector can be used on WildFly. If the JCA implementation is tied to WebLogic, you'll have to refactor your application to NOT use the JCA connector. If it can be used, then you'll need to add the JARs to the server classpath and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

### Determine whether your application uses a Resource Adapter

If your application needs a Resource Adapter (RA), it needs to be compatible with WildFly. Determine whether the RA works fine on a standalone instance of WildFly by deploying it to the server and properly configuring it. If the RA works properly, you'll need to add the JARs to the server classpath of the Docker image and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

### Determine whether JAAS is used

If your application is using JAAS, then you'll need to capture how JAAS is configured. If it's using a database, you can convert it to a JAAS domain on WildFly. If it's a custom implementation, you'll need to validate that it can be used on WildFly.

### Determine whether WebLogic clustering is used

Most likely, you've deployed your application on multiple WebLogic servers to achieve high availability. Azure Kubernetes Service is capable of scaling, but if you've used the WebLogic Cluster API, you'll need to refactor your code to eliminate the use of that API.

[!INCLUDE [perform-in-place-testing](includes/migration/perform-in-place-testing.md)]

## Migration

[!INCLUDE [provision-azure-container-registry-and-azure-kubernetes-service](includes/migration/provision-azure-container-registry-and-azure-kubernetes-service.md)]

### Create a Docker image for WildFly

To create a Dockerfile, you'll need the following prerequisites:

1. A supported JDK
1. An install of WildFly
1. Your JVM runtime options.
1. A way to pass in environment variables (if applicable).

You can then perform the steps described in the following sections, where applicable. You can use the [WildFly Container Quickstart repo](https://github.com/Azure/wildfly-container-quickstart)  as a starting point for your Dockerfile and web application.

[!INCLUDE [configure-keyvault-flexvolume](includes/migration/configure-keyvault-flexvolume.md)]

[!INCLUDE [set-up-data-sources](includes/migration/set-up-data-sources.md)]

[!INCLUDE [set-up-jndi-resources](includes/migration/set-up-jndi-resources.md)]

[!INCLUDE [review-wildfly-configuration](includes/migration/review-wildfly-configuration.md)]

[!INCLUDE [build-and-push-the-docker-image-to-azure-container-registry](includes/migration/build-and-push-the-docker-image-to-azure-container-registry.md)]

[!INCLUDE [provision-a-public-ip-address](includes/migration/provision-a-public-ip-address.md)]

[!INCLUDE [deploy-to-aks](includes/migration/deploy-to-aks.md)]

### Configure Persistent Storage

If your application requires non-volatile storage, configure one or more [Persistent Volumes](/azure/aks/azure-disks-dynamic-pv).

[!INCLUDE [migrate-scheduled-jobs-aks](includes/migration/migrate-scheduled-jobs-aks.md)]

## Post-migration

Now that you've migrated your application to Azure Kubernetes Service, you should verify that it works as you expect. After you've done that, see the following recommendations to make your application more cloud-native.

[!INCLUDE [recommendations-wildfly-on-aks](includes/migration/recommendations-wildfly-on-aks.md)]

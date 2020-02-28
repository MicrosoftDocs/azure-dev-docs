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

### Inventory all certificates

Document all the certificates used for public SSL endpoints. You can view all certificates on the production server(s) by running the following command:

```bash
keytool -list -v -keystore <path to keystore>
```

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

### Determine whether databases are used

If your application uses any databases, you need to capture the following information:

1. What is the datasource name?
2. What is the connection pool configuration?
3. Where can I find the JDBC driver JAR file?

### Determine whether and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by WebSphere modules or by your application code. You may identify some or all of the following scenarios.

#### Read-only static content

If your application currently serves static content, an alternate location for that static content will be required. You may wish to consider moving [static content to Azure Blob Storage](/azure/storage/blobs/storage-blob-static-website) and [adding Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn#enable-azure-cdn-for-the-storage-account) for lightning-fast downloads globally.

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We have provided [a sample implementation for your use](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, Azure Files can be [mounted into the Azure Kubernetes Service pod](/azure/aks/concepts-storage).

### Determine whether your application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or cron jobs, should NOT be used with Azure Kubernetes Service. Azure Kubernetes Service will not prevent you from deploying an application containing scheduled tasks internally. However, if your application is scaled out, the same scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

To execute scheduled jobs on Azure, consider using [Azure Functions with a Timer Trigger](/azure/azure-functions/functions-bindings-timer). You don't need to migrate the job code itself into a function. Instead, the function can invoke a URL in your application to trigger the job.

> [!NOTE]
> To prevent malicious use, you'll likely need to ensure that the job invocation endpoint requires credentials. In this case, the trigger function will need to provide the credentials.

### Determine whether a connection to on-premises is needed

If your application needs to access any of your on-premises services, you'll need to provision one of [Azure's connectivity services](/azure/architecture/reference-architectures/hybrid-networking/). Alternatively, you'll need to refactor your application to use publicly available APIs that your on-premises resources expose.

### Determine whether JMS Queues or Topics are being used

If your application is using JMS Queues or Topics, you'll need to migrate them to an externally hosted JMS server (for example, to Azure Service Bus; for more information, see [Migrate a message-driven enterprise bean to Azure](/azure/service-bus-messaging/migrate-java-apps-wild-fly#migrate-a-message-driven-enterprise-bean-to-azure)).

If JMS persistent stores have been configured, their configuration must be captured and applied after the migration.

### Determine whether your application uses WebSphere specific APIs

If your application uses WebSphere specific APIs, you'll need to refactor your application to NOT use them. For example, if you have used a class mentioned in the [IBM WebSphere Application Server, Release 9.0
API Specification](https://www.ibm.com/support/knowledgecenter/en/SSEQTJ_9.0.5/com.ibm.websphere.javadoc.doc/web/apidocs/overview-summary.html?view=embed), you have used a WebSphere specific API in your application.

### Determine whether your application uses Entity Beans or EJB 2.x-style CMP Beans

If your application uses Entity Beans or EJB 2.x style CMP beans, you'll need to refactor your application to NOT use them.

### Determine whether the JavaEE Application Client feature is used

If you have client applications that connect to your (server) application using the JavaEE Application Client feature, you'll need to refactor both your client applications and your (server) application to use HTTP APIs.

### Determine whether your application contains OS-specific code

If your application contains any code with dependencies on the host OS, then you'll need to refactor it to remove those dependencies.

### Determine whether EJB timers are in use

If your application uses EJB timers, you'll need to validate that the EJB timer code can be triggered by each WildFly instance independently. This validation is needed because, in the Azure Kubernetes Service deployment scenario, each EJB timer will be triggered on its own WildFly instance.

### Determine whether JCA connectors are in use

If your application uses JCA connectors, you'll have to validate the JCA connector can be used on WildFly. If the JCA implementation is tied to WebSphere, you'll have to refactor your application to NOT use the JCA connector. If it can be used, then you'll need to add the JARs to the server classpath and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

### Determine whether JAAS is being used

If your application is using JAAS, you'll need to capture how JAAS is configured. If it's using a database, you can convert it to a JAAS domain on WildFly. If it's a custom implementation, you'll need to validate that it can be used on WildFly.

### Determine whether your application uses a Resource Adapter

If your application needs a Resource Adapter (RA), it needs to be compatible with WildFly. Determine whether the RA works fine on a standalone instance of WildFly by deploying it to the server and properly configuring it. If the RA works properly, you'll need to add the JARs to the server classpath of the Docker image and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

### Determine whether your application is composed of multiple WARs

If your application is composed of multiple WARs, you should treat each of those WARs as separate applications and go through this guide for each of them.

### Determine whether your application is packaged as an EAR

If your application is packaged as an EAR file, be sure to examine the *application.xml* and *application-bnd.xml* files and capture their configurations.

Note if you want to be able to scale each of your web applications independently for better use of your AKS resources you should break up the EAR into separate web applications.

### Identify all outside processes/daemons running on the production server(s)

Processes running outside of Application Server, such as monitoring daemons, will need to be migrated elsewhere or eliminated.

[!INCLUDE [perform-in-place-testing](includes/migration/perform-in-place-testing.md)]

## Migration

[!INCLUDE [provision-azure-container-registry-and-azure-kubernetes-service](includes/migration/provision-azure-container-registry-and-azure-kubernetes-service.md)]

### Create a Docker image for WildFly

You will need to create a Dockerfile with the following:

1. A supported JDK
1. An install of WildFly
1. JVM runtime options
1. A way to pass in environment variables (if applicable)
1. [Configure KeyVault FlexVolume](#configure-keyvault-flexvolume) (if applicable)
1. [Setup data sources](#set-up-data-sources) (if applicable)
1. [Setup JNDI resources](#set-up-jndi-resources) (if applicable)
1. [Review WildFly configuration](#review-wildfly-configuration)

> For your convenience we have created a quickstart in the [WildFly Container Quickstart GitHub repository](https://github.com/Azure/wildfly-container-quickstart) which you can use as a starting point for your Dockerfile and web application.

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

Now that you have your application migrated to Azure Kubernetes Service you should verify that it works as you expect. Once you've done that, we have some recommendations for you that can make your application more cloud-native.

[!INCLUDE [recommendations-wildfly-on-aks](includes/migration/recommendations-wildfly-on-aks.md)]

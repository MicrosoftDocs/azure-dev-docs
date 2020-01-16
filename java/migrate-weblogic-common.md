---
title: Migrate WebLogic applications to Azure
description: This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on Azure
author: edburns
ms.author: edburns
ms.topic: conceptual
ms.date: 12/12/2019
---

# Aspects common to migrating WebLogic to Azure

This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on Azure.

## Before you start

If there are any pre-migration requirements that you can't meet, see the following companion migration guides:

* [Migrate WebLogic applications to Azure containers](migrate-weblogic-to-containers.md)
* [Migrate WebLogic applications to Azure Virtual Machines](migrate-weblogic-to-virtual-machines.md)
* [Migrate WebLogic applications to WildFly on Azure App Service](migrate-weblogic-to-wildfly.md)

## Pre-migration

As the list below can seem a bit daunting, we have ordered it with the most common steps at the top of the list.

1. [Inventory server capacity](#inventory-server-capacity)
1. [Inventory all secrets](#inventory-all-secrets)
1. [Inventory all certificates](#inventory-all-certificates)
1. [Validate that the supported Java version works correctly](#validate-that-the-supported-java-version-works-correctly)
1. [Inventory JNDI resources](#inventory-jndi-resources)
1. [Domain configuration](#domain-configuration)
1. [Determine whether session replication is used](#determine-whether-session-replication-is-used)
1. [Document datasources](#document-datasources)
1. [Determine whether WebLogic has been customized](#determine-whether-weblogic-has-been-customized)
1. [Determine whether Management over REST is used](#determine-whether-management-over-rest-is-used)
1. [Determine whether a connection to on-premises is needed](#determine-whether-a-connection-to-on-premises-is-needed)
1. [Determine whether JMS Queues or Topics are being used](#determine-whether-jms-queues-or-topics-are-being-used)
1. [Determine whether you are using your own custom created shared Java EE libraries](#determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries)
1. [Determine whether OSGi bundles are used](#determine-whether-osgi-bundles-are-used)
1. [Determine whether your application contains OS-specific code](#determine-whether-your-application-contains-os-specific-code)
1. [Determine whether Oracle Service Bus is being used](#determine-whether-oracle-service-bus-is-being-used)
1. [Determine whether your application is composed of multiple WARs](#determine-whether-your-application-is-composed-of-multiple-wars)
1. [Determine whether your application is packaged as an EAR](#determine-whether-your-application-is-packaged-as-an-ear)
1. [Identify all outside processes/daemons running on the production server(s)](#identify-all-outside-processesdaemons-running-on-the-production-servers)

### Inventory server capacity

Document the hardware (memory, CPU, disk) of the current production server(s) as well as the average and peak request counts and resource utilization. You'll need this information regardless of the migration path you choose. It's useful, for example, to help guide selection of the target service plan, VMs, Kubernetes memory, and CPU shares.

### Inventory all secrets

Check all properties and configuration files on the production server(s) for any secrets and passwords. Be sure to check *weblogic.xml* in your WARs. Configuration files containing passwords or credentials may also be found inside your application. These files may include, for Spring (Boot) applications, the *application.properties* or *application.yml* files.

### Inventory all certificates

Document all the certificates used for public SSL endpoints. You can view all certificates on the production server(s) by running the following command:

```bash
keytool -list -v -keystore <path to keystore>
```

### Validate that the supported Java version works correctly

All of the migration paths for WebLogic to Azure require a specific Java version, which varies for each path. You'll need to validate that your application is able to run correctly using that supported version.

> [!NOTE]
> This validation is especially important if your current server is running on an unsupported JDK (such as Oracle JDK or IBM OpenJ9).

To obtain your current version, sign in to your production server and run this command:

```bash
java -version
```

> [!NOTE]
> When migrating to WebLogic on Azure virtual machines, the requirements for the specific Java versions are determined by the pre-installed Java on the virtual machines.

### Inventory JNDI resources

Inventory all JNDI resources. Some, such as JMS message brokers, may require migration or reconfiguration.

### Domain configuration

The main configuration unit in WebLogic Server is the domain. As such, the *domain.xml* file contains a wealth of configuration, which must be carefully considered for migration.

#### Inside your application

Inspect the *WEB-INF/weblogic.xml* file and/or the *WEB-INF/web.xml* file.

### Determine whether session replication is used

If your application relies on session replication and Oracle Coherence*Web, you have two options:

1. Refactor your application to use a database for session management.
2. Refactor your application to externalize the session management.

### Document datasources

If your application uses any databases, you need to capture the following information:

1. What is the datasource name?
2. What is the connection pool configuration?
3. Where can I find the JDBC driver JAR file?

For more information on JDBC drivers in WebLogic, see [Using JDBC Drivers with WebLogic Server](https://docs.oracle.com/middleware/1213/wls/JDBCA/third_party_drivers.htm#JDBCA231).

### Determine whether WebLogic has been customized

Determine which of the following customizations have been made, and capture what's been done.

* Have the startup scripts been changed? Such scripts include *setDomainEnv*, *commEnv*, *startWebLogic*, and *stopWebLogic*.
* Are there any specific parameters passed to the JVM?
* Are there JARs added to the server classpath?

### Determine whether Management over REST is used

If the lifecycle of your application includes using Management over REST, you need to capture which ports are used to access the REST API and how they are authenticated and exposed. After migration, you'll need to ensure these same ports and authentication mechanisms are exposed so your application lifecycle can operate in a similar fashion as before the migration. For more about Management over REST, see [the Oracle documentation](https://docs.oracle.com/middleware/12213/wls/WLRUR/title.htm).

### Determine whether a connection to on-premises is needed

If your application needs to access any of your on-premises services, you'll need to provision one of [Azure's connectivity services](/azure/architecture/reference-architectures/hybrid-networking/). Alternatively, you'll need to refactor your application to use publicly available APIs that your on-premises resources expose.

### Determine whether JMS Queues or Topics are being used

If your application is using JMS Queues or Topics, you'll need to migrate them to an externally hosted JMS server (for example, to Azure Service Bus; see [Use Service Bus as a message broker](/azure/app-service/containers/configure-language-java#use-service-bus-as-a-message-broker)).

If JMS persistent stores have been configured, their configuration must be captured and applied after the migration.

### Determine whether you are using your own custom created Shared Java EE Libraries

If you're using the Shared Java EE library feature, you have two options:

1. Refactor your application code to remove all dependencies on your libraries, and instead incorporate the functionality directly into your application.
2. Add the libraries to the server classpath.

### Determine whether OSGi bundles are used

If you used OSGi bundles added to the WebLogic server, you'll need to add the equivalent JAR files directly to your web application.

### Determine whether your application contains OS-specific code

If your application contains any code with dependencies on the host OS, then you'll need to refactor it to remove those dependencies.

### Determine whether Oracle Service Bus is being used

If your application is using Oracle Service Bus (OSB), you'll need to capture how OSB is configured. For more information, see [the OSB documentation](https://docs.oracle.com/en/middleware/fusion-middleware/12.2.1.3/inosb/product-installation.html#GUID-4A150924-9210-4788-8DE1-54D14520980E).

### Determine whether your application is composed of multiple WARs

If your application is composed of multiple WARs, you should treat each of those WARs as separate applications and go through this guide for each of them.

### Determine whether your application is packaged as an EAR

If your application is packaged as an EAR file, be sure to examine the *application.xml* and *weblogic-application.xml* files and capture their configurations.

### Identify all outside processes/daemons running on the production server(s)

If you have any processes running outside the application server, such as monitoring daemons, you'll need to eliminate them or migrate them elsewhere.

## Migration

Continue with the migration guidance in the following scenarios:

* [Migrate WebLogic applications to Azure containers](migrate-weblogic-to-containers.md)
* [Migrate WebLogic applications to Azure Virtual Machines](migrate-weblogic-to-virtual-machines.md)
* [Migrate WebLogic applications to WildFly on Azure App Service](migrate-weblogic-to-wildfly.md)

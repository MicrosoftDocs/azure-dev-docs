---
title: Migrate WebSphere applications to JBoss EAP on Azure App Service
description: This guide describes what you should be aware of when you want to migrate an existing WebSphere application to run on Azure App Service using JBoss EAP.
author: KarlErickson
ms.author: karler
ms.reviewer: dbrittain
ms.topic: upgrade-and-migration-article
ms.date: 09/20/2024
ms.custom: devx-track-extended-java, devx-track-java, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-appsvc, migration-java, devx-track-javaee-websphere, linux-related-content
---

# Migrate WebSphere applications to JBoss EAP on Azure App Service

This guide describes what you should be aware of when you want to migrate an existing WebSphere application to run on Azure App Service using JBoss EAP.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

[!INCLUDE [inventory-server-capacity-jboss-eap](includes/inventory-server-capacity-jboss-eap.md)]

### Inventory all secrets

Check all properties and configuration files on the production server or servers for any secrets and passwords. Be sure to check **ibm-web-bnd.xml** in your WARs. Configuration files that contain passwords or credentials may also be found inside your application. These files may include, for Spring Boot applications, the **application.properties** or **application.yml** files.

[!INCLUDE [inventory-all-certificates](includes/inventory-all-certificates.md)]

### Validate that the supported Java version works correctly

JBoss EAP on Azure App Service supports Java 8 and 11. Therefore, you'll need to validate that your application is able to run correctly using that supported version. This validation is especially important if your current server is using a supported JDK (such as Oracle JDK or IBM OpenJ9).

To obtain your current Java version, sign in to your production server and run the following command:

```bash
java -version
```

### Inventory JNDI resources

Inventory all JNDI resources. Some resources, such as JMS message brokers, may require migration or reconfiguration.

#### Inside your application

Inspect the **WEB-INF/ibm-web-bnd.xml** file and/or the **WEB-INF/web.xml** file.

### Determine whether databases are used

If your application uses any databases, you need to capture the following information:

- The datasource name.
- The connection pool configuration.
- The location of the JDBC driver JAR file.

### Determine whether and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by WebSphere shared modules or by your application code. You may identify some or all of the following scenarios.

[!INCLUDE [static-content](includes/static-content.md)]

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, you can mount Azure Storage into your App Service file system. For more information, see [Mount Azure Storage as a local share in App Service](/azure/app-service/containers/how-to-serve-content-from-azure-storage#link-storage-to-your-web-app-preview).

### Determine whether your application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or Unix cron jobs, should NOT be used with Azure App Service. Azure App Service will not prevent you from deploying an application containing scheduled tasks internally. However, if your application is scaled out, the same scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

To execute scheduled jobs on Azure, consider using Azure Functions with a Timer Trigger. For more information, see [Timer trigger for Azure Functions](/azure/azure-functions/functions-bindings-timer). You don't need to migrate the job code itself into a function. The function can simply invoke a URL in your application to trigger the job.

> [!NOTE]
> To prevent malicious use, you'll likely need to ensure that the job invocation endpoint requires credentials. In this case, the trigger function will need to provide the credentials.

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use](includes/determine-whether-jms-queues-or-topics-are-in-use.md)]

### Determine whether your application uses WebSphere-specific APIs

If your application uses WebSphere-specific APIs, you'll need to refactor your application to NOT use them. The [Red Hat Migration Toolkit for Apps](https://marketplace.visualstudio.com/items?itemName=redhat.mta-vscode-extension) can assist with removing and refactoring these dependencies.

[!INCLUDE [determine-whether-your-application-uses-entity-beans](includes/determine-whether-your-application-uses-entity-beans.md)]

### Determine whether the JavaEE Application Client feature is used

If you have client applications that connect to your (server) application using the JavaEE Application Client feature, you'll need to refactor both your client applications and your (server) application to use HTTP APIs.

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code.md)]

### Determine whether EJB timers are in use

If your application uses EJB timers, you'll need to validate that the EJB timer code can be triggered by each JBoss EAP instance independently. This validation is needed because when your App Service is scaled our horizontally, each EJB timer will be triggered on its own JBoss EAP instance.

### Determine whether JCA connectors are in use

If your application uses JCA connectors, you'll need to validate that the JCA connector can be used on JBoss EAP. If the JCA implementation is tied to WebSphere, you'll need to refactor your application remove the dependency on the JCA connector. If the JCA connector can be used, then you'll need to add the JARs to the server classpath. You'll also need to put the necessary configuration files in the correct location in the JBoss EAP server directories for it to be available.

### Determine whether JAAS is in use

If your application uses JAAS, you'll need to capture how JAAS is configured. If it's using a database, you can convert it to a JAAS domain on JBoss EAP. If it's a custom implementation, you'll need to validate that it can be used on JBoss EAP.

### Determine whether your application uses a Resource Adapter

If your application needs a Resource Adapter (RA), it needs to be compatible with JBoss EAP. Determine whether the RA works fine on a standalone instance of JBoss EAP by deploying it to the server and properly configuring it. If the RA works properly, you'll need to add the JARs to the server classpath of the App Service instance and put the necessary configuration files in the correct location in the JBoss EAP server directories for it to be available.

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/determine-whether-your-application-is-composed-of-multiple-wars.md)]

### Determine whether your application is packaged as an EAR

If your application is packaged as an EAR file, be sure to examine the **application.xml** and **ibm-application-bnd.xml** files and capture their configurations.

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

## Migration

[!INCLUDE [java-redhat-migration-toolkit](includes/redhat-migration-toolkit.md)]

### Provision an App Service plan

From the [list of available service plans](https://azure.microsoft.com/pricing/details/app-service/linux/), select the plan whose specifications meet or exceed the specifications of the current production hardware.

> [!NOTE]
> If you plan to run staging/canary deployments or use [deployment slots](/azure/app-service/deploy-staging-slots), the App Service plan must include that additional capacity. We recommend using Premium or higher plans for Java applications.

[Create that app service plan](/azure/app-service/app-service-plan-manage#create-an-app-service-plan).

### Create and deploy web app(s)

You'll need to create a Web App on your App Service Plan for every WAR file deployed to your JBoss EAP server.

> [!NOTE]
> While it's possible to deploy multiple WAR files to a single web app, this is highly undesirable. Deploying multiple WAR files to a single web app prevents each application from scaling according to its own usage demands. It also adds complexity to subsequent deployment pipelines. If multiple applications need to be available on a single URL, consider using a routing solution such as [Azure Application Gateway](/azure/application-gateway/).

#### Maven applications

If your application is built from a Maven POM file, use the Webapp plugin for Maven to create the Web App and deploy your application. For more information, see the [Configure the Maven plugin](/azure/app-service/containers/quickstart-java#3---configure-the-maven-plugin) section of [Quickstart: Create a Java app on Azure App Service](/azure/app-service/containers/quickstart-java).

#### Non-Maven applications

If you can't use the Maven plugin, you'll need to provision the Web App through other mechanisms, such as:

* [Azure portal](https://portal.azure.com/#create/Microsoft.WebSite)
* [Azure CLI](/cli/azure/webapp#az-webapp-create)
* [Azure PowerShell](/powershell/module/az.websites/new-azwebapp)

After you've created the web app, use one of the available deployment mechanisms to deploy your application. For more information, see [Deploy files to App Service](/azure/app-service/deploy-zip).

### Migrate JVM runtime options

If your application requires specific runtime options, use the most appropriate mechanism to specify them. For more information, see the [Set Java runtime options](/azure/app-service/containers/configure-language-java#set-java-runtime-options) section of [Deploy and configure a Tomcat, JBoss, or Java SE app in Azure App Service](/azure/app-service/containers/configure-language-java).

### Populate secrets

Use Application Settings to store any secrets specific to your application. If you intend to use the same secret or secrets among multiple applications, or you require fine-grained access policies and audit capabilities, use Azure Key Vault references instead. For more information, see [Use Key Vault references as app settings in Azure App Service and Azure Functions](/azure/app-service/app-service-key-vault-references).

### Configure custom domain and SSL

If your application will be visible on a custom domain, you'll need to map your web application to it. For more information, see [Tutorial: Map an existing custom DNS name to Azure App Service](/Azure/app-service/app-service-web-tutorial-custom-domain).

You'll then need to bind the TLS/SSL certificate for that domain to your App Service Web App. For more information, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](/azure/app-service/app-service-web-tutorial-custom-ssl).

### Migrate data sources, libraries, and JNDI resources

To migrate data sources, follow the steps in the [Configure data sources for a Tomcat, JBoss, or Java SE app in Azure App Service](/azure/app-service/configure-language-java-data-sources).

Migrate any additional server-level classpath dependencies. For more information, see [Configure data sources for a Tomcat, JBoss, or Java SE app in Azure App Service](/azure/app-service/containers/configure-language-java?pivots=java-jboss).

Migrate any additional shared server-level JDNI resources. For more information, see [Configure data sources for a Tomcat, JBoss, or Java SE app in Azure App Service](/azure/app-service/containers/configure-language-java?pivots=java-jboss).

> [!NOTE]
> If you're following the recommended architecture of one WAR per application, consider migrating server-level classpath libraries and JNDI resources into your application. Doing so will significantly simplify component governance and change management. If you want to deploy more than one WAR per application, you should review one of our companion guides mentioned at the beginning of this guide.

### Migrate scheduled jobs

At a minimum, you should move your scheduled jobs to an Azure VM so they're no longer part of your application. Alternately, you can opt to modernize them into event driven Java using Azure services such as Azure Functions, SQL Database, and Event Hubs.

### Restart and smoke-test

Finally, you'll need to restart your Web App to apply all configuration changes. Upon completion of the restart, verify that your application is running correctly.

## Post-migration

Now that you've migrated your application to Azure App Service, you should verify that it works as you expect. Once you've done that, we have some recommendations for you that can make your application more Cloud native.

[!INCLUDE [recommendations-jboss-eap](includes/recommendations-jboss-eap.md)]

---
title: Migrate WebSphere applications to WildFly on Azure App Service
description: This guide describes what you should be aware of when you want to migrate an existing WebSphere application to run on Azure App Service using WildFly.
author: mnriem
ms.author: manriem
ms.topic: conceptual
ms.date: 12/12/2019
---

# Migrate WebSphere applications to WildFly on Azure App Service

This guide describes what you should be aware of when you want to migrate an existing WebSphere application to run on Azure App Service using WildFly.

## Pre-migration

1. [Inventory server capacity](#inventory-server-capacity)
1. [Inventory all secrets](#inventory-all-secrets)
1. [Inventory all certificates](#inventory-all-certificates)
1. [Validate that the supported Java version works correctly](#validate-that-the-supported-java-version-works-correctly)
1. [Inventory JNDI resources](#inventory-jndi-resources)
1. [Determine whether databases are used](#determine-whether-databases-are-used)
1. [Determine whether and how the file system is used](#determine-whether-and-how-the-file-system-is-used)
1. [Determine whether your application relies on scheduled jobs](#determine-whether-your-application-relies-on-scheduled-jobs)
1. [Determine whether a connection to on-premises is needed](#determine-whether-a-connection-to-on-premises-is-needed)
1. [Determine whether JMS Queues or Topics are being used](#determine-whether-jms-queues-or-topics-are-being-used)
1. [Determine whether your application uses WebSphere-specific APIs](#determine-whether-your-application-uses-websphere-specific-apis)
1. [Determine whether your application uses Entity Beans or EJB 2.x style CMP Beans](#determine-whether-your-application-uses-entity-beans-or-ejb-2x-style-cmp-beans)
1. [Determine whether the JavaEE Application Client feature is used](#determine-whether-the-javaee-application-client-feature-is-used)
1. [Determine whether your application contains OS-specific code](#determine-whether-your-application-contains-os-specific-code)
1. [Determine whether EJB timers are in use](#determine-whether-ejb-timers-are-in-use)
1. [Determine whether JCA connectors are in use](#determine-whether-jca-connectors-are-in-use)
1. [Determine whether JAAS is being used](#determine-whether-jaas-is-being-used)
1. [Determine whether your application uses a Resource Adapter](#determine-whether-your-application-uses-a-resource-adapter)
1. [Determine whether your application is composed of multiple WARs](#determine-whether-your-application-is-composed-of-multiple-wars)
1. [Determine whether your application is packaged as an EAR](#determine-whether-your-application-is-packaged-as-an-ear)
1. [Identify all outside processes/daemons running on the production server(s)](#identify-all-outside-processesdaemons-running-on-the-production-servers)

### Inventory server capacity

Document the hardware (memory, CPU, disk) of the current production server(s) as well as the average and peak request counts and resource utilization. This information will be necessary regardless of the migration path chosen. For example, it's useful to guide selection of the target service plan, VMs, Kubernetes memory, and CPU shares.

### Inventory all secrets

Check all properties and configuration files on the production server(s) for any secrets and passwords. Be sure to check *ibm-web-bnd.xml* in your WARs. Configuration files that contain passwords or credentials may also be found inside your application. These files may include, for Spring (Boot) applications, *application.properties* or *application.yml* files.

### Inventory all certificates

Document all the certificates used for public SSL endpoints. You can view all certificates on the production server(s) by running the following command:

```bash
keytool -list -v -keystore <path to keystore>
```

### Validate that the supported Java version works correctly

All of the migration paths for WebSphere to Azure require a specific Java version, which varies for each path. You'll need to validate that your application is able to run correctly using that supported version.

> [!NOTE]
> This validation is especially important if your current server is running on an unsupported JDK (such as Oracle JDK or IBM OpenJ9).

To obtain your current version, login to your production server and run this command:

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

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by WebLogic shared modules or by your application code. You may identify some or all of the following scenarios.

#### Read-only static content

If your application currently serves static content, an alternate location for that static content will be required. You may wish to consider moving [static content to Azure Blob Storage](/azure/storage/blobs/storage-blob-static-website) and [adding Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn#enable-azure-cdn-for-the-storage-account) for lightning-fast downloads globally.

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We have provided [a sample implementation for your use](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, you can mount Azure Storage into your App Service file system. For more information, see [Serve content from Azure Storage in App Service on Linux](/azure/app-service/containers/how-to-serve-content-from-azure-storage#link-storage-to-your-web-app-preview).

### Determine whether your application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or cron jobs, cannot be used with App Service. While App Service won't prevent you from deploying an application that contains scheduled tasks internally, if your application is scaled out, the same scheduled job may run more than once per scheduled period, potentially leading to unintended consequences.

To execute scheduled jobs on Azure, consider using [Azure Functions with a Timer Trigger](/azure/azure-functions/functions-bindings-timer). You don't need to migrate the job code itself into a function. The function can simply invoke a URL in your application to trigger the job.

> [!NOTE]
> To prevent malicious use, you'll likely need to ensure that the job invocation endpoint requires credentials. In this case, the trigger function will need to provide the credentials.

### Determine whether a connection to on-premises is needed

If your application needs to access any of your on-premises services, you'll need to provision one of [Azure's connectivity services](/azure/architecture/reference-architectures/hybrid-networking/). Alternatively, you'll need to refactor your application to use publicly available APIs that your on-premises resources expose.

### Determine whether JMS Queues or Topics are being used

If your application is using JMS Queues or Topics, you'll need to migrate them to an externally hosted JMS server (for example, to Azure Service Bus; for more information, see [Migrate a message-driven enterprise bean to Azure](/azure/service-bus-messaging/migrate-java-apps-wild-fly#migrate-a-message-driven-enterprise-bean-to-azure)).

If JMS persistent stores have been configured, their configuration must be captured and applied after the migration.

### Determine whether your application uses WebSphere-specific APIs

If your application uses WebSphere-specific APIs, you'll need to refactor your application to NOT use them.

### Determine whether your application uses Entity Beans or EJB 2.x-style CMP Beans

If your application uses Entity Beans or EJB 2.x style CMP beans, you'll need to refactor your application to NOT use them.

### Determine whether the JavaEE Application Client feature is used

If you have client applications that connect to your (server) application using the JavaEE Application Client feature, you'll need to refactor both your client applications and your (server) application to use HTTP APIs.

### Determine whether your application contains OS-specific code

If your application contains any code with dependencies on the host OS, then you'll need to refactor it to remove those dependencies.

### Determine whether EJB timers are in use

If your application uses EJB timers, you'll need to validate that the EJB timer code can be triggered by each WildFly instance independently. This validation is needed because, in the App Service deployment scenario, each EJB timer will be triggered on its own WildFly instance.

### Determine whether JCA connectors are in use

If your application uses JCA connectors, you'll have to validate the JCA connector can be used on WildFly. If the JCA implementation is tied to WebSphere, you'll have to refactor your application to NOT use the JCA connector. If it can be used, then you'll need to add the JARs to the server classpath and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

### Determine whether JAAS is being used

If your application is using JAAS, you'll need to capture how JAAS is configured. If it's using a database, you can convert it to a JAAS domain on WildFly. If it's a custom implementation, you'll need to validate that it can be used on WildFly.

### Determine whether your application uses a Resource Adapter

If your application needs a Resource Adapter (RA), it needs to be compatible with WildFly. Determine whether the RA works fine on a standalone instance of WildFly by deploying it to the server and properly configuring it. If the RA works properly, you'll need to add the JARs to the server classpath of the App Service instance and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

### Determine whether your application is composed of multiple WARs

If your application is composed of multiple WARs, you should treat each of those WARs as separate applications and go through this guide for each of them.

### Determine whether your application is packaged as an EAR

If your application is packaged as an EAR file, be sure to examine the *application.xml* and *ibm-application-bnd.xml* files and capture their configurations.

### Identify all outside processes/daemons running on the production server(s)

Processes running outside of Application Server, such as monitoring daemons, will need to be migrated elsewhere or eliminated.

## Migration

### Provision an App Service plan

From the [list of available service plans](https://azure.microsoft.com/pricing/details/app-service/linux/), select the plan whose specifications meet or exceed those of the current production hardware.

> [!NOTE]
> If you plan to run staging/canary deployments or use [deployment slots](/azure/app-service/deploy-staging-slots), the App Service plan must include that additional capacity. We recommend using Premium or higher plans for Java applications.

[Create that app service plan](/azure/app-service/app-service-plan-manage#create-an-app-service-plan).

### Create and deploy web app(s)

You'll need to create a Web App on your App Service Plan for every WAR file deployed to your WildFly server.

> [!NOTE]
> While it's possible to deploy multiple WAR files to a single web app, this is highly undesirable. Deploying multiple WAR files to a single web app prevents each application from scaling according to its own usage demands. It also adds complexity to subsequent deployment pipelines. If multiple applications need to be available on a single URL, consider using a routing solution such as [Azure Application Gateway](/azure/application-gateway/).

#### Maven applications

If your application is built from a Maven POM file, [use the Webapp plugin for Maven](/azure/app-service/containers/quickstart-java#configure-the-maven-plugin) to create the Web App and deploy your application.

#### Non-Maven applications

If you cannot use the Maven plugin, you'll need to provision the Web App through other mechanisms, such as:

* [Azure portal](https://portal.azure.com/#create/Microsoft.WebSite)
* [Azure CLI](/cli/azure/webapp?view=azure-cli-latest#az-webapp-create)
* [Azure PowerShell](/powershell/module/az.websites/new-azwebapp)

Once the Web App has been created, use one of the [available deployment mechanisms](/azure/app-service/deploy-zip) to deploy your application.

### Migrate JVM runtime options

If your application requires specific runtime options, [use the most appropriate mechanism to specify them](/azure/app-service/containers/configure-language-java#set-java-runtime-options).

### Populate secrets

Use Application Settings to store any secrets specific to your application. If you intend to use the same secret(s) among multiple applications or require fine-grained access policies and audit capabilities, [use Azure Key Vault](/azure/app-service/containers/configure-language-java#use-keyvault-references) instead.

### Configure custom domain and SSL

If your application will be visible on a custom domain, you'll need to [map your web application to it](/Azure/app-service/app-service-web-tutorial-custom-domain).

You'll then need to [bind the SSL certificate for that domain to your App Service Web App](/Azure/app-service/app-service-web-tutorial-custom-ssl).

### Migrate data sources, libraries, and JNDI resources

Follow [these steps to migrate data sources](/azure/app-service/containers/configure-language-java#configure-data-sources).

Migrate any additional server-level classpath dependencies by following [Install modules and dependencies](/azure/app-service/containers/configure-language-java#install-modules-and-dependencies).

Migrate any additional [Shared server-level JDNI resources](/azure/app-service/containers/configure-language-java#install-modules-and-dependencies).

> [!NOTE]
> If you're following the recommended architecture of one WAR per application, consider migrating server-level classpath libraries and JNDI resources into your application. Doing so will significantly simplify component governance and change management. If you want to deploy more than one WAR per application, you should review one of our companion guides mentioned at the beginning of this guide.

### Migrate scheduled jobs

At a minimum, you should move your scheduled jobs to an Azure VM so they are no longer part of your application. Or you can opt to modernize them into event driven Java using Azure services such as Azure Functions, SQL Database, and Event Hubs.

### Restart and smoke-test

Finally, you'll need to restart your Web App to apply all configuration changes. Upon completion of the restart, verify that your application is running correctly.

## Post-migration

Now that you've migrated your application to Azure App Service, you should verify that it works as you expect. Once you've done that, we have some recommendations for you that can make your application more Cloud native.

### Recommendations

1. If you opted to use the */home* directory for file storage, consider [replacing it with Azure Storage](/azure/app-service/containers/how-to-serve-content-from-azure-storage).

1. If you have configuration in the */home* directory that contains connection strings, SSL keys, and other secret information, consider using a combination of [Azure Key Vault](/azure/app-service/app-service-key-vault-references) and/or [parameter injection with application settings](/azure/app-service/configure-common#configure-app-settings) where possible.

1. Consider [using Deployment Slots](/azure/app-service/deploy-staging-slots) for reliable deployments with zero downtime.

1. Design and implement a DevOps strategy. In order to maintain reliability while increasing your development velocity, consider [automating deployments and testing with Azure Pipelines](/azure/devops/pipelines/ecosystems/java-webapp). If using Deployment Slots, you can [automate deployment to a slot](/azure/devops/pipelines/targets/webapp?view=azure-devops&tabs=yaml#deploy-to-a-slot) and the subsequent slot swap.

1. Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a [multi-region deployment architecture](/azure/architecture/reference-architectures/app-service-web-app/multi-region).

---
title: Migrate WebLogic Server applications to JBoss EAP on Azure App Service
description: This guide describes what you should be aware of when you want to migrate an existing WebLogic Server application to run on Azure App Service using JBoss EAP.
author: KarlErickson
ms.author: karler
ms.topic: upgrade-and-migration-article
ms.date: 09/09/2024
ms.custom: devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-appsvc, migration-java, linux-related-content
---

# Migrate WebLogic Server applications to JBoss EAP on Azure App Service

This guide describes what you should be aware of when you want to migrate an existing WebLogic Server application to run on Azure App Service using JBoss EAP.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

If you can't meet any of these pre-migration requirements, see the companion migration guide to migrate your applications to Virtual Machines instead: [Migrate WebLogic Server applications to Azure Virtual Machines](migrate-weblogic-to-virtual-machines.md)

[!INCLUDE [inventory-server-capacity-jboss-eap](includes/inventory-server-capacity-jboss-eap.md)]

[!INCLUDE [inventory-all-secrets](includes/inventory-all-secrets.md)]

[!INCLUDE [inventory-all-certificates](includes/inventory-all-certificates.md)]

[!INCLUDE [inventory-jndi-resources](includes/inventory-jndi-resources.md)]

[!INCLUDE [domain-configuration](includes/inspect-your-domain-configuration.md)]

[!INCLUDE [determine-whether-session-replication-is-used-jboss-eap](includes/determine-whether-session-replication-is-used-jboss-eap.md)]

[!INCLUDE [document-datasources](includes/document-datasources.md)]

[!INCLUDE [determine-whether-weblogic-has-been-customized](includes/determine-whether-weblogic-has-been-customized.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use](includes/determine-whether-jms-queues-or-topics-are-in-use.md)]

[!INCLUDE [determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries](includes/determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries.md)]

[!INCLUDE [determine-whether-osgi-bundles-are-used](includes/determine-whether-osgi-bundles-are-used.md)]

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code.md)]

[!INCLUDE [determine-whether-oracle-service-bus-is-in-use](includes/determine-whether-oracle-service-bus-is-in-use.md)]

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/determine-whether-your-application-is-composed-of-multiple-wars.md)]

[!INCLUDE [determine-whether-your-application-is-packaged-as-an-ear](includes/determine-whether-your-application-is-packaged-as-an-ear.md)]

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

### Validate that the supported Java version works correctly

JBoss EAP on Azure App Service supports Java 8 and 11. Therefore, you'll need to validate that your application is able to run correctly using that supported version. This validation is especially important if your current server is using a supported JDK (such as Oracle JDK or IBM OpenJ9).

To obtain your current Java version, sign in to your production server and run the following command:

```bash
java -version
```

### Determine whether your application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or Unix cron jobs, should NOT be used with Azure App Service. Azure App Service will not prevent you from deploying an application containing scheduled tasks internally. However, if your application is scaled out, the same scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

To execute scheduled jobs on Azure, consider using Azure Functions with a Timer Trigger. For more information, see [Timer trigger for Azure Functions](/azure/azure-functions/functions-bindings-timer). You don't need to migrate the job code itself into a function. The function can simply invoke a URL in your application to trigger the job.

> [!NOTE]
> To prevent malicious use, you'll likely need to ensure that the job invocation endpoint requires credentials. In this case, the trigger function will need to provide the credentials.

### Determine whether WebLogic Scripting Tool (WLST) is used

If you currently use WLST to perform the deployment, you will need to assess what it is doing. If WLST is changing any (runtime) parameters of your application as part of the deployment, you will need to make sure those parameters conform to one of the following options:

* They are externalized as app settings.
* They are embedded in your application.
* They are using the JBoss CLI during deployment.

If WLST is doing more than what is mentioned above, you will have some additional work to do during migration.

### Determine whether your application uses WebLogic-specific APIs

If your application uses WebLogic-specific APIs, you will need to refactor your application to NOT use them. For example, if you have used a class mentioned in the [Java API Reference for Oracle WebLogic Server](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/wlapi/index.html?overview-summary.html), you have used a WebLogic-specific API in your application. The [Red Hat Migration Toolkit for Apps](https://marketplace.visualstudio.com/items?itemName=redhat.mta-vscode-extension) can assist with removing and refactoring these dependencies.

### Determine whether your application uses Entity Beans or EJB 2.x-style CMP Beans

If your application uses Entity Beans or EJB 2.x style CMP beans, you will need to refactor your application to NOT use them.

### Determine whether the Java EE Application Client feature is used

If you have client applications that connect to your (server) application using the Java EE Application Client feature, you will need to refactor both your client applications and your (server) application to use HTTP APIs.

### Determine whether a deployment plan was used

If a deployment plan was used to perform the deployment, you'll need to assess what the deployment plan is doing. If the deployment plan is a straight deploy, then you'll be able to deploy your web application without any changes. If the deployment plan is more elaborate, you'll need to determine whether you can use the JBoss CLI to properly configure your application as part of the deployment. If it isn't possible to use the JBoss CLI, you'll need to refactor your application in such a way that a deployment plan is no longer needed.

### Determine whether EJB timers are in use

If your application uses EJB timers, you'll need to validate that the EJB timer code can be triggered by each JBoss EAP instance independently. This validation is needed because when your App Service is scaled our horizontally, each EJB timer will be triggered on its own JBoss EAP instance.

### Validate if and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by WebLogic shared modules or by your application code. You may identify some or all of the following scenarios.

#### Read-only static content

If your application currently serves static content, an alternate location for that static content will be required. You may wish to consider moving [static content to Azure Blob Storage](/azure/storage/blobs/storage-blob-static-website) and [adding Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn#enable-azure-cdn-for-the-storage-account) for lightning-fast downloads globally.

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We have provided [a sample implementation for your use](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, Azure Storage can be [mounted into the App Service file system](/azure/app-service/containers/how-to-serve-content-from-azure-storage#link-storage-to-your-web-app-preview).

### Determine whether JCA connectors are used

If your application uses JCA connectors you'll have to validate the JCA connector can be used on JBoss EAP. If the JCA implementation is tied to WebLogic, you'll have to refactor your application to NOT use the JCA connector. If it can be used, then you'll need to add the JARs to the server classpath and put the necessary configuration files in the correct location in the JBoss EAP server directories for it to be available.

#### Determine whether your application uses a Resource Adapter

If your application needs a Resource Adapter (RA), it needs to be compatible with JBoss EAP. Determine whether the RA works fine on a standalone instance of JBoss EAP by deploying it to the server and properly configuring it. If the RA works properly, you'll need to add the JARs to the server classpath of the App Service instance and put the necessary configuration files in the correct location in the JBoss EAP server directories for it to be available.

### Determine whether JAAS is used

If your application is using JAAS, then you'll need to capture how JAAS is configured. If it's using a database, you can convert it to a JAAS domain on JBoss EAP. If it's a custom implementation, you'll need to validate that it can be used on JBoss EAP.

### Determine whether WebLogic clustering is used

Most likely, you've deployed your application on multiple WebLogic servers to achieve high availability. Azure App Service is capable of scaling, but if you've used the WebLogic Cluster API, you'll need to refactor your code to eliminate the use of that API.

## Migration

[!INCLUDE [java-redhat-migration-toolkit](includes/redhat-migration-toolkit.md)]

### Provision an App Service plan

From the [list of available service plans](https://azure.microsoft.com/pricing/details/app-service/linux/), select the plan whose specifications meet or exceed the specifications of the current production hardware.

> [!NOTE]
> If you plan to run staging/canary deployments or use [deployment slots](/azure/app-service/deploy-staging-slots), the App Service plan must include that additional capacity. We recommend using Premium or higher plans for Java applications.

[Create the App Service plan](/azure/app-service/app-service-plan-manage#create-an-app-service-plan).

### Create and Deploy Web App(s)

You'll need to create a Web App on your App Service Plan for every WAR file deployed to your JBoss EAP server.

> [!NOTE]
> While it's possible to deploy multiple WAR files to a single web app, this is highly undesirable. Deploying multiple WAR files to a single web app prevents each application from scaling according to its own usage demands. It also adds complexity to subsequent deployment pipelines. If multiple applications need to be available on a single URL, consider using a routing solution such as [Azure Application Gateway](/azure/application-gateway/).

#### Maven applications

If your application is built from a Maven POM file, use the Webapp plugin for Maven to create the Web App and deploy your application. For more information, see the [Configure the Maven plugin](/azure/app-service/containers/quickstart-java#configure-the-maven-plugin) section of [Quickstart: Create a Java app on Azure App Service](/azure/app-service/containers/quickstart-java).

#### Non-Maven applications

If you can't use the Maven plugin, you'll need to provision the Web App through other mechanisms, such as:

* [Azure portal](https://portal.azure.com/#create/Microsoft.WebSite)
* [Azure CLI](/cli/azure/webapp#az-webapp-create)
* [Azure PowerShell](/powershell/module/az.websites/new-azwebapp)

After you've created the web app, use one of the available deployment mechanisms to deploy your application. For more information, see[Deploy files to App Service](/azure/app-service/deploy-zip).

### Migrate JVM runtime options

If your application requires specific runtime options, use the most appropriate mechanism to specify them. For more information, see the [Set Java runtime options](/azure/app-service/containers/configure-language-java#set-java-runtime-options) section of [Configure a Java app for Azure App Service](/azure/app-service/containers/configure-language-java).

### Migrate externalized parameters

If you need to use external parameters, you'll need to set them as app settings. For more information, see [Configure app settings](/azure/app-service/configure-common?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings).

### Migrate startup scripts

If the original application used a custom startup script, you'll need to migrate it to a Bash script. For more information, see [Customize application server configuration](/azure/app-service/containers/configure-language-java#customize-application-server-configuration).

### Populate secrets

Use Application Settings to store any secrets specific to your application. If you intend to use the same secret or secrets among multiple applications, or you require fine-grained access policies and audit capabilities, use Azure Key Vault references instead. For more information, see the [Use KeyVault References](/azure/app-service/containers/configure-language-java#use-keyvault-references) section of [Configure a Java app for Azure App Service](/azure/app-service/containers/configure-language-java).

### Configure Custom Domain and SSL

If your application will be visible on a custom domain, you'll need to map your web application to it. For more information, see [Tutorial: Map an existing custom DNS name to Azure App Service](/Azure/app-service/app-service-web-tutorial-custom-domain).

You'll then need to bind the TLS/SSL certificate for that domain to your App Service Web App. For more information, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](/azure/app-service/app-service-web-tutorial-custom-ssl).

### Migrate data sources, libraries, and JNDI resources

To migrate data sources, follow the steps in the [Configure data sources](/azure/app-service/configure-language-java-data-sources) section of [Configure a Java app for Azure App Service](/azure/app-service/containers/configure-language-java).

Migrate any additional server-level classpath dependencies by following the instructions in the [JBoss EAP](/azure/app-service/containers/configure-language-java#jboss-eap-1) section of [Configure a Java app for Azure App Service](/azure/app-service/containers/configure-language-java).

Migrate any additional shared server-level JDNI resources. For more information, see the [JBoss EAP](/azure/app-service/containers/configure-language-java#jboss-eap-1) section of [Configure a Java app for Azure App Service](/azure/app-service/containers/configure-language-java).

### Migrate JCA connectors and JAAS modules

Migrate any JCA connectors and JAAS modules by following the instructions at [Install modules and dependencies](/azure/app-service/containers/configure-language-java#install-modules-and-dependencies).

> [!NOTE]
> If you're following the recommended architecture of one WAR per application, consider migrating server-level classpath libraries and JNDI resources into your application. Doing so will significantly simplify component governance and change management. If you want to deploy more than one WAR per application, you should review one of our companion guides mentioned at the beginning of this guide.

### Migrate scheduled jobs

At a minimum, you should move your scheduled jobs to an Azure VM so they're no longer part of your application. Alternately, you can opt to modernize them into event driven Java using Azure services such as Azure Functions, SQL Database, and Event Hubs.

### Restart and smoke-test

Finally, you'll need to restart your Web App to apply all configuration changes. Upon completion of the restart, verify that your application is running correctly.

## Post-migration

Now that you've migrated your application to Azure App Service, you should verify that it works as you expect. Once you've done that, we have some recommendations for you that can make your application more cloud-native.

[!INCLUDE [recommendations-jboss-eap](includes/recommendations-jboss-eap.md)]

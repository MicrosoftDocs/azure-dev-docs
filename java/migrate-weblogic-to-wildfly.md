---
title: Migrate WebLogic applications to WildFly on Azure App Service
description: This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on Azure App Service using WildFly.
author: mnriem
ms.author: manriem
ms.topic: conceptual
ms.date: 12/12/2019
---

# Migrate WebLogic applications to WildFly on Azure App Service

This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on Azure App Service using WildFly.

Carefully consider the guidance that applies to all WebLogic to Azure migrations as detailed in [the common guidance](migrate-weblogic-common.md).

## Before you start

If any of the pre-migration requirements can't be met, see the companion migration guides:

* Migrate WebLogic applications to Azure containers (forthcoming)
* Migrate WebLogic applications to Azure Virtual Machines (forthcoming)

## Pre-migration

As the list below can seem a bit daunting, we've ordered it with the most common steps at the top of the list.

1. [Validate that the supported Java version works correctly](#validate-that-the-supported-java-version-works-correctly)
1. [Determine whether your application relies on scheduled jobs](#determine-whether-your-application-relies-on-scheduled-jobs)
1. [Determine whether JCA connectors are used](#determine-whether-jca-connectors-are-used)
1. [Determine whether JAAS is used](#determine-whether-jaas-is-used)
1. [Determine whether WebLogic clustering is used](#determine-whether-weblogic-clustering-is-used)
1. [Determine whether your application uses a Resource Adapter](#determine-whether-your-application-uses-a-resource-adapter)

### Validate that the supported Java version works correctly

Using WildFly on Azure App Service requires a specific version of Java. Therefore, you'll need to validate that your application is able to run correctly using that supported version. This validation is especially important if your current server is using a supported JDK (such as Oracle JDK or IBM OpenJ9).

To obtain your current version, sign in to your production server and run

```bash
java -version
```

### Determine whether your application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or cron jobs, can't be used with App Service. App Service will not prevent you from deploying an application containing scheduled tasks internally. However, if your application is scaled out, the same scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

To execute scheduled jobs on Azure, consider using [Azure Functions with a Timer Trigger](/azure/azure-functions/functions-bindings-timer). You don't need to migrate the job code itself into a function. Instead, the function can invoke a URL in your application to trigger the job.

> [!NOTE]
> To prevent malicious use, you'll likely need to ensure that the job invocation endpoint requires credentials. In this case, the trigger function will need to provide the credentials.

### Determine whether WLST is used

If you currently use WebLogic Scripting Tool (WLST) to perform the deployment, you will need to assess what it is doing. If WLST is changing any (runtime) parameters of your application as part of the deployment, you will need to make sure those parameters conform to one of the following options:

1. They are externalized as app settings.
2. They are embedded in your application.
3. They are using the JBoss CLI during deployment.

If WLST is doing more than what is mentioned above, you will have some additional work to do during migration.

### Determine whether your application uses WebLogic specific APIs

If your application uses WebLogic-specific APIs, you will need to refactor your application to NOT use them. For example, if you have used a class mentioned in the [Java API Reference for Oracle WebLogic Server](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/wlapi/index.html?overview-summary.html), you have used a WebLogic-specific API in your application.

### Determine whether your application uses Entity Beans or EJB 2.x-style CMP Beans

If your application uses Entity Beans or EJB 2.x style CMP beans, you will need to refactor your application to NOT use them.

### Determine whether the Java EE Application Client feature is used

If you have client applications that connect to your (server) application using the Java EE Application Client feature, you will need to refactor both your client applications and your (server) application to use HTTP APIs.

### Determine whether a deployment plan was used

If a deployment plan was used to perform the deployment, you'll need to assess what the deployment plan is doing. If the deployment plan is a straight deploy, then you'll be able to deploy your web application without any changes. If the deployment plan is more elaborate, you'll need to determine whether you can use the JBoss CLI to properly configure your application as part of the deployment. If it isn't possible to use the JBoss CLI, you'll need to refactor your application in such a way that a deployment plan is no longer needed.

### Determine whether EJB timers are in use

If your application uses EJB timers, you'll need to validate that the EJB timer code can be triggered by each WildFly instance independently. This validation is needed because, in the App Service deployment scenario, each EJB timer will be triggered on its own WildFly instance.

### Validate if and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by WebLogic shared modules or by your application code. You may identify some or all of the following scenarios.

#### Read-only static content

If your application currently serves static content, an alternate location for that static content will be required. You may wish to consider moving [static content to Azure Blob Storage](/azure/storage/blobs/storage-blob-static-website) and [adding Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn#enable-azure-cdn-for-the-storage-account) for lightning-fast downloads globally.

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We have provided [a sample implementation for your use](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, Azure Storage can be [mounted into the App Service file system](/azure/app-service/containers/how-to-serve-content-from-azure-storage#link-storage-to-your-web-app-preview).

### Determine whether JCA connectors are used

If your application uses JCA connectors you'll have to validate the JCA connector can be used on WildFly. If the JCA implementation is tied to WebLogic, you'll have to refactor your application to NOT use the JCA connector. If it can be used, then you'll need to add the JARs to the server classpath and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

#### Determine whether your application uses a Resource Adapter

If your application needs a Resource Adapter (RA), it needs to be compatible with WildFly. Determine whether the RA works fine on a standalone instance of WildFly by deploying it to the server and properly configuring it. If the RA works properly, you'll need to add the JARs to the server classpath of the App Service instance and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

### Determine whether JAAS is used

If your application is using JAAS, then you'll need to capture how JAAS is configured. If it's using a database, you can convert it to a JAAS domain on WildFly. If it's a custom implementation, you'll need to validate that it can be used on WildFly.

### Determine whether WebLogic clustering is used

Most likely, you've deployed your application on multiple WebLogic servers to achieve high availability. Azure App Service is capable of scaling, but if you've used the WebLogic Cluster API, you'll need to refactor your code to eliminate the use of that API.


## Migration

### Provision an App Service plan

From the [list of available service plans](https://azure.microsoft.com/pricing/details/app-service/linux/), select the plan whose specifications meet or exceed the specifications of the current production hardware.

> [!NOTE]
> If you plan to run staging/canary deployments or use [deployment slots](/azure/app-service/deploy-staging-slots), the App Service plan must include that additional capacity. We recommend using Premium or higher plans for Java applications.

[Create the App Service plan](/azure/app-service/app-service-plan-manage#create-an-app-service-plan).

### Create and Deploy Web App(s)

you'll need to create a Web App on your App Service Plan for every WAR file deployed to your WildFly server.

> [!NOTE]
> While it's possible to deploy multiple WAR files to a single web app, this is highly undesirable. Deploying multiple WAR files to a single web app prevents each application from scaling according to its own usage demands. It also adds complexity to subsequent deployment pipelines. If multiple applications need to be available on a single URL, consider using a routing solution such as [Azure Application Gateway](/azure/application-gateway/).

#### Maven applications

If your application is built from a Maven POM file, [use the Webapp plugin for Maven](/azure/app-service/containers/quickstart-java#configure-the-maven-plugin) to create the Web App and deploy your application.

#### Non-Maven applications

If you can't use the Maven plugin, you'll need to provision the Web App through other mechanisms, such as:

* [Azure portal](https://portal.azure.com/#create/Microsoft.WebSite)
* [Azure CLI](/cli/azure/webapp?view=azure-cli-latest#az-webapp-create)
* [Azure PowerShell](/powershell/module/az.websites/new-azwebapp)

Once the Web App has been created, use one of the [available deployment mechanisms](/azure/app-service/deploy-zip) to deploy your application.

### Migrate JVM runtime options

If your application requires specific runtime options, [use the most appropriate mechanism to specify them](/azure/app-service/containers/configure-language-java#set-java-runtime-options).

### Migrate externalized parameters 

If you need to use external parameters, you'll need to set them as app settings. For more information, see [Configure app settings](/azure/app-service/configure-common?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings).

### Migrate startup scripts 

If the original application used a custom startup script, you'll need to migrate it to a Bash script. For more information, see [Customize application server configuration](/azure/app-service/containers/configure-language-java#customize-application-server-configuration).

### Populate secrets

Use Application Settings to store any secrets specific to your application. If you intend to use the same secret(s) among multiple applications or require fine-grained access policies and audit capabilities, [use Azure Key Vault](/azure/app-service/containers/configure-language-java#use-keyvault-references) instead.

### Configure Custom Domain and SSL

If your application will be visible on a custom domain, you'll need to [map your web application to it](/azure/app-service/app-service-web-tutorial-custom-domain).

you'll then need to [bind the SSL certificate for that domain to your App Service Web App](/azure/app-service/app-service-web-tutorial-custom-ssl).

### Migrate data sources, libraries, and JNDI resources

Follow [these steps to migrate data sources](/azure/app-service/containers/configure-language-java#configure-data-sources).

Migrate any additional server-level classpath dependencies by following the instructions at [Install modules and dependencies](/azure/app-service/containers/configure-language-java#install-modules-and-dependencies).

Migrate any additional [shared server-level JDNI resources](/azure/app-service/containers/configure-language-java#install-modules-and-dependencies).

### Migrate JCA connectors and JAAS modules 

Migrate any JCA connectors and JAAS modules by following the instructions at [Install modules and dependencies](/azure/app-service/containers/configure-language-java#install-modules-and-dependencies).

> [!NOTE]
> If you're following the recommended architecture of one WAR per application, consider migrating server-level classpath libraries and JNDI resources into your application. This will significantly simplify component governance and change management. If you want to deploy more than one WAR per application, you should review one of our companion guides mentioned at the beginning of this guide.

### Migrate scheduled jobs

At a minimum, you should move your scheduled jobs to an Azure VM so they're no longer part of your application. Or you can opt to modernize them into event driven Java using Azure services such as Azure Functions, SQL Database, Event Hubs, and so on.

### Restart and smoke-test

Finally, you'll need to restart your Web App to apply all configuration changes. Upon completion of the restart, verify that your application is running correctly.

## Post-migration

Now that you have your application migrated to Azure App Service you should verify that it works as you expect. Once you've done that, we have some recommendations for you that can make your application more cloud-native.

### Recommendations

1. If you opted to use the */home* directory for file storage, consider [replacing it with Azure Storage](/azure/app-service/containers/how-to-serve-content-from-azure-storage).

1. If you have configuration in the */home* directory that contains connection strings, SSL keys, and other secret information, consider using a combination of [Azure Key Vault](/azure/app-service/app-service-key-vault-references) and/or [parameter injection with application settings](/azure/app-service/configure-common#configure-app-settings) where possible.

1. Consider [using Deployment Slots](/azure/app-service/deploy-staging-slots) for reliable deployments with zero downtime.

1. Design and implement a DevOps strategy. To maintain reliability while increasing your development velocity, consider [automating deployments and testing with Azure Pipelines](/azure/devops/pipelines/ecosystems/java-webapp). If you're using Deployment Slots, you can [automate deployment to a slot](/azure/devops/pipelines/targets/webapp?view=azure-devops&tabs=yaml#deploy-to-a-slot) and the subsequent slot swap.

1. Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a [multi-region deployment architecture](/azure/architecture/reference-architectures/app-service-web-app/multi-region).

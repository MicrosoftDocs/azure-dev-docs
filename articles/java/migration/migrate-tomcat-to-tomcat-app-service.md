---
title: Migrate Tomcat applications to Tomcat on Azure App Service
description: This guide describes what you should be aware of when you want to migrate an existing Tomcat application to run on Azure App Service using Tomcat.
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.date: 1/20/2020
---

# Migrate Tomcat applications to Tomcat on Azure App Service

This guide describes what you should be aware of when you want to migrate an existing Tomcat application to run on Azure App Service using Tomcat 9.0.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

If you can't meet any of these pre-migration requirements, see the following companion migration guides:

* [Migrate Tomcat applications to containers on Azure Kubernetes Service](migrate-tomcat-to-containers-on-azure-kubernetes-service.md)
* Migrate Tomcat Applications to Azure Virtual Machines (guidance planned)

### Switch to a supported platform

App Service offers specific versions of Tomcat on specific versions of Java. To ensure compatibility, migrate your application to one of the supported versions of Tomcat and Java in its current environment before you continue with any of the remaining steps. Be sure to fully test the resulting configuration. Use the latest stable release of your Linux distribution in such tests.

[!INCLUDE [note-obtain-your-current-java-version](includes/note-obtain-your-current-java-version.md)]

To obtain your current Tomcat version, sign in to your production server and run the following command:

```bash
${CATALINA_HOME}/bin/version.sh
```

To obtain the current version used by Azure App Service, download [Tomcat 9](https://tomcat.apache.org/download-90.cgi), depending on which version you plan to use in Azure App Service.

[!INCLUDE [inventory-external-resources](includes/inventory-external-resources.md)]

[!INCLUDE [inventory-secrets](includes/inventory-secrets.md)]

### Inventory certificates

[!INCLUDE [inventory-certificates](includes/inventory-certificates.md)]

[!INCLUDE [inventory-persistence-usage](includes/inventory-persistence-usage.md)]

<!-- App-Service-specific addendum to inventory-persistence-usage -->
#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, you can mount Azure Storage into the App Service file system. For more information, see [Serve content from Azure Storage in App Service on Linux](/azure/app-service/containers/how-to-serve-content-from-azure-storage).

### Identify session persistence mechanism

To identify the session persistence manager in use, inspect the *context.xml* files in your application and Tomcat configuration. Look for the `<Manager>` element, and then note the value of the `className` attribute.

Tomcat's built-in [PersistentManager](https://tomcat.apache.org/tomcat-9.0-doc/config/manager.html) implementations, such as [StandardManager](https://tomcat.apache.org/tomcat-9.0-doc/config/manager.html#Standard_Implementation) or [FileStore](https://tomcat.apache.org/tomcat-9.0-doc/config/manager.html#Nested_Components) aren't designed for use with a distributed, scaled platform such as App Service. Because App Service may load balance among several instances and transparently restart any instance at any time, persisting mutable state to a file system isn't recommended.

If session persistence is required, you'll need to use an alternate `PersistentManager` implementation that will write to an external data store, such as Pivotal Session Manager with Redis Cache. For more information, see [Use Redis as a session cache with Tomcat](/azure/app-service/containers/configure-language-java#use-redis-as-a-session-cache-with-tomcat).

### Special cases

Certain production scenarios may require additional changes or impose additional limitations. While such scenarios can be infrequent, it's important to ensure that they're either inapplicable to your application or correctly resolved.

#### Determine whether application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or cron jobs, can't be used with App Service. App Service won't prevent you from deploying an application containing scheduled tasks internally. However, if your application is scaled out, the same scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

Inventory any scheduled jobs, inside or outside the application server.

#### Determine whether your application contains OS-specific code

[!INCLUDE [determine-whether-your-application-contains-os-specific-code-no-title](includes/determine-whether-your-application-contains-os-specific-code-no-title.md)]

#### Determine whether Tomcat clustering is used

[Tomcat clustering](https://tomcat.apache.org/tomcat-9.0-doc/cluster-howto.html) isn't supported on Azure App Service. Instead, you can configure and manage scaling and load balancing through Azure App Service without Tomcat-specific functionality. You can persist session state to an alternate location to make it available across replicas. For more information, see [Identify session persistence mechanism](#identify-session-persistence-mechanism).

To determine whether your application uses clustering, look for the `<Cluster>` element inside the `<Host>` or `<Engine>` elements in the *server.xml* file.

#### Identify all outside processes/daemons running on the production server(s)

You'll need to migrate elsewhere or eliminate any processes running outside of Application Server, such as monitoring daemons.

#### Determine whether non-HTTP connectors are used

App Service supports only a single HTTP connector. If your application requires additional connectors, such as the AJP connector, don't use App Service.

To identify HTTP connectors used by your application, look for `<Connector>` elements inside the *server.xml* file in your Tomcat configuration.

#### Determine whether MemoryRealm is used

[MemoryRealm](https://tomcat.apache.org/tomcat-9.0-doc/api/org/apache/catalina/realm/MemoryRealm.html) requires a persisted XML file. On Azure AppService, you'll need to upload this file to the */home* directory or one of its subdirectories, or to mounted storage. You'll then need to modify the `pathName` parameter accordingly.

To determine whether `MemoryRealm` is currently used, inspect your *server.xml* and *context.xml* files and search for `<Realm>` elements where the `className` attribute is set to `org.apache.catalina.realm.MemoryRealm`.

#### Determine whether SSL session tracking is used

App Service performs session offloading outside of the Tomcat runtime, so you can't use [SSL session tracking](https://tomcat.apache.org/tomcat-9.0-doc/servletapi/javax/servlet/SessionTrackingMode.html#SSL). Use a different session tracking mode instead (`COOKIE` or `URL`). If you need SSL session tracking, don't use App Service.

#### Determine whether AccessLogValve is used

If you use [AccessLogValve](https://tomcat.apache.org/tomcat-9.0-doc/api/org/apache/catalina/valves/AccessLogValve.html), you should set the `directory` parameter to `/home/LogFiles` or one of its subdirectories.

## Migration

### Parameterize the configuration

In the pre-migration steps, you likely identified some secrets and external dependencies, such as datasources, in *server.xml* and *context.xml* files. For each item you identified, replace any username, password, connection string, or URL with an environment variable.

For example, suppose the *context.xml* file contains the following element:

```xml
<Resource
    name="jdbc/dbconnection"
    type="javax.sql.DataSource"
    url="jdbc:postgresql://postgresdb.contoso.com/wickedsecret?ssl=true"
    driverClassName="org.postgresql.Driver"
    username="postgres"
    password="t00secure2gue$$"
/>
```

In this case, you could change it as shown in the following example:

```xml
<Resource
    name="jdbc/dbconnection"
    type="javax.sql.DataSource"
    url="${postgresdb.connectionString}"
    driverClassName="org.postgresql.Driver"
    username="${postgresdb.username}"
    password="${postgresdb.password}"
/>
```

### Provision an App Service plan

From the list of available service plans at [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/), select the plan whose specifications meet or exceed those of the current production hardware.

> [!NOTE]
> If you plan to run staging/canary deployments or use deployment slots, the App Service plan must include that additional capacity. We recommend using Premium or higher plans for Java applications. For more information, see [Set up staging environments in Azure App Service](/azure/app-service/deploy-staging-slots).

Then, create the App Service plan. For more information, see [Manage an App Service plan in Azure](/azure/app-service/app-service-plan-manage).

### Create and deploy Web App(s)

You'll need to create a Web App on your App Service Plan (choosing a version of Tomcat as the runtime stack) for every WAR file deployed to your Tomcat server.

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

### Populate secrets

Use Application Settings to store any secrets specific to your application. If you intend to use the same secret(s) among multiple applications or require fine-grained access policies and audit capabilities, [use Azure Key Vault](/azure/app-service/containers/configure-language-java#use-keyvault-references) instead.

[!INCLUDE [configure-custom-domain-and-ssl](includes/configure-custom-domain-and-ssl.md)]

[!INCLUDE [import-backend-certificates](includes/import-backend-certificates.md)]

### Migrate data sources, libraries, and JNDI resources

For data source configuration steps, see the [Data sources](/azure/app-service/containers/configure-language-java#data-sources) section of [Configure a Linux Java app for Azure App Service](/azure/app-service/containers/configure-language-java).

[!INCLUDE[Tomcat datasource additional instructions](includes/tomcat-datasource-additional-instructions.md)]

Migrate any additional server-level classpath dependencies by following [the same steps as for data source JAR files](/azure/app-service/containers/configure-language-java#finalize-configuration).

Migrate any additional [Shared server-level JDNI resources](/azure/app-service/containers/configure-language-java#shared-server-level-resources).

> [!NOTE]
> If you're following the recommended architecture of one WAR per webapp, consider migrating server-level classpath libraries and JNDI resources into your application. This will significantly simplify component governance and change management.

### Migrate remaining configuration

Upon completing the preceding section, you should have your customizable server configuration in */home/tomcat/conf*.

Complete the migration by copying any additional configuration (such as [realms](https://tomcat.apache.org/tomcat-9.0-doc/config/realm.html) and [JASPIC](https://tomcat.apache.org/tomcat-9.0-doc/config/jaspic.html))

[!INCLUDE [migrate-scheduled-jobs](includes/migrate-scheduled-jobs.md)]

### Restart and smoke-test

Finally, you'll need to restart your Web App to apply all configuration changes. Upon completion of the restart, verify that your application is running correctly.

## Post-migration

Now that you have your application migrated to Azure App Service you should verify that it works as you expect. Once you've done that we have some recommendations for you that can make your application more Cloud native.

### Recommendations

* If you opted to use the */home* directory for file storage, consider [replacing it with Azure Storage](/azure/app-service/containers/how-to-serve-content-from-azure-storage).

* If you have configuration in the */home* directory that contains connection strings, SSL keys, and other secret information, consider using a combination of [Azure Key Vault](/azure/app-service/app-service-key-vault-references) and/or [parameter injection with application settings](/azure/app-service/configure-common#configure-app-settings) where possible.

* Consider [using Deployment Slots](/azure/app-service/deploy-staging-slots) for reliable deployments with zero downtime.

* Design and implement a DevOps strategy. To maintain reliability while increasing your development velocity, consider [automating deployments and testing with Azure Pipelines](/azure/devops/pipelines/ecosystems/java-webapp). When you use Deployment Slots, you can [automate deployment to a slot](/azure/devops/pipelines/targets/webapp?view=azure-devops&tabs=yaml#deploy-to-a-slot) followed by the slot swap.

* Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a [multi-region deployment architecture](/azure/architecture/reference-architectures/app-service-web-app/multi-region).

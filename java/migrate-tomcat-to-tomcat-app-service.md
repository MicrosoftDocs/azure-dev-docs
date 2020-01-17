---
title: Migrate Tomcat applications to Tomcat on Azure App Service
description: This guide describes what you should be aware of when you want to migrate an existing Tomcat application to run on Azure App Service using Tomcat.
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.date: 12/12/2019
---

# Migrate Tomcat applications to Tomcat on Azure App Service

This guide describes what you should be aware of when you want to migrate an existing Tomcat application to run on Azure App Service using Tomcat 8.5 or 9.0.

## Before you start

If any of the pre-migration requirements can't be met, see the following companion migration guides:

* [Migrate Tomcat applications to containers on Azure Kubernetes Service](migrate-tomcat-to-containers-on-azure-kubernetes-service.md)
* [Migrate Tomcat Applications to Azure Virtual Machines](migrate-tomcat-to-azure-vms.md)

## Pre-migration steps

* [Switch to a supported platform](#switch-to-a-supported-platform)
* [Inventory external resources](#inventory-external-resources)
* [Inventory secrets](#inventory-secrets)
* [Inventory persistence usage](#inventory-persistence-usage)
* [Special cases](#special-cases)

### Switch to a supported platform

App Service offers specific versions of Tomcat on Specific versions of Java. To ensure compatibility, migrate your application to one of the supported versions of Tomcat and Java in its current environment prior to proceeding with any of the remaining steps. Be sure to fully test the resulting configuration. Use [Red Hat Enterprise Linux 8](https://portal.azure.com/#create/RedHat.RedHatEnterpriseLinux80-ARM) as the operating system in such tests.

#### Java

> [!NOTE]
> This validation is especially important if your current server is not using a supported JDK (such as Oracle JDK or IBM OpenJ9).

To obtain your current Java version, sign in to your production server and run the following command:

```bash
java -version
```

To obtain the current version used by Azure App Service, download [Zulu 8](https://www.azul.com/downloads/zulu-community/?&version=java-8-lts&os=&os=linux&architecture=x86-64-bit&package=jdk) if you intend to use the Java 8 runtime or [Zulu 11](https://www.azul.com/downloads/zulu-community/?&version=java-11-lts&os=&os=linux&architecture=x86-64-bit&package=jdk) if you intend to use the Java 11 runtime.

#### Tomcat

To determine your current Tomcat version, sign in to your production server and run the following command:

```bash
${CATALINA_HOME}/bin/version.sh
```

To obtain the current version used by Azure App Service, download [Tomcat 8.5](https://tomcat.apache.org/download-80.cgi#8.5.50) or [Tomcat 9](https://tomcat.apache.org/download-90.cgi), depending on which version you plan to use in Azure App Service.

### Inventory external resources

External resources, such as data sources, JMS message brokers, and others are injected via Java Naming and Directory Interface (JNDI). Some such resources may require migration or reconfiguration.

#### Inside your application

Inspect the *META-INF/context.xml* file. Look for `<Resource>` elements inside the `<Context>` element.

#### On the application server(s)

Inspect the *$CATALINA_BASE/conf/context.xml* and *$CATALINA_BASE/conf/server.xml* files as well as the *.xml* files found in *$CATALINA_BASE/conf/[engine-name]/[host-name]* directories.

In *context.xml* files, JNDI resources will be described by the `<Resource>` elements inside the top-level `<Context>` element.

In *server.xml* files, JNDI resources will be described by the `<Resource>` elements inside the `<GlobalNamingResources>` element.

#### Datasources

Datasources are JNDI resources with the `type` attribute set to `javax.sql.DataSource`. For each datasource, document the following:

* What is the datasource name?
* What is the connection pool configuration?
* Where can I find the JDBC driver JAR file?

#### All other external resources

It isn't feasible to document every possible external dependency in this guide. it's your team's responsibility to verify that every external dependency of your application can be satisfied after an App Service migration.

### Inventory secrets

#### Passwords and secure strings

Check all properties and configuration files on the production server(s) for any secret strings and passwords. Be sure to check `server.xml` and `context.xml` in $CATALINA_BASE/conf. Configuration files containing passwords or credentials may also be found inside your application. These may include `META-INF/context.xml`, and, for Spring Boot applications, `application.properties` or `application.yml` files.

#### Certificates

Document all the certificates used for public SSL endpoints. You can view all certificates on the production server(s) by running

```bash
keytool -list -v -keystore <path to keystore>
```

### Inventory Persistence Usage

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by Tomcat modules or by your application code. You may identify some or all of the following scenarios.

#### Read-only static content

If your application currently serves static content (for example, via an Apache integration), an alternate location for that static content will be required. You may wish to consider moving [static content to Azure Blob Storage](/azure/storage/blobs/storage-blob-static-website) and [adding Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn#enable-azure-cdn-for-the-storage-account) for lightning-fast downloads globally.

#### Dynamically-published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We've provided [a sample implementation for your use](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, Azure Storage can be [mounted into the App Service file system](/azure/app-service/containers/how-to-serve-content-from-azure-storage#link-storage-to-your-web-app-preview).

### Identify session persistence mechanism

To identify the session persistence manager in use, inspect the *context.xml* files in your application and Tomcat configuration. Look for the `<Manager>` element, and then note the value of the `className` attribute.

Tomcat's built-in [PersistentManager](https://tomcat.apache.org/tomcat-8.5-doc/config/manager.html) implementations, such as  [StandardManager](https://tomcat.apache.org/tomcat-8.5-doc/config/manager.html#Standard_Implementation) or  [FileBasedStore](https://tomcat.apache.org/tomcat-8.5-doc/config/manager.html#Nested_Components) aren't designed to be used with a distributed, scaled platform such as App Service. Because App Service may load balance among several instances and transparently restart any instance at any time, persisting mutable state to a file system isn't recommended.

If session persistence is required, you'll need to use an alternate `PersistentManager` implementation that will write to an external data store, such as [Pivotal Session Manager with Redis Cache](/azure/app-service/containers/configure-language-java#use-redis-as-a-session-cache-with-tomcat).

### Special Cases

Certain production scenarios may require additional changes or impose additional limitations. While such scenarios can be infrequent, it is important to ensure that they are either inapplicable to your application or correctly resolved.

#### Determine whether application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or cron jobs, can't be used with App Service. App Service will not prevent you from deploying an application containing scheduled tasks internally. However, if your application is scaled out, the same scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

Inventory any scheduled jobs, inside or outside the application server.

#### Determine whether your application contains OS-specific code

If your application contains any code that is accommodating the OS the application is running on, then your application needs to be refactored to NOT rely on the underlying OS. For instance, any uses of `/` or `\` in file system paths may need to be replaced with [`File.Separator`](https://docs.oracle.com/javase/8/docs/api/java/io/File.html#separator) or [`Path.get`](https://docs.oracle.com/javase/8/docs/api/java/nio/file/Paths.html#get-java.lang.String-java.lang.String...-).

#### Determine whether Tomcat clustering is used

[Tomcat clustering](https://tomcat.apache.org/tomcat-8.5-doc/cluster-howto.html) isn't supported on Azure App Service. Instead, scaling and load balancing can be configured and managed through Azure App Service without Tomcat-specific functionality. Session state can be [persisted to an alternate location](#identify-session-persistence-mechanism) to be available across replicas.

To determine whether your application uses clustering, look for the `<Cluster>` element inside the `<Host>` or `<Engine>` elements in the *server.xml* file.

#### Identify all outside processes/daemons running on the production server(s)

Processes running outside of Application Server, such as monitoring daemons, will need to be migrated elsewhere or eliminated.

<!-- Tomcat-specific:-->

#### Determine whether non-HTTP connectors are used

App Service supports only a single HTTP connector. If your application requires additional connectors, such as the AJP connector, don't use App Service.

To identify HTTP connectors used by your application, look for `<Connector>` elements inside the *server.xml* file in your Tomcat configuration.

#### Determine whether MemoryRealm is used

[MemoryRealm](https://tomcat.apache.org/tomcat-8.5-doc/api/org/apache/catalina/realm/MemoryRealm.html) requires a persisted XML file. On Azure AppService, this file will need to be uploaded to the */home* directory or a subdirectory thereof or to mounted storage. The `pathName` parameter will have to be modified accordingly.

To determine whether `MemoryRealm` is currently used, inspect your *server.xml* and *context.xml* files and search for `<Realm>` elements where the `className` attribute is set to `org.apache.catalina.realm.MemoryRealm`.

#### Determine whether SSL session tracking is used

App Service performs session offloading outside of the Tomcat runtime. [SSL session tracking](https://tomcat.apache.org/tomcat-8.5-doc/servletapi/javax/servlet/SessionTrackingMode.html#SSL) therefore can't be used. Use a different session tracking mode instead (`COOKIE` or `URL`). If SSL session tracking is required, don't use App Service.

#### Determine whether AccessLogValve is used

If [AccessLogValve](https://tomcat.apache.org/tomcat-8.5-doc/api/org/apache/catalina/valves/AccessLogValve.html) is used, the `directory` parameter should be set to `/home/LogFiles` or a subdirectory thereof.

## Migration

### Parametrize the Configuration

In the pre-migration you'll likely have identified secrets and external dependencies, such as datasources, in *server.xml* and *context.xml* files. For each item thus identified, replace any username, password, connection string or URL with an environment variable.

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

From the [list of available service plans](https://azure.microsoft.com/pricing/details/app-service/linux/), select the plan whose specifications meet or exceed those of the current production hardware.

> [!NOTE]
> If you plan to run staging/canary deployments or use [deployment slots](/azure/app-service/deploy-staging-slots), the App Service plan must include that additional capacity. We recommend using Premium or higher plans for Java applications.

[Create the App Service plan](/azure/app-service/app-service-plan-manage#create-an-app-service-plan).

### Create and Deploy Web App(s)

you'll need to create a Web App on your App Service Plan for every WAR file deployed to your Tomcat server.

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

### Configure Custom Domain and SSL

If your application will be visible on a custom domain, you'll need to [map your web application to it](/azure/app-service/app-service-web-tutorial-custom-domain).

you'll then need to [bind the SSL certificate for that domain to your App Service Web App](/azure/app-service/app-service-web-tutorial-custom-ssl).

### Migrate data sources, libraries, and JNDI resources

Follow [these steps to migrate data sources](/azure/app-service/containers/configure-language-java#tomcat).

Migrate any additional server-level classpath dependencies by following [the same steps as for data source jar files](/azure/app-service/containers/configure-language-java#finalize-configuration).

Migrate any additional [Shared server-level JDNI resources](/azure/app-service/containers/configure-language-java#shared-server-level-resources).

> [!NOTE]
> If you're following the recommended architecture of one WAR per webapp, consider migrating server-level classpath libraries and JNDI resources into your application. This will significantly simplify component governance and change management.

### Migrate remaining configuration

Upon completing the preceding section, you should have your customizable server configuration in */home/tomcat/conf*.

Complete the migration by copying any additional configuration (such as [realms](https://tomcat.apache.org/tomcat-8.5-doc/config/realm.html), [JASPIC](https://tomcat.apache.org/tomcat-8.5-doc/config/jaspic.html))

### Migrate scheduled jobs

To execute scheduled jobs on Azure, consider using [Azure Functions with a Timer Trigger](/azure/azure-functions/functions-bindings-timer). You don't need to migrate the job code itself into a function. The function can simply invoke a URL in your application to trigger the job.

Alternatively, you can create a [Logic app](/azure/logic-apps/logic-apps-overview) with a [Recurrence trigger](/azure/logic-apps/tutorial-build-schedule-recurring-logic-app-workflow#add-the-recurrence-trigger) to invoke the URL without writing any code outside your application.

> [!NOTE]
> To prevent malicious use, you'll likely need to ensure that the job invocation endpoint requires credentials. In this case, the trigger function will need to provide the credentials.

### Restart and smoke-test

Finally, you'll need to restart your Web App to apply all configuration changes. Upon completion of the restart, verify that your application is running correctly.

## Post-migration steps

Now that you have your application migrated to Azure App Service you should verify that it works as you expect. Once you've done that we have some recommendations for you that can make your application more Cloud native.

### Recommendations

1. If you opted to use the */home* directory for file storage, consider [replacing it with Azure Storage](/azure/app-service/containers/how-to-serve-content-from-azure-storage).

1. If you have configuration in the */home* directory which contains connection strings, SSL keys, and other secret information, consider using a combination of [Azure Key Vault](/azure/app-service/app-service-key-vault-references) and/or [parameter injection with application settings](/azure/app-service/configure-common#configure-app-settings) where possible.

1. Consider [using Deployment Slots](/azure/app-service/deploy-staging-slots) for reliable deployments with zero downtime.

1. Design and implement a DevOps strategy. In order to maintain reliability while increasing your development velocity, consider [automating deployments and testing with Azure Pipelines](/azure/devops/pipelines/ecosystems/java-webapp). If using Deployment Slots, you can [automate deployment to a slot](/azure/devops/pipelines/targets/webapp?view=azure-devops&tabs=yaml#deploy-to-a-slot) and the subsequent slot swap.

1. Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a [multi-region deployment architecture](/azure/architecture/reference-architectures/app-service-web-app/multi-region).

---
title: Migrate Java SE applications to Java SE on Azure App Service
description: This guide describes what you should be aware of when you want to migrate an existing Spring Boot or other standalone web application to Azure App Service using Java SE.
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.date: 01/22/2019
---

# Migrate executable JAR web applications to Java SE on Azure App Service

This guide describes what you should be aware of when you want to migrate an existing Spring Boot or other embedded-server web application to Azure App Service using Java SE.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

If you can't meet any of these pre-migration requirements, see the following companion migration guides:

* Migrate executable JAR applications to containers on Azure Kubernetes Service (guidance planned)
* Migrate executable JAR Applications to Azure Virtual Machines (guidance planned)

### Switch to a supported platform

App Service offers specific versions of Java SE. To ensure compatibility, migrate your application to one of the supported versions of its current environment before you continue with any of the remaining steps. Be sure to fully test the resulting configuration. Use the latest stable release of your Linux distribution in such tests.

[!INCLUDE [note-obtain-your-current-java-version-app-service](includes/note-obtain-your-current-java-version-app-service.md)]

### Inventory external resources

Identify external resources, such as data sources, JMS message brokers, and URLs of other services. In Spring Boot applications, you can typically find the configuration for such resources in *src/main/directory* in a file typically called *application.properties* or *application.yml*. Additionally, check the production deployment's environment variables for any pertinent configuration settings.

[!INCLUDE [inventory-databases-spring-boot](includes/inventory-databases-spring-boot.md)]

#### JMS Message Brokers

[!INCLUDE [identify-jms-brokers-in-spring](includes/identify-jms-brokers-in-spring.md)]

Once you've identified the broker or brokers in use, find the corresponding settings, which are typically in the *application.properties* and *application.yml* files for Spring Boot.

[!INCLUDE [jms-broker-settings-examples-in-spring](includes/jms-broker-settings-examples-in-spring.md)]

#### All other external resources

It isn't feasible to document every possible external dependency in this guide. It's your team's responsibility to verify that every external dependency of your application can be satisfied after an App Service migration.

### Inventory secrets

#### Passwords and secure strings

Check all properties and configuration files and all environment variables on the production deployment(s) for any secret strings and passwords. In a Spring Boot application, such strings will likely be found in *application.properties* or *application.yml*.

#### Inventory certificates

[!INCLUDE [inventory-certificates](includes/inventory-certificates.md)]

[!INCLUDE [inventory-persistence-usage](includes/inventory-persistence-usage.md)]

### Special Cases

Certain production scenarios may require additional changes or impose additional limitations. While such scenarios can be infrequent, it's important to ensure that they're either inapplicable to your application or correctly resolved.

#### Determine whether application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or cron jobs, can't be used with App Service. App Service won't prevent you from deploying an application containing scheduled tasks internally. However, if your application is scaled out, the same scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

Inventory any scheduled jobs, inside or outside the application process.

#### Determine whether your application contains OS-specific code

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code-no-title.md)]

#### Identify all outside processes/daemons running on the production server(s)

Processes running outside of Application Server, such as monitoring daemons, will need to be migrated elsewhere or eliminated.

#### Identify handling of non-HTTP requests or multiple ports

App Service supports only a single HTTP endpoint on a single port. If your application listens on multiple ports or accepts requests using protocols other than HTTP, don't use Azure App Service.

## Migration

### Parameterize the configuration

Ensure that all external resource coordinates (such as database connection strings) and other customizable settings can be read from environment variables. If you're migrating a Spring Boot Application, all configuration settings should already be externalizable. For more information, see [Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config) in the Spring Boot documentation.

Here's an example that references a `SERVICEBUS_CONNECTION_STRING` environment variable from an *application.properties* file:

```properties
spring.jms.servicebus.connection-string=${SERVICEBUS_CONNECTION_STRING}
spring.jms.servicebus.topic-client-id=contoso1
spring.jms.servicebus.idle-timeout=10000
```

### Provision an App Service plan

From the [list of available service plans](https://azure.microsoft.com/pricing/details/app-service/linux/), select the plan whose specifications meet or exceed those of the current production hardware.

> [!NOTE]
> If you plan to run staging/canary deployments or use [deployment slots](/azure/app-service/deploy-staging-slots), the App Service plan must include that additional capacity. We recommend using Premium or higher plans for Java applications.

[Create the App Service plan](/azure/app-service/app-service-plan-manage#create-an-app-service-plan).

### Create and Deploy Web App(s)

You'll need to create a Web App on your App Service Plan (choosing "Java SE" as the runtime stack) for every executable JAR file you intend to run.

#### Maven applications

If your application is built from a Maven POM file, [use the Webapp plugin for Maven](/azure/developer/java/spring-framework/deploy-spring-boot-java-app-with-maven-plugin#configure-maven-plugin-for-azure-app-service) to create the Web App and deploy your application.

#### Non-Maven applications

If you can't use the Maven plugin, you'll need to provision the Web App through other mechanisms, such as:

* [Azure portal](https://portal.azure.com/#create/Microsoft.WebSite)
* [Azure CLI](/cli/azure/webapp?view=azure-cli-latest#az-webapp-create)
* [Azure PowerShell](/powershell/module/az.websites/new-azwebapp)

Once the Web App has been created, use one of the [available deployment mechanisms](/azure/app-service/deploy-ftp) to deploy your application. If possible, your application should be uploaded to */home/site/wwwroot/app.jar*. If you don't wish to rename your JAR to *app.jar*, you can upload a shell script with the command to run your JAR. Then paste the full path to this script in the [Startup File](/azure/app-service/containers/app-service-linux-faq#built-in-images) textbox in the Configuration section of the portal. The startup script doesn't run from the directory into which it's placed. Therefore, always use absolute paths to reference files in your startup script (for example: `java -jar /home/myapp/myapp.jar`).

### Migrate JVM runtime options

If your application requires specific runtime options, [use the most appropriate mechanism to specify them](/azure/app-service/containers/configure-language-java#set-java-runtime-options).

[!INCLUDE [configure-custom-domain-and-ssl](includes/configure-custom-domain-and-ssl.md)]

[!INCLUDE [import-backend-certificates](includes/import-backend-certificates.md)]

### Migrate external resource coordinates and other settings

Follow [these steps to migrate connection strings and other settings](/azure/app-service/containers/configure-language-java#spring-boot-1).

> [!NOTE]
> For any Spring Boot application settings parameterized with variables in the [Parameterize the configuration](#parameterize-the-configuration) section, those environment variables must be defined in the application configuration. Any Spring Boot application settings not explicitly parameterized with environment variables can still be overridden by them via Application Configuration. For example:

  ```properties
  spring.jms.servicebus.connection-string=${CUSTOMCONNSTR_SERVICE_BUS}
  spring.jms.servicebus.topic-client-id=contoso1
  spring.jms.servicebus.idle-timeout=1800000
  ```

![App Service Application Configuration](media/migrate-java-se-to-java-se-app-service/app-service-parameterized-spring-boot-app-settings.png)

[!INCLUDE [migrate-scheduled-jobs](includes/migrate-scheduled-jobs.md)]

### Restart and smoke-test

Finally, you'll need to restart your Web App to apply all configuration changes. Upon completion of the restart, verify that your application is running correctly.

## Post-migration

Now that you have your application migrated to Azure App Service you should verify that it works as you expect. Once you've done that we have some recommendations for you that can make your application more cloud-native.

### Recommendations

* If you opted to use the */home* directory for file storage, consider [replacing it with Azure Storage](/azure/app-service/containers/how-to-serve-content-from-azure-storage).

* If you have configuration in the */home* directory that contains connection strings, SSL keys, and other secret information, consider using [Azure Key Vault](/azure/app-service/app-service-key-vault-references) and/or [parameter injection with application settings](/azure/app-service/configure-common#configure-app-settings) where possible.

* Consider [using Deployment Slots](/azure/app-service/deploy-staging-slots) for reliable deployments with zero downtime.

* Design and implement a DevOps strategy. To maintain reliability while increasing your development velocity, consider [automating deployments and testing with Azure Pipelines](/azure/devops/pipelines/ecosystems/java-webapp). When you use Deployment Slots, you can [automate deployment to a slot](/azure/devops/pipelines/targets/webapp?view=azure-devops&tabs=yaml#deploy-to-a-slot) followed by the slot swap.

* Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a [multi-region deployment architecture](/azure/architecture/reference-architectures/app-service-web-app/multi-region).

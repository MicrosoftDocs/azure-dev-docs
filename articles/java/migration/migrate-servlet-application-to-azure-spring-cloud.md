---
title: Migrate servlet applications to Azure Spring Cloud
description: This guide describes what you should be aware of when you want to migrate an existing Tomcat application to Azure Spring Cloud
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.date: 6/16/2020
---

# Migrate Tomcat Application to Azure Spring Cloud

## Pre-Migration

### Switch to a supported platform

Azure Spring Cloud offers specific versions of Java SE. To ensure compatibility, migrate your application to one of the supported versions of its current environment before you continue with any of the remaining steps. Be sure to fully test the resulting configuration. Use the latest stable release of your Linux distribution in such tests.

[!INCLUDE [note-obtain-your-current-java-version](includes/note-obtain-your-current-java-version.md)]

[!INCLUDE [determine-whether-and-how-the-file-system-is-used](includes/determine-whether-and-how-the-file-system-is-used.md)]

### Identify the Application Build/Dependency System

Identify what tool(s) are used to build/package the application, including downloading all the dependencies.

[!INCLUDE [inventory-external-resources](includes/inventory-external-resources.md)]

[!INCLUDE [inventory-secrets](includes/inventory-secrets.md)]

[!INCLUDE [inventory-certificates](includes/inventory-certificates.md)]

### Determine whether your application contains OS-specific code

[!INCLUDE [determine-whether-your-application-contains-os-specific-code-no-title](includes/determine-whether-your-application-contains-os-specific-code-no-title.md)]

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

### Special cases

Certain production scenarios may require additional changes or impose additional limitations. While such scenarios can be infrequent, it's important to ensure that they're either inapplicable to your application or correctly resolved.

#### Determine if the application uses filters

Inspect the application's `web.xml` for any [configured filters](https://tomcat.apache.org/tomcat-9.0-doc/config/filter.html#Expires_Filter/Basic_configuration_sample).

#### Determine whether application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or cron jobs, can't be used with App Service. App Service won't prevent you from deploying an application containing scheduled tasks internally. However, if your application is scaled out, the same scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

Inventory any scheduled jobs, inside or outside the application server.

#### Determine whether non-HTTP connectors are used

Azure Spring Cloud supports only a HTTP connections on a single, non-customizable HTTP ports. If your application requires additional ports or additional protocols, do not use Azure Spring Cloud.

To identify HTTP connectors used by your application, look for `<Connector>` elements inside the *server.xml* file in your Tomcat configuration.

#### Determine whether SSL session tracking is used

On Azure Spring Cloud, the SSL session will terminate prior to reaching your application code, so you can't use [SSL session tracking](https://tomcat.apache.org/tomcat-9.0-doc/servletapi/javax/servlet/SessionTrackingMode.html#SSL). You will need to switch to using [Spring Session](https://docs.spring.io/spring-session/docs/current/reference/html5/index.html) instead.

#### Determine whether Tomcat realms are used

On Azure Spring Cloud, Spring Security must be used in place of Tomcat realms. Inspect your `server.xml` file to inventory any [configured realms](https://tomcat.apache.org/tomcat-9.0-doc/realm-howto.html#Configuring_a_Realm).

#### Determine whether servlet filters are used

Inspect the `web.xml` in the application for any `<filter>` elements. See the [Tomcat filter documentation](https://tomcat.apache.org/tomcat-9.0-doc/config/filter.html) for a list of available filters.

## Migration

### Update to Tomcat 9

If your current application is running on version of Tomcat prior to 9, migrate to Tomcat 9 and verify the application is fully functional. Consult the [Tomcat 9 Migration Guide](http://tomcat.apache.org/migration-9.html) for more information.

### Switch to Maven or Gradle

Spring Boot and Spring Cloud require Maven or Gradle for building and/or dependency management. If your application uses another build and/or dependency management system, switch to [the current version of Maven](https://maven.apache.org/download.cgi) before proceeding. While Gradle is also supported, we will use Maven throughout the steps of this guide. Should you decide to use Gradle, adapt the instructions accordingly.

[Create a POM file](https://maven.apache.org/pom.html) for your application, and make sure the application builds and runs with full functionality before proceeding.

### Migrate to Spring Boot

1. If your application relies on libraries injected via JNDI resources (such as JDBC drivers), add these libraries as dependencies into your POM file. Remove the libraries from the Tomcat server (typically from the `tomcat/lib` directory), and verify that the application runs with full functionality before proceeding.

1. Add the Spring Boot parent POM your POM file as [shown here](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#getting-started-first-application-pom).

1. Add the Spring Boot Tomcat starter as a dependency to your POM file:

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    ```

1. Replace Tomcat data sources with Spring Beans. See [Spring Data JDBC documentation](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#reference) for more information. Replace any [explicit context lookups](http://tomcat.apache.org/tomcat-9.0-doc/jndi-resources-howto.html#Using_resources) with [Spring Bean injections](https://docs.spring.io/spring-boot/docs/current/reference/html/using-spring-boot.html#using-boot-spring-beans-and-dependency-injection).

1. Replace [servlet implementations](https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServletRequest.html) with Spring [Rest controllers](https://spring.io/guides/gs/rest-service/#_create_a_resource_controller). If your application uses a non-Spring MVC framework, replace it with Spring MVC.

1. Recreate all other JNDI dependencies with [Spring beans](https://docs.spring.io/spring-boot/docs/current/reference/html/using-spring-boot.html#using-boot-spring-beans-and-dependency-injection). Favor using Spring-idiomatic mechanisms, such as using [Spring JMS](https://spring.io/guides/gs/messaging-jms/) for messaging.

1. Replace Tomcat Realms with [Spring Security](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#servlet-filters-review). Consider using Azure Active Directory for authorization management via the [Spring Boot Starter for Active Directory](/azure/developer/java/spring-framework/spring-boot-starters-for-azure#azure-active-directory).

1. Recreate Servlet filters configured in `web.xml` with [Spring beans](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto-add-a-servlet-filter-or-listener-as-spring-bean) or [classpath scanning](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto-add-a-servlet-filter-or-listener-using-scanning).

Verify that the resulting application runs with full functionality before proceeding.

### Migrate to Azure Spring Cloud

Follow the [Spring Boot to Spring Cloud Migration Guide](migrate-spring-boot-to-azure-spring-cloud.md#migration) to migrate the resulting Spring Boot application to Azure Spring Cloud.

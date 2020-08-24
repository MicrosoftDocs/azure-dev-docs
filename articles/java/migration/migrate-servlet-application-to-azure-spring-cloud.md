---
title: Migrate servlet applications to Azure Spring Cloud
description: This guide describes what you should be aware of when you want to migrate an existing Tomcat application to Azure Spring Cloud
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.date: 6/16/2020
---

# Migrate Tomcat Application to Azure Spring Cloud

This guide describes what you should be aware of when you want to migrate an existing Tomcat application to run on Azure Spring Cloud.

## Pre-Migration

### Switch to a supported platform

Azure Spring Cloud offers specific versions of Java SE. To ensure compatibility, migrate your application to one of the supported versions of its current environment before you continue with any of the remaining steps. Be sure to fully test the resulting configuration. Use the latest stable release of your Linux distribution in such tests.

[!INCLUDE [note-obtain-your-current-java-version](includes/note-obtain-your-current-java-version.md)]

[!INCLUDE [determine-whether-and-how-the-file-system-is-used](includes/determine-whether-and-how-the-file-system-is-used.md)]

### Identify the Application Build/Dependency System

Identify what tool(s) are used to build/package the application, including downloading all the dependencies.

[!INCLUDE [inventory-external-resources](includes/inventory-external-resources.md)]

### Inventory secrets

#### Passwords and secure strings

Check all properties and configuration files on the production server(s) for any secret strings and passwords. Be sure to check *server.xml* and *context.xml* in *$CATALINA_BASE/conf*. You may also find configuration files containing passwords or credentials inside your application in *META-INF/context.xml*.

[!INCLUDE [inventory-certificates](includes/inventory-certificates.md)]

### Determine whether your application contains OS-specific code

[!INCLUDE [determine-whether-your-application-contains-os-specific-code-no-title](includes/determine-whether-your-application-contains-os-specific-code-no-title.md)]

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

### Determine if Tomcat is connected to a web server

Tomcat can be connected to a static web server, such as Apache, via a tomcat connector, such as `mod_jk`. Inspect the `workers.properties` file in the `conf` directory to determine if such a connection exists.

### Special cases

Certain production scenarios may require additional changes or impose additional limitations. While such scenarios can be infrequent, it's important to ensure that they're either inapplicable to your application or correctly resolved.

#### Determine if the application uses filters

Inspect the application's `web.xml` for any [configured filters](https://tomcat.apache.org/tomcat-9.0-doc/config/filter.html#Expires_Filter/Basic_configuration_sample).

[!INCLUDE [determine-whether-your-application-relies-on-scheduled-jobs-azure-spring-cloud](includes/determine-whether-your-application-relies-on-scheduled-jobs-azure-spring-cloud.md)]

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

### Remove connection to web server, if present

If Tomcat is connected to a static web server, typically to Apache via `mod_jk`, disable that connection so that Tomcat runs as a standalone server, creating web redirects from the standard server as needed. Consider migrating static web content to [Azure Storage](/azure/storage/blobs/storage-blob-static-website) with [CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn).

### Update to Tomcat 9

If your current application is running on version of Tomcat prior to 9, migrate to Tomcat 9 and verify the application is fully functional. Consult the [Tomcat 9 Migration Guide](http://tomcat.apache.org/migration-9.html) for more information.

### Switch to Maven or Gradle

Spring Boot and Spring Cloud require Maven or Gradle for building and/or dependency management. If your application uses another build and/or dependency management system, switch to [the current version of Maven](https://maven.apache.org/download.cgi) before proceeding. While Gradle is also supported, we will use Maven throughout the steps of this guide. Should you decide to use Gradle, adapt the instructions accordingly.

[Create a POM file](https://maven.apache.org/pom.html) for your application, and make sure the application builds and runs with full functionality before proceeding.

### Migrate to Spring Boot

The following table shows a summary of necessary migrations and code changes to migrate a Tomcat application to Spring Boot and, subsequently, to Azure Spring Cloud. If any element in the Legacy column is used in the application, it should be replaced with the corresponding element in the Minimum or, ideally, Recommended column.

|Legacy    |Minimum    |Recommended|
|---|---|---|
|[JDBC via DataSource](https://docs.oracle.com/javase/tutorial/jdbc/basics/connecting.html)|[Spring Data Datasource](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-sql) with [JDBC Template](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-using-jdbc-template)|Consider Spring Data and JPA, if appropriate.|
|Servlets |Enable [Servlet Context Initialization](https://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/html/spring-boot-features.html#boot-features-embedded-container-context-initializer) and annotate with `@WebServlet`|Rewrite as [Spring-MVC Controllers (with `@RestController`](https://spring.io/guides/gs/rest-service/#_create_a_resource_controller))
|Filters | Enable [Servlet Context Initialization](https://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/html/spring-boot-features.html#boot-features-embedded-container-context-initializer) and [annotate with `@WebFilter`](https://docs.oracle.com/javaee/7/api/javax/servlet/annotation/WebFilter.html) |Same as Minimum|
|Java Server Pages (JSPs) |[JSP Views for Spring MVC](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc-view-jsp)|Host the view layer separately|
|Java Message Service (JMS)|Instantiate connection factory as a [Spring Bean](https://docs.spring.io/spring-boot/docs/current/reference/html/using-spring-boot.html#using-boot-spring-beans-and-dependency-injection)|Use [Spring JMS](https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/integration.html#jms-using)

1. If your application relies on libraries injected via JNDI resources (such as JDBC drivers), add these libraries as dependencies into your POM file. Remove the libraries from the Tomcat server (typically from the `tomcat/lib` directory), and verify that the application runs with full functionality before proceeding.

1. Add the Spring Boot parent POM your POM file as [shown here](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#getting-started-first-application-pom).

1. Add the Spring Boot Tomcat starter as a dependency to your POM file:

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    ```

    Although this is formerly a tomcat application, do not add `war` as target packaging.

1. Replace Tomcat data sources with Spring data sources. [Configure Spring DataSources](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto-configure-a-datasource) for all the databases used by the application. If any code executes direct SQL queries, modify it to [use JdbcTemplate](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-using-jdbc-template). See the [Spring Framework documentation](https://docs.spring.io/spring/docs/current/spring-framework-reference/data-access.html#jdbc) and [Spring Data documentation](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#reference) for additional data access features, such as transaction management and CRUD tooling.

1. While it is possible to have servlet implementations inside an [embedded servlet container](https://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/html/spring-boot-features.html#boot-features-embedded-container), we do not recommend doing so. Instead, replace [servlet implementations](https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServletRequest.html) with Spring [Rest controllers](https://spring.io/guides/gs/rest-service/#_create_a_resource_controller). If your application uses a non-Spring MVC framework, replace it with Spring MVC. See [Spring MVC annotated controller reference](https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/web.html#mvc-controller) for more information.

1. Recreate all other JNDI dependencies with [Spring beans](https://docs.spring.io/spring-boot/docs/current/reference/html/using-spring-boot.html#using-boot-spring-beans-and-dependency-injection). Favor using Spring-idiomatic mechanisms, such as using [Spring JMS](https://spring.io/guides/gs/messaging-jms/) for messaging.

1. Replace Tomcat Realms with [Spring Security](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#servlet-filters-review). Consider using Azure Active Directory for authorization management via the [Spring Boot Starter for Active Directory](/azure/developer/java/spring-framework/spring-boot-starters-for-azure#azure-active-directory).

1. Recreate Servlet filters configured in `web.xml` with [Spring beans](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto-add-a-servlet-filter-or-listener-as-spring-bean) or [classpath scanning](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto-add-a-servlet-filter-or-listener-using-scanning).

Test the application by running `mvn spring-boot:run`. Verify that the resulting application runs with full functionality before proceeding.

[!INCLUDE [migrate-steps-spring-boot-azure-spring-cloud](includes/migrate-steps-spring-boot-azure-spring-cloud.md)]

## Post-migration

[!INCLUDE [post-migration-spring-boot-azure-spring-cloud](includes/post-migration-spring-boot-azure-spring-cloud.md)]

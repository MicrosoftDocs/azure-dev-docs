---
title: Migrate Java applications to Azure
description: This topic provides an overview of recommended strategies for migrating Java applications to Azure.
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.date: 12/12/2019
---

# Migrate Java applications to Azure

This topic provides an overview of recommended strategies for migrating Java applications to Azure.

## Identifying application type

Before you select a cloud destination for your Java application, you'll need to identify its application type. Most Java applications are one of the following types:

* [Spring Boot / JAR applications](#spring-boot--jar-applications)
* [Spring Cloud / microservices](#spring-cloud--microservices)
* [Web applications](#web-applications)
* [Java EE applications](#java-ee-applications)
* [Batch / scheduled jobs](#batch--scheduled-jobs)

These types are described in the following sections.

### Spring Boot / JAR applications

Many newer applications are invoked directly from the command line. These applications still handle web requests, but instead of relying on an application server to provide HTTP request handling, they incorporate HTTP communication and all other dependencies directly into the application package. Such applications are frequently built with frameworks such as Spring Boot, Dropwizard, Micronaut, MicroProfile, Vert.x, and others.

These applications are packaged into archives with the *.jar* extension (JAR files).

### Spring Cloud / microservices

The microservice architectural style is an approach to developing a single application as a suite of small services, each running in its own process and communicating with lightweight mechanisms, often an HTTP resource API. These services are built around business capabilities and are independently deployable by fully automated deployment machinery. There is a bare minimum of centralized management of these services, which may be written in different programming languages and use different data storage technologies. Such services are frequently built with frameworks such as Spring Cloud.

These services are packaged into multiple applications with the *.jar* extension (JAR files).

### Web applications

Web applications run inside a [Servlet](https://en.wikipedia.org/wiki/Java_servlet) container. Some use servlet APIs directly, while many use additional frameworks that encapsulate servlet APIs, such as Apache Struts, Spring MVC, JavaServer Faces (JSF), and others.

Web applications are packaged into archives with the *.war* extension (WAR files).

### Java EE applications

Java EE applications (also referred to as J2EE applications or, more recently JakartaEE applications) can contain some, all, or none of the elements of web applications. They can also contain and consume many additional components as defined by the [Java EE specification](https://en.wikipedia.org/wiki/Java_Platform,_Enterprise_Edition).

Java EE applications can be packaged as archives with the *.ear* extension (EAR files) or as archives with the *.war* extension (WAR files).

Java EE applications must be deployed onto Java EE-compliant application servers (such as WebLogic, WebSphere, WildFly, GlassFish, Payara, and others).

Applications that rely only on features provided by the Java EE specification (that is, app-server-independent applications) can be migrated from one compliant application server onto another. If your application is dependent on a specific application server (app-server-dependent), you may need to select an architecture that permits you to host that application server.

## Batch / scheduled jobs

Some applications are intended to run briefly, execute a particular workload, and then exit rather than wait for requests or user input. Sometimes such jobs need to run once or at regular, scheduled intervals. On premises, such jobs are often invoked from a server's crontab.

These applications are packaged into archives with the *.jar* extension (JAR files).

> [!NOTE]
> If your application uses a scheduler (such as Spring Batch or Quartz) to run scheduled tasks, we strongly recommend that you factor such tasks to run outside of the application. If your application scales to multiple instances in the cloud, the same job will run more than once. Furthermore, if your scheduling mechanism uses the host's local time zone, you may experience undesirable behavior when scaling your application across regions.

## Selecting the target architecture

Use the [feature grid](#feature-grid) below to identify the all the architectures that provide the features you require, including the ability to run the application type identified in the previous section. Then, use the [ongoing responsibility grid](#ongoing-responsibility-grid) to aid in understanding the responsibility each architecture places on your team post-migration.

### Feature grid

|   | App<br>Service<br>Java SE|App<br>Service<br>Tomcat|App<br>Service<br>WildFly|Azure<br>Spring<br>Cloud|AKS|Virtual Machines|
|---|---|---|---|---|---|---|
| Spring Boot / JAR applications |&#x2714;| | | |&#x2714;|&#x2714;|
| Spring Cloud / microservices | | | |&#x2714;|&#x2714;|&#x2714;|
| Web applications | |&#x2714;|&#x2714;| |&#x2714;|&#x2714;|
| Java EE applications | | |&#x2714;| |&#x2714;|&#x2714;|
| Commercial application servers<br> (such as WebLogic or WebSphere) | | | | |&#x2714;|&#x2714;|
| Long-term persistence on local filesystem |&#x2714;|&#x2714;|&#x2714;| |&#x2714;|&#x2714;|
| Application server-level clustering | | | | |&#x2714;|&#x2714;|
| Batch / scheduled jobs | | | |&#x2714;|&#x2714;|&#x2714;|

### Ongoing responsibility grid

Your team is responsible on a continual basis for the tasks indicated with "&#x1F449;" in the grid below. We recommend implementing a robust, highly automated process for fulfilling all such responsibilities. This isn't an exhaustive list of responsibilities.

|   | App Service | Azure Spring Cloud | AKS | Virtual Machines |
|---|---|---|---|---|
| Updating libraries<br>(including vulnerability remediation) |&#x1F449;|&#x1F449;|&#x1F449;|&#x1F449;|
| Updating the application server<br>(including vulnerability remediation) | ![Azure](media/migration-overview/logo_azure.svg) | ![Azure](media/migration-overview/logo_azure.svg) |&#x1F449;|&#x1F449;|
| Updating the Java Runtime<br>(including vulnerability remediation) | ![Azure](media/migration-overview/logo_azure.svg) | ![Azure](media/migration-overview/logo_azure.svg) |&#x1F449;|&#x1F449;|
| Triggering Kubernetes updates<br>(Performed by Azure with a manual trigger) |N/A|N/A|&#x1F449;|N/A|
| Reconciling non-backward-compatible Kubernetes API changes |N/A|N/A|&#x1F449;|N/A|
| Updating container base image<br>(including vulnerability remediation) |N/A|N/A|&#x1F449;|N/A|
| Updating the operating system<br>(including vulnerability remediation) | ![Azure](media/migration-overview/logo_azure.svg) | ![Azure](media/migration-overview/logo_azure.svg)| ![Azure](media/migration-overview/logo_azure.svg) |&#x1F449;|
| Detecting and restarting failed instances | ![Azure](media/migration-overview/logo_azure.svg) | ![Azure](media/migration-overview/logo_azure.svg)| ![Azure](media/migration-overview/logo_azure.svg)|&#x1F449;|
| Implementing draining and rolling restart for updates | ![Azure](media/migration-overview/logo_azure.svg) | ![Azure](media/migration-overview/logo_azure.svg) | ![Azure](media/migration-overview/logo_azure.svg) |&#x1F449;|
| Infrastructure management |  ![Azure](media/migration-overview/logo_azure.svg) | ![Azure](media/migration-overview/logo_azure.svg) |&#x1F449;|&#x1F449;|
| Monitoring and alert management |&#x1F449;|&#x1F449;|&#x1F449;|&#x1F449;|

If you deploy the servlet container (such as Spring Boot) as part of your application, you should consider it a library and, as such, it's always your responsibility.

## Ensuring on-premises connectivity

If your application needs to access any of your on-premises services, you'll need to provision one of [Azure's connectivity services](/azure/architecture/reference-architectures/hybrid-networking/). Alternatively, you'll need to refactor your application to use publicly available APIs that your on-premises resources expose.

You should complete this effort before you start any migration.

## Inventory current capacity and utilization

Document the hardware of the current production server(s) as well as the average and peak request counts and resource utilization. You'll need this information to provision resources in the target architecture.

## Migration guidance

You can find migration guidance by application type in order to target Azure services. 

In the following tables, "TBS" means "to be supplied" and "N/A" means "not applicable".

**Java applications**

| Application type -><br>Azure service | Spring Boot /<br>JAR applications​ | Spring Cloud /<br>microservices​ | Web applications<br>on Tomcat​ |
|---|---|---|---|
| App Service – Java SE  | TBS | N/A | N/A |
| App Service - Tomcat   | TBS | N/A | TBS |
| App Service - WildFly  | TBS | N/A | N/A |
| Azure Spring Cloud​     | TBS | TBS | N/A |
| Linux Virtual Machines​ | TBS | TBS | TBS |
| AKS                    | TBS | TBS | TBS |

**Java EE applications**

| Application type -> Azure service | WildFly / JBoss AS​ | WebLogic​ | WebSphere​ | JBoss EAP​ |
|---|---|---|---|---|
| App Service – Java SE  | N/A | N/A | N/A | N/A |
| App Service - Tomcat   | N/A | N/A | N/A | N/A |
| App Service - WildFly  | TBS | TBS | TBS | TBS |
| Azure Spring Cloud​     | N/A | N/A | N/A | N/A |
| Linux Virtual Machines​ | TBS | TBS | TBS | TBS |
| AKS                    | TBS | TBS | TBS | N/A |

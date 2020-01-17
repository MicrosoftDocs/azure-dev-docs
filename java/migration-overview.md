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

Applications that rely only on features provided by the Java EE specification (that is, app-server-independent applications) can be migrated from one compliant application server onto another. If your application is dependent on a specific application server (app-server-dependent), you may need to select an Azure service destination that permits you to host that application server.

### Batch / scheduled jobs

Some applications are intended to run briefly, execute a particular workload, and then exit rather than wait for requests or user input. Sometimes such jobs need to run once or at regular, scheduled intervals. On premises, such jobs are often invoked from a server's crontab.

These applications are packaged into archives with the *.jar* extension (JAR files).

> [!NOTE]
> If your application uses a scheduler (such as Spring Batch or Quartz) to run scheduled tasks, we strongly recommend that you factor such tasks to run outside of the application. If your application scales to multiple instances in the cloud, the same job will run more than once. Furthermore, if your scheduling mechanism uses the host's local time zone, you may experience undesirable behavior when scaling your application across regions.

## Selecting the target Azure service destination

The following sections show you which service destinations meet your application requirements, and what responsibilities they entail.

### Feature grid

Use the following grid to identify the destinations that support the application types and features you require.

|   |App<br>Service<br>Java SE|App<br>Service<br>Tomcat|App<br>Service<br>WildFly|Azure<br>Spring<br>Cloud|AKS|Virtual Machines|
|---|---|---|---|---|---|---|
| Spring Boot / JAR applications                                    |&#x2714;|        |        |        |&#x2714;|&#x2714;|
| Spring Cloud / microservices                                      |        |        |        |&#x2714;|&#x2714;|&#x2714;|
| Web applications                                                  |        |&#x2714;|&#x2714;|        |&#x2714;|&#x2714;|
| Java EE applications                                              |        |        |&#x2714;|        |&#x2714;|&#x2714;|
| Commercial application servers<br>(such as WebLogic or WebSphere) |        |        |        |        |&#x2714;|&#x2714;|
| Long-term persistence on local filesystem                         |&#x2714;|&#x2714;|&#x2714;|        |&#x2714;|&#x2714;|
| Application server-level clustering                               |        |        |        |        |&#x2714;|&#x2714;|
| Batch / scheduled jobs                                            |        |        |        |&#x2714;|&#x2714;|&#x2714;|

### Ongoing responsibility grid

Use the following grid to understand the responsibility each destination places on your team following migration.

Your team is responsible on a continual basis for the tasks indicated with "&#x1F449;". We recommend implementing a robust, highly automated process for fulfilling all such responsibilities. Note that this isn't an exhaustive list of responsibilities.

|   | App Service | Azure Spring Cloud | AKS | Virtual Machines |
|---|---|---|---|---|
| Updating libraries<br>(including vulnerability remediation)                 | &#x1F449; | &#x1F449; | &#x1F449; | &#x1F449; |
| Updating the application server<br>(including vulnerability remediation)    |![Azure][1]|![Azure][1]| &#x1F449; | &#x1F449; |
| Updating the Java Runtime<br>(including vulnerability remediation)          |![Azure][1]|![Azure][1]| &#x1F449; | &#x1F449; |
| Triggering Kubernetes updates<br>(Performed by Azure with a manual trigger) | N/A       | N/A       | &#x1F449; | N/A       |
| Reconciling non-backward-compatible Kubernetes API changes                  | N/A       | N/A       | &#x1F449; | N/A       |
| Updating container base image<br>(including vulnerability remediation)      | N/A       | N/A       | &#x1F449; | N/A       |
| Updating the operating system<br>(including vulnerability remediation)      |![Azure][1]|![Azure][1]|![Azure][1]| &#x1F449; |
| Detecting and restarting failed instances                                   |![Azure][1]|![Azure][1]|![Azure][1]| &#x1F449; |
| Implementing draining and rolling restart for updates                       |![Azure][1]|![Azure][1]|![Azure][1]| &#x1F449; |
| Infrastructure management                                                   |![Azure][1]|![Azure][1]| &#x1F449; | &#x1F449; |
| Monitoring and alert management                                             | &#x1F449; | &#x1F449; | &#x1F449; | &#x1F449; |

If you deploy the servlet container (such as Spring Boot) as part of your application, you should consider it a library and, as such, it's always your responsibility.

## Ensuring on-premises connectivity

If your application needs to access any of your on-premises services, you'll need to provision one of [Azure's connectivity services](/azure/architecture/reference-architectures/hybrid-networking/). Alternatively, you'll need to refactor your application to use publicly available APIs that your on-premises resources expose.

You should complete this effort before you start any migration.

## Inventory current capacity and utilization

Document the hardware of the current production server(s) as well as the average and peak request counts and resource utilization. You'll need this information to provision resources in the service destination.

## Migration guidance

Use the following grids to find migration guidance by application type and targeted Azure service destination.

**Java applications**

Use the rows below to find your application type and the columns to find the Azure service destination that will host your app.

|Destination&nbsp;→<br><br>Application&nbsp;type&nbsp;↓|App<br>Service<br>Java SE|App<br>Service<br>Tomcat|App<br>Service<br>WildFly|Azure<br>Spring<br>Cloud|AKS|Virtual Machines|
|---|---|---|---|---|---|---|
| Spring Boot /<br>JAR applications | forthcoming | forthcoming  | forthcoming | forthcoming | forthcoming  | forthcoming |
| Spring Cloud /<br>microservices   | N/A         | N/A          | N/A         | forthcoming | forthcoming  | forthcoming |
| Web applications<br>on Tomcat     | N/A         |[available][2]| N/A         | N/A         |[available][3]| forthcoming |

**Java EE applications**

Use the rows below to find your Java EE applicaton type running on a specific app server and the columns to find the Azure service destination that will host your app.

|Destination&nbsp;→<br><br>Application&nbsp;type&nbsp;↓|App<br>Service<br>Java SE|App<br>Service<br>Tomcat|App<br>Service<br>WildFly|Azure<br>Spring<br>Cloud|AKS|Virtual Machines|
|---|---|---|---|---|---|---|
| WildFly /<br>JBoss AS             | N/A         | N/A         | forthcoming | N/A         | forthcoming | forthcoming |
| WebLogic                          | N/A         | N/A         | forthcoming | N/A         | forthcoming | forthcoming |
| WebSphere                         | N/A         | N/A         | forthcoming | N/A         | forthcoming | forthcoming |
| JBoss EAP                         | N/A         | N/A         | forthcoming | N/A         | N/A         | forthcoming |

<!-- reference links, for use with tables -->
[1]: media/migration-overview/logo_azure.svg
[2]: migrate-tomcat-to-tomcat-app-service.md
[3]: migrate-tomcat-to-containers-on-azure-kubernetes-service.md

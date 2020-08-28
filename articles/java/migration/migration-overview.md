---
title: Migrate Java applications to Azure
description: This topic provides an overview of recommended strategies for migrating Java applications to Azure.
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.date: 1/20/2020
ms.custom: devx-track-java
---

# Migrate Java applications to Azure

This topic provides an overview of recommended strategies for migrating Java applications to Azure.

This migration guidance is designed to cover mainstream Java on Azure scenarios, and to provide high-level planning suggestions and considerations. If you'd like to discuss a specific Java app migration scenario with the Microsoft Java on Azure team, please fill out the following questionnaire and a representative will contact you.

> [!div class="nextstepaction"]
> [Java migration questionnaire](https://aka.ms/migrate-my-Java-app-requested-thru-docs)

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

Java EE applications (also referred to as J2EE applications or, more recently Jakarta EE applications) can contain some, all, or none of the elements of web applications. They can also contain and consume many additional components as defined by the [Java EE specification](https://en.wikipedia.org/wiki/Java_Platform,_Enterprise_Edition).

Java EE applications can be packaged as archives with the *.ear* extension (EAR files) or as archives with the *.war* extension (WAR files).

Java EE applications must be deployed onto Java EE-compliant application servers (such as WebLogic, WebSphere, WildFly, GlassFish, Payara, and others).

Applications that rely only on features provided by the Java EE specification (that is, app-server-independent applications) can be migrated from one compliant application server onto another. If your application is dependent on a specific application server (app-server-dependent), you may need to select an Azure service destination that permits you to host that application server.

### Batch / scheduled jobs

Some applications are intended to run briefly, execute a particular workload, and then exit rather than wait for requests or user input. Sometimes such jobs need to run once or at regular, scheduled intervals. On premises, such jobs are often invoked from a server's crontab.

These applications are packaged into archives with the *.jar* extension (JAR files).

> [!NOTE]
> If your application uses a scheduler (such as Spring Batch or Quartz) to run scheduled tasks, we strongly recommend that you factor such tasks to run outside of the application. If your application scales to multiple instances in the cloud, the same job will run more than once. Furthermore, if your scheduling mechanism uses the host's local time zone, you may experience undesirable behavior when scaling your application across regions.

## Selecting the target Azure service destination

The following sections show you which service destinations meet your application requirements, and what responsibilities they involve.

### Hosting options grid

Use the following grid to identify potential destinations for your application type. As you can see, AKS and Virtual Machines support all application types, but they require your team to take on more responsibilities, as shown in the next section.

|Destination&nbsp;→<br><br>Application&nbsp;type&nbsp;↓|App<br>Service<br>Java SE|App<br>Service<br>Tomcat|Azure<br>Spring<br>Cloud|AKS|Virtual<br>Machines|
|---|---|---|---|---|---|---|
| Spring Boot / JAR applications                                    |&#x2714;|        |&#x2714;|&#x2714;|&#x2714;|
| Spring Cloud / microservices                                      |        |        |&#x2714;|&#x2714;|&#x2714;|
| Web applications                                                  |        |&#x2714;|        |&#x2714;|&#x2714;|
| Java EE applications                                              |        |        |        |&#x2714;|&#x2714;|
| Commercial application servers<br>(such as WebLogic or WebSphere) |        |        |        |&#x2714;|&#x2714;|
| Long-term persistence on local filesystem                         |&#x2714;|&#x2714;|        |&#x2714;|&#x2714;|
| Application server-level clustering                               |        |        |        |&#x2714;|&#x2714;|
| Batch / scheduled jobs                                            |        |        |&#x2714;|&#x2714;|&#x2714;|
| VNet Integration/Hybrid Connectivity                              |&#x2714;|&#x2714;|Preview |&#x2714;|&#x2714;|
| Azure region availability                | [Details][10] | [Details][10] | [Details][11] |[Details][12]|[Details][13]|

### Ongoing responsibility grid

Use the following grid to understand the responsibility each destination places on your team following migration.

Your team is responsible on a continual basis for the tasks indicated with "&#x1F449;". We recommend implementing a robust, highly automated process for fulfilling all such responsibilities.

> [!NOTE]
> This isn't an exhaustive list of responsibilities.

|Destination&nbsp;→<br><br>Task&nbsp;↓                            | App<br>Service | Azure<br>Spring<br>Cloud | AKS | Virtual<br>Machines |
|---|---|---|---|---|
| Updating libraries<br>(including vulnerability remediation)                 | &#x1F449;   | &#x1F449;   | &#x1F449;   | &#x1F449; |
| Updating the application server<br>(including vulnerability remediation)    | ![Azure][1] | ![Azure][1] | &#x1F449;   | &#x1F449; |
| Updating the Java Runtime<br>(including vulnerability remediation)          | ![Azure][1] | ![Azure][1] | &#x1F449;   | &#x1F449; |
| Triggering Kubernetes updates<br>(performed by Azure with a manual trigger) | N/A         | ![Azure][1] | &#x1F449;   | N/A       |
| Reconciling non-backward-compatible Kubernetes API changes                  | N/A         | ![Azure][1] | &#x1F449;   | N/A       |
| Updating container base image<br>(including vulnerability remediation)      | N/A         | ![Azure][1] | &#x1F449;   | N/A       |
| Updating the operating system<br>(including vulnerability remediation)      | ![Azure][1] | ![Azure][1] | ![Azure][1] | &#x1F449; |
| Detecting and restarting failed instances                                   | ![Azure][1] | ![Azure][1] | ![Azure][1] | &#x1F449; |
| Implementing draining and rolling restart for updates                       | ![Azure][1] | ![Azure][1] | ![Azure][1] | &#x1F449; |
| Infrastructure management                                                   | ![Azure][1] | ![Azure][1] | &#x1F449;   | &#x1F449; |
| Monitoring and alert management                                             | &#x1F449;   | &#x1F449;   | &#x1F449;   | &#x1F449; |

If you deploy the servlet container (such as Spring Boot) as part of your application, you should consider it a library and, as such, it's always your responsibility.

## Ensuring on-premises connectivity

If your application needs to access any of your on-premises services, you'll need to provision one of Azure's connectivity services. For more information, see [Choose a solution for connecting an on-premises network to Azure](/azure/architecture/reference-architectures/hybrid-networking/). Alternatively, you'll need to refactor your application to use publicly available APIs that your on-premises resources expose.

You should complete this effort before you start any migration.

## Inventory current capacity and resource usage

Document the hardware of the current production server(s) plus the average and peak request counts and resource usage. You'll need this information to provision resources in the service destination.

## Migration guidance

Use the following grids to find migration guidance by application type and targeted Azure service destination.

**Java applications**

Use the rows below to find your Java application type and the columns to find the Azure service destination that will host your application.

If you'd like to migrate a JBoss EAP app to Tomcat on App Service, first convert the Java EE app to Java Web Apps (servlets) running on Tomcat, then follow the guidance indicated below.

If you'd like to migrate a Web app on Tomcat to Azure Spring Cloud, first convert the app into Spring Cloud microservices, then follow the guidance indicated below.

|Destination&nbsp;→<br><br>Application&nbsp;type&nbsp;↓|App<br>Service<br>Java SE|App<br>Service<br>Tomcat|Azure<br>Spring<br>Cloud|AKS|Virtual Machines|
|---|---|---|---|---|---|---|
| Spring Boot /<br>JAR applications | [guidance][5] | guidance<br>planned | [guidance][16] | [guidance][14]      | guidance<br>planned |
| Spring Cloud /<br>microservices   | N/A           | N/A                 | [guidance][15] | guidance<br>planned | guidance<br>planned |
| Web applications<br>on Tomcat     | N/A           | [guidance][2]       | [guidance][17] | [guidance][3]       | guidance<br>planned |

**Java EE applications**

Use the rows below to find your Java EE application type running on a specific app server. Use the columns to find the Azure service destination that will host your application.

|Destination&nbsp;→<br><br>App server&nbsp;↓|App<br>Service<br>Java SE|App<br>Service<br>Tomcat|Azure<br>Spring<br>Cloud|AKS|Virtual Machines|
|---|---|---|---|---|---|---|
| WildFly /<br>JBoss AS | N/A | N/A | N/A | [guidance][9] | guidance<br>planned |
| WebLogic              | N/A | N/A | N/A | [guidance][6] | [guidance][4]       |
| WebSphere             | N/A | N/A | N/A | [guidance][7] | guidance<br>planned |
| JBoss EAP             | N/A | N/A | N/A | [guidance][8] | guidance<br>planned |

<!-- reference links, for use with tables -->
[1]: media/migration-overview/logo_azure.svg
[2]: migrate-tomcat-to-tomcat-app-service.md
[3]: migrate-tomcat-to-containers-on-azure-kubernetes-service.md
[4]: migrate-weblogic-to-virtual-machines.md
[5]: migrate-spring-boot-to-app-service.md
[6]: migrate-weblogic-to-wildfly-on-azure-kubernetes-service.md
[7]: migrate-websphere-to-wildfly-on-azure-kubernetes-service.md
[8]: migrate-jboss-eap-to-wildfly-on-azure-kubernetes-service.md
[9]: migrate-wildfly-to-wildfly-on-azure-kubernetes-service.md
[10]: https://azure.microsoft.com/global-infrastructure/services/?products=app-service-linux
[11]: https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud
[12]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service
[13]: https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines
[14]: migrate-spring-boot-to-azure-kubernetes-service.md
[15]: migrate-spring-cloud-to-azure-spring-cloud.md
[16]: migrate-spring-boot-to-azure-spring-cloud.md
[17]: migrate-servlet-application-to-azure-spring-cloud.md

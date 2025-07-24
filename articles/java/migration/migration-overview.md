---
title: Migrate Java applications to Azure
description: This topic provides an overview of recommended strategies for migrating Java applications to Azure.
author: KarlErickson
ms.author: karler
ms.topic: upgrade-and-migration-article
ms.date: 09/30/2024
ms.custom: devx-track-java, devx-track-javaee, migration-java, devx-track-extended-java
recommendations: false
---

# Migrate Java applications to Azure

This article provides an overview of recommended strategies for migrating Java applications to Azure.

This migration guidance is designed to cover mainstream Java on Azure scenarios, and to provide high-level planning suggestions and considerations. If you'd like to discuss a specific Java app migration scenario with the Microsoft Java on Azure team, fill out the following questionnaire, and a representative will contact you.

> [!div class="nextstepaction"]
> [Java migration questionnaire](https://aka.ms/migrate-my-Java-app-requested-thru-docs)

## Identifying application type

Before you select a cloud destination for your Java application, you'll need to identify its application type. Most Java applications are one of the following types:

* Spring applications:
  * [Spring Boot / JAR applications](#spring-boot--jar-applications)
  * [Spring applications that use Spring Cloud middleware modules](#spring-applications-that-use-spring-cloud-middleware-modules)
* [Java EE applications](#java-ee-applications)
* [Web applications](#web-applications)
* [Batch / scheduled jobs](#batch--scheduled-jobs)

These types are described in the following sections.

### Spring Boot / JAR applications

Many newer applications are invoked directly from the command line. These applications still handle web requests, but instead of relying on an application server to provide HTTP request handling, they incorporate HTTP communication and all other dependencies directly into the application package. Such applications are frequently built with frameworks such as Spring Boot, Dropwizard, Micronaut, MicroProfile, Vert.x, and others.

These applications are packaged into archives with the **.jar** extension (JAR files).

### Spring applications that use Spring Cloud middleware modules

The microservice architectural style is an approach to developing a single application as a suite of small services. Each service runs in its own process and communicates by using lightweight mechanisms, often an HTTP resource API. These services are built around business capabilities and are independently deployable by fully automated deployment machinery. There's a bare minimum of centralized management of these services, which may be written in different programming languages and use different data storage technologies. Such services are frequently built with frameworks such as Spring Cloud.

These services are packaged into multiple applications with the **.jar** extension (JAR files).

### Java EE applications

Java EE applications (also referred to as J2EE applications or, more recently, Jakarta EE applications) can contain some, all, or none of the elements of web applications. These applications can also contain and consume many more components as defined by the [Jakarta EE specification](https://jakarta.ee/specifications/platform/).

Java EE applications can be packaged as archives with the **.ear** extension (EAR files) or as archives with the **.war** extension (WAR files).

Java EE applications must be deployed onto Java EE-compliant application servers (such as Oracle WebLogic Server, IBM WebSphere, JBoss EAP, GlassFish, Payara, and others).

Applications that rely only on features provided by the Java EE specification (that is, app-server-independent applications) can be migrated from one compliant application server onto another. If your application is dependent on a specific application server (app-server-dependent), you may need to select an Azure service destination that permits you to host that application server.

### Web applications

Web applications run inside a [Servlet](https://jakarta.ee/specifications/servlet/) container. Some of these applications use servlet APIs directly, while many use other frameworks that encapsulate servlet APIs, such as Apache Struts, Spring MVC, JavaServer Faces (JSF), and others.

Web applications are packaged into archives with the **.war** extension (WAR files).

### Batch / scheduled jobs

Some applications are intended to run briefly, execute a particular workload, and then exit rather than wait for requests or user input. Sometimes such jobs need to run once or at regular, scheduled intervals. On premises, such jobs are often invoked from a server's crontab.

These applications are packaged into archives with the **.jar** extension (JAR files).

> [!NOTE]
> If your application uses a scheduler (such as Spring Batch or Quartz) to run scheduled tasks, we strongly recommend that you factor such tasks to run outside of the application. If your application scales to multiple instances in the cloud, the same job will run more than once. Furthermore, if your scheduling mechanism uses the host's local time zone, you may experience undesirable behavior when scaling your application across regions.

## Selecting the target Azure service destination

The following sections show you which service destinations meet your application requirements, and what responsibilities they involve.

### Hosting options grid

Use the following grid to identify potential destinations for your application type. As you can see, Azure Kubernetes Service (AKS) and Azure Virtual Machines support all application types, but they require your team to take on more responsibilities, as shown in the next section.

| Destination&nbsp;→<br><br>Application&nbsp;type&nbsp;↓                             | App<br>Service<br>Java SE | App<br>Service<br>Tomcat | App<br>Service<br>JBoss EAP | Azure Container Apps | AKS           | Virtual<br>Machines |
|-------------------------------------------------------------------------------------|---------------------------|--------------------------|-----------------------------|----------------------|---------------|---------------------|
| Spring Boot / JAR applications                                                      | &#x2714;                  |                          |                             | &#x2714;             | &#x2714;      | &#x2714;            |
| Spring Cloud applications                                                           | &#x2714;                  |                          | &#x2714;                    | &#x2714;             | &#x2714;      | &#x2714;            |
| Web applications (WAR)                                                              |                           | &#x2714;                 | &#x2714;                    | &#x2714;             | &#x2714;      | &#x2714;            |
| Java EE applications (WAR \| EAR)                                                   |                           |                          | &#x2714;                    | &#x2714;             | &#x2714;      | &#x2714;            |
| Commercial application servers<br>(such as Oracle WebLogic Server or IBM WebSphere) |                           |                          |                             | &#x2714;             | &#x2714;      | &#x2714;            |
| Application server-level clustering                                                 |                           |                          | &#x2714;                    |                      | &#x2714;      | &#x2714;            |
| Batch / scheduled jobs                                                              |                           |                          |                             | &#x2714;             | &#x2714;      | &#x2714;            |
| VNet Integration/Hybrid Connectivity                                                | &#x2714;                  | &#x2714;                 | &#x2714;                    | &#x2714;             | &#x2714;      | &#x2714;            |
| Azure region availability                                                           | [Details][10]             | [Details][10]            | [Details][10]               | [Details][23]        | [Details][12] | [Details][13]       |

### Ongoing responsibility grid

Use the following grid to understand the responsibility each destination places on your team following migration.

Tasks indicated with ![Azure][1] are managed entirely or mostly by Azure. Your team is responsible on a continual basis for the tasks indicated with &#x1F449;. We recommend implementing a robust, highly automated process for fulfilling all such responsibilities.

> [!NOTE]
> This isn't an exhaustive list of responsibilities.

| Destination&nbsp;→<br><br>Task&nbsp;↓                                       | App<br>Service | Azure<br>Container<br>Apps | AKS                     | Virtual<br>Machines |
|-----------------------------------------------------------------------------|----------------|----------------------------|-------------------------|---------------------|
| Updating libraries<br>(including vulnerability remediation)                 | &#x1F449;      | &#x1F449;                  | &#x1F449;               | &#x1F449;           |
| Updating the application server<br>(including vulnerability remediation)    | ![Azure][1]    | &#x1F449;                  | &#x1F449;               | &#x1F449;           |
| Updating the Java Runtime<br>(including vulnerability remediation)          | ![Azure][1]    | &#x1F449;                  | &#x1F449;               | &#x1F449;           |
| Triggering Kubernetes updates<br>(performed by Azure with a manual trigger) | N/A            | ![Azure][1]                | &#x1F449;               | N/A                 |
| Disaster Recovery                                                           | ![Azure][1]    | &#x1F449;                  | &#x1F449;               | ![Azure][1]         |
| Reconciling non-backward-compatible Kubernetes API changes                  | N/A            | &#x1F449;                  | &#x1F449;               | N/A                 |
| Updating container base image<br>(including vulnerability remediation)      | N/A            | &#x1F449;                  | &#x1F449;               | N/A                 |
| Updating the operating system<br>(including vulnerability remediation)      | ![Azure][1]    | ![Azure][1]                | ![Azure][1]<sup>1</sup> | &#x1F449;           |
| Detecting and restarting failed instances                                   | ![Azure][1]    | ![Azure][1]                | ![Azure][1]             | &#x1F449;           |
| Implementing draining and rolling restart for updates                       | ![Azure][1]    | ![Azure][1]                | ![Azure][1]             | &#x1F449;           |
| Infrastructure management                                                   | ![Azure][1]    | &#x1F449;                  | &#x1F449;               | &#x1F449;           |
| Monitoring and alert management                                             | &#x1F449;      | &#x1F449;                  | &#x1F449;               |  &#x1F449;                     |

<sup>1</sup> Some security updates might require node reboots, which aren't done automatically. For more information, see [Apply security and kernel updates to Linux nodes in Azure Kubernetes Service (AKS)](/azure/aks/node-updates-kured).

If you deploy the servlet container (such as Spring Boot) as part of your application, you should consider it a library and, as such, it's always your responsibility.

## Ensuring on-premises connectivity

If your application needs to access any of your on-premises services, you'll need to provision one of Azure's connectivity services. For more information, see [Connect an on-premises network to Azure](/azure/architecture/reference-architectures/hybrid-networking/). Alternatively, you'll need to refactor your application to use publicly available APIs that your on-premises resources expose.

You should complete this effort before you start any migration.

## Inventory current capacity and resource usage

Document the hardware of the current production server(s) plus the average and peak request counts and resource usage. You'll need this information to provision resources in the service destination.

## Migration guidance

Use the following grids to find migration guidance by application type and targeted Azure service destination.

**Java applications**

Use the rows below to find your Java application type and the columns to find the Azure service destination that will host your application.

If you'd like to migrate a JBoss EAP app to Tomcat on App Service, first convert the Java EE app to Java Web Apps (servlets) running on Tomcat, then follow the guidance indicated below.

| Destination&nbsp;→<br><br>Application&nbsp;type&nbsp;↓ | App<br>Service<br>Java SE | App<br>Service<br>Tomcat | App<br>Service<br>JBoss EAP | Azure<br>Container<br>Apps | AKS                 | Virtual<br>Machines |
|--------------------------------------------------------|---------------------------|--------------------------|-----------------------------|----------------------------|---------------------|---------------------|---------------------|
| Spring Boot /<br>JAR applications                      | [guidance][5]             | N/A                      | N/A                         | N/A                        | N/A                 | N/A                 |
| Spring Cloud /<br>applications                         | N/A                       | N/A                      | N/A                         | N/A                        | guidance<br>planned | guidance<br>planned |
| Web applications<br>on Tomcat                          | N/A                       | [guidance][2]            | N/A                         | [guidance][22]             | [guidance][3]       | guidance<br>planned |

**Java EE applications**

Use the rows below to find your Java EE application type running on a specific app server. Use the columns to find the Azure service destination that will host your application.

| Destination&nbsp;→<br><br>App server&nbsp;↓ | App<br>Service<br>Java SE | App<br>Service<br>Tomcat | App<br>Service<br>JBoss EAP | Azure<br>Container<br>Apps | AKS           | Virtual<br>Machines |
|---------------------------------------------|---------------------------|--------------------------|-----------------------------|----------------------------|---------------|---------------------|
| JBoss AS                                    | N/A                       | N/A                      | [guidance][18]              | N/A                        | N/A           | guidance<br>planned |
| Oracle WebLogic Server                      | N/A                       | N/A                      | [guidance][19]              | N/A                        | [guidance][6] | [guidance][4]       |
| IBM WebSphere                               | N/A                       | N/A                      | [guidance][20]              | N/A                        | [guidance][7] | guidance<br>planned |
| Red Hat JBoss EAP                           | N/A                       | N/A                      | [guidance][18]              | N/A                        | N/A           | [guidance][24]      |

<!-- reference links, for use with tables -->
[1]: media/migration-overview/logo_azure.svg
[2]: migrate-tomcat-to-tomcat-app-service.md
[3]: migrate-tomcat-to-containers-on-azure-kubernetes-service.md
[4]: migrate-weblogic-to-virtual-machines.md
[5]: migrate-spring-boot-to-app-service.md
[6]: migrate-weblogic-to-azure-kubernetes-service.md
[7]: migrate-websphere-to-azure-kubernetes-service.md
[10]: https://azure.microsoft.com/global-infrastructure/services/?products=app-service-linux
[12]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service
[13]: https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines
[18]: migrate-jboss-eap-to-jboss-eap-on-azure-app-service.md
[19]: migrate-weblogic-to-jboss-eap-on-azure-app-service.md
[20]: migrate-websphere-to-jboss-eap-on-azure-app-service.md
[22]: migrate-tomcat-to-containers-on-azure-kubernetes-service.md
[23]: https://azure.microsoft.com/global-infrastructure/services/?products=container-apps
[24]: migrate-jboss-eap-to-jboss-eap-on-azure-vms.md

## See also

* [Reasons to move to Java 11 and beyond](/java/openjdk/reasons-to-move-to-java-11)
* [Transition from Java 8 to Java 11](/java/openjdk/transition-from-java-8-to-java-11)
* [Transition from Java 7 to Java 8](/java/openjdk/transition-from-java-7-to-java-8)

---
title: Java JDKs support for Azure development
description: This article provides details of support for developing for or deploying Java applications to Azure and Azure Stack.
author: KarlErickson
ms.author: brborges
ms.date: 05/25/2021
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
---

# Java support on Azure and Azure Stack

Java developers can build, integrate, and deploy applications to a variety of Azure and Azure Stack services. Developers are free to use the distribution and version of Java of their choice for most Microsoft Azure services. Certain services will provide and manage a Java runtime on behalf of customers. This document will help you understand which services provide a Java runtime by default, and which services do not.

> [!IMPORTANT]
> **Update June 30th, 2021:** Zulu for Azure no longer receives updates or support since January 1st, 2022. Azure services have transitioned to [Microsoft Build of OpenJDK](/java/openjdk/install) for JDK 11 and [Eclipse Temurin](https://adoptium.net/releases.html?variant=openjdk8&jvmVariant=hotspot) for JDK 8. For more information, see [End of Updates, Support and Availability of the Zulu for Azure builds of OpenJDK](https://devblogs.microsoft.com/java/end-of-updates-support-and-availability-of-zulu-for-azure/).

## Supported Java versions and update schedule

The following versions of Java are supported by Microsoft developer tools, Azure, Azure Arc, and Azure Stack services:

* Java 8 ([OpenJDK 8u](https://wiki.openjdk.java.net/display/jdk8u)) with [Eclipse Temurin](https://adoptium.net/temurin/releases?version=8) binaries.
* Java 11 ([OpenJDK 11u](https://wiki.openjdk.java.net/display/JDKUpdates/JDK11u)) with [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk) binaries.
* Java 17 ([OpenJDK 17u](https://wiki.openjdk.java.net/display/JDKUpdates/JDK+17u)) with [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk) binaries.

Updates to OpenJDK 8u, OpenJDK 11u, and OpenJDK 17u are released every quarter (January, April, July, and October).

For more information on the availability of other versions of Java, and for the support roadmap, see the specific Azure service documentation.

## Services with a managed or default Java runtime

For the following services the Java runtime is managed, or provided by default, by Microsoft:

* Azure App Service on Windows
* Azure App Service on Linux
* Azure Functions
* Azure Spring Apps
* Azure Service Fabric
* Azure HDInsight
* Azure Cognitive Search
* Azure Cloud Shell
* Azure DevOps
* Azure Managed Instance for Apache Cassandra
* Azure Cosmos DB for Apache Cassandra

For some of the services above, you may be able to change the Java runtime from the one provided by default. For more information, see the documentation of the service.

### OpenJDK distributions deployed

Microsoft may use 3rd-party Java distributions and binaries for a range of Java versions on some of its services - namely [Eclipse Temurin][temurin-link] and [Azul Zulu][zulu-link]. Microsoft will keep those 3rd-party distributions up to date for as long as there are updates available. For all other cases, Microsoft builds, supports, and deploys the [Microsoft Build of OpenJDK][msjdk-link].

## Services without a managed or default Java runtime

The choice of the Java runtime is up to you in the following cases:

* With Azure services such as Azure Virtual Machines, Azure Kubernetes Services (AKS), Azure Container Instances (ACI), Azure Container Apps, Azure Red Hat OpenShift, and Azure App Service Web App for Containers.
* With services where users must manually configure the infrastructure and its components.

While Java developers can bring their own Java runtimes from different vendors to Azure on these services, Microsoft recommends that you use any of the following OpenJDK distributions:

* [Microsoft Build of OpenJDK][msjdk-link]
* [Eclipse Adoptium Temurin][temurin-link]
* [Azul Zulu Builds of OpenJDK][zulu-link]
   > [!NOTE]
   > Azul Zulu for Azure no longer receives updates since January 1st, 2022. For more information, see [End of Updates, Support and Availability of the Zulu for Azure builds of OpenJDK](https://devblogs.microsoft.com/java/end-of-updates-support-and-availability-of-zulu-for-azure/).

For information on how to install and use OpenJDK, see the documentation for one of these distributions.

[msjdk-link]: https://www.microsoft.com/openjdk
[temurin-link]: https://www.adoptium.net
[zulu-link]: https://www.azul.com/downloads/?package=jdk#download-openjdk

## Customer support

For issues related to the deployment of Java applications to Azure, Azure Stack services, Azure Arc enabled clusters, and integration with Azure REST APIs, customers with a [qualifying support plan](https://azure.microsoft.com/support/plans/) receive support without any extra cost.

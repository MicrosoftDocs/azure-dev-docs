---
title: Java JDKs support for Azure development
description: This article provides details of support for developing for or deploying Java applications to Azure and Azure Stack.
ms.date: 05/25/2021
ms.topic: conceptual
ms.custom: seo-java-september2019, devx-track-java
---

# Java support on Azure and Azure Stack

Java developers can build, integrate, and deploy applications to a variety of Azure and Azure Stack services. Developers are free to use the distribution and version of Java of their choice for most Microsoft Azure services. Certain services will provide and manage a Java runtime on behalf of customers. This document will help you understand which services provide a Java runtime by default, and which services do not.

> [!IMPORTANT]
> **Update June 30th, 2021:** Zulu for Azure will no longer receive updates or support starting January 1st, 2022. Azure services are transitioning to [Microsoft Build of OpenJDK](/java/openjdk/install) for JDK 11 and [Eclipse Temurin](https://adoptium.net/releases.html?variant=openjdk8&jvmVariant=hotspot) for JDK 8. For more information, see [End of Updates, Support and Availability of the Zulu for Azure builds of OpenJDK](https://devblogs.microsoft.com/java/end-of-updates-support-and-availability-of-zulu-for-azure/).

## Services with a managed or default Java runtime

For the following services the Java runtime is managed, or provided by default, by Microsoft:

* Azure App Service on Windows
* Azure App Service on Linux
* Azure Functions
* Azure Spring Cloud
* Azure Service Fabric
* Azure HDInsight
* Azure Cognitive Search
* Azure Cloud Shell
* Azure DevOps

For some of the services above, you may be able to change the Java runtime from the one provided by default. For more information, see the documentation of the service.

### Supported Java versions and update schedule

The following versions of Java are supported for Microsoft developer tools, and Azure and Azure Stack services with a JDK managed by Microsoft:

* Java 8 ([OpenJDK 8u](https://wiki.openjdk.java.net/display/jdk8u)) 
* Java 11 ([OpenJDK 11u](https://wiki.openjdk.java.net/display/JDKUpdates/JDK11u))

Updates to OpenJDK 8u and OpenJDK 11u are released every quarter (January, April, July, and October). 

Microsoft may use 3rd-party Java distributions and binaries for some managed services. Microsoft will keep those 3rd-party distributions up to date for as long as there are updates available.

For more information on the availability of other versions of Java, and for the support roadmap, see the specific Azure service documentation.

## Services without a managed or default Java runtime

For Azure Compute services such as Azure Virtual Machines, Azure Kubernetes Services (AKS), Azure Container Instances (ACI), Azure Red Hat OpenShift, and Azure App Service Web App for Containers, the choice of the Java runtime is entirely up to you.

While Java developers can bring their own Java runtimes from different vendors to Azure, Microsoft recommends that you use any of the following OpenJDK distributions:

* [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk)
* [Eclipse Adoptium Temurin](https://www.adoptium.net)
* [Azul Zulu for Azure](https://www.azul.com/downloads/azure-only/zulu/)
   > [!NOTE]
   > Azul Zulu for Azure will no longer receive updates starting January 1st, 2022. For more information, see [End of Updates, Support and Availability of the Zulu for Azure builds of OpenJDK](https://devblogs.microsoft.com/java/end-of-updates-support-and-availability-of-zulu-for-azure/).

For information on how to install and use OpenJDK, see the documentation for one of these distributions.

## Customer support

For issues related to the deployment of Java applications to Azure and Azure Stack services and integration with Azure REST APIs, Azure and Azure Stack customers with a [qualifying support plan](https://azure.microsoft.com/support/plans/) receive support without any extra cost.

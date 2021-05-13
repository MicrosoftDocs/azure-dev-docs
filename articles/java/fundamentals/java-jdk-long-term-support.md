---
title: Java JDKs support for Azure development
description: This article provides a statement of support for developing and running Java applications on Azure and Azure Stack.
ms.date: 04/09/2019
ms.topic: conceptual
ms.custom: seo-java-september2019, devx-track-java
---

# Java support on Azure and Azure Stack

Java developers on Azure and Azure Stack can build and run production Java applications with different versions of Java and distributions of OpenJDK. Developers can use any Java runtime they want for most of the Azure services, except for services Microsoft manages the Java runtime. 

## Managed JDK

For the following services, the JDK is managed by Microsoft:

* Azure App Service on Windows
* Azure App Service on Linux
* Azure Functions
* Azure Spring Cloud
* Azure Service Fabric
* Azure HDInsight
* Azure Cognitive Search
* Azure Cloud Shell

For some of the services above developers may have the capability of changing the JDK distribution with one of their choices. Check the documentation of the service for more information. For Azure Compute services such as Azure Virtual Machines, Azure Kubernetes Services, Azure Container Instances, Azure Red Hat OpenShift, and Azure App Service Web App for Containers, the choice of the JDK is entirely up to the developer.

## Supported Java Versions and Update Schedule

Microsoft Azure and Azure Stack support the following versions of Java for the managed services:

* Java 8 ([OpenJDK 8u](https://wiki.openjdk.java.net/display/jdk8u)) 
* Java 11 ([OpenJDK 11u](https://wiki.openjdk.java.net/display/JDKUpdates/JDK11u))

Microsoft will keep these versions up to date across Azure and Azure Stack services for as long as there are updates available in the source code. Microsoft may use 3rd-party distributions and binaries for some versions of Java. For more details on availability of other versions of Java and support roadmap, please consult the specific Azure service documentation.

Updates to OpenJDK 8u and OpenJDK 11u are released every quarter (January, April, July, and October).

## Supported OpenJDK Distributions

As always, Java developers can bring their own Java runtimes, including Oracle JDK, Red Hat build of OpenJDK, AdoptOpenJDK, and others to Azure and use the secure infrastructure and feature-rich services. Microsoft may provide better customer support to Azure and Azure Stack customers whenever developers are using any of the following distributions:

* [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk)
* [AdoptOpenJDK](https://www.adoptopenjdk.net)
* [Azul Zulu for Azure](https://www.azul.com/downloads/azure-only/zulu/)

For information on how to install and use OpenJDK, please visit one of the distributions above.

## Commercial Support

Azure and Azure Stack customers with a [qualifying support plan](https://azure.microsoft.com/en-ca/support/plans/) receive Java support without any extra cost when developing and/or deploying with a supported Java version or OpenJDK distribution as stated in this document. For any other OpenJDK related issue, developers are welcome to provide feedback through [github.com/microsoft/openjdk](https://github.com/microsoft/openjdk).

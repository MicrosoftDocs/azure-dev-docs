---
title: Java JDKs support for Azure development
description: This article provides a statement of support for developing and running Java applications on Azure and Azure Stack.
ms.date: 04/09/2019
ms.topic: conceptual
ms.custom: seo-java-september2019, devx-track-java
---

# Java support on Azure and Azure Stack

Java developers on Azure and Azure Stack can build and run production Java applications with different versions of Java and OpenJDK. Developers can use any Java runtime they want for most Azure service.

## Services with Managed JDK

For the following services, the default JDK is managed by Microsoft:

* Azure App Service on Windows
* Azure App Service on Linux
* Azure Functions
* Azure Spring Cloud
* Azure Service Fabric
* Azure HDInsight
* Azure Cognitive Search
* Azure Cloud Shell
* Azure DevOps

For some of the services above, developers may change the JDK distribution and version with a different one. Check the documentation of the service for more information. For Azure Compute services such as Azure Virtual Machines, Azure Kubernetes Services, Azure Container Instances, Azure Red Hat OpenShift, and Azure App Service Web App for Containers, the choice of the JDK is entirely up to the developer.

## Supported Java versions and update schedule

Microsoft developer tools, and Azure and Azure Stack services with a JDK managed by Microsoft, support the following versions of Java:

* Java 8 ([OpenJDK 8u](https://wiki.openjdk.java.net/display/jdk8u)) 
* Java 11 ([OpenJDK 11u](https://wiki.openjdk.java.net/display/JDKUpdates/JDK11u))

Microsoft may use 3rd-party distributions and binaries for some versions of Java. Microsoft will keep these distributions up to date for as long as there are updates available. Updates to OpenJDK 8u and OpenJDK 11u are released every quarter (January, April, July, and October).

For more details on availability of other versions of Java and support roadmap, please consult the specific Azure service documentation.

## Supported OpenJDK distributions

As always, Java developers can bring their own Java runtimes from different vendors to Azure. For issues specifically related to the OpenJDK software and the HotSpot JVM, Microsoft will provide support to Azure and Azure Stack customers whenever developers are using any of the following distributions:

* [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk)
* [Azul Zulu for Azure](https://www.azul.com/downloads/azure-only/zulu/)

For information on how to install and use OpenJDK, please visit one of the distributions above.

## Commercial Support

Azure and Azure Stack customers with a [qualifying support plan](https://azure.microsoft.com/en-ca/support/plans/) receive Java support without any extra cost when developing and/or deploying Java applications for Microsoft Azure and Azure Stack. 

Developers are also welcome to raise issues and provide feedback through [github.com/microsoft/openjdk](https://github.com/microsoft/openjdk).

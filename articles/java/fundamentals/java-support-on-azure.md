---
title: Java JDKs support for Azure development
description: This article provides a statement of support for developing and running Java applications on Azure and Azure Stack.
ms.date: 04/09/2019
ms.topic: conceptual
ms.custom: seo-java-september2019, devx-track-java
---

# Java support on Azure and Azure Stack

Java developers are fully supported on Azure and Azure Stack. Microsoft managed services provide default builds of OpenJDK 8 and 11, which you can override in some cases. For other services, you're free to use the distribution and version of your choice.

## Services with a managed or default JDK

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

For some of the services above, you may be able to change the JDK distribution and version from the defaults provided. For more information, see the documentation of the service.

### Supported Java versions and update schedule

The following versions of Java are supported for Microsoft developer tools, and Azure and Azure Stack services with a JDK managed by Microsoft:

* Java 8 ([OpenJDK 8u](https://wiki.openjdk.java.net/display/jdk8u)) 
* Java 11 ([OpenJDK 11u](https://wiki.openjdk.java.net/display/JDKUpdates/JDK11u))

Updates to OpenJDK 8u and OpenJDK 11u are released every quarter (January, April, July, and October).

Microsoft may use 3rd-party Java distributions and binaries for some managed services. Microsoft will also keep those 3rd-party distributions up to date for as long as there are updates available.

For more details on availability of other versions of Java and support roadmap, see the specific Azure service documentation.

## Services without a managed or default JDK

For Azure Compute services such as Azure Virtual Machines, Azure Kubernetes Services (AKS), Azure Container Instances (ACI), Azure Red Hat OpenShift, and Azure App Service Web App for Containers, the choice of the JDK is entirely up to you.

Java developers can bring their own Java runtimes from different vendors to Azure. For issues specifically related to the OpenJDK software and the HotSpot JVM, Microsoft will provide support to Azure and Azure Stack customers whenever developers are using any of the following distributions:

* [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk)
* [Azul Zulu for Azure](https://www.azul.com/downloads/azure-only/zulu/)

For information on how to install and use OpenJDK, see the documentation for one of these distributions.

## Commercial support

Azure and Azure Stack customers with a [qualifying support plan](https://azure.microsoft.com/en-ca/support/plans/) receive Java support without any extra cost when developing and/or deploying Java applications for Microsoft Azure and Azure Stack. 

Developers are also welcome to raise issues and provide feedback through [github.com/microsoft/openjdk](https://github.com/microsoft/openjdk).

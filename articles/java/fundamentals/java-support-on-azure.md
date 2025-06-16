---
title: Java JDKs Support for Azure Development
description: This article provides details of support for developing for or deploying Java applications to Azure and Azure Stack.
author: KarlErickson
ms.author: karler
ms.reviewer: brborges
ms.date: 07/13/2024
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---
# Java support on Azure and Azure Stack

Java developers can build, integrate, and deploy applications to various Azure and Azure Stack services. Developers are free to use the distribution and version of the Java Development Kit (JDK) of their choice for most Microsoft Azure services. Microsoft provides and manages the Java runtime for certain services on behalf of customers. This document helps you understand which services provide a Java runtime by default, and which services you can bring your own Java runtime to.

> [!IMPORTANT]
> Update June 30th, 2021: Zulu for Azure no longer receives updates or support since January 1st, 2022. Azure services have transitioned to [Microsoft Build of OpenJDK](/java/openjdk/install) for JDK 11 and [Eclipse Temurin](https://adoptium.net/releases.html?variant=openjdk8&jvmVariant=hotspot) for JDK 8. For more information, see [End of Updates, Support and Availability of the Zulu for Azure builds of OpenJDK](https://devblogs.microsoft.com/java/end-of-updates-support-and-availability-of-zulu-for-azure/).

## Supported Java versions and update schedule

For more information, see [Microsoft Build of OpenJDK Support Policy](/java/openjdk/support).

For information about the Java version availability for specific Azure services, see the service documentation.

## Services with a managed or default Java runtime

For the following services, Microsoft manages the Java runtime or provides one by default:

* Azure App Service on Windows
* Azure App Service on Linux
* Azure Container Apps, through [code to cloud](/azure/container-apps/deploy-artifact?tabs=bash)
* Azure Functions
* Azure Spring Apps
* Azure Service Fabric
* Azure HDInsight
* Azure Cognitive Search
* Azure Cloud Shell
* Azure DevOps
* Azure Managed Instance for Apache Cassandra
* Azure Cosmos DB for Apache Cassandra

For some of the services, you might be able to change the Java runtime from the one provided by default. For more information, see the documentation of the service.

### OpenJDK distributions deployed

Microsoft might use 3rd-party Java distributions and binaries for a range of Java versions on some of its services - namely [Eclipse Temurin][temurin-link]. Microsoft keeps those 3rd-party distributions up to date for as long as there are updates available. For all other cases, Microsoft builds, supports, and deploys the [Microsoft Build of OpenJDK][msjdk-link].

## Services without a managed or default Java runtime

The choice of the Java runtime is up to you in the following cases:

* With Azure services such as Azure Virtual Machines, Azure Kubernetes Services (AKS), Azure Container Instances (ACI), Azure Container Apps (ACA), Azure Red Hat OpenShift, and Azure App Service Web App for Containers.
* With services where users must manually configure the infrastructure and its components.

While Java developers can bring their own Java runtimes from different vendors to Azure on these services, Microsoft recommends that you use any of the following OpenJDK distributions:

* [Microsoft Build of OpenJDK][msjdk-link]
* [Eclipse Adoptium Temurin][temurin-link]

For information on how to install and use OpenJDK, see the documentation for one of these distributions.

[msjdk-link]: https://www.microsoft.com/openjdk
[temurin-link]: https://www.adoptium.net

## Customer support

For issues related to the deployment of Java applications to Azure, Azure Stack services, Azure Arc enabled clusters, and integration with Azure REST APIs, customers with a [qualifying support plan](https://azure.microsoft.com/support/plans/) receive support without any extra cost.

---
title: Java JDKs and medium- and long-term support for Azure development
description: This article provides downloads and a statement of Azure support for developing and running Java applications.
ms.date: 04/09/2019
ms.topic: conceptual
ms.custom: seo-java-september2019, devx-track-java
---

# Java long-term support and medium-term support on Azure and Azure Stack

Java developers on Azure and Azure Stack can build and run production Java applications by using the [Azul Zulu for Azure - Enterprise Edition](https://www.azul.com/downloads/azure-only/zulu/) JDK builds without incurring additional support costs. You can use any Java runtime you want on Azure. But when you use Zulu, you get free maintenance updates and can create support tickets with Microsoft.

Releases designated as long-term support (LTS) are the same LTS releases designated by Oracle and the OpenJDK community. For LTS releases, we provide at least 8 years of access to bug fixes, security updates, and other (Production Support) fixes as needed. We also provide 2 years of additional support intended to advise and assist users who are migrating to a newer JDK version (Extended Support).

For those releases designated as medium-term support (MTS), we provide Production Support for at least 1.5 years after the general availability of the next LTS release. We also provide an additional 1 year of Extended Support.

> [!div class="nextstepaction"]
> [Download and install Java](java-jdk-install.md)

## Long-term support (LTS)

* [Java 11](https://www.azul.com/downloads/azure-only/zulu/?&version=java-11-lts)
* [Java 8](https://www.azul.com/downloads/azure-only/zulu/?&version=java-8-lts)
* [Java 7](https://www.azul.com/downloads/azure-only/zulu/?&version=java-7-lts)

## Medium-term support (MTS)

* [Java 13](https://www.azul.com/downloads/azure-only/zulu/?&version=java-13)

## Technical preview

* [Java 14](https://www.azul.com/downloads/azure-only/zulu/?version=java-14)

## What is the Zulu OpenJDK for Azure?

Azul Zulu for Azure - Enterprise Edition builds of OpenJDK are free, multiplatform, production-ready distributions of the OpenJDK for Azure and Azure Stack. They're backed by Microsoft and Azul Systems. These distributions are:

* 100% open-source builds of OpenJDK packaged as Java Development Kits (JDKs), Java Runtime Environments (JREs), and headless JREs. These binaries are fully compatible and compliant commercial builds of Java Standard Edition (SE) that can be used with Java applications or components on Azure and Azure Stack.
* Provided with long-term support, including bug fixes, performance enhancements, and security patches.
* Available for developing and running Java applications on Windows, Linux, and macOS.
* Available as container images on Docker Hub and as virtual machines (Windows and Linux) on Azure Marketplace.
* Used by Microsoft Azure to power many Azure services, such as:
  * App Service on Windows
  * App Service on Linux
  * Azure Functions
  * Azure Service Fabric
  * Azure HDInsight
  * Azure Cognitive Search
  * Azure DevOps
  * Azure Cloud Shell  

## Supported Java versions and update schedule

Azul Systems provides fully supported [Azul Zulu for Azure - Enterprise Edition](https://www.azul.com/downloads/azure-only/zulu/) builds for all long-term support (LTS) and medium-term support (MTS) versions of Java, including Java SE 7, 8, 11, and 13. For more information, see the [Azul press release](https://www.azul.com/press_release/free-java-production-support-for-microsoft-azure-azure-stack) and the [Azul Product Support Lifecycle](https://www.azul.com/products/azul_support_roadmap/) roadmap.

|Java SE version  |Supported until  |
|---------|----------|
|[![Java 7 logo](media/supported-java-versions-java-7.png)](https://www.azul.com/downloads/azure-only/zulu/?&version=java-7-lts) |July 2023 (LTS)|
|[![Java 8 logo](media/supported-java-versions-java-8.png)](https://www.azul.com/downloads/azure-only/zulu/?&version=java-8-lts) |December 2030 (LTS)|
|[![Java 11 logo](media/supported-java-versions-java-11.png)](https://www.azul.com/downloads/azure-only/zulu/?&version=java-11-lts) |September 2027 (LTS)|
|[![Java 13 logo](media/supported-java-versions-java-13.png)](https://www.azul.com/downloads/azure-only/zulu/?&version=java-13) |March 2023 (MTS)|
|[![Java 14 logo](media/supported-java-versions-java-14.png)](https://www.azul.com/downloads/azure-only/zulu/?version=java-14) |**Preview**|

LTS and MTS JDK releases have quarterly security updates, bug fixes, and critical out-of-band updates and patches as needed. This support includes backports to Java 7 and 8 of security updates and bug fixes reported in newer versions of Java, like Java 11. This backporting ensures the continued stability and security of older versions of Java. Azure customers can get these security updates and platform bug fixes without incurring any unplanned Java SE subscription fees.

Currently, Azure Functions requires Java 8, and support for Java 11 is still in development.

## Benefits for developers

The Azul Zulu for Azure - Enterprise Edition JDK releases:

- Are backed and supported by both Microsoft and Azul Systems.

   * Zulu binaries are production-ready and backed by Microsoft and Azul Systems.
   * Zulu comes with free long-term support (LTS) for Java 7, 8, and 11 and medium-term support (MTS) for Java 13. (LTS will be provided for Java 17 as well.) You can upgrade Java versions only when you need to.
   * Java 7 is supported until July 2023. Java 8 is supported until December 2030. Java 11 is supported until September 2027. Java 13 is supported until March 2023.
   * Microsoft is committed to running Zulu internally on machines that power many Azure services.

- Are production ready.

   * 100% open source for its builds of OpenJDK.
   * Drop-in replacements for many Java SE distributions.
   * JDK, JRE, and headless JRE.
   * Java 7, 8, 11, and 13.
   * Verified compliant with Java SE specifications via the OpenJDK Community Technology Compatibility Kit (TCK).
   * Include production updates for Java SE, including bug fixes, performance enhancements, and security patches for Java SE 7, 8, 11, and 13.

- Are supported for multiplatform. Zulu supports binaries for multiple platforms and versions:

   * Windows
     * 10
     * 8.1
     * 8
     * 7
   * Windows Server
     * 2016 R2
     * 2016
     * 2012 R2
     * 2012
     * 2008 R2
   * Linux
     * RHEL
     * CentOS
     * Ubuntu
     * SLES
     * Debian
     * Oracle Linux
   * Mac OS X
   * Delivered in multiple package types:
     * MSI, ZIP, tar, deb, RPM, and DMG

     Certified Docker container images for Zulu JDK, JRE, and headless JRE on multiple base OS images are available at Docker Hub:

     * [JDK](https://hub.docker.com/_/microsoft-java-jdk)
     * [JRE](https://hub.docker.com/_/microsoft-java-jre)
     * [Headless JRE](https://hub.docker.com/_/microsoft-java-jre-headless)

- Are free.

   * Microsoft provides everything you need to build and scale Java apps on Azure for free. Through Zulu, you'll receive free security updates and platform bug fixes for Java apps.
   * [Java Flight Recorder and Zulu Mission Control](java-jdk-flight-recorder-and-mission-control.md) are available in Zulu Java 8, 11, and later.

- Include technical previews of non-LTS/MTS versions.

   * Technical previews let you progressively test new features as they're delivered in short-term versions that will eventually graduate to Java 17 LTS.

- Include upstreamed changes to OpenJDK.
   * Azul Systems committers push Zulu changes to OpenJDK. These commits make the upstream repo comprehensive and inclusive.

As always, Java developers can bring their own Java runtimes, including Oracle JDK and Red Hat JDK, to Azure and use the secure infrastructure and feature-rich services. The production edition of Oracle Java SE is also available to Java developers for running Java workloads in Windows or Linux virtual machines on Azure.

## Use for local development

Developers can [download Java JDKs for Azure and Azure Stack](https://www.azul.com/downloads/azure-only/zulu/) for use in local development environments. Downloads are available for Windows, Linux, and macOS. Developers working on Linux can also get packages through the [yum](https://www.azul.com/downloads/azure-only/zulu/#yum-repo) and [apt](https://www.azul.com/downloads/azure-only/zulu/#apt-repo) package managers.

For more information, see [Docker images for Azure](java-jdk-docker-images.md).

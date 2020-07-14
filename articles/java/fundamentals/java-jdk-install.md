---
# Mandatory fields.
title: Install the Azul Zulu JDK for Azure and Azure Stack
description: How to install the Azul Zulu Java Development Kits (JDKs) for Azure development with Windows, Linux, and Mac
ms.date: 04/19/2019
ms.topic: conceptual
ms.custom: devx-track-java
---

# Install the JDK for Azure and Azure Stack

The Azul Zulu for Azure - Enterprise Edition JDK builds are a no-cost, multi-platform, production-ready distribution of the OpenJDK for Azure and Azure Stack backed by Microsoft and Azul Systems. They contain all the components for building and running Java SE applications.

There are [multiple download package types supported for each client OS](https://www.azul.com/downloads/azure-only/zulu/). You can also [get virtual machine images from the Azure Marketplace Gallery](#get-virtual-machine-images-from-the-azure-marketplace-gallery).

> [!NOTE]
> The following instructions target the 64-bit Java 8 version of the JDK. Azul also provides the Java Run-time Environment (JRE) as a stand-alone installation. The JRE is included with the JDK install.
>
> Java 11 packages are also provided on [Azul's Azure downloads page](https://www.azul.com/downloads/azure-only/zulu/).

## Download and install the Azul Zulu for Azure - Enterprise Edition JDK builds for Windows

1. Download the 64-bit Azul Zulu JDK 8 as an MSI:

   * [zulu-8-azure-jdk_8.44.0.11-8.0.242-win_x64.msi](http://repos.azul.com/azure-only/zulu/packages/zulu-8/8u242/zulu-8-azure-jdk_8.44.0.11-8.0.242-win_x64.msi)
   * Or check for a [later Zulu 8 version](http://repos.azul.com/azure-only/zulu/packages/zulu-8) of the *.msi* file.

   Save it to a location on your client, such as `C:\Users\<your_login>\Downloads`. (.ZIP packages are also provided on [Azul's Azure downloads page](https://www.azul.com/downloads/azure-only/zulu/).)

2. Navigate to the directory and double-click the downloaded MSI file to begin installation.

## Download and install the Azul Zulu for Azure - Enterprise Edition JDK builds for Mac

These steps download a ZIP file to your Mac. There is also a DMG version available.

1. Download the 64-bit Azul Zulu JDK 8 as a ZIP file:

   * [zulu-8-azure-jdk_8.44.0.11-8.0.242-macosx_x64.zip](http://repos.azul.com/azure-only/zulu/packages/zulu-8/8u242/zulu-8-azure-jdk_8.44.0.11-8.0.242-macosx_x64.zip)
   * Or check for a [later Zulu 8 version](http://repos.azul.com/azure-only/zulu/packages/zulu-8) of the *.zip* file.

   Save it to a location on your client, such as `/Library/Java/JavaVirtualMachines/`. (.DMG packages are also provided on [Azul's Azure downloads page](https://www.azul.com/downloads/azure-only/zulu/).)

2. Launch Finder, navigate to the download directory, and double-click the ZIP file. Alternatively, you can launch a terminal command window, navigate to the directory, and run:

    ```cli
    unzip <name_of_zulu_package>.zip
    ```

## Download and install the Azul Zulu for Azure - Enterprise Edition JDK builds for Alpine Linux

1. Download the 64-bit Azul Zulu JDK 8 as a TAR file

   * [zulu-8-azure-jdk_8.44.0.11-8.0.242-linux_x64.tar.gz](http://repos.azul.com/azure-only/zulu/packages/zulu-8/8u242/zulu-8-azure-jdk_8.44.0.11-8.0.242-linux_x64.tar.gz)
   * Or check for a [later Zulu 8 version](https://repos.azul.com/azure-only/zulu/packages/zulu-8) of the *.tar.gz* file.

   Save it to a location on your client, such as `/usr/lib/jvm`. (.RPM and .DEB packages are also provided on [Azul's Azure downloads page](https://www.azul.com/downloads/azure-only/zulu/).)

2. Go to your directory and run the following command to unzip and expand the file:

    ```cli
    tar -xvf <name_of_zulu_package>.tar
    ```

## Confirm your installation

To confirm your installation, go to the command-line and run `java -version`.

The output of the command should be similar to the following example:

```cli
$ java -version

openjdk version "1.8.0_242"
OpenJDK Runtime Environment (Zulu 8.44.0.11-linux64)-Microsoft-Azure-restricted (build 1.8.0_242-b20)
OpenJDK 64-Bit Server VM (Zulu 8.44.0.11-linux64)-Microsoft-Azure-restricted (build 25.242-b20, mixed mode)
```

## Get virtual machine images from the Azure Marketplace Gallery

You can get a virtual machine image for the following platforms:

* [Azul Zulu: Java 8 on Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/azul.azul-zulu8-ubuntu-1804)
* [Azul Zulu: Java 8 on Windows Server 2019](https://azuremarketplace.microsoft.com/marketplace/apps/azul.azul-zulu8-windows-2019)
* [Azul Zulu: Java 11 on Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/azul.azul-zulu11-ubuntu-1804)
* [Azul Zulu: Java 11 on Windows Server 2019](https://azuremarketplace.microsoft.com/marketplace/apps/azul.azul-zulu11-windows-2019)

## Download and install the Azul Zulu for Azure - Enterprise Edition JDKs from a Yum repository

The Azul Zulu JDKs are provided in a [Yum repository](https://repos.azul.com/azure-only/zulu-azure.repo) by Azul.

**To install the Azul Zulu JDK for Java 8, run the following commands from your CLI:**

```cli
sudo rpm --import http://repos.azul.com/azul-repo.key
sudo curl http://repos.azul.com/azure-only/zulu-azure.repo -o /etc/yum.repos.d/zulu-azure.repo
sudo yum -q -y update
sudo yum -q -y install zulu-8-azure-jdk
```

For Java 11, run:

```cli
sudo rpm --import http://repos.azul.com/azul-repo.key
sudo curl http://repos.azul.com/azure-only/zulu-azure.repo -o /etc/yum.repos.d/zulu-azure.repo
sudo yum -q -y update
sudo yum -q -y install zulu-11-azure-jdk
```

For Java 13 (Preview), run:

```cli
sudo rpm --import http://repos.azul.com/azul-repo.key
sudo curl http://repos.azul.com/azure-only/zulu-azure.repo -o /etc/yum.repos.d/zulu-azure.repo
sudo yum -q -y update
sudo yum -q -y install zulu-13-azure-jdk
```

**To update a Zulu JDK 8 package from a Yum repository:**

```cli
sudo yum -q -y install zulu-8-azure-jdk
```

(Change the version number in the command above if you are using a different version.)

**To remove a Zulu JDK 8 package from a Yum repository:**

```cli
sudo yum -y erase zulu-8-azure-jdk
```

(Change the version number in the command above if you are using a different version.)

## Download and install the Azul Zulu JDKs from an apt-get repository

The Azul Zulu JDKs are also provided in an [apt-get repository](https://repos.azul.com/azure-only/zulu/apt) by Azul.

**To install the Azul Zulu JDK for Java 8 with apt-get, run the following commands from your CLI:**

```cli
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 0xB1998361219BD9C9
sudo apt-add-repository "deb http://repos.azul.com/azure-only/zulu/apt stable main"
sudo apt-get -q update
sudo apt-get -y install zulu-8-azure-jdk
```

For Java 11, run:

```cli
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 0xB1998361219BD9C9
sudo apt-add-repository "deb http://repos.azul.com/azure-only/zulu/apt stable main"
sudo apt-get -q update
sudo apt-get -y install zulu-11-azure-jdk
```

For Java 13 (Preview), run:

```cli
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 0xB1998361219BD9C9
sudo apt-add-repository "deb http://repos.azul.com/azure-only/zulu/apt stable main"
sudo apt-get -q update
sudo apt-get -y install zulu-13-azure-jdk
```

**To update a Zulu JDK 8 package from an apt-get repository:**

```cli
sudo apt-get -q update
sudo apt-get -y install zulu-8-azure-jdk
```

The previous release will be automatically removed.
(Change the version number in the command above if you are using a different version.)

**To remove a Zulu JDK 8 package from an apt-get repository:**

```cli
sudo apt-get -y purge zulu-8-azure-jdk
```

(Change the version number in the command above if you are using a different version.)

For more detailed guidance on preparing, installing, and managing your Azul Zulu JDKs for Azure development, read [the official Zulu docs](https://docs.azul.com/zulu/zuludocs/index.htm).

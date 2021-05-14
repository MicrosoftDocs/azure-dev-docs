---
# Mandatory fields.
title: Install a JDK for Azure development
description: How to install a Java Development Kit (JDK) for Azure development with Windows, Linux, and Mac.
ms.date: 04/19/2019
ms.topic: conceptual
ms.custom: devx-track-java
---

# Install the JDK

Java developers can use any JDK to build applications for Azure. This page will help developers get started with the Azul System's Zulu build of OpenJDK.

The Azul Zulu builds are a no-cost, multi-platform, production-ready distribution of the OpenJDK that can be used for developing Java applications for Azure and Azure Stack. They contain all the components for building and running Java SE applications.

There are [multiple download package types supported for each client OS](https://www.azul.com/downloads/zulu/). 

> [!NOTE]
> The following instructions target the 64-bit Java 11 version of the JDK.
> 

## Windows and macOS

### Download and install the Azul Zulu build of OpenJDK for Windows

1.  Visit the following URL and download the latest 64-bit Azul Zulu JDK 11 as an MSI.

   * [zulu-11-jdk_windows](https://www.azul.com/downloads/?version=java-11-lts&os=windows&architecture=x86-64-bit&package=jdk#download-openjdk)

2. Navigate to the directory and double-click the downloaded MSI file to begin installation.

### Download and install the Azul Zulu build of OpenJDK for Mac

1. Visit the following URL and download the latest 64-bit Azul Zulu JDK 11 as a DMG file.

   * [zulu-11-jdk_macosx](https://www.azul.com/downloads/?version=java-11-lts&os=macos&architecture=x86-64-bit&package=jdk#download-openjdk)
   
2. Launch Finder, navigate to the download directory, and double-click the DMG file.

### Confirm your installation

To confirm your installation, go to the command-line and run `java -version` and verify you have the Zulu Build OpenJDK 11 installed.

## Linux

The Azul Zulu Builds of OpenJDK are also provided as DEB, RPM, and extractable TAR.GZ packages.

Please visit [Azul Zulu Builds of OpenJDK for more information on Linux](https://www.azul.com/downloads/#download-openjdk).

## Learn more

For more detailed guidance on preparing, installing, and managing your Azul Zulu Builds of OpenJDK, read [the official Zulu docs](https://docs.azul.com/zulu/zuludocs/index.htm).

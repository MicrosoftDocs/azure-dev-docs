---
# Mandatory fields.
title: Install a JDK for Azure development
description: How to install a Java Development Kit (JDK) for Azure development with Windows, Linux, and Mac.
ms.date: 04/19/2019
ms.topic: conceptual
ms.custom: devx-track-java
---

# Install the JDK

You can use any JDK to build Java applications for Azure. This article will help you get started with the Azul Systems Zulu build of OpenJDK for Azure.

The Azul Zulu builds are a no-cost, multi-platform, production-ready distribution of the OpenJDK that you can use for developing Java applications for Azure and Azure Stack. They contain all the components for building and running Java SE applications.

There are [multiple download package types supported for each client OS](https://www.azul.com/downloads/azure-only/).

> [!NOTE]
> The following instructions target the 64-bit Java 11 version of the JDK.
>

## Windows and macOS

### Download and install the Azul Zulu build of OpenJDK for Windows

1. Visit the following URL and download the latest 64-bit Azul Zulu JDK 11 as an MSI.

   * [zulu-11-jdk_windows](https://www.azul.com/downloads/azure-only/?version=java-11-lts&os=windows&architecture=x86-64-bit&package=jdk)

2. Navigate to the directory and double-click the downloaded MSI file to begin installation.

### Download and install the Azul Zulu build of OpenJDK for Mac

1. Visit the following URL and download the latest 64-bit Azul Zulu JDK 11 as a DMG file.

   * [zulu-11-azure-jdk_macosx](https://www.azul.com/downloads/azure-only/?version=java-11-lts&os=macos&architecture=x86-64-bit&package=jdk)

2. Launch Finder, navigate to the download directory, and double-click the DMG file.

### Confirm your installation

To confirm your installation, go to the command-line, run `java -version`, and verify you have the Zulu Build OpenJDK 11 installed.

## Linux

The Azul Zulu Builds of OpenJDK are also provided as DEB, RPM, and extractable TAR.GZ packages.

For more information on Linux, see [Azul Zulu Builds of OpenJDK](https://www.azul.com/downloads/azure-only/).

## Learn more

For more detailed guidance on preparing, installing, and managing your Azul Zulu Builds of OpenJDK, see [the official Zulu docs](https://docs.azul.com/zulu/zuludocs/index.htm).

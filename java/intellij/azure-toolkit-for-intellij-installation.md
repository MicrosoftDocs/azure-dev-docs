---
title: Installing the Azure Toolkit for IntelliJ
description: Learn how to install the Azure Toolkit for IntelliJ plug-in to create and deploy cloud applications to Azure.
services: ''
documentationcenter: java
author: rmcmurray
manager: routlaw
editor: ''

ms.assetid: c6817c7b-f28c-4c06-8216-41c7a8117de3
ms.author: robmcm
ms.date: 02/01/2018
ms.devlang: Java
ms.service: multiple
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: na
---

# Installing the Azure Toolkit for IntelliJ

The Azure Toolkit for IntelliJ provides templates and functionality that allow you to easily create, develop, test, and deploy cloud application to Azure using the IntelliJ IDEA development environment.

> [!NOTE] 
> 
> The Azure Toolkit for IntelliJ is an Open Source project, whose source code is available under the MIT License from the project's site on GitHub at the following URL: 
> 
> <https://github.com/microsoft/azure-tools-for-java> 
> 

There are two methods of installing the Azure Toolkit for IntelliJ: by using the **Settings** dialog box, and by using the **Configure** menu on the start screen. Both installation methods will be demonstrated in the following steps.

## Prerequisites

The Azure Toolkit for IntelliJ requires to the following software components:

* An Java Development Kit (JDK) 8+ installed, for example: [OpenJDK](https://openjdk.java.net/) or [Oracle JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* An [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) Ultimate Edition or Community Edition installed

> [!NOTE]
> 
> The [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053) page at the JetBrains Plugin Repository lists the builds that are compatible with the toolkit.
> 

<!--
> [!IMPORTANT]
> 
> If you are using the Azure Toolkit for IntelliJ on Windows, the toolkit requires installing the Azure SDK 2.9.6 or later in order to use the Azure emulator. You have two options for installing the Azure SDK:
> 
> * You can download and install the Azure SDK by using the [Web Platform Installer (WebPI)](http://go.microsoft.com/fwlink/?LinkID=252838).
> * If you do not have the Azure SDK installed when you create your first Azure deployment project, you will be prompted to automatically download install the requisite version of the Azure SDK.
> 
> Note that the Azure SDK is only required on Windows.
> 
-->


## To install the Azure Toolkit for IntelliJ from the settings dialog box

1. Start IntelliJ IDEA.

1. When the IntelliJ IDEA opens, click **File**, then click **Settings**.
   
   ![Open the IntelliJ IDEA Settings Dialog Box][01a]

1. In the Settings dialog box, click **Plugins**, and then click **Browse repositories**.
   
   ![IntelliJ IDEA Settings Dialog Box][02a]

1. In the **Browse Repositories** dialog box, type "Azure" in the search box. Highlight **Azure Toolkit for IntelliJ**, and then click **Install**.
   
   ![Search for the Azure Toolkit for IntelliJ][03]
   
   IntelliJ IDEA displays the installation progress in a dialog box.
   
   ![Installation progress][04]

1. When the installation has completed, click **Restart IntelliJ IDEA**.
   
   ![Restart IntelliJ IDEA][05]

1. Click **OK** to close the Settings dialog box.
   
   ![Close IntelliJ IDEA Settings Dialog Box][06]

1. When prompted to restart IntelliJ IDEA or postpone, click **Restart**.
   
1   ![Restart IntelliJ IDEA][07]

## To install the Azure Toolkit for IntelliJ from the start screen

1. Start IntelliJ IDEA.

1. When the IntelliJ IDEA start screen appears, click **Configure**, then click **Plugins**.
   
   ![Install IntelliJ IDEA Plugins][01b]

1. In the **Plugins** dialog box, click **Browse repositories**.
   
   ![Browse IntelliJ IDEA Plugin Repositories][02b]

1. In the **Browse Repositories** dialog box, type "Azure" in the search box. Highlight **Azure Toolkit for IntelliJ**, and then click **Install**.
   
   ![Search for the Azure Toolkit for IntelliJ][03]
   
   IntelliJ IDEA will display the installation progress in a dialog box.
   
   ![Installation progress][04]

1. When the installation has completed, click **Restart IntelliJ IDEA**.
   
   ![Restart IntelliJ IDEA][05]

1. When prompted to restart IntelliJ IDEA or postpone, click **Restart**.
   
   ![Restart IntelliJ IDEA][07]

## Next steps

[!INCLUDE [azure-toolkit-for-intellij-additional-resources](../includes/azure-toolkit-for-intellij-additional-resources.md)]

<!-- URL List -->

<!-- IMG List -->

[01a]: media/azure-toolkit-for-intellij-installation/01-intellij-file-settings.png
[01b]: media/azure-toolkit-for-intellij-installation/01-intellij-configure-dropdown.png
[02a]: media/azure-toolkit-for-intellij-installation/02-intellij-settings-dialog.png
[02b]: media/azure-toolkit-for-intellij-installation/02-intellij-plugins-dialog.png
[03]: media/azure-toolkit-for-intellij-installation/03-intellij-browse-repositories.png
[04]: media/azure-toolkit-for-intellij-installation/04-install-progress.png
[05]: media/azure-toolkit-for-intellij-installation/05-restart-intellij.png
[06]: media/azure-toolkit-for-intellij-installation/06-intellij-settings-dialog.png
[07]: media/azure-toolkit-for-intellij-installation/07-restart-intellij.png

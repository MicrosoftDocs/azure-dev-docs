---
title: Installing the Azure Toolkit for IntelliJ
description: Learn how to install the Azure Toolkit for IntelliJ plug-in to create and deploy cloud applications to Azure.
documentationcenter: java
ms.assetid: c6817c7b-f28c-4c06-8216-41c7a8117de3
ms.date: 09/09/2020
ms.service: multiple
ms.tgt_pltfrm: multiple
ms.topic: article
ms.custom: devx-track-java
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
> * You can download and install the Azure SDK by using the [Web Platform Installer (WebPI)](https://go.microsoft.com/fwlink/?LinkID=252838).
> * If you do not have the Azure SDK installed when you create your first Azure deployment project, you will be prompted to automatically download install the requisite version of the Azure SDK.
> 
> Note that the Azure SDK is only required on Windows.
> 
-->


## From the settings dialog box

1. On the IntelliJ toolbar, click **File**, then click **Settings**.

1. On the left-hand navigation menu of the Settings dialog box, click **Plugins**.

1. On the **Marketplace** search bar, type "Azure" to filter the list of plugins. Select **Azure Toolkit for IntelliJ**, and then click **Install**. Read IntelliJ's *Third-party Plugins Privacy Note* and click **Accept**.

   :::image type="content" source="media/installation/03-intellij-search-plugin.png" alt-text="Search for the Azure Toolkit for IntelliJ plugin."::: 

1. When the installation has completed, click **Restart IDE**.

1. When prompted to restart IntelliJ IDEA, click **Restart**.
   
   :::image type="content" source="media/installation/07-restart-intellij.png" alt-text="Restart IntelliJ IDEA."::: 

## From the start screen

1. On the IntelliJ IDEA start screen, click **Configure**, then click **Plugins**.

   :::image type="content" source="media/installation/01-intellij-configure-dropdown.png" alt-text="Plugins from the start screen."::: 

1. On the **Marketplace** search bar, type "Azure" to filter the list of plugins. Select **Azure Toolkit for IntelliJ**, and then click **Install**. Read IntelliJ's *Third-party Plugins Privacy Note* and click **Accept**.

   :::image type="content" source="media/installation/01-intellij-start-screen-marketplace.png" alt-text="Plugins marketplace from the start screen.":::

1. When the installation has completed, click **Restart IDE**.

1. When prompted to restart IntelliJ IDEA, click **Restart**.
   
   :::image type="content" source="media/installation/01-intellij-start-screen-marketplace-restart.png" alt-text="Plugins marketplace from the start screen.":::

## Next steps

[!INCLUDE [additional-resources](includes/additional-resources.md)]


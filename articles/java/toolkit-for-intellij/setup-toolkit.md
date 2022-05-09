---
title: Install the Azure Toolkit for IntelliJ
description: This tutorial shows you how to install and configure the Toolkit as an IntelliJ IDE plugin
keywords: java, intellij, set up quick start
documentationcenter: java
ms.date: 05/09/2022
ms.author: jialuogan
ms.service: multiple
ms.topic: article
ms.workload: web
ms.custom: devx-track-java
---

# Install the Azure Toolkit for IntelliJ

To start using the Azure Toolkit for IntelliJ right away, you will need to install the plugin in [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) at first.
This article provides two options to install:

- [Install and configure Azure Toolkit for IntelliJ from Marketplace](#install-and-configure-azure-toolkit-for-IntelliJ-from-marketplace)
- [Install and configure Azure Toolkit for IntelliJ from Disk](#install-and-configure-azure-toolkit-for-intelliJ-from-disk)


[!INCLUDE [basic-prerequisites](includes/basic-prerequisites.md)]


## Install and configure Azure Toolkit for IntelliJ from Marketplace


1. Ensure that an [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) Ultimate Edition or Community Edition is installed and running.

1. Click **File**, and then open **Settings**.

1. Choose **Plugins**, and Search plugins on the **Marketplace** tab, beigin entering *Azure Toolkit*.

1. When **Azure Toolkit for IntelliJ by Microsoft** is displayed, Choose it.

   ![Find the plugin in the Marketplace][SI01]

1. Choose **Install** and restart your IDE if prompted.


## Install and configure Azure Toolkit for IntelliJ from Disk

You can manually get installed releases of [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij/versions) as they become available, as follows.

1. Download the released file from [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij/versions) with lastest version.

1. Ensure that an [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) Ultimate Edition or Community Edition is installed and running.

1. Click **File**, and then open **Settings**.

1. Choose **Plugins**, and then choose **Manage Repositories, Configure Proxy or Install Plugin from Disk**(the settings icon).

1. Click  **Install Plugin from Disk...**.

1. Select the plugin archive file and click **OK**.

1. Click **OK** to apply the changes and restart your IDE if prompted.



## Next steps

After you install the Azure Toolkit as an IDE plugin, see [sign in with your Azure account](sign-in-instructions.md) to connect the toolkit to that account.

[!INCLUDE [additional-resources](includes/additional-resources.md)]


<!-- IMG List -->

[SI01]: media/setup-toolkit/SI01.png

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
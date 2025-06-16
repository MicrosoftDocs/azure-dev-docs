---
title: Install the Azure Toolkit for IntelliJ
description: Shows you how to install the Azure Toolkit as an IntelliJ IDEA plugin.
ms.date: 07/01/2022
author: KarlErickson
ms.author: karler
ms.reviewer: jialuogan
ms.topic: install-set-up-deploy
ms.custom: devx-track-java, devx-track-extended-java
---

# Install the Azure Toolkit for IntelliJ

This article shows you how to install the Azure Toolkit for IntelliJ as an IntelliJ IDEA plugin.

There are two options for installing the toolkit. You can install from the Marketplace, or you can download the toolkit release file and install it manually. The following sections describe these options.

## Prerequisites

- [IntelliJ IDEA](https://www.jetbrains.com/idea/download/), Ultimate or Community edition
- A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).

## Install Azure Toolkit for IntelliJ from the Marketplace

Use the following steps to install from the Marketplace:

1. Launch IntelliJ IDEA.

1. Select **File** and then open **Settings**.

1. Select **Plugins**, then use the search box on the **Marketplace** tab to search for **Azure Toolkit**.

1. When **Azure Toolkit for IntelliJ by Microsoft** is displayed, select it.

   :::image type="content" source="media/install-toolkit/settings-plugins.png" alt-text="Screenshot of IntelliJ IDEA showing the Plugins section of the Settings dialog box with the Azure Toolkit for IntelliJ in the search results." lightbox="media/install-toolkit/settings-plugins.png":::

1. Select **Install**, then restart your IDE if prompted.

## Install Azure Toolkit for IntelliJ from Disk

Use the following steps to manually install new releases as they become available:

1. Download the released file from the [Marketplace page for Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij/versions). Select the version compatible with your IDE.

1. Launch IntelliJ IDEA.

1. Select **File** and then open **Settings**.

1. Select **Plugins** and then select **Manage Repositories, Configure Proxy or Install Plugin from Disk** (the settings icon).

1. Select **Install Plugin from Disk...**.

1. Select the plugin archive file and then select **OK**.

1. Select **OK** to apply the changes and restart your IDE if prompted.

## Next steps

After you install the Azure Toolkit as an IDE plugin, sign in with your Azure account to connect the toolkit to that account. For more information, see [Sign-in instructions for the Azure Toolkit for IntelliJ](sign-in-instructions.md).

[!INCLUDE [additional-resources](includes/additional-resources.md)]

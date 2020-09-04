---
title: Installing the Azure Toolkit for Eclipse
description: Learn how to install the Azure Toolkit for Eclipse plug-in to create and deploy cloud applications to Azure.
documentationcenter: java
ms.assetid: 9e93ff6a-f42b-4d99-b55b-624136b4a730
ms.date: 08/25/2020
ms.service: multiple
ms.tgt_pltfrm: multiple
ms.topic: article
ms.custom: devx-track-java
---

# Installing the Azure Toolkit for Eclipse

There are two ways to install the Azure Toolkit for Eclipse on your Eclipse IDE:

  - [Eclipse marketplace](#eclipse-marketplace)
  - [Install new software](#install-new-software)

> [!NOTE] 
> 
> The Azure Toolkit for Eclipse is an Open Source project, whose source code is available under the MIT License from the project's site on GitHub at the following URL: 
> 
> <https://github.com/microsoft/azure-tools-for-java> 
> 

[!INCLUDE [basic-prerequisites](includes/basic-prerequisites.md)]

## Eclipse Marketplace

The Eclipse Marketplace wizard in the Eclipse IDE allows users to browse the [Eclipse Marketplace](https://marketplace.eclipse.org/) and install solutions. The following two options take you to the Eclipse Marketplace:

   * Drag the following button to your running Eclipse workspace. This button opens the Eclipse Marketplace with the Azure Toolkit for Eclipse already selected.

      [![Drag to your running Eclipse* workspace. *Requires Eclipse Marketplace Client](https://marketplace.eclipse.org/sites/all/themes/solstice/public/images/marketplace/btn-install.png)](http://marketplace.eclipse.org/marketplace-client-intro?mpc_install=1919278 "Drag to your running Eclipse* workspace. *Requires Eclipse Marketplace Client")

   * On the Eclipse IDE, click the **Help** menu, navigate to **Eclipse Marketplace**, search for "Azure Toolkit for Eclipse", and click **Install**.

      :::image type="content" source="media/installation/eclipse-marketplace-button.png" alt-text="Marketplace window, Help menu."::: 

1. An Eclipse Marketplace wizard will pop up with installation instructions, including a list of components that will be installed. Verify that all features are selected and click **Confirm >**.

   | Feature | Description | 
   |---|---| 
   | **Application Insights Plugin for Java** | Allows you to use Azure's telemetry logging and analysis services for your applications and server instances. | 
   | **Azure Common Plugin** | Provides the common functionality needed by other toolkit components. | 
   | **Azure Container Tools for Eclipse** | Enables you to build and deploy a .WAR as a Docker container to a docker machine. | 
   | **Azure Containers for Eclipse** | Enables you to deploy a .WAR or .JAR artifact as a Docker container to an Azure virtual machine. | 
   | **Azure Explorer for Eclipse** | Provides an explorer-style interface for managing your Azure resources. | 
   | **Azure HDInsight plugin for Java** | Enables Apache Spark application development in Scala. |
   | **Microsoft JDBC Driver 6.1 for SQL Server** | Provides JDBC API for SQL Server and Microsoft Azure SQL Database for Java Platform Enterprise Edition 8. | 
   | **Package for Microsoft Azure Libraries for Java** | Provides APIs for accessing Microsoft Azure services, such as storage, service bus, service runtime, etc. | 
   | **WebApp Plugin for Eclipse** | Enables you to deploy your web applications as Azure App Services. | 

1. In the **Review Licenses** dialog, review the terms of the license agreements. If you accept the terms of the license agreements, click **I accept the terms of the license agreements**, and then click **Finish**. 

   > [!NOTE]
   > You can check the installation progress on the lower-right corner of your Eclipse workspace.

4. Once installation has completed, you will be prompted to restart the Eclipse IDE to apply the software update. Click **Restart Now**.

## Install new software

You can install the Azure Toolkit for Eclipse directly from the *Help* menu in the form of new software.

1. Click the **Help** menu, and then click **Install New Software**.

   :::image type="content" source="media/installation/eclipse-install-software-button.png" alt-text="Marketplace window, Help menu."::: 

1. In the **Available Software** dialog, type `http://dl.microsoft.com/eclipse/` in the **Work with** text box.

1. In the **Name** pane, check **Azure Toolkit for Java**, and uncheck **Contact all update sites during install to find required software**. Your screen should appear similar to the following:

   ![Installing the Azure Toolkit for Eclipse][02]

1. If you expand **Azure Toolkit for Java**, you will see a list of components that will be installed; for example:

   | Feature | Description | 
   |---|---| 
   | **Application Insights Plugin for Java** | Allows you to use Azure's telemetry logging and analysis services for your applications and server instances. | 
   | **Azure Common Plugin** | Provides the common functionality needed by other toolkit components. | 
   | **Azure Container Tools for Eclipse** | Enables you to build and deploy a .WAR as a Docker container to a docker machine. | 
   | **Azure Containers for Eclipse** | Enables you to deploy a .WAR or .JAR artifact as a Docker container to an Azure virtual machine. | 
   | **Azure Explorer for Eclipse** | Provides an explorer-style interface for managing your Azure resources. | 
   | **Azure HDInsight plugin for Java** | Enables Apache Spark application development in Scala. |
   | **Microsoft JDBC Driver 6.1 for SQL Server** | Provides JDBC API for SQL Server and Microsoft Azure SQL Database for Java Platform Enterprise Edition 8. | 
   | **Package for Microsoft Azure Libraries for Java** | Provides APIs for accessing Microsoft Azure services, such as storage, service bus, service runtime, etc. | 
   | **WebApp Plugin for Eclipse** | Enables you to deploy your web applications as Azure App Services. | 

1. Click **Next**. (If you experience unusual delays when installing the toolkit, ensure that **Contact all update sites during install to find required software** is unchecked.)

1. In the **Install Details** dialog, click **Next**.

1. In the **Review Licenses** dialog, review the terms of the license agreements. If you accept the terms of the license agreements, click **I accept the terms of the license agreements** and then click **Finish**. (The remaining steps assume you do accept the terms of the license agreements. If you do not accept the terms of the license agreements, exit the installation process.)

   > [!NOTE]
   > You can check the installation progress on the lower-right corner of your Eclipse workspace.

1. If prompted to restart Eclipse to complete installation, click **Restart Now**.

## Next steps

[!INCLUDE [additional-resources](includes/additional-resources.md)]

<!-- URL List -->

<!-- Legacy MSDN URL = https://msdn.microsoft.com/library/azure/hh690946.aspx -->

<!-- IMG List -->
[02]: media/installation/eclipse-installation-02.png

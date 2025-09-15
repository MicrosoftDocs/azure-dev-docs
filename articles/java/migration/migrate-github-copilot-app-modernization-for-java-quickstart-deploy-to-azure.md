---
title: "Quickstart: deploy your project to Azure using GitHub Copilot App Modernization for Java"
titleSuffix: GitHub Copilot App Modernization for Java - Azure
description: Shows you how to deploy your migrated Java application to Azure
author: JiDong
ms.author: donji
ms.reviewer: 
ms.topic: quickstart
ms.date: 09/03/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Quickstart: deploy your project to Azure using GitHub Copilot App Modernization for Java

This quickstart shows you how to deploy your project to Azure when you use GitHub Copilot App Modernization for Java.
In code development, developers often need to deploy their project to a cloud environment for testing. Our tools help deploy your migrated project to Azure and fix any deployment errors in the process.

## Prerequisites

- A GitHub account with [GitHub Copilot](https://github.com/features/copilot) enabled. A Pro, Pro+, Business, or Enterprise plan is required.
- The latest version of [Visual Studio Code](https://code.visualstudio.com/). Must be version 1.101 or later.
- The latest version of the [GitHub Copilot extension in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview).
- [GitHub Copilot App Modernization](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-app-mod-pack) extension pack. For install instructions, see [Quickstart: assess and migrate a Java project using GitHub Copilot App Modernization for Java](migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate.md).

  This extension pack bundles the following two extensions:
  - [GitHub Copilot App Modernization for Java](migrate-github-copilot-app-modernization-for-java.md)
  - [GitHub Copilot App Modernization - upgrade for Java](/java/upgrade/overview)

  App Modernization doesn't require Java in your local environment. However, to build your project successfully, install the correct version of Java and Maven. We recommend the [Microsoft Build of OpenJDK](/java/openjdk/) and [Maven](https://maven.apache.org/download.cgi).

- [AppCAT](/azure/migrate/appcat/java). This tool is required for the app assessment feature.

## Deploy your project

Use the following steps to start your deployment process:
1.	In Visual Studio Code, open your migrated project.

1.	In the **Activity** sidebar, open the **App Modernization for Java** extension pane. In the Tasks section, open **Deploy tasks** and select **Deploy to Existing Azure Infrastructure** or **Provision Infrastructure and Deploy to Azure**.

      :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/java-deploy-to-azure.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/java-deploy-to-azure.png" alt-text="Screenshot of Visual Studio Code that shows the button for deploy to Azure.":::

1. If you choose **Deploy to Existing Azure Infrastructure**, Copilot will ask your for your existing resource group during the deployment process. It will analyze your resource group and deploy to the corresponding compute resource.

1. If you choose **Provision Infrastructure and Deploy to Azure**, Copilot will provision new Azure resources for you to test your application and deploy to that resource.

1. After you select the task, the Copilot chat window with Agent Mode opens automatically.

1. Select **Continue** repeatedly to confirm each tool action in the Copilot Chat window. The Copilot Agent uses various tools to facilitate deployment to Azure. Each tool's usage requires confirmation by selecting **Continue**. Provide Copilot with the necessary information, like subscription and resource group, as it prompts you.

1. Copilot typically goes through the following steps to deploy your project:
   * Copilot generates a plan.copilot.md file with the deployment goal, project information, Azure resource architecture, Azure resources, and execution steps.
   * Copilot follows the execution steps in plan.md.
   * Copilot fixes deployment errors.
   * Copilot generates a summary.md explaining the results of the deployment.

## Notes
* We recommend using Claude Sonnet 4 or later models for the best results.

* It might take Copilot a few iterations to correct deployment errors.


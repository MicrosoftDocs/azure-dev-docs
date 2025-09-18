---
title: "Quickstart: containerize your project using GitHub Copilot App Modernization"
titleSuffix: Azure
description: Quickstart guide for containerizing a project using GitHub Copilot app modernization
author: KarlErickson
ms.author: karler
ms.reviewer: donji
ms.topic: quickstart
ms.date: 09/23/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Quickstart: containerize your project using GitHub Copilot app modernization

This quickstart shows you how to containerize your project using GitHub Copilot app modernization.

To utilize container compute services like Azure Kubernetes Service and Azure Container Apps, developers need to containerize their project by creating Dockerfile and other related config files, and build container images. Our tools help you complete the containerization process.

## Prerequisites

- A GitHub account with [GitHub Copilot](https://github.com/features/copilot) enabled. A Pro, Pro+, Business, or Enterprise plan is required.
- The latest version of [Visual Studio Code](https://code.visualstudio.com/). Must be version 1.101 or later.
- The latest version of the [GitHub Copilot extension in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview).
- [GitHub Copilot app modernization](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-app-mod-pack) extension pack. For install instructions, see [Quickstart: assess and migrate a Java project using GitHub Copilot app modernization](migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate.md).

  This extension pack bundles the following two extensions:
  - [GitHub Copilot app modernization](migrate-github-copilot-app-modernization-for-java.md)
  - [GitHub Copilot app modernization - upgrade for Java](/java/upgrade/overview)

  GitHub Copilot app modernization doesn't require Java in your local environment. However, to build your project successfully, install the correct version of Java and Maven. We recommend the [Microsoft Build of OpenJDK](/java/openjdk/) and [Maven](https://maven.apache.org/download.cgi).

- [AppCAT](/azure/migrate/appcat/java). This tool is required for the app assessment feature.

## Containerize your project

Use the following steps to start your containerization process:
1. Make sure you have docker installed and running.

1. In Visual Studio Code, open your migrated project.

1. In the **Activity** sidebar, open the **App modernization** extension pane. In the Tasks section, open **Migration Tasks** and select **Containerize Application**.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/java-containerize.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/java-containerize.png" alt-text="Screenshot of Visual Studio Code that shows the button for containerize project":::

1. After you select the task, the Copilot chat window with Agent Mode opens automatically.

1. Select **Continue** repeatedly to confirm each tool action in the Copilot Chat window. The Copilot Agent uses various tools to facilitate containerization. Each tool's usage requires confirmation by selecting **Continue**.

1. Copilot typically goes through the following steps to containerize your project:

   - Check if docker is installed and running.
   - Check if application code is ready to run in container.
   - Create Dockerfile for each project.
   - Build docker images for each project.
   - Create a summary of the containerization results.

## Notes

- We recommend using Claude Sonnet 4 or later models for the best results.
- It might take Copilot a few iterations to correct containerization errors.

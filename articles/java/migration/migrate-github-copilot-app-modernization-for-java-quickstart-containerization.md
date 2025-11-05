---
title: "Quickstart: Containerize Your Java Project Using GitHub Copilot App Modernization"
titleSuffix: Azure
description: Shows you how to containerize your Java project using GitHub Copilot app modernization.
author: KarlErickson
ms.author: karler
ms.reviewer: donji
ms.topic: quickstart
ms.date: 09/23/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Quickstart: containerize your Java project using GitHub Copilot app modernization

In this Quickstart, you containerize your Java project using GitHub Copilot app modernization.

To use container compute services like Azure Kubernetes Service and Azure Container Apps, developers need to containerize their project by creating Dockerfile and other related configuration files, and build container images. Our tools help you complete the containerization process.

## Prerequisites

[!INCLUDE [prerequisites](includes/migrate-github-copilot-app-modernization-for-java-quickstart-prerequisites.md)]

## Containerize your project

Use the following steps to start your containerization process:

1. Make sure you have Docker installed and running.

1. In Visual Studio Code, open your migrated project.

1. In the **Activity** sidebar, open the **GitHub Copilot app modernization** extension pane.

1. In the **Tasks** section, open **Common Tasks**, then open **Containerize Tasks** and select **Containerize Application**.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/java-containerize.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/java-containerize.png" alt-text="Screenshot of Visual Studio Code that shows the Containerize Application task with the Run Task button highlighted.":::

1. After you select the task, the Copilot chat window with Agent Mode opens automatically.

1. Select **Continue** repeatedly to confirm each tool action in the Copilot Chat window. The Copilot Agent uses various tools to facilitate containerization. Each tool's usage requires confirmation by selecting **Continue**.

1. Copilot typically goes through the following steps to containerize your project:

   - Checks that docker is installed and running.
   - Checks that the application code is ready to run in a container.
   - Creates a Dockerfile for each project.
   - Builds docker images for each project.
   - Creates a summary of the containerization results.

> [!NOTE]
> We recommend using Claude Sonnet 4 or later models for the best results.
>
> It might take Copilot a few iterations to correct containerization errors.

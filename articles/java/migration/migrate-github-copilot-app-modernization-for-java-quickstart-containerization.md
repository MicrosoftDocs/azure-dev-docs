---
title: "Quickstart: Containerize your project by using GitHub Copilot app modernization"
titleSuffix: Azure
description: Shows you how to containerize your project by using GitHub Copilot app modernization.
author: houk-ms
ms.author: honc
ms.reviewer: karler
ms.topic: quickstart
ms.date: 03/05/2026
ai-usage: ai-assisted
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Quickstart: Containerize your project by using GitHub Copilot app modernization

In this quickstart, you containerize your project by using GitHub Copilot app modernization.

To use container compute services like Azure Kubernetes Service and Azure Container Apps, you need to containerize your project by creating a Dockerfile and other related configuration files, and build container images. The GitHub Copilot app modernization extension automates this containerization process.

## Prerequisites

- A GitHub account with an active [GitHub Copilot](https://github.com/features/copilot) subscription under any plan.
- One of the following IDEs:
  - The latest version of [Visual Studio Code](https://code.visualstudio.com/) (version 1.106 or later) with the following extensions:
    - [GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview). For setup instructions, see [Set up GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/setup). Be sure to sign in to your GitHub account within Visual Studio Code.
    - [GitHub Copilot app modernization](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure). Restart Visual Studio Code after installation.
  - The latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download) (version 2023.3 or later) with the following plugins:
    - [GitHub Copilot](https://plugins.jetbrains.com/plugin/17718-github-copilot) (version 1.5.59 or later). Be sure to sign in to your GitHub account within IntelliJ IDEA.
    - [GitHub Copilot app modernization](https://plugins.jetbrains.com/plugin/28791-github-copilot-app-modernization). Restart IntelliJ IDEA after installation.
- [Docker](https://www.docker.com/) installed and running.

## Containerize your project

Use the following steps to start the containerization process:

1. Make sure you have Docker installed and running.

1. In Visual Studio Code, open your migrated project.

1. In the **Activity** sidebar, open the **GitHub Copilot app modernization** extension pane.

1. In the **Tasks** section, open **Containerize Tasks** and select **Containerize Application**.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/java-containerize.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/java-containerize.png" alt-text="Screenshot of Visual Studio Code that shows the Containerize Application task with the Run Task button highlighted.":::

1. After you select the task, the Copilot chat window with Agent Mode opens automatically.

1. Select **Continue** repeatedly to confirm each tool action in the Copilot Chat window. The Copilot Agent uses various tools to facilitate containerization. Each tool's usage requires confirmation by selecting **Continue**.

1. Copilot typically goes through the following steps to containerize your project:

   - Checks that Docker is installed and running.
   - Checks that the application code is ready to run in a container.
   - Creates a Dockerfile for each project.
   - Builds Docker images for each project.
   - Creates a summary of the containerization results.

> [!NOTE]
> We recommend using Claude Sonnet 4 or later models for the best results.
>
> It might take Copilot a few iterations to correct containerization errors.

## Customize with your own prompts

The **Containerize Application** button sends a predefined prompt. For more control, type a custom prompt directly in the Copilot chat with Agent Mode. This approach lets you specify containerization preferences for your project.

> [!TIP]
> Example prompts for different scenarios:
>
> - `"Containerize my application using a multi-stage Dockerfile to minimize the final image size"`—optimize for production image size.
> - `"Create a Dockerfile for my project using Eclipse Temurin 21 as the base image"`—specify a particular base image.
> - `"Containerize all modules in this multi-module project and create a docker-compose.yml for local testing"`—handle multi-module projects with compose.
> - `"Containerize my app and push the image to my Azure Container Registry: <acr-name>.azurecr.io"`—build and push in one step.

## See also

- GitHub Copilot app modernization uses certain tools in containerization assist. For more information, see the [containerization-assist](https://github.com/Azure/containerization-assist) repository on GitHub.
- [GitHub Copilot app modernization documentation](../../github-copilot-app-modernization/index.yml)

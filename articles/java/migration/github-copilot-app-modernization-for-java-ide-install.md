---
title: Install GitHub Copilot modernization in your IDE
description: Shows you how to install GitHub Copilot modernization inside Visual Studio Code or IntelliJ IDEA.
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: quickstart
ms.date: 06/02/2026
ms.custom: devx-track-java
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Install GitHub Copilot modernization in your IDE

This article shows you how to install the GitHub Copilot modernization extension for Visual Studio Code or the GitHub Copilot modernization plugin for IntelliJ IDEA. After installation, you can use GitHub Copilot modernization to upgrade Java applications, migrate them to Azure, and modernize them without leaving your IDE.

## Prerequisites

- A GitHub account with [GitHub Copilot](https://github.com/features/copilot) enabled. You need a Free Tier, Pro, Pro+, Business, or Enterprise plan.
- [Java JDK](/java/openjdk/download) for both the source and target JDK versions.
- [Maven](https://maven.apache.org/download.cgi) or [Gradle](https://gradle.org/install/) to build Java projects.
- A Git-managed Java project that uses Maven or Gradle.
- For Maven-based projects, access to the public Maven Central repository.

> [!NOTE]
> [!INCLUDE [Azure account note](../../includes/github-copilot-modernization-azure-note.md)]
>
> [!INCLUDE [Gradle Kotlin note](../../includes/github-copilot-modernization-gradle-kotlin-note.md)]

## Install GitHub Copilot modernization

Select the tab that matches the IDE you use, and then follow the steps to install GitHub Copilot modernization.

### [Visual Studio Code](#tab/vscode)

Before you install the extension, make sure you have the following IDE prerequisites in place:

- [Visual Studio Code](https://code.visualstudio.com/) version 1.101 or later.
- [GitHub Copilot for Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview). For setup instructions, see [Set up GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/setup). Be sure to sign in to your GitHub account within Visual Studio Code.
- In the Visual Studio Code settings, make sure `chat.extensionTools.enabled` is set to `true`. Your organization might control this setting.

To install the extension, use the following steps:

1. In Visual Studio Code, open the **Extensions** view from the Activity Bar.
1. Search for **GitHub Copilot modernization** in the marketplace.
1. Select **GitHub Copilot modernization** in the results.
1. On the extension page, select **Install**.
1. Restart Visual Studio Code.

After installation completes, you should see a confirmation notification in Visual Studio Code.

For more information, see [Install a VS Code extension](https://code.visualstudio.com/docs/getstarted/extensions#_install-a-vs-code-extension) and the [GitHub Copilot modernization marketplace listing](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure).

### [IntelliJ IDEA](#tab/intellij)

Before you install the plugin, make sure you have the following IDE prerequisites in place:

- [IntelliJ IDEA](https://www.jetbrains.com/idea/download) version 2023.3 or later.
- [GitHub Copilot](https://plugins.jetbrains.com/plugin/17718-github-copilot) plugin version 1.5.59 or later. For setup instructions, see [Set up GitHub Copilot in IntelliJ IDEA](https://docs.github.com/en/copilot/get-started/quickstart). Be sure to sign in to your GitHub account within IntelliJ IDEA. If you don't have the GitHub Copilot plugin installed, you can install GitHub Copilot modernization directly.

> [!NOTE]
> [!INCLUDE [IntelliJ note](../../includes/github-copilot-modernization-intellij-note.md)]

To install the plugin, use the following steps:

1. In IntelliJ IDEA, open **Settings** > **Plugins**.
1. Select the **Marketplace** tab and search for **GitHub Copilot modernization**.
1. On the **GitHub Copilot modernization** entry, select **Install**.
1. Restart IntelliJ IDEA when prompted.

For the marketplace listing, see [GitHub Copilot modernization on the JetBrains Marketplace](https://plugins.jetbrains.com/plugin/28791-github-copilot-app-modernization).

> [!TIP]
> To get the best experience in IntelliJ IDEA, configure a few key settings after installation. For example, enable **Auto-approve** and **Trust MCP Tool Annotations** under **Tools** > **GitHub Copilot**. For more information, see [Configure settings for GitHub Copilot modernization to optimize the experience for IntelliJ](../../github-copilot-app-modernization/configure-settings-intellij.md).

---

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Upgrade a Java project with GitHub Copilot modernization](/java/upgrade/quickstart-upgrade)


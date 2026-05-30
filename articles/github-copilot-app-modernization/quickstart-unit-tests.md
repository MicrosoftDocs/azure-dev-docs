---
title: "Quickstart: Generate Java Unit Tests with GitHub Copilot Modernization"
description: Shows you how to generate Java unit tests using GitHub Copilot modernization.
author: KarlErickson
ms.author: karler
ms.reviewer: xinrzhu
ms.topic: quickstart
ms.date: 06/02/2026
ms.custom: devx-track-java
zone_pivot_group_filename: developer/github-copilot-app-modernization/github-copilot-app-modernization-zone-pivot-groups.json
zone_pivot_groups: java-upgrade
---

# Quickstart: generate Java unit tests with GitHub Copilot modernization

This quickstart shows you how to generate Java unit tests by using GitHub Copilot modernization.

## Prerequisites

- A GitHub account with [GitHub Copilot](https://github.com/features/copilot) enabled. You need a Free Tier, Pro, Pro+, Business, or Enterprise plan.
- [Java JDK](/java/openjdk/download) for the project's JDK version.
- [Maven](https://maven.apache.org/download.cgi) or [Gradle](https://gradle.org/install/) to build Java projects.
- A Git-managed Java project using Maven or Gradle.
- For Maven-based projects: access to the public Maven Central repository.

::: zone pivot="visual-studio-code"

- The latest version of [Visual Studio Code](https://code.visualstudio.com/). Must be version 1.113 or later.
- [GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview). For setup instructions, see [Set up GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/setup). Be sure to sign in to your GitHub account within Visual Studio Code.
- [GitHub Copilot modernization](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure). Restart Visual Studio Code after installation.

::: zone-end

::: zone pivot="intellij"

- The latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download). Must be version 2023.3 or later.
- [GitHub Copilot](https://plugins.jetbrains.com/plugin/17718-github-copilot). Must be version 1.5.59 or later. For more instructions, see [Set up GitHub Copilot in IntelliJ IDEA](https://docs.github.com/en/copilot/get-started/quickstart). Be sure to sign in to your GitHub account within IntelliJ IDEA.
- [GitHub Copilot modernization](https://plugins.jetbrains.com/plugin/28791-github-copilot-app-modernization). Restart IntelliJ IDEA after installation.

::: zone-end

::: zone pivot="cli"

- Install the [GitHub Copilot CLI](https://github.com/features/copilot/cli):

  ```bash
  npm install -g @github/copilot
  ```

- Install the GitHub Copilot modernization plugin:

  ```bash
  copilot plugin marketplace add microsoft/modernize-java
  copilot plugin install modernize-java@modernize-java
  ```

::: zone-end

> [!NOTE]
> [!INCLUDE [Azure account note](../includes/github-copilot-modernization-azure-note.md)]
>
> [!INCLUDE [Gradle Kotlin note](../includes/github-copilot-modernization-gradle-kotlin-note.md)]

## Generate unit tests

::: zone pivot="visual-studio-code"

Use the following steps to generate unit tests:

1. Open a Java project in Visual Studio Code.
1. Open the GitHub Copilot Chat panel.
1. Enter a prompt such as the following example:

   ```prompt
   Generate unit tests for this Java project using #appmod-generate-tests-for-java
   ```

::: zone-end

::: zone pivot="intellij"

Use the following steps to generate unit tests:

1. Open a Java project in IntelliJ IDEA.
1. Open the GitHub Copilot Chat panel and ensure **Agent Mode** is selected.
1. Enter a prompt such as the following example:

   ```prompt
   Generate unit tests for this Java project using #appmod-generate-tests-for-java
   ```

::: zone-end

::: zone pivot="cli"

Use the following steps to generate unit tests:

1. Open a terminal and navigate to your Java project directory.
1. Start the Copilot CLI:

   ```bash
   copilot --model claude-sonnet-4.6
   ```

1. Enter a prompt such as the following example:

   ```prompt
   Generate unit tests for this Java project using #appmod-generate-tests-for-java
   ```

::: zone-end

The agent analyzes the project, identifies source files lacking unit tests, and generates a **generate_tests.md** work log that tracks progress.

:::image type="content" source="media/quickstart-unit-tests/before-generation.png" alt-text="Screenshot of Visual Studio Code that shows the test generation plan and work log." lightbox="media/quickstart-unit-tests/before-generation.png":::

## Review the results

After test generation is complete, the work log shows a final summary comparing pre-generation and post-generation test results, including:

- Number of new test files created
- Total tests before and after generation
- Pass/fail status for each generated test class

The agent generates tests that follow the project's existing test patterns and validates that all tests pass before completing.

:::image type="content" source="media/quickstart-unit-tests/after-generation.png" alt-text="Screenshot of Visual Studio Code that shows the post-generation test summary." lightbox="media/quickstart-unit-tests/after-generation.png":::

## See also

[GitHub Copilot modernization](/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java?toc=/java/upgrade/toc.json&bc=/java/upgrade/breadcrumb/toc.json)

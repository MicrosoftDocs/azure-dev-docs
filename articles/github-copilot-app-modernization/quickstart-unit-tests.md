---
title: "Quickstart: Generate Java Unit Tests with GitHub Copilot App Modernization"
description: Shows you how to generate Java unit tests using GitHub Copilot app modernization.
author: NickZhu
ms.author: xinrzhu
ms.topic: quickstart
ms.date: 09/23/2025
ms.custom: devx-track-java
---

# Quickstart: generate Java unit tests with GitHub Copilot app modernization

This quickstart shows you how to generate Jave unit tests using GitHub Copilot app modernization.

## Prerequisites

- A GitHub account with [GitHub Copilot](https://github.com/features/copilot) enabled. A Pro, Pro+, Business, or Enterprise plan is required.
- The latest version of [Visual Studio Code](https://code.visualstudio.com/). Must be version 1.101 or later.
- [GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview). For setup instructions, see [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup). Be sure to sign in to your GitHub account within VS Code.
- [GitHub Copilot app modernization](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure). Restart VS Code after installation.
- [Java JDK](/java/openjdk/download) for both the source and target JDK versions.
- [Maven](https://maven.apache.org/download.cgi) or [Gradle](https://gradle.org/install/) to build Java projects.
- A Git-managed Java project using Maven or Gradle.
- For Maven-based projects: access to the public Maven Central repository.
- In the Visual Studio Code settings, make sure `chat.extensionTools.enabled` is set to `true`. This setting might be controlled by your organization.

> [!NOTE]
> If you're using Gradle, only the Gradle wrapper version 5+ is supported. The Kotlin DSL isn't supported.

## Sign in to use Copilot and then install the required extension

To use GitHub Copilot, sign in to your GitHub account in Visual Studio Code. Select the Copilot icon at the top of Visual Studio Code to access the GitHub Copilot pane. For more information about setting up GitHub Copilot, see [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup).

Then, use the following steps to install the extension in Visual Studio Code:

1. In Visual Studio Code, open the **Extensions** view from the Activity Bar.
1. Search for **GitHub Copilot app modernization** in the marketplace.
1. Select the **GitHub Copilot app modernization** extension pack.
1. On the extension page, select **Install**.
1. Restart Visual Studio Code.

After installation completes, you should see a notification in the corner of Visual Studio Code confirming success.

For more information, see [Install a VS Code extension](https://code.visualstudio.com/docs/getstarted/extensions#_install-a-vs-code-extension).

## Launch GitHub Copilot Agent Mode and start the upgrade

Use the following steps to launch GitHub Copilot Agent Mode and generate unit tests:

1. Select a Java project that uses either Maven or Gradle as its build tool.
1. Open the selected Java project in Visual Studio Code.
1. Open the GitHub Copilot Chat panel.
1. Switch to Agent Mode.
1. Enter a prompt such as **Generate unit tests for this Java project**.

:::image type="content" source="media/quickstart-unit-tests/before-generation.png" alt-text="Screenshot of Visual Studio Code that shows an example before unit test generation." lightbox="media/quickstart-unit-tests/before-generation.png":::

## Wait for the test generation to complete

GitHub Copilot app modernization analyzes the Java project within the current workspace. This includes evaluating the project's JDK version, build tools, and any existing unit tests.

As part of the process, the tool generates a **TestReport.md** file that tracks test generation progress and provides a summary of test results both before and after test generation. The report includes the following details:

- Total number of existing tests
- Overall pass rate
- Timestamp
- Number of successful tests
- Number of failed tests
- Number of tests with errors

During test generation, the output displays progress messages - for example, "Generating unit tests for ..." - to indicate ongoing activity. The tool automatically generates test files and adds them to the workspace.

## Review the generated tests

After test generation is complete, GitHub Copilot displays a detailed report summarizing the post-generation test results. This report includes the same metrics captured before test generation - such as the total number of tests, successes, failures, and errors - enabling you to easily compare and evaluate the changes introduced during the process.

:::image type="content" source="media/quickstart-unit-tests/after-generation.png" alt-text="Screenshot of Visual Studio Code that shows the unit test generation report." lightbox="media/quickstart-unit-tests/after-generation.png":::

## See also

[GitHub Copilot app modernization](/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java?toc=/java/upgrade/toc.json&bc=/java/upgrade/breadcrumb/toc.json)

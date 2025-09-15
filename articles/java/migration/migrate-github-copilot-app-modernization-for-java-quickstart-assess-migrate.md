---
title: "Quickstart: Assess and Migrate a Java Project Using GitHub Copilot App Modernization for Java"
titleSuffix: Azure
description: Shows you how to use GitHub Copilot App Modernization for Java to assess and migrate a Java project.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: quickstart
ms.date: 06/30/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Quickstart: assess and migrate a Java project using GitHub Copilot App Modernization for Java

This quickstart shows you how to use GitHub Copilot App Modernization for Java to assess and migrate a Java project. In this quickstart, you install and configure the extension, then assess and migrate a sample project. For example, you use a predefined task to update an Azure SQL database connection to use Azure Managed Identity instead of a username and password.

The following video demonstrates how GitHub Copilot App Modernization for Java uses [AppCAT](/azure/migrate/appcat/java) to help assess a Java project for migration to Azure:

<br>

> [!VIDEO https://www.youtube.com/embed/eX8rSMd4Dls]

## Prerequisites

- A GitHub account with [GitHub Copilot](https://github.com/features/copilot) enabled. A Pro, Pro+, Business, or Enterprise plan is required.
- The latest version of [Visual Studio Code](https://code.visualstudio.com/). Must be version 1.101 or later.
- The latest version of the [GitHub Copilot extension in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview).
- [GitHub Copilot app modernization for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure).
- [Java 21](/java/openjdk/download) or later.
- [Maven](https://maven.apache.org/download.cgi) or [Gradle](https://gradle.org/install/) to build Java projects.


## Sign in to use Copilot and then install App Modernization

To use GitHub Copilot, sign in to your GitHub account in Visual Studio Code. Select the Copilot icon at the top of Visual Studio Code to access the GitHub Copilot pane. For more information about setting up GitHub Copilot, see [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup).

Then, use the following steps to install GitHub Copilot App Modernization for Java:

1. In Visual Studio Code, open the **Extensions** view from the Activity Bar.
1. Search for **GitHub Copilot App Modernization** in the marketplace.
1. Select the **GitHub Copilot App Modernization for Java** extension or the **GitHub Copilot App Modernization** extension pack.
1. On the extension page, select **Install**.
1. Restart Visual Studio Code.

After installation completes, you should see a notification in the corner of Visual Studio Code confirming success.

For more information, see [Install a VS Code extension](https://code.visualstudio.com/docs/getstarted/extensions#_install-a-vs-code-extension).

## Upgrade JDK and dependencies version
Here are 2 ways to upgrade JDK version:
On the sidebar, select the **Github Copilot app modernization for Java** pane, one way is to click **Upgrade Runtime & Frameworks** in the **QUICKSTART** section, another is to run **Upgraded Java Runtime** task in the **TASKS - Upgrade Tasks** section. See [Quickstart: upgrade a Java project with GitHub Copilot App Modernization - upgrade for Java](https://learn.microsoft.com/java/upgrade/quickstart-upgrade) for more information.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/upgrade-jdk-version.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/upgrade-jdk-version.png" alt-text="Screenshot of Visual Studio Code that shows how to upgrade JDK.":::

Use the following steps to upgrade Spring framework or third-party dependency:
Run **Upgrade Java Framework** task in the **TASKS - Upgrade Tasks** section. See [Upgrade a framework or third-party dependency by using GitHub Copilot App Modernization – upgrade for Java](https://learn.microsoft.com/java/upgrade/framework-upgrade) for more information.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/upgrade-framework-version.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/upgrade-framework-version.png" alt-text="Screenshot of Visual Studio Code that shows how to upgrade framework.":::

## Assess cloud readiness

Use the following steps to start your migration process with solution assessment. This assessment helps you understand what your cloud readiness challenges are and how impactful they are, provides recommended solutions. A solution recommendation includes references to set up Azure resources, add configurations, and make code changes.

1. Clone the [Java migration copilot samples](https://github.com/Azure-Samples/java-migration-copilot-samples) repository and then check out to the **source** branch.

1. In Visual Studio Code, open the **mi-sql-public-demo** project folder in the samples repository.

1. On the sidebar, select the **Github Copilot app modernization for Java** pane, you can click **Migrate to Azure** button or click **Run Assessment** in the **ASSESSMENT** section.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/run-assessment.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/run-assessment.png" alt-text="Screenshot of Visual Studio Code that shows how to generate assessment report.":::

1. Then the GitHub Copilot chat window with agent mode is opened to call the modernization assessor to execute the App Modernization assessment, click **Continue** to confirm.

1. The modernization assessor now opens **appcat.log**. This file will show the logs for running AppCAT, which performs the app assessment, click **Continue** to confirm again. 

1. The modernization assessor verifies your local environment first. If the AppCAT and its dependencies aren't installed, agent will help to install. After installation, it calls AppCAT to assess the current project. This step could take several minutes to complete.

1. Upon completion of the analysis, the modernization assessor produces a categorized view of cloud readiness issues in an opened **Assessment Report**.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/assessment-report.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/assessment-report.png" alt-text="Screenshot of the Visual Studio Code pane that shows the summary report of the assessment.":::

1. When reviewing the summary report, you can select **Migrate to Azure SQL Database (Spring)** from the solution list under the issue **Database Migration (Microsoft SQL)**. Then, select **Run Task** to move to the code remediation stage.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/confirm-sql-solution.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/confirm-sql-solution.png" alt-text="Screenshot of the Visual Studio Code Solution pane with the Migrate to Azure SQL Database option selected and the Confirm Solution button highlighted.":::

## Apply a predefined task

The migration Copilot provides predefined tasks for common migration scenarios that you might face when migrating to Azure. For example, with the **mi-sql-public-demo** sample, the **Database Migration (Microsoft SQL)** task changes the Azure SQL database connection to use Azure Managed Identity instead of a username and password.

1. In the **Assessment Report**, select **Run Task**. The Copilot chat window opens with Agent Mode.

1. The Copilot agent uses various tools for App Modernization and each tool may require confirmation to proceed. **plan.md** and **progress.md** will be generated first, you can review the **plan.md** and make changes there, if necessary.

1. Then manually input **continue** to confirm and start the migration process.

1. Before doing code changes, agent will check the version control system status and checkout a new branch for migration.

1. Repeatedly click or input **Continue** to confirm the use of tools or commands and wait for the code changes to be finished.

### Validation Iteration

After code changes, manually input **continue** to proceed with the validation and fix iteration loop. It includes five parts:

- Apply the Validate-CVEs tool

1. This tool attempts to detected CVEs in current dependencies and fix them.

- Apply the Build-Project tool

1. This tool attempts to resolve any build errors.

- Apply the Consistency-Validation tool

1. This tool analyzes the codes for functional consistency.

- Apply the Run-Test tool

1. This tool analyzes the project for unit test failures and automatically generates a plan to fix them.

1. The Run-Test tool iteratively runs unit tests and fixes any failures.

- Apply the Completeness-Validation tool

1. This tool catches migration items missed in initial code migration and fix them.

After all processes completes, input **continue** to generate the migration summary as the final step. Review the code changes and confirm them by selecting **Keep**.

## More Tasks
This extension also integrates other interesting tools:

### Generate Unit Test Cases
1. On the sidebar, select the **Github Copilot app modernization for Java** pane, open **Quality & Security Tasks** in the **TASKS** section and click **Generate Unit Test Cases**.

1. Then it will start generate unit tests and create a **TestReport** to show test results before and after generation. See [Quickstart: generate unit tests with GitHub Copilot App Modernization - upgrade for Java](https://learn.microsoft.com/java/upgrade/quickstart-unit-tests) for more information.

## Next step

[Quickstart: create and apply your own tasks](migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task.md)

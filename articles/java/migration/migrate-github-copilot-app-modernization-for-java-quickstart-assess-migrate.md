---
title: Assess and Migrate a Java Project Using GitHub Copilot modernization
titleSuffix: Azure
description: Learn how to assess and migrate a Java project to Azure using GitHub Copilot modernization. Follow this quickstart to streamline your migration process.
author: KarlErickson
ms.author: karler
ms.reviewer: haozhan
ms.topic: quickstart
ms.date: 03/20/2026
ms.custom: devx-track-java
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
zone_pivot_group_filename: developer/java/java-zone-pivot-groups.json
zone_pivot_groups: ide-set-one
---

# Quickstart: assess and migrate a Java project using GitHub Copilot modernization

This quickstart shows you how to use GitHub Copilot modernization to assess and migrate a Java project. In this quickstart, you install and configure the extension, then assess and migrate a sample project. For example, you use a predefined task to update an Azure SQL database connection to use Azure Managed Identity instead of a username and password.

The following video demonstrates how GitHub Copilot modernization uses [AppCAT](/azure/migrate/appcat/java) to help assess a Java project for migration to Azure:

<br>

> [!VIDEO https://www.youtube.com/embed/eX8rSMd4Dls]

::: zone pivot="vscode"
[!INCLUDE [quickstart-assess-migrate-visual-studio-code.md](./includes/quickstart-assess-migrate-visual-studio-code.md)]
::: zone-end

::: zone pivot="intellij"
[!INCLUDE [quickstart-assess-migrate-intellij-idea.md](./includes/quickstart-assess-migrate-intellij-idea.md)]
::: zone-end

## Apply a predefined task

For migration, Copilot provides predefined tasks for common migration scenarios that you might face when migrating to Azure. For example, by using the `mi-sql-public-demo` sample, the **Database Migration (Microsoft SQL)** task changes the Azure SQL database connection to use Azure Managed Identity instead of a username and password.

To apply a predefined task, use the following steps:

1. In the **Assessment Report**, select **Run Task**. The Copilot chat window opens with Agent Mode selected.

1. The Copilot agent uses various tools for GitHub Copilot modernization, and each tool might require confirmation to proceed. The agent first generates `plan.md` and `progress.md`. You can review `plan.md` and make changes there, if necessary.

1. Manually enter **continue** to confirm and start the migration process.

1. Before it makes any code changes, the agent checks the version control system status and checks out a new branch for migration.

1. Repeatedly select or enter **Continue** to confirm the use of tools or commands, and wait for the code changes to finish.

> [!NOTE]
> In Visual Studio Code, GitHub Copilot modernization uses the `AppModernization` custom agent with Claude Sonnet 4.5 by default for best results when updating Java code to migrate to Azure. It falls back to the `auto` model if Sonnet 4.5 isn't available to you. You can configure the custom agent to [modify the `model` setting](https://code.visualstudio.com/docs/copilot/customization/custom-agents#_custom-agent-file-structure) by selecting **Configure Custom Agents** from the **Agent** menu. Alternatively, you can use the language model picker in the chat window to switch models for the current chat session.

### Validation iteration

After you finish the code changes, manually enter **continue** to proceed with the validation and fix iteration loop. This loop includes the following five parts:

- Apply the `Validate-CVEs` tool. This tool attempts to detect Common Vulnerabilities and Exposures (CVEs) in current dependencies and fix them.
- Apply the `Build-Project` tool. This tool attempts to resolve any build errors.
- Apply the `Consistency-Validation` tool. This tool analyzes the code for functional consistency.
- Apply the `Run-Test` tool. This tool analyzes the project for unit test failures and automatically generates a plan to fix them. The `Run-Test` tool iteratively runs unit tests and fixes any failures.
- Apply the `Completeness-Validation` tool. This tool catches migration items missed in initial code migration and fixes them.

After all processes complete, enter **continue** to generate the migration summary as the final step. Review the code changes and confirm them by selecting **Keep**.

## Generate unit test cases

To generate unit test cases, use the following steps:

1. On the sidebar, select the **GitHub Copilot modernization** pane.

1. In the **TASKS** section, open **Quality & Security Tasks**, and then select **Generate Unit Test Cases**.

The agent generates unit tests and creates a **TestReport** to show test results before and after generation. For more information, see [Quickstart: generate unit tests with GitHub Copilot modernization](/java/upgrade/quickstart-unit-tests).

## Next steps

- [Working with assessment](migrate-github-copilot-app-modernization-for-java-working-with-assessment.md)
- [Quickstart: create and apply your own skills](migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task.md)

---
title: "Quickstart: Use GitHub Copilot App Modernization for Java (Preview) with Managed Identities Instead of Passwords"
titleSuffix: Azure
description: Shows you how to use GitHub Copilot app modernization for Java (preview) with managed identities instead of passwords.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: quickstart
ms.date: 05/19/2025
ms.custom: devx-track-java
ms.service: azure-java
---

# Quickstart: use GitHub Copilot app modernization for Java (preview) with managed identities instead of passwords

This quickstart shows you how to use GitHub Copilot app modernization for Java (preview) with managed identities instead of passwords.

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/): The latest version is recommended.
- [A GitHub account with GitHub Copilot enabled](https://github.com/features/copilot): All plans are supported, including the Free plan.
- [GitHub Copilot extension in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview): The latest version is recommended.
- [AppCAT](https://aka.ms/appcat-install): Required for the app assessment feature.

## Sign in to use Copilot

To use GitHub Copilot, sign in to your GitHub account in Visual Studio Code. Click the Copilot icon at the top of Visual Studio Code to access the GitHub Copilot pane. For more information about setting up GitHub Copilot, refer to [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup).

## Install

In Visual Studio Code, open the Extensions view from Activity Bar, search **GitHub Copilot App Modernization for Java (Preview)** extension in marketplace. Select the **Install** button on the extension. For more information about installing a Visual Studio Code extension, refer to [Install a VS Code extension](https://code.visualstudio.com/docs/getstarted/extensions#_install-a-vs-code-extension). After installation completes, you should see a notification in the bottom-right corner of Visual Studio Code confirming success.

## Configure

In Visual Studio Code, configure runtime arguments to enable the proposed API:

```json
"enable-proposed-api": ["Microsoft.migrate-java-to-azure"],
```

1. Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> and then select **Preferences: Configure Runtime Arguments**.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/configure-runtime-arguments.png" lightbox="./media/migrate-github-copilot-app-modernization-java-on-azure/configure-runtime-arguments.png" alt-text="Configure Runtime Arguments in Visual Studio Code":::

1. Add the above JSON snippet into the editor and save.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/config-api-for-extension.png" lightbox="./media/migrate-github-copilot-app-modernization-java-on-azure/config-api-for-extension.png" alt-text="Configure proposed API in Visual Studio Code runtime arguments":::

1. Restart Visual Studio Code.

## Assess cloud readiness

Start your migration process with solution assessment, to understand what your cloud readiness challenges are, how impactful they are and get recommended solutions. A solution can be references to set up Azure resources, adding configurations or making code changes.

1. Clone the [Java migration copilot samples](https://github.com/Azure-Samples/java-migration-copilot-samples) repository and open the `mi-sql-public-demo` project folder.

1. Click **App Modernization for Java** blade on the sidebar, and then click **Assess** button in Assessment section.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/assess-button-of-assessment.png" lightbox="./media/migrate-github-copilot-app-modernization-java-on-azure/assess-button-of-assessment.png" alt-text="Click Assess Button for Assessment":::

1. Now Github Copilot chat window with agent mode will be opened to call the modernization assessor to execute app modernization assessment. Please click **Continue** button to confirm.

1. The modernization assessor now opens assessment.md as the configuration for running AppCAT to do app assessment and asks for your confirmation to continue. You can examine its content and make changes if necessary there.

1. The modernization assessor will verify your local environment first. If the AppCAT and its dependencies are not installed, then they need to be installed first - more details to visit https://aka.ms/appcat-install. After that, it will call AppCAT to assess the current project. This step could take several minutes to complete.

1. Upon completion of the analysis, the modernization assessor produces a categorized view of cloud readiness issues in an opened summary report.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/assessment-summary-report.png" lightbox="./media/migrate-github-copilot-app-modernization-java-on-azure/assessment-summary-report.png" alt-text="Summary Report of Assessment":::

1. With reviewing the summary report, you can click on the **Propose Solution** button at the bottom and move to the next step: choose your desired solution per category/sub category.

1. Confirm the selection of the **Migrate to Azure SQL Database (SDK on Public Cloud)** solution by clicking on the **Confirm solution** button to proceed to the migration step. Then, click on the **Migrate** button for the **Migrate to Azure SQL Database (SDK on Public Cloud)** solution to move to the code remediation stage.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/confirm-sql-solution.png" lightbox="./media/migrate-github-copilot-app-modernization-java-on-azure/confirm-sql-solution.png" alt-text="Confirm Azure SQL Solution":::

## Apply a predefined formula

The migration Copilot provides predefined formulas for common migration scenarios that you may face when migrating to Azure. In this example you'll use the Managed Identity formulas to change your Azure SQL database connection from username and password to Azure Managed Identity.

1. After selecting **Migrate** in the **Solution Report**, Copilot chat window will be opened with Agent Mode.

1. Select **Continue** repeatedly to confirm each tool action in the Copilot Chat window. The Copilot Agent uses various tools to facilitate application modernization. Each tool's usage requires confirmation by clicking the `Continue` button.

1. After each step, manually input *continue* to confirm and proceed.

1. Wait the changed codes to be generated.

## Apply Build-fix

1. When the Java Application Build-Fix tool is suggested to run, select **Continue** to build the project and fix errors. This tool will attempt to resolve any build errors, in up to 10 iterations.

1. After the Build-Fix tool begins, select **Continue** to proceed and show progress.

1. After the process has completed, review the code changes and confirm them by selecting **Keep**.

## Next step

[Create and apply your own migration formula](migrate-github-copilot-app-modernization-java-on-azure-get-started-create-and-apply-your-own-formula.md)

---
title: "Quickstart: Upgrade a Java Project with GitHub Copilot App Modernization"
description: Shows you how to upgrade a Java project using GitHub Copilot app modernization.
author: KarlErickson
ms.author: karler
ms.reviewer: xinrzhu
ms.topic: quickstart
ms.date: 10/28/2025
ms.custom: devx-track-java
---

# Quickstart: upgrade a Java project with GitHub Copilot app modernization
App modernization Java upgrades support the following scenarios:

- Upgrade Java Development Kit (JDK) to Java 8, 11, 17, 21, or 25.
- Upgrade Spring Boot up to version 3.5.
- Upgrade Spring Framework up to version 6.2+.
- Upgrade Java EE to Jakarta EE, up to Jakarta EE 10.
- Upgrade JUnit.
- Upgrade [third-party dependencies](framework-upgrade.md) to a specified version.
- Upgrade Ant to Maven build.
  
This quickstart shows you how to upgrade a Java project using GitHub Copilot app modernization.

## Prerequisites

- A GitHub account with [GitHub Copilot](https://github.com/features/copilot) enabled. A Free Tier, Pro, Pro+, Business, or Enterprise plan is required.
- One of the following IDEs:
  - The latest version of [Visual Studio Code](https://code.visualstudio.com/). Must be version 1.101 or later.
    - [GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview). For setup instructions, see [Set up GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/setup). Be sure to sign in to your GitHub account within Visual Studio Code.
    - [GitHub Copilot app modernization](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure). Restart Visual Studio Code after installation.
  - The latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download). Must be version 2023.3 or later.
    - [GitHub Copilot](https://plugins.jetbrains.com/plugin/17718-github-copilot). Must be version 1.5.59 or later. For more instructions, see [Set up GitHub Copilot in IntelliJ IDEA](https://docs.github.com/en/copilot/get-started/quickstart). Be sure to sign in to your GitHub account within IntelliJ IDEA.
    - [GitHub Copilot app modernization](https://plugins.jetbrains.com/plugin/28791-github-copilot-app-modernization). Restart IntelliJ IDEA after installation. If you don't have GitHub Copilot installed, you can install GitHub Copilot app modernization directly.
    - For more efficient use of Copilot in app modernization: in the IntelliJ IDEA settings, select the **Tools** > **GitHub Copilot** configuration window, and then select **Auto-approve** and **Trust MCP Tool Annotations**. For more information, see [Configure settings for GitHub Copilot app modernization to optimize the experience for IntelliJ](configure-settings-intellij.md).
- [Java JDK](/java/openjdk/download) for both the source and target JDK versions.
- [Maven](https://maven.apache.org/download.cgi) or [Gradle](https://gradle.org/install/) to build Java projects.
- A Git-managed Java project using Maven or Gradle.
- For Maven-based projects: access to the public Maven Central repository.
- In the Visual Studio Code settings, make sure `chat.extensionTools.enabled` is set to `true`. This setting might be controlled by your organization.

> [!NOTE]
> If you're using Gradle, only the Gradle wrapper version 5+ is supported. The Kotlin Domain Specific Language (DSL) isn't supported.
>
> The function `My Tasks` isn't supported yet for IntelliJ IDEA.

## Sign in to use Copilot and then install the required extension

To use GitHub Copilot, sign in to your GitHub account in Visual Studio Code. Select the Copilot icon at the top of Visual Studio Code to access the GitHub Copilot pane. For more information about setting up GitHub Copilot, see [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup).

Then, use the following steps to install the extension in Visual Studio Code:

1. In Visual Studio Code, open the **Extensions** view from the Activity Bar.
1. Search for **GitHub Copilot app modernization** in the marketplace.
1. Select **GitHub Copilot app modernization**.
1. On the extension page, select **Install**.
1. Restart Visual Studio Code.

> [!TIP]
> To get the best experience in IntelliJ, we recommend configuring a few key settings. For more information, see [Configure settings for GitHub Copilot app modernization to optimize the experience for IntelliJ](configure-settings-intellij.md).

After installation completes, you should see a notification in the corner of Visual Studio Code confirming success.

For more information, see [Install a VS Code extension](https://code.visualstudio.com/docs/getstarted/extensions#_install-a-vs-code-extension).

## Select a Java project to upgrade

For the purposes of this tutorial, choose one of the following sample repositories:

- Maven: [uportal-messaging](https://github.com/UW-Madison-DoIT/uportal-messaging)
- Gradle: [docraptor-java](https://github.com/DocRaptor/docraptor-java)

## Launch GitHub Copilot Agent Mode and start the upgrade

Use the following steps to launch GitHub Copilot Agent Mode and start the upgrade process:

1. Open the selected Java project in Visual Studio Code.
1. Open the GitHub Copilot Chat panel.
1. Switch to Agent Mode.
1. Enter a prompt such as **Upgrade project to Java 21 using Java upgrade tools** or **Upgrade project to Java 21 and Spring Boot 3.2 using Java upgrade tools** to include framework information.

   > [!NOTE]
   > If you need to upgrade a framework or third-party dependency only, see [Upgrade a framework or third-party dependency by using GitHub Copilot app modernization](framework-upgrade.md).

1. When prompted, select **Continue** to generate an upgrade plan.

:::image type="content" source="media/quickstart-upgrade/plan.png" alt-text="Screenshot of Visual Studio Code that shows an example upgrade plan." lightbox="media/quickstart-upgrade/plan.png":::

## Review and edit the upgrade plan

GitHub Copilot app modernization analyzes the Java project in the current workspace, including its JDK, build tools, and dependencies. The tool generates a **plan.md** file that outlines the following planned changes:

- Source and target JDK versions.
- Framework and library upgrade paths.

Review the plan and make changes if needed, then select **Continue** to proceed. For information about further customization, such as adding more build tool parameters, see [Customize the upgrade plan](customize-upgrade-plan.md).

> [!TIP]
> Ensure that the plan matches your desired upgrade targets - for example, Java 8 to Java 21, Spring Boot 2.7 to 3.2.

:::image type="content" source="media/quickstart-upgrade/review-plan.png" alt-text="Screenshot of Visual Studio Code that shows an example upgrade plan with upgrade targets highlighted." lightbox="media/quickstart-upgrade/review-plan.png":::

## Apply code changes and fix build issues

GitHub Copilot then proceeds with the code transformation phase of the project. It uses an open-source tool called OpenRewrite to implement some code changes based on specific recipes. Then, AI addresses the remaining issues through a dynamic build/fix loop. You can monitor progress in the editor area of Visual Studio Code by checking the **progress.md** markdown file at any time.

At various stages of the process, GitHub Copilot prompts you to continue.

For the **Confirm the OpenRewrite transformation** step, select **Continue** to upgrade Java code using OpenRewrite. This step might take a few minutes.

For the **Approve the dynamic build/fix loop** step, select **Continue** to build the project and fix errors.

Copilot iterates and continues to fix errors until there are no more issues. Progress is shown in a **progress.md** file. The loop continues until the project builds successfully.

:::image type="content" source="media/quickstart-upgrade/build-fix.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot chat pane with Build-Fix output and the Continue button highlighted." lightbox="media/quickstart-upgrade/build-fix.png":::

## Check for vulnerabilities and code behavior changes

Under certain circumstances, the upgrade might cause code behavior changes or introduce libraries with Common Vulnerabilities and Exposures (CVE) issues. The tool performs an extra check for these issues.

When GitHub Copilot prompts **Run Validate if any modified dependencies have known CVEs**, select **Continue**.

If CVEs are found, GitHub Copilot Agent Mode attempts to fix them. Review the changes in VS Code and decide whether to keep them.

:::image type="content" source="media/quickstart-upgrade/common-vulnerabilities-exposures.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot chat pane with CVE output and the Continue button highlighted." lightbox="media/quickstart-upgrade/common-vulnerabilities-exposures.png":::

After the CVE check, when prompted to **Run Validate code behavior consistency**, select **Continue**.

If issues are found, GitHub Copilot Agent Mode tries to resolve them. Decide whether to keep or discard the changes.

After the checks complete, GitHub Copilot rebuilds the project and reruns the previous checks.

If minor issues remain that don't require immediate fixes, the upgrade is complete. Otherwise, GitHub Copilot goes back to address them.

:::image type="content" source="media/quickstart-upgrade/fixed.png" alt-text="Screenshot of Visual Studio Code that shows the editor with a fixed line." lightbox="media/quickstart-upgrade/fixed.png":::

## View the summary

After the upgrade, the tool generates a summary in the **summary.md** file, which includes the following information:

- Project information.
- Lines of code changed.
- Updated dependencies.
- Summarized code changes.
- Fixed CVE security and code inconsistency issues, if any.
- Unaddressed minor CVE issues.

:::image type="content" source="media/quickstart-upgrade/summary.png" alt-text="Screenshot of Visual Studio Code that shows the Upgrade Java Project summary content." lightbox="media/quickstart-upgrade/summary.png":::

## Next step

[Quickstart: generate unit tests with GitHub Copilot app modernization](quickstart-unit-tests.md)

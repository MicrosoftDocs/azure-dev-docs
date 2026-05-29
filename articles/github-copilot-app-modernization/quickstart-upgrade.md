---
title: "Quickstart: Upgrade a Java Project with GitHub Copilot Modernization"
description: Learn how to upgrade your Java project to Java 21 or Java 25, Spring Boot up to 4.0, and other frameworks using GitHub Copilot modernization. Follow this quickstart to modernize JDK, frameworks, and dependencies.
author: KarlErickson
ms.author: karler
ms.reviewer: xinrzhu
ms.topic: quickstart
ms.date: 10/28/2025
ms.custom: devx-track-java
zone_pivot_group_filename: developer/github-copilot-app-modernization/github-copilot-app-modernization-zone-pivot-groups.json
zone_pivot_groups: java-upgrade
---

# Quickstart: Upgrade a Java project with GitHub Copilot modernization

GitHub Copilot modernization provides an AI-powered agentic experience that automates Java upgrade workflows end-to-end — from project analysis and plan generation to code transformation, build validation, and CVE remediation.

## Supported upgrade scenarios

- Upgrade Java Development Kit (JDK) to Java 11, 17, 21, or 25.
- Upgrade Spring Boot up to version 4.0.
- Upgrade Spring Framework up to version 7.x.
- Upgrade Java EE to Jakarta EE, up to Jakarta EE 11.
- Upgrade Azure SDK for Java.
- Upgrade JUnit.
- Upgrade third-party dependencies to a specified version.

> [!VIDEO https://www.youtube.com/embed/VwAOpu3lxdM?list=PLlrxD0HtieHhaBJWlcxGd-kTDikSD4xyD]

## Prerequisites

- A GitHub account with [GitHub Copilot](https://github.com/features/copilot) enabled. You need a Free Tier, Pro, Pro+, Business, or Enterprise plan.
- [Java JDK](/java/openjdk/download) for both the source and target JDK versions.
- [Maven](https://maven.apache.org/download.cgi) or [Gradle](https://gradle.org/install/) to build Java projects.
- A Git-managed Java project using Maven or Gradle.
- For Maven-based projects: access to the public Maven Central repository.

::: zone pivot="visual-studio-code"

- The latest version of [Visual Studio Code](https://code.visualstudio.com/).
- [GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview). For setup instructions, see [Set up GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/setup). Be sure to sign in to your GitHub account within Visual Studio Code.
- [GitHub Copilot modernization](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure). Restart Visual Studio Code after installation.

::: zone-end

::: zone pivot="intellij"

- The latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download).
- [GitHub Copilot](https://plugins.jetbrains.com/plugin/17718-github-copilot). For more instructions, see [Set up GitHub Copilot in IntelliJ IDEA](https://docs.github.com/en/copilot/get-started/quickstart). Be sure to sign in to your GitHub account within IntelliJ IDEA.
- [GitHub Copilot modernization](https://plugins.jetbrains.com/plugin/28791-github-copilot-app-modernization). Restart IntelliJ IDEA after installation. If you don't have GitHub Copilot installed, you can install GitHub Copilot modernization directly.
- For more efficient use of GitHub Copilot modernization: in the IntelliJ IDEA settings, select the **Tools** > **GitHub Copilot** configuration window, and then select **Auto-approve** and **Trust MCP Tool Annotations**. For more information, see [Configure settings for GitHub Copilot modernization to optimize the experience for IntelliJ](configure-settings-intellij.md).

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

## Select a Java project to upgrade

For the purposes of this tutorial, choose one of the following sample repositories:

- Maven: [uportal-messaging](https://github.com/UW-Madison-DoIT/uportal-messaging)
- Gradle: [docraptor-java](https://github.com/DocRaptor/docraptor-java)

## Launch the upgrade

::: zone pivot="visual-studio-code"

Use the following steps to start the upgrade process:

1. Open the selected Java project in Visual Studio Code.
1. In the sidebar, open the **GitHub Copilot modernization** panel to see the QuickStart page.
1. Select **Upgrade Java Runtime & Frameworks**.

   This opens GitHub Copilot Chat in agent mode and automatically starts the upgrade process.

   > [!TIP]
   > You can also select a specific task from the **Tasks** tree below the QuickStart panel (for example, **Upgrade Spring Boot Version** or **Upgrade Jakarta EE Version**) to trigger a targeted upgrade.
   >
   > Alternatively, you can type directly in GitHub Copilot Chat using agent mode — for example, *"Upgrade my Java project to Java 21"* — to start the upgrade.

:::image type="content" source="media/quickstart-upgrade/quickstart-page.png" alt-text="Screenshot of Visual Studio Code that shows the QuickStart page with the Upgrade Java Runtime & Frameworks button." lightbox="media/quickstart-upgrade/quickstart-page.png":::

::: zone-end

::: zone pivot="intellij"

Use the following steps to start the upgrade process:

1. Open the selected Java project in IntelliJ IDEA.
1. In the sidebar, open the **GitHub Copilot modernization** panel to see the QuickStart page.
1. Select **Upgrade Runtime & Frameworks**.

   This opens GitHub Copilot Chat in agent mode and automatically starts the upgrade process.

   > [!TIP]
   > You can also type directly in GitHub Copilot Chat using agent mode — for example, *"Upgrade my Java project to Java 21"* — to start the upgrade.

:::image type="content" source="media/quickstart-upgrade/java-jetbrains-launch.png" alt-text="Screenshot of IntelliJ IDEA that shows the GitHub Copilot modernization panel with upgrade tasks and the Chat panel running the upgrade process." lightbox="media/quickstart-upgrade/java-jetbrains-launch.png":::

::: zone-end

::: zone pivot="cli"

Use the following steps to start the upgrade process:

1. Open a terminal and navigate to your Java project directory.
1. Run the upgrade command:

   ```bash
   copilot --model claude-sonnet-4.6 --agent modernize-java:modernize-java
   ```

1. After the agent starts, type your upgrade request:

   ```prompt
   upgrade to Java 21 + Spring Boot 3.5.x
   ```

:::image type="content" source="media/quickstart-upgrade/cli-launch.png" alt-text="Screenshot of a terminal that shows the Copilot CLI starting a Java upgrade with the modernize-java agent." lightbox="media/quickstart-upgrade/cli-launch.png":::

::: zone-end

## Select upgrade targets

After you start the upgrade, the agent prompts you to select your target versions. Choose the desired Java version and, if applicable, the Spring Boot version for your project.

::: zone pivot="visual-studio-code"

:::image type="content" source="media/quickstart-upgrade/select-version.png" alt-text="Screenshot of Visual Studio Code that shows the target Java version selection prompt with options for Java 21, 17, and 25." lightbox="media/quickstart-upgrade/select-version.png":::

::: zone-end

## Review and edit the upgrade plan

GitHub Copilot modernization analyzes the Java project in the current workspace, including its JDK, build tools, and dependencies. The tool generates a **plan.md** file that includes:

- **Available Tools** — detected JDKs and build tools in your environment.
- **Guidelines** — user-specified constraints for the upgrade process.
- **Options** — working branch and test configuration.
- **Upgrade Goals** — source and target versions for each component.
- **Technology Stack** — dependency compatibility analysis with incompatibility reasons.
- **Derived Upgrades** — additional upgrades required by the primary targets (for example, javax → jakarta namespace migration when upgrading to Spring Boot 3.x).
- **Impact Analysis** — detailed breakdown of dependency changes, source code changes, configuration changes, CI/CD changes, and risks.
- **Upgrade Steps** — ordered migration steps with rationale and verification criteria.

Review the plan and make changes if needed, then confirm to proceed. For information about further customization, see [Customize the upgrade plan](customize-upgrade-plan.md).

> [!TIP]
> Ensure that the plan matches your desired upgrade targets - for example, Java 8 to Java 21, Spring Boot 1.5 to 3.5.

::: zone pivot="visual-studio-code"

:::image type="content" source="media/quickstart-upgrade/plan.png" alt-text="Screenshot of Visual Studio Code that shows the plan.md file with upgrade goals and technology stack." lightbox="media/quickstart-upgrade/plan.png":::

::: zone-end

## Execute the upgrade

After plan confirmation, the agent automatically proceeds with the code transformation phase. As part of this process, it performs the following tasks:

- Modify code and configuration files to ensure compatibility with the target versions.
- Perform build validation to confirm the project compiles successfully at each step.
- Execute test validation if enabled in the plan options.

The agent iterates through each upgrade step until all steps complete successfully. You can monitor progress at any time by checking the **progress.md** file in the editor.

::: zone pivot="visual-studio-code"

:::image type="content" source="media/quickstart-upgrade/progress.png" alt-text="Screenshot of Visual Studio Code that shows the progress.md file with upgrade step status." lightbox="media/quickstart-upgrade/progress.png":::

::: zone-end

## CVE validation and fix

After the code transformation steps complete, the agent automatically scans dependencies for Common Vulnerabilities and Exposures (CVE) issues. If CVEs are found, the agent fixes them by upgrading the affected dependencies — no manual intervention is required. The final validation step then runs to confirm everything still builds and passes tests after the CVE fixes.

## View the summary

After the upgrade, the tool generates a **summary.md** file, which includes:

- **Executive Summary** — a one-paragraph overview of what was upgraded and the outcome.
- **Upgrade Improvements** — a before/after comparison table with key benefits.
- **Build and Validation** — build status and test results.
- **Limitations** — any unfixable issues remaining after the upgrade.
- **Recommended next steps** — suggested follow-up actions such as generating unit tests or addressing any remaining unfixed CVEs.
- **Additional details** — project metadata, code changes, and CVE scan results.

::: zone pivot="visual-studio-code"

:::image type="content" source="media/quickstart-upgrade/summary.png" alt-text="Screenshot of Visual Studio Code that shows the upgrade summary content." lightbox="media/quickstart-upgrade/summary.png":::

::: zone-end

::: zone pivot="intellij"

:::image type="content" source="media/quickstart-upgrade/java-jetbrains-summary.png" alt-text="Screenshot of IntelliJ IDEA that shows the upgrade summary with Java Upgrade Result and the Chat panel showing upgrade completion." lightbox="media/quickstart-upgrade/java-jetbrains-summary.png":::

::: zone-end

::: zone pivot="cli"

:::image type="content" source="media/quickstart-upgrade/cli-summary.png" alt-text="Screenshot of a terminal that shows the upgrade summary with file changes after completing a Java 11 to 21 and Spring Boot 2.7 to 3.5 upgrade." lightbox="media/quickstart-upgrade/cli-summary.png":::

::: zone-end

## Next step

[Quickstart: generate unit tests with GitHub Copilot modernization](quickstart-unit-tests.md)

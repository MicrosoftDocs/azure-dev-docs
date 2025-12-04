---
title: "Working with Assessment: Comprehensive guide to application assessment with GitHub Copilot App Modernization for Java"
titleSuffix: Azure
description: Learn how to effectively work with application assessments in GitHub Copilot app modernization, including configuration, interpretation, and report management.
author: KarlErickson
ms.author: karler
ms.reviewer: fenzho
ms.topic: reference
ms.date: 11/18/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Working with assessment: Comprehensive guide to application assessment with GitHub Copilot App Modernization for Java

This comprehensive guide covers advanced assessment capabilities in GitHub Copilot app modernization to help you maximize the value of your application modernization assessment process.

Application assessment is a critical first step in your modernization journey. This article covers the complete assessment workflow to help you effectively work with assessment reports, configure assessments for different scenarios, and manage assessment data throughout your modernization process.

## Configure before running assessment

Before running assessment, configure the assessment by selecting **Configure Assessment** in the GitHub Copilot app modernization **Assessment** pane.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/configure-assessment-report.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/configure-assessment-report.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization Assessment pane with the Configure Assessment button highlighted.":::

### Configuration properties

Currently, you can configure the `target`, `capability`, `os`, and `mode` properties for the assessment.

By default, the assessment runs with Azure Kubernetes Service (AKS), Azure App Service, and Azure Container Apps (ACA) as the service targets.

- `target`: the Azure compute service to run the apps on. Choose multiple targets if you haven't decided which one to use. You can then compare the targets on the assessment report.

  | Value                  | Description                                                            |
  |------------------------|------------------------------------------------------------------------|
  | `azure-aks`            | Best practices for deploying an app to Azure Kubernetes Service.       |
  | `azure-appservice`     | Best practices for deploying an app to Azure App Service.              |
  | `azure-container-apps` | Best practices for deploying an app to Azure Container Apps.           |

- `capability`: the target technology to modernize the apps towards.

  | Value                  | Description                                                            |
  |------------------------|------------------------------------------------------------------------|
  | `containerization`     | Best practices for containerizing applications.                        |
  | `openjdk11`            | Best practices for migrating to OpenJDK 11.                            |
  | `openjdk17`            | Best practices for migrating to OpenJDK 17.                            |
  | `openjdk21`            | Best practices for migrating to OpenJDK 21.                            |

- `os`: the target operating system to run the apps on.

  | Value                  | Description                                                            |
  |------------------------|------------------------------------------------------------------------|
  | `linux`                | Best practices for migrating applications to the Linux platform.       |
  | `windows`              | Best practices for migrating applications to the Windows platform.     |

- `mode`: the analysis mode.

  | Value         | Description                                                                             |
  |---------------|-----------------------------------------------------------------------------------------|
  | `issue-only`  | Analyze source code to only detect issues.                                              |
  | `source-only` | Analyze source code to detect both issues and used technologies.                        |
  | `full`        | Analyze source code to detect both issues and used technologies, and list dependencies. |

### Examples

The following examples describe some configurations:

- Example one: you'd like to migrate your apps to AKS as linux containers and want to understand what are the issues to be fixed. Use the following configuration:

  ```yaml
  appcat:
  - target:
      - azure-aks
    os:
      - linux
    mode: issue-only
  ```

- Example two: you'd like to migrate your apps to App Service Linux and want to understand what are the issues to be fixed. Use the following configuration:

  ```yaml
  appcat:
  - target:
      - azure-appservice
    os:
      - linux
    mode: issue-only
  ```

- Example three: you'd like to modernize your apps to JDK21 and want to understand what are the issues to be fixed. Use the following configuration:

  ```yaml
  appcat:
  - capability:
      - openjdk21
    mode: issue-only
  ```

After the tool runs an assessment, the interactive dashboard opens automatically, providing comprehensive analysis results. After you configure multiple Azure service targets, you can easily switch between them to compare migration approaches and view service-specific recommendations.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/list-azure-service-target-for-assessment-report.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/list-azure-service-target-for-assessment-report.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization assessment dashboard with Azure service target selection options.":::

## Interpret the assessment report

The assessment report provide comprehensive analysis results to help you understand your application's readiness for Azure migration and modernization. This section guides you through the report structure and helps you interpret the findings to make informed migration decisions.

### Report structure overview

The assessment report consists of several key sections:

- **Application Information**: Basic information about your application including Java version, frameworks, build tools, project structure, and target Azure service.
- **Issue Summary**: Overview of migration issues categorized by domain with criticality percentages.
- **Detailed Analysis**: The detail report is organized into the following four subsections.
  - **Issues**: Provides a concise summary of all issues that require attention.
  - **Dependencies**: Displays all Java-packaged dependencies found within the application.
  - **Technologies**: Displays all embedded libraries grouped by functionality, enabling you to quickly view the technologies used in the application.
  - **Insights**: Displays file details and information to help you understand the detected technologies.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/assessment-report-dashboard.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/assessment-report-dashboard.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization assessment report dashboard.":::

#### Issues

Access this part by selecting the **Issues** tab. This tab provides a categorized issues list of various aspects of Cloud Readiness and Java Upgrade that you need to address to successfully migrate the application to Azure. The following tables describe the **Domain** and **Criticality** values:

| Domain              | Description                                                                             |
|---------------------|-----------------------------------------------------------------------------------------|
| **Cloud Readiness** | Evaluates app dependencies to suggest Azure services and ensure cloud-native readiness. |
| **Java Upgrade**    | Identifies JDK and framework issues for version upgrade.                                |

| Criticality         | Description                                                   |
|---------------------|---------------------------------------------------------------|
| **Mandatory**       | Issues that must be fixed for migration to Azure.             |
| **Potential**       | Issues that might impact migration and need review.           |
| **Optional**        | Low-impact issues. Fixing them is recommended but optional.   |

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/assessment-report-issue-list.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/assessment-report-issue-list.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization assessment report issue list.":::

For more information, you can expand each reported issue by selecting the title. The report provides the following information:

- A list of files where the incidents occurred, along with the number of code lines impacted. If the file is a Java source file, then selecting the file line number directs you to the corresponding source report.
- A detailed description of the issue. This description outlines the problem, provides any known solutions, and references supporting documentation regarding either the issue or resolution.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/assessment-report-issue-detail.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/assessment-report-issue-detail.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization assessment report issue detail.":::

#### Dependencies

Access this part by selecting the **Dependencies** tab. This tab displays all Java-packaged dependencies found within the application.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/assessment-report-dependency-list.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/assessment-report-dependency-list.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization assessment report dependency list.":::

#### Technologies

Access this part by selecting the **Technologies** tab. This tab lists the occurrences of technologies, grouped by function, in the analyzed application. This report is an overview of the technologies found in the application, and is designed to assist you in quickly understanding each application's purpose.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/assessment-report-technology-list.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/assessment-report-technology-list.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization assessment report technology list.":::

#### Insights

Access this part by selecting the **Insights** tab. Displays file details and information to help you understand the detected technologies.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/assessment-report-insight-list.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/assessment-report-insight-list.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization assessment report insight list.":::

## Operate assessment report

Effective report management enables collaboration, maintains assessment history, and integrates with existing workflows.

### Import assessment report

Besides running the assessment directly in GitHub Copilot app modernization, you can also import assessment reports. The reports can come from [AppCAT](https://aka.ms/appcat-java) CLI results - such as **report.json**, a GitHub Copilot app modernization exported report, or an app context file from Dr. Migrate.

To import an assessment report to GitHub Copilot app modernization, select **Import** in the assessment section or press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> and then search for **import assessment report**.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/import-assessment-report.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/import-assessment-report.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization assessment report import interface.":::

### Export assessment report

In the assessment dashboard, you can view the issues detected by AppCAT and choose the migration solution to determine the decision. You can export the report and share it with others. If so, other people don't need to run assessment by themselves and can import the report and view the assessment and migration decision directly.

To export an assessment report from GitHub Copilot app modernization, right-click **Assessment Report** and then select **Export** in the assessment section or press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> and then search for **export assessment report**.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/export-assessment-report.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/export-assessment-report.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization assessment report export options and interface.":::

### Delete assessment report

If you don't want the report anymore, you can choose to delete it.

To remove an assessment report, right-click **Assessment Report** and then select **Delete**.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/delete-assessment-report.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/delete-assessment-report.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization delete an assessment report.":::

## Next step

[Quickstart: create and apply your own tasks](migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task.md)

---
ms.date: 03/20/2026
ms.collection: ce-skilling-ai-copilot
---

## Configure before running assessment

Before running the assessment, configure it by selecting **Configure Assessment** in the GitHub Copilot modernization **Assessment** pane.

:::image type="content" source="../media/migrate-github-copilot-app-modernization-for-java/configure-assessment-report.png" lightbox="../media/migrate-github-copilot-app-modernization-for-java/configure-assessment-report.png" alt-text="Screenshot that shows the GitHub Copilot modernization Assessment pane with the Configure Assessment button highlighted.":::

### Configuration properties

Currently, you can configure the `target`, `capability`, `os`, and `mode` properties for the assessment.

By default, the assessment runs with Azure Kubernetes Service (AKS), Azure App Service, and Azure Container Apps (ACA) as the service targets.

- `target`: the Azure compute service to run the apps on. Choose multiple targets if you haven't decided which one to use. You can then compare the targets on the assessment report.

  | Value                  | Description                                                      |
  |------------------------|------------------------------------------------------------------|
  | `azure-aks`            | Best practices for deploying an app to Azure Kubernetes Service. |
  | `azure-appservice`     | Best practices for deploying an app to Azure App Service.        |
  | `azure-container-apps` | Best practices for deploying an app to Azure Container Apps.     |

- `capability`: the target technology to modernize the apps towards.

  | Value                  | Description                                     |
  |------------------------|-------------------------------------------------|
  | `containerization`     | Best practices for containerizing applications. |
  | `openjdk11`            | Best practices for migrating to OpenJDK 11.     |
  | `openjdk17`            | Best practices for migrating to OpenJDK 17.     |
  | `openjdk21`            | Best practices for migrating to OpenJDK 21.     |

- `os`: the target operating system to run the apps on.

  | Value                  | Description                                                        |
  |------------------------|--------------------------------------------------------------------|
  | `linux`                | Best practices for migrating applications to the Linux platform.   |
  | `windows`              | Best practices for migrating applications to the Windows platform. |

- `mode`: the analysis mode.

  | Value         | Description                                                                             |
  |---------------|-----------------------------------------------------------------------------------------|
  | `issue-only`  | Analyze source code to only detect issues.                                              |
  | `source-only` | Analyze source code to detect both issues and used technologies.                        |
  | `full`        | Analyze source code to detect both issues and used technologies, and list dependencies. |

### Examples

The following examples describe some configurations:

- Example one: You want to migrate your apps to AKS as Linux containers and want to understand what issues need to be fixed. Use the following configuration:

  ```yaml
  appcat:
  - target:
      - azure-aks
    os:
      - linux
    mode: issue-only
  ```

- Example two: You want to migrate your apps to App Service Linux and want to understand what issues need to be fixed. Use the following configuration:

  ```yaml
  appcat:
  - target:
      - azure-appservice
    os:
      - linux
    mode: issue-only
  ```

- Example three: You want to modernize your apps to JDK21 and want to understand what issues need to be fixed. Use the following configuration:

  ```yaml
  appcat:
  - capability:
      - openjdk21
    mode: issue-only
  ```

After the tool runs an assessment, it automatically opens the interactive dashboard, which provides comprehensive analysis results.

## Interpret the assessment report

The assessment report provides comprehensive analysis results to help you understand your application's readiness for Azure migration and modernization. This section guides you through the report structure and helps you interpret the findings to make informed migration decisions.

### Report structure overview

The assessment report consists of several key sections:

- **Application Information**: Basic information about your application including Java version, frameworks, build tools, project structure, and target Azure service.
- **Issue Summary**: Overview of migration issues categorized by domain with criticality percentages.
- **Detailed Analysis**: The detailed report is organized into the following four subsections.
  - **Issues**: Provides a concise summary of all issues that require attention.
  - **Dependencies**: Displays all Java-packaged dependencies found within the application.
  - **Technologies**: Displays all embedded libraries grouped by functionality, enabling you to quickly view the technologies used in the application.
  - **Insights**: Displays file details and information to help you understand the detected technologies.

:::image type="content" source="../media/migrate-github-copilot-app-modernization-for-java/assessment-report-dashboard-intellij-idea.png" lightbox="../media/migrate-github-copilot-app-modernization-for-java/assessment-report-dashboard-intellij-idea.png" alt-text="Screenshot that shows the GitHub Copilot modernization assessment report dashboard.":::

#### Issues

Access this part by selecting the **Issues** tab. This tab provides a categorized list of issues for various aspects of cloud readiness and Java upgrade that you need to address to successfully migrate the application to Azure. The following tables describe the **Domain** and **Criticality** values:

| Domain              | Description                                                                             |
|---------------------|-----------------------------------------------------------------------------------------|
| **Cloud Readiness** | Evaluates app dependencies to suggest Azure services and ensure cloud-native readiness. |
| **Java Upgrade**    | Identifies JDK and framework issues for version upgrade.                                |

| Criticality         | Description                                                 |
|---------------------|-------------------------------------------------------------|
| **Mandatory**       | Issues that you must fix for migration to Azure.            |
| **Potential**       | Issues that might impact migration and need review.         |
| **Optional**        | Low-impact issues. Fixing them is recommended but optional. |

:::image type="content" source="../media/migrate-github-copilot-app-modernization-for-java/assessment-report-issue-list-intellij-idea.png" lightbox="../media/migrate-github-copilot-app-modernization-for-java/assessment-report-issue-list-intellij-idea.png" alt-text="Screenshot that shows the GitHub Copilot modernization assessment report issue list.":::

For more information, expand each reported issue by selecting the title. The report provides the following information:

- A list of files where the incidents occurred, along with the number of code lines impacted. If the file is a Java source file, selecting the file line number directs you to the corresponding source report.
- A detailed description of the issue. This description outlines the problem, provides any known solutions, and references supporting documentation regarding either the issue or resolution.

:::image type="content" source="../media/migrate-github-copilot-app-modernization-for-java/assessment-report-issue-detail-intellij-idea.png" lightbox="../media/migrate-github-copilot-app-modernization-for-java/assessment-report-issue-detail-intellij-idea.png" alt-text="Screenshot that shows the GitHub Copilot modernization assessment report issue detail.":::

#### Dependencies

Access this part by selecting the **Dependencies** tab. This tab displays all Java-packaged dependencies found within the application.

:::image type="content" source="../media/migrate-github-copilot-app-modernization-for-java/assessment-report-dependency-list-intellij-idea.png" lightbox="../media/migrate-github-copilot-app-modernization-for-java/assessment-report-dependency-list-intellij-idea.png" alt-text="Screenshot that shows the GitHub Copilot modernization assessment report dependency list.":::

#### Technologies

Access this part by selecting the **Technologies** tab. This tab lists the occurrences of technologies, grouped by function, in the analyzed application. This report provides an overview of the technologies found in the application, and is designed to assist you in quickly understanding each application's purpose.

:::image type="content" source="../media/migrate-github-copilot-app-modernization-for-java/assessment-report-technology-list-intellij-idea.png" lightbox="../media/migrate-github-copilot-app-modernization-for-java/assessment-report-technology-list-intellij-idea.png" alt-text="Screenshot that shows the GitHub Copilot modernization assessment report technology list.":::

#### Insights

Access this part by selecting the **Insights** tab. Displays file details and information to help you understand the detected technologies.

:::image type="content" source="../media/migrate-github-copilot-app-modernization-for-java/assessment-report-insight-list-intellij-idea.png" lightbox="../media/migrate-github-copilot-app-modernization-for-java/assessment-report-insight-list-intellij-idea.png" alt-text="Screenshot that shows the GitHub Copilot modernization assessment report insight list.":::

## Delete assessment report

If you don't want the report anymore, you can delete it.

To remove an assessment report, right-click **Assessment Report** and then select **Delete**.

:::image type="content" source="../media/migrate-github-copilot-app-modernization-for-java/delete-assessment-report-intellij-idea.png" lightbox="../media/migrate-github-copilot-app-modernization-for-java/delete-assessment-report-intellij-idea.png" alt-text="Screenshot that shows the GitHub Copilot modernization delete an assessment report.":::

---
title: Batch Assessment with the GitHub Copilot Modernization Agent
description: Learn how to use the GitHub Copilot modernization agent to assess multiple applications simultaneously and generate aggregated report.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 04/17/2026
---

# Batch assessment with the GitHub Copilot modernization agent

Batch assessment enables you to analyze multiple applications simultaneously, providing a comprehensive view of the modernization landscape across your applications. This article guides you through the process of assessing multiple repositories efficiently.

Batch assessment is especially valuable for migration planning because it enables you to efficiently assess the readiness and requirements of various applications at once. By using batch assessment, you can evaluate different repositories at the same time and obtain detailed assessment reports for each application. It produces two kinds of reports to support your migration planning:

- **Per app report**: Provides detailed insights into all modernization problems identified at the individual repository level.
- **Aggregated report**: Presents an overall perspective of all assessed applications, offering summary insights, recommendations on Azure services, target platforms, and upgrade paths. Additionally, the aggregated report includes shortcuts for easy access to each per app report.

Batch assessment provides the following benefits:

- Cross-applications visibility:

   - **Aggregated reports**: Get a comprehensive view across applications.
   - **Cross-repository analysis**: Identify common patterns and dependencies across applications.
   - **Prioritization insights**: Understand which applications need immediate attention.

- Scale and efficiency:

   - **Parallel processing**: Use Cloud Coding Agents to process multiple repositories simultaneously.
   - **Automated workflows**: Integrate with CI/CD pipelines for scheduled assessment.
   - **Time savings**: Reduce total assessment time from weeks to hours.

## Prerequisites

- [Modernize CLI](quickstart.md).
- Access to all repositories you want to assess.
- GitHub authentication is configured (`gh auth login`).

## Configure repositories

The modernization agent supports multiple ways to specify the repositories you want to assess:

- **Current folder**: Assess the project in your current working directory.
- **Manual input**: Enter local directory paths or remote Git URLs directly.
- **Repository config file**: Use a JSON config file that lists all repositories.

### Repository config file

For batch operations across many repositories, create a JSON config file to list all repositories. For example, create it at `.github/modernize/repos.json` in your working directory, or provide a custom path.

Make sure you have the right permissions for the repositories or fork them.

**Simple format** (array of repositories):

```json
[
  {
    "name": "PhotoAlbum-Java",
    "url": "https://github.com/Azure-Samples/PhotoAlbum-Java.git"
  },
  {
    "name": "PhotoAlbum",
    "url": "https://github.com/Azure-Samples/PhotoAlbum.git"
  },
  {
    "name": "eShopOnWeb",
    "url": "https://github.com/dotnet-architecture/eShopOnWeb.git"
  }
]
```

**Full format** (with branch and local paths):

```json
{
  "repos": [
    {
      "name": "PhotoAlbum-Java",
      "url": "https://github.com/Azure-Samples/PhotoAlbum-Java.git",
      "branch": "main"
    },
    {
      "name": "local-project",
      "path": "/absolute/path/to/project"
    }
  ]
}
```

Each repo entry supports the following fields:

| Field         | Description                                                          | Required               |
|---------------|----------------------------------------------------------------------|------------------------|
| `name`        | A friendly name for the repository (used in reports and dashboards). | Yes                    |
| `url`         | Git clone URL in HTTPS or SSH format.                                | One of `url` or `path` |
| `path`        | Absolute local directory path.                                       | One of `url` or `path` |
| `branch`      | Branch to check out after cloning.                                   | No                     |
| `description` | Human-readable description.                                          | No                     |

**Full format with app grouping** (optional, for organized reporting):

You can add an `apps[]` section to group repositories into logical applications. When apps are defined, the aggregated report organizes results by application and supports report distribution to external destinations.

```json
{
  "repos": [
    {
      "name": "PhotoAlbum-Java",
      "url": "https://github.com/Azure-Samples/PhotoAlbum-Java.git",
      "branch": "main"
    },
    {
      "name": "PhotoAlbum",
      "url": "https://github.com/Azure-Samples/PhotoAlbum.git"
    }
  ],
  "apps": [
    {
      "identifier": "photo-app",
      "description": "Photo management application",
      "repos": ["PhotoAlbum-Java"],
      "output": {
        "type": "local",
        "path": "/path/to/reports/photo-app"
      }
    }
  ]
}
```

Each app entry supports:

| Field         | Description                                                        | Required |
|---------------|--------------------------------------------------------------------|----------|
| `identifier`  | Unique display name of the application.                            | Yes      |
| `description` | Human-readable description.                                        | No       |
| `repos`       | List of repo names that belong to this app.                        | Yes      |
| `output`      | Where to distribute this app's assessment report after generation. | No       |

The `output` field supports the following distribution types:

| Type    | Description                                                                                        | Required fields |
|---------|----------------------------------------------------------------------------------------------------|-----------------|
| `local` | Copy reports to a local directory.                                                                 | `path`          |
| `git`   | Push reports to a Git repository. The URL format is `https://github.com/org/repo.git#branch:path`. | `url`           |

> [!TIP]
> You can include repositories from different organizations and use different authentication methods as long as you have access.

The modernization agent automatically detects the `repos.json` file at `.github/modernize/repos.json` when you select **From a config file** in interactive mode. You can also provide a custom path.

## Run batch assessment

Two execution modes are available:

- **Local execution**: The modernization agent processes repositories one after another on your local machine. This mode works best for a smaller set of applications or for initial testing. Supports both Git URL and local path repositories.
- **Cloud Coding Agent delegation**: The modernization agent submits tasks to GitHub Cloud Coding Agents for parallel processing in the cloud. This mode is faster for multi-repo scenarios.

> [!IMPORTANT]
> Cloud Coding Agent delegation requires repositories to have **GitHub (github.com) repository URLs**. Local path repositories and non-GitHub providers (GitLab, Azure DevOps) aren't supported for cloud delegation. Use local execution for those repositories.

> [!TIP]
> By using Cloud Coding Agent delegation, you enable parallel execution across all repositories. This approach significantly reduces the total assessment time for large portfolios.

### Interactive mode (assess locally)

1. Run the modernization agent:

    ```bash
    modernize
    ```

1. Select **Assess** from the main menu.

    :::image type="content" source="../media/modernization-agent/assess-understand-application-menu.png" alt-text="Screenshot of Modernize CLI that shows the main menu with the Assess option in the terminal." lightbox="../media/modernization-agent/assess-understand-application-menu.png":::

1. Choose how to specify your target repositories. Select **From a config file** to use a `repos.json` file.

    :::image type="content" source="../media/modernization-agent/source-type-selection.png" alt-text="Screenshot of Modernize CLI that shows the source type selection in the terminal." lightbox="../media/modernization-agent/source-type-selection.png":::

    > [!TIP]
    > You can also select **Manual input** to enter local paths or remote Git URLs directly, or **Current folder** to assess the project in your current directory.

1. If the `repos.json` file is detected at the default location, the agent automatically fills it in. Otherwise, enter the path to your config file and press <kbd>Enter</kbd>.

1. All repositories are selected by default. Deselect any repositories you want to skip, and then press <kbd>Enter</kbd> to confirm your selection.

    - **Use arrow keys** to navigate and press <kbd>Space</kbd> to toggle individual repositories.

    :::image type="content" source="../media/modernization-agent/assess-repo-list.png" alt-text="Screenshot of Modernize CLI that shows the repository list in the terminal." lightbox="../media/modernization-agent/assess-repo-list.png":::

1. Choose the execution mode. Select **Assess locally**.

    :::image type="content" source="../media/modernization-agent/assess-locally-option.png" alt-text="Screenshot of Modernize CLI that shows the assess mode menu in the terminal." lightbox="../media/modernization-agent/assess-locally-option.png":::

1. Select the assessment domains to analyze. Choose from **Java upgrade** and **Cloud Readiness**, and then press <kbd>Enter</kbd>.

    :::image type="content" source="../media/modernization-agent/assess-domain-selection.png" alt-text="Screenshot of Modernize CLI that shows the assessment domain selection in the terminal." lightbox="../media/modernization-agent/assess-domain-selection.png":::

1. Review and configure the assessment options. The configuration page shows options grouped by language and domain:

    - **Java / GENERAL**: Analysis Coverage (Issue only, Issues & Technologies, or Issues, Technologies & Dependencies).
    - **Java / JAVA UPGRADE**: Target Runtime (OpenJDK 11, 17, or 21).
    - **Java / CLOUD READINESS**: Target Compute Services, Target Operating System, and Containerization.
    - **.NET / CLOUD READINESS**: Target Compute Services.

    Use the arrow keys to navigate, press <kbd>Enter</kbd> to change a value, or select **Continue** to proceed with the current settings.

    :::image type="content" source="../media/modernization-agent/assess-configuration.png" alt-text="Screenshot of Modernize CLI that shows the assessment configuration page in the terminal." lightbox="../media/modernization-agent/assess-configuration.png":::

    > [!TIP]
    > The recommended defaults work for most scenarios. You only need to change these settings if you have specific requirements, such as targeting a particular JDK version or Azure compute service.

1. Enter the output path for assessment results or press <kbd>Enter</kbd> to accept the default.

1. The agent automatically:

    - Clones remote repositories (local path repositories are used directly).
    - Runs assessment on each repository one by one.
    - Generates individual assessment reports.

        :::image type="content" source="../media/modernization-agent/assess-individual-report-output.png" alt-text="Screenshot of Modernize CLI that shows the output of individual assessment report generation in the terminal." lightbox="../media/modernization-agent/assess-individual-report-output.png":::

    - Creates an aggregated report.

        :::image type="content" source="../media/modernization-agent/assess-aggregated-report-output.png" alt-text="Screenshot of Modernize CLI that shows the output of the aggregated report generation in the terminal." lightbox="../media/modernization-agent/assess-aggregated-report-output.png":::

1. When the assessment finishes, the agent automatically opens the aggregated report.

    :::image type="content" source="../media/modernization-agent/assess-repo-list-report.png" alt-text="Screenshot of Modernize CLI that shows the content of the aggregated report." lightbox="../media/modernization-agent/assess-repo-list-report.png":::

### Interactive mode (delegating to Cloud Coding Agents)

First, configure Cloud Coding Agents in each application repository. To configure Cloud Coding Agents, fork the sample repositories.

#### Configuration for .NET applications

##### Configure to run on Windows for .NET Framework applications

By default, the Copilot Coding Agent runs in an Ubuntu Linux environment. For .NET Framework applications, you need a Windows environment. To enable it, configure `.github/workflows/copilot-setup-steps.yaml` in the `main` branch of your application repository as shown in the following example:

```yaml
# Windows-based Copilot Setup Steps for .NET tasks
# Note: Windows runners have firewall limitations that may affect some network operations
# Use this workflow for .NET projects that require Windows-specific tooling

name: "Copilot Setup Step (Windows)"

on:
  workflow_dispatch:

jobs:
  copilot-setup-steps:
    runs-on: windows-latest
    permissions:
      contents: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v5
```

Learn more from: [Customizing Copilot's development environment with Copilot setup steps](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment#customizing-copilots-development-environment-with-copilot-setup-steps)

##### Disable firewall 

Disable Copilot coding agent's integrated firewall in your repository settings as shown in the following image:

:::image type="content" source="../media/modernization-agent/disable-firewall-for-cloud-coding-agent.png" alt-text="Screenshot of GitHub that shows the repository settings with the Enable firewall setting set to Off." lightbox="../media/modernization-agent/disable-firewall-for-cloud-coding-agent.png":::

#### Configuration for Java applications

Configure GitHub Copilot Modernization MCP Server in Cloud Coding Agent section of your repository settings as shown in the following example:

```json
{
  "mcpServers": {
    "app-modernization": {
      "type": "local",
      "command": "npx",
      "tools": [
        "*"
      ],
      "args": [
        "-y",
        "@microsoft/github-copilot-app-modernization-mcp-server"
      ]
    }
  }
}
```

:::image type="content" source="../media/modernization-agent/mcp-config-cloud-coding-agent.png" alt-text="Screenshot of GitHub that shows the repository Coding agent settings with the MCP configuration section highlighted." lightbox="../media/modernization-agent/mcp-config-cloud-coding-agent.png":::

#### Steps

1. Run the modernization agent:

   ```bash
   modernize
   ```

1. Select **Assess** from the main menu.

    :::image type="content" source="../media/modernization-agent/assess-understand-application-menu.png" alt-text="Screenshot of Modernize CLI that shows the main menu with the Assess option in the terminal." lightbox="../media/modernization-agent/assess-understand-application-menu.png":::

1. Choose how to specify your target repositories. Select **From a config file** to use a `repos.json` file, or select **Manual input** to enter GitHub repository URLs directly.

    :::image type="content" source="../media/modernization-agent/source-type-selection.png" alt-text="Screenshot of Modernize CLI that shows the source type selection in the terminal." lightbox="../media/modernization-agent/source-type-selection.png":::

1. If you selected **From a config file** and the `repos.json` file is detected at the default location, the agent automatically fills it in. Otherwise, enter the path to your config file and press <kbd>Enter</kbd>.

1. All repositories are selected by default. Deselect any repositories you want to skip, and then press <kbd>Enter</kbd> to confirm your selection.

    - **Use arrow keys** to navigate and press <kbd>Space</kbd> to toggle individual repositories.

    :::image type="content" source="../media/modernization-agent/assess-repo-list.png" alt-text="Screenshot of Modernize CLI that shows the repository list in terminal." lightbox="../media/modernization-agent/assess-repo-list.png":::

1. Choose the execution mode. Select **Delegate to Cloud Agents**.

    :::image type="content" source="../media/modernization-agent/assess-delegate-cloud-coding-agents-option.png" alt-text="Screenshot of Modernize CLI that shows the assess menu with the Delegate to Cloud Coding Agents option selected." lightbox="../media/modernization-agent/assess-delegate-cloud-coding-agents-option.png":::

    > [!NOTE]
    > When you delegate to Cloud Coding Agents, the domain selection and assessment configuration steps aren't supported. The cloud agent uses the default configurations to run assessment.

1. Enter the output path for assessment results or press <kbd>Enter</kbd> to accept the default.

1. The agent automatically delegates assessment tasks for each repository to Cloud Coding Agents and executes them in the cloud in parallel.

    :::image type="content" source="../media/modernization-agent/assess-delegate-cloud-coding-agents-progress.png" alt-text="Screenshot of Modernize CLI that shows the output of the progress of delegating assessment to Cloud Coding Agents in the terminal." lightbox="../media/modernization-agent/assess-delegate-cloud-coding-agents-progress.png":::

    The agent pulls the per-app assessment results back to local and generates the aggregated report locally.

    :::image type="content" source="../media/modernization-agent/assess-aggregated-report-output.png" alt-text="Screenshot of Modernize CLI that shows the Aggregating Assessment Reports in the terminal." lightbox="../media/modernization-agent/assess-aggregated-report-output.png":::

1. When the assessment finishes, the agent automatically opens the aggregated report.

### Non-interactive mode (CLI)

You can also use non-interactive mode by specifying command arguments directly. Use the `modernize assess` command:

**Assess locally using a repository config file:**

```bash
modernize assess --source .github/modernize/repos.json
```

**Assess multiple repositories by specifying sources directly:**

```bash
modernize assess --source https://github.com/org/repo1 --source https://github.com/org/repo2
```

**Assess by delegating to Cloud Coding Agents:**

```bash
modernize assess --source .github/modernize/repos.json --delegate cloud --wait
```

For more information, see [assess - CLI commands](cli-commands.md#assess).

## Understanding the aggregated report

The aggregated report provides a comprehensive view across assessed applications as follows:

### Dashboard

- Snapshot of portfolio health: total apps, how many need upgrades, and aggregate blocker and issue counts.
- Technology distribution: what frameworks are in use and how many apps share them.
- Effort distribution: whether the overall migration is a small or large undertaking.

### Recommendations

- Azure Services: maps current dependencies to recommended Azure equivalents. Shared dependencies across apps are decided once, so you avoid per-app rework.
- Target Platform: guides hosting choice, such as Azure Container Apps versus AKS, and surfaces consolidation opportunities.
- Upgrade Path: identifies which apps need framework upgrades as a prerequisite, separating upgrade work from migration work.
- Migration Waves: sequences apps by readiness and risk into phases. This approach enables early wins while harder apps are prepared in parallel.

### Application Assessment Matrix

- Quick overview for each application on aspects of framework, target platform, upgrade recommendation, issue breakdown (Mandatory, Potential, Optional), effort sizing, and more. 
- Links to individual app reports for drill-down when needed.

## Troubleshooting batch assessment

### Common problems

**Repository access errors:**

- Verify GitHub authentication by using `gh auth status`.
- Make sure you have access to all repositories listed in `repos.json`.

**Clone failures:**

- Verify repository URLs in `repos.json` are correct and accessible.
- Make sure you have the right access permissions for all repositories.
- Check your network connectivity and VPN settings.

**Assessment failures:**

- Check if the repository contains valid Java or .NET projects.
- Verify that build files exist, such as `pom.xml`, `build.gradle`, `*.csproj`, `*.sln`, or `*.slnx`.
- Review error messages in the console output.

**Cloud Coding Agent delegation problems:**

- Make sure you have the right permissions to create GitHub Actions workflows.
- Check GitHub Actions permissions and quota limits for your organization.
- For .NET Framework apps, make sure Windows runner configuration is properly set.
- Check your MCP server configuration.

## Next steps

After completing batch assessment, you can:

**Continue the modernization workflow:**

- [Run batch upgrade across repositories](batch-upgrade.md) - Apply consistent upgrades based on assessment findings.

**Learn more:**

- [Create custom skills for organization-specific patterns](customization.md).
- [Learn about CLI commands](cli-commands.md).

## Provide feedback

We value your input! If you have any feedback about batch assessment or the Modernization agent, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml) or use the [GitHub Copilot modernization feedback form](https://aka.ms/ghcp-appmod/feedback).

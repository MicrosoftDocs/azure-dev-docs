---
title: Batch Assessment
description: Learn how to use the GitHub Copilot modernization agent to assess multiple applications simultaneously and generate aggregated report.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 03/11/2026
keywords: batch assessment, multi-repo assessment, aggregated report, scale assessment
---

# Batch assessment

Batch assessment enables you to analyze multiple applications simultaneously, providing a comprehensive view of the modernization landscape across your applications. This capability is especially valuable for migration planning, as it allows you to efficiently assess the readiness and requirements of various applications at once. By using batch assessment, you can evaluate different repositories at the same time and obtain detailed assessment reports for each application. It produces two kinds of reports to support your migration planning:
- **Per app report**: Provides detailed insights into all modernization issues identified at the individual repository level.
- **Aggregated report**: Presents an overall perspective of all assessed applications, offering summary insights, recommendations on Azure services, target platforms, and upgrade paths. Additionally, the aggregated report includes shortcuts for easy access to each per app report.

This article guides you through the process of assessing multiple repositories in an efficient manner.

## Benefits of batch assessment

### Cross-applications visibility

- **Aggregated reports**: Get a comprehensive view across applications.
- **Cross-repository analysis**: Identify common patterns and dependencies across applications.
- **Prioritization insights**: Understand which applications need immediate attention.

### Scale and efficiency

- **Parallel processing**: Use Cloud Coding Agents to process multiple repositories simultaneously.
- **Automated workflows**: Integrate with CI/CD pipelines for scheduled assessment.
- **Time savings**: Reduce total assessment time from weeks to hours.

## Prerequisites

Before performing batch assessment:

- [Modernize CLI installed](quickstart.md).
- Access to all repositories you want to assess.
- GitHub authentication configured (`gh auth login`).

## Configure repositories

To enable batch assessment, create a `.github/modernize/repos.json` file in your working directory that lists all repositories you want to assess.

Make sure you have the right permissions for the repositories or fork them.

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

### Repository configuration

Each entry requires:

- **name**: A friendly name for the repository (used in reports and dashboards).
- **url**: The Git clone URL (HTTPS format).

> [!TIP]
> You can include repositories from different organizations and use different authentication methods as long as you have access.

### File location

The `repos.json` file must be located at:
```
.github/modernize/repos.json
```

The modernization agent automatically detects this file when running batch operations.

## Run batch assessment

There are two execution modes:

- Local execution: Processes repositories sequentially on your local machine. This mode works best for a smaller set of applications or for initial testing.
- Cloud Coding Agent delegation: Submits tasks to GitHub Cloud Coding Agents for parallel processing in the cloud. This mode is significantly faster for multi-repo scenarios.

> [!TIP]
> Cloud Coding Agent delegation enables parallel execution across all repositories, significantly reducing total assessment time for large portfolios.

### Interactive mode (assess locally)

1. Run the modernization agent:

   ```bash
   modernize
   ```

1. The agent detects the `repos.json` file and displays the repository list:

    :::image type="content" source="../media/modernization-agent/assess-repo-list.png" alt-text="Screenshot of Modernize CLI to display the repository list in terminal.":::

1. Select repositories to assess, and press `Enter` to confirm your selection.

    - **Press `Ctrl+A`** to select all repositories.
    - **Use arrow keys** to navigate and press `Space` to select individual repositories.

1. Select **1. Assess application** from the main menu.

    :::image type="content" source="../media/modernization-agent/assess-understand-application-menu.png" alt-text="Screenshot of Modernize CLI to show the menu of understanding my application in terminal.":::

1. To run assessment, choose to either assess locally or delegate to cloud coding agents. Select **1. Assess locally**.

    :::image type="content" source="../media/modernization-agent/assess-locally-option.png" alt-text="Screenshot of Modernize CLI to do assess locally in terminal.":::

1. The agent automatically:

    - Clones all selected repositories.
    - Runs assessment on each repository one by one.
    - Generates individual assessment reports.

        :::image type="content" source="../media/modernization-agent/assess-individual-report-output.png" alt-text="Screenshot of Modernize CLI to display the output of individual assessment report generation in terminal.":::

    - Creates an aggregated report.

        :::image type="content" source="../media/modernization-agent/assess-aggregated-report-output.png" alt-text="Screenshot of Modernize CLI to display the output of the aggregated report generation in terminal.":::

1. When the assessment completes, the agent automatically opens the aggregated report.

    :::image type="content" source="../media/modernization-agent/assess-repo-list-report.png" alt-text="Screenshot of Modernize CLI to display the content of the aggregated report":::

### Interactive mode (delegating to Cloud Coding Agents)

Firstly, please do below configuration for Cloud Coding Agents in each application repository. Please fork the sample repositories to be capable of configuring Cloud Coding agents.


#### Configuration for .NET applications

**Configure to run on Windows for .NET Framework application**

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

**Disable Firewall** 

Disable Copilot coding agent's integrated firewall in your repository settings as below:

:::image type="content" source="../media/modernization-agent/disable-firewall-for-cloud-coding-agent.png" alt-text="Screenshot of repository setting to disableCopilot coding agent's integrated firewall.":::

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

:::image type="content" source="../media/modernization-agent/mcp-config-cloud-coding-agent.png" alt-text="Screenshot of repository setting to configure coding agent's MCP server.":::

#### Steps

1. Run the modernization agent:

   ```bash
   modernize
   ```

1. The agent detects the `repos.json` file and displays the repository list:

    :::image type="content" source="../media/modernization-agent/assess-repo-list.png" alt-text="Screenshot of Modernize CLI to display the repository list in terminal.":::

1. Select repositories to assess, and press `Enter` to confirm your selection. 

    - **Press `Ctrl+A`** to select all repositories.
    - **Use arrow keys** to navigate and press `Space` to select individual repositories.

1. Select **1. Assess applications** from the main menu.

    :::image type="content" source="../media/modernization-agent/assess-understand-application-menu.png" alt-text="Screenshot of Modernize CLI to show the menu of understanding my application in terminal.":::

1. To run the assessment, select **2. Delegate to Cloud Coding Agents**.

    :::image type="content" source="../media/modernization-agent/assess-delegate-cloud-coding-agents-option.png" alt-text="Screenshot of Modernize CLI to do assess by delegating to Cloud Coding Agents in terminal.":::

1. The agent automatically delegates assessment tasks for each repository to Cloud Coding Agents and executes them in the cloud in parallel.

    :::image type="content" source="../media/modernization-agent/assess-delegate-cloud-coding-agents-progress.png" alt-text="Screenshot of Modernize CLI to display the output of the progress of delegating assessment to Cloud Coding Agents in terminal.":::

    The agent then pulls the per-app assessment results back to local and then generates the aggregated report locally.

    :::image type="content" source="../media/modernization-agent/assess-aggregated-report-output.png" alt-text="Screenshot of Modernize CLI to display the output of how the aggregated report gets generated locally in terminal.":::

1. When the assessment completes, the agent automatically opens the aggregated report.

### Non-interactive mode (CLI)

You can also use headless mode by specifying command arguments directly. Use the `modernize assess` command:

**Assess locally:**

```bash
modernize assess --multi-repo
```

**Assess by delegating to Cloud Coding Agents:**

```bash
modernize assess --delegate cloud
```

For more information, see [assess - CLI commands](cli-commands.md?#assess).

## Understanding the aggregated report

The aggregated report provides a comprehensive view across assessed applications as follows:

#### Dashboard

- Snapshot of portfolio health: total apps, how many need upgrades, and aggregate blocker and issue counts
- Technology distribution: what frameworks are in use and how many apps share them
- Effort distribution: whether the overall migration is a small or large undertaking

#### Recommendations

- Azure Services: maps current dependencies to recommended Azure equivalents; shared dependencies across apps are decided once, avoiding per-app rework
- Target Platform: guides hosting choice (for example, Container Apps versus AKS) and surfaces consolidation opportunities
- Upgrade Path: identifies which apps need framework upgrades as a prerequisite, separating upgrade work from migration work
- Migration Waves: sequences apps by readiness and risk into phases, enabling early wins while harder apps are prepared in parallel

#### Application Assessment Matrix

- Quick overview per application on aspects of framework, target platform, upgrade recommendation, issue breakdown (Mandatory, Potential, Optional), effort sizing, and more. 
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
- Verify that build files exist, such as `pom.xml`, `build.gradle`, `*.csproj`, or `*.sln`.
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

We value your input! If you have any feedback about batch assessment or the Modernization Agent, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml) or use the [GitHub Copilot modernization feedback form](https://aka.ms/ghcp-appmod/feedback).

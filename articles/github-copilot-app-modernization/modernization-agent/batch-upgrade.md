---
title: Batch Upgrade With The GitHub Copilot Modernization Agent
description: Learn how to use the GitHub Copilot modernization agent to upgrade multiple applications simultaneously with consistent modernization patterns.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 03/11/2026
---

# Batch upgrade with the GitHub Copilot modernization agent

Batch upgrade enables you to apply consistent modernization plans across multiple repositories simultaneously. This article shows you how to upgrade multiple applications efficiently at enterprise scale.

## Overview

Batch upgrade allows you to:

- **Upgrade multiple applications** simultaneously using the same upgrade target.
- **Apply consistent patterns** similar upgrade patterns across applications.
- **Leverage parallel execution** when delegating to Cloud Coding Agents.

## Benefits of batch upgrade

### Consistent execution

- **Standardized approach**: Apply the same modernization patterns across all repositories.
- **Reduced variability**: Ensure consistent upgrade paths for similar applications.
- **Reusable strategies**: Leverage organization-specific skills across applications.

### Scale and efficiency

- **Parallel processing**: Use Cloud Coding Agents to process multiple repositories simultaneously.
- **Automated workflows**: Integrate with CI/CD pipelines for scheduled modernization.
- **Time savings**: Reduce total modernization time from weeks to hours.

## Prerequisites

Before performing batch upgrade:

- [Modernize CLI installed](quickstart.md).
- Completed [batch assessment](batch-assess.md) (recommended but not required).
- All repositories use the same programming language (Java or .NET).
- Access to all repositories you want to upgrade.
- GitHub authentication configured (`gh auth login`).

> [!IMPORTANT]
> All repositories in a batch upgrade must use the same programming language. If a repository uses a different language, it will be marked as failed and skipped for now.

## Configure repositories

To enable batch upgrade, create a `.github/modernize/repos.json` file in your working directory listing all repositories you want to upgrade.

> [!TIP]
> Make sure you have the right permissions to access the repositories, or fork them first.

```json
[
  {
    "name": "PhotoAlbum-Java",
    "url": "https://github.com/Azure-Samples/PhotoAlbum-Java.git"
  },
  {
    "name": "ZavaSocialFrontEnd",
    "url": "https://github.com/bradygaster/ZavaSocialFrontEnd"
  }
]
```

### Repository configuration

Each entry requires:

- **name**: A friendly name for the repository (used in reports and dashboards)
- **url**: The Git clone URL (HTTPS format)

> [!TIP]
> You can include repositories from different organizations and use different authentication methods as long as you have access.

### File location

The `repos.json` file must be located at `.github/modernize/repos.json`.

This file is automatically detected by the modernization agent when running batch operations.

## Choose your execution mode

Batch upgrade supports two execution modes and two interaction methods:

### Execution modes

**Local execution**

- **Best for**: Testing, smaller sets of repositories (1-5 repos), or when you prefer local control.
- **How it works**: Processes repositories sequentially on your local machine.
- **Setup required**: None beyond the basic prerequisites.

**Cloud Coding Agent delegation**

- **Best for**: Enterprise-scale operations, large portfolios (5+ repos), or parallel processing.
- **How it works**: Submits tasks to GitHub Cloud Coding Agents for parallel execution in the cloud.
- **Setup required**: MCP server configuration in each repository (configured during setup below).

> [!TIP]
> Cloud Coding Agent delegation can reduce total modernization time from hours to minutes by processing repositories in parallel.

### Interaction methods

**Interactive mode (TUI)**

- Guided experience with menus and prompts.
- Best for first-time users or when you want to review options.
- Supports both local and cloud execution.

**Non-interactive mode (CLI/headless)**

- Command-line based, fully automated.
- Best for CI/CD pipelines and automation.
- Supports both local and cloud execution with `--delegate cloud` flag.

> [!NOTE]
> You can combine any execution mode with any interaction method. For example:
>
> - `modernize` (interactive, local)
> - `modernize` → select Cloud Coding Agents (interactive, cloud)
> - `modernize upgrade "Java 21"` (non-interactive, local)
> - `modernize upgrade "Java 21" --delegate cloud` (non-interactive, cloud)

## How batch upgrade works

The batch upgrade workflow:

1. **Language detection**: Automatically detects the project language (Java or .NET) from the first repository.
1. **Plan creation**: Creates an upgrade plan based on your prompt or uses latest LTS versions.
1. **Execution**: Applies the upgrade to each repository.
1. **Validation**: Builds and validates changes for each repository.

## Run batch upgrade

Now that you've configured your repositories and chosen an execution mode, you can start the batch upgrade.

### Interactive mode (upgrade locally)

1. Run the modernization agent:

   ```bash
   modernize
   ```

1. The agent detects the `repos.json` file and displays the repository list:

    :::image type="content" source="../media/modernization-agent/upgrade-repo-list.png" alt-text="Screenshot of Modernize CLI displaying the repository list in terminal.":::

1. Select repositories to upgrade, and press `Enter` to confirm your selection.

    - **Press `Ctrl+A`** to select all repositories.
    - **Or use arrow keys** to navigate and press `Enter` to select individual repositories.

1. Select **2. Upgrade** from the main menu.

    :::image type="content" source="../media/modernization-agent/upgrade-menu.png" alt-text="Screenshot of Modernize CLI showing the upgrade menu option in terminal.":::

1. To run the upgrade, select **1. Upgrade locally**.

    :::image type="content" source="../media/modernization-agent/upgrade-local-option.png" alt-text="Screenshot of Modernize CLI showing the upgrade locally option in terminal.":::

1. The agent then will automatically:

    - Create an upgrade plan based on your request.
    - Apply the plan to each repository sequentially.
    - Build and validate each repository after changes.
    - Display progress and summary for each repository.

    :::image type="content" source="../media/modernization-agent/upgrade-progress.png" alt-text="Screenshot of Modernize CLI displaying the upgrade progress for each repository in terminal.":::

### Interactive mode (delegating to Cloud Coding Agents)

#### Prerequisites: Configure MCP server

Before running the upgrade, configure the GitHub Copilot Modernization MCP Server in each repository.

**For Java applications**, add this configuration in the Cloud Coding Agent section of your repository settings:

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

    :::image type="content" source="../media/modernization-agent/upgrade-repo-list.png" alt-text="Screenshot of Modernize CLI displaying the repository list in terminal.":::

1. Select repositories to upgrade, and press `Enter` to confirm your selection.

    - **Press `Ctrl+A`** to select all repositories.
    - **Or use arrow keys** to navigate and press `Enter` to select individual repositories.

1. Select **2. Upgrade** from the main menu.

1. To run the upgrade, select **2. Delegate to Cloud Coding Agents**.

    :::image type="content" source="../media/modernization-agent/upgrade-delegate-option.png" alt-text="Screenshot of Modernize CLI showing the delegate to Cloud Coding Agents option in terminal.":::

1. The agent then will automatically:

    - Create upgrade plans for each repository.
    - Submit a Cloud Coding Agent job for each repository.
    - Jobs run independently in parallel in the cloud.
    - Display job IDs and PR URLs for each repository.

        :::image type="content" source="../media/modernization-agent/upgrade-cloud-coding-agent-progress.png" alt-text="Screenshot of Modernize CLI displaying the progress of delegating upgrades to Cloud Coding Agents in terminal.":::

    - Delegate tasks to AgentHQ for parallel execution.

        :::image type="content" source="../media/modernization-agent/upgrade-agent-headquarters-tasks.png" alt-text="Screenshot showing upgrade tasks delegated to AgentHQ.":::

    - Track progress for each individual task in real-time.

        :::image type="content" source="../media/modernization-agent/upgrade-cloud-coding-agent-status.png" alt-text="Screenshot showing progress tracking for individual Cloud Coding Agent upgrade tasks.":::

    - Display upgrade summary for each completed task.

        :::image type="content" source="../media/modernization-agent/upgrade-cloud-coding-agent-summary.png" alt-text="Screenshot showing upgrade summary for individual Cloud Coding Agent tasks.":::

### Non-interactive mode (CLI)

For automation and CI/CD integration, use the `modernize upgrade` command:

**Upgrade locally:**

```bash
modernize upgrade "Java 21"
```

**Upgrade using Cloud Coding Agents:**

```bash
modernize upgrade "Java 21" --delegate cloud
```

The command automatically detects the `repos.json` file and processes all repositories.

> [!NOTE]
> For batch headless execution and additional CLI options, see the [Multi-repository configuration](cli-commands.md#multi-repository-configuration) section in the CLI commands reference.

## Review results

After batch upgrade completes:

1. **Check the aggregated report** displayed in the terminal.

1. **Review individual repository changes**:

    ```bash
    cd <repository-name>
    git status
    git diff
    ```

1. **Create pull requests** for successful upgrades:

    ```bash
    cd <repository-name>
    gh pr create --title "Upgrade to Java 21" --body "Automated upgrade by modernization agent"
    ```

## Troubleshooting batch upgrades

### Common issues

**Repository access errors:**

- Verify GitHub authentication with `gh auth status`.
- Ensure you have access to all repositories in `repos.json`.

**Language mismatch errors:**

- Ensure all repositories in `repos.json` use the same language (Java or .NET).
- Create separate batch operations for different languages.

**Clone failures:**

- Verify repository URLs in `repos.json` are correct and accessible.
- Ensure you have proper access permissions to all repositories.
- Check network connectivity and VPN settings.

**Build failures after upgrade:**

- Review build error messages in the aggregated report.
- Check if additional dependencies need to be updated.
- Verify compatibility of third-party libraries with the new version.

**Individual repository failures:**

- The batch process continues even if individual repositories fail.
- Review the aggregated report to identify failed repositories.
- Check error logs for specific error messages.
- Retry failed repositories individually.

**Cloud Coding Agent failures:**

- Check GitHub Actions permissions and quota limits.
- For .NET Framework, ensure Windows runner configuration is properly set.

## Next steps

After completing batch upgrade, you can:

**Continue improving:**

- [Run batch assessment](batch-assess.md) - Reassess to verify improvements and identify new opportunities.
- [Create custom skills for organization-specific patterns](customization.md) - Capture successful patterns for reuse.

**Learn more:**

- [Learn about CLI commands](cli-commands.md)

## Provide feedback

We value your input! If you have any feedback about batch upgrade or the Modernization Agent, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml) or use the [GitHub Copilot modernization feedback form](https://aka.ms/ghcp-appmod/feedback).

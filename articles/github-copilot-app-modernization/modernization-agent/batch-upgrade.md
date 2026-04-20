---
title: Batch Upgrade with the GitHub Copilot Modernization Agent
description: Learn how to use the GitHub Copilot modernization agent to upgrade multiple applications simultaneously with consistent modernization patterns.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 04/17/2026
---

# Batch upgrade with the GitHub Copilot modernization agent

Batch upgrade enables you to apply consistent modernization plans across multiple repositories simultaneously. This article shows you how to upgrade multiple applications efficiently at enterprise scale.

By using batch upgrade, you can:

- **Upgrade multiple applications** simultaneously by using the same upgrade target.
- **Apply consistent patterns** by using similar upgrade patterns across applications.
- **Leverage parallel execution** when delegating to Cloud Coding Agents.

Batch upgrade provides the following benefits:

- Consistent execution:

    - **Standardized approach**: Apply the same modernization patterns across all repositories.
    - **Reduced variability**: Ensure consistent upgrade paths for similar applications.
    - **Reusable strategies**: Use organization-specific skills across applications.

- Scale and efficiency:

    - **Parallel processing**: Use Cloud Coding Agents to process multiple repositories simultaneously.
    - **Automated workflows**: Integrate with CI/CD pipelines for scheduled modernization.
    - **Time savings**: Reduce total modernization time from weeks to hours.

## Prerequisites

- [Modernize CLI](quickstart.md).
- A completed [batch assessment](batch-assess.md) (recommended but not required).
- All repositories use the same programming language (Java or .NET).
- Access to all repositories you want to upgrade.
- GitHub authentication configured (`gh auth login`).

> [!IMPORTANT]
> All repositories in a batch upgrade must use the same programming language. If a repository uses a different language, the batch upgrade marks the repository as failed and skips it.

## Configure repositories

The modernization agent supports multiple ways to specify the repositories you want to upgrade:

- **Current folder**: Upgrade the project in your current working directory.
- **Manual input**: Enter local directory paths or remote Git URLs directly.
- **Repository config file**: Use a JSON config file that lists all repositories.

### Repository config file

For batch operations across many repositories, create a JSON config file to list all repositories. For example, create it at `.github/modernize/repos.json` in your working directory, or provide a custom path.

> [!TIP]
> For sample repositories, fork them first and make sure you have admin permission to delegate the job to Cloud Coding Agents.

**Simple format** (array of repositories):

```json
[
  {
    "name": "PhotoAlbum-Java",
    "url": "https://github.com/Azure-Samples/PhotoAlbum-Java.git"
  },
  {
    "name": "ZavaSocialFrontEnd",
    "url": "https://github.com/Azure-Samples/ZavaSocialFrontEnd"
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

> [!TIP]
> You can include repositories from different organizations and use different authentication methods as long as you have access.

The modernization agent automatically detects the `repos.json` file at `.github/modernize/repos.json` when you select **From a config file** in interactive mode. You can also provide a custom path.

## Choose your execution mode

Batch upgrade supports two execution modes and two interaction methods:

### Execution modes

**Local execution**

- **Best for**: Testing, smaller sets of repositories (1-5 repos), or when you prefer local control.
- **How it works**: Processes repositories sequentially on your local machine.
- **Setup required**: None beyond the basic prerequisites.
- **Supports**: Both Git URL and local path repositories.

**Cloud Coding Agent delegation**

- **Best for**: Enterprise-scale operations, large portfolios (5+ repos), or parallel processing.
- **How it works**: Submits tasks to GitHub Cloud Coding Agents for parallel execution in the cloud.
- **Setup required**: MCP server configuration in each repository (configured during setup).
- **Supports**: Only repositories with GitHub (github.com) URLs. Local paths and non-GitHub providers aren't supported.

> [!IMPORTANT]
> Cloud Coding Agent delegation requires repositories to have **GitHub (github.com) repository URLs**. Repositories specified with local paths or hosted on non-GitHub providers (GitLab, Azure DevOps) are skipped during cloud delegation. Use local execution for those repositories.

> [!TIP]
> By processing repositories in parallel, Cloud Coding Agent delegation can reduce total modernization time from hours to minutes.

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
> - `modernize` → select Upgrade (interactive, local)
> - `modernize` → select Upgrade → Delegate to Cloud Agents (interactive, cloud)
> - `modernize upgrade "Java 21" --source ./repos.json` (non-interactive, local)
> - `modernize upgrade "Java 21" --source ./repos.json --delegate cloud` (non-interactive, cloud)

## How batch upgrade works

The batch upgrade workflow:

1. **Language detection**: Automatically detects the project language (Java or .NET) from the first repository.
1. **Plan creation**: Creates an upgrade plan based on your prompt or uses latest LTS versions.
1. **Execution**: Applies the upgrade to each repository.
1. **Validation**: Builds and validates changes for each repository.

## Run batch upgrade

After you configure your repositories and choose an execution mode, start the batch upgrade.

### Interactive mode (upgrade locally)

1. Run the modernization agent:

   ```bash
   modernize
   ```

1. Select **Upgrade** from the main menu.

    :::image type="content" source="../media/modernization-agent/upgrade-menu.png" alt-text="Screenshot of Modernize CLI that shows the main menu with the Upgrade option in the terminal." lightbox="../media/modernization-agent/upgrade-menu.png":::

1. Choose how to specify your target repositories. Select **From a config file** to use a `repos.json` file.

    :::image type="content" source="../media/modernization-agent/source-type-selection.png" alt-text="Screenshot of Modernize CLI that shows the source type selection in the terminal." lightbox="../media/modernization-agent/source-type-selection.png":::

    > [!TIP]
    > You can also select **Manual input** to enter local paths or remote Git URLs directly, or **Current folder** to upgrade the project in your current directory.

1. If the `repos.json` file is detected at the default location, the agent automatically fills it in. Otherwise, enter the path to your config file and press <kbd>Enter</kbd>.

1. All repositories are selected by default. Deselect any repositories you want to skip, and then press <kbd>Enter</kbd> to confirm your selection.

    - **Use arrow keys** to navigate and press <kbd>Space</kbd> to toggle individual repositories.

    :::image type="content" source="../media/modernization-agent/upgrade-repo-list.png" alt-text="Screenshot of Modernize CLI that shows the Choose repositories list in the terminal." lightbox="../media/modernization-agent/upgrade-repo-list.png":::

1. Choose the execution mode. Select **Upgrade locally**.

    :::image type="content" source="../media/modernization-agent/upgrade-local-option.png" alt-text="Screenshot of Modernize CLI that shows the Upgrade locally menu option in the terminal." lightbox="../media/modernization-agent/upgrade-local-option.png":::

1. Enter the upgrade target prompt (for example, `Java 21` or `.NET 10`) or press <kbd>Enter</kbd> to accept the default (latest LTS version).

1. The agent automatically:

    - Creates an upgrade plan based on your request.
    - Applies the plan to each repository sequentially.
    - Builds and validates each repository after changes.
    - Displays progress and summary for each repository.

    :::image type="content" source="../media/modernization-agent/upgrade-progress.png" alt-text="Screenshot of Modernize CLI that shows the upgrade progress for each repository in the terminal." lightbox="../media/modernization-agent/upgrade-progress.png":::

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

:::image type="content" source="../media/modernization-agent/mcp-config-cloud-coding-agent.png" alt-text="Screenshot of GitHub that shows the repository Coding agent settings pane with the MCP configuration section highlighted." lightbox="../media/modernization-agent/mcp-config-cloud-coding-agent.png":::

#### Steps

1. Run the modernization agent:

    ```bash
    modernize
    ```

1. Select **Upgrade** from the main menu.

    :::image type="content" source="../media/modernization-agent/upgrade-menu.png" alt-text="Screenshot of Modernize CLI that shows the main menu with the Upgrade option in the terminal." lightbox="../media/modernization-agent/upgrade-menu.png":::

1. Choose how to specify your target repositories. Select **From a config file**.

    :::image type="content" source="../media/modernization-agent/source-type-selection.png" alt-text="Screenshot of Modernize CLI that shows the source type selection in the terminal." lightbox="../media/modernization-agent/source-type-selection.png":::

1. If the `repos.json` file is detected at the default location, the agent automatically fills it in. Otherwise, enter the path to your config file and press <kbd>Enter</kbd>.

1. All repositories are selected by default. Deselect any repositories you want to skip, and then press <kbd>Enter</kbd> to confirm your selection. Use arrow keys to navigate and press <kbd>Space</kbd> to toggle individual repositories.

    :::image type="content" source="../media/modernization-agent/upgrade-repo-list.png" alt-text="Screenshot of Modernize CLI that shows the repository list in terminal." lightbox="../media/modernization-agent/upgrade-repo-list.png":::

1. Choose the execution mode. Select **Delegate to Cloud Agents**.

    :::image type="content" source="../media/modernization-agent/upgrade-delegate-option.png" alt-text="Screenshot of Modernize CLI that shows the Delegate to Cloud Coding Agents menu option in the terminal." lightbox="../media/modernization-agent/upgrade-delegate-option.png":::

1. Enter the upgrade target prompt (for example, `Java 21`) or press <kbd>Enter</kbd> to accept the default.

1. The agent automatically:

    - Creates upgrade plans for each repository.
    - Submits a Cloud Coding Agent job for each repository.
    - Runs jobs independently in parallel in the cloud.
    - Displays job IDs and PR URLs for each repository.

        :::image type="content" source="../media/modernization-agent/upgrade-cloud-coding-agent-progress.png" alt-text="Screenshot of Modernize CLI that shows the progress of delegating upgrades to Cloud Coding Agents in the terminal." lightbox="../media/modernization-agent/upgrade-cloud-coding-agent-progress.png":::

    - Delegates tasks to AgentHQ for parallel execution.

        :::image type="content" source="../media/modernization-agent/upgrade-agent-headquarters-tasks.png" alt-text="Screenshot of GitHub that shows the Agents pane with the upgrade tasks delegated to AgentHQ." lightbox="../media/modernization-agent/upgrade-agent-headquarters-tasks.png":::

    - Tracks progress for each individual task in real-time.

        :::image type="content" source="../media/modernization-agent/upgrade-cloud-coding-agent-status.png" alt-text="Screenshot of GitHub that shows the Agents pane with progress tracking for individual Cloud Coding Agent upgrade tasks." lightbox="../media/modernization-agent/upgrade-cloud-coding-agent-status.png":::

    - Displays upgrade summary for each completed task.

        :::image type="content" source="../media/modernization-agent/upgrade-cloud-coding-agent-summary.png" alt-text="Screenshot of GitHub that shows the Agents pane with the upgrade summary for individual Cloud Coding Agent tasks." lightbox="../media/modernization-agent/upgrade-cloud-coding-agent-summary.png":::

### Non-interactive mode (CLI)

For automation and CI/CD integration, use the `modernize upgrade` command:

**Upgrade locally using a repository config file:**

```bash
modernize upgrade "Java 21" --source .github/modernize/repos.json
```

**Upgrade multiple repositories by specifying sources directly:**

```bash
modernize upgrade "Java 21" --source https://github.com/org/repo1 --source https://github.com/org/repo2
```

**Upgrade using Cloud Coding Agents:**

```bash
modernize upgrade "Java 21" --source .github/modernize/repos.json --delegate cloud
```

> [!NOTE]
> For batch headless execution and more CLI options, see the [Multi-repository configuration](cli-commands.md#multi-repository-configuration) section in the CLI commands reference.

## Review results

When the batch upgrade finishes:

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

### Common problems

**Repository access errors:**

- Verify GitHub authentication by using `gh auth status`.
- Make sure you have access to all repositories in `repos.json`.

**Language mismatch errors:**

- Make sure all repositories in `repos.json` use the same language (Java or .NET).
- Create separate batch operations for different languages.

**Clone failures:**

- Verify repository URLs in `repos.json` are correct and accessible.
- Make sure you have proper access permissions to all repositories.
- Check network connectivity and VPN settings.

**Build failures after upgrade:**

- Review build error messages in the aggregated report.
- Check if you need to update other dependencies.
- Verify compatibility of third-party libraries with the new version.

**Individual repository failures:**

- The batch process continues even if individual repositories fail.
- Review the aggregated report to identify failed repositories.
- Check error logs for specific error messages.
- Retry failed repositories individually.

**Cloud Coding Agent failures:**

- Check GitHub Actions permissions and quota limits.
- For .NET Framework, make sure Windows runner configuration is properly set.

## Next steps

After completing batch upgrade, you can:

**Continue improving:**

- [Run batch assessment](batch-assess.md) - Reassess to verify improvements and identify new opportunities.
- [Create custom skills for organization-specific patterns](customization.md) - Capture successful patterns for reuse.

**Learn more:**

- [Learn about CLI commands](cli-commands.md)

## Provide feedback

We value your input! If you have any feedback about batch upgrade or the Modernization agent, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml) or use the [GitHub Copilot modernization feedback form](https://aka.ms/ghcp-appmod/feedback).

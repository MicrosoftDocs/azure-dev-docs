---
title: GitHub Copilot Modernization Agent CLI Commands
description: Complete reference for GitHub Copilot modernization agent CLI commands, including interactive and non-interactive modes.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: reference
ai-usage: ai-assisted
ms.date: 04/17/2026
---

# GitHub Copilot modernization agent CLI commands

The GitHub Copilot modernization agent provides both interactive and non-interactive modes for application modernization.

## Command modes

### Interactive mode

Launch the interactive Text User Interface (TUI) for guided modernization:

```bash
modernize
```

The interactive mode provides:

- Menu-driven navigation through the modernization workflow.
- Flexible source selection: current folder, manual input (local paths or Git URLs), or repository config files.
- Visual plan and progress indicators.
- Guided prompts for configuration options, including assessment domains and parameters.
- Multi-repository selection interface.

### Non-interactive mode

Execute specific commands directly for automation and scripting:

```bash
modernize <command> [options]
```

Use non-interactive mode when:

- Integrating with CI/CD pipelines.
- Automating batch operations.
- Scripting modernization workflows.
- Running in headless environments.

## Global options

All commands support these global options:

| Option         | Description                                   |
|----------------|-----------------------------------------------|
| `--help`, `-h` | Displays help information.                    |
| `--no-tty`     | Disables interactive prompts (headless mode). |

## Commands

### assess

Runs an assessment and generates a comprehensive analysis report.

#### Syntax

```bash
modernize assess [options]
```

#### Options

| Option                   | Description                                                                                                                                                 | Default                         |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| `--source <source>`      | Source to assess (repeatable). Accepts local paths, Git URLs, or a JSON config file path. Use multiple `--source` flags to specify several repositories.    | `.` (current directory)         |
| `--output-path <path>`   | A custom output path for assessment results.                                                                                                                | `.github/modernize/assessment/` |
| `--issue-url <url>`      | A GitHub issue URL to update with the assessment summary.                                                                                                   | None                            |
| `--format <format>`      | Output format for assessment reports: `html` or `markdown`.                                                                                                 | `html`                          |
| `--assess-config <path>` | Path to an assessment configuration YAML file that overrides default assessment parameters such as target runtime, compute services, and analysis coverage. | Auto-discovered or defaults     |
| `--model <model>`        | The LLM model to use.                                                                                                                                       | `claude-sonnet-4.6`             |
| `--delegate <delegate>`  | The execution mode: `local` (this machine) or `cloud` (Cloud Coding Agent).                                                                                 | `local`                         |
| `--wait`                 | Waits for the delegated tasks to complete and generate results (only valid with `--delegate cloud`).                                                        | Disabled                        |
| `--force`                | Forces restart delegation, ignoring ongoing tasks (only valid with `--delegate cloud`).                                                                     | Disabled                        |

#### Examples

Basic assessment of current directory:

```bash
modernize assess
```

Assess with custom output location:

```bash
modernize assess --output-path ./reports/assessment
```

Assess and update GitHub issue with results:

```bash
modernize assess --issue-url https://github.com/org/repo/issues/123
```

Assess specific project directory:

```bash
modernize assess --source /path/to/project
```

Assess multiple repositories by using a config file:

```bash
modernize assess --source .github/modernize/repos.json
```

Assess multiple repositories by specifying sources directly:

```bash
modernize assess --source https://github.com/org/repo1 --source https://github.com/org/repo2
```

Assess and output reports in markdown format:

```bash
modernize assess --format markdown
```

#### Output

The assessment generates:

- **Report files**: Detailed analysis in JSON, MD, and HTML formats.
- **Summary**: Key findings and recommendations.
- **Issue updates** (if you provide `--issue-url`): GitHub issue comment with summary.

### plan create

Creates a modernization plan based on a natural language prompt describing your modernization goals.

#### Syntax

```bash
modernize plan create <prompt> [options]
```

#### Arguments

| Argument   | Description                                                           |
|------------|-----------------------------------------------------------------------|
| `<prompt>` | A natural-language description of the modernization goals (required). |

#### Options

| Option               | Description                                               | Default              |
|----------------------|-----------------------------------------------------------|----------------------|
| `--source <path>`    | The path to the application source code.                  | Current directory    |
| `--plan-name <name>` | The name for the modernization plan.                      | `modernization-plan` |
| `--language <lang>`  | The programming language (`java`, `dotnet`, or `python`). | Auto-detected        |
| `--overwrite`        | Overwrites an existing plan with the same name.           | Disabled             |
| `--model <model>`    | The LLM model to use.                                     | `claude-sonnet-4.6`  |

#### Examples

Generate a migration plan:

```bash
modernize plan create "migrate from oracle to azure postgresql"
```

Generate an upgrade plan with custom name:

```bash
modernize plan create "upgrade to spring boot 3" --plan-name spring-boot-upgrade
```

Generate a deployment plan:

```bash
modernize plan create "deploy the app to azure container apps" --plan-name deploy-to-aca
```

Full options example:

```bash
modernize plan create "upgrade to .NET 8" \
    --source /path/to/project \
    --plan-name dotnet8-upgrade \
    --language dotnet \
    --issue-url https://github.com/org/repo/issues/456
```

#### Prompt examples

**Framework upgrades:**

- `upgrade to spring boot 3`
- `upgrade to .NET 10`
- `upgrade to JDK 21`
- `migrate from spring boot 2 to spring boot 3`

**Database migrations:**

- `migrate from oracle to azure postgresql`
- `migrate from SQL Server to azure cosmos db`
- `switch from MySQL to azure database for mysql`

**Cloud migrations:**

- `migrate from on-premises to azure`
- `containerize and deploy to azure container apps`
- `migrate from rabbitmq to azure service bus`

**Deployment:**

- `deploy to azure app service`
- `deploy to azure kubernetes service`
- `set up CI/CD pipeline for azure`

#### Output

The command generates:

- **Plan file** (`.github/modernize/{plan-name}/plan.md`): Detailed modernization strategy including:
  - Context and goals
  - Approach and methodology
  - Clarifications

- **Task list** (`.github/modernize/{plan-name}/tasks.json`): Structured breakdown of executable tasks with:
  - Task descriptions
  - Skills to use
  - Success criteria

> [!TIP]
> You can manually edit both `plan.md` and `tasks.json` after generation to customize the approach before execution.

### plan execute

Executes a modernization plan created by `modernize plan create`.

#### Syntax

```bash
modernize plan execute [prompt] [options]
```

#### Arguments

| Argument   | Description                                                                           |
|------------|---------------------------------------------------------------------------------------|
| `[prompt]` | The optional natural language instructions for execution (for example, "skip tests"). |

#### Options

| Option                  | Description                                                                 | Default              |
|-------------------------|-----------------------------------------------------------------------------|----------------------|
| `--source <path>`       | The path to the application source code.                                    | Current directory    |
| `--plan-name <name>`    | The name of the plan to execute.                                            | `modernization-plan` |
| `--language <lang>`     | The programming language (`java` or `dotnet`).                              | Auto-detected        |
| `--model <model>`       | The LLM model to use.                                                       | `claude-sonnet-4.6`  |
| `--delegate <delegate>` | The execution mode: `local` (this machine) or `cloud` (Cloud Coding Agent). | `local`              |
| `--force`               | Forces execution even when a CCA job is in progress.                        | Disabled             |

#### Examples

Execute the most recent plan interactively:

```bash
modernize plan execute
```

Execute a specific plan:

```bash
modernize plan execute --plan-name spring-boot-upgrade
```

Execute with extra instructions:

```bash
modernize plan execute "skip the test" --plan-name spring-boot-upgrade
```

Execute in headless mode for CI/CD:

```bash
modernize plan execute --plan-name spring-boot-upgrade --no-tty
```

#### Execution behavior

During execution, the agent:

1. **Loads the plan**: Reads the plan and task list from `.github/modernization/{plan-name}/`

1. **Executes tasks**: Processes each task in the task list sequentially:

    - Applies code transformations.
    - Validates builds after changes.
    - Scans for CVEs.
    - Commits changes with descriptive messages.

1. **Generates summary**: Provides a report of all changes and results.

#### Output

- **Commit history**: Detailed commits for each task executed.
- **Summary report**: Overview of changes, successes, and any problems encountered.
- **Build validation**: Confirmation that the application builds successfully.
- **CVE report**: Security vulnerabilities identified and addressed.

### upgrade

Runs an end-to-end upgrade workflow - plan, and execute - in a single command.

#### Syntax

```bash
modernize upgrade [prompt] [options]
```

#### Arguments

| Argument   | Description                                                                                      |
|------------|--------------------------------------------------------------------------------------------------|
| `[prompt]` | The target version, such as `Java 17`, `Spring Boot 3.2`, `.NET 10`. Defaults to the latest LTS. |

#### Options

| Option                  | Description                                                                                                                                               | Default                 |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|
| `--source <source>`     | Source to upgrade (repeatable). Accepts local paths, Git URLs, or a JSON config file path. Use multiple `--source` flags to specify several repositories. | `.` (current directory) |
| `--delegate <delegate>` | The execution mode: `local` (this machine) or `cloud` (Cloud Coding Agent).                                                                               | `local`                 |
| `--model <model>`       | The LLM model to use.                                                                                                                                     | `claude-sonnet-4.6`     |

#### Examples

Run `upgrade` on the current directory:

```bash
modernize upgrade "Java 17"
```

```bash
modernize upgrade ".NET 10"
```

Run `upgrade` on a specific project:

```bash
modernize upgrade "Java 17" --source /path/to/project
```

Run `upgrade` by using the Cloud Coding Agent:

```bash
modernize upgrade "Java 17" --delegate cloud
```

Upgrade multiple repositories by using a config file:

```bash
modernize upgrade "Java 21" --source .github/modernize/repos.json
```

Upgrade multiple repositories by specifying sources directly:

```bash
modernize upgrade "Java 21" --source https://github.com/org/repo1 --source https://github.com/org/repo2
```

### help

Provides help and information commands.

#### Syntax

```bash
modernize help [command]
```

#### Commands

| Command  | Description                                       |
|----------|---------------------------------------------------|
| `models` | Lists available LLM models and their multipliers. |

#### Examples

List available models:

```bash
modernize help models
```

## Configure the CLI

By using the modernization agent, you can customize application behavior through JSON files and environment variables.

### Environment variables

Set environment variables to override all other configuration scopes:

| Variable                      | Description                                                            | Default             |
|-------------------------------|------------------------------------------------------------------------|---------------------|
| `MODERNIZE_LOG_LEVEL`         | The logging level (`none`, `error`, `warning`, `info`, `debug`, `all`) | `info`              |
| `MODERNIZE_MODEL`             | The LLM model to use.                                                  | `claude-sonnet-4.6` |
| `MODERNIZE_COLLECT_TELEMETRY` | Enable or disable telemetry collection.                                | `true`              |

Example:

```bash
export MODERNIZE_LOG_LEVEL=debug
export MODERNIZE_MODEL=claude-sonnet-4.6
modernize assess
```

### User configuration

Store user-specific preferences in `~/.modernize/config.json` or repository-wide settings in `.github/modernize/config.json`.

```json
{
  "model": "claude-sonnet-4.6",
  "log_level": "info",
  "trusted_folders": [
    "/path/to/trusted/project",
  ]
}
```

The `trusted_folders` property specifies the folders that are trusted to use LLM in interactive mode.

> [!NOTE]
> Environment variables take the highest precedence, followed by user configuration, and then repository configuration. Use environment variables for CI/CD overrides and user configuration for personal preferences.

### Multi-repository configuration

You can provide multiple sources to the CLI in several ways:

- **Repository config file**: Create a `.github/modernize/repos.json` file that lists all repositories, then pass it with `--source`.
- **Multiple `--source` flags**: Specify local paths or Git URLs directly on the command line.
- **Interactive mode**: Select sources through the TUI (current folder, manual input, or repository config).

#### Repository config file

Create a `.github/modernize/repos.json` file to define your repository list. The config supports two formats:

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

| Field         | Description                         | Required               |
|---------------|-------------------------------------|------------------------|
| `name`        | A friendly name for the repository. | Yes                    |
| `url`         | Git clone URL (HTTPS or SSH).       | One of `url` or `path` |
| `path`        | Absolute local directory path.      | One of `url` or `path` |
| `branch`      | Branch to check out after cloning.  | No                     |
| `description` | Human-readable description.         | No                     |

**Full format with app grouping** (optional, for organized reporting):

You can add an `apps[]` section to group repositories into logical applications. When apps are defined, the aggregated report organizes results by application and supports report distribution.

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

| Type    | Description                                                                                  | Required fields |
|---------|----------------------------------------------------------------------------------------------|-----------------|
| `local` | Copy reports to a local directory.                                                           | `path`          |
| `git`   | Push reports to a Git repository. URL format: `https://github.com/org/repo.git#branch:path`. | `url`           |

> [!IMPORTANT]
> Cloud Coding Agent delegation (`--delegate cloud`) requires repositories to have **GitHub (github.com) repository URLs**. Local path repositories and non-GitHub providers (GitLab, Azure DevOps) aren't supported for cloud delegation and are skipped.

Then use `--source` to pass the config file path:

Assess all repositories locally:

```bash
modernize assess --source .github/modernize/repos.json
```

Assess all repositories by using the Cloud Coding Agent:

```bash
modernize assess --source .github/modernize/repos.json --delegate cloud
```

Upgrade all repositories by using the Cloud Coding Agent:

```bash
modernize upgrade --source .github/modernize/repos.json --delegate cloud
```

#### Multiple sources on the command line

You can also specify multiple sources directly:

```bash
modernize assess --source https://github.com/org/repo1 --source https://github.com/org/repo2
```

```bash
modernize upgrade "Java 21" --source ./project-a --source ./project-b
```

## Next steps

- [Batch assessment: Assess multiple applications](batch-assess.md)
- [Batch upgrade: Upgrade multiple applications](batch-upgrade.md)
- [Create custom skills for your organization](customization.md)
- [Return to overview](overview.md)

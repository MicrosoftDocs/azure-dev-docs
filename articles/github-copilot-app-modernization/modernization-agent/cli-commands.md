---
title: GitHub Copilot Modernization Agent CLI Commands
description: Complete reference for GitHub Copilot modernization agent CLI commands, including interactive and non-interactive modes.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: reference
ai-usage: ai-assisted
ms.date: 03/11/2026
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

- Menu-driven navigation through modernization workflow.
- Visual plan and progress indicators.
- Guided prompts for configuration options.
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

| Option         | Description                                 |
|----------------|---------------------------------------------|
| `--help`, `-h` | Display help information                    |
| `--no-tty`     | Disable interactive prompts (headless mode) |

## Commands

### assess

Runs assessment and generates a comprehensive analysis report.

#### Syntax

```bash
modernize assess [options]
```

#### Options

| Option                  | Description                                                                                    | Default                         |
|-------------------------|------------------------------------------------------------------------------------------------|---------------------------------|
| `--source <path>`       | Path to source project (relative or absolute local path)                                       | `.` (current directory)         |
| `--output-path <path>`  | Custom output path for assessment results                                                      | `.github/modernize/assessment/` |
| `--issue-url <url>`     | GitHub issue URL to update with assessment summary                                             | None                            |
| `--multi-repo`          | Enable multi-repo assess. Scans first-level subdirectories for multiple repositories           | Disabled                        |
| `--model <model>`       | LLM model to use                                                                               | `claude-sonnet-4.6`             |
| `--delegate <delegate>` | Execution mode: `local` (this machine) or `cloud` (Cloud Coding Agent)                         | `local`                         |
| `--wait`                | Wait for delegated tasks to complete and generate results (only valid with `--delegate cloud`) | Disabled                        |
| `--force`               | Force restart delegation, ignoring ongoing tasks (only valid with `--delegate cloud`)          | Disabled                        |

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

Assess multiple repos in current directory:

```bash
modernize assess  --multi-repo
```

#### Output

The assessment generates:

- **Report files**: Detailed analysis in JSON, MD and HTML formats.
- **Summary**: Key findings and recommendations.
- **Issue updates** (if `--issue-url` provided): GitHub issue comment with summary.

### plan create

Creates a modernization plan based on a natural language prompt describing your modernization goals.

#### Syntax

```bash
modernize plan create <prompt> [options]
```

#### Arguments

| Argument   | Description                                                    |
|------------|----------------------------------------------------------------|
| `<prompt>` | Natural language description of modernization goals (required) |

#### Options

| Option               | Description                                  | Default              |
|----------------------|----------------------------------------------|----------------------|
| `--source <path>`    | Path to the application source code          | Current directory    |
| `--plan-name <name>` | Name for the modernization plan              | `modernization-plan` |
| `--language <lang>`  | Programming language (java, dotnet, python)  | Auto-detected        |
| `--overwrite`        | Overwrite an existing plan with the same name| Disabled             |
| `--model <model>`    | LLM model to use                             | `claude-sonnet-4.6`  |

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

| Argument   | Description                                                               |
|------------|---------------------------------------------------------------------------|
| `[prompt]` | Optional natural language instructions for execution (e.g., "skip tests") |

#### Options

| Option                  | Description                                                                                    | Default              |
|-------------------------|------------------------------------------------------------------------------------------------|----------------------|
| `--source <path>`       | Path to the application source code                                                            | Current directory    |
| `--plan-name <name>`    | Name of the plan to execute                                                                    | `modernization-plan` |
| `--language <lang>`     | Programming language (`java` or `dotnet`)                                                      | Auto-detected        |
| `--model <model>`       | LLM model to use                                                                               | `claude-sonnet-4.6`  |
| `--delegate <delegate>` | Execution mode: `local` (this machine) or `cloud` (Cloud Coding Agent)                         | `local`              |
| `--force`               | Force execution even when a CCA job is in progress                                             | Disabled             |

#### Examples

Execute the most recent plan interactively:

```bash
modernize plan execute
```

Execute a specific plan:

```bash
modernize plan execute --plan-name spring-boot-upgrade
```

Execute with additional instructions:

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
- **Summary report**: Overview of changes, successes, and any issues encountered.
- **Build validation**: Confirmation that the application builds successfully.
- **CVE report**: Security vulnerabilities identified and addressed.

### upgrade

Runs an end-to-end upgrade workflow - plan, and execute - in a single command.

#### Syntax

```bash
modernize upgrade [prompt] [options]
```

#### Arguments

| Argument   | Description                                                                              |
|------------|------------------------------------------------------------------------------------------|
| `[prompt]` | Target version, such as `Java 17`, `Spring Boot 3.2`, `.NET 10`. Defaults to latest LTS. |

#### Options

| Option                  | Description                                                            | Default                 |
|-------------------------|------------------------------------------------------------------------|-------------------------|
| `--source <source>`     | Path to source project (relative or absolute local path)               | `.` (current directory) |
| `--delegate <delegate>` | Execution mode: `local` (this machine) or `cloud` (Cloud Coding Agent) | `local`                 |
| `--model <model>`       | LLM model to use                                                       | `claude-sonnet-4.6`     |

#### Examples

Run upgrade on current directory:

```bash
modernize upgrade "Java 17"
```

```bash
modernize upgrade ".NET 10"
```

Run upgrade on a specific project:

```bash
modernize upgrade "Java 17" --source /path/to/project
```

Run upgrade using the Cloud Coding Agent:

```bash
modernize upgrade "Java 17" --delegate cloud
```

### help

Provides help and information commands.

#### Syntax

```bash
modernize help [command]
```

#### Commands

| Command  | Description                                     |
|----------|-------------------------------------------------|
| `models` | List available LLM models and their multipliers |

#### Examples

List available models:

```bash
modernize help models
```

## Configure the CLI

The modernization agent enables you to customize application behavior through JSON files and environment variables.

### Environment variables

Set environment variables to override all other configuration scopes:

| Variable                      | Description                                                        | Default             |
|-------------------------------|--------------------------------------------------------------------|---------------------|
| `MODERNIZE_LOG_LEVEL`         | Logging level (`none`, `error`, `warning`, `info`, `debug`, `all`) | `info`              |
| `MODERNIZE_MODEL`             | LLM model to use                                                   | `claude-sonnet-4.6` |
| `MODERNIZE_COLLECT_TELEMETRY` | Enable/disable telemetry collection                                | `true`              |

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

Create a `.github/modernize/repos.json` file to enable multi-repository mode:

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

After the `repos.json` file is in place, use the following commands to operate across all configured repositories:

Assess all repositories locally:

```bash
modernize assess
```

Assess all repositories using the Cloud Coding Agent:

```bash
modernize assess --delegate cloud
```

Upgrade all repositories using the Cloud Coding Agent:

```bash
modernize upgrade --delegate cloud
```

## Next steps

- [Batch assessment: Assess multiple applications](batch-assess.md)
- [Batch upgrade: Upgrade multiple applications](batch-upgrade.md)
- [Create custom skills for your organization](customization.md)
- [Return to overview](overview.md)

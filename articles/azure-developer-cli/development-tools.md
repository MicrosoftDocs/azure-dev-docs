---
title: Manage Azure development tools with azd tool
description: Learn how to use the azd tool command group to discover, install, upgrade, and check the status of common Azure development tools directly from the Azure Developer CLI.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 06/03/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Manage Azure development tools with `azd tool`

The Azure Developer CLI (`azd`) includes a built-in `azd tool` command group for discovering, installing, upgrading, and checking the status of common tools used to build and ship Azure applications. It wraps the underlying package managers on each platform (such as `winget`, `brew`, `apt`, `npm`, and the VS Code `code` CLI) behind a consistent set of subcommands, and supports both interactive use and automation.

Common use cases for `azd tool` include:

- Installing all recommended Azure development tools on a new machine with a single command.
- Standardizing the development environment across a team or set of CI agents.
- Auditing which Azure tools (and which versions) are installed on a given machine.
- Checking for and applying updates to installed tools.
- Scripting tool setup in pipelines using non-interactive flags and JSON output.

## Built-in tools

The built-in registry includes the following tools. Use the category and priority columns to determine which tools apply to a given workflow.

| Id | Name | Category | Priority | Typical install strategy |
|---|---|---|---|---|
| `az-cli` | Azure CLI | `cli` | Recommended | `winget` / `brew` / `apt` |
| `github-copilot-cli` | GitHub Copilot CLI | `cli` | Recommended | `winget` / `brew` / `npm` |
| `vscode-azure-tools` | Azure Tools (VS Code) | `extension` | Recommended | `code` CLI |
| `vscode-bicep` | Bicep (VS Code) | `extension` | Recommended | `code` CLI |
| `vscode-github-copilot` | GitHub Copilot (VS Code) | `extension` | Optional | `code` CLI |
| `azure-mcp-server` | Azure MCP Server | `server` | Optional | `npm` |
| `azd-ai-extensions` | `azd` AI Extensions | `library` | Optional | `azd extension` |

The exact install strategy depends on the operating system and the package managers available on the machine.

> [!NOTE]
> VS Code extensions require the `code` CLI to be available on the `PATH`. If `code` isn't available, the tools show as not installed and you can't install them through `azd tool`.

## Commands overview

The `azd tool` command group includes the following subcommands.

| Command | Description |
|---|---|
| `azd tool` | Starts an interactive flow that shows installed and available tools and prompts for tools to install in one step. |
| `azd tool list` | Lists all registered tools, including install status, version, category, and priority. |
| `azd tool show <id>` | Shows detailed information for a specific tool, including per-platform install strategies and the project website. |
| `azd tool check` | Checks installed tools for available updates. |
| `azd tool install [ids...]` | Installs one or more tools by `id`. |
| `azd tool upgrade [ids...]` | Upgrades one or more installed tools. |

All commands support `--output json` for machine-readable output suitable for scripts and pipelines.

### Common flags

The following flags are available on `install` and `upgrade`:

- `--all`: Installs or upgrades every eligible tool. For `install`, this command includes all recommended tools. For `upgrade`, this command includes all installed tools that have updates available.
- `--dry-run`: Previews the actions `azd` would take without making any changes.

The following options control prompting behavior:

- `--no-prompt`: Suppresses interactive prompts. Useful in scripts.
- `AZD_NON_INTERACTIVE=true`: Environment variable equivalent to `--no-prompt`.
- `AZD_SKIP_FIRST_RUN=true`: Disables the first-run tool-check prompt.

## Sample use case: bootstrap a development machine

To set up the complete set of recommended Azure development tools on a new machine, run the following command:

```bash
azd tool install --all
```

This command installs every tool marked as `recommended` in the registry by using the appropriate package manager for the current platform. To preview the install actions without making changes, add `--dry-run`:

```bash
azd tool install --all --dry-run
```

To keep installed tools current, run the following commands:

```bash
azd tool check
azd tool upgrade --all
```

## List installed and available tools

Run `azd tool list` to display every registered tool, its install status, and its installed version:

```output
$ azd tool list

  Id                     Name                      Category    Priority      Status          Version
  ─────────────────────  ────────────────────────  ──────────  ────────────  ──────────────  ────────
  az-cli                 Azure CLI                 cli         recommended   Installed       2.67.0
  github-copilot-cli     GitHub Copilot CLI        cli         recommended   Not Installed
  vscode-azure-tools     Azure Tools (VS Code)     extension   recommended   Installed       0.9.0
  vscode-bicep           Bicep (VS Code)           extension   recommended   Installed       0.30.0
  vscode-github-copilot  GitHub Copilot (VS Code)  extension   optional      Not Installed
  azure-mcp-server       Azure MCP Server          server      optional      Not Installed
  azd-ai-extensions      azd AI Extensions         library     optional      Not Installed
```

To return the same data as JSON for scripting, run:

```bash
azd tool list --output json
```

## Show details for a tool

Run `azd tool show <id>` to inspect a specific tool, including the install strategies that apply to each supported platform and the project website:

```bash
azd tool show az-cli
```

## Install one or more tools

Pass one or more tool `id` values to install specific tools:

```bash
azd tool install az-cli vscode-bicep
```

To install every recommended tool, use `--all`:

```bash
azd tool install --all
```

To preview the install commands without running them, add `--dry-run`:

```bash
azd tool install az-cli --dry-run
```

Running `azd tool` with no subcommand starts an interactive flow that displays installed tools, allows selection of additional tools, and installs them in a single step.

## Check for updates

Run `azd tool check` to scan installed tools for available updates:

```bash
azd tool check
```

`azd` also runs a periodic background update check and surfaces non-intrusive notifications when newer versions of registered tools are available.

## Upgrade tools

Upgrade specific tools by passing their `id` values:

```bash
azd tool upgrade az-cli github-copilot-cli
```

Upgrade everything that has an available update:

```bash
azd tool upgrade --all
```

Preview the upgrade plan without applying it:

```bash
azd tool upgrade --all --dry-run
```

## First-run experience

The first time a workflow command such as `azd init`, `azd up`, or `azd deploy` runs, `azd` performs a one-time tool check and prompts to review or install recommended tools.

Use any of the following options to skip or disable the first-run prompt:

- Pass `--no-prompt` on the workflow command.
- Set the environment variable `AZD_SKIP_FIRST_RUN=true`.
- Run in a detected CI environment. `azd` automatically bypasses the prompt when `CI`, `TF_BUILD`, or `GITHUB_ACTIONS` is set.

## CI and non-interactive scenarios

The `azd tool` command group supports pipelines and scripts through the following options:

- Use positional `id` arguments with `install` and `upgrade` to avoid interactive selection.
- Add `--no-prompt` or set `AZD_NON_INTERACTIVE=true` to suppress prompts.
- Use `--output json` to capture structured results for downstream steps.
- Rely on CI auto-detection, which suppresses the first-run prompt and background update notifications.

The following example installs the Azure CLI and the Bicep extension in a pipeline step:

```bash
azd tool install az-cli vscode-bicep --no-prompt --output json
```

## Related content

- [What is the Azure Developer CLI?](overview.md)
- [Install or update the Azure Developer CLI](install-azd.md)
- [Azure Developer CLI commands overview](azd-commands.md)
- [Manage Azure Developer CLI configuration](azd-config.md)
- [Work with Azure Developer CLI extensions](extensions/overview.md)

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

The Azure Developer CLI (`azd`) includes a built-in `azd tool` command group that helps you discover, install, upgrade, and check the status of the most common tools used to build and ship Azure applications. Instead of hunting for install docs or remembering different package manager commands across operating systems, you can manage your developer prerequisites from a single, cross-platform CLI.

In this article, you learn:

- What the `azd tool` command does and when to use it.
- Which tools are available in the built-in registry.
- How to list, inspect, install, upgrade, and check tools.
- How `azd tool` behaves in interactive, CI, and first-run scenarios.

## What is `azd tool`?

`azd tool` is a unified command group for managing Azure development tooling from the Azure Developer CLI. It wraps the underlying package managers on each platform (such as `winget`, `brew`, `apt`, `npm`, and the VS Code `code` CLI) behind a consistent set of subcommands. A built-in registry (manifest) describes each supported tool, including its category, recommendation level, per-platform install strategy, and how to detect whether it's already installed and at what version.

When you run a tool command, `azd`:

1. Detects which tools are installed on your machine and their current versions.
1. Looks up the appropriate install strategy for your operating system.
1. Runs the install or upgrade through the matching package manager.
1. Optionally checks for newer versions and surfaces non-intrusive update notifications.

## Why use `azd tool`?

Use `azd tool` when you want to:

- Bootstrap a new development machine for Azure work without manually researching each tool.
- Onboard new team members with a consistent, reproducible set of prerequisites.
- Audit which Azure tools are installed (and at which versions) across machines or CI agents.
- Keep your Azure tooling up to date with a single command.
- Script tool setup in automation by using JSON output and non-interactive flags.

The command group is designed to be safe in both interactive and automated environments. Interactive users get a guided experience, while CI pipelines and scripts can use positional arguments and flags to install or upgrade tools without prompts.

## Built-in tools

The following tools are included in the built-in registry. Categories and priorities help you decide what to install for your workflow.

| Id | Name | Category | Priority | Typical install strategy |
|---|---|---|---|---|
| `az-cli` | Azure CLI | `cli` | Recommended | `winget` / `brew` / `apt` |
| `github-copilot-cli` | GitHub Copilot CLI | `cli` | Recommended | `winget` / `brew` / `npm` |
| `vscode-azure-tools` | Azure Tools (VS Code) | `extension` | Recommended | `code` CLI |
| `vscode-bicep` | Bicep (VS Code) | `extension` | Recommended | `code` CLI |
| `vscode-github-copilot` | GitHub Copilot (VS Code) | `extension` | Optional | `code` CLI |
| `azure-mcp-server` | Azure MCP Server | `server` | Optional | `npm` |
| `azd-ai-extensions` | `azd` AI Extensions | `library` | Optional | `azd extension` |

The exact install strategy used depends on your operating system and the package managers that are available on your machine.

> [!NOTE]
> VS Code extensions require the `code` CLI to be available on your `PATH`. If `code` isn't available, those tools are shown as not installed and can't be installed through `azd tool`.

## Commands overview

The `azd tool` command group includes the following subcommands.

| Command | Description |
|---|---|
| `azd tool` | Starts an interactive flow that shows installed and available tools and lets you select tools to install in one step. |
| `azd tool list` | Lists all registered tools, including install status, version, category, and priority. |
| `azd tool show <id>` | Shows detailed information for a specific tool, including per-platform install strategies and the project website. |
| `azd tool check` | Checks installed tools for available updates. |
| `azd tool install [ids...]` | Installs one or more tools by `id`. |
| `azd tool upgrade [ids...]` | Upgrades one or more installed tools. |

All commands support `--output json` for machine-readable output that's easy to consume in scripts and pipelines.

### Common flags

The following flags are available on `install` and `upgrade`:

- `--all`: Installs or upgrades every tool that's eligible (typically all recommended tools for `install`, and all installed tools that have updates for `upgrade`).
- `--dry-run`: Previews the actions `azd` would take without making any changes.

The following flags help control prompting:

- `--no-prompt`: Suppresses interactive prompts. Useful in scripts.
- `AZD_NON_INTERACTIVE=true`: Environment variable equivalent to `--no-prompt`.
- `AZD_SKIP_FIRST_RUN=true`: Disables the first-run tool-check prompt.

## Sample use case: bootstrap a new dev machine

Imagine you just got a new laptop and need to set up everything required to build and deploy an Azure app. Instead of installing the Azure CLI, Bicep extension, and other tools one by one, you can run:

```bash
azd tool install --all
```

This command installs every tool marked as `recommended` in the registry, using the right package manager for your platform. To preview what would happen first, add `--dry-run`:

```bash
azd tool install --all --dry-run
```

Later, when you want to make sure everything is current, run:

```bash
azd tool check
azd tool upgrade --all
```

## List installed and available tools

Run `azd tool list` to see every registered tool, whether it's installed, and which version is present:

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

To get the same data as JSON for scripting, run:

```bash
azd tool list --output json
```

## Show details for a tool

Use `azd tool show <id>` to inspect a specific tool, including the install strategies that apply to each supported platform and the project website:

```bash
azd tool show az-cli
```

## Install one or more tools

Provide one or more tool `id` values to install specific tools:

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

If you run `azd tool` with no subcommand, you enter an interactive flow that displays which tools are installed, lets you select additional tools, and installs them in a single step.

## Check for updates

Use `azd tool check` to scan installed tools for available updates:

```bash
azd tool check
```

`azd` also runs a background update check periodically and surfaces non-intrusive notifications when newer versions of registered tools are available.

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

The first time you run a workflow command such as `azd init`, `azd up`, or `azd deploy`, `azd` performs a one-time tool check and prompts you to review or install recommended tools. This experience helps new users get a complete environment with minimal friction.

You can skip or disable the first-run prompt in several ways:

- Pass `--no-prompt` on the workflow command.
- Set the environment variable `AZD_SKIP_FIRST_RUN=true`.
- Run in a detected CI environment. `azd` automatically bypasses the prompt when `CI`, `TF_BUILD`, or `GITHUB_ACTIONS` is set.

## CI and non-interactive scenarios

`azd tool` is designed to work cleanly in pipelines and scripts:

- Use positional `id` arguments with `install` and `upgrade` so no interactive selection is needed.
- Add `--no-prompt` (or set `AZD_NON_INTERACTIVE=true`) to suppress prompts.
- Use `--output json` to capture structured results for downstream steps.
- CI environments are auto-detected, which suppresses the first-run prompt and background update notifications.

For example, a pipeline step that ensures the Azure CLI and Bicep extension are present might look like this:

```bash
azd tool install az-cli vscode-bicep --no-prompt --output json
```

## Related content

- [What is the Azure Developer CLI?](overview.md)
- [Install or update the Azure Developer CLI](install-azd.md)
- [Azure Developer CLI commands overview](azd-commands.md)
- [Manage Azure Developer CLI configuration](azd-config.md)
- [Work with Azure Developer CLI extensions](extensions/overview.md)

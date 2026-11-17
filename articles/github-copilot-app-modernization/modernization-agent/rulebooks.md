---
title: Generate and Use Rulebooks with the Modernize CLI
titleSuffix: GitHub Copilot Modernization Agent
description: Learn how to generate rulebooks from organizational policies and apply them during modernization planning and execution with the Modernize CLI.
author: puichan
ms.author: puichan
ms.reviewer: elbarnit
ms.topic: how-to
ai-usage: ai-generated
ms.date: 10/20/2026
---

# Generate and use rulebooks with the Modernize CLI

Rulebooks capture your organization's modernization policies in Markdown files that the GitHub Copilot modernization agent uses during assessment, planning, and execution. Use a rulebook to define guardrails, prohibited patterns, required application capabilities, custom skill enforcement, and target frameworks and Azure services across applications.

In this article, you use the Modernize CLI to generate a rulebook from a policy source file, store it in a central GitHub repository, and apply it to an application's modernization plan.

## Prerequisites

- A GitHub Copilot subscription: Free, Pro, Pro+, Business, or Enterprise.
- GitHub CLI (`gh`) version 2.45.0 or later. For installation instructions, see [GitHub CLI](https://cli.github.com/).
- The Modernize CLI. For installation instructions, see [Install and use the modernization agent](quickstart.md#install-the-modernization-agent).
- A central GitHub repository for generated rulebooks. You need permission to push to this repository and read it when you create modernization plans.
- A local checkout of a target .NET or Java application repository, with read and write permissions.
- A Markdown file describing your organization's modernization policies.

Authenticate with GitHub before you continue:

```bash
gh auth login
```

For general platform requirements, see [Install and use the modernization agent](quickstart.md#prerequisites).

## Configure rulebooks

Create a private repository to store the generated rulebook, or use an existing repository. Replace `<org>` with your GitHub organization throughout this article:

```bash
gh repo create <org>/modernize-rulebooks --private
```

Point the CLI to this repository. Choose either a configuration file or an environment variable.

### Use a configuration file

For a setting that persists across terminal sessions, add the following property to your user-level configuration file. If the file already exists, merge this property with its existing settings rather than replacing it.

```json
{
  "portfolio_url": "https://github.com/<org>/modernize-rulebooks"
}
```

The configuration file locations are:

| Scope | Location |
| --- | --- |
| User, Windows | `%USERPROFILE%\.modernize\config.json` |
| User, Linux or macOS | `~/.modernize/config.json` |
| Repository | `.github/modernize/config.json` |

Environment variables take precedence over user-level configuration, which takes precedence over repository-level configuration.

### Use an environment variable

To configure the rulebook repository for the current terminal session, set `MODERNIZE_PORTFOLIO_URL` in the shell where you run the Modernize CLI.

### [PowerShell](#tab/powershell)

```powershell
$env:MODERNIZE_PORTFOLIO_URL = "https://github.com/<org>/modernize-rulebooks"
```

### [Bash](#tab/bash)

```bash
export MODERNIZE_PORTFOLIO_URL=https://github.com/<org>/modernize-rulebooks
```

---

## Prepare a policy source file

Create a Markdown file named `agent-rulebook.md` that describes the standards the agent should apply during planning and execution. Include your required target frameworks, prohibited patterns, and requirements for identity, observability, health endpoints, secret management, and database access where applicable.

The following example illustrates policy content. Adapt it to your organization's requirements; it isn't a required file schema.

```markdown
# Modernization policies

## Target platform

- Migrate the application to Azure Container Apps.

## Identity and secrets

- Use managed identities for Azure service access where supported.
- Don't commit credentials or connection secrets to source control.

## Application operations

- Provide health endpoints for the application.
- Include application telemetry without logging secrets or personal data.

## Validation

- Build the application and run its tests after code changes.
```

## Generate and publish a rulebook

From the directory containing your policy source file, run the following command. Use the same repository URL that you configured for `portfolio_url` or `MODERNIZE_PORTFOLIO_URL`:

```bash
modernize rulebook create --file-path ./agent-rulebook.md --push-git-url https://github.com/<org>/modernize-rulebooks
```

The command processes your source policies into agent-optimized Markdown files and pushes them to the central repository:

| File | Purpose |
| --- | --- |
| `charter.md` | Defines the high-level modernization charter. |
| `targets.md` | Defines target frameworks and platforms. |
| `policies.md` | Defines policy rules for modernization. |

Review the generated files in the central repository before using them to guide application changes. Check that they reflect the requirements in your source file.

## Create a plan that uses the rulebook

In the same configured terminal session, go to your target application repository and create a plan:

```bash
cd /path/to/your-app
modernize plan create "migrate to Azure Container Apps"
```

When you configure the central repository URL, the CLI automatically fetches `charter.md`, `targets.md`, and `policies.md` and uses them as context for planning. You don't need an extra rulebook option on the plan command.

With the default plan name, the generated output includes:

```text
.github/modernize/modernization-plan/
    plan.md
    rulebook-compliance.md
    .metadata/
        tasks.json
        rulebook-metadata.json
```

Review `plan.md` and `rulebook-compliance.md` before executing the plan. The compliance report provides rule-by-rule coverage so that you can check how the plan addresses your policies.

## Execute and validate the plan

After you review the plan and compliance report, run:

```bash
modernize plan execute
```

The agent uses your rulebook policies during execution. It runs the planned tasks, makes code changes, validates builds, scans for Common Vulnerabilities and Exposures (CVEs), and commits changes.

Review the resulting code changes and validation results against your organization's policies. Rulebook context and a generated compliance report don't replace your review of the application.

## Troubleshoot rulebook configuration

If the CLI doesn't apply your rulebook, check the following items:

- Confirm that `portfolio_url` or `MODERNIZE_PORTFOLIO_URL` points to the repository where you published the generated rulebook.
- Check for environment variables that override your configuration file.
- If you used environment variables, run plan creation from the terminal session where you set them.
- Confirm that your authenticated GitHub account can read the rulebook repository and has write access when you generate and publish a rulebook.
- Review the generated rulebook files and the plan's compliance report to check which policies are represented.

## Related content

- [Install and use the modernization agent](quickstart.md).
- [Customize the modernization agent with custom skills](customization.md).
- [Modernization agent CLI commands](cli-commands.md).
---
title: Quickstart - Install and use the GitHub Copilot modernization agent
description: Learn how to install and use the GitHub Copilot modernization agent to assess, plan, and execute application modernization.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: quickstart
ai-usage: ai-assisted
ms.date: 03/11/2026
keywords: modernize cli, install modernization agent, assess application, create modernization plan, execute plan
---

# Quickstart: Install and use the GitHub Copilot modernization agent

This quickstart guides you through installing the GitHub Copilot modernization agent and using it to modernize a sample application.

## Prerequisites

- **GitHub Copilot subscription**: Free, Pro, Pro+, Business, or Enterprise plan. See [Copilot plans](https://github.com/features/copilot/plans).
- **GitHub CLI**: Install the GitHub CLI (`gh`) for authentication. See [Installing gh](https://cli.github.com/).

### Platform requirements

- **Windows**: x64 or ARM64
- **Linux**: x64 or ARM64 with glibc 2.27+ (Ubuntu 18.04+, Debian 10+, Fedora 29+, Azure Linux 2.0+)
- **macOS**: Apple Silicon or Intel

## Install the modernization agent

Use the following commands to install the modernization agent or update to the latest version.

### Linux/macOS

Run the following command:

```bash
curl -fsSL https://raw.githubusercontent.com/microsoft/modernize-cli/main/scripts/install.sh | bash
```

### Windows

Run the following command in PowerShell:

```powershell
iex (irm 'https://raw.githubusercontent.com/microsoft/modernize-cli/main/scripts/install.ps1')
```

Alternatively, download and run the MSI installer from the [GitHub releases page](https://github.com/microsoft/modernize-cli/releases).

> [!NOTE]
> These commands work for both initial installation and updating to the latest version. A dedicated version update command will be available in a future release.

---

Verify the installation:

```bash
modernize --version
```

## Get a sample application

For this quickstart, we'll use a sample application. Choose either Java or .NET:

**Java sample:**
```bash
git clone https://github.com/Azure-Samples/PhotoAlbum-Java.git
cd PhotoAlbum-Java
git checkout -b modernize
```

**.NET sample:**
```bash
git clone https://github.com/Azure-Samples/PhotoAlbum.git
cd PhotoAlbum
git checkout -b modernize
```

## Use the interactive mode

The easiest way to get started is using the interactive mode. First, authenticate with the GitHub CLI:

```bash
gh auth login
```

Then, run the modernization agent:

```bash
modernize
```

You'll see the main menu:

```
○ How would you like to modernize your Java app?

  > 1. Assess application
       Analyze the project and identify modernization opportunities
    2. Create modernization plan
       Generate a structured plan to guide the agent
    3. Execute modernization plan
       Run the tasks defined in the modernization plan
```

### Step 1: Assess application

1. Select **1. Assess application**
2. Follow the prompts to configure assessment options (or press Enter to use defaults)
3. Review your selections and press Enter to start the assessment
4. Wait for the assessment to complete

The assessment results are saved to `.github\modernize\assessment\` in your project directory. The agent analyzes your code, dependencies, and configuration to identify:

- Outdated framework versions
- Deprecated APIs
- Cloud compatibility issues
- Migration opportunities

### Step 2: Create a modernization plan

After the assessment completes, the agent prompts you to create a modernization plan based on the identified issues:

```
○ How would you like to continue?

  > 1. Create modernization plan
       Generate a plan.md file according to the identified issues
    2. Return to main menu
```

1. Select **1. Create modernization plan**
2. Enter a plan name (or press Enter for default)
3. Enter your modernization goal as a prompt. By default, the prompt is `References the assessment summary and creates plan`  to create plan based on the assessment findings. You can replace it with any other migration request, for example:
   - `migrate the database to Azure PostgreSQL`
   - `upgrade to Spring Boot 3`
   - `deploy to Azure Container Apps`
4. Press Enter to generate the plan

The agent analyzes your codebase and generates:

- **Plan file** (`.github/modernize/{plan-name}/plan.md`): Detailed strategy and approach
- **Task list** (`.github/modernize/{plan-name}/tasks.json`): Breakdown of executable steps

> [!TIP]
> You can manually edit `plan.md` to add clarifications or adjust details, and update `tasks.json` to modify, reorder, add, or remove tasks before executing the plan.

### Step 3: Execute the modernization plan

After the plan verified, confirm to execute the plan.

```
○ How would you like to continue?

  > 1. Execute modernization plan
       Run the tasks defined in the modernization plan
    2. Return to main menu
```

1. Select **1. Execute modernization plan**
2. Press Enter to Execute the plan
3. Monitor progress as the agent applies changes

The agent executes each task in order:

- Makes code changes according to the plan
- Validates builds after each change
- Scans for and addresses CVEs
- Commits changes

### Step 4: Review the results

After execution completes, you can review all changes made by the agent before merging them:

1. **Review changes**: Check the modifications on the current branch
   ```bash
   git status
   git diff main
   ```

2. **Create a pull request**: If you're satisfied with the changes, create a PR for team review
   ```bash
   gh pr create --title "Modernization: migrate the app to azure" --body "Automated modernization by GitHub Copilot agent"
   ```

## Next steps

- [Learn about CLI](cli-commands.md)
- [Batch assessment: Assess multiple applications](batch-assess.md)
- [Batch upgrade: Upgrade multiple applications](batch-upgrade.md)
- [Create custom skills for your organization](customization.md)

## Provide feedback

We value your input! If you have any feedback about the Modernization Agent, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml) or use the [GitHub Copilot modernization feedback form](https://aka.ms/ghcp-appmod/feedback).

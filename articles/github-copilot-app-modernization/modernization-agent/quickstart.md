---
title: "Quickstart: Install and Use the GitHub Copilot Modernization Agent"
description: Learn how to install and use the GitHub Copilot modernization agent to assess, plan, and execute application modernization.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: quickstart
ai-usage: ai-assisted
ms.date: 03/13/2026
---

# Quickstart: Install and use the GitHub Copilot modernization agent

This quickstart guides you through installing the GitHub Copilot modernization agent and using it to modernize a sample application.

## Prerequisites

- **A GitHub Copilot subscription**: Free, Pro, Pro+, Business, or Enterprise plan. See [Copilot plans](https://github.com/features/copilot/plans).
- **GitHub CLI**: Install the GitHub CLI (`gh`) for authentication, `v2.45.0` or above. See [Installing gh](https://cli.github.com/).

### Platform requirements

- **Windows**: x64 or ARM64.
- **Linux**: x64 or ARM64 with `glibc` 2.27 or later (Ubuntu 18.04 or later, Debian 10 or later, Fedora 29 or later, Azure Linux 2.0 or later).
- **macOS**: Apple Silicon or Intel.

## Install the modernization agent

Use the following commands to install the modernization agent or update to the latest version.

### [Windows](#tab/windows)

Use one of the following options:

**Option 1 - Winget (recommended):**

```powershell
winget install GitHub.Copilot.modernization.agent
```

For silent installation with no prompts:

```powershell
winget install GitHub.Copilot.modernization.agent --silent
```

**Option 2 - PowerShell one-liner:**

```powershell
iex (irm 'https://raw.githubusercontent.com/microsoft/modernize-cli/main/scripts/install.ps1')
```

**Option 3 - MSI installer:**

Download and run the latest MSI from the [GitHub releases page](https://github.com/microsoft/modernize-cli/releases/latest).

> [!NOTE]
> After installation, open a new terminal for the `modernize` command to be available on your PATH. These commands work for both initial installation and updating to the latest version. A dedicated version update command will be available in a future release.

### [Linux/macOS](#tab/linux-macos)

Use one of the following options:

**Option 1 - Homebrew:**

```bash
brew tap microsoft/modernize https://github.com/microsoft/modernize-cli
brew install modernize
```

**Option 2 - Shell script:**

```bash
curl -fsSL https://raw.githubusercontent.com/microsoft/modernize-cli/main/scripts/install.sh | sh
```

---

Verify the installation:

```bash
modernize --version
```

## Get a sample application

For this quickstart, use a sample application. Choose either Java or .NET:

### [Java](#tab/java)

```bash
git clone https://github.com/Azure-Samples/PhotoAlbum-Java.git
cd PhotoAlbum-Java
git checkout -b modernize
```

### [.NET](#tab/dotnet)

```bash
git clone https://github.com/Azure-Samples/PhotoAlbum.git
cd PhotoAlbum
git checkout -b modernize
```

---

## Use the interactive mode

The easiest way to get started is by using the interactive mode. First, authenticate by using the GitHub CLI:

```bash
gh auth login
```

Then, run the modernization agent:

```bash
modernize
```

The main menu appears:

```Modernize CLI
○ How would you like to modernize your Java app?

  > 1. Assess application
       Analyze the project and identify modernization opportunities
    2. Create modernization plan
       Generate a structured plan to guide the agent
    3. Execute modernization plan
       Run the tasks defined in the modernization plan
```

### Step 1: Assess the application

1. Select **1. Assess application**.
1. Follow the prompts to configure assessment options (or press Enter to use defaults).
1. Review your selections and press Enter to start the assessment.
1. Wait for the assessment to complete.

The assessment results are saved to `.github\modernize\assessment\` in your project directory. The agent analyzes your code, dependencies, and configuration to identify:

- Outdated framework versions
- Deprecated APIs
- Cloud compatibility issues
- Migration opportunities

### Step 2: Create a modernization plan

After the assessment finishes, the agent prompts you to create a modernization plan based on the identified problems:

```Modernize CLI
○ How would you like to continue?

  > 1. Create modernization plan
       Generate a plan.md file according to the identified issues
    2. Return to main menu
```

1. Select **1. Create modernization plan**.
1. Enter a plan name or press Enter to use the default name.
1. Enter your modernization goal as a prompt. By default, the prompt is `References the assessment summary and creates plan` to create a plan based on the assessment findings. You can replace it with any other migration request, for example:
   - `migrate the database to Azure PostgreSQL`
   - `upgrade to Spring Boot 3`
   - `deploy to Azure Container Apps`
1. Press Enter to generate the plan.

The agent analyzes your codebase and generates:

- **Plan file** (`.github/modernize/{plan-name}/plan.md`): Detailed strategy and approach.
- **Task list** (`.github/modernize/{plan-name}/tasks.json`): Breakdown of executable steps.

> [!TIP]
> You can manually edit `plan.md` to add clarifications or adjust details. You can also update `tasks.json` to modify, reorder, add, or remove tasks before executing the plan.

### Step 3: Execute the modernization plan

After you verify the plan, confirm that you want to execute the plan.

```Modernize CLI
○ How would you like to continue?

  > 1. Execute modernization plan
       Run the tasks defined in the modernization plan
    2. Return to main menu
```

1. Select **1. Execute modernization plan**.
1. Press Enter to execute the plan.
1. Monitor progress as the agent applies changes.

The agent executes each task in order:

- Makes code changes according to the plan.
- Validates builds after each change.
- Scans for and addresses CVEs.
- Commits changes.

### Step 4: Review the results

After execution finishes, you can review all changes that the agent made before merging them:

1. **Review changes**: Check the modifications on the current branch.

    ```bash
    git status
    git diff main
    ```

1. **Create a pull request**: If you're satisfied with the changes, create a PR for team review.

    ```bash
    gh pr create \
        --title "Modernization: migrate the app to azure" \
        --body "Automated modernization by GitHub Copilot agent"
    ```

## Next steps

- [Learn about CLI](cli-commands.md)
- [Batch assessment: Assess multiple applications](batch-assess.md)
- [Batch upgrade: Upgrade multiple applications](batch-upgrade.md)
- [Create custom skills for your organization](customization.md)

## Provide feedback

We value your input! If you have any feedback about the Modernization agent, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml) or use the [GitHub Copilot modernization feedback form](https://aka.ms/ghcp-appmod/feedback).

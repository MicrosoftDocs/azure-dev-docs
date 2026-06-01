---
title: Batch Plan with the GitHub Copilot Modernization Agent
description: Learn how to use the GitHub Copilot modernization agent to generate modernization plans for multiple applications by using a shared prompt and repository configuration.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 06/02/2026
---

# Batch plan with the GitHub Copilot modernization agent

Batch plan enables you to generate modernization plans for multiple repositories by using one workflow and a shared modernization goal. This article shows you how to create consistent plans across multiple applications before you start execution.

By using batch plan, you can:

- **Create plans for multiple applications** in one guided workflow.
- **Apply a consistent modernization goal** across repositories.
- **Use assessment findings as context** to improve plan quality.
- **Review plans before execution** and decide which repositories to modernize first.

Batch plan provides the following benefits:

- Consistency and control:

  - **Shared intent**: Start from one modernization prompt across repositories.
  - **Comparable outputs**: Review plans side by side before you execute them.
  - **Flexible refinement**: Edit each generated plan to reflect repository-specific needs.

- Planning at scale:

  - **Portfolio visibility**: Understand how the same request applies across applications.
  - **Reusable preparation**: Reuse the same repository list and assessment outputs from earlier stages.
  - **Faster decision-making**: Generate plans first, then execute only the repositories you approve.

## Prerequisites

- [Modernize CLI](quickstart.md).
- Access to all repositories you want to plan.
- GitHub authentication configured (`gh auth login`).
- A completed [batch assessment](batch-assess.md) (recommended) if you want the agent to use assessment findings as planning context.

> [!TIP]
> Batch assessment isn't required, but it usually produces more accurate and actionable plans because the agent can reference detected issues and migration opportunities.

## Configure repositories

The modernization agent supports multiple ways to specify the repositories you want to plan:

- **Current folder**: Create a plan for the project in your current working directory.
- **Manual input**: Enter local directory paths or remote Git URLs directly.
- **Repository config file**: Use a JSON config file that lists all repositories.

### Repository config file

For batch operations across many repositories, create a JSON config file to list all repositories. For example, create it at `.github/modernize/repos.json` in your working directory, or provide a custom path.

**Format** (array of repositories):

```json
[
    {
        "name": "PhotoAlbum-Java",
        "url": "https://github.com/Azure-Samples/PhotoAlbum-Java.git"
    },
    {
        "name": "PhotoAlbum",
        "url": "https://github.com/Azure-Samples/NewsFeedSite.git"
    }
]
```

Each repo entry supports the following fields:

| Field         | Description                                                          | Required               |
|---------------|----------------------------------------------------------------------|------------------------|
| `name`        | A friendly name for the repository (used in reports and dashboards). | Yes                    |
| `url`         | Git clone URL in HTTPS or SSH format.                                | One of `url` or `path` |

> [!TIP]
> You can use the same `repos.json` file across batch assessment, batch plan, and batch upgrade workflows.

The modernization agent automatically detects the `repos.json` file at `.github/modernize/repos.json` when you select **From a config file** in interactive mode. You can also provide a custom path.

## How batch plan works

The batch planning workflow:

1. **Repository selection**: Choose the repositories you want to include.
1. **Context selection**: Optionally use available assessment reports as input.
1. **Prompt definition**: Describe your modernization goal once and apply it across repositories.
1. **Clarification**: Answer any follow-up questions from the agent.
1. **Plan generation**: The agent creates a plan for each selected repository.

Each generated plan is saved in the target repository and can be reviewed or edited before execution.

## Run batch plan

After you configure your repositories, start the batch planning workflow.

### Interactive mode

1. Run the modernization agent:

    ```bash
    modernize
    ```

1. Select **Plan** from the main menu.

    ```Modernize CLI
    ○ How would you like to modernize your app?

        Assess
        Analyze modernization readiness across one or multiple applications
      > Plan
        Generate a structured plan to guide the agent
        Execute
        Run the tasks defined in the modernization plan

      Or select a quick-start scenario:

        Upgrade
            Upgrade runtimes and frameworks across one or multiple applications
    ```

1. Choose how to specify your target repositories. Select **From a config file** to use a `repos.json` file.

    ```Modernize CLI
    ○ Choose target repositories

        1. Current folder
          /Users/username/project
        2. Manual input
          Enter local path or remote URL
      > 3. From a config file
          /path/to/.github/modernize/repos.json
    ```

    > [!TIP]
    > You can also select **Manual input** to enter local paths or remote Git URLs directly, or **Current folder** to plan for the project in your current directory.

1. If the `repos.json` file is detected at the default location, the agent automatically fills it in. Otherwise, enter the path to your config file and press <kbd>Enter</kbd>.

1. All repositories are selected by default. Deselect any repositories you want to skip, and then press <kbd>Enter</kbd> to confirm your selection.

    - **Use arrow keys** to navigate and press <kbd>Space</kbd> to toggle individual repositories.

1. Select **1. Keep the plan local** to generate plans on your machine, or choose **2. Submit to Cloud Coding Agent** to have a cloud coding agent generate them. Option 2 is experimental.

1. Enter a plan name or press <kbd>Enter</kbd> to use the default.

1. Enter your modernization goal as a prompt. For example:

    - `upgrade to Spring Boot 3 and prepare for Azure deployment`
    - `migrate the database to Azure PostgreSQL`
    - `containerize the application and deploy to Azure Container Apps`

1. Press <kbd>Enter</kbd> to generate the plans.

1. The agent automatically:

    - Clones each selected repository or submits a job to Cloud Coding Agent for each repo.
    - Generates a plan for each repository locally or a PR with the plan in each repository.

## Next steps

After completing the batch plan, review the plans and execute them by using the `execute` command:

- [Learn about CLI commands](cli-commands.md).
- [Create custom skills for organization-specific patterns](customization.md).

## Provide feedback

If you have feedback about batch plan or the modernization agent, [create an issue in the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml) or use the [GitHub Copilot modernization feedback form](https://aka.ms/ghcp-appmod/feedback).

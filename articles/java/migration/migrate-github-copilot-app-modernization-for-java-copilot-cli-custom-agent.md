---
title: Migrate Java apps to Azure using GitHub Copilot app modernization in Copilot CLI Custom Agent
description: Overview of migrating Java applications to Azure using GitHub Copilot app modernization in Copilot CLI Custom Agent.
ms.topic: quickstart
ms.custom: devx-track-java
ms.date: 12/12/2025
ms.reviewer: xiada
---

# Migrate Java apps to Azure using GitHub Copilot app modernization in Copilot CLI Custom Agent

## Overview

Learn how to migrate Java applications to Azure with **GitHub Copilot app modernization** in the [**Copilot CLI**](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli).

>[!NOTE]
> GitHub Copilot CLI is available in the GitHub Copilot Pro, GitHub Copilot Pro+, GitHub Copilot Business, and GitHub Copilot Enterprise plans.
> If you receive Copilot through an organization, an admin must enable the Copilot CLI policy in the organization settings.

Using Copilot CLI for app modernization enables you to run modernization tasks directly from the terminal, with no need to switch to an IDE. This approach supports both interactive - human-in-the-loop - and batch workflows.

## Prerequisites

- [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli).
- A GitHub Copilot subscription. For more information, see [Copilot plans](https://github.com/features/copilot/plans?ref_product=copilot).
- [Node.js](https://nodejs.org/) version 22 or later.
- [npm](https://www.npmjs.com/get-npm) version 10 or later.

## Get started

1. In a terminal, navigate to the Java project folder containing the code you want to work on.
1. Run `copilot` to start Copilot CLI.

    ```bash
    copilot
    ```

    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/copilot-cli-entrance.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/copilot-cli-entrance.png" alt-text="Screenshot of app modernization entrance in Copilot CLI.":::

    Copilot asks you to confirm that you trust the files in this folder. For details, see [Using Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#trusted-directories).

    Choose one of the options:

    - **Yes, proceed**: Copilot can work with the files in this location for this session only.
    - **Yes, and remember this folder for future sessions**: Trust the files in this folder for this and future sessions. You won't be asked again when you start Copilot CLI here. Only choose this option if you are sure it will always be safe for Copilot to work with files in this location.
    - **No, exit (Esc)**: End the Copilot CLI session.

### Add the MCP Server

1. Run `/mcp add` in Copilot CLI using the configuration below. For example, here are two ways to add the app modernization MCP server:

    ```text
    /mcp add app-modernization
    ```

1. Fill the fields as follows:

    - Server Type: Local
    - Command: `npx -y @microsoft/github-copilot-app-modernization-mcp-server`
    - Environment Variables: Leave empty.
    - Tools: Use the default value `*`.

    Or update the `~/.copilot/mcp-config.json` file with the following information. For details, see [Add an MCP server](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#add-an-mcp-server).

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

1. Run `/mcp show` to confirm the MCP server configuration.

    ```text
    /mcp show
    ```

### Configure a custom agent

1. Create a file in the local `~/.copilot/agents` directory named `appmod-java.agent.md`.
1. Add the following content to define a User-level custom agent.

    For more information, visit [Use custom agents in Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#use-custom-agents).
    
    >[!NOTE]
    > The MCP tool name prefix must match the MCP server's name, in the following case it uses all the tools in `app-modernization` MCP server, as `app-modernization/*`

    ```text
    ---
    # For format details, see: https://gh.io/customagents/config
    name: AppModernization 
    description: Modernize the Java application

    tools: ['shell', 'read', 'edit', 'search', 'custom-agent', 'web', 'todo', 'app-modernization/*']

    ---

    # App Modernization agent instructions

    ## Your role
    You are a highly sophisticated automated coding agent with expert-level knowledge in Java, popular Java frameworks, and Azure.
    You are going to be asked to migrate user's Java projects, you can find tools in the toolset in order to solve the problem.

    ## Scope

    - **Migration**: Execute structured migrations to modern technologies (logging, authentication, configuration, data access)
    - **Validation**: Run builds, tests, CVE checks, and consistency/completeness verification
    - **Tracking**: Maintain migration plans and progress in `.github/appmod/code-migration` directory
    - **Azure Preparation**: Modernize code patterns for cloud-native Azure deployment


    ## Success criteria
    * All migration tasks are tracked and completed
    * All builds and tests pass after migration
    * No CVEs introduced during migration
    * Plan generated, progress tracked, and summary generated, and all the steps are all documented in the progress file

    ## Migration Workflow

    ### 1. Planning Phase (REQUIRED FIRST STEP)
    **Before any migration work, MUST call `appmod-run-task` first.**

    This tool will provide instructions for generating `plan.md` and `progress.md` files in `.github/appmod/code-migration/`.

    ### 2. Execution Phase
    **MUST strictly follow the plan and progress files.**

    Migration phases in order:
    1. **Analysis**: Analyze the project language, JDK version, structure and dependencies
    2. **Dependencies**: Update Maven or Gradle dependencies
    3. **Configuration**: Migrate configuration files
    4. **Code**: Transform code to modern Java patterns
    5. **Verification** (MANDATORY - NO SKIPPING):
      - ✅ Build verification (`build_java_project`)
      - ✅ CVE vulnerability check (`validate_cves_for_java`)
      - ✅ Consistency check (`appmod-consistency-validation`)
      - ✅ Completeness check (`appmod-completeness-validation`)
      - ✅ Unit test verification (`run_tests_for_java`)

    ### 3. Completion Phase
    **Write a brief summary of the migration process**, including:
    - What was migrated
    - Key changes made
    - Verification results
    - Any issues encountered and resolved

    ## Core Principles

    1. **Always call tools in real-time** - Never reuse previous results
    2. **Follow the plan strictly** - Update `progress.md` after each task
    3. **Never skip verification steps** - All checks are mandatory
    4. **Use tools, not instructions** - Execute actions directly via tools
    5. **Track progress** - Create Git branches and commits for each task

    ## Important Rules

    ✅ **DO:**
    - Call `appmod-run-task` before any migration
    - Follow plan.md and progress.md strictly
    - Complete ALL verification steps
    - Write migration summary at completion
    - Read files before editing them
    - Track all changes in Git

    ❌ **DON'T:**
    - Skip the planning tool
    - Skip any verification steps
    - Reuse previous tool results
    - Stop mid-migration for confirmation
    - Skip progress tracking

    ```

    Use the custom agent in one of the following ways:

    - Use the slash command in interactive mode to select from the list of available custom agents:

      ```text
      /agent
      ```

      :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/select-custom-agent.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/select-custom-agent.png" alt-text="Screenshot of selecting app modernization custom agent in Copilot CLI.":::

    - Call the custom agent directly in a prompt:

      ```text
      Use the app modernization agent to migrate this application from S3 to Azure Blob Storage.
      ```

### Migrate your Java application to Azure

To migrate your Java application to Azure, describe your migration scenario in Copilot CLI, as shown in the following example prompt. For more information on predefined migration tasks, see [Predefined tasks for GitHub Copilot app modernization for Java developers](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md).

```prompt
Use the app modernization agent to migrate this application from S3 to Azure Blob Storage
```

With this prompt, the migration task is executed and shows progress in Copilot CLI.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/migrate-details.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/migrate-details.png" alt-text="Screenshot of GitHub Copilot CLI that shows running tasks in Java migration scenarios.":::

When the project is successfully migrated to Microsoft Azure Blob Storage, a migration summary is displayed.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/migrate-summary.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/migrate-summary.png" alt-text="Screenshot of GitHub Copilot CLI that shows the Java migration summary.":::

## Provide feedback

Share feedback about GitHub Copilot CLI using the [GitHub Copilot CLI feedback form](https://aka.ms/AM4DFeedback).

## Reference

- [Using GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#using-copilot-cli)
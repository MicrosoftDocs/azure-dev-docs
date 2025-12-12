---
title: Migrate Java apps to Azure using GitHub Copilot app modernization in Coding Agent Custom Agent
description: Overview of migrating Java applications to Azure using GitHub Copilot app modernization in the Copilot Coding Agent Custom Agent.
ms.topic: quickstart
ms.custom: devx-track-java
ms.date: 12/12/2025
ms.reviewer: xiada
---

# Migrate Java apps using GitHub Copilot app modernization in the Copilot Coding Agent Custom Agent

This article shows you how to migrate Java apps using **GitHub Copilot app modernization** in the [**Copilot Coding Agent**](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent). The agent works independently in the background to complete modernization tasks. Delegate tasks through issues or pull requests; the agent runs them in the cloud to help your team complete modernization efficiently.

> [!NOTE]
> Copilot Coding Agent is available with GitHub Copilot Pro, GitHub Copilot Pro+, GitHub Copilot Business, and GitHub Copilot Enterprise plans. The agent is available in all GitHub repositories except those owned by managed user accounts or where it's explicitly disabled.

## Prerequisites

- [**Copilot Coding Agent**](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent) configured.
- A GitHub Copilot Pro, Pro+, Business, or Enterprise subscription.
- A GitHub repository containing your application source code.


## Add the MCP Server

1. Go to **Settings** for the target repository you want to modernize (admin access required).
1. Select **Copilot**, then select **Coding Agent**.
1. In the **Model Context Protocol (MCP)** section under **MCP Configuration**, add the following configuration, then select **Save Configuration**:

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

    :::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/mcp.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/mcp.png" alt-text="Screenshot of GitHub that shows the Copilot coding agent MCP configuration.":::


1. (Optional) If environment variables are required, set them under **Environment → Copilot** in the settings. These variables initialize automatically the first time an agentic task is invoked in this repository.
1. Save the MCP configuration.

### Create a custom agent

1. Go to the agents tab at <https://github.com/copilot/agents>.
1. In the prompt box, open the dropdown, and select the repository where you want to create the custom agent profile.
1. (Optional) Select the branch where you want to create the agent profile. The default is the main branch.
1. Select the **Copilot** icon, then select **+ Create an agent**. This action opens a template agent profile named `my-agent.agent.md` in the `.github/agents` directory of your target repository.
1. Paste the content below into the template, and rename the file to `appmod-java.agent.md`.

    ```text
    ---
    # For format details, see: https://gh.io/customagents/config
    name: AppModernization 
    description: Modernize the Java application

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

1. Commit the file, and merge it into the default branch.
1. Return to the agents tab, and refresh the page if needed. Your custom agent appears in the dropdown when you open the agent selector in the prompt box.

    Visit [Create a custom agent profile in a repository on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents#creating-a-custom-agent-profile-in-a-repository-on-github) for more information.

### Migrate the Java application to Azure

1. Open the [Agents panel](https://github.com/copilot/agents).
1. Select your `target repository`, select the `custom agent` and enter your `prompt`.

    After you submit it, Copilot starts a new session and opens a new pull request. It appears in the list below the prompt box. Copilot works on the task and adds you as a reviewer when it finishes, triggering a notification.

    :::image type="content" source="./media/coding-agent/select-custom-agent.png" lightbox="./media/coding-agent/select-custom-agent.png" alt-text="Screenshot of Java migrate task input in Coding Agent.":::

    Here are some prompt examples for your reference:

    ```text
    Run migration task for scenario Migrate Cassandra integration to Azure SDK using Managed Identity
    Run migration task for scenario local file I/O to Azure Blob Storage
    ```

    For details on predefined migration tasks, see [migration tasks](predefined-tasks.md).

1. After the migration starts, monitor the progress:

    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/migrate-progress.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/migrate-progress.png" alt-text="Screenshot of Java migrate progress in Coding Agent.":::

1. Finally, review the migration summary for insights—ensure your app is fully migrated and cloud-ready.

    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/migrate-completion.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/migrate-completion.png" alt-text="Screenshot of Java migrate completion in Coding Agent.":::


## Provide feedback

Share feedback about the GitHub Copilot Coding Agent using the [GitHub Copilot agent feedback form](https://aka.ms/ghcp-appmod/feedback).

## Reference

- [Using GitHub Copilot Coding Agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents)
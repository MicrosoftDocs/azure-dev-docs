---
title: Migrate Java Apps to Azure By Using GitHub Copilot App Modernization Via Custom Agent
description: Learn how to migrate Java applications to Azure using GitHub Copilot app modernization custom agents in both Copilot CLI and coding agent.
ms.topic: quickstart
ms.custom: devx-track-java
ms.date: 12/15/2025
ms.reviewer: xiada
---

# Migrate Java apps to Azure by using GitHub Copilot app modernization via custom agent

This article shows you how to migrate Java apps by using GitHub Copilot app modernization custom agents. Custom agents enable you to define specialized migration workflows that work in both the [Copilot CLI](github-copilot-app-modernization-for-java-copilot-cli.md) and [Copilot coding agent](github-copilot-app-modernization-for-java-coding-agent.md).

By creating a custom agent profile, you can:
- Standardize migration workflows across your team
- Ensure consistent migration patterns and validation steps
- Automate complex multi-step migration tasks
- Track migration progress systematically

## Prerequisites

Choose the environment where you want to use custom agents:

### For Copilot CLI

- [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) installed and configured. See [Get started with Copilot CLI](github-copilot-app-modernization-for-java-copilot-cli.md#get-started) for setup instructions.
- A GitHub Copilot Pro, Pro+, Business, or Enterprise subscription.
- [Node.js](https://nodejs.org/) version 22 or later.
- [npm](https://www.npmjs.com/get-npm) version 10 or later.

### For Copilot coding agent

- [Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent) configured. See [Get started with coding agent](github-copilot-app-modernization-for-java-coding-agent.md#get-started) for setup instructions.
- A GitHub Copilot Pro, Pro+, Business, or Enterprise subscription.
- A GitHub repository containing your application source code (admin access required).

## Add the MCP Server

Before creating a custom agent, you need to add the app modernization MCP server. The setup process differs between CLI and coding agent.

### For Copilot CLI

1. In your terminal, navigate to your Java project folder.

1. Run the following command in Copilot CLI:

    ```text
    /mcp add app-modernization
    ```

1. Fill in the fields as follows:

    - **Server Type**: Local
    - **Command**: `npx -y @microsoft/github-copilot-app-modernization-mcp-server`
    - **Environment Variables**: Leave empty
    - **Tools**: Use the default value `*`

    Alternatively, manually update the `~/.copilot/mcp-config.json` file:

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

1. Run `/mcp show` to verify the configuration.

For more details, see [Add MCP Server for CLI](github-copilot-app-modernization-for-java-copilot-cli.md#get-started).

### For Copilot coding agent

1. Go to **Settings** for your target repository (admin access required).

1. Select **Copilot**, then select **Coding Agent**.

1. In the **Model Context Protocol (MCP)** section under **MCP Configuration**, add the following configuration:

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

1. Select **Save Configuration**.

1. (Optional) If environment variables are required, set them under **Environment → Copilot** in the settings.

For more details, see [Add MCP Server for coding agent](github-copilot-app-modernization-for-java-coding-agent.md#get-started).

## Create a custom agent

The custom agent defines the specialized behavior and instructions for your migration workflows.

### For Copilot CLI

1. Create a file named `appmod-java.agent.md` in the local `~/.copilot/agents` directory.

1. Add the agent content (shown below).

1. Use the custom agent by running `/agent` in interactive mode or call it directly in a prompt:

    ```text
    Use the app modernization agent to migrate this application from S3 to Azure Blob Storage.
    ```

For more information, see [Use custom agents in Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#use-custom-agents).

### For Copilot coding agent

1. Go to the agents tab at <https://github.com/copilot/agents>.

1. In the prompt box, select your target repository from the dropdown.

1. (Optional) Select the branch where you want to create the agent profile (default is main branch).

1. Select the **Copilot** icon, then select **+ Create an agent**.

1. Rename the template file to `appmod-java.agent.md` in the `.github/agents` directory.

1. Add the agent profile content (shown below).

1. Commit and merge the file into the default branch.

1. Return to the agents tab and refresh to see your custom agent in the selector.

For more information, see [Create a custom agent profile](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents#creating-a-custom-agent-profile-in-a-repository-on-github).

### Custom agent content

Use the following content for both CLI and coding agent. Note that for Copilot CLI, you must include the `tools` field in the YAML frontmatter.

#### For Copilot CLI (with tools field)

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

#### For Copilot coding agent (without tools field)

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

## Migrate your Java application to Azure

Once you've created the custom agent, you can use it to migrate your Java applications. The process is similar in both CLI and coding agent.

### Using Copilot CLI

1. In your terminal, navigate to your Java project folder.

1. Start Copilot CLI and use your custom agent with a migration prompt:

    ```text
    Use the app modernization agent to migrate this application from S3 to Azure Blob Storage
    ```

    Or select the agent using `/agent` and then describe your migration task.

     :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/select-custom-agent.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/select-custom-agent.png" alt-text="Screenshot of selecting app modernization custom agent in Copilot CLI.":::

1. Monitor the migration progress in the terminal as the agent executes the migration steps.

    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/migrate-details.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/migrate-details.png" alt-text="Screenshot of GitHub Copilot CLI that shows running tasks in Java migration scenarios.":::

1. Review the migration summary when complete.

    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/migrate-summary.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/migrate-summary.png" alt-text="Screenshot of GitHub Copilot CLI that shows the Java migration summary.":::


### Using Copilot coding agent

1. Open the [Agents panel](https://github.com/copilot/agents).

1. Select your target repository and custom agent from the dropdown.

    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/select-custom-agent.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/select-custom-agent.png" alt-text="Screenshot of Java migrate task input in coding agent.":::

1. Enter your migration prompt. For example:

    ```text
    Run migration task for scenario Migrate Cassandra integration to Azure SDK using Managed Identity
    ```

    For predefined migration tasks, see [Predefined tasks for GitHub Copilot app modernization for Java developers](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md).

1. Copilot starts a new session and opens a pull request. Monitor the progress:

    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/migrate-progress.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/migrate-progress.png" alt-text="Screenshot of Java migrate progress in coding agent.":::

1. Review the migration summary when your app is fully migrated and cloud-ready.
    
    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/migrate-completion.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/migrate-completion.png" alt-text="Screenshot of Java migrate completion in coding agent.":::

## Provide feedback

Share feedback about GitHub Copilot app modernization using the [GitHub Copilot app modernization feedback form](https://aka.ms/ghcp-appmod/feedback).

## Reference

- [Modernize Java apps by using GitHub Copilot app modernization in the Copilot CLI](github-copilot-app-modernization-for-java-copilot-cli.md)
- [Modernize Java apps by using GitHub Copilot app modernization in coding agent](github-copilot-app-modernization-for-java-coding-agent.md)
- [Using GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli)
- [Use GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents)
- [Predefined tasks for GitHub Copilot app modernization for Java developers](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md)

---
title: Migrate Java Apps to Azure with Custom Agents
description: Learn to migrate Java apps to Azure using GitHub Copilot custom agents. Automate modernization with Copilot CLI and coding agent. Start migrating today.
#customer intent: As a Java developer, I want to migrate my application to Azure using GitHub Copilot CLI so that I can automate the modernization process.
ms.topic: quickstart
ms.custom: devx-track-java
ms.date: 01/13/2026
author: KarlErickson
ms.author: karler
ms.reviewer: xiada
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Migrate Java apps to Azure by using GitHub Copilot app modernization via custom agent

This article shows you how to migrate Java apps by using GitHub Copilot app modernization custom agents. By using custom agents, you can define specialized migration workflows that work in both the [Copilot CLI](github-copilot-app-modernization-for-java-copilot-cli.md) and [Copilot coding agent](github-copilot-app-modernization-for-java-coding-agent.md).

By creating a custom agent profile, you can:
- Standardize migration workflows across your team.
- Ensure consistent migration patterns and validation steps.
- Automate complex multistep migration tasks.
- Track migration progress systematically.

## Prerequisites

Choose the environment where you want to use custom agents:

### [Copilot CLI](#tab/copilot-cli)

- [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) installed and configured. For setup instructions, see [Modernize Java apps by using GitHub Copilot app modernization in the Copilot CLI](github-copilot-app-modernization-for-java-copilot-cli.md#get-started).
- A GitHub Copilot Pro, Pro+, Business, or Enterprise subscription.
- [Node.js](https://nodejs.org/) version 22 or later.
- [npm](https://www.npmjs.com/get-npm) version 10 or later.

### [Copilot coding agent](#tab/copilot-coding-agent)

- [Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent) configured. For setup instructions, see [Modernize Java apps by using GitHub Copilot app modernization in coding agent](github-copilot-app-modernization-for-java-coding-agent.md#get-started).
- A GitHub Copilot Pro, Pro+, Business, or Enterprise subscription.
- A GitHub repository containing your application source code. Administrator access is required.

---

## Add the MCP server

Before creating a custom agent, add the app modernization MCP server. The setup process differs between CLI and coding agent.

### [Copilot CLI](#tab/copilot-cli)

1. In your terminal, go to your Java project folder.

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

For more information, see [Add MCP Server for CLI](github-copilot-app-modernization-for-java-copilot-cli.md#get-started).

### [Copilot coding agent](#tab/copilot-coding-agent)

1. Go to **Settings** for your target repository. Administrator access is required.

1. Select **Copilot**, and then select **Coding Agent**.

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

For more information, see [Add MCP Server for coding agent](github-copilot-app-modernization-for-java-coding-agent.md#get-started).

---

## Create a custom agent

The custom agent defines the specialized behavior and instructions for your migration workflows.

### [Copilot CLI](#tab/copilot-cli)

1. Create a file named `appmod-java.agent.md` in the local `~/.copilot/agents` directory.

1. Add the agent content shown later in this article.

1. To use the custom agent, run `/agent` in interactive mode or call it directly in a prompt:

    ```text
    Use the app modernization agent to migrate this application from S3 to Azure Blob Storage.
    ```

For more information, see [Use custom agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#use-custom-agents).

### [Copilot coding agent](#tab/copilot-coding-agent)

1. Go to the [GitHub Agents tab](https://github.com/copilot/agents).

1. Select your target repository from the dropdown in the prompt box.

1. (Optional) Select the branch where you want to create the agent profile. The default is the main branch.

1. Select the **Copilot** icon, and then select **Create an agent**.

1. Rename the template file to `appmod-java.agent.md` in the `.github/agents` directory.

1. Add the agent profile content shown later in this article.

1. Commit and merge the file into the default branch.

1. Return to the agents tab and refresh to see your custom agent in the selector.

For more information, see [Creating a custom agent profile in a repository on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents#creating-a-custom-agent-profile-in-a-repository-on-github).

---

### Custom agent content

Use the following content for both CLI and coding agent. For Copilot CLI, include the `tools` field in the YAML front matter.

#### [Copilot CLI (with tools field)](#tab/copilot-cli)

>[!NOTE]
> The MCP tool name prefix must match the MCP server's name. In the following case, it uses all the tools in the `app-modernization` MCP server, as `app-modernization/*`

```text
---
# For format details, see: https://gh.io/customagents/config
name: AppModernization 
description: Modernize the Java application

tools: ['shell', 'read', 'edit', 'search', 'custom-agent', 'web', 'todo', 'app-modernization/*']

---

# [PLACEHOLDER: Paste custom agent content here]
```

#### [Copilot coding agent (without tools field)](#tab/copilot-coding-agent)

```text
---
# For format details, see: https://gh.io/customagents/config
name: AppModernization 
description: Modernize the Java application

---

# [PLACEHOLDER: Paste custom agent content here]
```

---

## Migrate your Java application to Azure

After creating the custom agent, use it to migrate your Java applications. The process is similar in both CLI and coding agent.

### [Copilot CLI](#tab/copilot-cli)

1. In your terminal, go to your Java project folder.

1. Start Copilot CLI and use your custom agent with a migration prompt:

    ```text
    Use the app modernization agent to migrate this application from S3 to Azure Blob Storage
    ```

    Or select the agent by using `/agent` and then describe your migration task.

     :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/select-custom-agent.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/select-custom-agent.png" alt-text="Screenshot of GitHub Copilot CLI that shows the Select Custom Agent options.":::

1. Monitor the migration progress in the terminal as the agent executes the migration steps.

    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/migrate-details.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/migrate-details.png" alt-text="Screenshot of GitHub Copilot CLI that shows running tasks in Java migration scenarios.":::

1. Review the migration summary when complete.

    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/migrate-summary.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent/migrate-summary.png" alt-text="Screenshot of GitHub Copilot CLI that shows the Java migration summary.":::

### [Copilot coding agent](#tab/copilot-coding-agent)

1. Open the [Agents panel](https://github.com/copilot/agents).

1. Select your target repository and custom agent from the dropdown.

    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/select-custom-agent.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/select-custom-agent.png" alt-text="Screenshot of the GitHub Agents panel that shows the Java migrate task input in the coding agent.":::

1. Enter your migration prompt. For example:

    ```text
    Run migration task for scenario Migrate Cassandra integration to Azure SDK using Managed Identity
    ```

    For predefined migration tasks, see [Predefined tasks for GitHub Copilot app modernization for Java developers](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md).

1. Copilot starts a new session and opens a pull request. Monitor the progress:

    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/migrate-progress.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/migrate-progress.png" alt-text="Screenshot of the GitHub Agents pane that shows the Java migrate progress in the coding agent.":::

1. Review the migration summary when your app is fully migrated and cloud-ready.
    
    :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/migrate-completion.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java-coding-agent-custom-agent/migrate-completion.png" alt-text="Screenshot of the GitHub Agents pane that shows the Java migrate completion in the coding agent.":::

---

## Provide feedback

Share feedback about GitHub Copilot app modernization by using the [GitHub Copilot app modernization feedback form](https://aka.ms/ghcp-appmod/feedback).

## Reference

- [Modernize Java apps by using GitHub Copilot app modernization in the Copilot CLI](github-copilot-app-modernization-for-java-copilot-cli.md)
- [Modernize Java apps by using GitHub Copilot app modernization in coding agent](github-copilot-app-modernization-for-java-coding-agent.md)
- [Using GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli)
- [Use GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents)
- [Predefined tasks for GitHub Copilot app modernization for Java developers](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md)

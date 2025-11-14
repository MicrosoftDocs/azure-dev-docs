---
title: Modernizing Java Apps Using GitHub Copilot App Modernization in Coding Agent
titleSuffix: Azure
description: Provides an overview of how Java developers can modernize applications using GitHub Copilot app modernization in Copilot coding agent.
author: KarlErickson
ms.author: karler
ms.reviewer: xinrzhu
ms.topic: overview
ms.date: 11/18/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Modernize Java apps by using GitHub Copilot app modernization in coding agent

This article provides an overview of how Java developers can modernize their applications using **GitHub Copilot app modernization** within the [Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent). The agent can work independently in the background to complete modernization tasks—just like a human developer. Developers can delegate tasks via issues or pull requests, and the agent executes them in the cloud, helping teams complete the entire modernization journey efficiently.

> [!NOTE]
> Copilot coding agent is available with the GitHub Copilot Pro, GitHub Copilot Pro+, GitHub Copilot Business and GitHub Copilot Enterprise plans. The agent is available in all repositories stored on GitHub, except repositories owned by managed user accounts and where it has been explicitly disabled.

Supported scenarios:

- **Upgrade your Java application** – for example: `Upgrade this project to the latest Java version`.
- **Migrate your Java application to Azure** – using predefined tasks listed in [Migration Tasks](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md#task-list).
- **Deploy your Java application to Azure** – for example: `Deploy this application to Azure`.

## Prerequisites

- [Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent) configured
- A GitHub Copilot Pro, Pro+, Business, or Enterprise subscription
- A GitHub repo

## Get started

1. Go to the **Settings** section of the target repository you want to modernize. You must be an administrator of this repository.

1. Select Copilot, then select **Coding Agent**.

1. Under **MCP Configuration** in the **Model Context Protocol (MCP)** section, manually add the following configuration, and then select **Save Configuration**:

   ```
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

   :::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/mcp.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/mcp.png" alt-text="Screenshot of MCP configuration in coding agent.":::

1. (Optional) If environment variables are required, set them under Environment → Copilot in the settings. These environment variables will be initialized automatically the first time a user invokes an agentic task in this repository.

1. Open the Agents panel in the top-right corner and enter your prompt. After the prompt is entered, Copilot will start a new session and open a new Pull Request, which will appear in the list below the prompt box. Copilot will work on the task and then add you as a reviewer when it has finished, triggering a notification.

   :::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/agent-panel.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/agent-panel.png" alt-text="Screenshot of agent panel and a list of previous Java upgrade sessions.":::

You can find sample prompts in the next section.

### Upgrade your Java application

To upgrade your Java application to a newer runtime or framework version, run the following example prompt This helps ensure your project stays aligned with the latest platform capabilities and security updates.

```
Upgrade this project to JDK 21 and Spring Boot 3.5
```

Here's an example:

Describe what you'd like to achieve in plain language:

:::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/upgrade-input.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/upgrade-input.png" alt-text="Screenshot of Java upgrade task input in coding agent":::

Coding agent will then execute, including generating the upgrade plan, performing code remediation, building the project, and checking for vulnerabilities:

:::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/upgrade-progress.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/upgrade-progress.png" alt-text="Screenshot of Java upgrade progress in coding agent":::

You will get a concise summary highlights at the end:

:::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/upgrade-completion.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/upgrade-completion.png" alt-text="Screenshot of Java upgrade completion in coding agent":::

### Migrate your Java application to Azure

To migrate your Java application to Azure, describe your migration scenario for coding agent. For more information about predefined migration tasks, see [Predefined tasks for GitHub Copilot app modernization for Java developers](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md)

For example:

```
Run migration task for scenario Migrate Cassandra integration to Azure SDK using Managed Identity
```

Here's an example:

Start by describing your migration task in plain language:

:::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/migrate-input.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/migrate-input.png" alt-text="Screenshot of Java migrate task input in coding agent":::

After the migration starts, you can monitor the progress:

:::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/migrate-progress.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/migrate-progress.png" alt-text="Screenshot of Java migrate progress in coding agent":::

Finally, you can review the migration summary for insights — ensuring your app is fully modernized and cloud-ready.

:::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/migrate-completion.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/migrate-completion.png" alt-text="Screenshot of Java migrate completion in coding agent":::

### Deploy your Java application to Azure

After upgrading or migrating your application, you can deploy it directly from coding agent by following prompt examples:

```
Deploy this application to Azure
```

You can follow the same steps as upgrade or migration for deployment — the overall process remains consistent.

## Provide feedback

If you have any feedback about GitHub Copilot agent, please let us know your [feedback](https://aka.ms/ghcp-appmod/feedback).

## Next step

- [Use GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents)

---
title: Modernize Java Apps by Using GitHub Copilot App Modernization in Coding Agent
titleSuffix: Azure
description: Provides an overview of how Java developers can modernize applications by using GitHub Copilot app modernization in the Copilot coding agent.
author: KarlErickson
ms.author: karler
ms.reviewer: xinrzhu
ms.topic: overview
ms.date: 11/18/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Modernize Java apps by using GitHub Copilot app modernization in coding agent

This article provides an overview of how Java developers can modernize their applications using GitHub Copilot app modernization within the [Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent). The agent can work independently in the background to complete modernization tasks, just like a human developer. Developers can delegate tasks via issues or pull requests, and the agent executes them in the cloud, helping teams complete the entire modernization journey efficiently.

> [!NOTE]
> Copilot coding agent is available with the GitHub Copilot Pro, GitHub Copilot Pro+, GitHub Copilot Business and GitHub Copilot Enterprise plans. The agent is available in all repositories stored on GitHub, except repositories owned by managed user accounts and where it has been explicitly disabled.

Supported scenarios:

- **Upgrade your Java application** – for example: `Upgrade this project to the latest Java version`.
- **Migrate your Java application to Azure** – using predefined tasks listed in [Predefined tasks for GitHub Copilot app modernization for Java developers](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md#task-list).
- **Deploy your Java application to Azure** – for example: `Deploy this application to Azure`.

## Prerequisites

- [Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent) configured
- A GitHub Copilot Pro, Pro+, Business, or Enterprise subscription
- A GitHub repo

## Get started

Use the following steps to get started with the Copilot coding agent:

1. Go to the **Settings** section of the target repository you want to modernize. You must be an administrator of this repository.

1. Select Copilot, then select **Coding Agent**.

1. Under **MCP Configuration** in the **Model Context Protocol (MCP)** section, manually add the following configuration, and then select **Save Configuration**:

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

1. (Optional) If environment variables are required, set them under **Environment** > **Copilot** in the settings. These environment variables are initialized automatically the first time a user invokes an agentic task in this repository.

1. Open the **Agents** panel in the top-right corner and enter your prompt. After the prompt is entered, Copilot starts a new session and opens a new pull request, which appears in the list below the prompt box. Copilot works on the task and then adds you as a reviewer when it's finished, triggering a notification.

   :::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/agent-panel.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/agent-panel.png" alt-text="Screenshot of GitHub that shows the Agents panel and a list of previous Java upgrade sessions.":::

You can find sample prompts in the next section.

## Upgrade your Java application

To upgrade your Java application to a newer runtime or framework version, run the following example prompt. This prompt helps ensure that your project stays aligned with the latest platform capabilities and security updates.

```prompt
Upgrade this project to JDK 21 and Spring Boot 3.5
```

The following steps illustrate the upgrade process:

1. Describe what you'd like to achieve in plain language.

   :::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/upgrade-input.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/upgrade-input.png" alt-text="Screenshot of GitHub that shows the Agents panel with the Java upgrade task input.":::

1. The coding agent then executes, including generating the upgrade plan, performing code remediation, building the project, and checking for vulnerabilities.

   :::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/upgrade-progress.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/upgrade-progress.png" alt-text="Screenshot of GitHub that shows the Agents panel with the Java upgrade progress.":::

1. You get a concise summary at the end.

   :::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/upgrade-completion.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/upgrade-completion.png" alt-text="Screenshot of GitHub that shows the Agents panel with the Java upgrade summary.":::

## Migrate your Java application to Azure

To migrate your Java application to Azure, describe your migration scenario for the coding agent as shown in the following example prompt. For more information about predefined migration tasks, see [Predefined tasks for GitHub Copilot app modernization for Java developers](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md). 

```prompt
Run migration task for scenario Migrate Cassandra integration to Azure SDK using Managed Identity
```

The following steps illustrate the migration process:

1. Start by describing your migration task in plain language.

   :::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/migrate-input.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/migrate-input.png" alt-text="Screenshot of GitHub that shows the Agents panel with the Java migrate task input.":::

1. After the migration starts, you can monitor the progress.

   :::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/migrate-progress.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/migrate-progress.png" alt-text="Screenshot of GitHub that shows the Agents panel with the Java migration progress.":::

1. Finally, you can review the migration summary for insights, ensuring your app is fully modernized and cloud-ready.

   :::image type="content" source="./media/github-copilot-app-modernization-for-java-coding-agent/migrate-completion.png" lightbox="./media/github-copilot-app-modernization-for-java-coding-agent/migrate-completion.png" alt-text="Screenshot of GitHub that shows the Agents panel with the Java migration summary.":::

## Deploy your Java application to Azure

After upgrading or migrating your application, you can deploy it directly from the coding agent by using the following prompt:

```prompt
Deploy this application to Azure
```

You can follow the same steps for deployment as shown previously for upgrade and migration - the overall process remains consistent.

## Provide feedback

If you have any feedback about GitHub Copilot agent, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml).

## Next step

- [Use GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents)
- [Migrate Java apps to Azure using GitHub Copilot app modernization via Custom Agent](migrate-github-copilot-app-modernization-for-java-custom-agent.md)

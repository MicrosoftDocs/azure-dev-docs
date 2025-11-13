---
title: Modernizing Java Apps Using GitHub Copilot App Modernization in Coding Agent
titleSuffix: Azure
description: Provides an overview of how Java developers can modernize applications using GitHub Copilot App Modernization in Copilot Coding Agent.
author: KarlErickson
ms.author: karler
ms.reviewer: xinrzhu
ms.topic: overview
ms.date: 11/11/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Modernizing Java Apps Using GitHub Copilot App Modernization in Coding Agent

## Overview

This article provides an overview of how Java developers can modernize their applications using **GitHub Copilot App Modernization** within the [**Copilot Coding Agent**](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent). The agent can work independently in the background to complete modernization tasks—just like a human developer. Developers can delegate tasks via issues or pull requests, and the agent executes them in the cloud, helping teams complete the entire modernization journey efficiently.  

>[!NOTE]
>Copilot coding agent is available with the GitHub Copilot Pro, GitHub Copilot Pro+, GitHub Copilot Business and GitHub Copilot Enterprise plans. The agent is available in all repositories stored on GitHub, except repositories owned by managed user accounts and where it has been explicitly disabled.

## Supported Scenarios
- **Upgrade your Java application** – for example: `Upgrade this project to the latest Java version`.  
- **Migrate your Java application to Azure** – using predefined tasks listed in [Migration Tasks](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md#task-list).  
- **Deploy your Java application to Azure** – for example: `Deploy this application to Azure`.  

## Prerequisites
- [**Copilot Coding Agent**](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent) configured  
- A GitHub Copilot Pro, Pro+, Business, or Enterprise subscription
- A GitHub repo

## Getting Started
1. Go to the Settings of the target repository you want to modernize.(You must be an admin of this repository)
2. Select Copilot, then click "Coding Agent".
3. Under MCP Configuration in the Model Context Protocol (MCP) section, manually add the following configuration, and click "Save Configuration":
```
{
  "mcpServers": {
    // Modernizing for Java upgrade tasks
    "java-upgrade": {
      "type": "local",
      "tools": [
        "*"
      ],
      "command": "npx",
      "args": [
        "-y",
        "vscode-java-upgrade" // TODO: update to actual package name
      ]
    }
    //TODO: java migration
    //TODO: java deployment
  }
}
```
:::image type="content" source="./media/coding-agent/mcp.png" lightbox="./media/coding-agent/upgrade-details.png" alt-text="Screenshot of MCP configuration in coding agent":::
4. (Optional) If environment variables are required, set them under Environment → Copilot in the settings. These environment variables will be initialized automatically the first time a user invokes an agentic task in this repository.
5. Open the Agents panel in the top-right corner and enter your prompt. After the prompt is entered, Copilot will start a new session and open a new Pull Request, which will appear in the list below the prompt box. Copilot will work on the task and then add you as a reviewer when it has finished, triggering a notification.
:::image type="content" source="./media/coding-agent/agent-panel.png" lightbox="./media/coding-agent/agent-panel.png" alt-text="Screenshot of agent panel and a list of previous Java upgrade sessions":::

Sample prompts can be found in the next section.

### Upgrade your Java Application
To upgrade your Java application to a newer runtime or framework version, run the following example prompt This helps ensure your project stays aligned with the latest platform capabilities and security updates.
```
Upgrade this project to JDK 21 and Spring Boot 3.5
```

Here's an example:
Describe what you’d like to achieve in plain language:
:::image type="content" source="./media/coding-agent/upgrade-input.png" lightbox="./media/coding-agent/upgrade-input.png" alt-text="Screenshot of Java upgrade task input in Coding Agent":::

Coding agent will then execute, including generating the upgrade plan, performing code remediation, building the project, and checking for vulnerabilities:
:::image type="content" source="./media/coding-agent/upgrade-progress.png" lightbox="./media/coding-agent/upgrade-progress.png" alt-text="Screenshot of Java upgrade progress in Coding Agent":::

You will get a concise summary highlights at the end:
:::image type="content" source="./media/coding-agent/upgrade-completion.png" lightbox="./media/coding-agent/upgrade-completion.png" alt-text="Screenshot of Java upgrade completion in Coding Agent":::

### Migrate your Java Application to Azure
To migrate your Java application to Azure, describe your migration scenario for Coding Agent.
For details on predefined migration tasks, see [migration tasks](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md#task-list)
For example:
```
Run migration task for scenario Migrate Cassandra integration to Azure SDK using Managed Identity
```
Here's an example:
Start by describing your migration task in plain language:
:::image type="content" source="./media/coding-agent/migrate-input.png" lightbox="./media/coding-agent/migrate-input.png" alt-text="Screenshot of Java migrate task input in Coding Agent":::

After the migration starts, you can monitor the progress:
:::image type="content" source="./media/coding-agent/migrate-progress.png" lightbox="./media/coding-agent/migrate-progress.png" alt-text="Screenshot of Java migrate progress in Coding Agent":::

Finally, you can review the migration summary for insights — ensuring your app is fully modernized and cloud-ready.
:::image type="content" source="./media/coding-agent/migrate-completion.png" lightbox="./media/coding-agent/migrate-completion.png" alt-text="Screenshot of Java migrate completion in Coding Agent":::

### Deploy your Java Application to Azure
After upgrading or migrating your application, you can deploy it directly from Coding Agent by following prompt examples:
```
Deploy this application to Azure
```

You can follow the same steps as upgrade or migration for deployment — the overall process remains consistent.

## Provide Feedback
If you have any feedback about GitHub Copilot agent, please let us know your [feedback](https://aka.ms/ghcp-appmod/feedback).

## Reference
- [Using GitHub Copilot agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents).
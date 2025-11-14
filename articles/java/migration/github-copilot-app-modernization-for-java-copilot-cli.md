---
title: Modernizing Java Apps Using GitHub Copilot app modernization in Copilot CLI
titleSuffix: Azure
description: Provides an overview of how Java developers can modernize applications using GitHub Copilot app modernization in the Copilot CLI.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: overview
ms.date: 11/11/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Modernizing Java Apps Using GitHub Copilot app modernization in the Copilot CLI

## Overview

This article provides an overview of how Java developers can modernize their applications using **GitHub Copilot app modernization** within the [**Copilot CLI**](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli), enabling them to modernize applications wherever they code. It delivers a seamless, end-to-end experience—from upgrade and migration to deployment — helping teams accelerate transformation, boost productivity, and confidently move their applications to modern platforms. It’s currently in public preview — give it a try and let us know if any [feedback](https://aka.ms/ghcp-appmod/feedback).
:::image type="content" source="./media/copilot-cli/entrance.png" lightbox="./media/copilot-cli/entrance.png" alt-text="Screenshot of app mod entrance in Copilot CLI":::

>[!NOTE]
>GitHub Copilot CLI is available with the GitHub Copilot Pro, GitHub Copilot Pro+, GitHub Copilot Business and GitHub Copilot Enterprise plans.
>If you receive Copilot from an organization, the Copilot CLI policy must be enabled in the organization's settings.

## Why Use Copilot CLI with app modernization
- Run modernization tasks directly from the terminal — no need to switch to an IDE  
- Supports both interactive (human-in-the-loop) and batch workflows

## Supported Scenarios
- **Upgrade your Java application** – for example: `Upgrade to the latest Java version`.  
- **Migrate your Java application to Azure** – using predefined tasks listed in [Migration Tasks](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md#task-list).  
- **Deploy your Java application to Azure** – for example: `Deploy this application to Azure`.  

## Prerequisites
- [Install Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli)
- A GitHub Copilot subscription, See [Copilot plans](https://github.com/features/copilot/plans?ref_product=copilot)
- Node.js version 22 or later
- npm version 10 or later

## Getting Started
1. In your terminal, navigate to the Java project folder containing the code you want to work on.
2. Enter `copilot` to start Copilot CLI.
```
copilot
```
Copilot will ask you to confirm that you trust the files in this folder. Refer to [Using Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#trusted-directories)
Choose one of the options:
- Yes, proceed: Copilot can work with the files in this location for this session only.
- Yes, and remember this folder for future sessions: You trust the files in this folder for this and future sessions. You won't be asked again when you start Copilot CLI from this folder. Only choose this option if you are sure that it will always be safe for Copilot to work with files in this location.
- No, exit (Esc): End your Copilot CLI session.
3. You can add MCP servers by running `/mcp add` in Copilot CLI according to the configuration below, here is an example of adding app modernization MCP:
```
/mcp add app-modernization
```
Or by manually updating the `~/.config/mcp-config.json` file with the following info. Refer to [Add an MCP server](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#add-an-mcp-server)
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
You can run `/mcp show` to verify the MCP servers are correctly configured.
```
/mcp show
```

## Running app modernization Tasks
User can trigger key modernization tasks directly from the Copilot CLI using natural language.  
Typical scenarios include upgrading Java upgrade and framework, migrating workloads to Azure, containerizing applications, and deploying to Azure services.

### Upgrade your Java Application
To upgrade your Java application to a newer runtime or framework version, run the following example prompt in Copilot CLI. This helps ensure your project stays aligned with the latest platform capabilities and security updates.
```
Upgrade this project to JDK 21 and Spring Boot 3.2
```
The modernization task will then execute, including generating the upgrade plan, performing code remediation, building the project, and checking for vulnerabilities as below:
:::image type="content" source="./media/copilot-cli/upgrade-details.png" lightbox="./media/copilot-cli/upgrade-details.png" alt-text="Screenshot of executing tasks in Java upgrade scenarios":::

The project has been successfully upgraded to JDK 21 and Spring Boot 3.2, with below summary:
:::image type="content" source="./media/copilot-cli/upgrade-summary.png" lightbox="./media/copilot-cli/upgrade-summary.png" alt-text="Screenshot of Java upgrade summary in Copilot CLI":::

### Migrate your Java Application to Azure
To migrate your Java application to Azure, describe your migration scenario in Copilot CLI.
For details on predefined migration tasks, see [migration tasks](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md#task-list)
For example:
```
Migrate this application from S3 to Azure Blob Storage
```
Then the migration task will be executed and showing progress in Copilot CLI
:::image type="content" source="./media/copilot-cli/migrate-details.png" lightbox="./media/copilot-cli/migrate-details.png" alt-text="Screenshot of executing tasks in Java migrate scenarios":::

The project has been successfully migrated to Azure Blob Storage, with below summary:
:::image type="content" source="./media/copilot-cli/migrate-summary.png" lightbox="./media/copilot-cli/migrate-summary.png" alt-text="Screenshot of Java migrate summary in Copilot CLI":::

### Deploy your Java Application to Azure
After upgrading or migrating your application, you can deploy it directly from Copilot CLI by following prompt examples:
```
Deploy this application to Azure
```

The deployment task will be executed with showing progress in Copilot CLI:
:::image type="content" source="./media/copilot-cli/deploy-details.png" lightbox="./media/copilot-cli/deploy-details.png" alt-text="Screenshot of Java deploy details in Copilot CLI":::

The project has been successfully deployed, with below summary:
:::image type="content" source="./media/copilot-cli/deploy-summary.png" lightbox="./media/copilot-cli/deploy-summary.png" alt-text="Screenshot of Java deploy summary in Copilot CLI":::

## Provide Feedback
If you have any feedback about GitHub Copilot CLI, please let us know your [feedback](https://aka.ms/ghcp-appmod/feedback).

## Reference
- [Using GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#using-copilot-cli).
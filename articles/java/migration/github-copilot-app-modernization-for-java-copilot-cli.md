---
title: Modernize Java Apps by Using GitHub Copilot App Modernization in the Copilot CLI
titleSuffix: Azure
description: Provides an overview of how Java developers can modernize applications by using GitHub Copilot app modernization in the Copilot CLI.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: overview
ms.date: 11/18/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Modernize Java apps by using GitHub Copilot app modernization in the Copilot CLI

This article provides an overview of how Java developers can modernize their applications by using GitHub Copilot app modernization within the [Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli). With this approach, developers can modernize applications wherever they code. It delivers a seamless, end-to-end experience - from upgrade and migration to deployment - helping teams accelerate transformation, boost productivity, and confidently move their applications to modern platforms. It's currently in public preview - give it a try and let us know if any [feedback](https://aka.ms/ghcp-appmod/feedback).

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/entrance.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/entrance.png" alt-text="Screenshot of GitHub Copilot CLI that shows an app modernization prompt.":::

> [!NOTE]
> GitHub Copilot CLI is available with the GitHub Copilot Pro, GitHub Copilot Pro+, GitHub Copilot Business, and GitHub Copilot Enterprise plans. If you receive Copilot from an organization, the Copilot CLI policy must be enabled in the organization's settings.

## Why use Copilot CLI with app modernization

- Run modernization tasks directly from the terminal - no need to switch to an IDE.
- Supports both interactive (human-in-the-loop) and batch workflows.

## Supported scenarios

- **Upgrade your Java application** – for example: `Upgrade to the latest Java version`.
- **Migrate your Java application to Azure** – using predefined tasks listed in [Migration Tasks](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md#task-list).
- **Deploy your Java application to Azure** – for example: `Deploy this application to Azure`.

## Prerequisites

- [Install Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli)
- A GitHub Copilot subscription, See [Copilot plans](https://github.com/features/copilot/plans?ref_product=copilot)
- Node.js version 22 or later
- npm version 10 or later

## Get started

1. In your terminal, go to the Java project folder that contains the code you want to work on.

1. Enter `copilot` to start Copilot CLI.

   ```bash
   copilot
   ```

   Copilot asks you to confirm that you trust the files in this folder. For more information, see [Using Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#trusted-directories).

1. Choose one of the options:

   - Yes, proceed: Copilot can work with the files in this location for this session only.
   - Yes, and remember this folder for future sessions: You trust the files in this folder for this and future sessions. You won't be asked again when you start Copilot CLI from this folder. Choose this option only if you're sure that it's always safe for Copilot to work with files in this location.
   - No, exit (Esc): End your Copilot CLI session.

1. Add MCP servers by running `/mcp add` in Copilot CLI according to the configuration below. Here's an example of adding app modernization MCP:

   ```Copilot CLI
   /mcp add app-modernization
   ```

   Or manually update the `~/.config/mcp-config.json` file with the following info. For more information, see [Add an MCP server](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#add-an-mcp-server).

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

1. Run `/mcp show` to verify the MCP servers are correctly configured.

   ```Copilot CLI
   /mcp show
   ```

## Run app modernization tasks

You can trigger key modernization tasks directly from the Copilot CLI by using natural language.
Typical scenarios include upgrading Java version and framework, migrating workloads to Azure, containerizing applications, and deploying to Azure services.

### Upgrade your Java Application

To upgrade your Java application to a newer runtime or framework version, run the following example prompt in Copilot CLI. This approach helps ensure your project stays aligned with the latest platform capabilities and security updates.

```Copilot CLI
Upgrade this project to JDK 21 and Spring Boot 3.2
```

The modernization task then executes, including generating the upgrade plan, performing code remediation, building the project, and checking for vulnerabilities as shown in the following image:

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/upgrade-details.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/upgrade-details.png" alt-text="Screenshot of GitHub Copilot CLI that shows running tasks in Java upgrade scenarios.":::

The project is successfully upgraded to JDK 21 and Spring Boot 3.2, with the following summary:

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/upgrade-summary.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/upgrade-summary.png" alt-text="Screenshot of GitHub Copilot CLI that shows the Java upgrade summary.":::

### Migrate your Java Application to Azure

To migrate your Java application to Azure, describe your migration scenario in Copilot CLI.
For details on predefined migration tasks, see [migration tasks](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md#task-list).

For example:

```Copilot CLI
Migrate this application from S3 to Azure Blob Storage
```

Then, the migration task is executed and shows progress in Copilot CLI:

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/migrate-details.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/migrate-details.png" alt-text="Screenshot of GitHub Copilot CLI that shows running tasks in Java migration scenarios.":::

The project is successfully migrated to Microsoft Azure Blob Storage, with the following summary:

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/migrate-summary.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/migrate-summary.png" alt-text="Screenshot of GitHub Copilot CLI that shows the Java migration summary.":::

### Deploy your Java application to Azure

After upgrading or migrating your application, you can deploy it directly from Copilot CLI by using the following prompt example:

```Copilot CLI
Deploy this application to Azure
```

The deployment task runs and shows progress in Copilot CLI:

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/deploy-details.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/deploy-details.png" alt-text="Screenshot of GitHub Copilot CLI that shows the Java deployment details.":::

The project is successfully deployed, with the following summary:

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/deploy-summary.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/deploy-summary.png" alt-text="Screenshot of GitHub Copilot CLI that shows the Java deployment summary.":::

## Provide feedback

If you have any feedback about GitHub Copilot CLI, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml).

## Next step

- [Using GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#using-copilot-cli)

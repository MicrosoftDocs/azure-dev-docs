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

This article provides an overview of how Java developers can modernize their applications by using GitHub Copilot app modernization within the [Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli). With this approach, developers can modernize applications wherever they code. Copilot CLI delivers a seamless, end-to-end experience - from upgrade and migration to deployment - helping teams accelerate transformation, boost productivity, and confidently move their applications to modern platforms. It's currently in public preview - give it a try and let us know if you have any [feedback](https://aka.ms/ghcp-appmod/feedback).

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/entrance.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/entrance.png" alt-text="Screenshot of the GitHub Copilot CLI that shows an app modernization prompt.":::

> [!NOTE]
> GitHub Copilot CLI is available with the GitHub Copilot Pro, GitHub Copilot Pro+, GitHub Copilot Business, and GitHub Copilot Enterprise plans. If you receive Copilot from an organization, the Copilot CLI policy must be enabled in the organization's settings.

Using Copilot CLI for app modernization enables you to run modernization tasks directly from the terminal, with no need to switch to an IDE. This approach supports both interactive - human-in-the-loop - and batch workflows.

Supported scenarios:

- **Upgrade your Java application** – for example: `Upgrade to the latest Java version`.
- **Migrate your Java application to Azure** – using predefined tasks listed in [Predefined tasks for GitHub Copilot app modernization for Java developers](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md).
- **Deploy your Java application to Azure** – for example: `Deploy this application to Azure`.

## Prerequisites

- [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli).
- A GitHub Copilot subscription. For more information, see [Copilot plans](https://github.com/features/copilot/plans?ref_product=copilot).
- [Node.js](https://nodejs.org/) version 22 or later.
- [npm](https://www.npmjs.com/get-npm) version 10 or later.

## Get started

Use the following steps to get started with app modernization using Copilot CLI.

1. In your terminal, go to the Java project folder that contains the code you want to work on.

1. Enter `copilot` to start Copilot CLI.

   ```bash
   copilot
   ```

   Copilot asks you to confirm that you trust the files in this folder. For more information, see [Using Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#trusted-directories).

1. Choose one of the following options:

   - **Yes, proceed**: Copilot can work with the files in this location for this session only.
   - **Yes, and remember this folder for future sessions**: You trust the files in this folder for this and future sessions. You won't be asked again when you start Copilot CLI from this folder. Choose this option only if you're sure that it's always safe for Copilot to work with files in this location.
   - **No, exit (Esc)**: End your Copilot CLI session.

1. Add MCP servers by running `/mcp add` in Copilot CLI as shown in the following example, which adds the app modernization MCP server:

   ```Copilot CLI
   /mcp add app-modernization
   ```

   Alternatively, manually update the `~/.config/mcp-config.json` file with the following configuration. For more information, see [Add an MCP server](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#add-an-mcp-server).

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

1. Run `/mcp show` to verify that the MCP servers are correctly configured.

   ```Copilot CLI
   /mcp show
   ```

## Run app modernization tasks

You can trigger key modernization tasks directly from the Copilot CLI by using natural language. Typical scenarios include upgrading Java version and framework, migrating workloads to Azure, containerizing applications, and deploying to Azure services.

### Upgrade your Java application

To upgrade your Java application to a newer runtime or framework version, run the following example prompt in Copilot CLI. This approach helps ensure your project stays aligned with the latest platform capabilities and security updates.

```prompt
Upgrade this project to JDK 21 and Spring Boot 3.2
```

The modernization task then executes, including generating the upgrade plan, performing code remediation, building the project, and checking for vulnerabilities as shown in the following screenshot:

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/upgrade-details.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/upgrade-details.png" alt-text="Screenshot of GitHub Copilot CLI that shows running tasks in Java upgrade scenarios.":::

The project is successfully upgraded to JDK 21 and Spring Boot 3.2, and an upgrade summary is displayed.

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/upgrade-summary.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/upgrade-summary.png" alt-text="Screenshot of GitHub Copilot CLI that shows the Java upgrade summary.":::

### Migrate your Java application to Azure

To migrate your Java application to Azure, describe your migration scenario in Copilot CLI, as shown in the following example prompt. For more information on predefined migration tasks, see [Predefined tasks for GitHub Copilot app modernization for Java developers](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md).

```prompt
Migrate this application from S3 to Azure Blob Storage
```

With this prompt, the migration task is executed and shows progress in Copilot CLI.

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/migrate-details.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/migrate-details.png" alt-text="Screenshot of GitHub Copilot CLI that shows running tasks in Java migration scenarios.":::

When the project is successfully migrated to Microsoft Azure Blob Storage, a migration summary is displayed.

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/migrate-summary.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/migrate-summary.png" alt-text="Screenshot of GitHub Copilot CLI that shows the Java migration summary.":::

### Deploy your Java application to Azure

After upgrading or migrating your application, you can deploy it directly from Copilot CLI by using the following example prompt:

```prompt
Deploy this application to Azure
```

With this prompt, the deployment task runs and shows progress in Copilot CLI.

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/deploy-details.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/deploy-details.png" alt-text="Screenshot of GitHub Copilot CLI that shows the Java deployment details.":::

When the project is successfully deployed, a deployment summary is displayed.

:::image type="content" source="./media/github-copilot-app-modernization-for-java-copilot-cli/deploy-summary.png" lightbox="./media/github-copilot-app-modernization-for-java-copilot-cli/deploy-summary.png" alt-text="Screenshot of GitHub Copilot CLI that shows the Java deployment summary.":::

## Provide feedback

If you have any feedback about GitHub Copilot CLI, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml).

## Next step

- [Using GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#using-copilot-cli)
- [Migrate Java apps to Azure using GitHub Copilot app modernization in Copilot CLI Custom Agent](migrate-github-copilot-app-modernization-for-java-copilot-cli-custom-agent.md)

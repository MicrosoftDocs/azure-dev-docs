---
title: "Optimize Chat Results for Migrating Java Apps to Azure"
titleSuffix: GitHub Copilot app modernization - Azure
description: Shows you how to optimize chat results by using the AppModernization custom agent for migrating Java applications to Azure.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: how-to
ms.date: 01/21/2026
ms.custom: devx-track-java
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ai-usage: ai-generated
---

# Optimize chat results for migrating Java apps to Azure

This quickstart shows you how to optimize chat results by using the AppModernization custom agent to migrate Java applications to Azure. The AppModernization custom agent is optimized for application modernization tasks and enables you to use simple, natural language prompts to perform complex migration scenarios.

## Prerequisites

[!INCLUDE [prerequisites](includes/migrate-github-copilot-app-modernization-for-java-quickstart-prerequisites.md)]

## Select the AppModernization custom agent

The AppModernization custom agent provides the best experience for Java application migration and modernization tasks. Use the following steps to select it:

1. Open Visual Studio Code and ensure you have the GitHub Copilot app modernization extension installed.

1. Open the Copilot chat window by selecting the chat icon in the **Activity Bar**.

1. In the chat window, locate the agent selector dropdown menu at the top of the chat input box and select **AppModernization** from the list. This custom agent is designed for Java application modernization and migration scenarios.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/agent-selector.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/agent-selector.png" alt-text="Screenshot of Visual Studio Code that shows the agent selector dropdown in the chat window.":::

> [!NOTE]
> Although you can select different language models in the chat window, Claude Sonnet 4.5 is the tested and recommended model for best results with Java application modernization tasks.

> [!IMPORTANT]
> The AppModernization custom agent is currently available only for Visual Studio Code.

## Use simple prompts for migration

With the AppModernization agent selected, use simple, natural language prompts to perform migration tasks. The agent understands migration context and can handle complex scenarios with minimal input.

### Example: Migrate from RabbitMQ to Azure Service Bus

1. Make sure you have a Java project open in Visual Studio Code that uses RabbitMQ.

1. In the Copilot chat window with the AppModernization agent selected, enter the following prompt:

   ```
   migrate from rabbitmq to Azure service bus
   ```

1. The agent analyzes your code, creates a migration plan, makes code changes, runs validations, and generates a summary. Select **Continue** to proceed through each step and **Keep** to accept the changes.

### Other migration scenarios

The AppModernization agent supports various migration scenarios with simple prompts. Here are more examples:

- **Database migration**:

  ```
  migrate from Oracle to Azure PostgreSQL
  ```

- **Authentication migration**:

  ```
  migrate to Managed Identity for Azure SQL Database
  ```

- **Storage migration**:

  ```
  migrate from AWS S3 to Azure Storage Blob
  ```

- **Messaging migration**:

  ```
  migrate from ActiveMQ to Azure Service Bus
  ```

- **Secret management**:

  ```
  migrate secrets to Azure Key Vault
  ```

## Next steps

- [Quickstart: assess and migrate a Java project](migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate.md)
- [Quickstart: create and apply your own tasks](migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task.md)
- [Predefined tasks for GitHub Copilot app modernization](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md)

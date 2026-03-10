---
title: "Quickstart: Create and Apply Your Own Skill"
titleSuffix: GitHub Copilot modernization - Azure
description: Shows you how to create and apply your own custom skill.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: quickstart
ms.date: 03/11/2026
ms.custom: devx-track-java
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Quickstart: create and apply your own skills for GitHub Copilot modernization

This quickstart shows you how to create and apply your own custom skills when you use GitHub Copilot modernization.

GitHub Copilot modernization supports custom skills to codify your organizational knowledge for custom library upgrade, configuration updates, enforcing coding standards and more. You may also copy the out-of-box Microsoft tasks into custom skills to adjust them to your needs. Custom skills can be reused, shared and improved to boost the efficiency of your team.

> [!NOTE]
> If you previously used custom tasks (stored in `.github/appmod/custom-tasks/` of the project or VS Code user data), the extension automatically migrates them to the new `.github/skills/` location of the project on first load.

## Prerequisites

[!INCLUDE [prerequisites](includes/migrate-github-copilot-app-modernization-for-java-quickstart-prerequisites.md)]

## Create your own skill

Use the following steps to create a custom skill.

### Define skill information

1. In the **Activity** sidebar, open the **GitHub Copilot modernization** extension pane, hover over the **TASKS** section, and then select **Create a Custom Skill**.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/create-custom-skill.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/create-custom-skill.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot modernization with the Create a Custom Skill button highlighted.":::

1. A `SKILL.md` file opens. Fill in the following fields. For the full skill format specification, see the [Agent Skills specification](https://agentskills.io/specification).

   - **Skill Name**: A descriptive, hyphenated identifier for the skill. For example, "Custom-skill-migrate-rabbitmq".
   - **Skill Description**: A concise summary of the skill's purpose. For example, "Migrate RabbitMQ messaging to Azure Service Bus for Spring Boot applications".
   - **Skill Content**: Detailed instructions that guide Copilot during code migration. You can reference files from the **Resources** section by name in this field. For example, "You are a Spring Boot developer assistant, follow `guide.md` to migrate from RabbitMQ to Azure Service Bus."

### Add resources

Resources provide reference knowledge that Copilot uses when it applies the skill. Select **Add Resources** and choose a resource type:

- **Files**: Select individual files that contain migration instructions, configuration examples, or other reference material. To include a Git commit diff as a resource, select the corresponding diff file.

- **Folders**: Select a folder to include all files within it as resources. This option is useful when reference knowledge spans multiple related files.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/custom-skill-add-resources.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/custom-skill-add-resources.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot modernization custom skill with the Add Resources button highlighted.":::

The selected files are copied to `.github/skills/<skill-name>/` in your project. Resource files and folders are stored alongside `SKILL.md` in the skill folder. The total resource size is limited. Be sure to reference these files or folders by name in the **Skill Content** field so that Copilot knows when to use them.

### Save the skill

After you complete all fields and add resources, select **Save**. The custom skill appears in the **My Skills** section.

## Share your own skill

Share a skill with others by copying its folder from your project:

1. Copy the skill folder located under `.github/skills/` and share it with the intended recipient.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/custom-skill-share.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/custom-skill-share.png" alt-text="Screenshot of Visual Studio Code that shows copy a skill folder.":::

1. On the recipient's side, place the folder under `.github/skills/` in their project root. Create the directory if it doesn't exist.

1. Select **Refresh** in the extension pane. The skill appears in the **My Skills** section, ready to use.

## Apply your own skill

Use the following steps to apply your own skill:

1. Select **Run** at the bottom of the `SKILL.md` file, or find the skill in the **My Skills** section and select **Run Skill**.

1. The Copilot chat window opens in Agent Mode and automatically performs the following steps:

   1. Creates **plan.md** and **progress.md**.
   1. Checks the version control status and checks out a new migration branch.
   1. Performs code migration.
   1. Runs validations and fixes for build, unit tests, CVE, consistency check and completeness check.
   1. Generates a **summary.md** file.

1. If the agent pauses for confirmation or is interrupted, enter **Continue** to proceed.

1. After all steps finish, review the code changes and select **Keep** in the chat window to confirm.

## Copy to My Skills

If you want to customize a Microsoft task, you can export it to **My Skills** as a starting point and then modify it to fit your needs:

1. In the **TASKS** section, locate the Microsoft task that you want to customize.

1. Right-click the item and select **Copy to My Skills**.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/custom-skill-copy.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/custom-skill-copy.png" alt-text="Screenshot of Visual Studio Code that shows Copy a Microsoft task to My Skills.":::

1. A new `SKILL.md` file opens, prefilled with the content from the selected item. Edit the **Skill Name**, **Description**, **Content**, and **Resources** fields as needed.

1. Select **Save**. The skill appears in the **My Skills** section.

## Update or delete your own skill

In the **My Skills** section, right-click the skill you want to modify and choose one of the following options:

- **Edit** to update the skill.
- **Delete** to remove the skill.

## Frequently asked questions

### If I manually place a skill folder in `.github/skills/`, does the extension recognize it?

Yes. If you place a valid skill folder containing a `SKILL.md` file under `.github/skills/` in your project root, the extension recognizes it after you select **Refresh** in the extension pane. The skill appears in the **My Skills** section of the **TASKS** panel, and you can run, edit, or delete it the same way as any other custom skill.

However, only resource files that are explicitly referenced in `SKILL.md` are displayed in the extension UI. When you use the **Add Resources** button, the extension copies the selected files into the skill folder and adds a link entry in `SKILL.md` under the **Resources** section, for example:

```markdown
**Resources:**
- file:///references.txt
```

If you manually place extra files in the skill folder without adding these link entries, the extension doesn't display them. To ensure that resource files appear in the UI and are available to Copilot, always add them through the **Add Resources** button or manually add the corresponding link entries in `SKILL.md`.

## Next step

[Predefined tasks for GitHub Copilot modernization](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md)

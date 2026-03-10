---
title: "Quickstart: Deploy your project to Azure by using GitHub Copilot modernization"
description: Shows you how to deploy your migrated application to Azure by using GitHub Copilot modernization.
author: KarlErickson
ms.author: karler
ms.reviewer: honc
ms.topic: quickstart
ms.date: 03/11/2026
ai-usage: ai-assisted
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Quickstart: Deploy your project to Azure by using GitHub Copilot modernization

In this quickstart, you deploy your project to Azure by using GitHub Copilot modernization.

During development, you often need to deploy your project to a cloud environment for testing. The GitHub Copilot modernization extension automates the deployment process, deploying your migrated project to Azure and fixing any deployment errors along the way.

## Prerequisites

- A GitHub account with an active [GitHub Copilot](https://github.com/features/copilot) subscription under any plan.
- One of the following IDEs:
  - The latest version of [Visual Studio Code](https://code.visualstudio.com/) (version 1.106 or later) with the following extensions:
    - [GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview). For setup instructions, see [Set up GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/setup). Be sure to sign in to your GitHub account within Visual Studio Code.
    - [GitHub Copilot modernization](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure). Restart Visual Studio Code after installation.
  - The latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download) (version 2023.3 or later) with the following plugins:
    - [GitHub Copilot](https://plugins.jetbrains.com/plugin/17718-github-copilot) (version 1.5.59 or later). Be sure to sign in to your GitHub account within IntelliJ IDEA.
    - [GitHub Copilot modernization](https://plugins.jetbrains.com/plugin/28791-github-copilot-app-modernization). Restart IntelliJ IDEA after installation.
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Deploy your project

Use the following steps to start the deployment process:

1. In Visual Studio Code, open your migrated project.

1. In the **Activity** sidebar, open the **GitHub Copilot modernization** extension pane.

1. In the **Tasks** section, open **Deployment Tasks** and select **Deploy to Existing Azure Infrastructure**.

   If you haven't provisioned infrastructure yet, see [Quickstart: Prepare Azure infrastructure](migrate-github-copilot-app-modernization-for-java-quickstart-infrastructure.md) first.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/java-deploy-to-azure.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/java-deploy-to-azure.png" alt-text="Screenshot of Visual Studio Code that shows the Provision Infrastructure and Deploy to Azure task with the Run Task button highlighted.":::

1. After you select the task, the Copilot chat window with Agent Mode opens automatically.

1. Select **Continue** repeatedly to confirm each tool action in the Copilot Chat window. The Copilot Agent uses various tools to facilitate deployment to Azure. Each tool's usage requires confirmation by selecting **Continue**. Provide Copilot with the necessary information, like subscription and resource group, as it prompts you.

1. Copilot typically goes through the following steps to deploy your project:

   - Copilot generates a deployment plan markdown file with the deployment goal, project information, Azure resource architecture, Azure resources, and execution steps.
   - Copilot follows the execution steps in this file.
   - Copilot fixes deployment errors.
   - Copilot generates a summary file explaining the results of the deployment.

> [!NOTE]
> We recommend using Claude Sonnet 4 or later models for the best results.
>
> It might take Copilot a few iterations to correct deployment errors.

## Customize with your own prompts

The **Deploy to Existing Azure Infrastructure** button sends a predefined prompt. For more control, type a custom prompt directly in the Copilot chat with Agent Mode. This approach lets you specify deployment targets and preferences.

> [!TIP]
> Example prompts for different scenarios:
>
> - `"Deploy my app to the AKS cluster in subscription: <sub-id>, resource group: <rg-name>"`—target a specific Kubernetes cluster.
> - `"Deploy my containerized application to Azure Container Apps and configure auto-scaling with a minimum of 2 replicas"`—specify scaling preferences.


## See also

- [Quickstart: Prepare Azure infrastructure](migrate-github-copilot-app-modernization-for-java-quickstart-infrastructure.md)
- [GitHub Copilot modernization documentation](../../github-copilot-app-modernization/index.yml)

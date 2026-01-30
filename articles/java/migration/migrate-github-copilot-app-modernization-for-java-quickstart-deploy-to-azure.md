---
title: "Quickstart: deploy your project to Azure by using GitHub Copilot App Modernization"
description: Shows you how to deploy your migrated Java application to Azure.
author: KarlErickson
ms.author: karler
ms.reviewer: donji
ms.topic: quickstart
ms.date: 01/13/2026
ms.custom: devx-track-java
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Quickstart: deploy your Java project to Azure by using GitHub Copilot app modernization

In this Quickstart, you deploy your Java project to Azure by using GitHub Copilot app modernization.

In code development, developers often need to deploy their project to a cloud environment for testing. Our tools help deploy your migrated project to Azure and fix any deployment errors in the process.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
[!INCLUDE [prerequisites](includes/migrate-github-copilot-app-modernization-for-java-quickstart-prerequisites.md)]

## Deploy your project

Use the following steps to start your deployment process:

1. In Visual Studio Code, open your migrated project.

1. In the **Activity** sidebar, open the **GitHub Copilot app modernization** extension pane.

1. In the **Tasks** section, open **Java**, then open **Deployment Tasks** and select **Deploy to Existing Azure Infrastructure** or **Provision Infrastructure and Deploy to Azure**.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/java-deploy-to-azure.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/java-deploy-to-azure.png" alt-text="Screenshot of Visual Studio Code that shows the Provision Infrastructure and Deploy to Azure task with the Run Task button highlighted.":::

1. If you choose **Deploy to Existing Azure Infrastructure**, Copilot asks you for your existing resource group during the deployment process. It analyzes your resource group and deploys to the corresponding resources.

1. If you choose **Provision Infrastructure and Deploy to Azure**, Copilot provisions new Azure resources and deploys your project.

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

## See also

To learn more about GitHub Copilot app modernization, see [GitHub Copilot app modernization documentation](../../github-copilot-app-modernization/index.yml).

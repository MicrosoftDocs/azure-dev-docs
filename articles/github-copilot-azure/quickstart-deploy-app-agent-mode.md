---
title: Quickstart - Deploy Your Application to Azure with Agent Mode in GitHub Copilot for Azure
description: This article demonstrates how to use agent mode in GitHub Copilot for the Azure to deploy an application to Azure.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: quickstart
ms.date: 12/19/2025
ms.collection: ce-skilling-ai-copilot
---

# Quickstart: Deploy your application to Azure with agent mode in GitHub Copilot for Azure

In this quickstart, you learn how to use agent mode in GitHub Copilot for Azure to bring your existing application to Azure. It demonstrates how agent mode helps you define Azure infrastructure, deploy your application to Azure, and create a CI/CD pipeline.

## Prerequisites

For complete setup instructions, see the [Get started](get-started.md) article. Make sure that you have the following items:

[!INCLUDE [ghcpa-prerequisites](includes/prerequisites.md)]

## Define Azure infrastructure for your application

In this section, use GitHub Copilot agent mode to create [Bicep deployment files](/azure/azure-resource-manager/bicep/overview) and an [azd template](../azure-developer-cli/overview.md) for the application.

1. Open your existing application in Visual Studio Code.

   If you want to follow along with this tutorial, you can clone the following repo from GitHub to your local computer:

   ```bash
   git clone https://github.com/Azure-Samples/storage-blob-upload-from-webapp.git
   ```
   
1. In Visual Studio Code, on the Title Bar, select the **Open Chat** icon (the GitHub Copilot logo) to open the chat pane in the Secondary side bar. To start a new chat session, select the plus icon (**+**) on the pane's title bar. Then select **Agent** under the chat text box.

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/ask-copilot.png" alt-text="Screenshot that shows the GitHub Copilot chat pane.":::

1. In the chat text box at the bottom of the pane, type the following prompt. Then select **Send** (paper airplane icon) or select Enter on your keyboard.

   ```prompt
   Help me deploy my project to Azure
   ```

   > [!IMPORTANT]
   > Each time GitHub Copilot for Azure answers the prompt the response's wording and potentially its approach is different due to how large language models (LLMs) generate responses and its approach. It's possible your experience might vary from this article. Take the time to read GitHub Copilot's responses and choose the correct course of action. If you're unsure how to proceed, ask GitHub Copilot what it intends to do and why.

In general, Copilot agent analyzes your project and generates the necessary deployment files. 

Copilot agent uses command line tools like `azd` to perform many tasks, including a predeployment check, dependency checks, and ultimately the deployment itself using the `azd up` command. The `azd up` command runs in Visual Studio Code's terminal and prompts you for input like an environment name, a resource group, and more.

If you followed the instructions in this document, you might encounter an error with .NET version; Copilot picks it up and generates a fix for it.

If any errors were encountered during the deployment process, Copilot agent mode can also fix the errors and redeploy the application. Be sure to read the conversation closely and respond appropriately. You can nudge, suggest, and direct Copilot to try different approaches.

## Tips

- Use Claude Sonnet 4.5 for better results.
- Make sure the following GitHub Copilot for Azure tools are selected in the GitHub Copilot tools list:
  - **Recommend Azure service configuration**
  - **Check Azure pre-deploy settings**
  - **Run AZD Up to deploy to Azure**
  - **Check app status for Azure azd deployment**
  - **Configure Azure deployment pipeline**
  - **Check Azure region availability**
  - **Check Azure quota availability**

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/azure-tools.png" alt-text="Screenshot of the selected GitHub Copilot for Azure tools.":::

   To view a list of tools that are available to your prompts, select the **Select tools...** button in the chat text box.

## Related content

- [What is GitHub Copilot for Azure?](introduction.md)
- [Get started with GitHub Copilot for Azure](get-started.md)
- [Video - GitHub Copilot App Modernization for Java - Automated Deployment to Azure](https://www.youtube.com/watch?v=469QHVDJiIk)

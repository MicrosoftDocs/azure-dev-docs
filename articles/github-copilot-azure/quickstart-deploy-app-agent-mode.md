---
title: Quickstart - Deploy Your Application to Azure with Agent Mode in GitHub Copilot for Azure Preview
description: This article demonstrates how to use agent mode in GitHub Copilot for the Azure Preview to deploy an application to Azure.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: quickstart
ms.date: 05/22/2025
ms.collection: ce-skilling-ai-copilot
---

# Quickstart: Deploy your application to Azure with agent mode in GitHub Copilot for Azure Preview

In this quickstart, you learn how to use agent mode in GitHub Copilot for Azure Preview to bring your existing application to Azure. It demonstrates how agent mode helps you define Azure infrastructure, deploy your application to Azure, and create a CI/CD pipeline.

GitHub Copilot for Azure supports two modes:

- **Ask mode** allows you to learn about your deployed Azure resources and about Azure in general using the latest information published to Microsoft Learn. It may provide instructions or even source code, but you'll take action or edit files yourself.
- **Agent mode** allows you to command GitHub Copilot to take action in your project, including creating and editing files, executing commands in the terminal window, and so on.

## Prerequisites

For complete setup instructions, see the [Get started](get-started.md) article. Make sure that you have the following items:

[!INCLUDE [ghcpa-prerequisites](includes/prerequisites.md)]

## Define Azure infrastructure for your application

In this section, use GitHub Copilot agent mode to create [Bicep deployment files](/azure/azure-resource-manager/bicep/overview) and an [AZD template](../azure-developer-cli/overview.md) for the application.

1. Open your existing application in Visual Studio Code.

   If you want to follow along with this tutorial, you can clone the following repo from GitHub to your local computer:

   ```bash
   git clone https://github.com/Azure-Samples/storage-blob-upload-from-webapp.git
   ```
   
1. In Visual Studio Code, on the Title Bar, select the **Open Chat** icon (the GitHub Copilot logo) to open the chat pane in the Secondary side bar. Select **Agent** under the chat text box.

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/ask-copilot.png" alt-text="Screenshot that shows the GitHub Copilot chat pane.":::

   To start a new chat session, select the plus icon (**+**) on the pane's title bar.

1. In the chat text box at the bottom of the pane, type the following prompt. Then select **Send** (paper airplane icon) or select Enter on your keyboard.

   ```prompt
   Help me deploy my project to Azure
   ```

   Copilot Agent analyzes our project, recommend Azure services, and generate Bicep files. You might see a response like the following example. 

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/recommend-resources.png" alt-text="Screenshot of the GitHub Copilot chat pane evaluating your project to recommend resources.":::

   > [!IMPORTANT]
   > The exact wording of the response is different each time GitHub Copilot for Azure answers, due to how large language models generate responses.

   Select **Continue** and Copilot Agent finishes analyzing our project and starts to generate the necessary files. You might see a response like the following example. 

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/generate-bicep.png" alt-text="Screenshot of the GitHub Copilot chat pane creating a directory for the bicep files.":::


   Select **Continue** and Copilot will generate the necessary files for deployment. You might see a few files generated in the project and a response like the following example. 

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/generate-bicep-files.png" alt-text="Screenshot of the GitHub Copilot chat pane generating the bicep files.":::

### Deploy your application

1. With the Bicep deployment files generated, now we can deploy our application. Continuing with the flow above, Copilot agent wants to run a pre-deployment check. 

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/pre-deployment-check.png" alt-text="Screenshot of the GitHub Copilot chat pane checking files and local environment to ensure they're ready for azd up.":::


1. Select **Continue** and Copilot agent checks if our app is ready to deploy with AZD. If there’s an issue, Copilot agent will fix it and check again, like in the following example. 

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/pre-deployment-issues.png" alt-text="Screenshot of the GitHub Copilot chat pane checking files fixing issues before running azd up.":::

1. Once the pre-deployment check passes, Copilot agent continues with the deployment process. It checks for a few dependencies first. You might see a response like the following example. 

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/deployment-dependencies.png" alt-text="Screenshot of the GitHub Copilot chat pane checking dependencies before running azd up.":::


1. Select **Continue** for each dependency check. Copilot agent asks if we want to proceed with deployment. You might see a response like the following example. 
 
   :::image type="content" source="media/quickstart-deploy-app-agent-mode/deployment-proceed.png" alt-text="Screenshot of the GitHub Copilot chat pane asks if it should proceed with deployment.":::


1. Select **Continue**. Copilot agent should open the terminal on run `azd up` on your behalf. Follow the required steps in the terminal. 

   You might encounter an error with .NET version; Copilot picks it up and generates a fix for it. You might see a response like the following example. 

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/upgrade-dotnet.png" alt-text="Screenshot of the GitHub Copilot chat pane informing about the need to upgrade to .NET 8.":::
   

1. Select **Continue**. Copilot agent deploys our app successfully. You might see a response like the following example. 

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/upgrade-dotnet.png" alt-text="Screenshot of the GitHub Copilot chat pane informing about deployment success and next steps.":::


1. If any errors were encountered during the deployment process, Copilot agent mode can also fix the errors and redeploy the application.

## Tips

- Use Claude 3.5 Sonnet or Claude 3.7 Sonnet for better results.
- Make sure the following GitHub Copilot for Azure tools are selected in the GitHub Copilot tools list:
  - **@azure recommend service config**
  - **@azure check pre-deploy**
  - **@azure AZD Up (Deploy)**
  - **@azure check app status for azd deployment**
  - **@azure config deployment pipeline**
  - **@azure check region availability**
  - **@azure check quota availability**

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/azure-tools.png" alt-text="Screenshot of the selected GitHub Copilot for Azure tools.":::

   To view a list of tools that are available to your prompts, select the **Select tools...** button in the chat text box.

## Related content

- [What is GitHub Copilot for Azure Preview?](introduction.md)
- [Get started with GitHub Copilot for Azure Preview](get-started.md)
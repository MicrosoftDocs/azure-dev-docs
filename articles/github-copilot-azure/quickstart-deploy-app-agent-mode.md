---
title: Quickstart - Deploy Your Application to Azure with Agent Mode in GitHub Copilot for Azure Preview
description: This article demonstrates how to use agent mode in GitHub Copilot for the Azure Preview to deploy an application to Azure.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: quickstart
ms.date: 05/09/2025
ms.collection: ce-skilling-ai-copilot
---

# Quickstart: Deploy your application to Azure with agent mode in GitHub Copilot for Azure Preview

In this quickstart, you learn how to use agent mode in GitHub Copilot for Azure Preview to bring your existing application to Azure. It demonstrates how agent mode helps you define Azure infrastructure, deploy your application to Azure, and create a CI/CD pipeline.

## Prerequisites

For complete setup instructions, see the [Get started](get-started.md) article. Make sure that you have the following items:

- A GitHub Copilot account.
- The GitHub Copilot extension and the GitHub Copilot Chat extension for Visual Studio Code.
- The GitHub Copilot for Azure Preview extension for Visual Studio Code.
- An Azure subscription. If you don't have one, GitHub Copilot for Azure can help.

## Define Azure infrastructure for your application

In this section, use GitHub Copilot agent mode to create [Bicep deployment files](/azure/azure-resource-manager/bicep/overview) and an [AZD template](../azure-developer-cli/overview.md) for the application.

1. Open your existing application in Visual Studio Code.

   If you want to follow along with this tutorial, you can clone the following repo from GitHub to your local computer:

   ```bash
   git clone https://github.com/Azure-Samples/todo-nodejs-mongo-aca.git
   ```

1. In Visual Studio Code, on the Title Bar, select the **Open Chat** icon (the GitHub Copilot logo) to open the chat pane in the Secondary side bar. Select **Agent** under the chat text box.

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/ask-copilot.png" alt-text="Screenshot that shows the GitHub Copilot chat pane.":::

   To start a new chat session, select the plus icon (**+**) on the pane's title bar.

1. In the chat text box at the bottom of the pane, type the following prompt. Then select **Send** (paper airplane icon) or select Enter on your keyboard.

   ```prompt
   Help me deploy my project to Azure
   ```

   Copilot agent mode provides a list of steps we need to follow to deploy the app and starts executing these steps. It first analyzes the project, recommends Azure services, and generates Bicep files. You might see a response like the following example.

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/recommend-resources.png" alt-text="Screenshot that shows the GitHub Copilot chat pane with detected services, recommended resources, bindings, and environment variables.":::

1. Select **Continue**. Copilot agent mode recommends suitable Azure resources for the application. You might see a response like the following example.

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/deployment-plan.png" alt-text="Screenshot of the GitHub Copilot chat pane with a recommended deployment plan.":::
 
1. Type **Yes** in the chat text box. Copilot agent mode generates the necessary files for deployment. You might see a few files generated in the project and a response asking to proceed with the predeployment check similar to the following example.

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/generate-bicep.png" alt-text="Screenshot of the GitHub Copilot chat pane with a callout highlighting the new **infra** folder and files and the new azure.yaml file.":::

## Deploy the application

You can now deploy the application using the Bicep deployment files and the AZD template generated in the previous section.

1. At the end of the previous section, Copilot agent mode asked you whether you wanted to run a predeployment check. Enter **Yes**. You might see a response like the following example.

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/check-azd.png" alt-text="Screenshot of the GitHub Copilot chat pane asking to check if the application is ready to deploy with Azure Developer CLI (AZD).":::

1. Select **Continue**. Copilot agent mode checks if the application is ready to deploy with AZD. If there's a problem, Copilot agent mode fixes it and checks again. In this case, you might see a response similar to the following example.

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/pre-deployment-validation.png" alt-text="Screenshot of the GitHub Copilot chat pane showing the results of a predeployment validation.":::

1. After the predeployment validation successfully completes, Copilot agent mode continues with the deployment process and validates whether dependencies are installed and configured. You might see a response like the following example.

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/dependency-check.png" alt-text="Screenshot of the GitHub Copilot chat pane getting ready to validate dependencies.":::

1. Select **Continue** for each dependency check. Copilot agent mode asks if you want to proceed with deployment. You might see a response like the following example.

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/ready-deployment.png" alt-text="Screenshot of the GitHub Copilot chat pane indicating that deployment is ready.":::

1. Enter **Yes**. Copilot agent mode should open the terminal and run `azd up` on your behalf. Follow the required steps in the terminal and you might see a response like the following example.

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/deployment-successful.png" alt-text="Screenshot of the GitHub Copilot chat pane showing a successful deployment.":::

1. If any errors were encountered during the deployment process, Copilot agent mode can also fix the errors and redeploy the application.

## Tips

- Use Claude 3.5 Sonnet or Claude 3.7 Sonnet for better results.
- Make sure the following GitHub Copilot for Azure tools are selected in the GitHub Copilot tools list:
  - **@azure recommend service config**
  - **@azure check pre-deploy**
  - **@azure AZD Up (Deploy)**
  - **@azure check app status for azd deployment**

   :::image type="content" source="media/quickstart-deploy-app-agent-mode/azure-tools.png" alt-text="Screenshot of the selected GitHub Copilot for Azure tools.":::

## Related content

- [What is GitHub Copilot for Azure Preview?](introduction.md)
- [Get started with GitHub Copilot for Azure Preview](get-started.md)
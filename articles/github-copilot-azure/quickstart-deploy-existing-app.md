---
title: Quickstart - Deploy your existing project to Azure with GitHub Copilot for Azure
description: This article walks through a scenario that shows how to use GitHub Copilot for Azure to deploy an existing website. You ask Copilot to recommended Azure services and generate the necessary Bicep files to deploy the existing application to Azure using those recommendations.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: quickstart
ms.date: 5/30/2025
ms.collection: ce-skilling-ai-copilot
---

# Quickstart: Deploy your existing project to Azure with GitHub Copilot for Azure 

This quickstart guides you in using GitHub Copilot for Azure to bring your existing application to Azure. It demonstrates how GitHub Copilot for Azure helps you create Azure infrastructure with Bicep and deploy your application to Azure. 

GitHub Copilot for Azure supports two modes:

- **Ask mode** allows you to learn about your deployed Azure resources and about Azure in general using the latest information published to Microsoft Learn. It might provide instructions or even source code, but you take action or edit files yourself.
- **Agent mode** allows you to command GitHub Copilot to take action in your project, including creating and editing files, executing commands in the terminal window, and so on.
 
## Prerequisites 

For complete setup instructions, see the [Get started](get-started.md) article. Make sure that you have the following items: 

[!INCLUDE [ghcpa-prerequisites](includes/prerequisites.md)] 


## Create Bicep for your existing application and deploy it to Azure by using GitHub Copilot for Azure 

1. Open your existing application in Visual Studio Code.

   If you want to follow along with this tutorial, you can clone the following repo from GitHub to your local computer:

   ```bash
   git clone https://github.com/Azure-Samples/azure-sql-db-django
   ```

1. In Visual Studio Code, on the Title Bar, select the **Open Chat** icon (the GitHub Copilot logo) to open the chat pane in the Secondary side bar. 

   :::image type="content" source="media/quickstart-deploy-existing-app/ask-copilot.png" alt-text="Screenshot that shows the GitHub Copilot chat pane.":::

   To start a new chat session, select the plus icon (**+**) on the pane's title bar.

   >[!IMPORTANT]
   > If you get unexpected results, re-start using a new chat session.

1. In the chat text box at the bottom of the pane, type the following prompt after `@azure`. Then select **Send** (paper airplane icon) or select Enter on your keyboard.

   ```prompt
   @azure Please recommend Azure services for my project.
   ```

   After a moment, GitHub Copilot for Azure will recommend suitable Azure services, bindings, and environment variables based on your project. You might see a response like the following example.

   :::image type="content" source="media/quickstart-deploy-existing-app/recommend-services.png" alt-text="Screenshot that shows the GitHub Copilot chat pane with detected services, recommended resources, bindings, and environment variables.":::

   Under "Resource bindings", you can see a table with "Default Key" and "Custom key". GitHub Copilot for Azure	uses "Default Key" as necessary environment variable by default to make the bindings work. "Custom key" is the developer customized key in application code.

1. If the recommendations don’t have the support you need, you can provide information to get new recommendations. For example, you can try the following prompt:

   ```prompt
   @azure Please use Azure App Service instead of Azure Container App for my project.
   ```

   After a moment, GitHub Copilot for Azure will provide updated recommendations. You might see a response like the following example.

   :::image type="content" source="media/quickstart-deploy-existing-app/use-app-service.png" alt-text="Screenshot of the GitHub Copilot chat pane with the Azure App Service highlighted as the recommended resource.":::

 
1. Once you’re satisfied with the recommendations, select the **Generate** button and GitHub Copilot for Azure generates Bicep files and an `azure.yaml` file in your workspace.

   The generated files might look like the following example.

   :::image type="content" source="media/quickstart-deploy-existing-app/generate-bicep.png" alt-text="Screenshot that shows Visual Studio Code's Explorer view with a callout highlighting the new infra folder and files and the new azure.yaml file.":::
 
1. You can use the generated Bicep files to provision the infrastructure on Azure with your favorite tool like the Azure CLI, or you can run `azd up` in the terminal to provision infrastructure and deploy your application.

## Related content

- [Understand what GitHub Copilot for Azure is and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [designing and developing applications for Azure](design-develop-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).

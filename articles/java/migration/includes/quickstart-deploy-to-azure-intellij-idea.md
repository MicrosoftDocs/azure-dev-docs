---
ms.date: 06/02/2026
ms.collection: ce-skilling-ai-copilot
---

## Deploy your project

Use the following steps to start the deployment process:

1. Open your project in IntelliJ IDEA.

1. From the **Activity** sidebar, open the **GitHub Copilot modernization** extension pane. Under **Tasks**, open **Java/Deployment Tasks** and select one of the following tasks:

   - If you already have Azure infrastructure provisioned, select task **Deploy to Existing Azure Infrastructure** and select **Run**.

     :::image type="content" source="../media/migrate-github-copilot-app-modernization-for-java/java-deploy-to-azure-intellij-idea-provision-only.png" lightbox="../media/migrate-github-copilot-app-modernization-for-java/java-deploy-to-azure-intellij-idea-provision-only.png" alt-text="Screenshot of Intellij IDEA that shows the Deploy to existing Azure Infrastructure task with the Run Task button highlighted.":::

   - If you don't have infrastructure yet, select task **Provision Infrastructure and Deploy to Azure** and select **Run**.

     :::image type="content" source="../media/migrate-github-copilot-app-modernization-for-java/java-deploy-to-azure-intellij-idea-e2e.png" lightbox="../media/migrate-github-copilot-app-modernization-for-java/java-deploy-to-azure-intellij-idea-e2e.png" alt-text="Screenshot of Intellij IDEA that shows the Provision Infrastructure and Deploy to Azure task with the Run Task button highlighted.":::

1. After you select the button, the Copilot chat window with Agent Mode opens automatically.

     :::image type="content" source="../media/migrate-github-copilot-app-modernization-for-java/java-deploy-to-azure-chat-intellij-idea.png" lightbox="../media/migrate-github-copilot-app-modernization-for-java/java-deploy-to-azure-chat-intellij-idea.png" alt-text="Screenshot of Intellij IDEA that shows the Copilot chat window as opened automatically by the task.":::

1. In the Copilot Chat window (opens automatically in Agent Mode), select **Continue** to approve each tool action, and provide details like subscription and resource group when prompted.

1. Copilot typically goes through the following steps to deploy your project:

   - Copilot generates a deployment plan markdown file with the deployment goal, project information, Azure resource architecture, Azure resources, and execution steps.
   - Copilot follows the execution steps in this file.
   - Copilot fixes deployment errors.
   - Copilot generates a summary file explaining the results of the deployment.

> [!NOTE]
> Use Claude Opus 4.5 or later models for the best results.
>
> It might take Copilot a few iterations to correct deployment errors.

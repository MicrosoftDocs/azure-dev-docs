---
title: Quickstart - Build and deploy your application with GitHub Copilot for Azure Preview
description: This article walks through a scenario that shows how to integrate the GitHub Copilot for the Azure Preview Visual Studio Code extension into a developer's workflow.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: quickstart
ms.date: 09/03/2024
ms.collection: ce-skilling-ai-copilot
---

# Quickstart: Build and deploy your application with GitHub Copilot for Azure Preview

This quickstart guides you in using GitHub Copilot for Azure Preview to create and deploy a new website in Azure. It demonstrates one way to integrate GitHub Copilot for Azure into your development and deployment workflow.

## Prerequisites

For complete setup instructions, see the [Get started](get-started.md) article. Make sure that you have the following items:

- A GitHub Copilot account.
- The GitHub Copilot Chat extension for Visual Studio Code.
- The GitHub Copilot for Azure Preview extension for Visual Studio Code.
- An Azure subscription. If you don't have one, GitHub Copilot for Azure can help.

## Create and deploy a website by using GitHub Copilot for Azure Preview

1. Create a new folder on your local computer where you can create a local clone of a GitHub repository.

2. In Visual Studio Code, select **View** > **Terminal**. On the terminal pane, go to the new folder.

3. On the Activity Bar, select the **Chat** icon to open the chat pane.

4. Start a new chat session by selecting the plus icon (**+**) on the pane's title bar.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-ask-copilot.png" alt-text="Screenshot that shows the GitHub Copilot chat pane.":::

5. In the chat text box, type the following prompt after `@azure`. Then select **Send** (paper airplane icon) or select Enter on your keyboard.

   ```prompt
   Could you help me create and deploy a simple Flask website by using Python?
   ```

   After a moment, GitHub Copilot for Azure likely suggests an `azd` template to use.

   > [!IMPORTANT]
   > The exact wording of the response is different each time GitHub Copilot for Azure answers, due to how large language models generate responses.

   You might see a response like the following example.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-create.png" alt-text="Screenshot that shows a response from GitHub Copilot for Azure with instructions for using a template to create a website in Azure.":::

6. If the answer provides a command that begins with `azd init` in a code fence, hover over the code fence to reveal a small pop-up action menu.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-insert.png" alt-text="Screenshot that shows a pop-up menu with an option to insert a code-fenced command into the Visual Studio Code terminal.":::

   Select **Insert into Terminal** to insert the command into the terminal.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-inserted.png" alt-text="Screenshot that shows the Visual Studio Code terminal after insertion of a code-fenced command.":::

7. Before you run the `azd init` command, you might have questions about how it affects your local computer and your Azure subscription.

   Use the following prompt:

   ```prompt
   @azure Before I execute azd init, what does it do?
   ```

   You might see a response that resembles the following screenshot.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-azd-init.png" alt-text="Screenshot that shows a response from GitHub Copilot for Azure with an explanation of what the initialization command does.":::

8. Use the following prompt to learn more about the `azd` template:

   ```prompt
   @azure What resources are created with this template?
   ```

   You might see a response that resembles the following screenshot.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-resources.png" alt-text="Screenshot that shows a response from GitHub Copilot for Azure with an explanation of the resources created by the suggested template.":::

9. Ask questions about the services that the template uses with a prompt like:

   ```prompt
   @azure What is the purpose of a virtual network?
   ```

   You might see a response that resembles the following screenshot.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-vnet.png" alt-text="Screenshot that shows a response from GitHub Copilot for Azure with an explanation of what a virtual network is.":::

10. When you're satisfied, run the `azd init` command in the terminal. Answer its prompts. If you're unsure what to answer for a prompt, ask GitHub Copilot for Azure for help.

11. After the new project is initialized, use `azd up` to deploy the application to your subscription. In the terminal, run the command according to the instructions in the original prompt's reply.

    ```cmd
    azd up
    ```

12. The `azd up` command asks for information about your subscription, where to deploy the resources, and more.

    If you're uncertain how to answer, you can ask GitHub Copilot for Azure for help. For example, you might ask:

    ```prompt
    @azure azd up is asking me what location I want to deploy the website into. How should I respond?
    ```

    You might see a response that resembles the following screenshot.

    :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-location.png" alt-text="Screenshot that shows a response from GitHub Copilot for Azure with an answer that describes what the Azure locations are and how to choose one.":::

13. Continue to answer prompts from `azd up`. Ask GitHub Copilot for Azure questions as needed.

    Depending on the `azd` template that you're deploying and the location that you selected, the template might take 20 to 40 minutes (or more) to deploy.

14. If `azd up` experiences an error, ask GitHub Copilot for Azure about the error and how you can resolve it.

> [!TIP]
> For an easy way to attach the last terminal command results, use the paperclip icon at the bottom left of the chat pane. GitHub Copilot for Azure doesn't know the terminal command results unless they are copypasted or attached via the paperclip.

15. After a successful deployment, you should be able to go to the new website in a web browser. Use the Azure portal to view the resources that you created.

### Clean up resources

You can ask GitHub Copilot for Azure how to remove all of the resources that you created in the previous steps:

```prompt
@azure How do I undeploy this website?
```

You might see a response that resembles the following screenshot.

:::image type="content" source="media/quickstart-build-deploy-applications/quickstart-undeploy.png" alt-text="Screenshot that shows a response from GitHub Copilot for Azure with instructions to undeploy a website.":::

Use `azd down` to remove the website and all resources that you deployed to your Azure subscription.

## Related content

- [Understand what GitHub Copilot for Azure Preview is and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).

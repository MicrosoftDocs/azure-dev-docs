---
title: Quickstart - Build and deploy your application with GitHub Copilot for Azure Preview
description: This article walks through a scenario that demonstrates how to integrate GitHub Copilot for Azure Preview Visual Studio Code extension into a developer's workflow.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: quickstart
ms.date: 09/03/2024
ms.collection: ce-skilling-ai-copilot
---

# Quickstart: Build and deploy your application with GitHub Copilot for Azure Preview

This quickstart guides you to use GitHub Copilot for Azure Preview to help you create and deploy a new web site into Azure. It demonstrates one way to integrate GitHub Copilot for Azure into your development and deployment workflow.

## Prerequisites

See the [Get started](get-started.md) article for complete setup instructions.

- A GitHub Copilot account
- The GitHub Copilot extension for Visual Studio Code
- The GitHub Copilot for Azure Preview extension for Visual Studio Code
- An Azure subscription (if you don't have one, GitHub Copilot for Azure can help)

## Create and deploy a website using GitHub Copilot for Azure Preview

1. Create a new folder on your local computer where you can create a local clone of a GitHub repository.

2. Open Visual Studio Code. Open the Terminal window. Navigate to the new folder in Terminal. 

3. To open the Chat window, select the Chat icon in Visual Studio Code's activity bar.

4. To start a new chat session, select the plus icon + in the window's title bar.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-ask-copilot.png" alt-text="Screenshot displaying the GitHub Copilot window.":::

5. In the chat text box, enter the following prompt after `@azure` then select Send (paper airplane icon) or select Enter on your keyboard.

   ```prompt
   Could you help me create and deploy a simple Flask website using Python?
   ```

   After a moment, GitHub Copilot for Azure will likely suggest an azd template to use. 

   >[!IMPORTANT]
   > The exact wording of the response is different each time it answers due to how Large Language Models generate responses.

   You might see a response like:

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-create.png" alt-text="Screenshot displaying a response from GitHub Copilot from azure with instructions to use an azd template to create a web site in Azure.":::


6. If your answer provides you with a command that begins with `azd init` in a code fence, hover your mouse cursor over the code fence to reveal a small action popup on the right hand side.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-insert.png" alt-text="Screenshot displaying a popup menu with an option to insert the command in the code fence into Visual Studio Code's Terminal.":::

   Select `Insert into Terminal` to insert the command into the Terminal.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-inserted.png" alt-text="Screenshot displaying Visual Studio Code's Terminal after the code fenced command is inserted.":::


7. Before executing the `azd init` command, you might have questions about how `azd init` affects your local computer and  your Azure subscription.

   Use the following prompt:

   ```prompt
   @azure Before I execute azd init, what does it do?
   ```

   You might see a response that resembles the following screenshot.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-azd-init.png" alt-text="Screenshot displaying a response from GitHub Copilot from azure with an explanation of what azd init does.":::

8. Use the following prompt to learn more about the azd template:

   ```prompt
   @azure What resources are created with this template?
   ```

   You might see a response that resembles the following screenshot.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-resources.png" alt-text="Screenshot displaying a response from GitHub Copilot from azure with an explanation of the resources created by the suggested azd template.":::


9. Ask questions about the services used by the template with a prompt like:

   ```prompt
   @azure What is the purpose of a VNet?
   ```

   You might see a response that resembles the following screenshot.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-vnet.png" alt-text="Screenshot displaying a response from GitHub Copilot from azure with an explanation of what is a VNet.":::

10. When you're satisfied, execute the `azd init` command in the Terminal. Answer its prompts. If you're unsure what to answer for a given prompt, ask GitHub Copilot for Azure for help.

11. Once the new project is initialized, use `azd up` to deploy the application to your subscription. In the Terminal prompt execute per the instructions in the original prompt's reply:

    ```cmd
    azd up
    ```

12. `azd up` asks for information about your subscription, where to deploy the resources, and more. 

    If you're uncertain how to answer, you can ask GitHub Copilot for Azure how to  For example, you might ask:

    ```prompt
    @azure azd up is asking me what location I want to deploy the website into. How should I respond?
    ```

    You might see a response that resembles the following screenshot.

    :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-location.png" alt-text="Screenshot displaying a response from GitHub Copilot from azure with an answer that describes what Azure locations are and how to choose one.":::

13. Continue to answer prompts from `azd up` asking GitHub Copilot for Azure questions as needed.

    Depending on the azd template you're deploying and the location you selected, it might take 20-40 minutes or more to deploy. 

14. If `azd up` experiences errors, ask GitHub Copilot for Azure about the error and how you can resolve it.

15. Upon a successful deployment, you should be able to navigate a web browser to the new website, use the Azure portal to view the resources that were created.

### Clean up resources

You can ask GitHub Copilot for Azure how to remove all of the resources you created in the previous steps.

   ```prompt
   @azure How do I undeploy this web site?
   ```

You might see a response that resembles the following screenshot.

   :::image type="content" source="media/quickstart-build-deploy-applications/quickstart-undeploy.png" alt-text="Screenshot displaying a response from GitHub Copilot from azure with instructions to undeploy the web site using azd down.":::

Use `azd down` to remove the website and all resources that were deployed to your Azure subscription.

## Related content

- [Understand what is GitHub Copilot for Azure Preview and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).

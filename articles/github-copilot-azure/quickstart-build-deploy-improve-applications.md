---
title: Quickstart - Build, deploy and improve your application with GitHub Copilot for Azure
description: This article walks through a scenario that demonstrates how to integrate GitHub Copilot for Azure Visual Studio Code extension into a developer's workflow.
keywords: github, copilot, ai, azure
ms.service: azure
ms.topic: overview
ms.date: 09/03/2024
ms.custom: overview
---

# Quickstart: Build, deploy and improve your application with GitHub Copilot for Azure

In this quick start you will use GitHub Copilot for Azure to help you create and deploy a new web site into Azure. This will demonstrate one way to integrate GitHub Copilot for Azure into your development and deployment workflow.

## Pre-requisites

See the [Get started](get-started.md) article for complete setup instructions.

You will need:

- a GitHub Copilot account
- the GitHub Copilot extension for Visual Studio Code
- the GitHub Copilot for Azure extension add on
- an Azure Subscription

## Create and deploy a website using GitHub Copilot for Azure

1. Open Visual Studio Code. Open the Terminal window. Create and navigate to a new folder on your local computer.

2. Open the Chat window by selecting the Chat icon in Visual Studio Code's activity bar. This opens the Chat window.

3. Start a new chat session by select the plus icon + in the window's title bar to create a New Chat.

![Screenshot displaying the GitHub Copilot window.](media/quickstart-ask-copilot.png)

4. In the chat text box, enter the following prompt after `@azure` and select the Send icon or select Enter on your keyboard.

```prompt example
Could you help me create and deploy a simple Flask website using Python?
```

After a moment, GitHub Copilot for Azure will likely suggest an azd template to use. The exact wording you see in your response will likely be different each time someone asks this prompt due to how Large Language Models generate responses.

You might see a response like:

![Screenshot displaying a response from GitHub Copilot from azure with instructions to use an azd template to create a web site in Azure.](media/quickstart-create.png)


4. If your answer provides you with a command that begins with `azd init` in a code fence, hover your mouse cursor over the code fence to reveal a small action popup on the right hand side.

![Screenshot displaying a popup menu with an option to insert the command in the code fence into Visual Studio Code's Terminal.](media/quickstart-insert.png)

Select `Insert into Terminal`. The command will be inserted into the Terminal.

![Screenshot displaying Visual Studio Code's Terminal after the code fenced command is inserted.](media/quickstart-inserted.png)

5. Before executing the `azd init` command, you may have questions about what this will do to your local computer and to your Azure subscription.

Use the following prompt:

```prompt example
Before I execute azd init, what does it do?
```
You may see a response that resembles the following screenshot.

![Screenshot displaying a response from GitHub Copilot from azure with an explanation of what azd init does.](media/quickstart-azd-init.png)


6. Use the following prompt to learn more about the azd template:

```prompt example
What resources are created with this template?
```
You may see a response that resembles the following screenshot.

![Screenshot displaying a response from GitHub Copilot from azure with an explanation of the resources created by the suggested azd template.](media/quickstart-resources.png)

7. Ask questions about the services that will be used with a prompt like:

```prompt example
What is the purpose of a VNet?
```
You may see a response that resembles the following screenshot.

![Screenshot displaying a response from GitHub Copilot from azure with an explanation of what is a VNet.](media/quickstart-location.png)

8. When you're satisfied, execute the `azd init` command in the Terminal. Answer its prompts. If you are unsure what to answer for a given prompt, ask GitHub Copilot for Azure for help.


9. Once the new project has been initialized, you can use `azd up` to deploy the application to your subscription.

10. You may be prompted for information you don't know the answer to. For example, you might ask:

```prompt example
azd up is asking me what location I want to deploy the website into. How should I respond?
```

You may see a response that resembles the following screenshot.

![Screenshot displaying a response from GitHub Copilot from azure with an answer that describes what Azure locations are and how to choose one.](media/quickstart-location.png)

11. Continue to answer prompts from `azd up` asking GitHub Copilot for Azure questions as needed.

Depending on the azd template you are deploying and where you're doing it to, it might take 20 minutes or more to deploy. 

12. If `azd up` experiences errors, ask GitHub Copilot for Azure about the error and how you can resolve it.

13. Upon a successful deployment, you should be able to navitate a web browser to the new website, use the Azure portal to view the resources

### Cleaning up resources

14. You can ask GitHub Copilot for Azure how to remove all of the resources you created in the previous steps.

```prompt example
How do I undeploy this web site?
```

You may see a response that resembles the following screenshot.

![Screenshot displaying a response from GitHub Copilot from azure with instructions to undeploy the web site using azd down.](media/quickstart-undeploy.png)

Use `azd down` to remove the website and all resources that were deployed to your Azure subscription.

## Next steps

- [Understand what is GitHub Copilot for Azure and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by ensuring you have satisfied the pre-requisites, installed the software and write your first prompt.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription and resources](learn-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).


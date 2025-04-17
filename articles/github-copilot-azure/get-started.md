---
title: Get started with GitHub Copilot for Azure Preview
description: This article describes the requirements and installation procedure for the GitHub Copilot for Azure Preview Visual Studio Code extension.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: get-started
ms.date: 11/18/2024
ms.collection: ce-skilling-ai-copilot
---

# Get started with GitHub Copilot for Azure Preview

Get started with GitHub Copilot for Azure Preview to streamline your development workflow and enhance your productivity on the Azure platform. This guide walks you through the prerequisites and installation of the GitHub Copilot for Azure extension in Visual Studio Code, so you can write your first prompt.

## Prerequisites

To complete the steps in this article, make sure that you have:

- An Azure account and access to an Azure subscription. For details on how to set them up, see the [pricing page for Azure accounts](https://azure.microsoft.com/pricing/purchase-options/azure-account).

- A GitHub account and a GitHub Copilot subscription. For details on how to set them up, see [Creating an account on GitHub](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) and [Quickstart for GitHub Copilot](https://docs.github.com/en/copilot/quickstart), respectively.

- Visual Studio Code. For details on how to download and install it, see [Setting up Visual Studio Code](https://code.visualstudio.com/docs/setup/setup-overview).

- The GitHub Copilot extension and the GitHub Copilot Chat extension. For instructions on how to install these extensions, see [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup) and [Getting started with GitHub Copilot Chat in VS Code](https://code.visualstudio.com/docs/copilot/getting-started-chat), respectively.


>[!IMPORTANT]
>GitHub Copilot is not included in Visual Studio Subscriptions and is a separate subscription managed by GitHub. For questions regarding GitHub Copilot subscriptions and Support, see [Individual Subscriptions](https://docs.github.com/en/billing/managing-billing-for-github-copilot/managing-your-github-copilot-individual-subscription) or [Business subscriptions](https://docs.github.com/en/billing/managing-billing-for-github-copilot/managing-your-github-copilot-business-subscription).

## Install GitHub Copilot for Azure Preview

1. In Visual Studio Code, select the **Extensions** icon.
1. In the Extensions Marketplace, search for **GitHub Copilot for Azure**. When the GitHub Copilot for Azure extension appears, select **Install**.
1. If you're prompted, sign in to your Azure account.

## Write your first prompt

1. Ensure that the extension is installed, that you're properly authenticated, and that the extension is working correctly.
1. On the Activity Bar, select the **Chat** icon.
1. In the chat text area at the bottom of the chat pane, enter the following prompt:

   ```prompt
   @azure Do I have any resources currently running?
   ```

The `@azure` part indicates that you want to include the Azure chat participant in the conversation. It scopes your prompt to a specific domain, namely, your Azure account.

The answer to your question depends on what's currently running in Azure in your subscription.

## Agent mode

Beginning in Visual Studio Code version 1.99, GitHub Copilot introduced [agent mode](https://code.visualstudio.com/blogs/2025/02/24/introducing-copilot-agent-mode), an agentic experience that can perform tasks across your entire Visual Studio Code workspace, making edits, executing terminal commands, and so on.

GitHub Copilot for Azure provides "tools" to GitHub copilot to enhance the agentic experience through deep integration with Azure.

### Enable agent mode

You may need to enable agent mode.

1. In Visual Studio Code, open **Settings** using the **Manage** icon (gear).

   :::image type="content" source="media/get-started/vscode-settings.png" alt-text="Screenshot that shows the VSCode settings menu by selecting the Manage button.":::


1. In the Settings' Search bar, search for `chat.agent.enabled`.
1. Check the box next to **Chat > Agent: Enabled**.

   :::image type="content" source="media/get-started/chat-agent-enabled.png" alt-text="Screenshot that shows the settings dialog with settings filtered to chat.agent.enabled.":::

### Use agent mode

There are three modes: ask (default), edit and agent. To use agent mode, you must select it in the chat pane.

1. If the Chat window is not already open, make sure it's open by either selecting the **Toggle Chat** button in the menu bar, or select the dropdown next to the **Toggle Chat** button and select **Open Chat (Ctrl+Alt+I)**.

   :::image type="content" source="media/get-started/open-chat.png" alt-text="Screenshot that shows the Toggle Chat menu open and selecting the the Open Chat menu option.":::

1. In the chat pane, in the chat prompt, select the mode dropdown and choose **Agent**.

   :::image type="content" source="media/get-started/mode-agent.png" alt-text="Screenshot that shows the pop-up menu in the Chat box with Agent selected.":::

1. The chat pane will confirm that you are currently in agent mode.

   :::image type="content" source="media/get-started/agent-mode-confirmation.png" alt-text="Screenshot that shows the chat pane confirming you are now in agent mode.":::

1. To see agent mode working, use the following prompt:

   ```
   What are your tools?
   ```

  The completion response will display a list of GitHub Copilot for Azure specific tools available to GitHub Copilot. The response provides a good overview of the kinds of functionality now available to you:

   ```
   I can assist you with various tasks using a range of tools. Here are the main tools I have available:

   1. Search and Navigation
     - Semantic search for code or documentation
     - File search using glob patterns
     - Text search (grep)
     - List directory contents
     - Read file contents
     - List code usages/references

   2. Code Editing and Analysis
     - Insert edits into files
     - Get errors in code files
     - Test search (find test files)

   3. Terminal and Git Operations
     - Run commands in terminal
     - Get terminal output
     - Get Git diffs and changed files

   4. Project Creation
     - Create new workspaces
     - Get project setup information
     - Install VS Code extensions
     - Create new Jupyter Notebooks

   5. Web and API Tools
     - Fetch webpage content
     - Get VS Code API references
  
   6. Azure Tools
     - Azure development best practices
     - Microsoft Learn documentation
     - Azure resource management
     - Azure authentication tools
     - AI model deployment and management
     - Azure Bicep schemas
     - Service configuration and deployment
     - Azure Developer CLI tools

   Would you like me to explain any specific tool in more detail or help you with a particular task?

   ```


1. The last entry, `Azure Developer CLI tools`, could be employed with the following prompt: 

   ```
   What is the az command to list all my storage accounts ordered by location?
   ```

   The completion to that prompt might generate:

   ```

   I'll help you generate the Azure CLI command to list all your storage accounts ordered by location. Let me use the Azure CLI generator tool to get the correct syntax for this command.

   To list all your storage accounts ordered by location in Azure, you can use the following Azure CLI command:

   az storage account list --query "sort_by(@, &location)"

   This command will:

   1. Retrieve all storage accounts you have access to in your Azure subscription
   2. Sort the results based on the location (Azure region) of each storage account
   3. Display the full details of each storage account in the sorted order

   If you'd prefer a more concise output focusing on specific fields, you could modify the query. For example, to show only the name and location in a table format:

   az storage account list --query "sort_by(@, &location)[].[name,location]" -o table

   Make sure you're logged into the Azure CLI before running this command. If you're not logged in yet, you can do so with az login.

   ```

### Enable and disable tools in agent mode

You may want to disable or re-enable certain tools available by GitHub Copilot for Azure.

1. Select the tool icon in the chat pane.

   :::image type="content" source="media/get-started/tool-icon.png" alt-text="Screenshot of chat pane with highlight around the tool icon.":::

1. Use the checkbox next to the list of tools to enable / disable tools (or groups of tools).

   :::image type="content" source="media/get-started/tool-list.png" alt-text="Screenshot of the list of tools in Visual Studio Code.":::


### Best practices for working in agent mode

To get better agentic results, consider the following best practices.

- **When prompted, add the `copilot-instructions.md` file to your workspace.** 

   :::image type="content" source="media/get-started/copilot-instructions.png" alt-text="Screenshot of the Visual Studio Code notification to add the copilot instructions file to the workspace.":::

- **Keep your prompts as granular as possible.** Instead of a prompt like `Generate a Python web application and deploy it to Azure`, you should break that up into a dozen or so smaller prompts each with a smaller scope of responsibility.

- **Allow GitHub Copilot to do work (instead of doing it yourself).**  Occassionally, GitHub Copilot will ask for permission to perform a task with a "Continue" button. While it is possible for you to perform that task outside of the Chat window, you should allow GitHub Copilot to perform the task instead. This allows GitHub Copilot to retain the context of the current state of its larger plan.

- **Allow GitHub Copilot to repeat itself.** Occassionally, GitHub Copilot will ask for permission to perform a task repeatedly. It does this to better understand the state of the project files and what it should do next. You should allow GitHub Copilot to repeat tasks it needs to perform.

- **Express your preferences.** If GitHub Copilot wants to perform an action and you would prefer it to take a *different* action, you can instruct it to do it your preferred way. For example, if it wants to create a folder to contain bicep files called `\.azure`, you could intervene and ask it to use a different folder with a prompt such as:

   ```
   Instead of naming the folder `.azure`, please name it `infra`
   ```


## Optional: Set your default tenant

If you have multiple [Microsoft Entra ID](/entra/fundamentals/whatis#terminology) tenants, You can set a default tenant using the following prompt:

   ```prompt
   @azure /changeTenant
   ```

Select from a list of your available tenants in the top center drop-down.

You can also set the default tenant in the extension settings:

1. In Visual Studio Code, on the Activity Bar, select **Extensions**. Then scroll down to **GitHub Copilot for Azure**.

   :::image type="content" source="media/get-started/extensions.png" alt-text="Screenshot that shows GitHub Copilot for Azure in the list of extensions in Visual Studio Code.":::

2. Select the gear icon in the corner of the extension's entry, and then select **Settings** from the pop-up menu.

   :::image type="content" source="media/get-started/settings.png" alt-text="Screenshot that shows the pop-up menu for GitHub Copilot for Azure.":::

3. On the **Settings** tab, set the Azure Resource Graph tenant to your Microsoft Entra tenant ID. You can find your Microsoft Entra tenant ID in the Azure portal.

   :::image type="content" source="media/get-started/arg-tenant.png" alt-text="Screenshot that shows the Settings tab with an option to set the Azure Resource Graph tenant.":::

## Related content

- [Understand what GitHub Copilot for Azure Preview is and how it works](introduction.md).
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [designing and developing applications for Azure](design-develop-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).

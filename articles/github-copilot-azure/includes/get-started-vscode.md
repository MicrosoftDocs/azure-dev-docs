---
author: rotabor
ms.service: github-copilot-for-azure
ms.topic: include
ms.date: 10/17/2025
---

## Prerequisites

To complete the steps in this article, make sure that you have:

[!INCLUDE [ghcpa-prerequisites](./prerequisites.md)]

By default, Copilot in Azure is available to all users in a tenant. However, Global Administrators can manage access to Copilot in Azure for their organization. Access can also be optionally granted to specific Microsoft Entra users or groups. For more information, see [Manage access to Microsoft Copilot in Azure](/azure/copilot/manage-access).

## Install GitHub Copilot for Azure

1. In Visual Studio Code, select the **Extensions** icon.
1. In the Extensions Marketplace, search for **GitHub Copilot for Azure**. When the GitHub Copilot for Azure extension appears, select **Install**.
1. If you're prompted, sign in to your Azure account.

## Write your first prompt

1. Ensure that the extension is installed, that you're properly authenticated, and that the extension is working correctly.

1. If the Chat window isn't already open, make sure it's open by either selecting the **Toggle Chat** button in the menu bar, or select the dropdown next to the **Toggle Chat** button and select **Open Chat (Ctrl+Alt+I)**.

   :::image type="content" source="../media/get-started/open-chat.png" alt-text="Screenshot that shows the Toggle Chat menu open and selecting the Open Chat menu option.":::

1. In the chat text area at the bottom of the chat pane, enter the following prompt:

   ```prompt
   Do I have any Azure resources currently running?
   ```

   The answer to your question depends on what's currently running in Azure in your subscription.

1. Next, use the following prompt:

   ```
   What are your tools?
   ```

   The completion response displays a list of GitHub Copilot for Azure specific tools available to GitHub Copilot. The response provides a good overview of the kinds of functionality now available to you:

   ```
   I'll ask the Azure development helper to recommend custom modes relevant to listing and explaining the GitHub Copilot for Azure tools in VS Code; expected outcome: a short set of recommended modes or tips to tailor the tools explanation.

   Progress update: I queried the Azure development helper to get recommended custom modes for this topic. Next, I'll list and briefly explain the tools I have available (grouped and with example prompts and common uses) so you can copy/paste or use them directly in VS Code.

   Tools I can use (concise overview)

   1. Search & navigation

      - Capabilities: semantic code/documentation search, file search with globs, text search (grep), list directory contents, read file contents, find usages/references.
      - Example prompts:
         - "Find all usages of MyService in this workspace."
         - "Search for connectionString in **/*.config files."
      - When to use: locating code, docs, or examples quickly inside your repo.

   2. Code editing & analysis
      - Capabilities: insert edits into files, create or modify files, suggest refactors, report code errors, find test files.
      - Example prompts:
         - "Add a function to validate input in src/utils.js."
         - "Refactor this function to use async/await and update its tests."
      - When to use: implementing features, fixing bugs, generating or updating code.

   3. Terminal & Git operations

      - Capabilities: run shell commands, read terminal output, show git diffs and changed files.
      - Example prompts:
         - "Run npm test and show me failing tests."
         - "Stage and commit the changes with message 'fix: update README'."
      - When to use: run builds/tests, inspect outputs, perform git workflows (if enabled).

   4. Project creation & workspace setup

      - Capabilities: create new workspaces, scaffold projects (templates), install VS Code extensions, create notebooks.
      - Example prompts:
         - "Generate a Node.js express app scaffold in a new folder."
         - "Add recommended extensions for Python development."
      - When to use: bootstrapping projects or adding project-level config.

   5. Web & API tools

      - Capabilities: fetch web pages, retrieve API docs (for example VS Code API references), gather remote content for research.
      - Example prompts:
         - "Fetch the Azure CLI docs for az storage account list."
         - "Get the VS Code extension API docs for commands."
      - When to use: look up official docs or examples during work.

   6. Azure-specific tools

      - Capabilities: Azure development best practices guidance, Microsoft Learn documentation lookup, query Azure Resource Graph (when authenticated), manage Azure auth context (change tenant, sign out), generate Azure CLI / Bicep / ARM snippets, Bicep schemas, and guidance for deploying models and services.
      - Example prompts:
         - "What are Azure best practices for deploying this function app?"
         - "@azure /changeTenant — set my default tenant to <tenant-id>"
         - "Generate a Bicep template for an App Service and a Storage Account."
      - When to use: any task that touches Azure resources, deployment, or configuration.

   7. Documentation & learning

      - Capabilities: search and extract Microsoft Learn articles, provide code samples from official docs, show relevant how-to steps.
      - Example prompts:
         - "Show official docs for configuring Key Vault access policies."
         - "Give me a short tutorial on using Azure App Configuration."
      - When to use: learn or reference official Microsoft guidance.

   How I present results

   - Short answers or step-by-step instructions.
   - Full edits (I can create or modify files if you allow the extension to act).
   - Commands and code snippets you can paste into your terminal.
   - Checks (like running tests or linters) when terminal access is allowed.

   Example: Quick copy-paste prompts you can use in the VS Code chat
   
   - "What are your tools?" — lists the tools (this reply).
   - "Find all TODO comments in this repo and open a summary."
   - "Generate an az CLI command to list storage accounts sorted by region."
   - "@azure /changeTenant" — opens tenant selection (if you need to set a default).

   Notes and privacy/permissions

   - Some capabilities (like querying your Azure resources or running commands) require you to be signed in and to enable those tools in the extension (you can enable/disable specific tools in the chat pane tool list).
   - I won't perform actions that need elevated permissions without verifying your explicit consent.

   If you'd like, I can:

   - Expand any tool section with more example prompts and exact commands.
   - Show a short step-by-step for enabling/disabling tools in the chat pane.
   - Generate a one-page cheatsheet you can paste into an internal docs file. Which would you like next?
   
   ```

   The contents of the reply may vary and can change over time as new capabilities and tools are added.

1. To test out prompts about Azure-specific tooling, try the following prompt: 

   ```
   What is the az command to list all my storage accounts ordered by location?
   ```

   The completion to that prompt might generate:

   ```

   I'll show the exact az CLI commands (sorted ascending/descending) plus a few useful output variants and a quick note about prerequisites.

   Commands

   - Sorted by location (ascending), full JSON:
      
      az storage account list --query "sort_by(@, &location)" -o json

   - Sorted by location, show only name and location in a readable table:

      az storage account list --query "sort_by(@, &location)[].[name,location]" -o table

   - Sorted by location (descending):

      az storage account list --query "reverse(sort_by(@, &location))" -o json

   - Sorted by location and include resource group and SKU in table:

      az storage account list --query "sort_by(@, &location)[].[name,resourceGroup,sku.name,location]" -o table

   Notes

   - Run az login first and ensure the correct subscription is selected (e.g., az account set -s "<subscription-id-or-name>").
   - You need permission to list storage accounts in the chosen subscription.
   - The query uses JMESPath (sort_by/reverse) to order results client-side.

   Would you like a version that groups counts by region or that queries across all subscriptions?

   ```

### Enable and disable tools in agent mode

You might want to disable or re-enable certain tools available by GitHub Copilot for Azure.

1. Select the tool icon in the chat pane.

   :::image type="content" source="../media/get-started/tool-icon.png" alt-text="Screenshot of chat pane with highlight around the Configure Tools icon.":::

1. Use the checkbox next to the list of tools to enable / disable tools (or groups of tools).

   :::image type="content" source="../media/get-started/tool-list.png" alt-text="Screenshot of the list of tools in Visual Studio Code.":::


## Set your default tenant

If you have multiple [Microsoft Entra ID](/entra/fundamentals/whatis#terminology) tenants, You can set a default tenant using the following prompt:

   ```prompt
   @azure /changeTenant
   ```

Select from a list of your available tenants in the top center drop-down.

You can also set the default tenant in the extension settings:

1. In Visual Studio Code, on the Activity Bar, select **Extensions**. Then scroll down to **GitHub Copilot for Azure**.

   :::image type="content" source="../media/get-started/extensions.png" alt-text="Screenshot that shows GitHub Copilot for Azure in the list of extensions in Visual Studio Code.":::

2. Select the gear icon in the corner of the extension's entry, and then select **Settings** from the pop-up menu.

   :::image type="content" source="../media/get-started/settings.png" alt-text="Screenshot that shows the pop-up menu for GitHub Copilot for Azure.":::

3. On the **Settings** tab, set the Azure Resource Graph tenant to your Microsoft Entra tenant ID. You can find your Microsoft Entra tenant ID in the Azure portal.

   :::image type="content" source="../media/get-started/arg-tenant.png" alt-text="Screenshot that shows the Settings tab with an option to set the Azure Resource Graph tenant.":::

## Customize instructions

GitHub Copilot for Azure has two ways to create or modify custom instructions: the instructions file and prompt files.

The **Instructions** file contains high-level guidance for GitHub Copilot that is added to the context window when sending prompts to GitHub Copilt for Azure tools and Azure MCP Server tools. The guidance in this file are intended to be global in nature, meaning, they are intended for all interactions across GitHub Copilot for Azure across all projects. This file is located in a hidden folder location and is not intended to be modified. Your changes could degrade or disable GitHub Copilot for Azure, and your changes might be overwritten with new updates to GitHub Coplit for Azure.

> [!Important]
> You should not modify this file. If you choose to modify the file, first make a backup.

**Prompt files** are the correct extensibility point for writing your long-form custom prompts. They work in a similar manner to the instructions file, automatically adding your custom instructions to the prompt's context window. You typically use a prompt file in a few scenarios:

- You want GitHub Copilot for Azure to use the same instructions across all your projects. Your organization may have a unique naming convention, or you want to always choose a specific location or resource group. You can specify that type of multi-session, multi-project information in a **User Data** location.
- You want GitHub Copilot for Azure to use custom instructions for your project each time you work on that project. You add the project-specific instructions in a **.github\prompts** location.

> [!Note]
> An alternative to the prompt files you create via Visual Studio Code's command palette, you could create a markdown file anywhere in your project and ask GitHub Copilot to read that file and take action based on the instructions. For example, you could create a project requirements documents (PRD) to describe the requirements for an entire project then ask GitHub Copilot: "Do not write any code until I authorize you to. First, read the `prd.md` file and ask me any clarifying questions you may need answers. Once I have answered all of your questions, please provide a step-by-step plan of how you'll implement my requirements. Once I have a chance to review your plan I will then authorize you to start. Do you have any questions?"

### Configure the instructions file

1. Select `Ctrl` + `shift` + `p` to open the command palette.

1. Type `Chat: Configure Instructions` and select the entry.

   :::image type="content" source="../media/get-started/configure-instructions-option.png" alt-text="Screenshot of typing in the Visual Studio Code command palette.":::

1. In the next step, select `AzureCopilotGuidelines` .

   :::image type="content" source="../media/get-started/configure-instructions-file.png" alt-text="Screenshot of the GitHub Copilot for Azure instructions file.":::

1. A new tab opens containing the instructions file.

> [!Important]
> Make a backup of the instructions file before modifying it.

### Configure prompt files

1. Select `Ctrl` + `shift` + `p` to open the command palette.

1. Type `Chat: Configure Prompt Files` and select the entry.

1. Select "+ New prompt file".

1. In the next menu, choose "User data" if you want to create a prompt file that will be used across all projects. Choose ".github\prompts" to create a prompt file that will be used in your current project.

1. The the next menu, enter a name for the prompt file.

1. A tab containing the new unsaved file will appear in the main area.

   :::image type="content" source="../media/get-started/prompt-file.png" alt-text="Screenshot of a newly created prompt file in Visual Studio Code.":::

   If you created a **User data** prompt file, the file path will be: `c:\Users\<username>\AppData\Roaming\Code\User\prompts`

   If you created a **.github\prompts** prompt file, the file path will be: `<project-root>\.github\prompts`. project requirements documents (PRD) to describe the requirements for an entire project. If you have a `.gitignore` file that excludes the `\.github` sub-directory, it will not be under source control.

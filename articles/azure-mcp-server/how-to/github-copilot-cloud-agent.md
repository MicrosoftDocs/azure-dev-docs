---
title: Connect GitHub Copilot Cloud Agent to the Azure MCP Server
description: Learn how to use the Azure MCP Server with the GitHub Copilot cloud agent.
author: rotabor
ms.author: rotabor
ms.date: 06/02/2026
ms.topic: how-to
---
# Connect GitHub Copilot cloud agent to the Azure MCP Server

This article shows you how to set up and connect the GitHub Copilot cloud agent to the Azure MCP Server. By connecting the cloud agent to the server, the agent can understand your Azure-specific files and Azure resources to make edits to your code files.

In your GitHub repository, assigning GitHub issues to the GitHub Copilot cloud agent creates a pull request with the changes to your code. If the requested changes require access to your Azure resources, the GitHub Copilot cloud agent needs to use the Azure MCP Server. Before the GitHub Copilot cloud agent can use the Azure MCP Server to make changes to your Azure-based project agentically, you need to configure the GitHub Copilot cloud agent and give it the proper permissions in Azure. You can manually configure everything, but many steps are automated by using `azd` and the `coding-agent` extension. GitHub now uses the display name "Copilot cloud agent" in the UI, but the stable extension identifier remains `azure.coding-agent`, and the CLI command remains `azd coding-agent ...`.

## Prerequisites

- An Azure account and access to an Azure subscription. For details on how to set them up, see the [pricing page for Azure accounts](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A GitHub account and a GitHub Copilot subscription. For details on how to set them up, see [Creating an account on GitHub](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) and [Quickstart for GitHub Copilot](https://docs.github.com/en/copilot/quickstart), respectively.

- An existing local clone of a GitHub repository. Since this article describes how to set up the connection between GitHub Copilot cloud agent and the Azure MCP Server, the GitHub repository should include deployment scripts to Azure, like Bicep or Terraform templates.


## Configure the GitHub repository to use the Azure MCP Server

The `azd` coding-agent extension simplifies the steps required to securely set up the connection between the GitHub Copilot cloud agent and the Azure MCP Server for your Azure subscription. First, it creates an account in your Azure subscription and assigns it a role with necessary permissions. Second, it provides a JSON snippet required to introduce the Azure MCP Server to the GitHub Copilot cloud agent.

1. If you don't already have `azd` installed, [follow the instructions](../../azure-developer-cli/install-azd.md) to install it.

1. In the terminal, navigate into the local clone of the repository you want to work with.

1. Invoke the `coding-agent` extension for `azd` by using the command `azd coding-agent config`.

1. During installation, you are asked to select your:
 
   - Azure subscription
   - GitHub repository that uses the Copilot cloud agent
   - Whether you want to create a new or existing User Managed Identity
   - An Azure location
   - An Azure resource group
   - The GitHub repository where a new branch will be created containing the generated GitHub Actions workflow setup file

   When selecting the location and resource group, you may want to use the same target location and resource group as the Azure resources in the application.

1. After a few moments, the `coding-agent` extension for `azd` creates (or uses the existing) user-assigned managed identity, assigns it a role, stores identity values in the GitHub repository environment, and creates and pushes a branch containing the generated GitHub Actions workflow setup file.

1. You will see a message in the console:

   ```console
   (!)
   (!) NOTE: Some tasks must still be completed, manually:
   (!)
   ```

   Usually there are three tasks:

   - Merge the branch containing the generated GitHub Actions workflow setup file.
   - Configure Copilot cloud agent's managed identity roles in the Azure portal. By default, the "Reader" role is assigned. However, you might want to give it other permissions based on what you want the cloud agent to do autonomously.
   - Visit the link to set up the MCP configuration. To go there manually, in GitHub go to **Settings** > **Copilot** > **Cloud agent** > **MCP configuration** and paste in the JSON snippet provided. Here's an example:

   ```json
   {
       "mcpServers": {
           "Azure": {
               "type": "local",
               "command": "npx",
               "args": [
                   "-y",
                   "@azure/mcp@latest",
                   "server",
                   "start"
               ],
               "tools": [
                   "*"
               ]
           }
       }
   }
   ```

1. Finally, you can allow the `coding-agent` extension for `azd` to open the browser so you can create the pull request to merge the branch containing the generated GitHub Actions workflow setup file.


## Create an issue in GitHub to initiate GitHub Copilot cloud agent

At this point, you successfully set up GitHub Copilot cloud agent to use the Azure MCP Server for any GitHub issues you assign to GitHub Copilot cloud agent that require an understanding of Azure deployments and resources.

For example, suppose you want to increase the memory allocated to PostgreSQL when deployed to Azure Database for PostgreSQL. You would create an issue to modify your Bicep template to use the next tier of storage available and assign it to GitHub Copilot.

> [!NOTE]
> The User Managed Identity role is set to "Reader" by default, so the changes you request should be to modify deployment scripts like Bicep or Terraform templates. Asking to directly modify existing resources in your Azure subscription isn't authorized due to the permissions of the "Reader" role.

1. In GitHub, in the repository containing your Azure-based project where you enabled the Azure MCP Server, go to Issues.

1. Select the **New Issue** button. Describe the change you want GitHub Copilot cloud agent to make in the title and description fields. Select the **Create** button.

   Borrowing from the example earlier, you might use the following text to describe your issue.

   ```text
   Title: Increase database storage
 
   Currently, when deploying to Azure via Bicep, we're creating a PostgreSQL database with 32gb of storage. I need the next tier higher -- whatever that is.
   ```

   This example issue makes a simple, clear request even if the user doesn't know exactly what they're asking for. It allows the Azure MCP Server to do research about available storage tiers for Azure Database for PostgreSQL Flexible Server and the setting in the Bicep template required to make that change.

   > [!Important]
   > Make sure to use the word "Azure" in your prompt to ensure that GitHub Copilot requests tools from the Azure MCP Server.

1. Select the "Assign to Copilot" button under **Assignees**. The "Assign Copilot to issue" dialog appears allowing you to modify the target repository, the base branch, and add an optional prompt. Select the "Assign" button.

1. Once the issue is assigned to GitHub Copilot cloud agent, you see a link to the pull request prefixed with "[WIP]" letting you know that the work is starting.

1. Select the "[WIP]" link to view the pull request.

1. In the body of the pull request, select the link to view the coding session. This shows the progress the Copilot cloud agent is making on the request, similar to the experience in Visual Studio.

1. When finished, GitHub Copilot cloud agent requests a code review. Use your normal workflow to iterate with GitHub, treating GitHub Copilot cloud agent as a coworker.

1. When you approve the changes and merge the pull request, GitHub Copilot resolves the original issue you created.

## Related content

- [GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent)

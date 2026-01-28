---
title: Connect GitHub Copilot coding agent to the Azure MCP Server
description: Learn how to use the Azure MCP Server with the GitHub Copilot coding agent.
keywords: azure mcp server, azmcp
author: rotabor
ms.author: rotabor
ms.date: 10/27/2025
ms.topic: how-to

---
# Connect GitHub Copilot coding agent to the Azure MCP Server

This article shows you how to set up and connect the GitHub Copilot coding agent to the Azure MCP Server so that the coding agent can understand your Azure-specific files and Azure resources to make edits to your code files.

In your GitHub repository, assigning GitHub issues to the GitHub Copilot coding agent creates a pull request with the changes to your code. If the requested changes require access to your Azure resources, the GitHub Copilot coding agent needs to use the Azure MCP Server. Before the GitHub Copilot coding agent can use the Azure MCP Server to make changes to your Azure-based project agentically, you need to configure the GitHub Copilot coding agent and give it the proper permissions in Azure. You could manually configure everything, however many steps are automated using `azd`, the Azure Developer CLI, and the `coding-agent` extension.

## Prerequisites

- An Azure account and access to an Azure subscription. For details on how to set them up, see the [pricing page for Azure accounts](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A GitHub account and a GitHub Copilot subscription. For details on how to set them up, see [Creating an account on GitHub](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) and [Quickstart for GitHub Copilot](https://docs.github.com/en/copilot/quickstart), respectively.

- An existing local clone of a GitHub repository. Since this article describes how to set up the connection between GitHub Copilot coding agent to the Azure MCP Server, the GitHub repository should include deployment scripts to Azure, like Bicep or Terraform templates.


## Configure the GitHub repository to use the Azure MCP Server

The `azd` coding-agent extension simplifies the steps required to securely set up the connection between the GitHub Copilot coding agent and the Azure MCP Server for your Azure subscription. First, it creates an account in your Azure subscription and assigns it a role with necessary permissions. Second, it provides a JSON snippet required to introduce the Azure MCP Server to the GitHub Copilot coding agent.

1. If you don't already have `azd` installed, [follow the instructions](../../azure-developer-cli/install-azd.md) to install it.

1. In the terminal, navigate into the local clone of the repository you want to work with.

1. Invoke the azd coding agent extension with the command: `azd coding-agent config`. 

1. During installation, you are asked to select your:
 
   - Azure subscription
   - Which GitHub repository will use the Copilot Coding agent
   - Whether you want to create a new or existing User Managed Identity
   - An Azure location
   - An Azure resource group
   - The GitHub repository where a new branch will be created containing the generated GitHub Actions workflow setup file

   When selecting the location and resource group, you may want to use the same target location and resource group as the Azure resources in the application.

1. After a few moments, the `azd` coding agent extension creates (or uses the existing) User Managed Identity and assigns it a role, stores identity values in the GitHub repository environment, and creates and pushes a branch containing the generated GitHub Actions workflow setup file.

1. You will see a message in the console:

   ```console
   (!)
   (!) NOTE: Some tasks must still be completed, manually:
   (!)
   ```

   Usually there are three tasks:

   - Merge the branch containing the generated GitHub Actions workflow setup file.
   - Configure Copilot coding agent's managed identity roles in the Azure portal. By default, the "Reader" role is assigned. However you may want to give it other permissions based on what you want the coding agent to do autonomously.
   - Visit the link to set up the MCP Configuration. To navigate there manually, in GitHub go to Settings > Copilot > coding agent > MCP Configuration and paste in the JSON snippet provided. Here's an example:

   <!-- TODO: Update this MCP configuration to the latest format based on commit 38b6769c1f88a9b3f940800097adc6e866033d55 -->

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

1. Finally, you can allow the `azd` coding agent extension to open the browser so you can create the pull request to merge the branch containing the generated GitHub Actions workflow setup file.


## Create an Issue in GitHub to initiate GitHub Copilot coding agent

At this point, you successfully set up GitHub Copilot coding agent to use the Azure MCP Server for any GitHub Issues you assign to GitHub Copilot coding agent that require an understanding of Azure deployments and resources. 

For example, suppose you want to increase the memory allocated to PostgreSQL when deployed to Azure Database for PostgreSQL. You would create an issue to modify your Bicep template to use the next tier of storage available and assign it to GitHub Copilot.

> [!NOTE]
> The User Managed Identity role is set to "Reader" by default, so the changes you request should be to modify deployment scripts like Bicep or Terraform templates. Asking to directly modify existing resources in your Azure subscription isn't authorized due to the permissions of the "Reader" role.

1. In GitHub, in the repository containing your Azure-based project where you enabled the Azure MCP Server, go to Issues.

1. Select the "New Issue" button. Describe the change you want GitHub Copilot coding agent to make in the title and description fields. Select the "Create" button.

   Borrowing from the example earlier, you might use the following text to describe your issue.

   ```text
   Title: Increase database storage
 
   Currently, when deploying to Azure via Bicep, we're creating a PostgreSQL database with 32gb of storage. I need the next tier higher -- whatever that is.
   ```

   This example issue makes a simple, clear request even if the user doesn't know exactly what they're asking for. It allows the Azure MCP Server to do research about available storage tiers for Azure Database fo PostgreSQL Flexible Server and the setting in the Bicep template required to make that change.

   > [!Important]
   > Make sure to use the word "Azure" in your prompt to ensure that GitHub Copilot requests tools from the Azure MCP Server.

1. Select the "Assign to Copilot" button under **Assignees**. The "Assign Copilot to issue" dialog appears allowing you to modify the target repository, the base branch, and add an optional prompt. Select the "Assign" button.

1. Once the issue is assigned to GitHub Copilot coding agent, you see a link to the pull request prefixed with "[WIP]" letting you know that the work is starting.

1. Select the "[WIP]" link to view the pull request.

1. In the body of the pull request, select the link to view the coding session. This shows the progress the Copilot Coding agent is making on the request, similar to the experience in Visual Studio.

1. When finished, GitHub Copilot coding agent requests a code review. Use your normal workflow to iterate with GitHub, treating GitHub Copilot coding agent as a coworker.

1. When you approve the changes and merge the pull request, GitHub Copilot resolves the original issue you created.

## Related content

- [GitHub Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent)
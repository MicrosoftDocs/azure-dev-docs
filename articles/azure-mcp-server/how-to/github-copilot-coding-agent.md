---
title: Connect GitHub Copilot Coding Agent to Azure MCP Server
description: Learn how to use the Azure MCP Server with the GitHub Copilot Coding Agent.
keywords: azure mcp server, azmcp
author: rotabor
ms.author: rotabor
ms.date: 10/23/2025
ms.topic: how-to

---
# Connect GitHub Copilot Coding Agent to Azure MCP Server

Assign GitHub issues to the GitHub Copilot Coding Agent (GCCA) and it will create a pull request with the changes to your repository. If the changes you're requesting require access to your Azure resources, GCCA will need to use the Azure MCP Server. Before GCCA can use Azure MCP Server to make changes to your Azure-based project agentically, you need to configure GCCA and give it the proper permissions in Azure. For this to work, you could manually configure everything, however many steps are automated using `azd`, the Azure Developer CLI, and the `coding-agent` extension. That's the approach used in this tutorial.

## Prerequisites

- An Azure account and access to an Azure subscription. For details on how to set them up, see the [pricing page for Azure accounts](https://azure.microsoft.com/pricing/purchase-options/azure-account).

- A GitHub account and a GitHub Copilot subscription. For details on how to set them up, see [Creating an account on GitHub](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) and [Quickstart for GitHub Copilot](https://docs.github.com/en/copilot/quickstart), respectively.

- An existing local clone of a GitHub repository. Since this article describes how to set up the connection between GitHub Copilot Coding Agent to Azure MCP Server, it is assumed that the GitHub repository 


## Configure the GitHub repository to use Azure MCP Server

The `azd` coding-agent extension simplifies the steps required to securely set up the conection between GCCA and Azure MCP Server for your Azure subscription. First, it creates a security role in your Azure subscription with the necessary permissions. Second, it provides a JSON snippet required to introduce Azure MCP Server to the GCCA.

1. If you do not already have `azd` installed, [follow the instructions](../../azure-developer-cli/install-azd.md) to install it.

1. At the command line, navigate into the local clone of the repository you want to work with.

1. Install the azd Coding Agent extension with the command: `azd coding-agent config`. 

1. During installation, you will be asked to select your:
 
   - Azure subscription
   - Which GitHub repository will use the Copilot Coding agent
   - Whether you want to create a new or existing User Managed Identity
   - An Azure location
   - An Azure resource group
   - The GitHub repository where a new branch will be created containing the generated GitHub Actions workflow setup file

   When selecting the location and resource group, you may want to use the same target location and resource group as the Azure resources in the application.

1. After a few moments, the `azd` coding agent extension creates (or uses the existing) User Managed Identity and assigns it a role, stores identity values in the copilot environment, and creates and pushes a branch containing the generated GitHub Actions workflow setup file.

1. You will see a message in the console:

   ```console
   (!)
   (!) NOTE: Some tasks must still be completed, manually:
   (!)
   ```

   Usually there are three tasks:

   - Merge the branch containing the generated GitHub Actions workflow setup file
   - Configure Copilot coding agent's managed identity roles in the Azure portal - By default, the "Reader" role is assigned, however you may want to give it other permissions based on what you want the Coding Agent to do autonomously.
   - Visit the link to set up the MCP Configuration. To navigate there manually, in GitHub go to Settings > Copilot > Coding Agent > MCP Configuration and paste in the JSON snippet provided. It will resemble:

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


## Create an Issue in GitHub to initiate GitHub Copilot Coding Agent

At this point, you have successfully set up GitHub Copilot Coding Agent to use Azure MCP Server for any GitHub Issues you assign to GitHub Copilot Coding Agent that require an understanding of Azure deployments and resources. 

For example, suppose you want to increase the memory allocated to PostgreSQL when deployed to Azure Database for PostgreSQL. You would create an issue to modify your Bicep template to use the next tier of storage available and assign it to GitHub Copilot.

> [!NOTE]
> The User Managed Identity role is set to "Reader" by default, so the changes you request should be to modify deployment scripts like Bicep or Terraform templates. Asking to modify existing resources in your Azure subscription will not be authorized due to the permissions of the "Reader" role.

1. In GitHub, in the repository containing your Azure-based project where you enabled Azure MCP Server, go to Issues.

1. Select the "New Issue" button. Describe the change you want GitHub Copilot Coding Agent to make in the title and description fields. Select the "Create" button.

   From the example earlier, you might use the following.

   ```text
   Title: Increase database storage
 
   Currently, when deploying to Azure via Bicep, we're creating a PostgreSQL database with 32gb of storage. I need the next tier higher -- whatever that is.
   ```

   This issue makes a simple, clear request even if the user doesn't know exactly what they're asking for. This allows the Azure MCP Server to do research about available storage tiers for Azure Database fo PostgreSQL Flexible Server and the setting in the Bicep template required to make that change.

   > [!Important]
   > Make sure to use the word "Azure" in your prompt to ensure that GitHub Copilot requests tools from the Azure MCP Server.

1. Select the "Assign to Copilot" button under **Assignees**. This will open a dialog "Assign Copilot to issue" that allows you to modify the target repository, the base branch, and add an optional prompt. Select the "Assign" button.

1. Once the issue is assigned to GitHub Copilot Coding Agent, after a moment you will see a link to the pull request prefixed with "[WIP]" letting you know that the work has started.

1. Click the "[WIP]" link to view the pull request.

1. In the body of the pull request, click the link to view the coding session. This shows the progress the Copilot Coding agent is making on the request, similar to the experience in Visual Studio.

1. When finished, GitHub Copilot Coding Agent will request a code review. Use your normal workflow to iterate with GitHub, treating GitHub Copilot Coding Agent as a co-worker.

1. When you sign off and merge the pull request, the original issue you created will be resolved.


## Alternative: Create an Issue from inside Visual Studio Code to initiate GitHub Copilot Coding Agent

Using the GitHub Pull Requests extension, you can create GitHub Issues and assign to GitHub Copilot directly from Visual Studio Code without visiting the GitHub web site.

1. In Visual Studio Code, install the [GitHub Pull Requests extension](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github).

1. In Visual Studio Code, in the chat pane, select the **Configure tools ...** button, and make sure the following tools are checked then select the **OK** button:
   - Built-in 
   - Azure MCP
   - GitHub Copilt for Azure
   - GitHub Pull Requests

1. More to come ...

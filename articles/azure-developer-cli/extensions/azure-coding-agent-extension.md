---
title: Quickstart - Enable Copilot Coding Agent Azure access with the azd extension
description: Install and use the Azure Developer CLI coding agent extension to configure a GitHub Copilot Coding Agent with Azure managed identity access.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 10/21/2025
ms.service: azure-dev-cli
ms.topic: quickstart
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Quickstart: Enable Copilot Coding Agent Azure access with the azd extension

Use the Azure Developer CLI (`azd`) coding agent extension (`azure.coding-agent`) to give the GitHub Copilot Coding Agent secure, scoped access to Azure through a managed identity. The extension automates identity creation, federated credential configuration, and workflow setup in your repository.

[Extensions overview](overview.md) describes how extensions add capabilities to `azd`.

## Prerequisites

1. Azure Developer CLI (`azd`) installed. See installation instructions: <https://github.com/Azure/azure-dev/blob/main/README.md#installupgrade-azure-developer-cli>.
1. An Azure subscription where you can create resource groups and managed identities.
1. A local clone of the GitHub repository you want to enable for the Copilot Coding Agent.
1. Permissions in that repository to:
   - Update the `copilot` GitHub environment.
   - Configure Copilot Coding Agent settings.
   - Push changes to the `.github/workflows` folder.
1. At least one configured git remote for the repository (required for federated credentials).

## Enable extension support

`azd` extensions are currently in alpha and must be enabled manually:

```azdeveloper
azd config set alpha.extensions on
```

## Install or upgrade the coding agent extension

1. Install for the first time:

    ```azdeveloper
    azd extension install azure.coding-agent
    ```

    Upgrade to the latest version:

    ```azdeveloper
    azd extension upgrade azure.coding-agent
    ```

1. Verify it is installed:

    ```azdeveloper
    azd extension list --installed
    ```

    You should see `azure.coding-agent` in the list.

## Use the extension to configure the Copilot Coding Agent for Azure access

Change to the local repository directory, then run the configuration command:

```azdeveloper
cd <your-local-repo-folder>
azd coding-agent config
```

During configuration the extension:

- Creates (or reuses) a resource group.
- Creates an Azure managed identity.
- Assigns the Reader role to that identity scoped to the resource group.
- Establishes federated credentials linking the GitHub repository to the managed identity.
- Adds (or updates) a `copilot-setup-steps.yml` workflow and related assets.
- Guides you to finalize GitHub environment settings for the `copilot` environment.

Follow any on-screen prompts. If additional manual steps are required (for example approving a pull request or setting a repository secret), complete them before proceeding.

### Verify setup (optional)

1. List the managed identity in the resource group (optional):

    ```azdeveloper
    az identity list --resource-group <resource-group-name>
    ```

1. In GitHub, open the **Settings** > **Environments** > **copilot** environment and confirm the federated credential entry referencing the managed identity (subject issuer should reflect GitHub).

## Configure Azure MCP Server for the Copilot coding agent

1. The `azd coding agent` extension creates a pull request for a branch with the new GitHub workflow file at `origin/azd-enable-copilot-coding-agent-with-azure`. If you want to use the Azure MCP Server connection in your main branch, you'll need to merge this PR.

    The pull request and the output logs also include a JSON configuration snippet you can use to configure Azure MCP Server for the Copilot coding agent.

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

    > [!NOTE]
    > You can also run Copilot coding agent tasks on a branch other than `main` by selecting that branch in the flyout panel.

1. To configure the Azure MCP Server, navigate to the **Settings** page of your repository.
1. Select **Copilot -> Coding agent** on the left navigation.
1. Paste the JSON snippet from the PR into the **MCP configuration** box and select **Save MCP configuration**.

## Test the Copilot Coding Agent

After configuration completes and the workflow is merged:

1. Navigate to your repository in GitHub.
1. Select the **Open agents panels** icon on the top right navigation bar.
1. In the flyout panel, make sure the correct repository is selected, and choose the branch that you used for the `azd` command.
1. Enter a prompt that specifically instructs the Copilot coding agent to use the Azure MCP Server you configured, such as:

    ```output
    Use the Azure MCP Server to list the resource groups in my subscription. Do not traverse or analyze the repository at all. Use only the Azure MCP Server.
    ```

    Press enter to run the prompt and instruct copilot coding agent to create and run a new task.

1. Select the task that appears at the bottom of the panel to navigate to the task details page.

    :::image type="content" source="../media/extensions/create-copilot-coding-agent-task.png" alt-text="A screenshot showing how to create a new task for Copilot coding agent.":::

1. Scan through the output from Copilot coding agent to see your changes at work. You should see copilot start the Azure MCP Server and call various tools to gather information about your Azure resources.

    :::image type="content" source="../media/extensions/start-azure-mcp-server.png" alt-text="A screenshot showing Azure MCP Server starting.":::

    :::image type="content" source="../media/extensions/call-resource-group-tool.png" alt-text="A screenshot showing the resource group tool being called.":::

1. When the task completes, you should see your resource group listed in the final output.

    :::image type="content" source="../media/extensions/resource-groups-found.png" alt-text="A screenshot showing the discovered resource groups.":::

### Configure permissions on the managed identity

The `azd coding agent` extension creates an Azure managed identity that Azure MCP Server uses to access your resources. This setup enables you to assign different roles to the managed identity in order to control the capabilities and permissions of Azure MCP Server.

By default, the extension assigns only the `Reader` role scoped to the resource group. Assign additional roles or widen scope if the agent needs more capabilities.

For example, to assign the `Contributor` role at the resource group scope:

```azdeveloper
az role assignment create --assignee <principal-id-or-client-id> --role Contributor --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>
```

[See built-in roles](/azure/role-based-access-control/built-in-roles)

## Troubleshooting

The following sections highlight common issues you might experience.

### No git remotes configured

Add a remote so federated credentials can be generated:

```azdeveloper
git remote add origin <https://github.com/<your-org>/<your-repo>.git>
git fetch origin
```

### Refresh token expired

Log in again:

```azdeveloper
azd auth login
```

Add flags like `--tenant-id <tenant-id>` or `--use-device-code` if required.

### Need more diagnostic output

Use debug mode:

```azdeveloper
azd coding-agent config --debug
```

All internal commands and their output print to the console.

## Next steps

- Expand identity permissions (only as needed) using role assignments.
- Integrate additional automation by extending the workflow in `.github/workflows/`.
- Explore other extension capabilities: [Extensions overview](overview.md).
- [Review Azure RBAC concepts](https://learn.microsoft.com/azure/role-based-access-control/role-assignments-cli)

## Contributing

To contribute to Azure Developer CLI resources, see [the contributing guide](https://github.com/Azure/azure-dev/blob/main/cli/azd/CONTRIBUTING.md). Pull requests may require signing a Contributor License Agreement.

## Code of conduct

This project follows the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

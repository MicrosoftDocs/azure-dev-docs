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

# Connect GitHub Copilot coding agent with Azure MCP Server using azd extensions

Use the Azure Developer CLI (`azd`) coding agent extension (`azure.coding-agent`) to give GitHub Copilot coding agent secure and scoped Azure access with a managed identity. The extension creates the managed identity, configures the federated credential, and sets up the GitHub Actions workflow in your repository.

See [Extensions overview](overview.md) to learn how extensions add capabilities to `azd`.

## Prerequisites

- Install Azure Developer CLI (`azd`). See [installation instructions](https://github.com/Azure/azure-dev/blob/main/README.md#installupgrade-azure-developer-cli).
- Azure subscription that lets you create resource groups and managed identities.
- Local clone of the GitHub repository you enable for Copilot Coding Agent.
- Repository permissions to:
   - Update the `copilot` GitHub environment.
   - Configure Copilot Coding Agent settings.
   - Push changes to the `.github/workflows` folder.
- At least one configured Git remote for the repository (required for federated credentials).

## Install or upgrade the Copilot coding agent extension

1. Install for the first time

    ```azdeveloper
    azd extension install azure.coding-agent
    ```

    Upgrade to the latest version

    ```azdeveloper
    azd extension upgrade azure.coding-agent
    ```

1. Verify it's installed:

    ```azdeveloper
    azd extension list --installed
    ```

    You should see `azure.coding-agent` in the list.

## Use the Copilot coding agent extension

The Copilot coding agent extension automates configuring Azure access via a managed identity for the Copilot coding agent. You also need to perform a few manual steps to complete the setup.

### Enable Azure access

1. Inside the root of your local repository directory, run the following command:

    ```azdeveloper
    azd coding-agent config
    ```

1. Follow the on-screen prompts to complete the extension workflow.

    During configuration, the extension:

    - Creates (or reuses) a resource group.
    - Creates an Azure managed identity.
    - Assigns the Reader role to that identity scoped to the resource group.
    - Establishes federated credentials linking the GitHub repository to the managed identity.
    - Adds (or updates) a `copilot-setup-steps.yml` workflow and related assets.
    - Guides you to finalize GitHub environment settings for the `copilot` environment.

### Verify setup (optional)

1. List the managed identity in the created (or updated) resource group:

    ```azdeveloper
    az identity list --resource-group <resource-group-name>
    ```

1. In GitHub, open the **Settings** > **Environments** > **copilot** environment, and confirm the federated credential entry referencing the managed identity (subject issuer should reflect GitHub).

### Configure Azure MCP Server for the Copilot coding agent

1. The `azd coding agent` extension creates a pull request for a branch with the new GitHub workflow file at `origin/azd-enable-copilot-coding-agent-with-azure`. If you want to use the Azure MCP Server connection in your `main` branch, merge this PR.

    The pull request description and the extension output logs in the console both include a JSON configuration snippet you can use to configure Azure MCP Server for the Copilot coding agent:

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

1. To configure the Azure MCP Server, go to the **Settings** page of your repository.
1. Select **Copilot -> Coding agent** on the left navigation.
1. Paste the JSON snippet from the PR into the **MCP configuration** box and select **Save MCP configuration**.

    :::image type="content" source="../media/extensions/configure-azure-mcp-server.png" alt-text="A screenshot showing how to configure Azure MCP Server for the Copilot coding agent.":::

## Test the Copilot coding agent extension

1. Navigate to your repository in GitHub.
1. Select the **Open agents panels** icon on the top right navigation bar.
1. In the flyout panel, select the repository and branch that you used for the `azd` command. If you merged the generated pull request into `main`, select `main`.
1. Enter a prompt that specifically instructs the Copilot coding agent to use the Azure MCP Server you configured, such as:

    ```output
    Use the Azure MCP Server to list the resource groups in my subscription.
    Do not traverse or analyze the repository at all. Use only the Azure MCP Server.
    ```

    Press Enter to run the prompt and instruct Copilot coding agent to create and run a new task.

    > [!NOTE]
    > You can also run Copilot coding agent tasks on a branch other than `main` by selecting that branch in the flyout panel.

1. Select the task that appears at the bottom of the panel to navigate to the task details page.

    :::image type="content" source="../media/extensions/create-copilot-coding-agent-task.png" alt-text="A screenshot showing how to create a new task for Copilot coding agent.":::

1. Scan through the output to see Copilot coding agent:

    - Start the Azure MCP Server:

        :::image type="content" source="../media/extensions/start-azure-mcp-server.png" alt-text="A screenshot showing Azure MCP Server starting.":::

    - Call various tools to gather information about your Azure resources:

        :::image type="content" source="../media/extensions/call-resource-group-tool.png" alt-text="A screenshot showing the resource group tool being called.":::

    - Display the resource group in the final output:

        :::image type="content" source="../media/extensions/resource-groups-found.png" alt-text="A screenshot showing the discovered resource groups.":::

### Configure permissions on the managed identity

The `azd coding agent` extension creates an Azure managed identity that the Azure MCP Server uses to access your resources. This setup enables you to assign different roles to the managed identity in order to control the capabilities and permissions of Azure MCP Server.

By default, the extension assigns only the `Reader` role to the resource group scope. Assign additional roles or widen the scope if the agent needs more capabilities. [See built-in roles](/azure/role-based-access-control/built-in-roles).

For example, to assign the `Contributor` role at the resource group scope:

```azdeveloper
az role assignment create --assignee <principal-id-or-client-id> --role Contributor --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>
```

## Troubleshooting

The following sections highlight common issues you can experience.

### No git remotes configured

Add a remote so federated credentials can be generated:

```azdeveloper
git remote add origin <https://github.com/<your-org>/<your-repo>.git>
git fetch origin
```

### Refresh token expired

Sign-in again:

```azdeveloper
azd auth login
```

Add flags such as `--tenant-id <tenant-id>` or `--use-device-code` as needed.

### Improve diagnostic output

Use debug mode:

```azdeveloper
azd coding-agent config --debug
```

All internal commands and their output print to the console.

## Next steps

- Expand identity permissions (only as needed) using role assignments
- Integrate additional automation by extending the workflow in `.github/workflows/`
- Explore other extension capabilities: [Extensions overview](overview.md)
- [Review Azure RBAC concepts](https://learn.microsoft.com/azure/role-based-access-control/role-assignments-cli)

## Contributing

To contribute to Azure Developer CLI resources, see [the contributing guide](https://github.com/Azure/azure-dev/blob/main/cli/azd/CONTRIBUTING.md). Pull requests might require signing a Contributor License Agreement.

## Code of conduct

This project follows the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

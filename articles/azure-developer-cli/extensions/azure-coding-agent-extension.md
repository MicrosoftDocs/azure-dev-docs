---
title: Quickstart: Enable Copilot Coding Agent Azure access with the azd extension
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

## 1. Enable extension support (if not already enabled)

```azdeveloper
azd config set alpha.extensions on
```

## 2. Install or upgrade the coding agent extension

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

## 3. Configure the Copilot Coding Agent for Azure access

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

## 4. Verify setup

1. List the managed identity in the resource group (optional):

    ```azdeveloper
    az identity list --resource-group <resource-group-name>
    ```

1. Confirm the Reader role assignment:

    ```azdeveloper
    az role assignment list --assignee <principal-id-or-client-id> --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>
    ```

1. In GitHub, open the **Settings** > **Environments** > **copilot** environment and confirm the federated credential entry referencing the managed identity (subject issuer should reflect GitHub).

## 5. Use the Copilot Coding Agent

After configuration completes and the workflow is merged:

1. Trigger or wait for the `copilot-setup-steps` workflow run (if created).
1. In GitHub Copilot Chat (or the Coding Agent interface), invoke an action that requires Azure access (for example, listing resource group contents). The agent should automatically authenticate using the managed identity without storing long-lived credentials.

## Troubleshooting

### Managed identity lacks required permissions

The extension assigns only the Reader role scoped to the resource group. Assign additional roles or widen scope if the agent needs more capabilities.

Assign a new role (example: `Contributor`) at the resource group scope:

```azdeveloper
az role assignment create --assignee <principal-id-or-client-id> --role Contributor --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>
```

See built-in roles: <https://learn.microsoft.com/azure/role-based-access-control/built-in-roles>

### No git remotes configured

Add a remote so federated credentials can be generated:

```azdeveloper
git remote add origin <https://github.com/ORG/REPO.git>
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
- Review Azure RBAC concepts: <https://learn.microsoft.com/azure/role-based-access-control/role-assignments-cli>

## Contributing

To contribute to Azure Developer CLI resources, see the contributing guide: <https://github.com/Azure/azure-dev/blob/main/cli/azd/CONTRIBUTING.md>. Pull requests may require signing a Contributor License Agreement.

## Code of conduct

This project follows the Microsoft Open Source Code of Conduct: <https://opensource.microsoft.com/codeofconduct/>.

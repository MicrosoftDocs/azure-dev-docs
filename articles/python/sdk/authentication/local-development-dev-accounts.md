---
title: Authenticate Python apps to Azure services during local development using developer accounts
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for Python during local development using developer accounts.
ms.date: 01/22/2026
ms.topic: how-to
ms.custom: devx-track-python, devx-track-azurecli, devx-track-azurepowershell
---

# Authenticate Python apps to Azure services during local development using developer accounts

During local development, applications need to authenticate to Azure to use different Azure services. Authenticate locally using one of these approaches:

* Use a developer account with one of the [developer tools supported by the Azure Identity library](local-development-dev-accounts.md#supported-developer-tools-for-authentication).
* Use a [broker](local-development-broker.md) to manage credentials.
* Use a [service principal](local-development-service-principal.md).

This article explains how to authenticate using a developer account with tools supported by the Azure Identity library. In the sections ahead, you learn:

- How to use Microsoft Entra groups to efficiently manage permissions for multiple developer accounts.
* How to assign roles to developer accounts to scope permissions.
* How to sign-in to supported local development tools.
* How to authenticate using a developer account from your app code.

<a name='supported-development-tools-for-authentication'></a>

## Supported developer tools for authentication

For an app to authenticate to Azure during local development using the developer's Azure credentials, the developer must be signed-in to Azure from one of the following developer tools:

* Azure CLI
* Azure Developer CLI
* Azure PowerShell
* Visual Studio
* Visual Studio Code

The Azure Identity library can detect that the developer is signed-in from one of these tools. The library can then obtain the Microsoft Entra access token via the tool to authenticate the app to Azure as the signed-in user.

This approach takes advantage of the developer's existing Azure accounts to streamline the authentication process. However, a developer's account likely has more permissions than required by the app, therefore exceeding the permissions the app runs with in production. As an alternative, you can [create application service principals to use during local development](local-development-service-principal.md), which can be scoped to have only the access needed by the app.


<a name='create-azure-ad-group-for-local-development'></a>

## Create a Microsoft Entra security group for local development

In most development scenarios, multiple developers contribute to the same application. To streamline access control and ensure consistent permissions across the team, we recommend that you first create a Microsoft Entra security group specifically for the application’s local development needs.

Assigning Azure roles at the group level—rather than to individual users—offers several key benefits:

* Consistent Role Assignments

  All developers in the group automatically inherit the same roles and permissions, ensuring a uniform development environment.

* Simplified Role Management

  When the application requires a new role, you only need to add it once to the group. You don't need to update individual user permissions.

* Easy Onboarding

  New developers can be granted the necessary permissions simply by adding them to the group. No manual role assignments are required.

If your organization already has a suitable Microsoft Entra security group for the development team, you can reuse it. Otherwise, you can create a new group specifically for the app.

### [Azure CLI](#tab/azure-cli)

To create a security group in Microsoft Entra ID, use the [az ad group create](/cli/azure/ad/group#az-ad-group-create)e Azure CLI command.

This command requires the following parameters:

`--display-name`: A user-friendly name for the group

`--mail-nickname`: A unique identifier used for email and internal reference

We recommend that you base the group name on the application name and include a suffix like `-local-dev` to clearly indicate its purpose.

```bash
#!/bin/bash
az ad group create \
    --display-name MyDisplay \
    --mail-nickname MyDisplay  \
    --description "<group-description>"
```

```PowerShell
# PowerShell syntax
az ad group create `
    --display-name MyDisplay `
    --mail-nickname MyDisplay `
    --description "<group-description>"
```

After running the `az ad group create` command, copy the value of the `id` property from the command output. You need the `Object ID` of the Microsoft Entra security group for assigning roles in later steps in this article. To retrieve the `Object ID` again later, use the following [az ad group show](/cli/azure/ad/group#az-ad-group-show) command: `az ad group show --group "my-app-local-dev" --query id --output tsv`.

To add a user to the group, you first need to obtain the `Object ID` of the Azure user account you want to add. Use the [az ad user list](/cli/azure/ad/sp#az-ad-user-list) command with the `--filter` parameter to search for a specific user by display name. The `--query` parameter helps limit the output to relevant fields:

```bash
#!/bin/bash
az ad user list \
--filter "startswith(displayName, 'Bob')" \
--query "[].{objectId:id, displayName:displayName}" \
--output table
```

```PowerShell
# PowerShell syntax
az ad user list `
    --filter "startswith(displayName, 'Bob')" `
    --query "[].{objectId:id, displayName:displayName}" `
    --output table
```

Once you have the `Object ID` of the user, you can add them to the group using the [az ad group member add](/cli/azure/ad/group/member#az-ad-group-member-add) command.

```Bash
#!/bin/bash
az ad group member add \
    --group <group-name> \
    --member-id <object-id>
```

```PowerShell
# PowerShell syntax
az ad group member add `
    --group <group-name> `
    --member-id <object-id>
```

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app AD group step 1](<../../../includes/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-1.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search bar in the Azure portal to search for and navigate to the Microsoft Entra ID page." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-1.png"::: |
| [!INCLUDE [Create app AD group step 2](<../../../includes/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-2.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-2-240px.png" alt-text="A screenshot showing the location of the Groups menu item in the left-hand menu of the Microsoft Entra ID Default Directory page." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-2.png"::: |
| [!INCLUDE [Create app AD group step 3](<../../../includes/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-3.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-3-240px.png" alt-text="A screenshot showing the location of the New Group button in the All groups page." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-3.png"::: |
| [!INCLUDE [Create app AD group step 4](<../../../includes/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-4.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-4-240px.png" alt-text="A screenshot showing how to create a new Microsoft Entra group. The location of the link to select to add members to this group is highlighted." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-4.png"::: |
| [!INCLUDE [Create app AD group step 5](<../../../includes/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-5.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-5-240px.png" alt-text="A screenshot of the Add members dialog box showing how to select developer accounts to be included in the group." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-5.png"::: |
| [!INCLUDE [Create app AD group step 6](<../../../includes/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-6.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-6-240px.png" alt-text="A screenshot of the New Group page showing how to complete the process by selecting the Create button." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-accounts-app-ad-group-azure-portal-6.png"::: |

---

> [!NOTE]
> By default, the creation of Microsoft Entra security groups is limited to certain privileged roles in a directory. If you're unable to create a group, contact an administrator for your directory. If you're unable to add members to an existing group, contact the group owner or a directory administrator. To learn more, see [Manage Microsoft Entra groups and group membership](/entra/fundamentals/how-to-manage-groups).

<a name='assign-roles-to-the-azure-ad-group'></a>

## Assign roles to the group

After creating your Microsoft Entra security group and adding members, the next step is to determine what roles (permissions) your application requires, and assign those roles to the group at the appropriate scope.

* Determine Required Roles

  Identify the roles your app needs to function. Common examples include:

  * Key Vault Secrets User – to read secrets from Azure Key Vault
  * Storage Queue Data Contributor – to send messages to Azure Queue Storage

  Refer to the built-in role definitions for more options.

* Choose a Scope for the Role Assignment

  Roles can be assigned at different scopes:

  * Resource-level (e.g., a single Key Vault or Storage account)
  * Resource group-level (recommended for most apps)
  * Subscription-level (use with caution—broadest access)

In this example, we assign roles at the resource group scope, which is typical when all application resources are grouped under one resource group.

### [Azure CLI](#tab/azure-cli)

A user, group, or application service principal is assigned a role in Azure using the [az role assignment create](/cli/azure/role/assignment) command. You can specify a group with its `Object ID`.

```Bash
#!/bin/bash
az role assignment create --assignee <objectId> \
    --scope /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName> \
    --role "<roleName>" 
```

```PowerShell
# PowerShell syntax
az role assignment create `
    --assignee <objectId> `
    --scope /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName> `
    --role "<roleName>"
```

To get the role names that can be assigned, use the [az role definition list](/cli/azure/role/definition#az-role-definition-list) command.

```Bash
#!/bin/bash
az role definition list --query "sort_by([].{roleName:roleName, description:description}, &roleName)" --output table
```

```Powershell
# PowerShell syntax
az role definition list --query "sort_by([].{roleName:roleName, description:description}, &roleName)" --output table
```

To grant read, write, and delete access to Azure Storage blob containers and data for all storage accounts in a specific resource group, assign the Storage Blob Data Contributor role to your Microsoft Entra security group.

```Bash
#!/bin/bash
az role assignment create --assignee bbbbbbbb-1111-2222-3333-cccccccccccc \
    --scope /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/msdocs-python-sdk-auth-example \
    --role "Storage Blob Data Contributor"
```

```Powershell
# PowerShell syntax
az role assignment create --assignee bbbbbbbb-1111-2222-3333-cccccccccccc `
    --scope /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/msdocs-python-sdk-auth-example `
    --role "Storage Blob Data Contributor"
```

For information on assigning permissions at the resource or subscription level using the Azure CLI, see the article [Assign Azure roles using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-1.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search box in the Azure portal to locate and navigate to the resource group you want to assign roles (permissions) to." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-1.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-2.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-2-240px.png" alt-text="A screenshot of the resource group page showing the location of the Access control (IAM) menu item." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-2.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-3.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-3-240px.png" alt-text="A screenshot showing how to navigate to the role assignments tab and the location of the button used to add role assignments to a resource group." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-3.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-4.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-4-240px.png" alt-text="A screenshot showing how to filter and select role assignments to be added to the resource group." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-4.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-5.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-5-240px.png" alt-text="A screenshot showing the radio button to select to assign a role to a Microsoft Entra group and the link used to select the group to assign the role to." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-5.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-6.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-6-240px.png" alt-text="A screenshot showing how to filter for and select the Microsoft Entra group for the application in the Select members dialog box." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-6.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-7.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-7-240px.png" alt-text="A screenshot showing the completed Add role assignment page and the location of the Review + assign button used to complete the process." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-7.png"::: |

---

## Sign-in to Azure using developer tooling

To authenticate with your Azure account, choose one of the following methods:

### [Visual Studio Code](#tab/sign-in-vscode)

Developers using Visual Studio Code can authenticate with their developer account directly through the editor via the broker. Apps that use [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) or [VisualStudioCodeCredential](/python/api/azure-identity/azure.identity.visualstudiocodecredential) can then use this account to authenticate app requests through a seamless single-sign-on experience.

1. In Visual Studio Code, go to the **Extensions** panel and install the Azure Resources extension. This extension lets you view and manage Azure resources directly from Visual Studio Code. It also uses the built-in Visual Studio Code Microsoft authentication provider to authenticate with Azure.

:::image type="content" source="../../../includes/authentication/media/azure-resources-extension.png" alt-text="Screenshot showing the Azure Resources extension.":::

2. Open the Command Palette in Visual Studio Code, then search for and select **Azure: Sign in**.

:::image type="content" source="../../../includes/authentication/media/visual-studio-sign-in.png" alt-text="Screenshot showing how to sign in to Azure in Visual Studio Code.":::

> [!TIP]
> Open the Command Palette using `Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on macOS.


3. Add the `azure-identity-broker` Python package to your app:

```bash
pip install azure-identity-broker
```


### [Azure CLI](#tab/sign-in-azure-cli)

Open a terminal on your developer workstation and sign-in to Azure from the [Azure CLI](/cli/azure/what-is-azure-cli).

```azurecli
az login
```

### [Azure PowerShell](#tab/sign-in-azure-powershell)

Open a terminal on your developer workstation and sign-in to Azure from [Azure PowerShell](/powershell/azure/what-is-azure-powershell).

```azurepowershell
Connect-AzAccount
```

### [Azure Developer CLI](#tab/sign-in-azure-developer-cli)

Open a terminal on your developer workstation and sign-in to Azure from [Azure Developer CLI](/azure/developer/azure-developer-cli/overview).

```azdeveloper
azd auth login
```

### [Interactive browser](#tab/sign-in-interactive-browser)

Interactive authentication is disabled in the `DefaultAzureCredential` by default and can be enabled with a keyword argument:

```Python
DefaultAzureCredential(exclude_interactive_browser_credential=False)
```

---

## Authenticate to Azure services from your app

The [Azure Identity library](/python/api/azure-identity/azure.identity) provides implementations of [TokenCredential](/python/api/azure-core/azure.core.credentials.tokencredential) that support various scenarios and Microsoft Entra authentication flows. The steps ahead demonstrate how to use [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) or a specific development tool credential when working with user accounts locally.

### Implement the code

1. Add the [azure-identity](https://pypi.org/project/azure-identity/) package to your application:

    ```bash
    pip install azure-identity
    ```

2. Add the necessary `import` statements for the `azure.identity` module and the Azure service client module your app requires.

3. Pass a `TokenCredential` instance to the Azure SDK client object constructor. Common `TokenCredential` examples include:

    **DefaultAzureCredential instance** optimized for local development. For more information, see [Customize the DefaultAzureCredential chain](credential-chains.md#customize-the-defaultazurecredential-chain).

    ```python
    from azure.identity import DefaultAzureCredential
    from azure.storage.blob import BlobServiceClient

    credential = DefaultAzureCredential()

    blob_service_client = BlobServiceClient(
        account_url="https://<account-name>.blob.core.windows.net",
        credential=credential)
    ```

    **Credential corresponding to a specific development tool**, such as `VisualStudioCodeCredential`.

    ```python
    from azure.identity import VisualStudioCodeCredential
    from azure.storage.blob import BlobServiceClient

    credential = VisualStudioCodeCredential()

    blob_service_client = BlobServiceClient(
        account_url="https://<account-name>.blob.core.windows.net",
        credential=credential)
    ```


> [!TIP]
> When your team uses multiple development tools to authenticate with Azure, prefer `DefaultAzureCredential` over tool-specific credentials.

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

* How to use Microsoft Entra groups to efficiently manage permissions for multiple developer accounts.
* How to assign roles to developer accounts to scope permissions.
* How to sign-in to supported local development tools.
* How to authenticate using a developer account from your app code.

<a name='supported-development-tools-for-authentication'></a>

## Supported developer tools for authentication

For an app to authenticate to Azure during local development using the developer's Azure credentials, the developer must be signed-in to Azure from one of the following developer tools:

* Azure CLI
* Azure Developer CLI
* Azure PowerShell
* Visual Studio Code

The Azure Identity library can detect that the developer is signed-in from one of these tools. The library can then obtain the Microsoft Entra access token via the tool to authenticate the app to Azure as the signed-in user.

This approach takes advantage of the developer's existing Azure accounts to streamline the authentication process. However, a developer's account likely has more permissions than required by the app, therefore exceeding the permissions the app runs with in production. As an alternative, you can [create application service principals to use during local development](local-development-service-principal.md), which can be scoped to have only the access needed by the app.


<a name='create-azure-ad-group-for-local-development'></a>

[!INCLUDE [Create a Microsoft Entra group for local development](<../../../includes/authentication/create-entra-group>)]


<a name='assign-roles-to-the-azure-ad-group'></a>

[!INCLUDE [Assign roles to the group](<../../../includes/authentication/assign-group-roles>)]

## Sign-in to Azure using developer tooling

To authenticate with your Azure account, choose one of the following methods:

### [Visual Studio Code](#tab/sign-in-vscode)

Developers using Visual Studio Code can authenticate with their developer account directly through the editor via the broker. Apps that use [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) or [VisualStudioCodeCredential](/python/api/azure-identity/azure.identity.visualstudiocodecredential) can then use this account to authenticate app requests through a seamless single-sign-on experience.

1. In Visual Studio Code, go to the **Extensions** panel and install the [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups) extension. This extension lets you view and manage Azure resources directly from Visual Studio Code. It also uses the built-in Visual Studio Code Microsoft authentication provider to authenticate with Azure.

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

---
title: "Troubleshoot development environment authentication issues"
titleSuffix: Azure SDK for Java
description: "Learn how to troubleshoot development environment authentication issues in Azure SDK for Java, including fixes for AzureCliCredential, AzurePowerShellCredential, and more."
ms.date: 04/02/2025 
ms.topic: troubleshooting-general
ms.custom: devx-track-java, devx-track-extended-java
author: bmitchell287
ms.author: brendm
ms.reviewer: jogiles
---

# Troubleshoot development environment authentication

This article provides guidance on troubleshooting development environment authentication problems that you encounter when authenticating Azure SDK for Java applications running locally on developer machines through various `TokenCredential` implementations. For more information, see [Azure authentication in Java development environments](authentication/dev-env.md).

## Troubleshoot AzureCliCredential

When you use `AzureCliCredential`, you can optionally try/catch for `CredentialUnavailableException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error message                             | Description                                                                    | Mitigation                                                                                                                                                                                                                                                                                       |
|-------------------------------------------|--------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure CLI not installed`                 | The Azure CLI isn't installed or couldn't be found.                            | - Ensure that you install the [Azure CLI](/cli/azure/install-azure-cli). <br>- Validate that the installation location is added to the `PATH` environment variable.                                                                                                          |
| `Please run 'az login' to set up account` | No account is currently signed into the Azure CLI, or the sign-in has expired. | - Sign in to the Azure CLI by using the `az login` command. For more information, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli). <br>- Validate that the Azure CLI can obtain tokens. For more information, see [the next section](#verify-that-the-azure-cli-can-obtain-tokens). |

### Verify that the Azure CLI can obtain tokens

You can manually verify that you authenticate the Azure CLI and can obtain tokens. First, use the following command to verify that the account is currently signed in to the Azure CLI:

```azurecli
az account show
```

After you verify the Azure CLI is using correct account, use the following command to validate that it's able to obtain tokens for this account:

```azurecli
az account get-access-token \
    --output json \
    --resource https://management.core.windows.net
```

> [!WARNING]
> The output of this command contains a valid access token. To avoid compromising account security, don't share this access token.

## Troubleshoot AzureDeveloperCliCredential

When you use `AzureDeveloperCliCredential`, you can optionally try/catch for `CredentialUnavailableException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error message                                   | Description                                                                               | Mitigation                                                                                                                                                                                                                                    |
|-------------------------------------------------|-------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure Developer CLI not installed`             | The Azure Developer CLI isn't installed or couldn't be found.                             | - Ensure that you install the [Azure Developer CLI](../../azure-developer-cli/install-azd.md). <br>- Validate that the installation location is added to the `PATH` environment variable.                         |
| `Please run 'azd auth login' to set up account` | No account is currently signed in to the Azure Developer CLI, or the sign-in has expired. | - Sign in to the Azure Developer CLI by using the `azd auth login` command. <br>- Validate that the Azure Developer CLI can obtain tokens. For more information, see [the next section](#verify-that-the-azure-developer-cli-can-obtain-tokens). |

### Verify that the Azure Developer CLI can obtain tokens

You can manually verify that you properly authenticated the Azure Developer CLI and can obtain tokens. First, use the following command to verify that the account is currently signed in to the Azure Developer CLI:

```bash
azd config list
```

After you verify the Azure Developer CLI is using correct account, use the following command to validate that it's able to obtain tokens for this account:

```bash
azd auth token --output json --scope https://management.core.windows.net/.default
```

> [!WARNING]
> The output of this command contains a valid access token. To avoid compromising account security, don't share this access token.

## Troubleshoot AzurePowerShellCredential

When you use `AzurePowerShellCredential`, you can optionally try/catch for `CredentialUnavailableException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error message                                       | Description                                                                            | Mitigation                                                                                                                                                                                                                                                                                                                    |
|-----------------------------------------------------|----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `PowerShell isn't installed.`                       | No local installation of PowerShell was found.                                         | Ensure that you install [PowerShell](/powershell/scripting/install/installing-powershell) on the machine.                                                                                                                                                                                                       |
| `Az.Account module >= 2.2.0 isn't installed.`       | The `Az.Account` module needed for authentication in Azure PowerShell isn't installed. | Install the latest `Az.Account` module. For more information, see [How to install Azure PowerShell](/powershell/azure/install-az-ps).                                                                                                                                                                                         |
| `Please run 'Connect-AzAccount' to set up account.` | No account is currently signed in to Azure PowerShell.                                 | - Sign in to Azure PowerShell by using the `Connect-AzAccount` command. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps) <br>- Validate that Azure PowerShell can obtain tokens.  |

### Verify that Azure PowerShell can get tokens

You can manually verify that you authenticated Azure PowerShell properly and that it can get tokens. First, use the following command to verify that the account is currently signed in to the Azure CLI:

```powershell
Get-AzContext
```

This command produces output similar to the following example:

```output
Name                                     Account             SubscriptionName    Environment         TenantId
----                                     -------             ----------------    -----------         --------
Subscription1 (xxxxxxxx-xxxx-xxxx-xxx... test@outlook.com    Subscription1       AzureCloud          xxxxxxxx-x...
```

After you verify Azure PowerShell is using the correct account, use the following command to validate that it can get tokens for this account.

```powershell
Get-AzAccessToken -ResourceUrl "https://management.core.windows.net"
```

> [!WARNING]
> The output of this command contains a valid access token. To avoid compromising account security, don't share this access token.

## Troubleshoot VisualStudioCodeCredential

> [!NOTE]
> It's a [known issue](https://github.com/Azure/azure-sdk-for-java/issues/27364) that `VisualStudioCodeCredential` doesn't work with [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) versions newer than `0.9.11`. A long-term fix to this problem is in progress. In the meantime, consider [authenticating via the Azure CLI](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity/README.md#authenticating-via-development-tools).

When you use `VisualStudioCodeCredential`, you can optionally try/catch for `CredentialUnavailableException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error message                                                                                    | Description                                                                                                                 | Mitigation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|--------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Failed To Read VS Code Credentials</p></p>OR</p>Authenticate via Azure Tools plugin in VS Code` | No Azure account information was found in the VS Code configuration.                                                        | - Ensure that you properly installed the [Azure Account plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account). <br>- Use **View > Command Palette** to execute the **Azure: Sign In** command. This command opens a browser window and displays a page that you can use to sign in to Azure. <br>- If you already have the Azure Account extension installed and have signed in to your account, try signing out and signing in again. This action repopulates the cache and potentially mitigates the error you're getting. |
| `MSAL Interaction Required Exception`                                                            | `VisualStudioCodeCredential` was able to read the cached credentials from the cache but the cached token is likely expired. | Sign in to the Azure Account extension via **View > Command Palette** to execute the **Azure: Sign In** command in the VS Code IDE.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `ADFS tenant not supported`                                                                      | Visual Studio Azure Service Authentication doesn't currently support ADFS tenants.                                          | Use credentials from a supported cloud when authenticating with Visual Studio. For more information about the supported clouds, see [National clouds](/azure/active-directory/develop/authentication-national-cloud).                                                                                                                                                                                                                                                                                                                                         |

## Next steps

If the troubleshooting guidance in this article doesn't help resolve issues when you use the Azure SDK for Java client libraries, [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

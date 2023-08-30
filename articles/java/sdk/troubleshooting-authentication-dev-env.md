---
title: Troubleshooting Development Environment Authentication
description: An overview of how to troubleshoot development environment authentication issues
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting Development Environment Authentication

This troubleshooting document provides guidance on dealing with issues encountered when authenticating Azure SDK for Java applications running locally on developer machines, through various `TokenCredential` implementations. For more information, see the [conceptual documentation on development environment credential types](identity-dev-env-auth.md).

## Troubleshooting AzureCliCredential

When using the `AzureCliCredential`, you may optionally try/catch for `CredentialUnavailableException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error message                             | Description                                                                  | Mitigation                                                                                                                                                                                                                                                                                                       |
|-------------------------------------------|------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure CLI not installed`                 | The Azure CLI isn't installed or couldn't be found.                          | * Ensure the Azure CLI is properly installed. Installation instructions can be found [here](/cli/azure/install-azure-cli). <br>* Validate that the installation location has been added to the `PATH` environment variable.                                                                         |
| `Please run 'az login' to set up account` | No account is currently signed into the Azure CLI, or the sign-in has expired. | * Sign into the Azure CLI using the `az login` command. More information on authentication in the Azure CLI can be found [here](/cli/azure/authenticate-azure-cli). <br>* Validate that the Azure CLI can obtain tokens. See [the next section](#verify-that-the-azure-cli-can-obtain-tokens) for instructions. |

### Verify that the Azure CLI can obtain tokens

You can manually verify that the Azure CLI is properly authenticated, and can obtain tokens. First, use the `account` command to verify that the account is currently signed in to the Azure CLI.

```azurecli
az account show
```

After you've verified the Azure CLI is using correct account, you can validate that it's able to obtain tokens for this account.

```azurecli
az account get-access-token \
    --output json \
    --resource https://management.core.windows.net
```

> [!WARNING]
> The output of this command contains a valid access token. To avoid compromising account security, do not share this access token.

## Troubleshooting AzureDeveloperCliCredential

When using the `AzureDeveloperCliCredential`, you may optionally try/catch for `CredentialUnavailableException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error message                                   | Description                                                                            | Mitigation                                                                                                                                                                                                                                                             |
|-------------------------------------------------|----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure Developer CLI not installed`             | The Azure Developer CLI isn't installed or couldn't be found.                          | * Ensure the Azure Developer CLI is properly installed. Installation instructions can be found [here](/azure/developer/azure-developer-cli/install-azd). <br>* Validate that the installation location has been added to the `PATH` environment variable. |
| `Please run 'azd auth login' to set up account` | No account is currently signed in to the Azure Developer CLI, or the sign-in has expired. | * Sign into the Azure Developer CLI using the `azd auth login` command. <br>* Validate that the Azure Developer CLI can obtain tokens. See [the next section](#verify-that-the-azure-developer-cli-can-obtain-tokens) for instructions.                               |

### Verify that the Azure Developer CLI can obtain tokens

You can manually verify that the Azure Developer CLI is properly authenticated, and can obtain tokens. First use the `config` command to verify that the account which is currently signed in to the Azure Developer CLI.

```bash
azd config list
```

After you've verified the Azure Developer CLI is using correct account, you can validate that it's able to obtain tokens for this account.

```bash
azd auth token --output json --scope https://management.core.windows.net/.default
```

> [!WARNING]
> The output of this command contains a valid access token. To avoid compromising account security, do not share this access token.

## Troubleshooting AzurePowerShellCredential

When using the `AzurePowerShellCredential`, you may optionally try/catch for `CredentialUnavailableException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error message                                       | Description                                                                          | Mitigation                                                                                                                                                                                                                                                                                                                               |
|-----------------------------------------------------|--------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `PowerShell isn't installed.`                       | No local installation of PowerShell was found.                                       | Ensure that PowerShell is properly installed on the machine. Instructions for installing PowerShell can be found [here](/powershell/scripting/install/installing-powershell).                                                                                                                                                            |
| `Az.Account module >= 2.2.0 isn't installed.`       | The Az.Account module needed for authentication in Azure PowerShell isn't installed. | Install the latest Az.Account module. Installation instructions can be found [here](/powershell/azure/install-az-ps).                                                                                                                                                                                                                    |
| `Please run 'Connect-AzAccount' to set up account.` | No account is currently signed in to Azure PowerShell.                                | * Sign in to Azure PowerShell using the `Connect-AzAccount` command. More instructions for authenticating Azure PowerShell can be found [here](/powershell/azure/authenticate-azureps) <br>* Validate that Azure PowerShell can obtain tokens. See [the next section](#verify-that-azure-powershell-can-obtain-tokens) for instructions. |

### Verify that Azure PowerShell can obtain tokens

You can manually verify that Azure PowerShell is properly authenticated, and can obtain tokens. First use the `Get-AzContext` command to verify that the account which is currently signed in to the Azure CLI.

```powershell
Get-AzContext
```

This command produces output similar to the following example:

```output
Name                                     Account             SubscriptionName    Environment         TenantId
----                                     -------             ----------------    -----------         --------
Subscription1 (xxxxxxxx-xxxx-xxxx-xxx... test@outlook.com    Subscription1       AzureCloud          xxxxxxxx-x...
```

After you've verified Azure PowerShell is using correct account, you can validate that it's able to obtain tokens for this account.

```powershell
Get-AzAccessToken -ResourceUrl "https://management.core.windows.net"
```

> [!WARNING]
> The output of this command contains a valid access token. To avoid compromising account security, do not share this access token.

## Troubleshooting VisualStudioCodeCredential

> [!NOTE]
> It's a [known issue](https://github.com/Azure/azure-sdk-for-java/issues/27364) that `VisualStudioCodeCredential` doesn't work with [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) versions newer than **0.9.11**. A long-term fix to this problem is in progress. In the meantime, consider [authenticating via the Azure CLI](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity/README.md#authenticating-via-development-tools).

When using the `VisualStudioCodeCredential`, you may optionally try/catch for `CredentialUnavailableException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error message                                                                                    | Description                                                                                                                     | Mitigation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|--------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Failed To Read VS Code Credentials</p></p>OR</p>Authenticate via Azure Tools plugin in VS Code` | No Azure account information was found in the VS Code configuration.                                                            | * Ensure the [Azure Account plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) is properly installed <br>* Use **View > Command Palette** to execute the **Azure: Sign In** command. This command opens a browser window and displays a page that allows you to sign in to Azure. <br>* If you already had the Azure Account extension installed and had signed in to your account, try logging out and logging in again as that repopulates the cache and potentially mitigates the error you're getting. |
| `MSAL Interaction Required Exception`                                                            | The `VisualStudioCodeCredential` was able to read the cached credentials from the cache but the cached token is likely expired. | Sign into the Azure Account extension via **View > Command Palette** to execute the **Azure: Sign In** command in the VS Code IDE.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `ADFS tenant not supported`                                                                      | ADFS tenants are not currently supported by Visual Studio `Azure Service Authentication`.                                       | Use credentials from a supported cloud when authenticating with Visual Studio. For more information about the supported clouds, see [National clouds](/azure/active-directory/develop/authentication-national-cloud).                                                                                                                                                                                                                                                                                                                        |

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when using the Azure SDK for Java client libraries, we recommended that you reach out to the development team by [filing an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

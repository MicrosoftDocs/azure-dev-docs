---
title: Troubleshoot overview when using the Azure SDK for Java
description: An overview of how to troubleshoot issues related to using the Azure SDK for Java
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting Development Environment Authentication

TODO

## `AzureCliCredential` authentication issues

When using the `AzureCliCredential`, you may optionally try/catch for `CredentialUnavailableException`. The table below shows the errors that this exception indicates, and methods of mitigation.

| Error Message |Description| Mitigation |
|---|---|---|
|Azure CLI not installed|The Azure CLI isn't installed or couldn't be found.|<ul><li>Ensure the Azure CLI is properly installed. Installation instructions can be found [here](https://learn.microsoft.com/cli/azure/install-azure-cli).</li><li>Validate the installation location has been added to the `PATH` environment variable.</li></ul>|
|Please run 'az login' to set up account|No account is currently logged into the Azure CLI, or the login has expired.|<ul><li>Log into the Azure CLI using the `az login` command. More information on authentication in the Azure CLI can be found [here](https://learn.microsoft.com/cli/azure/authenticate-azure-cli).</li><li>Validate that the Azure CLI can obtain tokens. See [below](#verify-the-azure-cli-can-obtain-tokens) for instructions.</li></ul>|

### Verify the Azure CLI can obtain tokens

You can manually verify that the Azure CLI is properly authenticated, and can obtain tokens. First use the `account` command to verify the account which is currently logged in to the Azure CLI.

```bash
az account show
```

Once you've verified the Azure CLI is using correct account, you can validate that it's able to obtain tokens for this account.

```bash
az account get-access-token --output json --resource https://management.core.windows.net
```

> [!WARNING]
> The output of this command will contain a valid access token, and SHOULD NOT BE SHARED to avoid compromising account security.

## `AzureDeveloperCliCredential` authentication issues

When using the `AzureDeveloperCliCredential`, you may optionally try/catch for `CredentialUnavailableException`. The table below shows the errors that this exception indicates, and methods of mitigation.

| Error Message |Description| Mitigation |
|---|---|---|
|Azure Developer CLI not installed|The Azure Developer CLI isn't installed or couldn't be found.|<ul><li>Ensure the Azure Developer CLI is properly installed. Installation instructions can be found [here](/azure/developer/azure-developer-cli/install-azd).</li><li>Validate the installation location has been added to the `PATH` environment variable.</li></ul>|
|Please run 'azd auth login' to set up account|No account is currently logged into the Azure Developer CLI, or the login has expired.|<ul><li>Log into the Azure Developer CLI using the `azd auth login` command.</li><li>Validate that the Azure Developer CLI can obtain tokens. See [below](#verify-the-azure-developer-cli-can-obtain-tokens) for instructions.</li></ul>|

### Verify the Azure Developer CLI can obtain tokens

You can manually verify that the Azure Developer CLI is properly authenticated, and can obtain tokens. First use the `config` command to verify the account which is currently logged in to the Azure Developer CLI.

```bash
azd config list
```

Once you've verified the Azure Developer CLI is using correct account, you can validate that it's able to obtain tokens for this account.

```bash
azd auth token --output json --scope https://management.core.windows.net/.default
```

> [!WARNING]
> The output of this command will contain a valid access token, and SHOULD NOT BE SHARED to avoid compromising account security.

## `AzurePowerShellCredential` authentication issues

When using the `AzurePowerShellCredential`, you may optionally try/catch for `CredentialUnavailableException`. The table below shows the errors that this exception indicates, and methods of mitigation.

| Error Message |Description| Mitigation |
|---|---|---|
|PowerShell isn't installed.|No local installation of PowerShell was found.|Ensure that PowerShell is properly installed on the machine. Instructions for installing PowerShell can be found [here](/powershell/scripting/install/installing-powershell).|
|Az.Account module >= 2.2.0 isn't installed.|The Az.Account module needed for authentication in Azure PowerShell isn't installed.|Install the latest Az.Account module. Installation instructions can be found [here](/powershell/azure/install-az-ps).|
|Please run 'Connect-AzAccount' to set up account.|No account is currently logged into Azure PowerShell.|<ul><li>Login to Azure PowerShell using the `Connect-AzAccount` command. More instructions for authenticating Azure PowerShell can be found [here](/powershell/azure/authenticate-azureps)</li><li>Validate that Azure PowerShell can obtain tokens. See [below](#verify-azure-powershell-can-obtain-tokens) for instructions.</li></ul>|

### Verify Azure PowerShell can obtain tokens

You can manually verify that Azure PowerShell is properly authenticated, and can obtain tokens. First use the `Get-AzContext` command to verify the account which is currently logged in to the Azure CLI.

```
PS C:\> Get-AzContext

Name                                     Account             SubscriptionName    Environment         TenantId
----                                     -------             ----------------    -----------         --------
Subscription1 (xxxxxxxx-xxxx-xxxx-xxx... test@outlook.com    Subscription1       AzureCloud          xxxxxxxx-x...
```

Once you've verified Azure PowerShell is using correct account, you can validate that it's able to obtain tokens for this account.

```bash
Get-AzAccessToken -ResourceUrl "https://management.core.windows.net"
```

> [!WARNING]
> The output of this command will contain a valid access token, and SHOULD NOT BE SHARED to avoid compromising account security.

## `VisualStudioCodeCredential` authentication issues

> [!NOTE]
> It's a [known issue](https://github.com/Azure/azure-sdk-for-java/issues/27364) that `VisualStudioCodeCredential` doesn't work with [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) versions newer than **0.9.11**. A long-term fix to this problem is in progress. In the meantime, consider [authenticating via the Azure CLI](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity/README.md#authenticating-via-development-tools).

When using the `VisualStudioCodeCredential`, you may optionally try/catch for `CredentialUnavailableException`. The table below shows the errors that this exception indicates, and methods of mitigation.

| Error Message |Description| Mitigation |
|---|---|---|
|Failed To Read VS Code Credentials</p></p>OR</p>Authenticate via Azure Tools plugin in VS Code|No Azure account information was found in the VS Code configuration.|<ul><li>Ensure the [Azure Account plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) is properly installed</li><li>Use **View > Command Palette** to execute the **Azure: Sign In** command. This command opens a browser window and displays a page that allows you to sign in to Azure.</li><li>If you already had the Azure Account extension installed and had logged in to your account, try logging out and logging in again as that will repopulate the cache and potentially mitigate the error you're getting.</li></ul>|
|MSAL Interaction Required Exception|The `VisualStudioCodeCredential` was able to read the cached credentials from the cache but the cached token is likely expired.|Log into the Azure Account extension via **View > Command Palette** to execute the **Azure: Sign In** command in the VS Code IDE.|
|ADFS tenant not supported|ADFS tenants are not currently supported by Visual Studio `Azure Service Authentication`.|Use credentials from a supported cloud when authenticating with Visual Studio. The supported clouds are:</p><ul><li>AZURE PUBLIC CLOUD - https://login.microsoftonline.com/</li><li>AZURE GERMANY - https://login.microsoftonline.de/</li><li>AZURE CHINA - https://login.chinacloudapi.cn/</li><li>AZURE GOVERNMENT - https://login.microsoftonline.us/</li></ul>|

## Next Steps

If the troubleshooting guidance above does not help to resolve issues when using the Azure SDK for Java client libraries, it is recommended that you reach out to the development team by [filing an issue on the projects GitHub page][azsdkjava_github_repo].

<!-- LINKS -->
[azsdkjava_github_repo]: https://github.com/Azure/azure-sdk-for-java

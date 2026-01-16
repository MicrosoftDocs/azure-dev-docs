---
author: diberry
ms.service: azure
ms.topic: include
ms.date: 09/22/2025
ms.author: diberry
---
## Sign-in to Azure using developer tooling

Next, sign-in to Azure using one of several developer tools that can be used to perform authentication in your development environment. The account you authenticate should also exist in the Microsoft Entra group you created and configured earlier.

### [Azure CLI](#tab/sign-in-azure-cli)

Developers can use [Azure CLI](/cli/azure/what-is-azure-cli) to authenticate to Microsoft Entra ID. Apps using `DefaultAzureCredential` or `AzureCliCredential` can then use this account to authenticate app requests when running locally.

To authenticate with the Azure CLI, run the `az login` command. On a system with a default web browser, the Azure CLI launches the browser to authenticate the user.

```azurecli
az login
```

For systems without a default web browser, the `az login` command uses the device code authentication flow. The user can also force the Azure CLI to use the device code flow rather than launching a browser by specifying the `--use-device-code` argument.

```azurecli
az login --use-device-code
```

### [Azure Developer CLI](#tab/sign-in-azure-developer-cli)

Developers can use [Azure Developer CLI](/azure/developer/azure-developer-cli/overview) to authenticate to Microsoft Entra ID. Apps using `DefaultAzureCredential` or `AzureDeveloperCliCredential` can then use this account to authenticate app requests when running locally.

To authenticate with the Azure Developer CLI, run the `azd auth login` command. On a system with a default web browser, the Azure Developer CLI launches the browser to authenticate the user.

```azdeveloper
azd auth login
```

For systems without a default web browser, the `azd auth login --use-device-code` uses the device code authentication flow. The user can also force the Azure Developer CLI to use the device code flow rather than launching a browser by specifying the `--use-device-code` argument.

```azdeveloper
azd auth login --use-device-code
```

### [Azure PowerShell](#tab/sign-in-azure-powershell)

Developers can use [Azure PowerShell](/powershell/azure/what-is-azure-powershell) to authenticate to Microsoft Entra ID. Apps using `DefaultAzureCredential` or `AzurePowerShellCredential` can then use this account to authenticate app requests when running locally.

To authenticate with Azure PowerShell, run the command `Connect-AzAccount`. On a system with a default web browser and version 5.0.0 or later of Azure PowerShell, it launches the browser to authenticate the user.

```azurepowershell
Connect-AzAccount
```

For systems without a default web browser, the `Connect-AzAccount` command uses the device code authentication flow. The user can also force Azure PowerShell to use the device code flow rather than launching a browser by specifying the `UseDeviceAuthentication` argument.

```azurepowershell
Connect-AzAccount -UseDeviceAuthentication
```

### [Visual Studio Code](#tab/sign-in-visual-studio-code)

Developers can use Visual Studio Code to authenticate to Microsoft Entra ID. Apps using `DefaultAzureCredential` or `VisualStudioCodeCredential` can then use this account to authenticate app requests when running locally.

To authenticate with Visual Studio Code:

1. Install the [Azure Resources extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups) in Visual Studio Code.
1. In Visual Studio Code, open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on macOS) and run the **Azure: Sign In** command to sign in to Azure.

To use Visual Studio Code authentication in your application, you need to install the `@azure/identity-vscode` plugin package and configure it in your code:

```bash
npm install @azure/identity-vscode
```

Then, enable the plugin in your application:

```javascript
import { useIdentityPlugin, DefaultAzureCredential } from "@azure/identity";
import { vsCodePlugin } from "@azure/identity-vscode";

useIdentityPlugin(vsCodePlugin);

const credential = new DefaultAzureCredential();
```

---
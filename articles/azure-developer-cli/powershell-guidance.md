---
title: Troubleshoot PowerShell issues with the Azure Developer CLI
description: Troubleshoot PowerShell issues when running Azure Developer CLI templates that utilize hooks with PowerShell scripts
author: alexwolfmsft
ms.author: alexwolf
ms.date: 2/25/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Troubleshoot PowerShell issues with Azure Developer CLI templates

Azure Developer CLI (`azd`) templates often use [hooks](/azure/developer/azure-developer-cli/azd-extensibility) to execute custom scripts before and after `azd` lifecycle events, such as provisioning and deployment. Users can choose between Bash or PowerShell to write these custom scripts, depending on their preference and the environment they are working in. If you plan to use templates that rely on PowerShell to execute scripts, make sure you have [PowerShell 7.4 or higher installed](/powershell/scripting/install/installing-powershell) to avoid potential errors.

## PowerShell considerations

If a template relies on PowerShell to execute hook scripts, you will encounter an error when running commands like `azd up` if PowerShell version 7.x is not installed. The Azure Developer CLI (`azd`) does not check for PowerShell installation before running commands; it only checks when executing a PowerShell hook script.

To avoid these errors:

- Ensure PowerShell version 7.x is installed on your system
- Verify whether the template relies on hook scripts before running `azd` commands.

### Check your installed version of PowerShell

When you open PowerShell, it should print out the current version by default. You can also manually check the installed version of PowerShell in any terminal window by running the following command:

```bash
pwsh --version
```

### Check if PowerShell is a dependency

Before running commands like `azd up`, users should verify if their template includes PowerShell scripts by checking the `hooks` section of the `azure.yaml` file, which defines custom scripts to run at various stages of the workflow.

Consider the following `azure.yaml` file that includes hooks:

```yaml
name: my-azure-project
services:
  - name: my-service
    hooks:
  postprovision:
    windows:
      shell: pwsh
      run: ./scripts/prepdocs.ps1
```

For the `postprovision` hook, note that PowerShell is specified as the shell environment for the `prepdocs.ps1` script. This template would encounter an error during command workflows such as `azd up` or `azd provision` if PowerShell 7.x is not installed on the device. When you see these types of PowerShell configurations in a template `azure.yaml` file, verify that PowerShell is installed on your device before running the template.

## PowerShell version considerations

There are a number of [differences between PowerShell 7.x and PowerShell 5.1](/powershell/scripting/whats-new/differences-from-windows-powershell) that are worth exploring, including the following:

- PowerShell 7 is cross-platform (Windows, macOS, Linux), while PowerShell 5 is Windows-only.
- PowerShell 7 is built on .NET Core, whereas PowerShell 5 is built on .NET Framework.
- PowerShell 7 offers improved performance and faster startup.
- PowerShell 7 includes new cmdlets, modules, operators, and other features.
- PowerShell 7 is actively developed with regular updates, while PowerShell 5 receives only security updates and bug fixes.

## Next steps

> [!div class="nextstepaction"]
> [Customize your Azure Developer CLI workflows using command event hooks](azd-extensibility.md)

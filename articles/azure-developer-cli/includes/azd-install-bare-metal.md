---
author: hhunter-ms
ms.service: azure-dev-cli
ms.topic: include
ms.date: 01/11/2023
ms.author: hannahhunter
---

## Pre-requisites

Before you get started using `azd`, ensure you have:

- Installed:
  - [Git](https://git-scm.com/)
  - [GitHub CLI v2.3+](https://github.com/cli/cli) **(only required for `azd pipeline config` when using GitHub Actions)**
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).


## Install `azd`

### [Windows](#tab/windows)

```azdeveloper
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/install-azd.ps1' | Invoke-Expression"
```

> [!IMPORTANT]
> As of version 0.5.0-beta.1, the PowerShell install script for Azure Developer CLI (`install-azd.ps1`) uses the published MSI file instead of installing from the .zip file. For new installations and upgrades of `azd`, this process is transparent.
>
> The install script doesn't support installing versions of `azd` on Windows that **predate** the MSI. To manually update older versions of the Azure Developer CLI, download the appropriate .zip file from the [Azure Developer CLI GitHub releases](https://github.com/Azure/azure-dev/releases), extract, and place the binary in the appropriate location manually. 

The MSI can be downloaded from the [Azure Developer CLI GitHub releases](https://github.com/Azure/azure-dev/releases). 

You can control MSI behavior with properties provided to `msiexec.exe`.

| Property | Value |
| -------- | ----- |
| `ALLUSERS` | `2`: Default. Install for current user (no privilege elevation required). <br/> `1`: Install for _all_ users (may require privilege elevation). |
| `INSTALLDIR` | Installation path. <br/> `"%LOCALAPPDATA%\Programs\Azure Dev CLI"`: Default. <br/> `"%PROGRAMFILES%\Azure Dev CLI"`: Default all users. |


### [Linux/MacOS](#tab/linuxmac)

```azdeveloper
curl -fsSL https://aka.ms/install-azd.sh | bash 
```

---

## Uninstall `azd`

To uninstall the `azd`:

### [Windows](#tab/windows)

Once you've installed the MSI versions, you should **not** use the uninstall script to remove `azd`. This will leave some items behind on the machine.  

Instead, **for version 0.5.0-beta.1 and later,** uninstall using the **Add or remove programs** dialog in Windows.

For versions before 0.5.0-beta.1, you can use the following uninstall script:

```azdeveloper
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/uninstall-azd.ps1' | Invoke-Expression"
```

### [Linux/MacOS](#tab/linuxmac)

```azdeveloper
curl -fsSL https://aka.ms/uninstall-azd.sh | bash 
```

---
---
title: Enable demo mode
description: How to enable demo mode
author: alexwolfmsft
ms.author: alexwolf
ms.date: 11/19/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Enable Azure Developer CLI demo mode

By default, some Azure Developer CLI commands display Azure subscription IDs in the console output. This behavior is useful during development to monitor deployments and template behavior. However, also `azd` includes a demo mode to hide Azure subscription ID for scenarios such as public presentations that use `azd` commands, screen sharing with other users, or any other scenario where you want to keep subscription IDs hidden.

## Enable demo mode

Demo mode behavior is based on the environment variable: `AZD_DEMO_MODE`. To enable demo mode, run:

```bash
export AZD_DEMO_MODE true
```

To persist demo mode across reboots, you can also run:

## [Bash](#tab/bash)

```bash
setx AZD_DEMO_MODE true
```

## [PowerShell](#tab/powershell)

```bash
$env:AZD_DEMO_MODE="true"
```

---

> [!NOTE]
> After setting the `AZD_DEMO_MODE` environment variables, you may need to close and reopen your terminal window to reload the variable and apply the changes.

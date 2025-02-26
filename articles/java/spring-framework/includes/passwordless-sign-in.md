---
ms.date: 08/17/2022
author: KarlErickson
ms.author: karler
ms.reviewer: seal
---

### [Azure CLI](#tab/sign-in-azure-cli)

Sign in to Azure through the Azure CLI by using the following command:

```azurecli
az login
```

### [PowerShell](#tab/sign-in-powershell)

Sign in to Azure using PowerShell by using the following command:

```azurepowershell
Connect-AzAccount
```

### [Visual Studio](#tab/sign-in-visual-studio)

Select the **Sign in** button in the top right corner of Visual Studio.

:::image type="content" source="../media/passwordless-connections/sign-in-visual-studio.png" alt-text="Screenshot showing the button to sign in to Azure using Visual Studio.":::

Sign in using the Microsoft Entra account you assigned a role to previously.

:::image type="content" source="../media/passwordless-connections/sign-in-visual-studio-account.png" alt-text="Screenshot showing the Visual Studio sign-in dialog box.":::

### [Visual Studio Code](#tab/sign-in-visual-studio-code)

Make sure you have the [Azure Account](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) extension installed.

:::image type="content" source="../media/passwordless-connections/azure-extension.png" alt-text="Screenshot showing the Azure extension.":::

Use the **CTRL + Shift + P** shortcut to open the command palette. Search for the **Azure: Sign In** command and follow the prompts to authenticate. Make sure to use the Microsoft Entra account you assigned a role to previously from your Blob Storage account.

:::image type="content" source="../media/passwordless-connections/azure-command.png" alt-text="Screenshot showing the Azure sign-in command.":::

### [IntelliJ](#tab/sign-in-Intellij)

For more information, see [Install the Azure Toolkit for IntelliJ](../../toolkit-for-intellij/install-toolkit.md) and [Sign-in instructions for the Azure Toolkit for IntelliJ](../../toolkit-for-intellij/sign-in-instructions.md).

---

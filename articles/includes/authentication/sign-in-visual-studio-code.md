---
author: diberry
ms.service: azure
ms.topic: include
ms.date: 02/18/2026
ms.author: diberry
---

Developers using Visual Studio Code can authenticate with their developer account directly through the editor via the broker. Apps that use [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential) or [VisualStudioCodeCredential](/javascript/api/@azure/identity/visualstudiocodecredential) can then use this account to authenticate app requests through a seamless single-sign-on experience.

1. In Visual Studio Code, go to the **Extensions** panel and install the [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups) extension. This extension lets you view and manage Azure resources directly from Visual Studio Code. It also uses the built-in Visual Studio Code Microsoft authentication provider to authenticate with Azure.

    :::image type="content" source="./media/azure-resources-extension.png" alt-text="Screenshot showing the Azure Resources extension.":::

1. Open the Command Palette in Visual Studio Code, then search for and select **Azure: Sign in**.

    :::image type="content" source="./media/visual-studio-code-sign-in.png" alt-text="Screenshot showing how to sign in to Azure in Visual Studio Code.":::

    > [!TIP]
    > Open the Command Palette using `Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on macOS.

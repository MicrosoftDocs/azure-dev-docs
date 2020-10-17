---
title: include file azure-sign-in.md
description: include file azure-sign-in.md
ms.date: 10/13/2020
ms.topic: include
ms.custom: devx-track-javascript
---
Once you've installed the [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) in Visual Studio Code, sign into your Azure account by navigating to the **Azure** explorer, select **Sign in to Azure**, and follow the prompts. (If you have multiple Azure extensions installed, select the one for the area in which you're working, such as App Service, Functions, etc.)

![Sign in to Azure through VS Code](../../media/tutorial-browser-file-upload/azure-sign-in.png)

After signing in, verify that the email address of your Azure account (or "Signed In") appears in the Status Bar and your subscription(s) appears in the **Azure** explorer:

![VS Code status bar showing Azure account](../../media/tutorial-browser-file-upload/azure-account-status-bar.png)

![VS Code Azure explorer showing subscriptions](../../media/tutorial-browser-file-upload/azure-subscription-view.png)

> [!NOTE]
> If you see the error **"Cannot find subscription with name [subscription ID]"**, this may be because you are behind a proxy and unable to reach the Azure API. Configure `HTTP_PROXY` and `HTTPS_PROXY` environment variables with your proxy information in your terminal:
>
> # [bash](#tab/bash)
>
> ```bash
> export HTTPS_PROXY=https://username:password@proxy:8080
> export HTTP_PROXY=http://username:password@proxy:8080
> ```
>
> # [PowerShell](#tab/powershell)
>
> ```powershell
> $env: HTTPS_PROXY = "https://username:password@proxy:8080"
> $env: HTTP_PROXY = "http://username:password@proxy:8080"
> ```
>
> # [Cmd](#tab/cmd)
>
> ```cmd
> set HTTPS_PROXY=https://username:password@proxy:8080
> set HTTP_PROXY=http://username:password@proxy:8080
> ```
>
> ---

---
ms.custom: devx-track-js
ms.topic: include
ms.date: 04/15/2021
---

If you already use the Azure service extensions, you should already be logged in and can skip this step. 

Once you've installed an extension in Visual Studio Code, you need to sign into your Azure account. 

1. In Visual Studio Code, select the **Azure** explorer icon, then select **Sign in to Azure**, and follow the prompts.

    ![Sign in to Azure through VS Code](../media/deploy-azure/azure-sign-in.png)

2. After signing in, verify that the email address of your Azure account appears in the Status Bar and your subscription(s) appears in the **Azure** explorer:
    
    ![VS Code Azure explorer showing subscriptions](../media/deploy-azure/azure-subscription-view.png)

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

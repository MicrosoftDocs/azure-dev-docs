Once you've installed the Azure extension, sign into your Azure account:

1. Navigate to the **Azure** explorer
1. Select **Sign in to Azure** and follow the prompts. (If you have multiple Azure extensions installed, select the one for the area in which you're working, such as App Service, Functions, etc.)

    ![Sign in to Azure through VS Code](../media/deploy-azure/sign-in-to-azure-through-visual-studio-code.png)

1. After signing in, verify that **Azure: Signed In"** appears in the Status Bar and your subscription(s) appears in the **Azure** explorer:

    ![Visual Studio Code status bar showing Azure account](../media/deploy-azure/azure-account-status-bar-in-visual-studio-code.png)

    ![Visual Studio Code Azure App Service explorer showing subscriptions](../media/deploy-azure/view-azure-subscription-in-visual-studio-code-app-service-explorer.png)

> [!NOTE]
> If you see the error **"Cannot find subscription with name [subscription ID]"**, this may be because you are behind a proxy and unable to reach the Azure API. Configure `HTTP_PROXY` and `HTTPS_PROXY` environment variables with your proxy information in your terminal:
>
> ```cmd
> # Windows
> set HTTPS_PROXY=https://username:password@proxy:8080
> set HTTP_PROXY=http://username:password@proxy:8080
> ```
>
> ```bash
> # macOS/Linux
> export HTTPS_PROXY=https://username:password@proxy:8080
> export HTTP_PROXY=http://username:password@proxy:8080
> ```

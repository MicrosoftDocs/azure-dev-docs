Once you've installed the Azure extension, sign into your Azure account by navigating to the **Azure** explorer, select **Sign in to Azure**, and follow the prompts. (If you have multiple Azure extensions installed, select the one for the area in which you're working, such as App Service, Functions, etc.)

![Sign in to Azure through VS Code](../media/deploy-azure/azure-sign-in.png)

After signing in, verify that the email address of your Azure account appears in the Status Bar and your subscription(s) appears in the **Azure** explorer:

![VS Code status bar showing Azure account](../media/deploy-azure/azure-account-status-bar.png)

![VS Code Azure explorer showing subscriptions](../media/deploy-azure/azure-subscription-view.png)

> [!NOTE]
> If you see the error **"Cannot find subscription with name [subscription ID]"**, this may be because you are behind a proxy and unable to reach the Azure API. Configure `HTTP_PROXY` and `HTTPS_PROXY` environment variables with your proxy information in your terminal:
>
> ```bash
> # macOS/Linux
> export HTTPS_PROXY=https://username:password@proxy:8080
> export HTTP_PROXY=http://username:password@proxy:8080
> ```
>
> ```powershell
> # Windows
> set HTTPS_PROXY=https://username:password@proxy:8080
> set HTTP_PROXY=http://username:password@proxy:8080
> ```

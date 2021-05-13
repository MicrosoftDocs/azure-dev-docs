---
title: Deploy the Functions 3.x app to Azure cloud
description: Use the Visual Studio Code extension for Azure Functions to deploy the Functions app to the Azure cloud. Verify the Functions app is publicly available with a browser. 
ms.topic: tutorial
ms.date: 05/13/2021
ms.custom: devx-track-js, contperf-fy21q2
---

# 4. Deploy the Functions app to Azure cloud

[Previous step: Test the function locally](tutorial-vscode-serverless-node-test-local.md)

In this step, use the Visual Studio Code extension for Azure Functions to deploy the Functions app to the Azure cloud. Verify the Functions app is publicly available with a browser. 

## Use Visual Studio Code extension to deploy to hosting environment

1. In VS Code, select the Azure logo to open the **Azure Explorer**, then under **Functions**, select the blue up arrow to deploy your app:

    ![Deploy to Azure Functions command](../../media/functions-extension/deploy-app.png)

    Alternately, you can deploy by opening the **Command Palette** (**F1**), entering 'deploy to function app', and running the **Azure Functions: Deploy to Function App** command.

1. At the prompt, **Select Function App in Azure**, choose **Create new Function app in Azure**.

1. At the next prompt, enter a globally unique name for your Function App and press **Enter**. Valid characters for a function app name are 'a-z', '0-9', and '-'.

1. Choose the Node.js version/runtime.

    ![VS Code output panel showing Node.js version/runtime](../../media/functions-extension/nodejs-runtime-version.png)

1. At the next prompt, select an Azure [region](https://azure.microsoft.com/regions/) close to you.

1. The VS Code **Output** panel for **Azure Functions** shows progress:

    ![VS Code output panel showing deployment progres](../../media/functions-extension/deploy-progress.png)

1. In the notifications, select **Stream logs** and keep the view open while you make a request to the API in the next section.

## Verify Functions app is publicly available with browser

1. Once deployment is completed, go to the **Azure Functions** explorer, expand the node for your Azure subscription, expand the node for your Functions app, then expand **Functions (read only)**. Right-click the function name and select **Copy Function Url**:

    ![Copy function URL command](../../media/functions-extension/copy-function-url-command.png)

1. Paste the URL into a browser, and append a `?name=YOUR-NAME` argument. The browser shows the function running in the cloud:

    ![Function running in the cloud](../../media/functions-extension/remote-test-browser.png)

1. If you want, make some changes to the function code in *index.js* or add additional functions with other triggers. After testing locally, deploy the code again as in the earlier steps to test those changes in the cloud.

    > [!TIP]
    > When deploying, the entire Functions application is deployed, so changes to all individual Functions are deployed at once.

1. Review the streaming log in VS Code to find your `context.log` output. 

## Query your Azure Function logs

Streaming logs is good for in-the-moment scanning but generally you want to search across logs, which is available in the Azure portal. 

1. In VS Code, select the Azure logo to open the **Azure Explorer**, then under **Functions**, right-click on your function app, then select **Open in Portal**.

    This opens the Azure portal to your Azure Function.

1. Select **Application Insights** from the Settings, then select **View Application Insights data**.

    :::image type="content" source="../../media/functions-extension/azure-portal-function-application-insights-link.png" alt-text="Browser screenshot showing menu choices. Select **Application Insights** from the Settings, then select **View Application Insights data**." lightbox="../../media/functions-extension/azure-portal-function-application-insights-link.png":::

    This link takes you to your separate metrics resource created for you when you created your Azure Function with VS Code.

1. Select **Logs** in the Monitoring section. If a **Queries** pop-up window appears, select the **X** in the top-right corner of the pop-up to close it. 
1. In the **Schema and Filter** pane, on the **Tables** tab, double-click the **traces** table. 

    This enters the Kusto query, `traces` into the query window. 
1. Edit the query to search for the custom logs:

    ```kusto
    traces 
    | where message startswith "***"
    ```

1. Select **Run**.

    If the log doesn't display any results, it may be because there is a few minutes delay between the HTTP request to the Azure Function and the log availability in Kusto. Wait a few minutes and run the query again.

    :::image type="content" source="../../media/functions-extension/azure-portal-application-insights-function-log-trace.png" alt-text="Browser screenshot showing Azure portal Kusto query result for Trace table." lightbox="../../media/functions-extension/azure-portal-application-insights-function-log-trace.png":::


## Next steps

> [!div class="nextstepaction"]
> [I deployed the Function app](tutorial-vscode-serverless-node-remove-resource.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azurefunctions&step=deploy-app)

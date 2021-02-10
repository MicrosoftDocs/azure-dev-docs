---
title: Deploy the Functions app to Azure cloud
description: Use the Visual Studio Code extension for Azure Functions to deploy the Functions app to the Azure cloud. Verify the Functions app is publicly available with a browser. 
ms.topic: tutorial
ms.date: 09/23/2019
ms.custom: devx-track-js, contperf-fy21q2
---

# 4. Deploy the Functions app to Azure cloud

[Previous step: Test the function locally](tutorial-vscode-serverless-node-test-local.md)

In this step, use the Visual Studio Code extension for Azure Functions to deploy the Functions app to the Azure cloud. Verify the Functions app is publicly available with a browser. 

## Use Visual Studio Code extension to deploy to hosting environment

1. In VS Code, select the Azure logo to open the **Azure Explorer**, then under **Functions**, select the blue up arrow to deploy your app:

    ![Deploy to Azure Functions command](../media/functions-extension/deploy-app.png)

    Alternately, you can deploy by opening the **Command Palette** (**F1**), entering 'deploy to function app', and running the **Azure Functions: Deploy to Function App** command.

1. At the prompt, **Select Function App in Azure**, choose **Create new Function app in Azure**.

1. At the next prompt, enter a globally unique name for your Function App and press **Enter**. Valid characters for a function app name are 'a-z', '0-9', and '-'.

1. Choose the Node.js version/runtime

    ![VS Code output panel showing Node.js version/runtime](../media/functions-extension/nodejs-runtime-version.png)

1. At the next prompt, select an Azure [region](https://azure.microsoft.com/regions/) close to you.

1. The VS Code **Output** panel for **Azure Functions** shows progress:

    ![VS Code output panel showing deployment progres](../media/functions-extension/deploy-progress.png)

## Verify Functions app is publicly available with browser

1. Once deployment is completed, go to the **Azure Functions** explorer, expand the node for your Azure subscription, expand the node for your Functions app, then expand **Functions (read only)**. Right-click the function name and select **Copy Function Url**:

    ![Copy function URL command](../media/functions-extension/copy-function-url-command.png)

1. Paste the URL into a browser, and append a `?name=<yourname>` argument. The browser should then show the function running in the cloud:

    ![Function running in the cloud](../media/functions-extension/remote-test-browser.png)

1. If you want, make some changes to the function code in *index.js* or add additional functions with other triggers. After testing locally, deploy the code again as in the earlier steps to test those changes in the cloud.

    > [!TIP]
    > When deploying, the entire Functions application is deployed, so changes to all individual Functions are deployed at once.

> [!div class="nextstepaction"]
> [I deployed the Function app](tutorial-vscode-serverless-node-remove-resource.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azurefunctions&step=deploy-app)

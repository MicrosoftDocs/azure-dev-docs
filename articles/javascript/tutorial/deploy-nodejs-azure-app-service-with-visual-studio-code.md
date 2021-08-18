---
title: Deploy Node.js Express.js to App Service from Visual Studio Code
description: Deploy an Express.js Node.js web application to Azure App Service using the Visual Studio Code App Service extension.
ms.topic: tutorial
ms.date: 08/16/2021
ms.custom: devx-track-js
# Verified full run: diberry 08/16/2021
---

# Deploy Express.js to Azure App Service using Visual Studio Code

Deploy your Express.js app to Azure with the Visual Studio Code extension for Azure App Service extension. To accomplish this goal:

* Create Express.js app
* Create a web app resource to host app
* Deploy app to resource
* View remote logs locally

## 1. Set up your development environment

* Create a free [Azure subscription](https://azure.microsoft.com/free/)
* Install [Node.js LTS and npm](https://nodejs.org/en/download)
* Install [Visual Studio Code](https://code.visualstudio.com/) and use the following extensions:
    * [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)

## 2. Sign in to Azure

If you already use the Azure service extensions, you should already be logged in and can skip this step. 

Once you've installed an extension in Visual Studio Code, you need to sign into your Azure account. 

1. In Visual Studio Code, select the **Azure** explorer icon, then select **Sign in to Azure**, and follow the prompts.

    ![Sign in to Azure through VS Code](../media/deploy-azure/azure-sign-in.png)

2. After signing in, verify that the email address of your Azure account appears in the Status Bar and your subscription(s) appears in the **Azure** explorer:
    
    ![VS Code Azure explorer showing subscriptions](../media/deploy-azure/azure-subscription-view.png)

## 3. Create a local Express.js app

Create and run an Express.js app by cloning an Azure sample repository. 

1. At a terminal command prompt, go to the location where you want to create the app folder.

1. Use the following base command with git to clone the repository, change into the repository folder named `myexpressapp`, then install the npm dependencies, and open the project in Visual Studio Code from the terminal. 

    ```bash
    git clone https://github.com/Azure-Samples/js-e2e-express-server.git myexpressapp && \
        cd myexpressapp && \
        npm install && \
        code .
    ```
## 4. Run your local Express.js app

1. Start the server:

    ```bash
    npm start
    ```

1. Test the app by opening a browser to `http://localhost:3000`. The site should appear as follows:

    ![Running Express Application](../media/deploy-azure/express.png)

1. Press **Ctrl**+**C** in the terminal to stop the server.

## 5. Create App service resource in Visual Studio Code

1. Use **Ctrl**+**Shift**+**P** to open the command palette. 
1. Enter `create web` then select **Azure App Service: Create New Web App...Advanced**. 

    You use the advanced command to have **full control** over the deployment including resource group, App Service Plan, and operating system rather than use Linux defaults.

1. Respond to the prompts as follows:

    - Select your **Subscription** account.
    - For **Enter a globally unique name**, enter a name that's unique across all of Azure. Use only alphanumeric characters ('A-Z', 'a-z', and '0-9') and hyphens ('-')
    - Select **Create new resource group** and provide a name like `AppServiceTutorial-rg`.
    - Select the Linux operating system.
    - Select **Create a new App Service plan**, provide a name like `AppServiceTutorial-plan`, and select the **F1 Free** [pricing tier](../core/what-is-azure-for-javascript-development.md#free-tier-resources).
    - Select **Skip for now** for the Application Insights resource.
    - Select a location near you.

1. After a short time, VS Code notifies you that creation is complete. Close the notification with the **X** button:

    ![Notification on completion of web app creation](../media/deploy-azure/creation-complete.png)

1. With the web app in place, you next instruct VS Code to deploy your code from the local Git repo. Select the Azure icon to open the **Azure App Service** explorer, expand your subscription node, right-click the name of the web app you just created, and select **Configure Deployment Source**.

    ![Configure deployment source command on a web app](../media/deploy-azure/configure-deployment-source.png)

1. When prompted, select **LocalGit**.

1. Select the deployment (up arrow) icon to deploy your code to Azure:

    ![Deploy to Web App icon](../media/deploy-azure/deploy.png)

1. At the prompts, select the *myexpressapp* folder, select your **subscription** account again and then select the name of the web app created earlier.

    When this deployment is complete, it is listed in the Azure Explorer, under your web app's **Deployments Git** node.

1. When prompted with **Always deploy the workspace to (app name)"**, select **Yes**. This tells VS Code to automatically target the same App Service web app with subsequent deployments.

1. Once deployment is complete, select **Browse Website** in the prompt to view your freshly deployed web app. The browser should display "Hello World!"

## 7. Stream remote service logs in Visual Studio Code

View (tail) any output that the running app generates through calls to `console.log`. This output appears in the **Output** window in Visual Studio Code.

1. In the **Azure App Service** explorer, right-click the app node and choose **Start Streaming Logs**.

    ![View Streaming Logs](../media/deploy-azure/start-streaming-logs.png)

1. Refresh the web page a few times in the browser to see additional log output.

## 8. Make changes and redeploy

1. Make a small change to the app. In `./public/client.html`, change `Welcome to Express` to `Welcome to Express with Visual Studio Code`. 

1. Right-click your app service from the list of App services in the App service extension, then select **Deploy to Web App...**. 

    :::image type="content" source="../media/deploy-azure/deploy-or-redeploy-app-service.png" alt-text="Deploy or redeploy to App service with Visual Studio Code":::


## 9. Clean up resources

When you want to clean up the resources, right-click on the App service in the Visual Studio Code's App Service extension, then select **Delete**.

:::image type="content" source="../media/deploy-azure/delete-azure-app-service-with-visual-studio-code-extension.png" alt-text="When you want to clean up the resources, right-click on the App service in the Visual Studio Code's App Service extension, then select **Delete**.":::

## Troubleshooting

When trying to sign in to Azure, if you see the error **"Cannot find subscription with name [subscription ID]"**, this may be because you are behind a proxy and unable to reach the Azure API. Configure `HTTP_PROXY` and `HTTPS_PROXY` environment variables with your proxy information in your terminal:
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

## Next steps

* [Learn about how to configure your app settings](../how-to/configure-web-app-settings.md)

[!INCLUDE [tutorial-next-steps](../includes/tutorial-next-steps.md)]

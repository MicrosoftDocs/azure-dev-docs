---
title: Add authentication to web app
description: Add Microsoft authentication to your web app.
ms.topic: how-to
ms.date: 04/26/2021
ms.custom: devx-track-js, devx-track-azurecli
#intent: Show a customer how to configure authentication for a web app. 
---

# Add Microsoft authentication to your web app

Add Microsoft authentication to your web app with an app registration and an Azure app service. The Azure app service provides an easy authentication ("easy auth") to your web app, doing most of the work for the typical uses cases for you.

## Easy auth for Azure web apps

Easy auth allows your app to provide login to your users using their existing Microsoft account. The account doesn't have to have a particular domain name, such as `@microsoft.com` or `@outlook.com`. Any email domain works as long as the user has an existing Microsoft Identity account with that email address. 

Users are held and authenticated by tenant. An Azure tenant represents a single organization. A tenant is a dedicated and trusted instance of [Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis.md) that's automatically created when your organization signs up for a Microsoft cloud service subscription, such as Microsoft Azure, Microsoft Intune, or Microsoft 365. 

All users, regardless of tenant, can be available to be authorized by the Microsoft Identity provider, if the user and the app are both configured that way. 

## Application architecture

This article will discuss three ways to provide authentication with your web app using easy auth. The work includes authentication configuration. 

## Prepare your development environment

Make sure the following are installed on your local developer workstation:

    - An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
    - Azure resource group already created in previous tutorial.
    - [Node.js 10.1+ and npm](https://nodejs.org/en/download) - installed to your local machine.
    - [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
    - Visual Studio Code extensions:
        - [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for Visual Studio Code.
    - Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the bash. If you prefer, [install](/cli/azure/install-azure-cli) the Azure CLI to run CLI reference commands.

## Download sample Express.js app

Create and run an Express.js app by cloning an Azure sample repository. 

1. At a terminal command prompt, go to the location where you want to create the app folder.

1. Use the following base command with git to clone the repository, change into the repository folder named `myexpressapp`, then install the npm dependencies. 

    ```bash
    git clone https://github.com/Azure-Samples/js-e2e-express-server.git myexpressapp && \
        cd myexpressapp && \
        npm install
    ```

1. Run the app with the following command: 

    ```bash
    npm start
    ```

## Create an Azure app service

1. In VS Code, select **Azure** from the activity bar, then select **+** in the **Azure: App Service** side bar. 
1. Complete the prompts:

    |Prompt|Enter|
    |--|--|
    |Enter a globally unique name for the new web app.||
    |Select a runtime stack.|Select the **most recent version of Node.js**, such as 14 LTS.|
    |Select a pricing tier|Select the **free** tier.|
    
1. Wait for the web app creation to complete. 
1. Select **Deploy** to deploy the sample Express.js app, when the notification pop-up displays. 
1. When the notification pop-up displays a link to the **output window**, select the link to watch the deployment. 

    The deployment uses [Zip deployment](/azure/app-service/deploy-zip.md). 
1. Select **Browse website** from the notification. 
    The web app may take a minute or two to return from the server for the first (cold) start.

1. When the receive the following in the browser, the sample app is deployed and responding correctly. 
    Authentication isn't configured yet. That is the next step. 

## Configure easy auth for your app service

## Test easy auth with a user account
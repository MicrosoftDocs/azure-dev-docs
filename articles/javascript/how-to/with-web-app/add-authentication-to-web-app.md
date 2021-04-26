---
title: Add authentication to web app
description: Add Microsoft Identity authentication to your Express.js web app on Azure App service using easy authentication.
ms.topic: how-to
ms.date: 04/26/2021
ms.custom: devx-track-js, devx-track-azurecli
#intent: Show a customer how to configure authentication for a web app. 
---

# Add Microsoft authentication to your Express.js web app

Add Microsoft authentication to your web app with an app registration and an Azure app service. The Azure app service provides an easy authentication ("easy auth") to your web app, doing most of the work for the typical uses cases for you.

## Easy auth for Azure web apps

[Easy auth](/azure/app-service/overview-authentication-authorization.md#feature-architecture-on-windows-non-container-deployment) allows your app to provide login to your users using their existing Microsoft account. The account doesn't have to have a particular domain name, such as `@microsoft.com` or `@outlook.com`. Any email domain works as long as the user has an existing Microsoft Identity account with that email address. 

Users are held and authenticated by tenant. An Azure tenant represents a single organization. A tenant is a dedicated and trusted instance of [Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis.md) that's automatically created when your organization signs up for a Microsoft cloud service subscription, such as Microsoft Azure, Microsoft Intune, or Microsoft 365. 

All users, regardless of tenant, can be available to be authorized by the Microsoft Identity provider, if the user and the app are both configured that way. 

The following steps provide:
* identity provided by a secure identity provider
* no code changes to your app - you can add auth code later 
* a quick way to require users to sign in to your app
* no Active Directory, group, user, or role setup
* no authentication callback routing

## Application architecture

This article will discuss three ways to provide authentication with your web app using easy auth. The work includes authentication configuration. 

## Prepare your development environment

Make sure the following are installed on your local developer workstation:

    - An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
    - Microsoft Identity account - this is an [email account](https://signup.live.com) added to Microsoft Identity but doesn't have to be the same account you use to create resources.]
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

1. When the receive the following response in the browser, the sample app is deployed and is responding correctly. 
    Authentication isn't configured yet. That is the next step. 

## Configure easy auth for your app service

1. In VS Code, select **Azure** from the activity bar, then right-click your new web app from the **Azure: App Service** side bar. 
1. Select **Open in portal** to configure easy auth.
1. Select **Authentication** under the app's settings.
1. Select **Add identity provider**.
1. Select **Microsoft**.
1. Configure the following identity provider settings:

    |Setting|Value|
    |--|--|
    |Identity provider|Microsoft|
    |App registration type|Create new app registration|
    |Name|Keep the default name, which is the same as your app service.|
    |Supported account types|Select **Any Azure AD directory and personal Microsoft accounts**. This allows anyone within the Microsoft Identity provider to access your web app.|
    |Authentication|Require authentication - this means your app isn't publicly available.|
    |Unauthenticated requests|Keep the default value of 302 not found.|
    | Redirect to|Keep the default value.|
    |Token store|Keep the default value.|

1. Select **Next** to view the permissions but do not make any changes. 
1. Select **Add** to finish the process. 

    When the process completes, you can view your app's identity provider list. 

1. Your app is now private. A user must sign in with a Microsoft Identity account. 

    This sign-in process depends on the user's tenant configuration. 

## Sign in with a user account

1. In VS Code, select **Azure** from the activity bar, then right-click your new web app from the **Azure: App Service** side bar. 
1. Select **Browse website** to configure easy auth.
1. In the browser's pop-up window, enter your email account. If you are required to continue with 2-factor authentication, such as using a phone to finish the process, complete those steps. 
1. After logging in, you should see the same web app. 

## Continue with the authenticated app

To continue building this authenticated app, you may want to:
* Change the authentication of your app registration to allow for both authenticated and unauthenticated users
* Update your web app code with MSAL.js: 
    * Add a [login button](../tutorial/single-page-application-azure-login-button-sdk-msal.md)
    * Add a logout button 
    * Add a callback route specific to authenticated users
    * Add a public route for unauthenticated users

## Clean up resources

In this procedure, you created an Azure app service and an Azure Active Directory app registration. 

### Delete your Azure app registration

1. In the Azure portal, select [Azure Active Directory](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview).
1. Select **App registrations** then search for your app name. 
1. Select the app's **Properties**, then select **Delete**. 

## Delete your Azure web app

1. In VS Code, select **Azure** from the activity bar, then right-click your new web app from the **Azure: App Service** side bar. 
1. Right-click on your app then select **Delete...**.

## Next steps

* Change your code to add a [Login button with MSAL.js](../tutorial/single-page-application-azure-login-button-sdk-msal.md)

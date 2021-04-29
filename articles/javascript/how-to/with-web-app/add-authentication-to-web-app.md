---
title: Add Active Directory authentication
description: Add Microsoft Identity authentication to your Express.js web app on Azure App service using easy authentication.
ms.topic: how-to
ms.date: 04/28/2021
ms.custom: devx-track-js
#intent: Create Express.js web app with easy auth configured. 
---

# Add easy authentication to your Express.js web app

Add Microsoft authentication to your web app with an app registration and an Azure app service. The Azure app service provides an easy authentication ("easy auth") to your web app, doing most of the work for a simple authentication use case for you.

* [Sample code](https://github.com/azure-samples/js-e2e-web-app-easy-auth.git)

## Easy auth for Azure web apps

[Easy auth](/azure/app-service/overview-authentication-authorization.md#feature-architecture-on-windows-non-container-deployment) allows your app to provide login to your users using their existing Microsoft account. 

The account doesn't have to have a particular domain name. The account can include accounts such as: 

* `@microsoft.com`
* `@outlook.com`
* `@yahoo.com`
* `@gmail.com` 

Any email domain works as long as the user has an existing Microsoft Identity account with that email address. 

Users are held and authenticated by tenant. An Azure tenant represents a single organization. A tenant is a dedicated and trusted instance of [Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis.md) that's automatically created when your organization signs up for a Microsoft cloud service subscription, such as Microsoft Azure, Microsoft Intune, or Microsoft 365. 

All users, regardless of tenant, can be authorized by the Microsoft Identity provider, if the user and the app are both configured that way. 

The following steps provide:
* Identity provided by a secure identity provider
* No code changes to your app required
* No authentication callback routing changes required
* A quick way to secure your app
* Very little Active Directory setup required

## Prepare your development environment

Make sure the following are installed on your local developer workstation:

- An Azure account with **an active subscription which you own**. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Ownership is required to provide the correct Azure Active Directory permissions to complete these steps.
- Microsoft Identity account - this is an [email account](https://signup.live.com) added to Microsoft Identity but doesn't have to be the same account you use to create resources.
- [Node.js 14 and npm](https://nodejs.org/en/download) - installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
- Visual Studio Code extensions:
    - [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for Visual Studio Code.

## Download sample Express.js app

Create and run an Express.js app by cloning an Azure sample repository. 

1. At a terminal command prompt, go to the location where you want to create the app folder.

1. Use the following base command with git to clone the repository, change into the repository folder named `myexpressapp`, then install the npm dependencies. 

    ```bash
    git clone https://github.com/azure-samples/js-e2e-web-app-easy-auth.git myexpressapp && \
        cd myexpressapp && \
        npm install
    ```

1. Run the app with the following command: 

    ```bash
    npm start
    ```

1. Browse to your locally running app, `http://localhost:8080`.
1. In the same bash terminal, stop the running app with **Control + c**.

## Create an Azure app service

1. In VS Code, select **Azure** from the activity bar, then select **+** in the **Azure: App Service** side bar. 
1. Complete the prompts:

    |Prompt|Enter|
    |--|--|
    |Enter a globally unique name for the new web app.|The name is used as a subdomain for the web app's URI. |
    |Select a runtime stack.|Select the **most recent version of Node.js**, such as 14 LTS.|
    |Select a pricing tier|Select the **free** tier.|
    
1. Wait for the web app creation to complete. 
1. Select **Deploy** to deploy the sample Express.js app, when the notification pop-up displays. 
1. When the notification pop-up displays a link to the **output window**, select the link to watch the [zip deployment](/azure/app-service/deploy-zip.md).  
1. Select **Browse website** from the notification. 
    The web app may take a minute or two to return from the server for the first (cold) start.

1. When you receive the following response in the browser, the sample app is deployed and is responding correctly. 
    Authentication isn't configured yet. That is the next step. 

    :::image type="content" source="../../media/app-service-easy-authentication/easy-auth-expressjs-website.png" alt-text="Select **Browse website** from the notification. When you receive the following response in the browser, the sample app is deployed and is responding correctly. Authentication isn't configured yet. That is the next step.":::

## Configure easy auth for your app service

1. In VS Code, select **Azure** from the activity bar, then right-click your new web app from the **Azure: App Service** side bar. 
1. Select **Open in portal** to configure easy auth.
1. Select **Authentication** under the app's settings then select **Add identity provider**.

    :::image type="content" source="../../media/app-service-easy-authentication/app-service-add-identity-provider.png" alt-text="Select Authentication under the app's settings then select Add identity provider":::

1. In the next form, configure the following identity provider settings:

    |Setting|Value|
    |--|--|
    |Identity provider|Microsoft|
    |App registration type|Create new app registration|
    |Name|Keep the default name, which is the same as your app service.|
    |Supported account types|Select **Any Azure AD directory and personal Microsoft accounts**. This allows anyone within the Microsoft Identity provider to access your web app. Learn more about [these choices](/azure/active-directory/develop/single-and-multi-tenant-apps).|
    |Authentication|Require authentication - this means your app isn't publicly available.|
    |Unauthenticated requests|Keep the default value of 302 not found.|
    | Redirect to|Keep the default value.|
    |Token store|Keep the default value.|

    :::image type="content" source="../../media/app-service-easy-authentication/app-service-add-microsoft-identity-provider.png" alt-text="Configure Authentication for the Microsoft provider with a new app registration for any Azure AD Directory and personal account.":::

1. Select **Next** to view the permissions but do not make any changes. 
1. Select **Add** to finish the process. 

    When the process completes, you are in your app's identity provider list in the portal. 

1. Your app is now private. A user must sign in with a Microsoft Identity account. 

    The specific steps of the sign-in process depends on the user's tenant configuration. 

## Sign in with a different user account

Sign in with a **different user account** to simulate a new user to your web app and authorization.

1. In VS Code, select **Azure** from the activity bar, then right-click your new web app from the **Azure: App Service** side bar. 
1. Select **Browse website** to open your web app in a browser.

    If you can see your Azure website without logging in, your current browser session already has that account signed in. Open a private or incognito browser window with the same URL. Now you are asked to authenticate. 

1. Accept the permissions requested in the browser's consent pop-up window. 

    This means you are allowing the Azure app to view and read your user account information. It was the second tab of the authentication setup, named **Permissions**. 

    If you are required to continue with 2-factor authentication, such as using a phone to finish the process, complete those steps. 
1. After logging in, you should see the same website. 

## Clean up resources

In this procedure, you created an Azure app service and an Azure Active Directory app registration in just a few minutes. 

### Delete your Azure app registration

1. In the Azure portal, select [Azure Active Directory](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview).
1. Select **App registrations** then search for your app name. 
1. Select the app's **Properties**, then select **Delete**. 

## Delete your Azure web app

1. In VS Code, select **Azure** from the activity bar, then right-click your new web app from the **Azure: App Service** side bar. 
1. Right-click on your app then select **Delete...**.

## Next steps

* [Install and debug a local project](../with-visual-studio-code/install-run-debug-nodejs.md)
